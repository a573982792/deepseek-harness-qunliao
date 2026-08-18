import { MemberMessage } from "./MemberMessage.js";
import { GroupToggleButton } from "./GroupToggleButton.js";
import { GroupManageButton } from "./GroupManageButton.js";
import { GroupComposer, selectQunliaoComposer } from "./GroupComposer.js";
import { NewGroupChatEntry } from "./NewGroupChat.js";
import { qunliaoMemberDefinition, qunliaoSetupDefinition, qunliaoStateDefinition, } from "./definitions.js";
import { en, zh } from "./locales.js";
/** 词典命名空间。 */
const NS = 'qunliao';
/** 所需服务。 */
export const inject = ['slots', 'locale', 'sessions', 'connection', 'conversationEvents'];
/** 等待会话绑定就绪（最多 5 秒）。 */
async function waitForSession(ctx, sessionId, timeoutMs = 5000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (ctx.sessions.binding(sessionId)?.session !== undefined)
            return true;
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return false;
}
/** 对某会话执行一条 /qunliao 命令，返回结果文本。 */
async function runQunliaoCommand(ctx, sessionId, line) {
    if (!(await waitForSession(ctx, sessionId))) {
        return { ok: false, text: '会话尚未就绪' };
    }
    const session = ctx.sessions.binding(sessionId)?.session;
    if (session === undefined)
        return { ok: false, text: '会话尚未就绪' };
    const result = await session.command(line);
    if (!result.ok)
        return { ok: false, text: `${result.error.code}: ${result.error.message}` };
    return { ok: true, text: result.value.matched ? 'ok' : '命令未被识别' };
}
/**
 * 安装群聊表面。
 * @param ctx - 浏览器插件上下文。
 */
export function apply(ctx) {
    ctx.conversationEvents.register(qunliaoMemberDefinition);
    ctx.conversationEvents.register(qunliaoSetupDefinition);
    ctx.conversationEvents.register(qunliaoStateDefinition);
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'qunliao-ui: dictionaries');
    // 成员发言气泡。
    ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
        name: 'conversation.chat.node',
        key: 'qunliao-member',
        locale: NS,
    }, MemberMessage));
    // 群聊会话的输入区接管：发言走 /qunliao say。
    ctx.slots.inject('conversation.composer', () => ctx.slots.register({
        name: 'conversation.composer',
        select: selectQunliaoComposer,
        priority: -20,
        locale: NS,
        inject: (sessionId) => ({
            say: async (text) => {
                await runQunliaoCommand(ctx, sessionId, `/qunliao say ${text}`);
            },
            stop: async () => {
                await runQunliaoCommand(ctx, sessionId, '/qunliao toggle off');
            },
        }),
    }, GroupComposer));
    // 会话头部讨论开关。
    ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
        name: 'conversation.session.header.actions',
        id: 'qunliao-toggle',
        order: 20,
        locale: NS,
        inject: (sessionId) => ({
            toggle: async (on) => {
                await runQunliaoCommand(ctx, sessionId, `/qunliao toggle ${on ? 'on' : 'off'}`);
            },
        }),
    }, GroupToggleButton));
    // 会话头部群管理：添加成员 + 讨论轮数。
    ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
        name: 'conversation.session.header.actions',
        id: 'qunliao-manage',
        order: 30,
        locale: NS,
        inject: (sessionId) => {
            const api = ctx.get('connection').api;
            return {
                api,
                sessionId,
                addMember: async (member) => {
                    const result = await runQunliaoCommand(ctx, sessionId, `/qunliao add ${JSON.stringify(member)}`);
                    return result.text;
                },
                setRounds: async (rounds) => {
                    const result = await runQunliaoCommand(ctx, sessionId, `/qunliao rounds ${rounds}`);
                    return result.text;
                },
                setMuted: async (memberId, muted) => {
                    const result = await runQunliaoCommand(ctx, sessionId, `/qunliao mute ${memberId} ${muted ? 'on' : 'off'}`);
                    return result.text;
                },
            };
        },
    }, GroupManageButton));
    // 侧边栏「新会话」下方的「新群聊」入口。
    ctx.slots.inject('sidebar.newSession.action', () => ctx.slots.register({
        name: 'sidebar.newSession.action',
        id: 'qunliao',
        order: 0,
        locale: NS,
        inject: () => ({
            begin: async () => {
                const api = ctx.get('connection').api;
                try {
                    // 与「新会话」一致：把群聊会话挂到当前（或最近）工作区下，
                    // 否则会话不归属任何工作区，刷新后会在侧边栏消失。
                    const workspaces = ctx.get('workspaces');
                    const workspaceSnapshot = workspaces.list.getSnapshot();
                    const currentSession = ctx.sessions.list.getSnapshot().current;
                    const currentWorkspace = currentSession === undefined
                        ? undefined
                        : workspaceSnapshot.items.find(item => item.sessionIds.includes(currentSession))?.workspaceId;
                    const workspaceId = currentWorkspace ?? workspaceSnapshot.recentWorkspaceId;
                    const response = await api.sessions.create({
                        ...(workspaceId === undefined ? {} : { workspaceId }),
                    });
                    if (!response.result.ok)
                        return null;
                    const sessionId = response.result.value.sessionId;
                    ctx.sessions.open(sessionId);
                    return { sessionId, api };
                }
                catch (reason) {
                    console.warn('qunliao: create session failed', reason);
                    return null;
                }
            },
            submit: async (sessionId, payload) => {
                const result = await runQunliaoCommand(ctx, sessionId, `/qunliao create ${JSON.stringify(payload)}`);
                if (!result.ok)
                    return result.text;
                const session = ctx.sessions.binding(sessionId)?.session;
                if (session !== undefined) {
                    await session.rename(payload.name);
                }
                return '群聊创建成功';
            },
        }),
    }, NewGroupChatEntry));
}
//# sourceMappingURL=index.js.map