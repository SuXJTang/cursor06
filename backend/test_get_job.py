import requests
import json

# API 地址
BASE_URL = "http://127.0.0.1:8000/api/v1"
LOGIN_URL = f"{BASE_URL}/auth/login"
JOB_URL = f"{BASE_URL}/jobs"

def main():
    print("===== 步骤1: 登录获取令牌 =====")
    
    # 登录获取令牌
    login_data = {"username": "admin@example.com", "password": "admin123"}
    login_response = requests.post(LOGIN_URL, data=login_data)
    print(f"登录状态码: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print(f"登录失败: {login_response.text}")
        return
    
    token_data = login_response.json()
    access_token = token_data["access_token"]
    
    # 简化令牌显示
    display_token = access_token[:15] + "..."
    print(f"获取到的令牌: {display_token}")
    
    # 设置认证头
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 测试获取岗位列表
    print("\n===== 步骤2: 获取岗位列表 =====")
    jobs_response = requests.get(JOB_URL, headers=headers)
    print(f"获取岗位列表状态码: {jobs_response.status_code}")
    
    if jobs_response.status_code != 200:
        print(f"获取岗位列表失败: {jobs_response.text}")
        return
    
    jobs = jobs_response.json()
    print(f"共获取到 {len(jobs)} 个岗位")
    
    if len(jobs) == 0:
        print("没有找到任何岗位")
        return
    
    # 选择第一个岗位进行详细查看
    job_id = jobs[0]["id"]
    job_title = jobs[0]["title"]
    
    # 测试获取单个岗位
    print(f"\n===== 步骤3: 获取单个岗位 (ID: {job_id}, 标题: {job_title}) =====")
    job_detail_url = f"{JOB_URL}/{job_id}"
    job_detail_response = requests.get(job_detail_url, headers=headers)
    print(f"获取单个岗位状态码: {job_detail_response.status_code}")
    
    if job_detail_response.status_code != 200:
        print(f"获取单个岗位失败: {job_detail_response.text}")
        return
    
    job_detail = job_detail_response.json()
    print("\n岗位详情:")
    print(f"ID: {job_detail['id']}")
    print(f"标题: {job_detail['title']}")
    print(f"公司: {job_detail['company']}")
    print(f"描述: {job_detail['description']}")
    print(f"要求: {job_detail['requirements']}")
    print(f"薪资范围: {job_detail['salary_range']}")
    print(f"地点: {job_detail['location']}")
    print(f"岗位类型: {job_detail['job_type']}")
    print(f"分类ID: {job_detail['category_id']}")
    print(f"经验要求: {job_detail['experience_required']}")
    print(f"学历要求: {job_detail['education_required']}")
    print(f"状态: {job_detail['status']}")
    print(f"创建时间: {job_detail['created_at']}")
    print(f"更新时间: {job_detail['updated_at']}")
    
    print("\n获取单个岗位功能测试成功!")

if __name__ == "__main__":
    main() 