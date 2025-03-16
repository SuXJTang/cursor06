import requests
import json
import os
import time

# 1. 登录获取令牌
print("===== 步骤1: 登录获取令牌 =====")
login_url = "http://127.0.0.1:8000/api/v1/auth/login"
login_data = {"username": "admin@example.com", "password": "admin123"}
login_response = requests.post(login_url, data=login_data)
print(f"登录状态码: {login_response.status_code}")
print(f"登录响应: {login_response.text}")

if login_response.status_code == 200:
    token_data = login_response.json()
    token = token_data["access_token"]
    print(f"获取到的令牌: {token[:20]}...")
    
    # 2. 创建导入记录
    print("\n===== 步骤2: 创建导入记录 =====")
    import_url = "http://127.0.0.1:8000/api/v1/job-imports/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    import_data = {
        "filename": "test_import.xlsx",
        "total_count": 10,
        "success_count": 8,
        "failed_count": 2,
        "status": "completed",
        "importer_id": 1  # 添加导入者ID
    }
    
    print(f"发送请求到: {import_url}")
    print(f"请求头: {headers}")
    print(f"请求数据: {import_data}")
    
    import_response = requests.post(import_url, headers=headers, json=import_data)
    print(f"创建导入记录状态码: {import_response.status_code}")
    print(f"创建导入记录响应: {import_response.text}")
    
    if import_response.status_code == 200 or import_response.status_code == 201:
        try:
            import_record = import_response.json()
            import_id = import_record.get("id")
            print(f"成功创建导入记录，ID: {import_id}")
            
            # 等待一下，确保数据已写入
            time.sleep(1)
            
            # 3. 删除导入记录
            print("\n===== 步骤3: 删除导入记录 =====")
            delete_url = f"http://127.0.0.1:8000/api/v1/job-imports/{import_id}"
            
            print(f"发送请求到: {delete_url}")
            print(f"请求头: {headers}")
            
            delete_response = requests.delete(delete_url, headers=headers)
            print(f"删除导入记录状态码: {delete_response.status_code}")
            print(f"删除导入记录响应: {delete_response.text}")
            
            if delete_response.status_code == 200 or delete_response.status_code == 204:
                print(f"成功删除导入记录，ID: {import_id}")
                
                # 等待一下，确保数据已删除
                time.sleep(1)
                
                # 4. 验证导入记录已删除
                print("\n===== 步骤4: 验证导入记录已删除 =====")
                verify_url = f"http://127.0.0.1:8000/api/v1/job-imports/{import_id}"
                
                print(f"发送请求到: {verify_url}")
                print(f"请求头: {headers}")
                
                verify_response = requests.get(verify_url, headers=headers)
                print(f"验证删除状态码: {verify_response.status_code}")
                print(f"验证删除响应: {verify_response.text}")
                
                if verify_response.status_code == 404:
                    print(f"验证成功: 导入记录 ID {import_id} 已不存在")
                    print("\n删除导入记录功能测试成功!")
                else:
                    print(f"验证失败: 导入记录 ID {import_id} 仍然存在")
                    print("\n删除导入记录功能测试失败!")
            else:
                print(f"删除导入记录失败: {delete_response.text}")
        except Exception as e:
            print(f"解析响应失败: {str(e)}")
    else:
        print(f"创建导入记录失败: {import_response.text}")
else:
    print(f"登录失败: {login_response.text}") 