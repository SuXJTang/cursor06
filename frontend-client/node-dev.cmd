@echo off
echo 正在启动开发服务器...

:: 检查 Node.js 是否存在
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo 错误: Node.js 未安装或未添加到 PATH 中
  pause
  exit /b 1
)

:: 设置 Vite 路径
set "VITE_PATH=%~dp0node_modules\vite\bin\vite.js"

:: 检查 Vite 是否存在
if not exist "%VITE_PATH%" (
  echo 错误: 找不到 Vite 在 %VITE_PATH%
  echo 请确保已安装项目依赖
  pause
  exit /b 1
)

echo 使用 Node.js: 全局安装版本
echo 使用 Vite: %VITE_PATH%

:: 先尝试终止可能已经运行的Vite进程
taskkill /f /im node.exe /fi "WINDOWTITLE eq vite" >nul 2>&1

:: 启动 Vite 服务器，使用备用端口
node "%VITE_PATH%" --port 5174 