/** 群聊输入区：接管默认 composer，发言走 /qunliao say（不触发主智能体）。 */
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { ComposerChainProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, IconNewChatOutline16, IconStopFill16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ChatConversationViewNode } from '@deepseek-ai/dsh-client-runtime/client'
import type { QunliaoSetupData, QunliaoStateData } from '@deepseek-ai/dsh-qunliao/types'
import css from './GroupComposer.module.css'

/** 注册侧的业务面：把一句话作为用户发言写入群聊并触发讨论/点名。 */
export interface GroupComposerInjected {
  /** 提交用户发言。 */
  say: (text: string) => Promise<void>
  /** 打断当前讨论（发送键在讨论中变为停止键）。 */
  stop: () => Promise<void>
}

/** 链式选择器的匹配载荷（非空即接管）。 */
export interface QunliaoComposerMatch {
  readonly kind: 'qunliao'
}

type GroupComposerProps =
  PropsRuntime<'conversation.composer'>
  & { matched: QunliaoComposerMatch }
  & PropsLocale<'qunliao'>
  & InjectFace<GroupComposerInjected>

/** 该会话是否为群聊（存在 qunliao-setup 隐藏节点）。 */
export function selectQunliaoComposer({ session }: ComposerChainProps): QunliaoComposerMatch | null {
  if (session === undefined) return null
  const nodes = session.chat.nodes.values()
  for (const node of nodes) {
    if (node.kind === 'qunliao-setup') return { kind: 'qunliao' }
  }
  return null
}

/** 从会话节点中读取群成员名单与讨论运行标记。 */
function groupFactsOf(nodes: readonly ChatConversationViewNode[]): {
  members: readonly { id: string; name: string; identity: string; emoji?: string }[]
  running: boolean
} {
  let members: readonly { id: string; name: string; identity: string; emoji?: string }[] = []
  let running = false
  for (const node of nodes) {
    if (node.kind === 'qunliao-setup') {
      const data = node.data as QunliaoSetupData
      members = data.members.map(({ id, name, identity, emoji }) => ({
        id,
        name,
        identity,
        ...(emoji === undefined ? {} : { emoji }),
      }))
    } else if (node.kind === 'qunliao-state') {
      const data = node.data as QunliaoStateData
      running = data.running
    }
  }
  return { members, running }
}

/** 讨论进行时找出光标前最近的 @ 提示位置。 */
function mentionAt(text: string, caret: number): { index: number; query: string } | null {
  const before = text.slice(0, caret)
  const lastAt = before.lastIndexOf('@')
  if (lastAt < 0) return null
  const token = before.slice(lastAt + 1)
  if (/\s/u.test(token)) return null
  return { index: lastAt, query: token }
}

/** 群聊输入区：@ 选人下拉 + 发送键（讨论中变为停止）。 */
export const GroupComposer = memo(function GroupComposer({
  say, stop, useSession, t,
}: GroupComposerProps) {
  const nodes = useSession(state => state.chat.nodes.values())
  const { members, running } = groupFactsOf(nodes)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [mention, setMention] = useState<{ index: number; query: string } | null>(null)
  const [mentionActive, setMentionActive] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const composingRef = useRef(false)

  const filtered = useMemo(() => {
    if (mention === null) return []
    const query = mention.query.trim()
    return members.filter(member =>
      query.length === 0
      || member.name.includes(query)
      || member.identity.includes(query))
  }, [mention, members])

  const refreshMention = useCallback((value: string, caret: number): void => {
    if (composingRef.current) return
    const next = mentionAt(value, caret)
    setMention(next)
    setMentionActive(0)
  }, [])

  const pickMember = useCallback((name: string): void => {
    setMention(current => {
      if (current === null) return current
      const next = text.slice(0, current.index) + '@' + name + ' ' + text.slice(current.index + 1 + current.query.length)
      setText(next)
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (el === null) return
        el.focus()
        const caret = current.index + 1 + name.length + 1
        el.setSelectionRange(caret, caret)
      })
      return null
    })
  }, [text])

  const submit = (): void => {
    const trimmed = text.trim()
    if (trimmed.length === 0 || busy) return
    setBusy(true)
    void say(trimmed).finally(() => {
      setBusy(false)
      setText('')
      setMention(null)
      textareaRef.current?.focus()
    })
  }

  const interrupt = (): void => {
    if (busy) return
    setBusy(true)
    void stop().finally(() => { setBusy(false) })
  }

  return (
    <div className={css.root} data-qunliao-composer="">
      {mention !== null && filtered.length > 0 && (
        <div className={css.mentionList} role="listbox" onMouseDown={(event) => { event.preventDefault() }}>
          {filtered.map((member, index) => (
            <button
              key={member.id}
              type="button"
              role="option"
              aria-selected={index === mentionActive}
              className={css.mentionItem}
              data-active={index === mentionActive ? '' : undefined}
              onMouseEnter={() => { setMentionActive(index) }}
              onClick={() => { pickMember(member.name) }}
            >
              <span className={css.mentionEmoji} aria-hidden="true">{member.emoji ?? '👤'}</span>
              <span className={css.mentionName}>{member.name}</span>
              <span className={css.mentionIdentity}>{member.identity}</span>
            </button>
          ))}
        </div>
      )}
      {mention !== null && filtered.length === 0 && (
        <div className={css.mentionList}>
          <div className={css.mentionEmpty}>{t('composer.mentionEmpty')}</div>
        </div>
      )}
      <textarea
        ref={textareaRef}
        className={css.input}
        rows={3}
        value={text}
        placeholder={t('composer.placeholder')}
        onChange={(event) => {
          const value = event.target.value
          setText(value)
          refreshMention(value, event.target.selectionStart ?? value.length)
        }}
        onKeyDown={(event) => {
          if (mention !== null && filtered.length > 0) {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setMentionActive(current => (current + 1) % filtered.length)
              return
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setMentionActive(current => (current - 1 + filtered.length) % filtered.length)
              return
            }
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              const member = filtered[mentionActive]
              if (member !== undefined) pickMember(member.name)
              return
            }
            if (event.key === 'Escape') {
              event.preventDefault()
              setMention(null)
              return
            }
          }
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
        onCompositionStart={() => { composingRef.current = true }}
        onCompositionEnd={(event) => {
          composingRef.current = false
          const value = event.currentTarget.value
          setText(value)
          refreshMention(value, event.currentTarget.selectionStart ?? value.length)
        }}
      />
      <div className={css.foot}>
        <span className={css.hint}>{t('composer.hint')}</span>
        {running ? (
          <Button
            variant="primary"
            size="sm"
            icon={<IconStopFill16 size={14} />}
            disabled={busy}
            onClick={interrupt}
          >
            {t('composer.stop')}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon={<IconNewChatOutline16 size={14} />}
            disabled={busy || text.trim().length === 0}
            onClick={submit}
          >
            {t('composer.send')}
          </Button>
        )}
      </div>
    </div>
  )
})
