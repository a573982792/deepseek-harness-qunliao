/** 成员发言定义：每个 qunliao/message 渲染为一个成员气泡。 */
export const qunliaoMemberDefinition = {
    kind: 'qunliao-member',
    target: 'chat',
    match: event => event.type === 'qunliao/message'
        ? { id: String(event.data.messageId), role: 'start' }
        : null,
    start: (_context, match) => {
        if (match.event.type !== 'qunliao/message') {
            throw new Error('qunliao-member start requires qunliao/message');
        }
        const { messageId, speakerId, speakerName, emoji, text, turn } = match.event.data;
        return {
            messageId,
            speakerId,
            speakerName,
            ...(emoji === undefined ? {} : { emoji }),
            text,
            turn,
            time: match.event.time,
            seq: match.event.seq,
        };
    },
    update: context => context.state,
    buildViewNode: (context) => {
        if (context.state === undefined)
            return null;
        const { seq, ...data } = context.state;
        return {
            key: context.key,
            kind: 'qunliao-member',
            id: context.id,
            target: 'chat',
            anchorSeq: seq - 0.1,
            location: context.start?.location ?? { kind: 'unresolved' },
            visibility: 'visible',
            data,
        };
    },
};
/** 建群定义：隐藏状态节点，标记该会话为群聊（供讨论开关按钮显示）。 */
export const qunliaoSetupDefinition = {
    kind: 'qunliao-setup',
    target: 'chat',
    match: event => event.type === 'qunliao/setup'
        ? { id: `setup-${event.seq}`, role: 'start' }
        : null,
    start: (_context, match) => {
        if (match.event.type !== 'qunliao/setup')
            throw new Error('qunliao-setup start requires qunliao/setup');
        return match.event.data;
    },
    update: context => context.state,
    buildViewNode: (context) => {
        if (context.state === undefined)
            return null;
        return {
            key: context.key,
            kind: 'qunliao-setup',
            id: context.id,
            target: 'chat',
            anchorSeq: context.start?.event.seq === undefined ? 0 : context.start.event.seq - 0.1,
            location: context.start?.location ?? { kind: 'unresolved' },
            visibility: 'hidden',
            data: context.state,
        };
    },
};
/** 开关状态定义：隐藏状态节点，供讨论开关按钮读取开关与运行标记。 */
export const qunliaoStateDefinition = {
    kind: 'qunliao-state',
    target: 'chat',
    match: event => event.type === 'qunliao/state'
        ? { id: `state-${event.seq}`, role: 'start' }
        : null,
    start: (_context, match) => {
        if (match.event.type !== 'qunliao/state')
            throw new Error('qunliao-state start requires qunliao/state');
        return match.event.data;
    },
    update: context => context.state,
    buildViewNode: (context) => {
        if (context.state === undefined)
            return null;
        return {
            key: context.key,
            kind: 'qunliao-state',
            id: context.id,
            target: 'chat',
            anchorSeq: context.start?.event.seq === undefined ? 0 : context.start.event.seq - 0.1,
            location: context.start?.location ?? { kind: 'unresolved' },
            visibility: 'hidden',
            data: context.state,
        };
    },
};
//# sourceMappingURL=definitions.js.map