$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
$headers = @{Authorization = "Bearer $token"}

$uri = "http://127.0.0.1:8000/api/v1/careers/search/?keyword=软件工程师"
Invoke-RestMethod -Uri $uri -Headers $headers | ConvertTo-Json -Depth 5 > search_output.json
Write-Host "Search results saved to search_output.json" 