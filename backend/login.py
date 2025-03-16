import requests
import json

# API端点
url = "http://127.0.0.1:8000/api/v1/auth/login"

# 登录数据
login_data = {
    "username": "admin@example.com",
    "password": "admin123"
}

# 发送POST请求
response = requests.post(url, data=login_data)

# 打印响应
print(f"状态码: {response.status_code}")
print("响应内容:")
try:
    print(json.dumps(response.json(), indent=4, ensure_ascii=False))
except:
    print(response.text) 