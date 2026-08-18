/** 新建群聊：侧边栏入口按钮 + 成员配置弹窗（一体化组件）。 */
import { memo, useEffect, useState } from 'react'
import type { IApiClient, ModelProviderGroup, SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, Input, Modal, IconCloseOutline16, IconPlusOutline16, IconUserOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import css from './NewGroupChat.module.css'

/** 注册侧的业务面。 */
export interface NewGroupChatInjected {
  /** 创建并打开一个空白会话，返回会话与 API 句柄；失败返回 null。 */
  begin: () => Promise<{ sessionId: SessionId; api: IApiClient } | null>
  /** 提交建群：执行 /qunliao create 并重命名为群名。 */
  submit: (
    sessionId: SessionId,
    payload: { name: string; rounds?: number; members: readonly { name: string; identity: string; emoji?: string; provider: string; model: string }[] },
  ) => Promise<string>
}

type NewGroupChatProps =
  PropsRuntime<'sidebar.newSession.action'>
  & PropsLocale<'qunliao'>
  & InjectFace<NewGroupChatInjected>

/** 一位待添加成员的草稿。 */
interface MemberDraft {
  name: string
  identity: string
  emoji: string
  provider: string
  model: string
}

function emptyMember(): MemberDraft {
  return { name: '', identity: '', emoji: '', provider: '', model: '' }
}

/** 侧边栏入口 + 建群弹窗。 */
export const NewGroupChatEntry = memo(function NewGroupChatEntry({
  wide, begin, submit, t,
}: NewGroupChatProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [sessionId, setSessionId] = useState<SessionId | undefined>(undefined)
  const [api, setApi] = useState<IApiClient | undefined>(undefined)

  const open = async (): Promise<void> => {
    const handle = await begin()
    if (handle === null) return
    setSessionId(handle.sessionId)
    setApi(handle.api)
    setModalOpen(true)
  }

  if (!modalOpen || sessionId === undefined || api === undefined) {
    return (
      <button
        type="button"
        className={wide ? css.entry : css.entryRail}
        aria-label={t('entry.aria')}
        title={t('entry.hint')}
        onClick={() => { void open() }}
      >
        <IconUserOutline16 size={wide ? 14 : 18} className={css.entryIcon} />
        {wide && <span className={css.entryLabel}>{t('entry.label')}</span>}
      </button>
    )
  }

  return (
    <NewGroupChatModal
      sessionId={sessionId}
      api={api}
      t={t}
      onClose={() => { setModalOpen(false) }}
      submit={submit}
    />
  )
})

/** 建群弹窗主体（api 在打开前由入口注入）。 */
export function NewGroupChatModal({
  sessionId, api, t, onClose, submit,
}: {
  sessionId: SessionId
  api: IApiClient
  t: NewGroupChatProps['t']
  onClose: () => void
  submit: NewGroupChatInjected['submit']
}) {
  const [groupName, setGroupName] = useState('')
  const [rounds, setRounds] = useState('3')
  const [members, setMembers] = useState<MemberDraft[]>([emptyMember(), emptyMember()])
  const [providers, setProviders] = useState<readonly ModelProviderGroup[]>([])
  const [modelsStatus, setModelsStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void api.sessions.models({ sessionId }).then(({ result }) => {
      if (!result.ok) {
        setModelsStatus('error')
        return
      }
      setProviders(result.value.groups)
      setModelsStatus('ready')
    }, () => { setModelsStatus('error') })
  }, [sessionId, api])

  const setMember = (index: number, patch: Partial<MemberDraft>): void => {
    setMembers(list => list.map((member, i) => i === index ? { ...member, ...patch } : member))
  }
  const addMember = (): void => setMembers(list => [...list, emptyMember()])
  const removeMember = (index: number): void => {
    setMembers(list => list.length <= 2 ? list : list.filter((_, i) => i !== index))
  }
  const modelsOf = (provider: string): readonly { id: string; name: string }[] =>
    providers.find(group => group.id === provider)?.models ?? []

  const create = async (): Promise<void> => {
    const name = groupName.trim()
    if (name.length === 0) {
      setError(t('modal.error.missing'))
      return
    }
    if (members.length < 2) {
      setError(t('modal.error.minMembers'))
      return
    }
    const roundsValue = Number(rounds)
    if (!Number.isInteger(roundsValue) || roundsValue < 1 || roundsValue > 10) {
      setError(t('manage.error.invalidRounds'))
      return
    }
    const names = new Set<string>()
    for (const member of members) {
      const memberName = member.name.trim()
      if (memberName.length === 0 || member.identity.trim().length === 0
        || member.provider.trim().length === 0 || member.model.trim().length === 0) {
        setError(t('modal.error.missing'))
        return
      }
      if (names.has(memberName)) {
        setError(t('modal.error.duplicate'))
        return
      }
      names.add(memberName)
    }
    setBusy(true)
    setError(null)
    try {
      const message = await submit(sessionId, {
        rounds: Number(rounds),
        name,
        members: members.map(member => ({
          name: member.name.trim(),
          identity: member.identity.trim(),
          ...(member.emoji.trim().length > 0 ? { emoji: member.emoji.trim() } : {}),
          provider: member.provider.trim(),
          model: member.model.trim(),
        })),
      })
      if (message.startsWith('群聊')) {
        onClose()
      } else {
        setError(t('modal.error.command', { message }))
      }
    } catch (reason: unknown) {
      setError(t('modal.error.command', { message: reason instanceof Error ? reason.message : String(reason) }))
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

  return (
    <Modal
      open
      onClose={busy ? () => undefined : onClose}
      title={t('modal.title')}
      closeLabel={t('modal.cancel')}
      description={t('modal.description')}
      footer={(
        <div className={css.footer}>
          {error !== null && <span className={css.error}>{error}</span>}
          <Button variant="ghost" size="sm" disabled={busy} onClick={onClose}>{t('modal.cancel')}</Button>
          <Button variant="primary" size="sm" disabled={busy} onClick={() => { void create() }}>
            {busy ? t('modal.busy') : t('modal.create')}
          </Button>
        </div>
      )}
    >
      <div className={css.body}>
        <label className={css.field}>
          <span className={css.label}>{t('modal.groupName')}</span>
          <Input value={groupName} placeholder={t('modal.groupNamePlaceholder')}
            onChange={(event) => { setGroupName(event.target.value) }} />
        </label>
        <label className={css.field}>
          <span className={css.label}>{t('modal.rounds')}</span>
          <Input value={rounds} placeholder="3" inputMode="numeric"
            onChange={(event) => { setRounds(event.target.value.replace(/[^0-9]/g, '')) }} />
          <span className={css.roundsHint}>{t('modal.roundsHint')}</span>
        </label>

        <div className={css.membersHeader}>
          <span className={css.label}>{t('modal.members')}{t('modal.memberCount', { n: members.length })}</span>
          <Button variant="ghost" size="sm" icon={<IconPlusOutline16 size={14} />}
            onClick={addMember}>{t('modal.addMember')}</Button>
        </div>

        <div className={css.members}>
          {members.map((member, index) => (
            <div key={index} className={css.member}>
              <div className={css.memberHead}>
                <span className={css.memberIndex}>{index + 1}</span>
                <span className={css.memberTitle}>{member.name.trim() || `${t('modal.members')} ${index + 1}`}</span>
                {members.length > 2 && (
                  <button type="button" className={css.remove} aria-label={t('modal.removeMember')}
                    onClick={() => { removeMember(index) }}>
                    <IconCloseOutline16 size={14} />
                  </button>
                )}
              </div>
              <div className={css.grid}>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.memberName')}</span>
                  <Input value={member.name} placeholder={t('modal.memberNamePlaceholder')}
                    onChange={(event) => { setMember(index, { name: event.target.value }) }} />
                </label>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.emoji')}</span>
                  <Input value={member.emoji} placeholder={t('modal.emojiPlaceholder')}
                    onChange={(event) => { setMember(index, { emoji: event.target.value }) }} />
                </label>
              </div>
              <label className={css.field}>
                <span className={css.label}>{t('modal.identity')}</span>
                <Input value={member.identity} placeholder={t('modal.identityPlaceholder')}
                  onChange={(event) => { setMember(index, { identity: event.target.value }) }} />
              </label>
              <div className={css.grid}>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.provider')}</span>
                  <select
                    className={css.select}
                    value={member.provider}
                    disabled={modelsStatus !== 'ready'}
                    onChange={(event) => { setMember(index, { provider: event.target.value, model: '' }) }}
                  >
                    {providerOptions}
                  </select>
                </label>
                <label className={css.field}>
                  <span className={css.label}>{t('modal.model')}</span>
                  <select
                    className={css.select}
                    value={member.model}
                    disabled={modelsStatus !== 'ready' || member.provider.length === 0}
                    onChange={(event) => { setMember(index, { model: event.target.value }) }}
                  >
                    {member.provider.length === 0
                      ? <option value="">{t('modal.provider')}…</option>
                      : <>
                        <option value="">{t('modal.model')}…</option>
                        {modelsOf(member.provider).map(model => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </>}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

