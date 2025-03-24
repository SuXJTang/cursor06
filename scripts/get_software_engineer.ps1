$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
$headers = @{Authorization = "Bearer $token"}

Write-Host "获取技术开发（ID=32）分类下的职业数据..."
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/careers/category/32" -Headers $headers
$careersJson = $response | ConvertTo-Json -Depth 5 
Write-Host $careersJson

Write-Host "`n搜索'软件工程师'关键词的职业数据..."
try {
    $searchResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/careers/search/?keyword=软件工程师" -Headers $headers
    $searchJson = $searchResponse | ConvertTo-Json -Depth 5
    Write-Host $searchJson
} catch {
    Write-Host "搜索查询出错: $_"
} 