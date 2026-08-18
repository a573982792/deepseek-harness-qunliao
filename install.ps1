# 群聊插件一键安装脚本（Windows）
# 用法：
#   1) 把 deepseek-harness-qunliao 解压到任意目录
#   2) 右键“以管理员身份运行 Windows PowerShell”，执行：
#        powershell -ExecutionPolicy Bypass -File ".\install.ps1"
#      脚本会询问 deepseek-harness 源码目录（回车默认 D:\桌面\deepseek-harness-master）
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot

$dst = Read-Host "请输入 deepseek-harness 源码目录 [默认 D:\桌面\deepseek-harness-master]"
if ([string]::IsNullOrWhiteSpace($dst)) { $dst = 'D:\桌面\deepseek-harness-master' }
if (-not (Test-Path $dst)) { Write-Host "[错误] 找不到 $dst" -ForegroundColor Red; exit 1 }

Write-Host '[1/3] 复制群聊插件 packages\qunliao ...' -ForegroundColor Cyan
robocopy "$here\packages\qunliao" "$dst\packages\qunliao" /E /XD node_modules .git /NFL /NDL /NJH /NJS /NP | Out-Null

Write-Host '[2/3] 打补丁（侧边栏槽位 / 事件白名单 / web-app 注册 / 根 tsconfig）...' -ForegroundColor Cyan
Get-ChildItem "$here\patches" -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring((Resolve-Path "$here\patches").Path.Length + 1)
  $target = Join-Path $dst $rel
  $dir = Split-Path $target -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Copy-Item -LiteralPath $_.FullName -Destination $target -Force
  Write-Host "  + $rel" -ForegroundColor Green
}

Write-Host '[3/3] 重建 node_modules 依赖链接（保留 .pnpm 依赖库；有网络也可改跑 pnpm install）...' -ForegroundColor Cyan
node (Join-Path $here 'rebuild-d-node-modules.mjs') $dst
if ($LASTEXITCODE -ne 0) { Write-Host '[错误] 依赖链接重建失败' -ForegroundColor Red; exit 1 }

Write-Host ''
Write-Host '安装完成！启动方式（任选其一）：' -ForegroundColor Green
Write-Host "  1) 开发模式：cd $dst ; pnpm dev:web"
Write-Host "  2) 生产构建：cd $dst ; pnpm build:web"
Write-Host '  3) 如你的 deepseek-harness 版本与此插件版本（0.1.0-rc.5）不一致，请先同步版本再使用。'
