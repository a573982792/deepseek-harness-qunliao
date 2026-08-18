import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** 群聊成员发言气泡：头像、名字与正文。 */
import { memo } from 'react';
import { MessageText } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './MemberMessage.module.css';
/** 渲染一位群成员的发言。系统消息（speakerId === 'system'）居中显示为提示条。 */
export const MemberMessage = memo(function MemberMessage({ node, }) {
    const data = node.data;
    if (data.speakerId === 'system') {
        return (_jsx("div", { className: css.systemRow, "data-qunliao-system": "", children: _jsx("span", { className: css.systemBubble, children: data.text }) }));
    }
    return (_jsxs("div", { className: css.row, "data-qunliao-member": "", children: [_jsx("div", { className: css.avatar, "aria-hidden": "true", children: data.emoji ?? '🤖' }), _jsxs("div", { className: css.stack, children: [_jsxs("div", { className: css.meta, children: [_jsx("span", { className: css.name, children: data.speakerName }), data.turn > 0 && _jsxs("span", { className: css.turn, children: ["\u7B2C ", data.turn, " \u8F6E"] })] }), _jsx("div", { className: css.bubble, children: _jsx(MessageText, { text: data.text }) })] })] }));
});
//# sourceMappingURL=MemberMessage.js.map