import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** 新建群聊：侧边栏入口按钮 + 成员配置弹窗（一体化组件）。 */
import { memo, useEffect, useState } from 'react';
import { Button, Input, Modal, IconCloseOutline16, IconPlusOutline16, IconUserOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './NewGroupChat.module.css';
function emptyMember() {
    return { name: '', identity: '', emoji: '', provider: '', model: '' };
}
/** 侧边栏入口 + 建群弹窗。 */
export const NewGroupChatEntry = memo(function NewGroupChatEntry({ wide, begin, submit, t, }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [sessionId, setSessionId] = useState(undefined);
    const [api, setApi] = useState(undefined);
    const open = async () => {
        const handle = await begin();
        if (handle === null)
            return;
        setSessionId(handle.sessionId);
        setApi(handle.api);
        setModalOpen(true);
    };
    if (!modalOpen || sessionId === undefined || api === undefined) {
        return (_jsxs("button", { type: "button", className: wide ? css.entry : css.entryRail, "aria-label": t('entry.aria'), title: t('entry.hint'), onClick: () => { void open(); }, children: [_jsx(IconUserOutline16, { size: wide ? 14 : 18, className: css.entryIcon }), wide && _jsx("span", { className: css.entryLabel, children: t('entry.label') })] }));
    }
    return (_jsx(NewGroupChatModal, { sessionId: sessionId, api: api, t: t, onClose: () => { setModalOpen(false); }, submit: submit }));
});
/** 建群弹窗主体（api 在打开前由入口注入）。 */
export function NewGroupChatModal({ sessionId, api, t, onClose, submit, }) {
    const [groupName, setGroupName] = useState('');
    const [rounds, setRounds] = useState('3');
    const [members, setMembers] = useState([emptyMember(), emptyMember()]);
    const [providers, setProviders] = useState([]);
    const [modelsStatus, setModelsStatus] = useState('loading');
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        void api.sessions.models({ sessionId }).then(({ result }) => {
            if (!result.ok) {
                setModelsStatus('error');
                return;
            }
            setProviders(result.value.groups);
            setModelsStatus('ready');
        }, () => { setModelsStatus('error'); });
    }, [sessionId, api]);
    const setMember = (index, patch) => {
        setMembers(list => list.map((member, i) => i === index ? { ...member, ...patch } : member));
    };
    const addMember = () => setMembers(list => [...list, emptyMember()]);
    const removeMember = (index) => {
        setMembers(list => list.length <= 2 ? list : list.filter((_, i) => i !== index));
    };
    const modelsOf = (provider) => providers.find(group => group.id === provider)?.models ?? [];
    const create = async () => {
        const name = groupName.trim();
        if (name.length === 0) {
            setError(t('modal.error.missing'));
            return;
        }
        if (members.length < 2) {
            setError(t('modal.error.minMembers'));
            return;
        }
        const roundsValue = Number(rounds);
        if (!Number.isInteger(roundsValue) || roundsValue < 1 || roundsValue > 10) {
            setError(t('manage.error.invalidRounds'));
            return;
        }
        const names = new Set();
        for (const member of members) {
            const memberName = member.name.trim();
            if (memberName.length === 0 || member.identity.trim().length === 0
                || member.provider.trim().length === 0 || member.model.trim().length === 0) {
                setError(t('modal.error.missing'));
                return;
            }
            if (names.has(memberName)) {
                setError(t('modal.error.duplicate'));
                return;
            }
            names.add(memberName);
        }
        setBusy(true);
        setError(null);
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
            });
            if (message.startsWith('群聊')) {
                onClose();
            }
            else {
                setError(t('modal.error.command', { message }));
            }
        }
        catch (reason) {
            setError(t('modal.error.command', { message: reason instanceof Error ? reason.message : String(reason) }));
        }
        finally {
            setBusy(false);
        }
    };
    const providerOptions = providers.length === 0
        ? _jsx("option", { value: "", children: modelsStatus === 'loading' ? t('modal.loadingModels') : t('modal.loadModelsFailed') })
        : _jsxs(_Fragment, { children: [_jsxs("option", { value: "", children: [t('modal.provider'), "\u2026"] }), providers.map(group => _jsx("option", { value: group.id, children: group.name }, group.id))] });
    return (_jsx(Modal, { open: true, onClose: busy ? () => undefined : onClose, title: t('modal.title'), closeLabel: t('modal.cancel'), description: t('modal.description'), footer: (_jsxs("div", { className: css.footer, children: [error !== null && _jsx("span", { className: css.error, children: error }), _jsx(Button, { variant: "ghost", size: "sm", disabled: busy, onClick: onClose, children: t('modal.cancel') }), _jsx(Button, { variant: "primary", size: "sm", disabled: busy, onClick: () => { void create(); }, children: busy ? t('modal.busy') : t('modal.create') })] })), children: _jsxs("div", { className: css.body, children: [_jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.groupName') }), _jsx(Input, { value: groupName, placeholder: t('modal.groupNamePlaceholder'), onChange: (event) => { setGroupName(event.target.value); } })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.rounds') }), _jsx(Input, { value: rounds, placeholder: "3", inputMode: "numeric", onChange: (event) => { setRounds(event.target.value.replace(/[^0-9]/g, '')); } }), _jsx("span", { className: css.roundsHint, children: t('modal.roundsHint') })] }), _jsxs("div", { className: css.membersHeader, children: [_jsxs("span", { className: css.label, children: [t('modal.members'), t('modal.memberCount', { n: members.length })] }), _jsx(Button, { variant: "ghost", size: "sm", icon: _jsx(IconPlusOutline16, { size: 14 }), onClick: addMember, children: t('modal.addMember') })] }), _jsx("div", { className: css.members, children: members.map((member, index) => (_jsxs("div", { className: css.member, children: [_jsxs("div", { className: css.memberHead, children: [_jsx("span", { className: css.memberIndex, children: index + 1 }), _jsx("span", { className: css.memberTitle, children: member.name.trim() || `${t('modal.members')} ${index + 1}` }), members.length > 2 && (_jsx("button", { type: "button", className: css.remove, "aria-label": t('modal.removeMember'), onClick: () => { removeMember(index); }, children: _jsx(IconCloseOutline16, { size: 14 }) }))] }), _jsxs("div", { className: css.grid, children: [_jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.memberName') }), _jsx(Input, { value: member.name, placeholder: t('modal.memberNamePlaceholder'), onChange: (event) => { setMember(index, { name: event.target.value }); } })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.emoji') }), _jsx(Input, { value: member.emoji, placeholder: t('modal.emojiPlaceholder'), onChange: (event) => { setMember(index, { emoji: event.target.value }); } })] })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.identity') }), _jsx(Input, { value: member.identity, placeholder: t('modal.identityPlaceholder'), onChange: (event) => { setMember(index, { identity: event.target.value }); } })] }), _jsxs("div", { className: css.grid, children: [_jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.provider') }), _jsx("select", { className: css.select, value: member.provider, disabled: modelsStatus !== 'ready', onChange: (event) => { setMember(index, { provider: event.target.value, model: '' }); }, children: providerOptions })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('modal.model') }), _jsx("select", { className: css.select, value: member.model, disabled: modelsStatus !== 'ready' || member.provider.length === 0, onChange: (event) => { setMember(index, { model: event.target.value }); }, children: member.provider.length === 0
                                                    ? _jsxs("option", { value: "", children: [t('modal.provider'), "\u2026"] })
                                                    : _jsxs(_Fragment, { children: [_jsxs("option", { value: "", children: [t('modal.model'), "\u2026"] }), modelsOf(member.provider).map(model => (_jsx("option", { value: model.id, children: model.name }, model.id)))] }) })] })] })] }, index))) })] }) }));
}
//# sourceMappingURL=NewGroupChat.js.map