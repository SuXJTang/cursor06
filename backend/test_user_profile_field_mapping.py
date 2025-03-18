#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
用户资料字段映射测试脚本 - 主要针对工作年限字段测试
"""

import requests
import json
import sys
import time

print("开始执行用户资料字段映射测试脚本", file=sys.stderr)

# 配置
API_BASE_URL = "http://localhost:8000/api/v1"
LOGIN_URL = f"{API_BASE_URL}/auth/login"
PROFILE_URL = f"{API_BASE_URL}/user-profiles/me"

# 测试用户凭据
TEST_USER = {
    "username": "admin@example.com",
    "password": "admin123"
}

def login():
    """登录并获取访问令牌"""
    print("\n=== 登录获取令牌 ===")
    
    try:
        response = requests.post(LOGIN_URL, data=TEST_USER)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            token = result.get("access_token", "")
            print(f"登录成功! Token: {token[:20]}...")
            return token
        else:
            print(f"登录失败: {response.text}")
            return None
    except Exception as e:
        print(f"登录请求错误: {str(e)}")
        return None

def get_profile(token):
    """获取用户个人资料"""
    print("\n=== 获取用户资料 ===")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(PROFILE_URL, headers=headers)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            profile = response.json()
            print("获取资料成功!")
            print(f"详细资料数据: {json.dumps(profile, ensure_ascii=False, indent=2)}")
            # 检查字段
            print("\n字段检查:")
            print(f"work_years: {profile.get('work_years')}")
            print(f"work_experience: {profile.get('work_experience')}")
            print(f"experience_years: {profile.get('experience_years')}")
            return profile
        else:
            print(f"获取资料失败: {response.text}")
            return None
    except Exception as e:
        print(f"获取资料请求错误: {str(e)}")
        return None

def update_work_years_direct(token, work_years):
    """使用直接字段名更新工作年限"""
    print(f"\n=== 更新工作年限(direct={work_years}) ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新数据
    update_data = {
        "work_years": work_years
    }
    
    try:
        response = requests.put(PROFILE_URL, headers=headers, json=update_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新成功!")
            print(f"返回数据工作年限: {result.get('work_years')}")
            return result
        else:
            print(f"更新失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新请求错误: {str(e)}")
        return None

def update_experience_years(token, years):
    """使用experience_years字段更新工作年限"""
    print(f"\n=== 更新工作年限(experience_years={years}) ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新数据
    update_data = {
        "experience_years": years
    }
    
    try:
        response = requests.put(PROFILE_URL, headers=headers, json=update_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新成功!")
            print(f"返回数据工作年限: work_years={result.get('work_years')}, experience_years={result.get('experience_years')}")
            return result
        else:
            print(f"更新失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新请求错误: {str(e)}")
        return None

def update_via_work_info(token, years):
    """通过work-info接口更新工作年限"""
    print(f"\n=== 通过work-info更新工作年限({years}) ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新数据
    update_data = {
        "work_years": years,
        "skills": ["Python", "测试字段"]
    }
    
    try:
        response = requests.put(f"{PROFILE_URL}/work-info", headers=headers, json=update_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新成功!")
            print(f"返回数据工作年限: {result.get('work_years')}")
            return result
        else:
            print(f"更新失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新请求错误: {str(e)}")
        return None

def complete_update(token, years):
    """通过完整更新接口更新工作年限"""
    print(f"\n=== 通过complete-profile更新工作年限({years}) ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 获取当前资料
    current_profile = get_profile(token)
    if not current_profile:
        print("获取当前资料失败，无法继续")
        return None
    
    # 修改工作年限
    current_profile["work_years"] = years
    current_profile["experience_years"] = years
    
    # 删除不需要的字段
    if "id" in current_profile:
        del current_profile["id"]
    if "user_id" in current_profile:
        del current_profile["user_id"]
    if "created_at" in current_profile:
        del current_profile["created_at"]
    if "updated_at" in current_profile:
        del current_profile["updated_at"]
    
    try:
        response = requests.put(f"{PROFILE_URL}/complete-profile", headers=headers, json=current_profile)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新成功!")
            print(f"返回数据工作年限: work_years={result.get('work_years')}, experience_years={result.get('experience_years')}")
            return result
        else:
            print(f"更新失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新请求错误: {str(e)}")
        return None

def run_tests():
    """运行所有测试"""
    print("=== 开始用户资料字段映射测试 ===\n")
    
    # 登录
    token = login()
    if not token:
        print("❌ 登录失败，无法继续测试")
        return
    
    # 获取当前资料
    initial_profile = get_profile(token)
    if not initial_profile:
        print("❌ 获取资料失败，无法继续测试")
        return
    
    # 测试直接更新work_years
    update_work_years_direct(token, 8)
    time.sleep(1)
    
    # 获取更新后资料
    get_profile(token)
    time.sleep(1)
    
    # 测试更新experience_years
    update_experience_years(token, 9)
    time.sleep(1)
    
    # 获取更新后资料
    get_profile(token)
    time.sleep(1)
    
    # 测试通过work-info更新
    update_via_work_info(token, 10)
    time.sleep(1)
    
    # 获取更新后资料
    get_profile(token)
    time.sleep(1)
    
    # 测试通过complete-profile更新
    complete_update(token, 11)
    time.sleep(1)
    
    # 获取最终资料
    final_profile = get_profile(token)
    
    print("\n=== 用户资料字段映射测试完成 ===")

if __name__ == "__main__":
    run_tests() 