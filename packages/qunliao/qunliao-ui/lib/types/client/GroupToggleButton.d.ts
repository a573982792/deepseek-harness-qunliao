import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** 注册侧的业务面：开启讨论（关闭/打断通过发送键）。 */
export interface GroupToggleInjected {
    /** 开启讨论（进入自动轮番）。 */
    toggle: (on: boolean) => Promise<void>;
}
type GroupToggleProps = PropsRuntime<'conversation.session.header.actions'> & PropsLocale<'qunliao'> & InjectFace<GroupToggleInjected>;
/** 渲染讨论开关按钮；非群聊会话返回空。点一下开启，再点一下关闭/打断。 */
export declare const GroupToggleButton: import("react").MemoExoticComponent<({ useSession, toggle, t, }: GroupToggleProps) => import("react").JSX.Element | null>;
export {};
//# sourceMappingURL=GroupToggleButton.d.ts.map