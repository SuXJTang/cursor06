#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MjM2NTMsInN1YiI6IjEifQ.0rE6kzWBvO_Ti1_Fib9a9qE67qjgz45HjCdAwGQSvgU"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

# 可能的API端点列表
endpoints = [
    # 分类相关接口
    "/career-categories/roots",
    "/career-categories/33",
    "/career-categories/32",
    "/career-categories/1",
    
    # 职业相关接口
    "/careers",
    "/careers/category/33",
    "/careers/category/32",
    "/careers/category/1",
    
    # 其他可能相关的接口
    "/careers/search?keyword=软件",
    "/careers/skills?skills=Java",
]

def check_endpoint(endpoint):
    """检查API端点是否可访问"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\n正在检查端点: {url}")
    
    try:
        response = requests.get(url, headers=HEADERS)
        status_code = response.status_code
        print(f"状态码: {status_code}")
        
        if status_code == 200:
            data = response.json()
            # 尝试提取一些有用信息
            if isinstance(data, list):
                print(f"返回 {len(data)} 条记录")
                if len(data) > 0:
                    print(f"第一条记录: {json.dumps(data[0], ensure_ascii=False)[:200]}...")
            elif isinstance(data, dict):
                if "total" in data:
                    print(f"总记录数: {data.get('total', 0)}")
                if "careers" in data and isinstance(data["careers"], list):
                    careers = data["careers"]
                    print(f"职业数: {len(careers)}")
                    if len(careers) > 0:
                        print(f"第一个职业: {careers[0].get('title', '未知')}")
                        
            return True
        else:
            print(f"请求失败: {response.text}")
            return False
    except Exception as e:
        print(f"访问失败: {str(e)}")
        return False

def main():
    """主函数"""
    print("=== API端点检查工具 ===")
    
    # 检查身份认证
    try:
        auth_url = f"{BASE_URL}/auth/me"
        auth_response = requests.get(auth_url, headers=HEADERS)
        if auth_response.status_code == 200:
            user_info = auth_response.json()
            print(f"\n当前用户: {user_info.get('email', '未知')}")
            print(f"用户ID: {user_info.get('id', '未知')}")
            print(f"角色: {user_info.get('is_superuser', False) and '管理员' or '普通用户'}")
        else:
            print(f"\n获取用户信息失败: {auth_response.text}")
    except Exception as e:
        print(f"\n身份验证检查失败: {str(e)}")
    
    # 检查各个端点
    success_count = 0
    for endpoint in endpoints:
        if check_endpoint(endpoint):
            success_count += 1
    
    print(f"\n总结: 共检查 {len(endpoints)} 个端点，其中 {success_count} 个可用")

if __name__ == "__main__":
    main() 