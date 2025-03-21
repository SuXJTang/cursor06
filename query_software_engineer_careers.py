#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
from tabulate import tabulate
import pandas as pd

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"  # 后端API基础URL
CATEGORY_ID = 33  # 软件工程师分类ID

def get_token():
    """获取访问令牌"""
    login_url = f"{BASE_URL}/login/access-token"
    login_data = {
        "username": "admin@example.com",  # 替换为实际管理员用户名
        "password": "admin123"  # 替换为实际管理员密码
    }
    
    try:
        response = requests.post(login_url, data=login_data)
        response.raise_for_status()
        token_data = response.json()
        return token_data["access_token"]
    except Exception as e:
        print(f"获取令牌失败: {e}")
        return None

def get_category_info(token, category_id):
    """获取分类信息"""
    url = f"{BASE_URL}/categories/{category_id}"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"获取分类信息失败: {e}")
        return None

def get_careers_recursive(token, category_id):
    """递归获取分类及其子分类下的所有职业"""
    url = f"{BASE_URL}/careers/category/{category_id}/recursive"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"递归获取职业数据失败: {e}")
        return None

def display_careers(careers_data):
    """显示职业数据"""
    if not careers_data or "careers" not in careers_data:
        print("没有找到职业数据")
        return
    
    careers = careers_data["careers"]
    
    # 提取关键字段
    data = []
    for career in careers:
        # 处理salary_range字段，确保它是一个字典
        salary_range = career.get("salary_range", {})
        if isinstance(salary_range, str):
            try:
                salary_range = json.loads(salary_range)
            except:
                salary_range = {}
        
        # 提取薪资范围字符串
        salary_str = ""
        if salary_range:
            min_salary = salary_range.get("min", "")
            max_salary = salary_range.get("max", "")
            if min_salary and max_salary:
                salary_str = f"{min_salary}-{max_salary}K"
            elif min_salary:
                salary_str = f"{min_salary}K+"
            elif max_salary:
                salary_str = f"≤{max_salary}K"
        
        # 处理required_skills字段，确保它是一个列表
        required_skills = career.get("required_skills", [])
        if isinstance(required_skills, str):
            try:
                required_skills = json.loads(required_skills)
            except:
                required_skills = []
        
        # 将技能列表转换为字符串
        skills_str = ", ".join(required_skills) if required_skills else ""
        
        # 将职业数据添加到列表
        data.append({
            "ID": career.get("id", ""),
            "职业名称": career.get("title", ""),
            "分类ID": career.get("category_id", ""),
            "薪资范围": salary_str,
            "所需技能": skills_str[:50] + ("..." if len(skills_str) > 50 else ""),
            "发展前景": career.get("future_prospect", "")
        })
    
    # 使用pandas创建数据框
    df = pd.DataFrame(data)
    
    # 使用tabulate显示数据
    print("\n=== 软件工程师类及子类职业数据 ===")
    print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
    print(f"共找到 {len(careers)} 条记录")

def main():
    """主函数"""
    # 获取访问令牌
    token = get_token()
    if not token:
        return
    
    # 获取软件工程师分类信息
    category_info = get_category_info(token, CATEGORY_ID)
    if category_info:
        print(f"\n=== 分类信息 ===")
        print(f"ID: {category_info.get('id')}")
        print(f"名称: {category_info.get('name')}")
        print(f"描述: {category_info.get('description')}")
        print(f"层级: {category_info.get('level')}")
    
    # 递归获取软件工程师分类及其子分类下的所有职业
    careers_data = get_careers_recursive(token, CATEGORY_ID)
    if careers_data:
        display_careers(careers_data)
    
if __name__ == "__main__":
    main() 