/**
 * 群聊引擎单元测试：@解析、轮次调度、开关/打断、事件写入。
 */

import { describe, expect, it } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import type { Session, SessionEvent, SessionEventType, SessionEventMap } from '@deepseek-ai/dsh-session'
import { QunliaoEngine, parseMentions, validateCreateInput } from '../src/engine.ts'
import type { QunliaoMember } from '../src/types.ts'

/** 最小假会话：记录 append 调用并暴露 events。 */
class FakeSession {
  readonly id = 'fake-session' as Session['id']
  readonly events: SessionEvent[] = []

  append<T extends SessionEventType>(
    type: T,
    data: SessionEventMap[T],
    opts?: { surfaceOp?: 'append' },
  ): SessionEvent<T> {
    const event = {
      type,
      seq: this.events.length,
      time: Date.now(),
      data,
      ...(opts?.surfaceOp === undefined ? {} : { surfaceOp: opts.surfaceOp }),
    } as unknown as SessionEvent<T>
    this.events.push(event as SessionEvent)
    return event
  }
}

function asSession(fake: FakeSession): Session {
  return fake as unknown as Session
}

const members: readonly QunliaoMember[] = [
  { id: 'm1', name: '小林', identity: '产品经理', provider: 'p', model: 'm' },
  { id: 'm2', name: '阿强', identity: '程序员', provider: 'p', model: 'm' },
  { id: 'm3', name: '小美', identity: '设计师', provider: 'p', model: 'm' },
]

const config = { maxRounds: 3, maxTokens: 100, historyLimit: 40, minMembers: 2, maxMembers: 10 }

function engineWith(
  speaker: (session: Session, member: QunliaoMember, round: number) => Promise<string>,
  overrides: Partial<typeof config> = {},
) {
  const ctx = {} as Context
  const engineConfig = { ...config, ...overrides }
  return new QunliaoEngine(ctx, engineConfig, async (_ctx, session, member, round) => speaker(session, member, round))
}

function createGroup(session: Session, engine: QunliaoEngine): void {
  engine.create(session, {
    name: '测试群',
    members: members.map(member => ({
      name: member.name, identity: member.identity, provider: member.provider, model: member.model,
    })),
  })
}

describe('parseMentions', () => {
  it('按出现顺序解析 @名字 与 @id，并去重', () => {
    const found = parseMentions('@小美 你说呢？@小林 还有 @m1', members)
    expect(found.map(member => member.id)).toEqual(['m3', 'm1'])
  })

  it('忽略未加入群聊的 @', () => {
    expect(parseMentions('@路人 你好', members)).toEqual([])
  })

  it('忽略空 @ 与标点边界', () => {
    expect(parseMentions('@ @，', members)).toEqual([])
  })
})

describe('validateCreateInput', () => {
  it('拒绝空群名、过少成员与重复名字', () => {
    expect(validateCreateInput({ name: '', members: [members[0]!] }, config)).toMatch(/群名/)
    expect(validateCreateInput({
      name: 'x',
      members: [{ name: 'a', identity: 'i', provider: 'p', model: 'm' }],
    }, config)).toMatch(/至少/)
    expect(validateCreateInput({
      name: 'x',
      members: [
        { name: 'a', identity: 'i', provider: 'p', model: 'm' },
        { name: 'a', identity: 'i', provider: 'p', model: 'm' },
      ],
    }, config)).toMatch(/重复/)
  })

  it('通过合法输入', () => {
    expect(validateCreateInput({
      name: '群',
      members: [
        { name: 'a', identity: 'i', provider: 'p', model: 'm' },
        { name: 'b', identity: 'i', provider: 'p', model: 'm' },
      ],
    }, config)).toBeNull()
  })
})

describe('QunliaoEngine.create', () => {
  it('写入 setup、欢迎消息与初始 state，成员按序编号', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const engine = engineWith(async () => '')
    createGroup(session, engine)
    const types = fake.events.map(event => event.type)
    expect(types).toEqual(['qunliao/setup', 'qunliao/message-start', 'qunliao/message', 'qunliao/state'])
    const setup = fake.events[0]!.data as unknown as { name: string; members: QunliaoMember[] }
    expect(setup.name).toBe('测试群')
    expect(setup.members.map(member => member.id)).toEqual(['m1', 'm2', 'm3'])
    const state = fake.events[3]!.data as { toggleOn: boolean }
    expect(state.toggleOn).toBe(false)
  })
})

describe('QunliaoEngine.say', () => {
  it('开关开启时全部成员按顺序各发言一次', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return `我是${member.name}`
    }, { maxRounds: 1 })
    createGroup(session, engine)
    await engine.setToggle(session, true)
    await engine.say(session, '大家讨论一下这个需求')
    expect(spoken).toEqual(['小林', '阿强', '小美'])
    const messages = fake.events.filter(event => event.type === 'qunliao/message')
    expect(messages).toHaveLength(4) // 欢迎消息 + 3 位成员
  })

  it('开关关闭时仅 @ 目标发言，按 @ 顺序', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return '收到'
    })
    createGroup(session, engine)
    await engine.say(session, '@小美 你评价一下，@阿强 也说说')
    expect(spoken).toEqual(['小美', '阿强'])
  })

  it('开关关闭且无 @ 时无人发言', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return 'x'
    })
    createGroup(session, engine)
    await engine.say(session, '随便聊聊')
    expect(spoken).toEqual([])
  })
})

describe('QunliaoEngine 轮次与 @ 插队', () => {
  it('成员发言中的 @ 让被点名下一位发言（插队）', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return member.id === 'm1' ? '@小美 你怎么看' : '继续'
    }, { maxRounds: 1 })
    createGroup(session, engine)
    await engine.setToggle(session, true)
    await engine.say(session, '开始')
    expect(spoken).toEqual(['小林', '小美', '阿强'])
  })

  it('超过 maxRounds 轮后停止', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    let calls = 0
    const engine = engineWith(async () => {
      calls += 1
      return '继续'
    })
    createGroup(session, engine)
    await engine.setToggle(session, true)
    await engine.say(session, '开始')
    // 每轮 3 人、共 3 轮
    expect(calls).toBe(9)
    const finalState = fake.events.filter(event => event.type === 'qunliao/state').at(-1)!
    expect((finalState.data as { running: boolean }).running).toBe(false)
  })
})


describe('QunliaoEngine.addMembers', () => {
  it('中途加人：写入新 setup 快照、id 延续并输出欢迎消息', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const engine = engineWith(async () => '')
    createGroup(session, engine)
    const result = engine.addMembers(session, [{
      name: '小红', identity: '运营', provider: 'p', model: 'm', emoji: '🌸',
    }])
    expect(result).toContain('小红')
    const setups = fake.events.filter(event => event.type === 'qunliao/setup')
    expect(setups).toHaveLength(2)
    const latest = setups.at(-1)!.data as unknown as { members: QunliaoMember[]; rounds: number }
    expect(latest.members.map(member => member.name)).toEqual(['小林', '阿强', '小美', '小红'])
    expect(latest.members.at(-1)!.id).toBe('m4')
    const system = fake.events.filter(event => event.type === 'qunliao/message').at(-1)!
    expect((system.data as { text: string }).text).toContain('小红 加入群聊')
  })

  it('拒绝重复名字与超过上限', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const engine = engineWith(async () => '')
    createGroup(session, engine)
    expect(() => engine.addMembers(session, [{ name: '小林', identity: 'x', provider: 'p', model: 'm' }]))
      .toThrow(/重复/)
    const many = Array.from({ length: 8 }, (_, index) => ({
      name: `新人${index}`, identity: 'x', provider: 'p', model: 'm',
    }))
    expect(() => engine.addMembers(session, many)).toThrow(/最多/)
  })

  it('新成员进入 @ 点名与轮流发言队列', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return '收到'
    })
    createGroup(session, engine)
    engine.addMembers(session, [{ name: '小红', identity: '运营', provider: 'p', model: 'm' }])
    await engine.say(session, '@小红 说说看')
    expect(spoken).toEqual(['小红'])
    spoken.length = 0
    engine.setRounds(session, 1)
    // 开关开启即自动开始讨论（此前已有用户发言）
    await engine.setToggle(session, true)
    expect(spoken).toEqual(['小林', '阿强', '小美', '小红'])
  })
})

describe('QunliaoEngine.setRounds', () => {
  it('修改轮数写入新 setup 快照，讨论按新轮数执行', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    let calls = 0
    const engine = engineWith(async () => {
      calls += 1
      return '继续'
    })
    createGroup(session, engine)
    expect(engine.setRounds(session, 1)).toContain('1 轮')
    const setups = fake.events.filter(event => event.type === 'qunliao/setup')
    expect((setups.at(-1)!.data as unknown as { rounds: number }).rounds).toBe(1)
    await engine.setToggle(session, true)
    await engine.say(session, '开始')
    expect(calls).toBe(3) // 3 人 × 1 轮
  })

  it('拒绝非 1-10 的轮数', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const engine = engineWith(async () => '')
    createGroup(session, engine)
    expect(() => engine.setRounds(session, 0)).toThrow(/1-10/)
    expect(() => engine.setRounds(session, 11)).toThrow(/1-10/)
    expect(() => engine.setRounds(session, 2.5)).toThrow(/1-10/)
  })
})

describe('QunliaoEngine.create rounds', () => {
  it('建群时可指定轮数，缺省用插件配置', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const engine = engineWith(async () => '')
    createGroup(session, engine)
    const setups = fake.events.filter(event => event.type === 'qunliao/setup')
    expect((setups[0]!.data as unknown as { rounds: number }).rounds).toBe(3)
    engine.create(session, {
      name: '两轮群',
      rounds: 2,
      members: members.map(member => ({
        name: member.name, identity: member.identity, provider: member.provider, model: member.model,
      })),
    })
    const setups2 = fake.events.filter(event => event.type === 'qunliao/setup')
    expect((setups2.at(-1)!.data as unknown as { rounds: number }).rounds).toBe(2)
  })
})



describe('QunliaoEngine 静音', () => {
  it('静音成员不参与自动讨论，解除后恢复', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return '继续'
    }, { maxRounds: 1 })
    createGroup(session, engine)
    engine.muteMember(session, '阿强', true)
    await engine.setToggle(session, true)
    await engine.say(session, '开始')
    expect(spoken).toEqual(['小林', '小美'])
    spoken.length = 0
    engine.muteMember(session, '阿强', false)
    await engine.say(session, '再来')
    expect(spoken).toEqual(['小林', '阿强', '小美'])
  })

  it('静音成员被 @ 也不发言', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      return '收到'
    })
    createGroup(session, engine)
    engine.muteMember(session, '小美', true)
    await engine.say(session, '@小美 说说看')
    expect(spoken).toEqual([])
    await engine.say(session, '@小林 你来说')
    expect(spoken).toEqual(['小林'])
  })

  it('找不到成员时报错', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const engine = engineWith(async () => '')
    createGroup(session, engine)
    expect(() => engine.muteMember(session, '路人', true)).toThrow(/找不到/)
  })
})

describe('QunliaoEngine 点名打断竞态', () => {
  it('讨论进行中用户 @ 点名：打断当前讨论并让被 @ 者发言', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    let release: (() => void) | undefined
    const gate = new Promise<void>(resolve => { release = resolve })
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      if (member.id === 'm1') await gate
      return 'x'
    })
    createGroup(session, engine)
    await engine.setToggle(session, true)
    const sayPromise = engine.say(session, '大家开始')
    await new Promise<void>(resolve => setTimeout(resolve, 10))
    expect(spoken).toEqual(['小林'])
    // 讨论还在进行（小林被 gate 卡住），用户点名 @小美
    const mentionPromise = engine.say(session, '@小美 你说')
    release?.()
    await sayPromise
    await mentionPromise
    // 小美必须发言，且最后处于空闲
    expect(spoken).toContain('小美')
    const states = fake.events.filter(event => event.type === 'qunliao/state')
    expect((states.at(-1)!.data as { running: boolean }).running).toBe(false)
    // 打断不产生错误提示
    const errors = fake.events.filter(event => event.type === 'qunliao/error')
    expect(errors).toHaveLength(0)
  })
})

describe('QunliaoEngine v2 旧群兼容', () => {
  it('旧群 setup 无 rounds 时加人/改轮数正常，轮数取配置默认值', () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    // 模拟 v2 时代创建的群：setup 没有 rounds 字段
    fake.append('qunliao/setup', {
      name: '旧群',
      members,
      createdAt: 1,
    } as unknown as SessionEventMap['qunliao/setup'])
    const engine = engineWith(async () => '')
    const result = engine.addMembers(session, [{ name: '小红', identity: '运营', provider: 'p', model: 'm' }])
    expect(result).toContain('小红')
    const setups = fake.events.filter(event => event.type === 'qunliao/setup')
    expect((setups.at(-1)!.data as unknown as { rounds: number }).rounds).toBe(3)
    expect(engine.setRounds(session, 2)).toContain('2 轮')
    const setups2 = fake.events.filter(event => event.type === 'qunliao/setup')
    expect((setups2.at(-1)!.data as unknown as { rounds: number }).rounds).toBe(2)
  })
})

describe('QunliaoEngine 打断', () => {
  it('开关关闭打断正在进行的讨论', async () => {
    const fake = new FakeSession()
    const session = asSession(fake)
    const spoken: string[] = []
    let release: (() => void) | undefined
    const gate = new Promise<void>(resolve => { release = resolve })
    const engine = engineWith(async (_session, member) => {
      spoken.push(member.name)
      await gate
      return 'x'
    })
    createGroup(session, engine)
    await engine.setToggle(session, true)
    const sayPromise = engine.say(session, '开始')
    // 等第一位成员进入发言
    await new Promise<void>(resolve => setTimeout(resolve, 10))
    expect(spoken).toEqual(['小林'])
    const interrupt = engine.setToggle(session, false)
    release?.()
    await sayPromise
    await interrupt
    const states = fake.events.filter(event => event.type === 'qunliao/state')
    expect((states.at(-1)!.data as { running: boolean }).running).toBe(false)
    expect((states.at(-1)!.data as { toggleOn: boolean }).toggleOn).toBe(false)
  })
})


