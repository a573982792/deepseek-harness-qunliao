/** 群管理按钮组：查看成员并添加新成员 + 修改讨论轮数。 */
import { memo, useEffect, useState } from 'react'
import type { IApiClient, ModelProviderGroup, SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, Input, Modal, IconUserOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ChatConversationViewNode } from '@deepseek-ai/dsh-client-runtime/client'
import type { QunliaoSetupData } from '@deepseek-ai/dsh-qunliao/types'
import css from './GroupManageButton.module.css'

/** 注册侧的业务面（sessionId 由注册处绑定）。 */
export interface GroupManageInjected {
  /** 添加一位成员（/qunliao add）。 */
  addMember: (member: {
    name: string
    identity: string
    emoji?: string
    provider: string
    model: string
  }) => Promise<string>
  /** 修改讨论轮数（/qunliao rounds）。 */
  setRounds: (rounds: number) => Promise<string>
  /** 让某位成员闭嘴/解除（/qunliao mute）。 */
  setMuted: (memberId: string, muted: boolean) => Promise<string>
  /** 会话 API 句柄（模型列表）。 */
  api: IApiClient
  /** 会话 id（模型列表查询用）。 */
  sessionId: SessionId
}

type GroupManageProps =
  PropsRuntime<'conversation.session.header.actions'>
  & PropsLocale<'qunliao'>
  & InjectFace<GroupManageInjected>

/** 从会话节点读取最新建群快照。 */
function setupOf(nodes: readonly ChatConversationViewNode[]): QunliaoSetupData | undefined {
  let setup: QunliaoSetupData | undefined
  for (const node of nodes) {
    if (node.kind === 'qunliao-setup') setup = node.data as QunliaoSetupData
  }
  return setup
}

interface MemberDraft {
  name: string
  identity: string
  emoji: string
  provider: string
  model: string
}

/** 会话头部：成员管理 + 轮数按钮；非群聊会话返回空。 */
export const GroupManageButton = memo(function GroupManageButton({
  useSession, addMember, setRounds, setMuted, api, sessionId, t,
}: GroupManageProps) {
  const nodes = useSession(state => state.chat.nodes.values())
  const setup = setupOf(nodes)
  const [memberOpen, setMemberOpen] = useState(false)
  const [roundsOpen, setRoundsOpen] = useState(false)
  const [draft, setDraft] = useState<MemberDraft>({ name: '', identity: '', emoji: '', provider: '', model: '' })
  const [roundsText, setRoundsText] = useState('')
  const [providers, setProviders] = useState<readonly ModelProviderGroup[]>([])
  const [modelsStatus, setModelsStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // 打开成员弹窗时加载模型列表。
  useEffect(() => {
    if (!memberOpen) return
    setModelsStatus('loading')
    void api.sessions.models({ sessionId }).then(({ result }) => {
      if (!result.ok) {
        setModelsStatus('error')
        return
      }
      setProviders(result.value.groups)
      setModelsStatus('ready')
    }, () => { setModelsStatus('error') })
  }, [memberOpen, api])

  // 打开轮数弹窗时带入当前值。
  useEffect(() => {
    if (roundsOpen && setup !== undefined) setRoundsText(String(setup.rounds ?? 3))
  }, [roundsOpen, setup])

  if (setup === undefined) return null
  const members = setup.members

  const openMember = (): void => {
    setDraft({ name: '', identity: '', emoji: '', provider: '', model: '' })
    setError(null)
    setNotice(null)
    setMemberOpen(true)
  }

  const submitMember = async (): Promise<void> => {
    const name = draft.name.trim()
    if (name.length === 0 || draft.identity.trim().length === 0
      || draft.provider.trim().length === 0 || draft.model.trim().length === 0) {
      setError(t('manage.error.missing'))
      return
    }
    if (members.some(member => member.name === name)) {
      setError(t('manage.error.duplicate'))
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const message = await addMember({
        name,
        identity: draft.identity.trim(),
        ...(draft.emoji.trim().length > 0 ? { emoji: draft.emoji.trim() } : {}),
        provider: draft.provider.trim(),
        model: draft.model.trim(),
      })
      setNotice(message)
      setDraft({ name: '', identity: '', emoji: '', provider: '', model: '' })
    } catch (reason: unknown) {
      setError(t('manage.error.command', { message: reason instanceof Error ? reason.message : String(reason) }))
    } finally {
      setBusy(false)
    }
  }

  const submitRounds = async (): Promise<void> => {
    const value = Number(roundsText)
    if (!Number.isInteger(value) || value < 1 || value > 10) {
      setError(t('manage.error.invalidRounds'))
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const message = await setRounds(value)
      setNotice(message)
    } catch (reason: unknown) {
      setError(t('manage.error.command', { message: reason instanceof Error ? reason.message : String(reason) }))
    } finally {
      setBusy(false)
    }
  }

  const providerOptions = providers.length === 0
    ? <option value="">{modelsStatus === 'loading' ? t('modal.loadingModels') : t('modal.loadModelsFailed')}</option>
    : <>
      <option value="">{t('modal.provider')}…</option>
      {providers.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
    </>
  const modelsOf = (provider: string): readonly { id: string; name: string }[] =>
    providers.find(group => group.id === provider)?.models ?? []

  return (
    <>
      <Button
        className={css.button}
        variant="toolbar"
        size="sm"
        icon={<IconUserOutline16 size={14} />}
        title={t('manage.addMemberTitle')}
        onClick={openMember}
      >
        <span className={css.label}>{t('manage.members')}</span>
      </Button>
      <Button
        className={css.button}
        variant="toolbar"
        size="sm"
        title={t('manage.roundsTitle')}
        onClick={() => {
          setError(null)
          setNotice(null)
          setRoundsOpen(true)
        }}
      >
        <span className={css.label}>{t('manage.roundsButton', { n: setup.rounds ?? 3 })}</span>
      </Button>

      {memberOpen && (
        <Modal
          open
          onClose={busy ? () => undefined : () => { setMemberOpen(false) }}
          title={t('manage.addMemberTitle')}
          closeLabel={t('modal.cancel')}
          description={t('manage.addMemberHint')}
          footer={(
            <div className={css.footer}>
              {error !== null && <span className={css.error}>{error}</span>}
              {notice !== null && <span className={css.notice}>{notice}</span>}
              <Button variant="ghost" size="sm" disabled={busy} onClick={() => { setMemberOpen(false) }}>{t('modal.cancel')}</Button>
              <Button variant="primary" size="sm" disabled={busy} onClick={() => { void submitMember() }}>
                {busy ? t('manage.busy') : t('manage.addMember')}
              </Button>
            </div>
          )}
        >
          <div className={css.body}>
            <div className={css.membersList}>
              <span className={css.sectionLabel}>{t('manage.members')}{t('manage.memberCount', { n: members.length })}
                <span className={css.muteHint}>{t('manage.muteHint')}</span>
              </span>
              <div className={css.members}>
                {members.map(member => (
                  <div key={member.id} className={css.memberRow}>
                    <span className={css.memberEmoji} aria-hidden="true">{member.emoji ?? '🤖'}</span>
                    <span className={css.memberName}>
                      {member.name}
                      {member.muted === true && <span className={css.mutedTag}>{t('manage.mutedTag')}</span>}
                    </span>
                    <span className={css.memberMeta}>{member.identity}</span>
                    <span className={css.memberModel}>{member.model}</span>
                    <button
                      type="button"
                      className={member.muted === true ? css.muteButtonOn : css.muteButton}
                      disabled={busy}
                      onClick={() => {
                        void setMuted(member.id, member.muted !== true)
                          .then((message) => { setNotice(message) })
                          .catch((reason: unknown) => {
                            setError(t('manage.error.command', { message: reason instanceof Error ? reason.message : String(reason) }))
                          })
                      }}
                    >
                      {member.muted === true ? t('manage.unmute') : t('manage.mute')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={css.divider} />
            <div className={css.draft}>
              <div className={css.grid}>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.memberName')}</span>
                  <Input value={draft.name} placeholder={t('modal.memberNamePlaceholder')}
                    onChange={(event) => { setDraft(current => ({ ...current, name: event.target.value })) }} />
                </label>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.emoji')}</span>
                  <Input value={draft.emoji} placeholder={t('modal.emojiPlaceholder')}
                    onChange={(event) => { setDraft(current => ({ ...current, emoji: event.target.value })) }} />
                </label>
              </div>
              <label className={css.field}>
                <span className={css.label}>{t('modal.identity')}</span>
                <Input value={draft.identity} placeholder={t('modal.identityPlaceholder')}
                  onChange={(event) => { setDraft(current => ({ ...current, identity: event.target.value })) }} />
              </label>
              <div className={css.grid}>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.provider')}</span>
                  <select
                    className={css.select}
                    value={draft.provider}
                    disabled={modelsStatus !== 'ready'}
                    onChange={(event) => { setDraft(current => ({ ...current, provider: event.target.value, model: '' })) }}
                  >
                    {providerOptions}
                  </select>
                </label>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.model')}</span>
                  <select
                    className={css.select}
                    value={draft.model}
                    disabled={modelsStatus !== 'ready' || draft.provider.length === 0}
                    onChange={(event) => { setDraft(current => ({ ...current, model: event.target.value })) }}
                  >
                    {draft.provider.length === 0
                      ? <option value="">{t('modal.provider')}…</option>
                      : <>
                        <option value="">{t('modal.model')}…</option>
                        {modelsOf(draft.provider).map(model => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </>}
                  </select>
                </label>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {roundsOpen && (
        <Modal
          open
          onClose={busy ? () => undefined : () => { setRoundsOpen(false) }}
          title={t('manage.roundsTitle')}
          closeLabel={t('modal.cancel')}
          description={t('manage.roundsHint')}
          footer={(
            <div className={css.footer}>
              {error !== null && <span className={css.error}>{error}</span>}
              {notice !== null && <span className={css.notice}>{notice}</span>}
              <Button variant="ghost" size="sm" disabled={busy} onClick={() => { setRoundsOpen(false) }}>{t('modal.cancel')}</Button>
              <Button variant="primary" size="sm" disabled={busy} onClick={() => { void submitRounds() }}>
                {busy ? t('manage.busy') : t('manage.save')}
              </Button>
            </div>
          )}
        >
          <div className={css.body}>
            <label className={css.field}>
              <span className={css.label}>{t('manage.rounds')}</span>
              <Input value={roundsText} placeholder="3" inputMode="numeric"
                onChange={(event) => { setRoundsText(event.target.value.replace(/[^0-9]/g, '')) }} />
            </label>
          </div>
        </Modal>
      )}
    </>
  )
})
