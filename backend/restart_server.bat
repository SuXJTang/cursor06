@echo off
echo 正在重启服务器...

:: 检查并结束正在运行的服务器进程
taskkill /F /IM python.exe /FI "WINDOWTITLE eq 职业推荐系统API服务" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 已关闭正在运行的服务器实例
) else (
    echo 未找到正在运行的服务器实例
)

:: 激活虚拟环境并启动服务器
cd /d %~dp0
echo 正在启动服务器...
call venv\Scripts\activate.bat
cd ..
python -m app.main

echo 服务器启动完成
pause 