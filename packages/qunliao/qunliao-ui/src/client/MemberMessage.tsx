/** 群聊成员发言气泡：头像、名字与正文。 */
import { memo } from 'react'
import { MessageText } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { QunliaoMemberMessageData } from './definitions.ts'
import css from './MemberMessage.module.css'

type MemberMessageProps =
  PropsRuntime<'conversation.chat.node', 'qunliao-member'>
  & PropsLocale<'qunliao'>

/** 渲染一位群成员的发言。系统消息（speakerId === 'system'）居中显示为提示条。 */
export const MemberMessage = memo(function MemberMessage({
  node,
}: MemberMessageProps) {
  const data: QunliaoMemberMessageData = node.data
  if (data.speakerId === 'system') {
    return (
      <div className={css.systemRow} data-qunliao-system="">
        <span className={css.systemBubble}>{data.text}</span>
      </div>
    )
  }
  return (
    <div className={css.row} data-qunliao-member="">
      <div className={css.avatar} aria-hidden="true">
        {data.emoji ?? '🤖'}
      </div>
      <div className={css.stack}>
        <div className={css.meta}>
          <span className={css.name}>{data.speakerName}</span>
          {data.turn > 0 && <span className={css.turn}>第 {data.turn} 轮</span>}
        </div>
        <div className={css.bubble}>
          <MessageText text={data.text} />
        </div>
      </div>
    </div>
  )
})
