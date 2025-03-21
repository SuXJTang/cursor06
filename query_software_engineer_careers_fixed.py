#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
from tabulate import tabulate
import pandas as pd

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"  # 后端API基础URL
CATEGORY_ID = 33  # 软件工程师分类ID
# 使用用户提供的token
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MjM2NTMsInN1YiI6IjEifQ.0rE6kzWBvO_Ti1_Fib9a9qE67qjgz45HjCdAwGQSvgU"

def get_category_info(category_id):
    """获取分类信息"""
    # 根据日志看到正确的路径应该是career-categories
    url = f"{BASE_URL}/career-categories/{category_id}"
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"获取分类信息失败: {e}")
        print(f"状态码: {response.status_code if 'response' in locals() else 'N/A'}")
        print(f"响应内容: {response.text if 'response' in locals() else 'N/A'}")
        return None

def get_careers_recursive(category_id):
    """递归获取分类及其子分类下的所有职业"""
    # 尝试使用递归接口
    url = f"{BASE_URL}/careers/category/{category_id}/recursive"
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"递归获取职业数据失败: {e}")
        print(f"状态码: {response.status_code if 'response' in locals() else 'N/A'}")
        print(f"响应内容: {response.text if 'response' in locals() else 'N/A'}")
        # 如果递归API失败，尝试使用普通查询接口
        try:
            print("尝试使用普通分类查询接口...")
            url = f"{BASE_URL}/careers/category/{category_id}"
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e2:
            print(f"普通分类查询也失败: {e2}")
            return None

def display_careers(careers_data):
    """显示职业数据"""
    if not careers_data:
        print("没有找到职业数据")
        return
    
    # 根据API返回的数据结构调整解析逻辑
    if "careers" in careers_data:
        careers = careers_data["careers"]
    else:
        # 可能直接返回的是职业列表
        careers = careers_data
    
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
    # 获取软件工程师分类信息
    category_info = get_category_info(CATEGORY_ID)
    if category_info:
        print(f"\n=== 分类信息 ===")
        print(f"ID: {category_info.get('id')}")
        print(f"名称: {category_info.get('name')}")
        print(f"描述: {category_info.get('description')}")
        print(f"层级: {category_info.get('level')}")
    
    # 递归获取软件工程师分类及其子分类下的所有职业
    careers_data = get_careers_recursive(CATEGORY_ID)
    if careers_data:
        display_careers(careers_data)
    
if __name__ == "__main__":
    main() 