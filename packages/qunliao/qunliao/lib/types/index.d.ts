/**
 * 群聊插件（宿主端）：注册 `/qunliao` 命令，提供建群、发言、开关/打断、状态查询。
 * 会话通过命令通道与客户端 UI 交互，讨论过程完全由本插件驱动，不依赖主智能体循环。
 * @module @deepseek-ai/dsh-qunliao
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type QunliaoEngineConfig } from './engine.ts';
export { QunliaoEngine, parseMentions, buildTranscript, validateCreateInput } from './engine.ts';
export type { QunliaoCreateInput, QunliaoDiscussionMode, QunliaoEngineConfig, QunliaoGroupState, QunliaoMember, QunliaoSpeaker, QunliaoTranscriptEntry, } from './engine.ts';
export type { QunliaoErrorData, QunliaoMessageData, QunliaoMessageStartData, QunliaoSetupData, QunliaoStateData, } from './types.ts';
export declare const name = "qunliao";
export declare const inject: string[];
/** 插件配置：讨论轮数与上下文等部署参数。 */
export interface Config extends QunliaoEngineConfig {
}
export declare const Config: z<Config>;
/** 注册 `/qunliao` 命令。 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map