import requests
import json

# API端点
url = "http://127.0.0.1:8000/api/v1/jobs/"

# 认证令牌
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE2NjU5NTksInN1YiI6IjEifQ.3GwjZ9vVoioG6Mu2G6W40Px1Krz5gnj1NeMjmydHdoU"

# 请求头
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# 岗位数据
job_data = {
    "title": "测试岗位",
    "company": "测试公司",
    "description": "这是一个测试岗位描述",
    "requirements": "无特殊要求",
    "skills": ["Python", "FastAPI"],
    "salary_range": "10k-15k",
    "location": "远程",
    "job_type": "全职",
    "category_id": 1,
    "experience_required": "1年以上",
    "education_required": "本科",
    "benefits": ["五险一金", "年终奖"]
}

# 发送POST请求
response = requests.post(url, headers=headers, json=job_data)

# 打印响应
print(f"状态码: {response.status_code}")
print("响应内容:")
try:
    print(json.dumps(response.json(), indent=4, ensure_ascii=False))
except:
    print(response.text) 