#!/bin/bash
# 设置参数
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1NTAzMzYsInN1YiI6IjEifQ.0PlNYALurwyaOWZnqJD9pqDsxuyl3PauyulnpRNX2dU"
CAREER_ID=476
BASE_URL="http://localhost:8000/api/v1"

echo "===== 使用curl测试收藏职业API ====="

# 1. 收藏职业
echo -e "\n1. 测试收藏职业"
curl -X POST "$BASE_URL/careers/$CAREER_ID/favorite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v

# 2. 检查收藏状态
echo -e "\n\n2. 测试检查收藏状态"
curl "$BASE_URL/careers/$CAREER_ID/is_favorite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v

# 3. 获取收藏列表
echo -e "\n\n3. 测试获取收藏列表"
curl "$BASE_URL/careers/user/favorites" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v

# 4. 取消收藏
echo -e "\n\n4. 测试取消收藏"
curl -X DELETE "$BASE_URL/careers/$CAREER_ID/favorite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v

# 5. 再次检查收藏状态
echo -e "\n\n5. 再次测试检查收藏状态"
curl "$BASE_URL/careers/$CAREER_ID/is_favorite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v 