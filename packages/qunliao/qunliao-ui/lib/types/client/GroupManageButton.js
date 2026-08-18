import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** 群管理按钮组：查看成员并添加新成员 + 修改讨论轮数。 */
import { memo, useEffect, useState } from 'react';
import { Button, Input, Modal, IconUserOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './GroupManageButton.module.css';
/** 从会话节点读取最新建群快照。 */
function setupOf(nodes) {
    let setup;
    for (const node of nodes) {
        if (node.kind === 'qunliao-setup')
            setup = node.data;
    }
    return setup;
}
/** 会话头部：成员管理 + 轮数按钮；非群聊会话返回空。 */
export const GroupManageButton = memo(function GroupManageButton({ useSession, addMember, setRounds, setMuted, api, sessionId, t, }) {
    const nodes = useSession(state => state.chat.nodes.values());
    const setup = setupOf(nodes);
    const [memberOpen, setMemberOpen] = useState(false);
    const [roundsOpen, setRoundsOpen] = useState(false);
    const [draft, setDraft] = useState({ name: '', identity: '', emoji: '', provider: '', model: '' });
    const [roundsText, setRoundsText] = useState('');
    const [providers, setProviders] = useState([]);
    const [modelsStatus, setModelsStatus] = useState('loading');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);
    // 打开成员弹窗时加载模型列表。
    useEffect(() => {
        if (!memberOpen)
            return;
        setModelsStatus('loading');
        void api.sessions.models({ sessionId }).then(({ result }) => {
            if (!result.ok) {
                setModelsStatus('error');
                return;
            }
            setProviders(result.value.groups);
            setModelsStatus('ready');
        }, () => { setModelsStatus('error'); });
    }, [memberOpen, api]);
    // 打开轮数弹窗时带入当前值。
    useEffect(() => {
        if (roundsOpen && setup !== undefined)
            setRoundsText(String(setup.rounds ?? 3));
    }, [roundsOpen, setup]);
    if (setup === undefined)
        return null;
    const members = setup.members;
    const openMember = () => {
        setDraft({ name: '', identity: '', emoji: '', provider: '', model: '' });
        setError(null);
        setNotice(null);
        setMemberOpen(true);
    };
    const submitMember = async () => {
        const name = draft.name.trim();
        if (name.length === 0 || draft.identity.trim().length === 0
            || draft.provider.trim().length === 0 || draft.model.trim().length === 0) {
            setError(t('manage.error.missing'));
            return;
        }
        if (members.some(member => member.name === name)) {
            setError(t('manage.error.duplicate'));
            return;
        }
        setBusy(true);
        setError(null);
        setNotice(null);
        try {
            const message = await addMember({
                name,
                identity: draft.identity.trim(),
                ...(draft.emoji.trim().length > 0 ? { emoji: draft.emoji.trim() } : {}),
                provider: draft.provider.trim(),
                model: draft.model.trim(),
            });
            setNotice(message);
            setDraft({ name: '', identity: '', emoji: '', provider: '', model: '' });
        }
        catch (reason) {
            setError(t('manage.error.command', { message: reason instanceof Error ? reason.message : String(reason) }));
        }
        finally {
            setBusy(false);
        }
    };
    const submitRounds = async () => {
        const value = Number(roundsText);
        if (!Number.isInteger(value) || value < 1 || value > 10) {
            setError(t('manage.error.invalidRounds'));
            return;
        }
        setBusy(true);
        setError(null);
        setNotice(null);
        try {
            const message = await setRounds(value);
            setNotice(message);
        }
        catch (reason) {
            setError(t('manage.error.command', { message: reason instanceof Error ? reason.message : String(reason) }));
        }
        finally {
            setBusy(false);
        }
    };
    const providerOptions = providers.length === 0
        ? _jsx("option", { value: "", children: modelsStatus === 'loading' ? t('modal.loadingModels') : t('modal.loadModelsFailed') })
        : _jsxs(_Fragment, { children: [_jsxs("option", { value: "", children: [t('modal.provider'), "\u2026"] }), providers.map(group => _jsx("option", { value: group.id, children: group.name }, group.id))] });
    const modelsOf = (provider) => providers.find(group => group.id === provider)?.models ?? [];
    return (_jsxs(_Fragment, { children: [_jsx(Button, { className: css.button, variant: "toolbar", size: "sm", icon: _jsx(IconUserOutline16, { size: 14 }), title: t('manage.addMemberTitle'), onClick: openMember, children: _jsx("span", { className: css.label, children: t('manage.members') }) }), _jsx(Button, { className: css.button, variant: "toolbar", size: "sm", title: t('manage.roundsTitle'), onClick: () => {
                    setError(null);
                    setNotice(null);
                    setRoundsOpen(true);
                }, children: _jsx("span", { className: css.label, children: t('manage.roundsButton', { n: setup.rounds ?? 3 }) }) }), memberOpen && (_jsx(Modal, { open: true, onClose: busy ? () => undefined : () => { setMemberOpen(false); }, title: t('manage.addMemberTitle'), closeLabel: t('modal.cancel'), description: t('manage.addMemberHint'), footer: (_jsxs("div", { className: css.footer, children: [error !== null && _jsx("span", { className: css.error, children: error }), notice !== null && _jsx("span", { className: css.notice, children: notice }), _jsx(Button, { variant: "ghost", size: "sm", disabled: busy, onClick: () => { setMemberOpen(false); }, children: t('modal.cancel') }), _jsx(Button, { variant: "primary", size: "sm", disabled: busy, onClick: () => { void submitMember(); }, children: busy ? t('manage.busy') : t('manage.addMember') })] })), children: _jsxs("div", { className: css.body, children: [_jsxs("div", { className: css.membersList, children: [_jsxs("span", { className: css.sectionLabel, children: [t('manage.members'), t('manage.memberCount', { n: members.length }), _jsx("span", { className: css.muteHint, children: t('manage.muteHint') })] }), _jsx("div", { className: css.members, children: members.map(member => (_jsxs("div", { className: css.memberRow, children: [_jsx("span", { className: css.memberEmoji, "aria-hidden": "true", children: member.emoji ?? '🤖' }), _jsxs("span", { className: css.memberName, children: [member.name, member.muted === true && _jsx("span", { className: css.mutedTag, children: t('manage.mutedTag') })] }), _jsx("span", { className: css.memberMeta, children: member.identity }), _jsx("span", { className: css.memberModel, children: member.model }), _jsx("button", { type: "button", className: member.muted === true ? css.muteButtonOn : css.muteButton, disabled: busy, onClick: () => {
                                                    void setMuted(member.id, member.muted !== true)
                                                        .then((message) => { setNotice(message); })
                                                        .catch((reason) => {
                                                        setError(t('manage.error.command', { message: reason instanceof Error ? reason.message : String(reason) }));
                                                    });
                                                }, children: member.muted === true ? t('manage.unmute') : t('manage.mute') })] }, member.id))) })] }), _jsx("div", { className: css.divider }), _jsxs("div", { className: css.draft, children: [_jsxs("div", { className: css.grid, children: [_jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.memberName') }), _jsx(Input, { value: draft.name, placeholder: t('modal.memberNamePlaceholder'), onChange: (event) => { setDraft(current => ({ ...current, name: event.target.value })); } })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.emoji') }), _jsx(Input, { value: draft.emoji, placeholder: t('modal.emojiPlaceholder'), onChange: (event) => { setDraft(current => ({ ...current, emoji: event.target.value })); } })] })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.identity') }), _jsx(Input, { value: draft.identity, placeholder: t('modal.identityPlaceholder'), onChange: (event) => { setDraft(current => ({ ...current, identity: event.target.value })); } })] }), _jsxs("div", { className: css.grid, children: [_jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.provider') }), _jsx("select", { className: css.select, value: draft.provider, disabled: modelsStatus !== 'ready', onChange: (event) => { setDraft(current => ({ ...current, provider: event.target.value, model: '' })); }, children: providerOptions })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.model') }), _jsx("select", { className: css.select, value: draft.model, disabled: modelsStatus !== 'ready' || draft.provider.length === 0, onChange: (event) => { setDraft(current => ({ ...current, model: event.target.value })); }, children: draft.provider.length === 0
                                                        ? _jsxs("option", { value: "", children: [t('modal.provider'), "\u2026"] })
                                                        : _jsxs(_Fragment, { children: [_jsxs("option", { value: "", children: [t('modal.model'), "\u2026"] }), modelsOf(draft.provider).map(model => (_jsx("option", { value: model.id, children: model.name }, model.id)))] }) })] })] })] })] }) })), roundsOpen && (_jsx(Modal, { open: true, onClose: busy ? () => undefined : () => { setRoundsOpen(false); }, title: t('manage.roundsTitle'), closeLabel: t('modal.cancel'), description: t('manage.roundsHint'), footer: (_jsxs("div", { className: css.footer, children: [error !== null && _jsx("span", { className: css.error, children: error }), notice !== null && _jsx("span", { className: css.notice, children: notice }), _jsx(Button, { variant: "ghost", size: "sm", disabled: busy, onClick: () => { setRoundsOpen(false); }, children: t('modal.cancel') }), _jsx(Button, { variant: "primary", size: "sm", disabled: busy, onClick: () => { void submitRounds(); }, children: busy ? t('manage.busy') : t('manage.save') })] })), children: _jsx("div", { className: css.body, children: _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('manage.rounds') }), _jsx(Input, { value: roundsText, placeholder: "3", inputMode: "numeric", onChange: (event) => { setRoundsText(event.target.value.replace(/[^0-9]/g, '')); } })] }) }) }))] }));
});
//# sourceMappingURL=GroupManageButton.js.map