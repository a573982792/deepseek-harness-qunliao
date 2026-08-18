/** 群聊 UI 的按会话状态存储：供讨论开关按钮与成员气泡读取。 */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
const IDLE = { isGroup: false, groupName: undefined, toggleOn: false, running: false };
/** 全局按会话状态快照（会话窗口打开时由事件定义写入）。 */
export const qunliaoStore = createSnapshotStore({ bySession: {} });
/** 读取某会话的群聊状态；非群聊会话返回空态。 */
export function qunliaoStateOf(sessionId) {
    return qunliaoStore.getSnapshot().bySession[sessionId] ?? IDLE;
}
/** 合并更新某会话的群聊状态（不变式：isGroup 一旦为 true 不再回退）。 */
export function updateQunliaoState(sessionId, patch) {
    qunliaoStore.update((state) => {
        const previous = state.bySession[sessionId] ?? IDLE;
        const next = {
            ...previous,
            ...patch,
            isGroup: previous.isGroup || patch.isGroup === true,
        };
        state.bySession = { ...state.bySession, [String(sessionId)]: next };
    });
}
//# sourceMappingURL=state.js.map