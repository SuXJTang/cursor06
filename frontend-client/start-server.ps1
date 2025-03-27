$env:NODE_PATH = $pwd.Path + '\node_modules'
Write-Host "正在启动开发服务器..."
node node_modules/vite/bin/vite.js 