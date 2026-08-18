/** 群聊事件 → 聊天节点/状态的会话侧定义。 */
import type { SessionEvent } from '@deepseek-ai/dsh-session/types'
import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-runtime/client'
import type {
  QunliaoSetupData, QunliaoStateData,
} from '@deepseek-ai/dsh-qunliao/types'

/** 一位成员发言的渲染载荷。 */
export interface QunliaoMemberMessageData {
  readonly messageId: string
  readonly speakerId: string
  readonly speakerName: string
  readonly emoji?: string
  readonly text: string
  readonly turn: number
  readonly time: number
}

declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
  interface ChatNodeDataMap {
    /** 群聊成员发言气泡。 */
    'qunliao-member': QunliaoMemberMessageData
    /** 隐藏状态节点：标记该会话为群聊并携带群名。 */
    'qunliao-setup': QunliaoSetupData
    /** 隐藏状态节点：讨论开关与运行标记。 */
    'qunliao-state': QunliaoStateData
  }
}

interface MemberMessageState extends QunliaoMemberMessageData {
  readonly seq: number
}

/** 成员发言定义：每个 qunliao/message 渲染为一个成员气泡。 */
export const qunliaoMemberDefinition: ConversationNodeDefinition<MemberMessageState> = {
  kind: 'qunliao-member',
  target: 'chat',
  match: event => event.type === 'qunliao/message'
    ? { id: String(event.data.messageId), role: 'start' }
    : null,
  start: (_context, match) => {
    if (match.event.type !== 'qunliao/message') {
      throw new Error('qunliao-member start requires qunliao/message')
    }
    const { messageId, speakerId, speakerName, emoji, text, turn } = match.event.data
    return {
      messageId,
      speakerId,
      speakerName,
      ...(emoji === undefined ? {} : { emoji }),
      text,
      turn,
      time: match.event.time,
      seq: match.event.seq,
    }
  },
  update: context => context.state,
  buildViewNode: (context) => {
    if (context.state === undefined) return null
    const { seq, ...data } = context.state
    return {
      key: context.key,
      kind: 'qunliao-member',
      id: context.id,
      target: 'chat',
      anchorSeq: seq - 0.1,
      location: context.start?.location ?? { kind: 'unresolved' },
      visibility: 'visible',
      data,
    }
  },
}

/** 建群定义：隐藏状态节点，标记该会话为群聊（供讨论开关按钮显示）。 */
export const qunliaoSetupDefinition: ConversationNodeDefinition<QunliaoSetupData> = {
  kind: 'qunliao-setup',
  target: 'chat',
  match: event => event.type === 'qunliao/setup'
    ? { id: `setup-${event.seq}`, role: 'start' }
    : null,
  start: (_context, match) => {
    if (match.event.type !== 'qunliao/setup') throw new Error('qunliao-setup start requires qunliao/setup')
    return match.event.data
  },
  update: context => context.state,
  buildViewNode: (context) => {
    if (context.state === undefined) return null
    return {
      key: context.key,
      kind: 'qunliao-setup',
      id: context.id,
      target: 'chat',
      anchorSeq: context.start?.event.seq === undefined ? 0 : context.start.event.seq - 0.1,
      location: context.start?.location ?? { kind: 'unresolved' },
      visibility: 'hidden',
      data: context.state,
    }
  },
}

/** 开关状态定义：隐藏状态节点，供讨论开关按钮读取开关与运行标记。 */
export const qunliaoStateDefinition: ConversationNodeDefinition<QunliaoStateData> = {
  kind: 'qunliao-state',
  target: 'chat',
  match: event => event.type === 'qunliao/state'
    ? { id: `state-${event.seq}`, role: 'start' }
    : null,
  start: (_context, match) => {
    if (match.event.type !== 'qunliao/state') throw new Error('qunliao-state start requires qunliao/state')
    return match.event.data
  },
  update: context => context.state,
  buildViewNode: (context) => {
    if (context.state === undefined) return null
    return {
      key: context.key,
      kind: 'qunliao-state',
      id: context.id,
      target: 'chat',
      anchorSeq: context.start?.event.seq === undefined ? 0 : context.start.event.seq - 0.1,
      location: context.start?.location ?? { kind: 'unresolved' },
      visibility: 'hidden',
      data: context.state,
    }
  },
}

/** 供类型测试使用的事件类型别名。 */
export type { SessionEvent }
