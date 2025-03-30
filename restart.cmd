@echo off
chcp 65001 >nul
echo ========================================
echo    项目环境重启工具
echo ========================================

echo [1] 停止现有进程...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo [2] 检查端口占用情况...
netstat -ano | findstr :8000
if %ERRORLEVEL% EQU 0 (
    echo 警告: 端口8000已被占用，可能会导致后端启动失败
)
netstat -ano | findstr :5173
if %ERRORLEVEL% EQU 0 (
    echo 警告: 端口5173已被占用，前端可能会使用其他端口
)

timeout /t 2 /nobreak >nul

echo [3] 启动后端服务器...
start cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

echo [4] 启动前端开发服务器...
start cmd /k "cd frontend-client && npm run dev"

echo.
echo ========================================
echo    启动完成
echo ========================================
echo.
echo 访问地址:
echo - 后端API: http://127.0.0.1:8000
echo - 前端页面: http://127.0.0.1:5173
echo.
echo 常见问题:
echo - 如果遇到登录问题，请尝试使用IP地址而非localhost
echo - 如果前端端口被占用，可能会自动切换到5174或其他端口
echo - 出现"连接被拒绝"错误时，请检查后端服务是否正常运行
echo.
echo 按任意键退出...
pause >nul 