import requests
import json
import time

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
    
    # 2. 创建单个岗位
    print("\n===== 步骤2: 创建单个岗位 =====")
    job_url = "http://127.0.0.1:8000/api/v1/jobs/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 岗位数据
    job_data = {
        "title": "AI研发工程师",
        "company": "智能未来科技",
        "description": "负责AI模型的研发和优化",
        "requirements": "熟悉机器学习和深度学习算法",
        "salary_range": "30k-50k",
        "location": "深圳",
        "job_type": "全职",
        "category_id": 1,
        "experience_required": "3年以上",
        "education_required": "硕士及以上"
    }
    
    print(f"发送请求到: {job_url}")
    print(f"请求数据: {json.dumps(job_data, ensure_ascii=False)}")
    
    job_response = requests.post(job_url, headers=headers, json=job_data)
    print(f"创建岗位状态码: {job_response.status_code}")
    
    # 3. 检查数据库中是否成功添加
    print("\n===== 步骤3: 检查数据库中是否成功添加 =====")
    # 等待数据写入
    time.sleep(1)
    
    # 使用脚本检查数据库
    import subprocess
    result = subprocess.run(["python", "check_jobs_table.py"], capture_output=True, text=True)
    print("数据库检查结果:")
    print(result.stdout)
    
    if "AI研发工程师" in result.stdout:
        print("\n单个添加岗位功能测试成功!")
    else:
        print("\n未找到新添加的岗位，请检查数据库")
else:
    print(f"登录失败: {login_response.text}")
