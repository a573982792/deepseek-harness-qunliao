/**
 * 群聊讨论引擎：管理每个会话的群状态，组织成员按序/按 @ 发言，
 * 每人独立调用大模型，支持开关与打断。
 * @module @deepseek-ai/dsh-qunliao/engine
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Session, SessionEvent, SessionEventType } from '@deepseek-ai/dsh-session';
import type { UserMessage } from '@deepseek-ai/dsh-llm';
import type { QunliaoMember, QunliaoSetupData } from './types.ts';
/** 引擎可调参数（来自插件 Config）。 */
export interface QunliaoEngineConfig {
    /** 每人最多发言轮数。 */
    readonly maxRounds: number;
    /** 单次发言最大输出 token。 */
    readonly maxTokens: number;
    /** 拼进上下文的最近记录条数。 */
    readonly historyLimit: number;
    /** 最少成员数。 */
    readonly minMembers: number;
    /** 最多成员数。 */
    readonly maxMembers: number;
}
/** 某成员的一次发言（供测试注入的假模型）。 */
export type QunliaoSpeaker = (ctx: Context, session: Session, member: QunliaoMember, round: number, signal: AbortSignal | undefined) => Promise<string>;
/** 一条群聊记录（LLM 上下文用）。 */
export interface QunliaoTranscriptEntry {
    readonly kind: 'user' | 'member';
    readonly speakerName: string;
    readonly text: string;
}
/** 单会话运行状态（内存态，事件日志为持久真相）。 */
export interface QunliaoGroupState {
    setup: QunliaoSetupData;
    toggleOn: boolean;
    running: boolean;
    /** 当前讨论的取消控制器；null 表示空闲。 */
    abort: AbortController | null;
}
/** 讨论触发方式。 */
export type QunliaoDiscussionMode = 'auto' | 'mentioned';
/** 建群入参。 */
export interface QunliaoCreateInput {
    readonly name: string;
    /** 讨论轮数（可选，默认取插件配置）。 */
    readonly rounds?: number;
    readonly members: readonly {
        readonly name: string;
        readonly identity: string;
        readonly emoji?: string;
        readonly provider: string;
        readonly model: string;
    }[];
}
/** 解析一段文本中的 @点名，返回去重后的成员（按出现顺序）。 */
export declare function parseMentions(text: string, members: readonly QunliaoMember[]): QunliaoMember[];
/** 校验建群入参，返回错误信息或 null。 */
export declare function validateCreateInput(input: QunliaoCreateInput, config: QunliaoEngineConfig): string | null;
/** 从事件流还原某会话的群聊记录（用户发言 + 已完成成员发言）。 */
export declare function buildTranscript(session: Session): QunliaoTranscriptEntry[];
/** 群聊引擎：纯命令驱动，不依赖主智能体循环。 */
export declare class QunliaoEngine {
    private readonly ctx;
    private readonly config;
    private readonly speak;
    constructor(ctx: Context, config: QunliaoEngineConfig, speaker?: QunliaoSpeaker);
    /** 运行期状态缓存：同一会话共享同一状态实例，保证打断与开关读写一致。 */
    private readonly states;
    /** 从会话事件流还原群状态（首次还原后缓存）；非群聊会话返回 undefined。 */
    hydrate(session: Session): QunliaoGroupState | undefined;
    /** 创建群聊：写入建群事件、欢迎消息与初始状态。 */
    create(session: Session, input: QunliaoCreateInput): string;
    /** 用户发言：写入记录；开关开启则组织讨论，否则仅响应 @ 点名。 */
    say(session: Session, text: string): Promise<string>;
    /** 切换讨论开关：开→组织讨论（未在讨论中时）；关→打断当前讨论。 */
    setToggle(session: Session, on: boolean): Promise<string>;
    /** 中途加人：校验后追加新成员并写入新的建群快照；@选人与讨论队列自动包含新成员。 */
    addMembers(session: Session, additions: readonly {
        readonly name: string;
        readonly identity: string;
        readonly emoji?: string;
        readonly provider: string;
        readonly model: string;
    }[]): string;
    /** 修改讨论轮数：写入新的建群快照，下次开启讨论时生效。 */
    setRounds(session: Session, rounds: number): string;
    /** 校验并归一化轮数（1-10，非法值报错）。 */
    private clampRounds;
    /** 让某位成员长期闭嘴/解除闭嘴：静音后不参与自动讨论，被 @ 也不发言。 */
    muteMember(session: Session, target: string, muted: boolean): string;
    /** 等待正在进行的讨论结束（打断后由 runDiscussion 的 finally 收尾）。 */
    private waitIdle;
    /** 当前状态文本（/qunliao state 调试用）。 */
    stateText(session: Session): string;
    private lastUserSeq;
    /**
     * 组织一轮或多轮讨论。
     * @param mode - `auto`：@目标优先、随后全员按序、最多 maxRounds 轮；`mentioned`：仅 @ 目标发言（含链式 @）。
     */
    private runDiscussion;
    private userTextBySeq;
    private appendState;
    private appendMessage;
    private appendError;
    /** 默认发言实现：用成员自己的 provider/model 直接调用大模型。 */
    private defaultSpeaker;
}
/** 供类型测试使用的事件类型别名（避免未使用导入告警）。 */
export type { SessionEvent, SessionEventType, UserMessage };
/** 群成员类型由 types.ts 定义，此处再导出供引擎使用者引用。 */
export type { QunliaoMember } from './types.ts';
//# sourceMappingURL=engine.d.ts.map