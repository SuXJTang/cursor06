import requests
import json

def pretty_print(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

# 基础URL
base_url = "http://localhost:8000/api/v1"

# 获取访问令牌
def get_access_token():
    # 使用表单数据而不是JSON
    login_data = {
        "username": "admin@example.com",  # 正确的管理员用户名
        "password": "admin123"            # 正确的管理员密码
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

# 1. 测试获取根职业分类及其子分类（包括所有层级的子分类）
print("=== 测试获取根职业分类及其子分类（包括三级分类） ===")
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

# 2. 测试获取职业分类树
print("\n=== 测试获取职业分类树 ===")
# 假设有一个ID为1的分类
category_id = 1
response = requests.get(f"{base_url}/career-categories/{category_id}/tree", headers=headers)
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text)

# 3. 测试获取职业列表（带缓存）
print("\n=== 测试获取职业列表（带缓存） ===")
response = requests.get(f"{base_url}/careers/", headers=headers)
if response.status_code == 200:
    print("第一次请求（未缓存）:")
    pretty_print(response.json())
    
    # 再次请求，应该使用缓存
    print("\n第二次请求（应使用缓存）:")
    response = requests.get(f"{base_url}/careers/", headers=headers)
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text)

# 4. 测试按分类获取职业
print("\n=== 测试按分类获取职业 ===")
category_id = 1  # 假设有一个ID为1的分类
response = requests.get(f"{base_url}/careers/category/{category_id}", headers=headers)
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text) 