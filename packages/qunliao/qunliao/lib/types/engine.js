/**
 * 群聊讨论引擎：管理每个会话的群状态，组织成员按序/按 @ 发言，
 * 每人独立调用大模型，支持开关与打断。
 * @module @deepseek-ai/dsh-qunliao/engine
 */
import { randomUUID } from 'node:crypto';
import { BlockAssembler, createUserMessage } from '@deepseek-ai/dsh-llm';
const MENTION_RE = /@([^\s@，。,.!！?？:：、'"“”‘’]+)/gu;
/** 解析一段文本中的 @点名，返回去重后的成员（按出现顺序）。 */
export function parseMentions(text, members) {
    const seen = new Set();
    const result = [];
    for (const match of text.matchAll(MENTION_RE)) {
        const token = match[1]?.trim();
        if (token === undefined || token.length === 0)
            continue;
        const member = members.find(candidate => candidate.id === token || candidate.name === token);
        if (member !== undefined && !seen.has(member.id)) {
            seen.add(member.id);
            result.push(member);
        }
    }
    return result;
}
/** 校验建群入参，返回错误信息或 null。 */
export function validateCreateInput(input, config) {
    const name = input.name.trim();
    if (name.length === 0)
        return '群名不能为空';
    const members = input.members;
    if (members.length < config.minMembers)
        return `至少需要 ${config.minMembers} 位成员`;
    if (members.length > config.maxMembers)
        return `最多支持 ${config.maxMembers} 位成员`;
    const names = new Set();
    for (const member of members) {
        const memberName = member.name.trim();
        if (memberName.length === 0)
            return '成员名字不能为空';
        if (names.has(memberName))
            return `成员名字重复：${memberName}`;
        names.add(memberName);
        if (member.identity.trim().length === 0)
            return `成员「${memberName}」缺少身份设定`;
        if (member.provider.trim().length === 0)
            return `成员「${memberName}」缺少模型提供方`;
        if (member.model.trim().length === 0)
            return `成员「${memberName}」缺少模型`;
    }
    return null;
}
/** 从事件流还原某会话的群聊记录（用户发言 + 已完成成员发言）。 */
export function buildTranscript(session) {
    const result = [];
    for (const event of session.events) {
        if (event.type === 'user/message') {
            const text = textOfContent(event.data.content);
            if (text.length > 0)
                result.push({ kind: 'user', speakerName: '用户', text });
        }
        else if (event.type === 'qunliao/message') {
            result.push({ kind: 'member', speakerName: event.data.speakerName, text: event.data.text });
        }
    }
    return result;
}
/** 提取消息中的纯文本（仅 text 块）。 */
function textOfContent(content) {
    return content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
}
/** 群聊引擎：纯命令驱动，不依赖主智能体循环。 */
export class QunliaoEngine {
    ctx;
    config;
    speak;
    constructor(ctx, config, speaker) {
        this.ctx = ctx;
        this.config = config;
        this.speak = speaker ?? this.defaultSpeaker;
    }
    /** 运行期状态缓存：同一会话共享同一状态实例，保证打断与开关读写一致。 */
    states = new Map();
    /** 从会话事件流还原群状态（首次还原后缓存）；非群聊会话返回 undefined。 */
    hydrate(session) {
        const cached = this.states.get(session.id);
        if (cached !== undefined)
            return cached;
        let setup;
        let toggleOn = false;
        for (const event of session.events) {
            if (event.type === 'qunliao/setup')
                setup = event.data;
            else if (event.type === 'qunliao/state')
                toggleOn = event.data.toggleOn;
        }
        if (setup === undefined)
            return undefined;
        // 兼容 v2 旧群：setup 没有 rounds 时补插件默认值，避免 undefined 写入新事件。
        const normalized = {
            ...setup,
            rounds: setup.rounds ?? this.config.maxRounds,
        };
        const state = { setup: normalized, toggleOn, running: false, abort: null };
        this.states.set(session.id, state);
        return state;
    }
    /** 创建群聊：写入建群事件、欢迎消息与初始状态。 */
    create(session, input) {
        const invalid = validateCreateInput(input, this.config);
        if (invalid !== null)
            throw new Error(invalid);
        const members = input.members.map((member, index) => ({
            id: `m${index + 1}`,
            name: member.name.trim(),
            identity: member.identity.trim(),
            ...(member.emoji !== undefined && member.emoji.trim().length > 0 ? { emoji: member.emoji.trim() } : {}),
            provider: member.provider.trim(),
            model: member.model.trim(),
        }));
        const setup = {
            name: input.name.trim(),
            members,
            rounds: this.clampRounds(input.rounds),
            createdAt: Date.now(),
        };
        session.append('qunliao/setup', setup);
        this.appendMessage(session, {
            speakerId: 'system',
            speakerName: '系统',
        }, `群聊「${setup.name}」已创建，成员：${members.map(member => member.emoji !== undefined ? `${member.emoji}${member.name}` : member.name).join('、')}。你可以先发言，然后打开右上角讨论开关让成员开始讨论；或直接在发言里 @ 某位成员点名发言。`);
        session.append('qunliao/state', { toggleOn: false, running: false, updatedAt: Date.now() });
        return `群聊「${setup.name}」创建成功（${members.length} 位成员）`;
    }
    /** 用户发言：写入记录；开关开启则组织讨论，否则仅响应 @ 点名。 */
    async say(session, text) {
        const state = this.hydrate(session);
        if (state === undefined)
            throw new Error('该会话不是群聊：请先通过「新群聊」创建');
        const trimmed = text.trim();
        if (trimmed.length === 0)
            return '发言内容为空';
        const message = createUserMessage({
            content: [{ type: 'text', text: trimmed }],
            source: { kind: 'user' },
        });
        session.append('user/message', message, { surfaceOp: 'append' });
        if (state.toggleOn) {
            await this.runDiscussion(session, state, 'auto');
        }
        else if (parseMentions(trimmed, state.setup.members).length > 0) {
            // 本人最大：点名发言优先于正在进行的讨论，先打断再让被 @ 的人说。
            if (state.running) {
                state.abort?.abort(new Error('用户点名打断'));
                await this.waitIdle(state);
            }
            await this.runDiscussion(session, state, 'mentioned');
        }
        return '已记录';
    }
    /** 切换讨论开关：开→组织讨论（未在讨论中时）；关→打断当前讨论。 */
    async setToggle(session, on) {
        const state = this.hydrate(session);
        if (state === undefined)
            throw new Error('该会话不是群聊：请先通过「新群聊」创建');
        if (on === state.toggleOn && state.running === on) {
            return on ? '讨论开关已开启' : '讨论开关已关闭';
        }
        if (!on && state.running) {
            state.toggleOn = false;
            session.append('qunliao/state', { toggleOn: false, running: true, updatedAt: Date.now() });
            state.abort?.abort(new Error('讨论被用户打断'));
            return '已打断讨论';
        }
        state.toggleOn = on;
        session.append('qunliao/state', { toggleOn: on, running: false, updatedAt: Date.now() });
        if (on && this.lastUserSeq(session) !== undefined) {
            await this.runDiscussion(session, state, 'auto');
        }
        return on ? '讨论开关已开启' : '讨论开关已关闭';
    }
    /** 中途加人：校验后追加新成员并写入新的建群快照；@选人与讨论队列自动包含新成员。 */
    addMembers(session, additions) {
        const state = this.hydrate(session);
        if (state === undefined)
            throw new Error('该会话不是群聊：请先通过「新群聊」创建');
        if (additions.length === 0)
            throw new Error('没有要添加的成员');
        const existingNames = new Set(state.setup.members.map(member => member.name));
        const nextIdBase = state.setup.members.reduce((max, member) => {
            const match = /^m(\d+)$/u.exec(member.id);
            const num = match === null ? 0 : Number(match[1]);
            return num > max ? num : max;
        }, 0);
        const created = [];
        for (let index = 0; index < additions.length; index += 1) {
            const raw = additions[index];
            if (raw === undefined)
                continue;
            const name = raw.name.trim();
            const identity = raw.identity.trim();
            const provider = raw.provider.trim();
            const model = raw.model.trim();
            if (name.length === 0)
                throw new Error('成员名字不能为空');
            if (existingNames.has(name))
                throw new Error(`成员名字重复：${name}`);
            existingNames.add(name);
            if (identity.length === 0)
                throw new Error(`成员「${name}」缺少身份设定`);
            if (provider.length === 0)
                throw new Error(`成员「${name}」缺少模型提供方`);
            if (model.length === 0)
                throw new Error(`成员「${name}」缺少模型`);
            created.push({
                id: `m${nextIdBase + index + 1}`,
                name,
                identity,
                ...(raw.emoji !== undefined && raw.emoji.trim().length > 0 ? { emoji: raw.emoji.trim() } : {}),
                provider,
                model,
            });
        }
        if (state.setup.members.length + created.length > this.config.maxMembers) {
            throw new Error(`最多支持 ${this.config.maxMembers} 位成员`);
        }
        const members = [...state.setup.members, ...created];
        const setup = {
            name: state.setup.name,
            members,
            rounds: state.setup.rounds,
            createdAt: state.setup.createdAt,
        };
        session.append('qunliao/setup', setup);
        state.setup = setup;
        this.appendMessage(session, { speakerId: 'system', speakerName: '系统' }, `${created.map(member => member.emoji !== undefined ? `${member.emoji}${member.name}` : member.name).join('、')} 加入群聊「${setup.name}」。`);
        return `已添加 ${created.length} 位成员：${created.map(member => member.name).join('、')}`;
    }
    /** 修改讨论轮数：写入新的建群快照，下次开启讨论时生效。 */
    setRounds(session, rounds) {
        const state = this.hydrate(session);
        if (state === undefined)
            throw new Error('该会话不是群聊：请先通过「新群聊」创建');
        const clamped = this.clampRounds(rounds);
        if (clamped === state.setup.rounds)
            return `讨论轮数仍为 ${clamped} 轮`;
        const setup = {
            name: state.setup.name,
            members: state.setup.members,
            rounds: clamped,
            createdAt: state.setup.createdAt,
        };
        session.append('qunliao/setup', setup);
        state.setup = setup;
        return `讨论轮数已改为 ${clamped} 轮`;
    }
    /** 校验并归一化轮数（1-10，非法值报错）。 */
    clampRounds(rounds) {
        if (rounds === undefined)
            return this.config.maxRounds;
        if (!Number.isInteger(rounds) || rounds < 1 || rounds > 10) {
            throw new Error('讨论轮数需为 1-10 的整数');
        }
        return rounds;
    }
    /** 让某位成员长期闭嘴/解除闭嘴：静音后不参与自动讨论，被 @ 也不发言。 */
    muteMember(session, target, muted) {
        const state = this.hydrate(session);
        if (state === undefined)
            throw new Error('该会话不是群聊：请先通过「新群聊」创建');
        const member = state.setup.members.find(candidate => candidate.id === target || candidate.name === target);
        if (member === undefined)
            throw new Error(`找不到成员：${target}`);
        const members = state.setup.members.map(candidate => candidate.id === member.id ? { ...candidate, muted } : candidate);
        const setup = {
            name: state.setup.name,
            members,
            rounds: state.setup.rounds,
            createdAt: state.setup.createdAt,
        };
        session.append('qunliao/setup', setup);
        state.setup = setup;
        return muted ? `已让 ${member.name} 闭嘴，自动讨论和 @ 都不会再发言` : `已解除 ${member.name} 的闭嘴`;
    }
    /** 等待正在进行的讨论结束（打断后由 runDiscussion 的 finally 收尾）。 */
    async waitIdle(state) {
        while (state.running) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    /** 当前状态文本（/qunliao state 调试用）。 */
    stateText(session) {
        const state = this.hydrate(session);
        if (state === undefined)
            return '该会话不是群聊';
        const lines = [
            `群名：${state.setup.name}`,
            `成员：${state.setup.members.map(member => member.name).join('、')}`,
            `讨论轮数：${state.setup.rounds}`,
            `开关：${state.toggleOn ? '开启' : '关闭'}${state.running ? '（讨论中）' : ''}`,
        ];
        return lines.join('\n');
    }
    lastUserSeq(session) {
        for (let index = session.events.length - 1; index >= 0; index -= 1) {
            const event = session.events[index];
            if (event !== undefined && event.type === 'user/message')
                return event.seq;
        }
        return undefined;
    }
    /**
     * 组织一轮或多轮讨论。
     * @param mode - `auto`：@目标优先、随后全员按序、最多 maxRounds 轮；`mentioned`：仅 @ 目标发言（含链式 @）。
     */
    async runDiscussion(session, state, mode) {
        if (state.running)
            return;
        state.running = true;
        state.abort = new AbortController();
        this.appendState(session, state);
        const members = state.setup.members;
        const maxRounds = mode === 'mentioned' ? 1 : state.setup.rounds;
        try {
            let queue;
            if (mode === 'mentioned') {
                const last = this.lastUserSeq(session);
                const text = last === undefined ? '' : this.userTextBySeq(session, last);
                queue = text === '' ? [] : parseMentions(text, members).filter(member => !member.muted);
            }
            else {
                queue = members.filter(member => !member.muted);
            }
            let spoken = new Set();
            let round = 0;
            while (round < maxRounds && queue.length > 0 && !state.abort.signal.aborted) {
                const speaker = queue.shift();
                if (speaker === undefined)
                    continue;
                if (spoken.has(speaker.id))
                    continue;
                let reply;
                try {
                    reply = await this.speak(this.ctx, session, speaker, round + 1, state.abort.signal);
                }
                catch (error) {
                    if (state.abort.signal.aborted)
                        break;
                    this.appendError(session, `${speaker.name} 发言失败：${error instanceof Error ? error.message : String(error)}`);
                    spoken.add(speaker.id);
                    continue;
                }
                if (state.abort.signal.aborted)
                    break;
                this.appendMessage(session, { speakerId: speaker.id, speakerName: speaker.name, ...(speaker.emoji !== undefined ? { emoji: speaker.emoji } : {}) }, reply, round + 1);
                spoken.add(speaker.id);
                const mentioned = parseMentions(reply, members)
                    .filter(member => member.id !== speaker.id && !spoken.has(member.id) && !member.muted);
                if (mentioned.length > 0) {
                    queue = queue.filter(candidate => !mentioned.some(member => member.id === candidate.id));
                    queue.unshift(...mentioned);
                }
                if (queue.length === 0) {
                    round += 1;
                    if (round < maxRounds) {
                        spoken = new Set();
                        queue = [...members];
                    }
                }
            }
        }
        finally {
            state.running = false;
            state.abort = null;
            this.appendState(session, state);
        }
    }
    userTextBySeq(session, seq) {
        for (const event of session.events) {
            if (event.type === 'user/message' && event.seq === seq)
                return textOfContent(event.data.content);
        }
        return '';
    }
    appendState(session, state) {
        const data = { toggleOn: state.toggleOn, running: state.running, updatedAt: Date.now() };
        session.append('qunliao/state', data);
    }
    appendMessage(session, speaker, text, turn = 1) {
        const messageId = randomUUID();
        const start = {
            messageId,
            speakerId: speaker.speakerId,
            speakerName: speaker.speakerName,
            ...(speaker.emoji !== undefined ? { emoji: speaker.emoji } : {}),
            turn,
        };
        const done = {
            messageId,
            speakerId: speaker.speakerId,
            speakerName: speaker.speakerName,
            ...(speaker.emoji !== undefined ? { emoji: speaker.emoji } : {}),
            text,
            turn,
        };
        session.append('qunliao/message-start', start);
        session.append('qunliao/message', done);
    }
    appendError(session, text) {
        const data = { text };
        session.append('qunliao/error', data);
    }
    /** 默认发言实现：用成员自己的 provider/model 直接调用大模型。 */
    async defaultSpeaker(ctx, session, member, round, signal) {
        const transcript = buildTranscript(session).slice(-this.config.historyLimit);
        const system = [
            `你是「${member.name}」，正在一个群聊里。你的身份设定：${member.identity}`,
            '规则：直接以该身份发言，不要自我介绍；不要给自己加任何名字前缀或引号；需要别人回应时用 @名字 点名；发言控制在两三百字以内，口语化、观点鲜明。',
        ].join('\n');
        const transcriptText = transcript.length === 0
            ? '（还没有任何发言）'
            : transcript.map(entry => entry.kind === 'user'
                ? `用户：${entry.text}`
                : `${entry.speakerName}：${entry.text}`).join('\n\n');
        const instruction = `这是群聊第 ${round} 轮讨论。以下是群聊记录：\n\n${transcriptText}\n\n现在轮到你发言。`;
        const options = {
            provider: member.provider,
            model: member.model,
            system,
            messages: [createUserMessage({
                    content: [{ type: 'text', text: instruction }],
                    source: { kind: 'plugin', plugin: 'dsh-qunliao' },
                })],
            maxTokens: this.config.maxTokens,
            sessionId: session.id,
            ...(signal === undefined ? {} : { signal }),
        };
        const assembler = new BlockAssembler();
        for await (const chunk of ctx.llm.stream(options))
            assembler.push(chunk);
        const error = finishError(assembler.finish);
        if (error !== undefined)
            throw error;
        const text = textOfContent(assembler.blocks()).trim();
        if (text.length === 0)
            throw new Error('模型未返回有效内容');
        return text;
    }
}
/** 把模型终态映射为失败错误；正常结束返回 undefined。 */
function finishError(finish) {
    switch (finish.kind) {
        case 'error':
        case 'aborted': {
            const error = new Error(finish.failure.message);
            error.code = finish.failure.code;
            return error;
        }
        case 'max-tokens': {
            const error = new Error('发言超过输出上限（不完整）');
            error.code = 'MAX_TOKENS';
            return error;
        }
        default:
            return undefined;
    }
}
//# sourceMappingURL=engine.js.map