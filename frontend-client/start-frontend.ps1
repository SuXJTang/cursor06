# 检查端口5173是否被占用并启动前端服务
Write-Host "正在检查端口5173..." -ForegroundColor Yellow

# 查找占用端口5173的进程
$processInfo = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($processInfo) {
    $process = Get-Process -Id $processInfo -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "端口5173被进程 $($process.ProcessName) (PID: $($process.Id)) 占用，正在结束..." -ForegroundColor Red
        try {
            Stop-Process -Id $process.Id -Force
            Write-Host "进程已结束" -ForegroundColor Green
            # 等待端口释放
            Start-Sleep -Seconds 2
        } catch {
            Write-Host "无法结束进程: $_" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "端口5173未被占用" -ForegroundColor Green
}

# 启动前端服务
Write-Host "正在启动前端服务..." -ForegroundColor Yellow
Set-Location -Path $PSScriptRoot
npm run dev 