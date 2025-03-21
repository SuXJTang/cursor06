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

def get_careers():
    """获取所有职业并过滤软件工程师相关的职业"""
    url = f"{BASE_URL}/careers"
    software_engineer_careers = []
    
    try:
        # 分页获取所有职业数据
        page = 1
        limit = 100
        total_fetched = 0
        total_records = float('inf')  # 初始设置为无穷大，等待从响应中获取实际总数
        
        print(f"正在获取职业数据...")
        
        while total_fetched < total_records:
            offset = (page - 1) * limit
            page_url = f"{url}?skip={offset}&limit={limit}"
            
            response = requests.get(page_url, headers=HEADERS)
            response.raise_for_status()
            data = response.json()
            
            if "total" in data:
                total_records = data["total"]
                if page == 1:
                    print(f"发现总共 {total_records} 条职业记录")
            
            if "careers" in data and isinstance(data["careers"], list):
                careers = data["careers"]
                # 过滤软件工程师分类的职业
                for career in careers:
                    if career.get("category_id") == CATEGORY_ID:
                        software_engineer_careers.append(career)
                
                total_fetched += len(careers)
                print(f"已获取 {total_fetched}/{total_records} 条记录，找到 {len(software_engineer_careers)} 条软件工程师相关职业")
                
                if len(careers) < limit:
                    # 如果返回的记录数少于请求的数量，表示已经是最后一页
                    break
            else:
                print("无效的响应格式")
                break
                
            page += 1
            
        return software_engineer_careers
    except Exception as e:
        print(f"获取职业数据失败: {e}")
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
        
        # 将职业数据添加到列表
        data.append({
            "ID": career.get("id", ""),
            "职业名称": career.get("title", ""),
            "分类ID": career.get("category_id", ""),
            "薪资范围": salary_str,
            "所需技能": skills_str[:50] + ("..." if len(skills_str) > 50 else ""),
            "学历要求": career.get("education_required", ""),
            "发展前景": career.get("future_prospect", "")
        })
    
    # 使用pandas创建数据框
    df = pd.DataFrame(data)
    
    # 使用tabulate显示数据
    print("\n=== 软件工程师类职业数据 ===")
    print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
    print(f"共找到 {len(careers)} 条软件工程师相关职业记录")

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
    
    # 获取所有职业并过滤软件工程师相关的职业
    software_engineer_careers = get_careers()
    
    # 显示职业数据
    display_careers(software_engineer_careers)
    
if __name__ == "__main__":
    main() 