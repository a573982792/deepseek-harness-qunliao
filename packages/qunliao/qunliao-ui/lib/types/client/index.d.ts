/** 群聊 UI 插件（浏览器半）：新群聊入口、讨论开关、成员气泡、群聊输入区。 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type QunliaoUiKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** 群聊 UI 插件的词典。 */
        qunliao: QunliaoUiKey;
    }
}
/** 所需服务。 */
export declare const inject: string[];
/**
 * 安装群聊表面。
 * @param ctx - 浏览器插件上下文。
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map