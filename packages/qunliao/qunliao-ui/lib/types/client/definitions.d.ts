/** 群聊事件 → 聊天节点/状态的会话侧定义。 */
import type { SessionEvent } from '@deepseek-ai/dsh-session/types';
import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-runtime/client';
import type { QunliaoSetupData, QunliaoStateData } from '@deepseek-ai/dsh-qunliao/types';
/** 一位成员发言的渲染载荷。 */
export interface QunliaoMemberMessageData {
    readonly messageId: string;
    readonly speakerId: string;
    readonly speakerName: string;
    readonly emoji?: string;
    readonly text: string;
    readonly turn: number;
    readonly time: number;
}
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface ChatNodeDataMap {
        /** 群聊成员发言气泡。 */
        'qunliao-member': QunliaoMemberMessageData;
        /** 隐藏状态节点：标记该会话为群聊并携带群名。 */
        'qunliao-setup': QunliaoSetupData;
        /** 隐藏状态节点：讨论开关与运行标记。 */
        'qunliao-state': QunliaoStateData;
    }
}
interface MemberMessageState extends QunliaoMemberMessageData {
    readonly seq: number;
}
/** 成员发言定义：每个 qunliao/message 渲染为一个成员气泡。 */
export declare const qunliaoMemberDefinition: ConversationNodeDefinition<MemberMessageState>;
/** 建群定义：隐藏状态节点，标记该会话为群聊（供讨论开关按钮显示）。 */
export declare const qunliaoSetupDefinition: ConversationNodeDefinition<QunliaoSetupData>;
/** 开关状态定义：隐藏状态节点，供讨论开关按钮读取开关与运行标记。 */
export declare const qunliaoStateDefinition: ConversationNodeDefinition<QunliaoStateData>;
/** 供类型测试使用的事件类型别名。 */
export type { SessionEvent };
//# sourceMappingURL=definitions.d.ts.map