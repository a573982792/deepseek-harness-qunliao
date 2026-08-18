/**
 * 群聊插件（宿主端）：注册 `/qunliao` 命令，提供建群、发言、开关/打断、状态查询。
 * 会话通过命令通道与客户端 UI 交互，讨论过程完全由本插件驱动，不依赖主智能体循环。
 * @module @deepseek-ai/dsh-qunliao
 */

import type { Context } from '@deepseek-ai/cordis'
import type { CommandInvocation, CommandResult } from '@deepseek-ai/dsh-commands'
import z from '@deepseek-ai/schemastery'
import { QunliaoEngine, type QunliaoEngineConfig, type QunliaoCreateInput } from './engine.ts'

export { QunliaoEngine, parseMentions, buildTranscript, validateCreateInput } from './engine.ts'
export type {
  QunliaoCreateInput, QunliaoDiscussionMode, QunliaoEngineConfig, QunliaoGroupState,
  QunliaoMember, QunliaoSpeaker, QunliaoTranscriptEntry,
} from './engine.ts'
export type {
  QunliaoErrorData, QunliaoMessageData, QunliaoMessageStartData, QunliaoSetupData,
  QunliaoStateData,
} from './types.ts'

export const name = 'qunliao'
export const inject = ['commands', 'llm']

/** 插件配置：讨论轮数与上下文等部署参数。 */
export interface Config extends QunliaoEngineConfig {}

export const Config: z<Config> = z.object({
  maxRounds: z.natural().max(10).default(3),
  maxTokens: z.natural().min(64).max(8192).default(2000),
  historyLimit: z.natural().min(4).max(200).default(40),
  minMembers: z.natural().min(1).max(10).default(2),
  maxMembers: z.natural().min(2).max(20).default(10),
})

const USAGE = '用法：/qunliao create <JSON> | say <发言> | add <JSON> | rounds <n> | mute <名字> on|off | toggle on|off | state'

/** 解析 `/qunliao` 的子命令。 */
function parseSubcommand(rawInput: string): { kind: string; arg: string } {
  const trimmed = rawInput.trim()
  const space = trimmed.search(/[\t\n\r ]/u)
  if (space < 0) return { kind: trimmed.toLowerCase(), arg: '' }
  return { kind: trimmed.slice(0, space).toLowerCase(), arg: trimmed.slice(space + 1).trim() }
}

/** 命令处理器：把子命令转发给引擎。 */
async function handleCommand(
  ctx: Context,
  engine: QunliaoEngine,
  invocation: CommandInvocation,
): Promise<CommandResult> {
  const { kind, arg } = parseSubcommand(invocation.rawInput)
  const session = invocation.agent.session
  try {
    switch (kind) {
      case 'create': {
        if (arg.length === 0) return { kind: 'error', text: `缺少建群参数。\n${USAGE}` }
        let input: QunliaoCreateInput
        try {
          const parsed: unknown = JSON.parse(arg)
          if (typeof parsed !== 'object' || parsed === null) throw new Error('not an object')
          input = parsed as QunliaoCreateInput
        } catch {
          return { kind: 'error', text: '建群参数不是合法 JSON。\n示例：/qunliao create {"name":"产品评审","members":[{"name":"小林","identity":"产品经理…","provider":"deepseek-official","model":"deepseek-chat"}]}' }
        }
        return { kind: 'success', text: engine.create(session, input) }
      }
      case 'add': {
        if (arg.length === 0) return { kind: 'error', text: `缺少成员参数。\n${USAGE}` }
        let parsed: unknown
        try {
          parsed = JSON.parse(arg)
        } catch {
          return { kind: 'error', text: '成员参数不是合法 JSON。\n示例：/qunliao add {"name":"小红","identity":"运营…","provider":"deepseek-official","model":"deepseek-chat"}' }
        }
        const additions = Array.isArray(parsed) ? parsed : [parsed]
        return { kind: 'success', text: engine.addMembers(session, additions as QunliaoCreateInput['members']) }
      }
      case 'rounds': {
        const rounds = Number(arg)
        if (arg.length === 0 || !Number.isInteger(rounds)) {
          return { kind: 'error', text: `rounds 参数需为 1-10 的整数。\n${USAGE}` }
        }
        return { kind: 'success', text: engine.setRounds(session, rounds) }
      }
      case 'mute': {
        const match = /^(.+?)\s+(on|off)$/u.exec(arg)
        if (match === null) {
          return { kind: 'error', text: `mute 参数需为「名字 on|off」。\n${USAGE}` }
        }
        return { kind: 'success', text: engine.muteMember(session, match[1]!.trim(), match[2] === 'on') }
      }
      case 'say':
        if (arg.length === 0) return { kind: 'error', text: '发言内容为空' }
        // 用户消息同步落库；讨论在后台进行，命令立即返回，客户端不被阻塞。
        void engine.say(session, arg).catch((error: unknown) => {
          ctx.logger.warn('qunliao say background discussion failed', error)
        })
        return { kind: 'success', text: '已记录' }
      case 'toggle':
        if (arg !== 'on' && arg !== 'off') {
          return { kind: 'error', text: `toggle 参数需为 on 或 off。\n${USAGE}` }
        }
        if (arg === 'off') {
          // 关闭/打断是同步动作，直接等待。
          return { kind: 'success', text: await engine.setToggle(session, false) }
        }
        // 开启：同步置位后讨论在后台进行，命令立即返回。
        void engine.setToggle(session, true).catch((error: unknown) => {
          ctx.logger.warn('qunliao toggle discussion failed', error)
        })
        return { kind: 'success', text: '讨论开关已开启' }
      case 'state':
        return { kind: 'success', text: engine.stateText(session) }
      default:
        return { kind: 'error', text: USAGE }
    }
  } catch (error: unknown) {
    return {
      kind: 'error',
      text: error instanceof Error ? error.message : String(error),
    }
  }
}

/** 注册 `/qunliao` 命令。 */
export function apply(ctx: Context, config: Config): void {
  const engine = new QunliaoEngine(ctx, config)
  ctx.commands.register({
    name: 'qunliao',
    description: '群聊：create 建群、add 加人、rounds 轮数、mute 闭嘴、say 发言、toggle 开关/打断、state 状态',
    input: { hint: '<create|say|add|rounds|mute|toggle|state> ...' },
    // 发言内容已写入 user/message 事件，不再重复记录到 command/run。
    recordInput: false,
    handler: invocation => handleCommand(ctx, engine, invocation),
  })
}