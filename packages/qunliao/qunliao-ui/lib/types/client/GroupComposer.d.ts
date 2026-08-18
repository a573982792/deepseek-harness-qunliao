import type { ComposerChainProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** 注册侧的业务面：把一句话作为用户发言写入群聊并触发讨论/点名。 */
export interface GroupComposerInjected {
    /** 提交用户发言。 */
    say: (text: string) => Promise<void>;
    /** 打断当前讨论（发送键在讨论中变为停止键）。 */
    stop: () => Promise<void>;
}
/** 链式选择器的匹配载荷（非空即接管）。 */
export interface QunliaoComposerMatch {
    readonly kind: 'qunliao';
}
type GroupComposerProps = PropsRuntime<'conversation.composer'> & {
    matched: QunliaoComposerMatch;
} & PropsLocale<'qunliao'> & InjectFace<GroupComposerInjected>;
/** 该会话是否为群聊（存在 qunliao-setup 隐藏节点）。 */
export declare function selectQunliaoComposer({ session }: ComposerChainProps): QunliaoComposerMatch | null;
/** 群聊输入区：@ 选人下拉 + 发送键（讨论中变为停止）。 */
export declare const GroupComposer: import("react").MemoExoticComponent<({ say, stop, useSession, t, }: GroupComposerProps) => import("react").JSX.Element>;
export {};
//# sourceMappingURL=GroupComposer.d.ts.map