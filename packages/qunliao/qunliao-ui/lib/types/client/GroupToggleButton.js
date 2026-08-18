import { jsx as _jsx } from "react/jsx-runtime";
/** 群聊讨论开关：会话头部按钮，点击开启成员讨论；打断交由发送键。 */
import { memo, useState } from 'react';
import { Button, IconSparkle16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './GroupToggleButton.module.css';
/** 从会话的隐藏状态节点推导开关与运行标记。 */
function stateNodesOf(nodes) {
    let isGroup = false;
    let toggleOn = false;
    let running = false;
    for (const node of nodes) {
        if (node.kind === 'qunliao-setup') {
            isGroup = true;
            void node.data;
        }
        else if (node.kind === 'qunliao-state') {
            const data = node.data;
            toggleOn = data.toggleOn;
            running = data.running;
        }
    }
    return { isGroup, toggleOn, running };
}
/** 渲染讨论开关按钮；非群聊会话返回空。点一下开启，再点一下关闭/打断。 */
export const GroupToggleButton = memo(function GroupToggleButton({ useSession, toggle, t, }) {
    const nodes = useSession(state => state.chat.nodes.values());
    const { isGroup, toggleOn, running } = stateNodesOf(nodes);
    const [busy, setBusy] = useState(false);
    if (!isGroup)
        return null;
    const active = toggleOn || running;
    const label = active ? t('toggle.on') : t('toggle.off');
    return (_jsx(Button, { className: css.button, variant: "toolbar", size: "sm", icon: _jsx(IconSparkle16, { className: active ? css.lit : undefined }), title: t('toggle.tooltip'), disabled: busy, onClick: () => {
            setBusy(true);
            void toggle(!active).finally(() => { setBusy(false); });
        }, children: _jsx("span", { className: css.label, children: label }) }));
});
//# sourceMappingURL=GroupToggleButton.js.map