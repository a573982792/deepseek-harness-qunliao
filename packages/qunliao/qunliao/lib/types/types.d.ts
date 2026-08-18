/**
 * 群聊插件的事件与共享类型（宿主端）。
 * @module @deepseek-ai/dsh-qunliao/types
 */
/** 一位群成员（AI 身份）。 */
export interface QunliaoMember {
    /** 稳定 ASCII 标识，用于 @id 点名。 */
    readonly id: string;
    /** 显示名（通常为中文昵称），用于 @名字 点名。 */
    readonly name: string;
    /** 身份设定（人设提示词）。 */
    readonly identity: string;
    /** 可选头像 emoji。 */
    readonly emoji?: string;
    /** 静音：true 时该成员不参与自动讨论，被 @ 也不发言。 */
    readonly muted?: boolean;
    /** 该成员独立使用的模型提供方。 */
    readonly provider: string;
    /** 该成员独立使用的模型。 */
    readonly model: string;
}
/** 建群事件载荷（成员/轮数变更时追加新快照，以最新一条为准）。 */
export interface QunliaoSetupData {
    /** 群名。 */
    readonly name: string;
    /** 成员名单（可中途追加，通过新快照更新）。 */
    readonly members: readonly QunliaoMember[];
    /** 讨论轮数：开启讨论后每人最多发言几轮（1-10）。 */
    readonly rounds: number;
    /** 创建时间（Unix 毫秒）。 */
    readonly createdAt: number;
}
/** 开关/运行状态事件载荷（最新一条生效）。 */
export interface QunliaoStateData {
    /** 讨论开关：true 表示自动讨论开启。 */
    readonly toggleOn: boolean;
    /** 是否正在组织发言。 */
    readonly running: boolean;
    /** 更新时间（Unix 毫秒）。 */
    readonly updatedAt: number;
}
/** 一条成员发言开始（先占位，随后由 qunliao/message 补齐正文）。 */
export interface QunliaoMessageStartData {
    /** 稳定消息 id。 */
    readonly messageId: string;
    readonly speakerId: string;
    readonly speakerName: string;
    readonly emoji?: string;
    /** 第几轮（从 1 开始）。 */
    readonly turn: number;
}
/** 一条成员发言正文。 */
export interface QunliaoMessageData {
    readonly messageId: string;
    readonly speakerId: string;
    readonly speakerName: string;
    readonly emoji?: string;
    readonly text: string;
    readonly turn: number;
}
/** 讨论过程中的提示（如某成员发言失败）。 */
export interface QunliaoErrorData {
    readonly text: string;
}
declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /** 建群。 */
        'qunliao/setup': QunliaoSetupData;
        /** 开关/运行状态快照。 */
        'qunliao/state': QunliaoStateData;
        /** 成员发言开始。 */
        'qunliao/message-start': QunliaoMessageStartData;
        /** 成员发言正文。 */
        'qunliao/message': QunliaoMessageData;
        /** 讨论提示（失败/系统说明）。 */
        'qunliao/error': QunliaoErrorData;
    }
}
//# sourceMappingURL=types.d.ts.map