@echo off
echo 正在检查端口5173...

REM 查找占用端口5173的进程
SET pid=
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') DO (
    SET pid=%%P
)

IF NOT "%pid%"=="" (
    echo 端口5173被进程PID: %pid% 占用，正在结束...
    taskkill /F /PID %pid%
    IF ERRORLEVEL 1 (
        echo 无法结束进程！
        exit /b 1
    ) ELSE (
        echo 进程已结束
        timeout /t 2 /nobreak > nul
    )
) ELSE (
    echo 端口5173未被占用
)

echo 正在启动前端服务...
cd /d %~dp0
npm run dev 