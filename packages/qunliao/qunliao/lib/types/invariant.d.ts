/** Package-owned durable qunliao event-shape invariants. @module @deepseek-ai/dsh-qunliao/invariant */
import type { Context } from '@deepseek-ai/cordis';
/** Cordis companion plugin name. */
export declare const name = "qunliao-invariant";
/** Service required before the companion can reserve package ownership. */
export declare const inject: string[];
/** 注册 qunliao 不变式伴生插件。 */
export declare const apply: (ctx: Context) => Promise<() => void>;
//# sourceMappingURL=invariant.d.ts.map