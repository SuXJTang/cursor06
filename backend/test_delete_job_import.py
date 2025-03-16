import requests
import json

# 1. 登录获取令牌
print("===== 步骤1: 登录获取令牌 =====")
login_url = "http://127.0.0.1:8000/api/v1/auth/login"
login_data = {"username": "admin@example.com", "password": "admin123"}
login_response = requests.post(login_url, data=login_data)
print(f"登录状态码: {login_response.status_code}")

if login_response.status_code == 200:
    token_data = login_response.json()
    token = token_data["access_token"]
    print(f"获取到的令牌: {token[:20]}...")
    
    # 2. 获取所有导入记录
    print("\n===== 步骤2: 获取所有导入记录 =====")
    imports_url = "http://127.0.0.1:8000/api/v1/job-imports/"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    imports_response = requests.get(imports_url, headers=headers)
    print(f"获取导入记录状态码: {imports_response.status_code}")
    
    if imports_response.status_code == 200:
        import_records = imports_response.json()
        
        if len(import_records) > 0:
            # 找到最后一个导入记录进行删除测试
            import_to_delete = import_records[-1]
            import_id = import_to_delete["id"]
            import_filename = import_to_delete["filename"]
            
            print(f"\n将删除导入记录: {import_filename} (ID: {import_id})")
            
            # 3. 删除导入记录
            print("\n===== 步骤3: 删除导入记录 =====")
            delete_url = f"http://127.0.0.1:8000/api/v1/job-imports/{import_id}"
            
            delete_response = requests.delete(delete_url, headers=headers)
            print(f"删除导入记录状态码: {delete_response.status_code}")
            
            if delete_response.status_code == 200 or delete_response.status_code == 204:
                print(f"导入记录 {import_filename} (ID: {import_id}) 已成功删除!")
                
                # 4. 验证导入记录已删除
                print("\n===== 步骤4: 验证导入记录已删除 =====")
                verify_url = f"http://127.0.0.1:8000/api/v1/job-imports/{import_id}"
                
                verify_response = requests.get(verify_url, headers=headers)
                print(f"验证删除状态码: {verify_response.status_code}")
                
                if verify_response.status_code == 404:
                    print(f"验证成功: 导入记录 ID {import_id} 已不存在")
                    print("\n删除导入记录功能测试成功!")
                else:
                    print(f"验证失败: 导入记录 ID {import_id} 仍然存在")
                    print("\n删除导入记录功能测试失败!")
            else:
                print(f"删除导入记录失败: {delete_response.text}")
        else:
            print("没有找到可删除的导入记录，请先进行批量导入")
    else:
        print(f"获取导入记录失败: {imports_response.text}")
else:
    print(f"登录失败: {login_response.text}") 