import requests
import json

# 获取令牌
login_url = "http://127.0.0.1:8000/api/v1/auth/login"
login_data = {"username": "admin@example.com", "password": "admin123"}
login_response = requests.post(login_url, data=login_data)
print("登录响应:", login_response.status_code)
print(login_response.text)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    
    # 创建岗位
    job_url = "http://127.0.0.1:8000/api/v1/jobs/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    job_data = {
        "title": "产品经理",
        "company": "创新科技有限公司",
        "description": "负责产品规划和设计",
        "requirements": "熟悉产品开发流程",
        "salary_range": "15k-25k",
        "location": "上海",
        "job_type": "全职",
        "category_id": 1,
        "experience_required": "3年",
        "education_required": "本科"
    }
    
    print("\n发送请求:")
    print(f"URL: {job_url}")
    print(f"Headers: {headers}")
    print(f"Data: {json.dumps(job_data, ensure_ascii=False)}")
    
    job_response = requests.post(job_url, headers=headers, json=job_data)
    
    print("\n创建岗位响应:", job_response.status_code)
    print("响应头:", dict(job_response.headers))
    try:
        print(json.dumps(job_response.json(), indent=4, ensure_ascii=False))
    except:
        print(job_response.text)
        
    # 检查岗位是否创建成功
    print("\n检查岗位列表:")
    list_response = requests.get(job_url, headers={"Authorization": f"Bearer {token}"})
    try:
        jobs = list_response.json()
        print(f"岗位数量: {len(jobs)}")
        for job in jobs:
            print(f"ID: {job.get('id')}, 标题: {job.get('title')}, 公司: {job.get('company')}")
    except:
        print("获取岗位列表失败:", list_response.text) 