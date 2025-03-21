#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
from tabulate import tabulate
import pandas as pd

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MjM2NTMsInN1YiI6IjEifQ.0rE6kzWBvO_Ti1_Fib9a9qE67qjgz45HjCdAwGQSvgU"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
CATEGORY_ID = 33  # 软件工程师分类ID

def get_category_info(category_id):
    """获取分类信息"""
    url = f"{BASE_URL}/career-categories/{category_id}"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"获取分类信息失败: {e}")
        return None

def get_careers_by_category(category_id):
    """获取指定分类的职业数据"""
    url = f"{BASE_URL}/careers/category/{category_id}"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        if 'careers' in data:
            print(f"成功获取 {len(data['careers'])} 条职业数据")
            return data['careers']
        return []
    except Exception as e:
        print(f"获取分类职业数据失败: {e}")
        return []

def display_careers(careers):
    """显示职业数据"""
    if not careers:
        print("没有找到软件工程师相关的职业数据")
        return
    
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
        
        # 处理career_path字段，支持列表或字典格式
        career_path = career.get("career_path", {})
        if isinstance(career_path, list):
            career_path_str = " > ".join(career_path)
        elif isinstance(career_path, dict):
            career_path_str = " > ".join(career_path.values())
        else:
            career_path_str = ""
        
        # 将职业数据添加到列表
        data.append({
            "ID": career.get("id", ""),
            "职业名称": career.get("title", ""),
            "分类ID": career.get("category_id", ""),
            "薪资范围": salary_str,
            "所需技能": skills_str[:100] + ("..." if len(skills_str) > 100 else ""),
            "学历要求": career.get("education_required", ""),
            "发展前景": career.get("future_prospect", ""),
            "职业发展路径": career_path_str
        })
    
    # 使用pandas显示数据
    df = pd.DataFrame(data)
    pd.set_option('display.max_columns', None)  # 显示所有列
    pd.set_option('display.width', 200)  # 设置宽度
    pd.set_option('display.max_colwidth', 100)  # 设置列最大宽度
    
    print("\n=== 软件工程师职业数据 ===")
    print(df.to_string(index=False))
    print(f"\n共找到 {len(careers)} 条软件工程师相关职业记录")

def display_category_path(category_id):
    """显示分类路径"""
    category_info = get_category_info(category_id)
    if not category_info:
        return
    
    print(f"\n=== 分类信息 ===")
    print(f"ID: {category_info.get('id')}")
    print(f"名称: {category_info.get('name')}")
    print(f"描述: {category_info.get('description')}")
    
    # 获取父分类信息
    parent_id = category_info.get('parent_id')
    if parent_id:
        parent_info = get_category_info(parent_id)
        if parent_info:
            parent_parent_id = parent_info.get('parent_id')
            if parent_parent_id:
                root_info = get_category_info(parent_parent_id)
                if root_info:
                    print(f"分类路径: {root_info.get('name')} > {parent_info.get('name')} > {category_info.get('name')}")
            else:
                print(f"分类路径: {parent_info.get('name')} > {category_info.get('name')}")

def main():
    """主函数"""
    print("==== 软件工程师职业数据查询 ====")
    
    # 显示分类路径
    display_category_path(CATEGORY_ID)
    
    # 获取软件工程师分类下的职业数据
    print(f"\n获取软件工程师分类(ID={CATEGORY_ID})下的职业数据...")
    careers = get_careers_by_category(CATEGORY_ID)
    
    # 显示职业数据
    if careers:
        display_careers(careers)
    else:
        print("未能获取职业数据")
    
    print("\n==== 查询结束 ====")
    
if __name__ == "__main__":
    main() 