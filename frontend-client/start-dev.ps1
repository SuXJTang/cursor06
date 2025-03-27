Write-Host "正在启动开发服务器..."
cd $PSScriptRoot
$env:NODE_PATH = Join-Path $PSScriptRoot "node_modules"
node (Join-Path $PSScriptRoot "node_modules\vite\bin\vite.js") 