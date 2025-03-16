import requests
import json
import traceback

# API端点
url = "http://127.0.0.1:8000/api/v1/jobs/"

# 认证令牌
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE2NjU5NTksInN1YiI6IjEifQ.3GwjZ9vVoioG6Mu2G6W40Px1Krz5gnj1NeMjmydHdoU"

# 请求头
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# 简化的岗位数据
job_data = {
    "title": "测试岗位",
    "company": "测试公司",
    "description": "这是一个测试岗位描述",
    "requirements": "无特殊要求",
    "salary_range": "10k-15k",
    "location": "远程",
    "job_type": "全职",
    "category_id": 1,
    "experience_required": "1年以上",
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