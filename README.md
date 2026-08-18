# deepseek-harness 群聊插件（qunliao）

让 deepseek-harness 支持**多 AI 身份群聊**：新建一个群，添加多个 AI 助手并分别设定名字、人设和模型，然后让它们在群里按顺序讨论、互相 @，就像真人群聊一样。

## 功能

- **新群聊入口**：侧边栏「新会话」正下方新增「新群聊」按钮，点开即可添加成员。
- **成员设定**：每个成员可独立设置名字、身份人设、头像 emoji、模型提供方和模型。
- **讨论开关**：进入群聊后，聊天窗口顶部有一个「开始讨论」按钮。点一下，群成员按顺序发言；打断直接用发送键（讨论中发送键会变成「停止」）。
- **@ 选人点名**：输入 `@` 会弹出成员列表，点选即可点名（也可继续输入名字过滤）；被点名的成员立即发言，@ 多人按 @ 顺序发言。也可以 @ 自己发言，保证「本人最大」。
- **轮数限制**：默认最多 3 轮（可在插件配置里调整），点开关即可再开始新一轮。
- **随时插话**：你任何时候都能发言，被 @ 的成员必须回应。
- **每个群独立**：每个群聊是一个独立会话，可单独改名，互不干扰。

## 安装（Windows，下载即用）

1. 下载本仓库并解压。
2. 右键「以管理员身份运行 Windows PowerShell」，执行：

   ```powershell
   powershell -ExecutionPolicy Bypass -File ".\install.ps1"
   ```

3. 按提示输入 deepseek-harness 源码目录（默认 `D:\桌面\deepseek-harness-master`）。
4. 脚本会自动：复制 `packages\qunliao` → 打补丁（侧边栏槽位、事件白名单、web-app 注册、根 tsconfig）→ 重建 node_modules 依赖链接。

启动：

```powershell
cd D:\桌面\deepseek-harness-master
pnpm dev:web      # 或 pnpm build:web 后启动
```

> 需要管理员权限是为了创建 node_modules 的目录链接（junction）；如果你已开启 Windows 开发者模式，普通权限即可。

## 使用示例

1. 左侧点「新群聊」→ 群名填「产品评审」→ 添加 3 个成员，例如：
   - 小林 · 产品经理 · deepseek-chat
   - 阿圆 · 交互设计师 · deepseek-chat
   - 老王 · 前端工程师 · deepseek-reasoner
2. 点「创建」，进入群聊。
3. 你先发言，例如：`帮我们设计一个新版登录页`
4. 点窗口顶部的「讨论」按钮，成员按顺序开始讨论。
5. 想打断就点发送键（讨论中会变成「停止」）；想指定某人回答就输入 `@` 选中小林，如 `@小林 你觉得呢？`

## 配置（可选）

宿主插件 `packages/qunliao/qunliao` 支持以下配置（默认值已可用）：

| 配置项 | 默认 | 说明 |
| --- | --- | --- |
| `maxRounds` | 3 | 每轮讨论最多发言轮数（1–10） |
| `maxTokens` | 2000 | 每个成员单次回复的最大 token（64–8192） |
| `historyLimit` | 40 | 讨论上下文保留的历史条数（4–200） |
| `minMembers` | 2 | 建群最少成员数 |
| `maxMembers` | 10 | 建群最多成员数 |

## 侧边栏会话操作

群聊会话与普通会话一样，在左侧边栏显示群名，悬停出现 **⋯ 菜单**：重命名、复制（fork）、归档。删除会话请先归档，再到归档列表操作（与原版一致）。

> 该能力依赖对 `packages/host/apiproxy/src/api-proxy.ts` 的补丁（把群聊建群事件识别为“会话已开始”），`install.ps1` 会自动覆盖此文件，请勿用旧的 deepseek-harness 文件回退它。

## 兼容性

- 适配 deepseek-harness **0.1.0-rc.5**（与 `packages/qunliao` 内 `package.json` 版本一致）。
- 支持中文 / 英文界面。

## 目录结构

```
packages/qunliao/qunliao     宿主端插件：讨论引擎、@ 解析、开关/打断、事件
packages/qunliao/qunliao-ui  客户端插件：新群聊弹窗、讨论开关、@ 选人、成员气泡
patches/                     需要覆盖到 deepseek-harness 仓库的改动文件
install.ps1                  一键安装脚本
rebuild-d-node-modules.mjs   依赖链接重建工具（node_modules 损坏时使用）
```
