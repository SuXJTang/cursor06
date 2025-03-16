import requests
import json
import time
import random

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
    
    # 2. 添加新岗位
    print("\n===== 步骤2: 添加新岗位 =====")
    jobs_url = "http://127.0.0.1:8000/api/v1/jobs/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 生成随机数，确保每次测试的岗位标题不同
    random_num = random.randint(1000, 9999)
    
    job_data = {
        "title": f"测试岗位-{random_num}",
        "company": "测试公司",
        "description": "这是一个用于测试添加功能的岗位",
        "requirements": "测试要求",
        "skills": ["Python", "测试技能"],
        "education_required": "本科",
        "experience_required": "2年",
        "salary_range": "15k-20k",
        "location": "北京",
        "job_type": "全职",
        "status": "active",
        "benefits": ["五险一金", "带薪年假"],
        "category_id": 1
    }
    
    job_response = requests.post(jobs_url, headers=headers, json=job_data)
    print(f"添加岗位状态码: {job_response.status_code}")
    
    if job_response.status_code == 200 or job_response.status_code == 201:
        new_job = job_response.json()
        job_id = new_job.get("id")
        job_title = new_job.get("title")
        print(f"成功添加岗位: {job_title} (ID: {job_id})")
        
        # 3. 验证岗位已添加
        print("\n===== 步骤3: 验证岗位已添加 =====")
        verify_url = f"http://127.0.0.1:8000/api/v1/jobs/{job_id}"
        
        # 稍微等待一下，确保数据已写入
        time.sleep(1)
        
        verify_response = requests.get(verify_url, headers=headers)
        print(f"验证添加状态码: {verify_response.status_code}")
        
        if verify_response.status_code == 200:
            verified_job = verify_response.json()
            print(f"验证成功: 找到岗位 {verified_job['title']} (ID: {verified_job['id']})")
            print("\n添加岗位功能测试成功!")
            
            # 检查数据一致性
            print("\n===== 步骤4: 验证数据一致性 =====")
            for key in job_data:
                if key in verified_job:
                    if isinstance(job_data[key], list) and isinstance(verified_job[key], list):
                        # 对于列表类型的字段，检查长度是否相同
                        if len(job_data[key]) == len(verified_job[key]):
                            print(f"字段 {key} 验证成功")
                        else:
                            print(f"字段 {key} 验证失败: 预期值 {job_data[key]}, 实际值 {verified_job[key]}")
                    elif str(job_data[key]) == str(verified_job[key]):
                        print(f"字段 {key} 验证成功")
                    else:
                        print(f"字段 {key} 验证失败: 预期值 {job_data[key]}, 实际值 {verified_job[key]}")
        else:
            print(f"验证失败: 无法找到新添加的岗位")
            print("\n添加岗位功能测试失败!")
    else:
        print(f"添加岗位失败: {job_response.text}")
else:
    print(f"登录失败: {login_response.text}") 