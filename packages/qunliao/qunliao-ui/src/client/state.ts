/** 群聊 UI 的按会话状态存储：供讨论开关按钮与成员气泡读取。 */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'

/** 一个会话的群聊 UI 状态（从会话事件流推导）。 */
export interface QunliaoChatState {
  /** 该会话是否为群聊。 */
  readonly isGroup: boolean
  /** 群名（建群事件写入）。 */
  readonly groupName: string | undefined
  /** 讨论开关。 */
  readonly toggleOn: boolean
  /** 是否正在组织成员发言。 */
  readonly running: boolean
}

export interface QunliaoUiState {
  readonly bySession: Readonly<Record<string, QunliaoChatState>>
}

const IDLE: QunliaoChatState = { isGroup: false, groupName: undefined, toggleOn: false, running: false }

/** 全局按会话状态快照（会话窗口打开时由事件定义写入）。 */
export const qunliaoStore = createSnapshotStore<QunliaoUiState>({ bySession: {} })

/** 读取某会话的群聊状态；非群聊会话返回空态。 */
export function qunliaoStateOf(sessionId: SessionId): QunliaoChatState {
  return qunliaoStore.getSnapshot().bySession[sessionId] ?? IDLE
}

/** 合并更新某会话的群聊状态（不变式：isGroup 一旦为 true 不再回退）。 */
export function updateQunliaoState(sessionId: SessionId, patch: Partial<QunliaoChatState>): void {
  qunliaoStore.update((state) => {
    const previous = state.bySession[sessionId] ?? IDLE
    const next: QunliaoChatState = {
      ...previous,
      ...patch,
      isGroup: previous.isGroup || patch.isGroup === true,
    }
    state.bySession = { ...state.bySession, [String(sessionId)]: next }
  })
}
