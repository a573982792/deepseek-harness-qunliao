import type { IApiClient, SessionId } from '@deepseek-ai/dsh-api-remotes/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** 注册侧的业务面（sessionId 由注册处绑定）。 */
export interface GroupManageInjected {
    /** 添加一位成员（/qunliao add）。 */
    addMember: (member: {
        name: string;
        identity: string;
        emoji?: string;
        provider: string;
        model: string;
    }) => Promise<string>;
    /** 修改讨论轮数（/qunliao rounds）。 */
    setRounds: (rounds: number) => Promise<string>;
    /** 让某位成员闭嘴/解除（/qunliao mute）。 */
    setMuted: (memberId: string, muted: boolean) => Promise<string>;
    /** 会话 API 句柄（模型列表）。 */
    api: IApiClient;
    /** 会话 id（模型列表查询用）。 */
    sessionId: SessionId;
}
type GroupManageProps = PropsRuntime<'conversation.session.header.actions'> & PropsLocale<'qunliao'> & InjectFace<GroupManageInjected>;
/** 会话头部：成员管理 + 轮数按钮；非群聊会话返回空。 */
export declare const GroupManageButton: import("react").MemoExoticComponent<({ useSession, addMember, setRounds, setMuted, api, sessionId, t, }: GroupManageProps) => import("react").JSX.Element | null>;
export {};
//# sourceMappingURL=GroupManageButton.d.ts.map