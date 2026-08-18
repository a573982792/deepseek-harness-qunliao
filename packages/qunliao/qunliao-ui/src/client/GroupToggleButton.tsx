/** 群聊讨论开关：会话头部按钮，点击开启成员讨论；打断交由发送键。 */
import { memo, useState } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, IconSparkle16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ChatConversationViewNode } from '@deepseek-ai/dsh-client-runtime/client'
import type { QunliaoSetupData, QunliaoStateData } from '@deepseek-ai/dsh-qunliao/types'
import css from './GroupToggleButton.module.css'

/** 注册侧的业务面：开启讨论（关闭/打断通过发送键）。 */
export interface GroupToggleInjected {
  /** 开启讨论（进入自动轮番）。 */
  toggle: (on: boolean) => Promise<void>
}

type GroupToggleProps =
  PropsRuntime<'conversation.session.header.actions'>
  & PropsLocale<'qunliao'>
  & InjectFace<GroupToggleInjected>

/** 从会话的隐藏状态节点推导开关与运行标记。 */
function stateNodesOf(nodes: readonly ChatConversationViewNode[]): {
  isGroup: boolean
  toggleOn: boolean
  running: boolean
} {
  let isGroup = false
  let toggleOn = false
  let running = false
  for (const node of nodes) {
    if (node.kind === 'qunliao-setup') {
      isGroup = true
      void (node.data as QunliaoSetupData)
    } else if (node.kind === 'qunliao-state') {
      const data = node.data as QunliaoStateData
      toggleOn = data.toggleOn
      running = data.running
    }
  }
  return { isGroup, toggleOn, running }
}

/** 渲染讨论开关按钮；非群聊会话返回空。点一下开启，再点一下关闭/打断。 */
export const GroupToggleButton = memo(function GroupToggleButton({
  useSession, toggle, t,
}: GroupToggleProps) {
  const nodes = useSession(state => state.chat.nodes.values())
  const { isGroup, toggleOn, running } = stateNodesOf(nodes)
  const [busy, setBusy] = useState(false)
  if (!isGroup) return null
  const active = toggleOn || running
  const label = active ? t('toggle.on') : t('toggle.off')
  return (
    <Button
      className={css.button}
      variant="toolbar"
      size="sm"
      icon={<IconSparkle16 className={active ? css.lit : undefined} />}
      title={t('toggle.tooltip')}
      disabled={busy}
      onClick={() => {
        setBusy(true)
        void toggle(!active).finally(() => { setBusy(false) })
      }}
    >
      <span className={css.label}>{label}</span>
    </Button>
  )
})
