#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
用户资料接口测试脚本
"""

import requests
import json
import sys
from datetime import datetime

print("开始执行用户资料接口测试脚本", file=sys.stderr)

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
            print(f"基本信息: 姓名={profile.get('full_name')}, 性别={profile.get('gender')}")
            return profile
        elif response.status_code == 404:
            print("用户资料不存在，需要创建")
            return None
        else:
            print(f"获取资料失败: {response.text}")
            return None
    except Exception as e:
        print(f"获取资料请求错误: {str(e)}")
        return None

def create_profile(token):
    """创建用户个人资料"""
    print("\n=== 创建用户资料 ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 创建资料数据
    profile_data = {
        "full_name": "测试用户",
        "gender": "男",
        "date_of_birth": "1990-01-01",
        "bio": "这是一个测试用户的个人简介",
        "phone": "13800138000",
        "work_years": 5,
        "current_status": "在职",
        "education_level": "本科",
        "education_background": "计算机科学",
        "location_city": "北京",
        "location_province": "北京",
        "skills": ["Python", "JavaScript", "React", "FastAPI"],
        "interests": ["编程", "音乐", "游戏"],
        "personality_traits": {
            "extraversion": 80,
            "agreeableness": 70,
            "conscientiousness": 85,
            "neuroticism": 30,
            "openness": 90
        }
    }
    
    try:
        response = requests.post(PROFILE_URL, headers=headers, json=profile_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("创建资料成功!")
            return result
        else:
            print(f"创建资料失败: {response.text}")
            return None
    except Exception as e:
        print(f"创建资料请求错误: {str(e)}")
        return None

def update_profile(token, profile_id):
    """更新用户个人资料"""
    print("\n=== 更新用户资料 ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新资料数据
    update_data = {
        "full_name": "更新测试用户",
        "bio": "这是更新后的个人简介",
        "skills": ["Python", "JavaScript", "React", "FastAPI", "Docker"],
        "work_years": 6
    }
    
    try:
        response = requests.put(PROFILE_URL, headers=headers, json=update_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新资料成功!")
            print(f"更新后的姓名: {result.get('full_name')}")
            print(f"更新后的工作年限: {result.get('work_years')}")
            print(f"更新后的技能: {result.get('skills')}")
            return result
        else:
            print(f"更新资料失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新资料请求错误: {str(e)}")
        return None

def update_personality(token):
    """更新性格特征"""
    print("\n=== 更新性格特征 ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新性格特征数据
    personality_data = {
        "personality_traits": {
            "extraversion": 85,
            "agreeableness": 75,
            "conscientiousness": 90,
            "neuroticism": 25,
            "openness": 95
        },
        "learning_style": {
            "visual": 80,
            "auditory": 60,
            "reading": 70,
            "kinesthetic": 75
        },
        "learning_ability": {
            "quick_learner": True,
            "attention_to_detail": 85,
            "problem_solving": 90,
            "critical_thinking": 85
        }
    }
    
    try:
        response = requests.put(f"{PROFILE_URL}/personality", headers=headers, json=personality_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新性格特征成功!")
            return result
        else:
            print(f"更新性格特征失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新性格特征请求错误: {str(e)}")
        return None

def update_career_interests(token):
    """更新职业兴趣"""
    print("\n=== 更新职业兴趣 ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新职业兴趣数据
    career_data = {
        "career_interests": {
            "technology": 90,
            "business": 70,
            "arts": 50,
            "science": 85
        },
        "work_style": {
            "remote": 85,
            "office": 60,
            "teamwork": 75,
            "independent": 80
        },
        "growth_potential": {
            "leadership": 80,
            "technical_expertise": 90,
            "creativity": 75,
            "adaptability": 85
        }
    }
    
    try:
        response = requests.put(f"{PROFILE_URL}/career-interests", headers=headers, json=career_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新职业兴趣成功!")
            return result
        else:
            print(f"更新职业兴趣失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新职业兴趣请求错误: {str(e)}")
        return None

def update_work_info(token):
    """更新工作信息"""
    print("\n=== 更新工作信息 ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 更新工作信息数据
    work_data = {
        "work_years": 7,
        "current_status": "在职-考虑机会",
        "skills": ["Python", "JavaScript", "React", "FastAPI", "Docker", "Kubernetes", "微服务架构"],
        "skill_tags": ["后端开发", "全栈工程师", "DevOps"]
    }
    
    try:
        response = requests.put(f"{PROFILE_URL}/work-info", headers=headers, json=work_data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("更新工作信息成功!")
            print(f"更新后的工作年限: {result.get('work_years')}")
            print(f"更新后的技能: {result.get('skills')}")
            return result
        else:
            print(f"更新工作信息失败: {response.text}")
            return None
    except Exception as e:
        print(f"更新工作信息请求错误: {str(e)}")
        return None

def run_tests():
    """运行所有测试"""
    print("=== 开始用户资料接口测试 ===\n")
    
    # 登录
    token = login()
    if not token:
        print("❌ 登录失败，无法继续测试")
        return
    
    # 获取资料
    profile = get_profile(token)
    
    # 如果资料不存在，创建新资料
    if not profile:
        profile = create_profile(token)
        if not profile:
            print("❌ 创建资料失败，无法继续测试")
            return
    
    # 更新资料
    profile = update_profile(token, profile.get("id"))
    if not profile:
        print("❌ 更新资料失败")
    
    # 更新性格特征
    personality_result = update_personality(token)
    if not personality_result:
        print("❌ 更新性格特征失败")
    
    # 更新职业兴趣
    career_result = update_career_interests(token)
    if not career_result:
        print("❌ 更新职业兴趣失败")
    
    # 更新工作信息
    work_result = update_work_info(token)
    if not work_result:
        print("❌ 更新工作信息失败")
    
    # 再次获取完整资料
    final_profile = get_profile(token)
    if final_profile:
        print("\n=== 最终资料摘要 ===")
        print(f"姓名: {final_profile.get('full_name')}")
        print(f"工作年限: {final_profile.get('work_years')}")
        print(f"技能: {final_profile.get('skills')}")
        print(f"性格特征: {json.dumps(final_profile.get('personality_traits'), ensure_ascii=False)[:100]}..." if final_profile.get('personality_traits') else "无")
        print(f"职业兴趣: {json.dumps(final_profile.get('career_interests'), ensure_ascii=False)[:100]}..." if final_profile.get('career_interests') else "无")
    
    print("\n=== 用户资料接口测试完成 ===")

if __name__ == "__main__":
    run_tests() 