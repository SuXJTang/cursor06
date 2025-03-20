import os
import subprocess
import json
import requests

print("====== 步骤1: 使用curl登录获取令牌 ======")
login_cmd = """curl -s -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d "{\\"username\\":\\"admin11\\",\\"password\\":\\"password\\"}" """

try:
    # 执行登录请求
    login_result = subprocess.check_output(login_cmd, shell=True)
    
    try:
        token_data = json.loads(login_result)
        print(f"登录成功！响应数据:\n{json.dumps(token_data, indent=2, ensure_ascii=False)}")
        
        # 提取token
        access_token = token_data.get("access_token")
        if access_token:
            print(f"\n获取到的令牌: {access_token[:20]}...")
            
            print("\n====== 步骤2: 使用令牌获取用户资料 ======")
            profile_cmd = f"""curl -s -X GET http://localhost:8000/api/v1/user-profiles/me -H "Authorization: Bearer {access_token}" """
            
            # 执行获取用户资料请求
            profile_result = subprocess.check_output(profile_cmd, shell=True)
            
            try:
                profile_data = json.loads(profile_result)
                print(f"成功获取用户资料:\n{json.dumps(profile_data, indent=2, ensure_ascii=False)}")
            except json.JSONDecodeError:
                print(f"用户资料返回非JSON格式: {profile_result.decode('utf-8')}")
        else:
            print("登录响应中未找到access_token")
    except json.JSONDecodeError:
        print(f"登录返回非JSON格式: {login_result.decode('utf-8')}")
except subprocess.CalledProcessError as e:
    print(f"执行命令出错: {str(e)}")
    print(f"错误输出: {e.output.decode('utf-8') if hasattr(e, 'output') else 'None'}")
except Exception as e:
    print(f"发生异常: {str(e)}")

def pretty_print(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

# 基础URL
base_url = "http://localhost:8000/api/v1"

# 1. 测试获取根职业分类及其子分类
print("=== 测试获取根职业分类及其子分类 ===")
response = requests.get(f"{base_url}/career-categories/roots", params={"include_children": True})
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text)

# 2. 测试获取职业分类树
print("\n=== 测试获取职业分类树 ===")
# 假设有一个ID为1的分类
category_id = 1
response = requests.get(f"{base_url}/career-categories/{category_id}/tree")
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text)

# 3. 测试获取职业列表（带缓存）
print("\n=== 测试获取职业列表（带缓存） ===")
response = requests.get(f"{base_url}/careers/")
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text)

# 4. 测试按分类获取职业
print("\n=== 测试按分类获取职业 ===")
category_id = 1  # 假设有一个ID为1的分类
response = requests.get(f"{base_url}/careers/category/{category_id}")
if response.status_code == 200:
    pretty_print(response.json())
else:
    print(f"请求失败: {response.status_code}")
    print(response.text) 