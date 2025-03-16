import requests
import json
import time
import os

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
    
    # 2. 批量导入岗位
    print("\n===== 步骤2: 批量导入岗位 =====")
    import_url = "http://127.0.0.1:8000/api/v1/job-imports/upload"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # 确认测试文件存在
    test_file_path = "test_jobs.xlsx"
    if not os.path.exists(test_file_path):
        print(f"错误: 测试文件 {test_file_path} 不存在")
        exit(1)
    
    # 上传文件
    files = {
        "file": ("test_jobs.xlsx", open(test_file_path, "rb"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }
    
    print(f"发送请求到: {import_url}")
    print(f"上传文件: {test_file_path}")
    
    import_response = requests.post(import_url, headers=headers, files=files)
    print(f"导入请求状态码: {import_response.status_code}")
    
    if import_response.status_code == 200:
        import_data = import_response.json()
        import_id = import_data.get("id")
        print(f"导入ID: {import_id}")
        
        # 3. 检查导入状态
        print("\n===== 步骤3: 检查导入状态 =====")
        # 使用正确的端点路径
        status_url = f"http://127.0.0.1:8000/api/v1/job-imports/{import_id}"
        
        # 循环检查状态，直到完成或超时
        max_attempts = 10
        for attempt in range(max_attempts):
            print(f"检查状态 (尝试 {attempt+1}/{max_attempts})...")
            status_response = requests.get(status_url, headers={"Authorization": f"Bearer {token}"})
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                status = status_data.get("status")
                print(f"当前状态: {status}")
                print(f"总数: {status_data.get('total_count')}")
                print(f"成功: {status_data.get('success_count')}")
                print(f"失败: {status_data.get('failed_count')}")
                
                if status == "completed":
                    print("\n批量导入完成!")
                    break
                elif status == "failed":
                    print("\n批量导入失败!")
                    break
            else:
                print(f"获取状态失败: {status_response.text}")
            
            # 等待后再次检查
            time.sleep(2)
        
        # 4. 检查数据库中是否成功添加
        print("\n===== 步骤4: 检查数据库中是否成功添加 =====")
        # 直接检查数据库
        import mysql.connector
        
        try:
            # 连接数据库
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="123456",
                database="cursor06"
            )
            cursor = conn.cursor(dictionary=True)
            
            # 检查jobs表
            cursor.execute("SELECT COUNT(*) as count FROM jobs")
            job_count = cursor.fetchone()["count"]
            print(f"jobs表中的记录数: {job_count}")
            
            # 检查是否有特定职位
            cursor.execute("SELECT * FROM jobs WHERE title = '数据分析师' OR title = '前端开发工程师' OR title = 'Python高级开发工程师'")
            jobs = cursor.fetchall()
            
            if jobs:
                print("\n找到以下职位:")
                for job in jobs:
                    print(f"- {job['title']} (ID: {job['id']})")
                print("\n批量添加岗位功能测试成功!")
            else:
                print("\n未找到批量添加的岗位")
                
            # 检查job_imports表
            cursor.execute("SELECT * FROM job_imports ORDER BY id DESC LIMIT 1")
            import_record = cursor.fetchone()
            
            if import_record:
                print("\n最新导入记录:")
                print(f"ID: {import_record['id']}")
                print(f"文件名: {import_record['filename']}")
                print(f"总数: {import_record['total_count']}")
                print(f"成功: {import_record['success_count']}")
                print(f"失败: {import_record['failed_count']}")
                print(f"状态: {import_record['status']}")
            
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"数据库检查出错: {str(e)}")
    else:
        print(f"导入请求失败: {import_response.text}")
else:
    print(f"登录失败: {login_response.text}")
