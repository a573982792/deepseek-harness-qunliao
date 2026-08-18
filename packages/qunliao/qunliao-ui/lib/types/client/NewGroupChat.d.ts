import type { IApiClient, SessionId } from '@deepseek-ai/dsh-api-remotes/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** 注册侧的业务面。 */
export interface NewGroupChatInjected {
    /** 创建并打开一个空白会话，返回会话与 API 句柄；失败返回 null。 */
    begin: () => Promise<{
        sessionId: SessionId;
        api: IApiClient;
    } | null>;
    /** 提交建群：执行 /qunliao create 并重命名为群名。 */
    submit: (sessionId: SessionId, payload: {
        name: string;
        rounds?: number;
        members: readonly {
            name: string;
            identity: string;
            emoji?: string;
            provider: string;
            model: string;
        }[];
    }) => Promise<string>;
}
type NewGroupChatProps = PropsRuntime<'sidebar.newSession.action'> & PropsLocale<'qunliao'> & InjectFace<NewGroupChatInjected>;
/** 侧边栏入口 + 建群弹窗。 */
export declare const NewGroupChatEntry: import("react").MemoExoticComponent<({ wide, begin, submit, t, }: NewGroupChatProps) => import("react").JSX.Element>;
/** 建群弹窗主体（api 在打开前由入口注入）。 */
export declare function NewGroupChatModal({ sessionId, api, t, onClose, submit, }: {
    sessionId: SessionId;
    api: IApiClient;
    t: NewGroupChatProps['t'];
    onClose: () => void;
    submit: NewGroupChatInjected['submit'];
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=NewGroupChat.d.ts.map