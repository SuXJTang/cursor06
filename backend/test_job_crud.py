import requests
import json
import time
import random

# 基本API地址
BASE_URL = "http://localhost:8000/api/v1"

def login():
    """登录并获取访问令牌"""
    login_url = f"{BASE_URL}/auth/login"
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    response = requests.post(login_url, data=login_data)
    print("===== 登录获取令牌 =====")
    print(f"登录状态码: {response.status_code}")
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"获取到的令牌: {token[:10]}...")
        return {"Authorization": f"Bearer {token}"}
    else:
        print(f"登录失败: {response.text}")
        return None

def create_job(headers):
    """创建新岗位"""
    print("\n===== 测试创建岗位 =====")
    # 准备岗位数据
    job_data = {
        "title": f"测试岗位-{random.randint(1000, 9999)}",
        "company": "测试公司",
        "description": "这是一个测试岗位描述",
        "requirements": "测试要求",
        "skills": json.dumps(["Python", "FastAPI", "SQL"]),
        "salary_range": json.dumps({
            "min": 5000,
            "max": 10000,
            "currency": "CNY",
            "period": "monthly"
        }),
        "location": "北京",
        "category_id": 1,
        "status": "active",
        "job_type": "全职",
        "experience_required": "2年",
        "education_required": "本科",
        "benefits": json.dumps({
            "insurance": ["五险一金"],
            "bonus": ["年终奖"],
            "vacation": ["带薪休假"],
            "others": ["免费下午茶", "团建活动"]
        })
    }
    print(f"创建岗位数据: {json.dumps(job_data)}")
    
    create_url = f"{BASE_URL}/jobs/"
    response = requests.post(create_url, json=job_data, headers=headers)
    print(f"创建岗位状态码: {response.status_code}")
    
    if response.status_code == 200:
        job = response.json()
        print(f"成功创建岗位: {job['title']}, ID: {job['id']}")
        return job
    else:
        print(f"创建岗位失败: {response.text}")
        return None

def get_job_list(headers):
    """获取岗位列表"""
    list_url = f"{BASE_URL}/jobs/"
    
    print("\n===== 测试获取岗位列表 =====")
    response = requests.get(list_url, headers=headers)
    print(f"获取岗位列表状态码: {response.status_code}")
    
    if response.status_code == 200:
        jobs = response.json()
        print(f"获取到 {len(jobs)} 个岗位")
        
        if len(jobs) > 0:
            print("前3个岗位:")
            for i, job in enumerate(jobs[:3], 1):
                print(f"  {i}. ID: {job['id']}, 标题: {job['title']}, 公司: {job['company']}")
        
        return jobs
    else:
        print(f"获取岗位列表失败: {response.text}")
        return []

def get_job_detail(headers, job_id):
    """获取单个岗位详情"""
    detail_url = f"{BASE_URL}/jobs/{job_id}"
    
    print(f"\n===== 测试获取岗位详情 (ID: {job_id}) =====")
    response = requests.get(detail_url, headers=headers)
    print(f"获取岗位详情状态码: {response.status_code}")
    
    if response.status_code == 200:
        job = response.json()
        print(f"成功获取岗位: {job['title']}, 公司: {job['company']}")
        return job
    else:
        print(f"获取岗位详情失败: {response.text}")
        return None

def update_job(headers, job_id):
    """更新岗位信息"""
    update_url = f"{BASE_URL}/jobs/{job_id}"
    
    # 使用随机数生成更新后的岗位标题
    new_title = f"更新后的岗位-{random.randint(1000, 9999)}"
    
    update_data = {
        "title": new_title,
        "description": "这是更新后的岗位描述",
        "requirements": "更新后的要求",
        "salary_min": 6000,
        "salary_max": 12000
    }
    
    print(f"\n===== 测试更新岗位 (ID: {job_id}) =====")
    print(f"更新数据: {json.dumps(update_data, ensure_ascii=False)}")
    
    response = requests.put(update_url, json=update_data, headers=headers)
    print(f"更新岗位状态码: {response.status_code}")
    
    if response.status_code == 200:
        job = response.json()
        print(f"成功更新岗位: {job['title']}, ID: {job['id']}")
        return job
    else:
        print(f"更新岗位失败: {response.text}")
        return None

def update_job_status(headers, job_id, status):
    """更新岗位状态"""
    status_url = f"{BASE_URL}/jobs/{job_id}/status"
    
    status_data = {
        "status": status
    }
    
    print(f"\n===== 测试更新岗位状态 (ID: {job_id}) =====")
    print(f"更新状态为: {status}")
    
    response = requests.patch(status_url, json=status_data, headers=headers)
    print(f"更新状态状态码: {response.status_code}")
    
    if response.status_code == 200:
        job = response.json()
        print(f"成功更新岗位状态: {job['status']}, ID: {job['id']}")
        return job
    else:
        print(f"更新岗位状态失败: {response.text}")
        return None

def delete_job(headers, job_id):
    """删除岗位并验证"""
    delete_url = f"{BASE_URL}/jobs/{job_id}"
    
    print(f"\n===== 测试删除岗位 (ID: {job_id}) =====")
    
    # 删除岗位
    response = requests.delete(delete_url, headers=headers)
    print(f"删除岗位状态码: {response.status_code}")
    
    if response.status_code in [200, 204]:
        print(f"成功删除岗位 ID: {job_id}")
        
        # 验证岗位已被删除
        print("验证岗位已被删除...")
        time.sleep(1)  # 等待一秒以确保数据已更新
        
        verify_response = requests.get(delete_url, headers=headers)
        print(f"验证状态码: {verify_response.status_code}")
        
        if verify_response.status_code == 404:
            print("验证成功: 岗位已被删除")
            return True
        else:
            print(f"验证失败: 岗位可能未被删除, 响应: {verify_response.text}")
            return False
    else:
        print(f"删除岗位失败: {response.text}")
        return False

def search_jobs(headers, keyword):
    """搜索岗位"""
    search_url = f"{BASE_URL}/jobs/search?keyword={keyword}"
    
    print(f"\n===== 测试搜索岗位 (关键词: {keyword}) =====")
    
    response = requests.get(search_url, headers=headers)
    print(f"搜索岗位状态码: {response.status_code}")
    
    if response.status_code == 200:
        jobs = response.json()
        print(f"搜索到 {len(jobs)} 个岗位")
        
        if len(jobs) > 0:
            print("搜索结果:")
            for i, job in enumerate(jobs[:3], 1):
                print(f"  {i}. ID: {job['id']}, 标题: {job['title']}, 公司: {job['company']}")
        
        return jobs
    else:
        print(f"搜索岗位失败: {response.text}")
        return []

def main():
    """主测试流程"""
    # 登录获取令牌
    headers = login()
    if not headers:
        print("登录失败，无法继续测试")
        return
    
    # 获取岗位列表
    jobs = get_job_list(headers)
    
    # 创建新岗位
    new_job = create_job(headers)
    if new_job:
        job_id = new_job['id']
        
        # 获取新创建岗位的详情
        get_job_detail(headers, job_id)
        
        # 更新岗位信息
        updated_job = update_job(headers, job_id)
        
        # 更新岗位状态
        if updated_job:
            update_job_status(headers, job_id, "closed")
        
        # 使用关键词搜索岗位
        search_jobs(headers, "更新")
        
        # 删除岗位
        delete_job(headers, job_id)
    
    print("\n===== 岗位管理CRUD测试完成 =====")

if __name__ == "__main__":
    main() 