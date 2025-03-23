$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
$headers = @{Authorization = "Bearer $token"}

Write-Host "Getting careers for category ID 32 (Technology Development)..."
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/careers/category/32" -Headers $headers
    $careersJson = $response | ConvertTo-Json -Depth 5 
    Write-Host $careersJson
} catch {
    Write-Host "Error querying careers: $($_.Exception.Message)"
}

Write-Host "`nSearching for 'Software Engineer' careers..."
try {
    $searchResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/careers/search/?keyword=软件工程师" -Headers $headers
    $searchJson = $searchResponse | ConvertTo-Json -Depth 5
    Write-Host $searchJson
} catch {
    Write-Host "Error in search query: $($_.Exception.Message)"
} 