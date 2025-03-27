@echo off
echo 设置环境变量...

:: 设置 Node.js 的安装位置
set NODE_EXE="C:\Program Files\nodejs\node.exe"
if not exist %NODE_EXE% (
    echo 找不到 Node.js，请确保已正确安装在 C:\Program Files\nodejs
    pause
    exit /b 1
)

set NODE_PATH=%~dp0node_modules
echo 找到 Node.js: %NODE_EXE%
echo 正在启动开发服务器...
%NODE_EXE% %~dp0node_modules\vite\bin\vite.js 