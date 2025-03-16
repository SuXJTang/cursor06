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
    
    # 2. 添加岗位
    print("\n===== 步骤2: 添加岗位 =====")
    jobs_url = "http://127.0.0.1:8000/api/v1/jobs/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    job_data = {
        "title": "测试岗位API",
        "company": "测试公司",
        "description": "这是一个用于测试API的岗位",
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
    print(f"添加岗位响应: {job_response.text}")
    
    if job_response.status_code == 200 or job_response.status_code == 201:
        try:
            new_job = job_response.json()
            job_id = new_job.get("id")
            print(f"成功添加岗位，ID: {job_id}")
            
            # 3. 删除岗位
            print("\n===== 步骤3: 删除岗位 =====")
            delete_url = f"http://127.0.0.1:8000/api/v1/jobs/{job_id}"
            
            delete_response = requests.delete(delete_url, headers=headers)
            print(f"删除岗位状态码: {delete_response.status_code}")
            print(f"删除岗位响应: {delete_response.text}")
            
            if delete_response.status_code == 200 or delete_response.status_code == 204:
                print(f"成功删除岗位，ID: {job_id}")
            else:
                print(f"删除岗位失败")
        except Exception as e:
            print(f"解析响应失败: {str(e)}")
    else:
        print(f"添加岗位失败")
else:
    print(f"登录失败: {login_response.text}") 