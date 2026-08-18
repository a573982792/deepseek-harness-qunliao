/** Package-owned durable qunliao event-shape invariants. @module @deepseek-ai/dsh-qunliao/invariant */
const PACKAGE_NAME = '@deepseek-ai/dsh-qunliao';
/** Cordis companion plugin name. */
export const name = 'qunliao-invariant';
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants'];
/** 校验 qunliao 事件的载荷形状；无关事件忽略。 */
function validateEvent(event, fail) {
    switch (event.type) {
        case 'qunliao/setup': {
            const { name, members } = event.data;
            if (typeof name !== 'string' || name.trim().length === 0)
                fail('qunliao/setup name must be non-empty');
            if (!Array.isArray(members) || members.length === 0)
                fail('qunliao/setup members must be a non-empty array');
            break;
        }
        case 'qunliao/state': {
            const { toggleOn, running } = event.data;
            if (typeof toggleOn !== 'boolean' || typeof running !== 'boolean') {
                fail('qunliao/state toggleOn/running must be booleans');
            }
            break;
        }
        case 'qunliao/message-start':
        case 'qunliao/message': {
            const { messageId, speakerName } = event.data;
            if (typeof messageId !== 'string' || messageId.length === 0)
                fail(`${event.type} messageId must be non-empty`);
            if (typeof speakerName !== 'string' || speakerName.length === 0)
                fail(`${event.type} speakerName must be non-empty`);
            break;
        }
        case 'qunliao/error': {
            const { text } = event.data;
            if (typeof text !== 'string' || text.length === 0)
                fail('qunliao/error text must be non-empty');
            break;
        }
        default:
            break;
    }
}
/** 安装校验：存量会话事件 + 新追加事件。 */
const install = Object.assign((ctx, fail) => {
    for (const session of ctx.sessions.list()) {
        for (const event of session.events)
            validateEvent(event, fail);
    }
    ctx.on('internal/dispatch', (_mode, eventName, args) => {
        if (eventName !== 'session/event')
            return;
        const event = args[1];
        validateEvent(event, fail);
    }, { global: true });
}, { inject: ['sessions'] });
/** 注册 qunliao 不变式伴生插件。 */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//# sourceMappingURL=invariant.js.map