import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
type MemberMessageProps = PropsRuntime<'conversation.chat.node', 'qunliao-member'> & PropsLocale<'qunliao'>;
/** 渲染一位群成员的发言。系统消息（speakerId === 'system'）居中显示为提示条。 */
export declare const MemberMessage: import("react").MemoExoticComponent<({ node, }: MemberMessageProps) => import("react").JSX.Element>;
export {};
//# sourceMappingURL=MemberMessage.d.ts.map