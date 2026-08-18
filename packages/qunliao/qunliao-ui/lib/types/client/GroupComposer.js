import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** 群聊输入区：接管默认 composer，发言走 /qunliao say（不触发主智能体）。 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Button, IconNewChatOutline16, IconStopFill16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './GroupComposer.module.css';
/** 该会话是否为群聊（存在 qunliao-setup 隐藏节点）。 */
export function selectQunliaoComposer({ session }) {
    if (session === undefined)
        return null;
    const nodes = session.chat.nodes.values();
    for (const node of nodes) {
        if (node.kind === 'qunliao-setup')
            return { kind: 'qunliao' };
    }
    return null;
}
/** 从会话节点中读取群成员名单与讨论运行标记。 */
function groupFactsOf(nodes) {
    let members = [];
    let running = false;
    for (const node of nodes) {
        if (node.kind === 'qunliao-setup') {
            const data = node.data;
            members = data.members.map(({ id, name, identity, emoji }) => ({
                id,
                name,
                identity,
                ...(emoji === undefined ? {} : { emoji }),
            }));
        }
        else if (node.kind === 'qunliao-state') {
            const data = node.data;
            running = data.running;
        }
    }
    return { members, running };
}
/** 讨论进行时找出光标前最近的 @ 提示位置。 */
function mentionAt(text, caret) {
    const before = text.slice(0, caret);
    const lastAt = before.lastIndexOf('@');
    if (lastAt < 0)
        return null;
    const token = before.slice(lastAt + 1);
    if (/\s/u.test(token))
        return null;
    return { index: lastAt, query: token };
}
/** 群聊输入区：@ 选人下拉 + 发送键（讨论中变为停止）。 */
export const GroupComposer = memo(function GroupComposer({ say, stop, useSession, t, }) {
    const nodes = useSession(state => state.chat.nodes.values());
    const { members, running } = groupFactsOf(nodes);
    const [text, setText] = useState('');
    const [busy, setBusy] = useState(false);
    const [mention, setMention] = useState(null);
    const [mentionActive, setMentionActive] = useState(0);
    const textareaRef = useRef(null);
    const composingRef = useRef(false);
    const filtered = useMemo(() => {
        if (mention === null)
            return [];
        const query = mention.query.trim();
        return members.filter(member => query.length === 0
            || member.name.includes(query)
            || member.identity.includes(query));
    }, [mention, members]);
    const refreshMention = useCallback((value, caret) => {
        if (composingRef.current)
            return;
        const next = mentionAt(value, caret);
        setMention(next);
        setMentionActive(0);
    }, []);
    const pickMember = useCallback((name) => {
        setMention(current => {
            if (current === null)
                return current;
            const next = text.slice(0, current.index) + '@' + name + ' ' + text.slice(current.index + 1 + current.query.length);
            setText(next);
            requestAnimationFrame(() => {
                const el = textareaRef.current;
                if (el === null)
                    return;
                el.focus();
                const caret = current.index + 1 + name.length + 1;
                el.setSelectionRange(caret, caret);
            });
            return null;
        });
    }, [text]);
    const submit = () => {
        const trimmed = text.trim();
        if (trimmed.length === 0 || busy)
            return;
        setBusy(true);
        void say(trimmed).finally(() => {
            setBusy(false);
            setText('');
            setMention(null);
            textareaRef.current?.focus();
        });
    };
    const interrupt = () => {
        if (busy)
            return;
        setBusy(true);
        void stop().finally(() => { setBusy(false); });
    };
    return (_jsxs("div", { className: css.root, "data-qunliao-composer": "", children: [mention !== null && filtered.length > 0 && (_jsx("div", { className: css.mentionList, role: "listbox", onMouseDown: (event) => { event.preventDefault(); }, children: filtered.map((member, index) => (_jsxs("button", { type: "button", role: "option", "aria-selected": index === mentionActive, className: css.mentionItem, "data-active": index === mentionActive ? '' : undefined, onMouseEnter: () => { setMentionActive(index); }, onClick: () => { pickMember(member.name); }, children: [_jsx("span", { className: css.mentionEmoji, "aria-hidden": "true", children: member.emoji ?? '👤' }), _jsx("span", { className: css.mentionName, children: member.name }), _jsx("span", { className: css.mentionIdentity, children: member.identity })] }, member.id))) })), mention !== null && filtered.length === 0 && (_jsx("div", { className: css.mentionList, children: _jsx("div", { className: css.mentionEmpty, children: t('composer.mentionEmpty') }) })), _jsx("textarea", { ref: textareaRef, className: css.input, rows: 3, value: text, placeholder: t('composer.placeholder'), onChange: (event) => {
                    const value = event.target.value;
                    setText(value);
                    refreshMention(value, event.target.selectionStart ?? value.length);
                }, onKeyDown: (event) => {
                    if (mention !== null && filtered.length > 0) {
                        if (event.key === 'ArrowDown') {
                            event.preventDefault();
                            setMentionActive(current => (current + 1) % filtered.length);
                            return;
                        }
                        if (event.key === 'ArrowUp') {
                            event.preventDefault();
                            setMentionActive(current => (current - 1 + filtered.length) % filtered.length);
                            return;
                        }
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            const member = filtered[mentionActive];
                            if (member !== undefined)
                                pickMember(member.name);
                            return;
                        }
                        if (event.key === 'Escape') {
                            event.preventDefault();
                            setMention(null);
                            return;
                        }
                    }
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        submit();
                    }
                }, onCompositionStart: () => { composingRef.current = true; }, onCompositionEnd: (event) => {
                    composingRef.current = false;
                    const value = event.currentTarget.value;
                    setText(value);
                    refreshMention(value, event.currentTarget.selectionStart ?? value.length);
                } }), _jsxs("div", { className: css.foot, children: [_jsx("span", { className: css.hint, children: t('composer.hint') }), running ? (_jsx(Button, { variant: "primary", size: "sm", icon: _jsx(IconStopFill16, { size: 14 }), disabled: busy, onClick: interrupt, children: t('composer.stop') })) : (_jsx(Button, { variant: "primary", size: "sm", icon: _jsx(IconNewChatOutline16, { size: 14 }), disabled: busy || text.trim().length === 0, onClick: submit, children: t('composer.send') }))] })] }));
});
//# sourceMappingURL=GroupComposer.js.map