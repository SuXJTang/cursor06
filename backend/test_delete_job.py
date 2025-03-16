import requests
import json
import time

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
    
    # 步骤2: 创建一个新岗位用于测试删除
    print("\n===== 步骤2: 创建测试岗位 =====")
    
    job_data = {
        "title": "测试删除的岗位",
        "company": "测试公司",
        "description": "这是一个用于测试删除功能的岗位",
        "requirements": "无特殊要求",
        "salary_range": "10k-15k",
        "location": "远程",
        "job_type": "全职",
        "category_id": 1,
        "experience_required": "1年",
        "education_required": "本科"
    }
    
    create_response = requests.post(JOB_URL, headers=headers, json=job_data)
    print(f"创建岗位状态码: {create_response.status_code}")
    
    if create_response.status_code != 200:
        print(f"创建岗位失败: {create_response.text}")
        return
    
    created_job = create_response.json()
    job_id = created_job["id"]
    job_title = created_job["title"]
    
    print(f"成功创建岗位，ID: {job_id}, 标题: {job_title}")
    
    # 步骤3: 删除刚创建的岗位
    print(f"\n===== 步骤3: 删除岗位 (ID: {job_id}) =====")
    delete_url = f"{JOB_URL}/{job_id}"
    delete_response = requests.delete(delete_url, headers=headers)
    print(f"删除岗位状态码: {delete_response.status_code}")
    
    if delete_response.status_code != 200:
        print(f"删除岗位失败: {delete_response.text}")
        return
    
    print("岗位删除成功！")
    
    # 步骤4: 验证岗位已被删除
    print(f"\n===== 步骤4: 验证岗位已被删除 =====")
    time.sleep(1)  # 等待一秒，确保删除操作已完成
    
    verify_response = requests.get(delete_url, headers=headers)
    print(f"验证状态码: {verify_response.status_code}")
    
    if verify_response.status_code == 404:
        print("验证成功：岗位已被删除")
    else:
        print(f"验证失败：岗位可能未被成功删除，响应内容: {verify_response.text}")
    
    print("\n删除岗位功能测试完成!")

if __name__ == "__main__":
    main() 