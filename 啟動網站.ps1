$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeBin = "C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$pnpm = "C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
$env:Path = "$nodeBin;$env:Path"

Set-Location -LiteralPath $project
Start-Job -ScriptBlock {
  Start-Sleep -Seconds 3
  Start-Process "http://localhost:3000"
} | Out-Null

Write-Host "SNL 短影音企劃工作台啟動中..." -ForegroundColor Cyan
Write-Host "瀏覽器開啟後，請保留這個視窗；關閉視窗即可停止網站。" -ForegroundColor DarkGray
& $pnpm run dev
