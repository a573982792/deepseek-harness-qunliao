# @deepseek-ai/dsh-qunliao

群聊插件宿主端：在 DeepSeek Harness 会话里创建「群聊」——多个 AI 身份（人设）就一个话题轮流发言，支持 @点名、讨论开关与打断，每位成员可独立指定模型。

## What it does

Registers the `/qunliao` slash command (client UI drives it through the existing line-command remote):

- `/qunliao create <json>` — create a group chat on the calling session. Appends `qunliao/setup` (group name + member roster), a welcome `qunliao/message`, and an initial `qunliao/state`.
- `/qunliao say <text>` — record a user message (`user/message` surface append) and drive the discussion: when the toggle is on, all members speak in roster order (up to `maxRounds` rounds); when the toggle is off, only `@`-mentioned members speak (in mention order, chained mentions included).
- `/qunliao toggle on|off` — arm/disarm the discussion switch; turning off mid-discussion interrupts the running turn (AbortController).
- `/qunliao state` — current group name, members, and switch state.

The engine is fully plugin-driven: group sessions never start the main agent loop. Every member turn is a direct `ctx.llm.stream()` call using that member's own `provider`/`model`, with the member's identity as the system prompt and the recent transcript as context. Persona messages are appended as `qunliao/message-start` + `qunliao/message` events so the web client renders live bubbles; failures append `qunliao/error`.

## Events

Declared in `@deepseek-ai/dsh-session/types` via `SessionEventMap`:

| Event | Payload | Role |
|---|---|---|
| `qunliao/setup` | group name, members, createdAt | start |
| `qunliao/state` | toggleOn, running, updatedAt | latest-wins snapshot |
| `qunliao/message-start` | messageId, speaker, turn | speaking placeholder |
| `qunliao/message` | messageId, speaker, text, turn | finalized message |
| `qunliao/error` | text | failure notice |

Events are log-only (non-surface); only `user/message` carries surface metadata.

## Configuration

`maxRounds` (default 3), `maxTokens` (default 2000), `historyLimit` (default 40), `minMembers` (default 2), `maxMembers` (default 10). All tunables live on `Config`; nothing is hardcoded.

## Model Experience

### Request context and condition

#### What the model sees

Each member turn assembles a fresh single-shot request: the member identity as `system`, and one user message containing the formatted transcript plus a round instruction. No session prompt, tools, or user-injected context reach the member call.

##### Verbatim text for this field, when needed

The stable rule block is the second `system` line: `规则：直接以该身份发言，不要自我介绍；不要给自己加任何名字前缀或引号；需要别人回应时用 @名字 点名；发言控制在两三百字以内，口语化、观点鲜明。`

#### Token effect

Conditional, per member turn: transcript context is capped at `historyLimit` entries; output capped at `maxTokens`.

#### KV Cache effect

Append-only growth: each member request re-sends the transcript prefix as a single user message; the system prompt is stable per member identity, so a shared prefix remains cacheable until the transcript grows.

## Known Limitations and Deferred Work

- **No member roster editing** — members are fixed at creation; changing identities or models requires a new group chat.
- **No cross-restart run resume** — an interrupted discussion stops; `qunliao/state` persists, but a run does not resume from the middle of a round.
- **`purpose` is not stamped on member calls** — the closed `GenerateOptions.purpose` union does not include a qunliao value, so auxiliary-call classification is unavailable for now.
