import requests
import json

def pretty_print(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

# 基础URL
base_url = "http://localhost:8000/api/v1"

# 获取访问令牌
def get_access_token():
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    response = requests.post(f"{base_url}/auth/login", data=login_data, headers=headers)
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print(f"登录失败: {response.status_code}")
        print(response.text)
        return None

# 获取令牌
token = get_access_token()
if not token:
    print("无法获取访问令牌，请检查登录凭据")
    exit(1)

# 带有认证的请求头
headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {token}"
}

# 获取根职业分类及其子分类
print("=== 获取根职业分类及其子分类 ===")
response = requests.get(
    f"{base_url}/career-categories/roots", 
    params={"include_children": True, "include_all_children": True}, 
    headers=headers
)
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text) 