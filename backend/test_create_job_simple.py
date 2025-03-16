import requests
import json
import traceback

# API端点
url = "http://127.0.0.1:8000/api/v1/jobs/"

# 认证令牌 - 使用最新获取的令牌
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE2NjY1NzMsInN1YiI6IjEifQ.M5POfACoDKzkPmbgPB1ayQH4sYFvYpLxswWjCrCMWmE"

# 请求头
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# 极简岗位数据 - 只包含必填字段
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

try:
    print("发送请求...")
    print(f"URL: {url}")
    print(f"Headers: {headers}")
    print(f"Data: {json.dumps(job_data, ensure_ascii=False)}")
    
    # 发送POST请求
    response = requests.post(url, headers=headers, json=job_data)
    
    print(f"\n状态码: {response.status_code}")
    print(f"响应头: {dict(response.headers)}")
    print("响应内容:")
    
    try:
        print(json.dumps(response.json(), indent=4, ensure_ascii=False))
    except:
        print(response.text)
        
except Exception as e:
    print(f"发生错误: {str(e)}")
    print(traceback.format_exc()) 