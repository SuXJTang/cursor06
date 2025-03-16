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
        "title": "测试岗位",
        "company": "测试公司",
        "description": "测试描述",
        "requirements": "测试要求",
        "salary_range": "10k-15k",
        "location": "测试地点",
        "job_type": "全职",
        "category_id": 1,
        "experience_required": "1年",
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