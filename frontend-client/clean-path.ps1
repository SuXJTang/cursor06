# 获取当前用户的PATH环境变量
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
Write-Host "开始清理环境变量PATH中的重复项..."

# 将路径按分号分割并去除空白项
$paths = $userPath -split ";" | Where-Object { $_ -ne "" }

# 创建一个哈希表来存储唯一路径
$uniquePaths = @{}
$nodePaths = @()

foreach ($path in $paths) {
    # 标准化路径（移除结尾的反斜杠）
    $normalizedPath = $path.TrimEnd("\")
    
    # 如果路径包含Node.js相关字符串，加入到Node路径列表
    if ($normalizedPath -match "nodejs|npm|node_modules|nvm") {
        $nodePaths += $normalizedPath
    }
    
    # 如果该路径还没有添加到哈希表，则添加它
    if (-not $uniquePaths.ContainsKey($normalizedPath)) {
        $uniquePaths[$normalizedPath] = $true
    }
}

# 将唯一路径连接回字符串
$newPath = $uniquePaths.Keys -join ";"

# 查看Node.js相关路径
Write-Host "找到以下Node.js相关路径:"
foreach ($path in $nodePaths) {
    Write-Host "  $path"
}

# 确保 Node.js 主要路径在干净的PATH中
Write-Host "`n推荐保留的Node.js路径:"
$nodePath = "D:\Program Files\nodejs"
$npmPath = "C:\Users\1024\AppData\Roaming\npm"

Write-Host "  $nodePath"
Write-Host "  $npmPath"

# 询问是否设置环境变量
$response = Read-Host "`n是否要更新环境变量? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    # 确保关键Node.js路径存在于新PATH中
    if (-not $newPath.Contains($nodePath)) {
        $newPath = "$nodePath;$newPath"
    }
    if (-not $newPath.Contains($npmPath)) {
        $newPath = "$npmPath;$newPath"
    }
    
    # 设置新的PATH环境变量
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "环境变量已更新。需要重新启动命令行以应用更改。"
} else {
    Write-Host "操作已取消，未更改环境变量。"
} 