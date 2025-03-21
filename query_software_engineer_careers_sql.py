#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pymysql
import pandas as pd
from tabulate import tabulate
import json

# 数据库连接配置
config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '123456',
    'database': 'cursor06',
    'port': 3306,
    'charset': 'utf8mb4'
}

# 软件工程师分类ID
CATEGORY_ID = 33

def connect_db():
    """连接数据库"""
    try:
        conn = pymysql.connect(**config)
        print("成功连接到数据库")
        return conn
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None

def get_category_info(conn, category_id):
    """获取分类信息"""
    try:
        query = """
        SELECT 
            id, name, description, level, parent_id
        FROM 
            career_categories
        WHERE 
            id = %s
        """
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(query, (category_id,))
        category = cursor.fetchone()
        cursor.close()
        
        if category:
            print("\n=== 分类信息 ===")
            print(f"ID: {category['id']}")
            print(f"名称: {category['name']}")
            print(f"描述: {category['description']}")
            print(f"层级: {category['level']}")
            print(f"父分类ID: {category['parent_id']}")
        else:
            print(f"未找到ID为 {category_id} 的分类")
            
        return category
    except Exception as e:
        print(f"获取分类信息失败: {e}")
        return None

def get_subcategory_ids(conn, category_id):
    """递归获取所有子分类ID"""
    try:
        # 使用递归公用表表达式(CTE)查询所有子分类
        query = """
        WITH RECURSIVE category_tree AS (
            -- 初始查询：当前分类
            SELECT id, name, parent_id
            FROM career_categories
            WHERE id = %s
            
            UNION ALL
            
            -- 递归查询：子分类
            SELECT c.id, c.name, c.parent_id
            FROM career_categories c
            JOIN category_tree ct ON c.parent_id = ct.id
        )
        SELECT id FROM category_tree;
        """
        cursor = conn.cursor()
        cursor.execute(query, (category_id,))
        result = cursor.fetchall()
        cursor.close()
        
        # 提取分类ID
        category_ids = [row[0] for row in result]
        return category_ids
    except Exception as e:
        print(f"获取子分类ID失败: {e}")
        return [category_id]  # 如果失败，至少返回当前分类ID

def get_careers_by_categories(conn, category_ids):
    """根据分类ID列表获取职业"""
    try:
        # 将分类ID列表转换为IN子句格式
        placeholders = ', '.join(['%s'] * len(category_ids))
        
        query = f"""
        SELECT 
            c.id, c.title, c.description, c.required_skills, 
            c.education_required, c.experience_required,
            c.career_path, c.salary_range, c.future_prospect,
            c.category_id, cat.name as category_name
        FROM 
            careers c
        JOIN 
            career_categories cat ON c.category_id = cat.id
        WHERE 
            c.category_id IN ({placeholders})
        ORDER BY 
            c.category_id, c.id
        """
        
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(query, category_ids)
        careers = cursor.fetchall()
        cursor.close()
        
        return careers
    except Exception as e:
        print(f"获取职业数据失败: {e}")
        return []

def display_careers(careers):
    """显示职业数据"""
    if not careers:
        print("没有找到职业数据")
        return
    
    # 提取关键字段并处理数据格式
    data = []
    for career in careers:
        # 处理salary_range字段，确保它是字典格式
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
        
        # 处理required_skills字段，确保它是列表格式
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
            "分类": career.get("category_name", ""),
            "分类ID": career.get("category_id", ""),
            "薪资范围": salary_str,
            "所需技能": skills_str[:50] + ("..." if len(skills_str) > 50 else ""),
            "学历要求": career.get("education_required", ""),
            "发展前景": career.get("future_prospect", "")
        })
    
    # 使用pandas创建数据框
    df = pd.DataFrame(data)
    
    # 使用tabulate显示数据
    print("\n=== 软件工程师类及子类职业数据 ===")
    print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
    print(f"共找到 {len(careers)} 条记录")

def get_category_tree(conn, category_id):
    """获取分类树结构"""
    try:
        # 使用递归公用表表达式(CTE)查询分类树
        query = """
        WITH RECURSIVE category_tree AS (
            -- 初始查询：当前分类
            SELECT id, name, parent_id, level, 0 AS depth
            FROM career_categories
            WHERE id = %s
            
            UNION ALL
            
            -- 递归查询：子分类
            SELECT c.id, c.name, c.parent_id, c.level, ct.depth + 1
            FROM career_categories c
            JOIN category_tree ct ON c.parent_id = ct.id
        )
        SELECT id, name, parent_id, level, depth
        FROM category_tree
        ORDER BY depth, id;
        """
        
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(query, (category_id,))
        categories = cursor.fetchall()
        cursor.close()
        
        if categories:
            print("\n=== 分类树结构 ===")
            for cat in categories:
                indent = "  " * cat["depth"]
                print(f"{indent}|- {cat['name']} (ID: {cat['id']}, 层级: {cat['level']})")
        
        return categories
    except Exception as e:
        print(f"获取分类树失败: {e}")
        return []

def main():
    """主函数"""
    conn = connect_db()
    if not conn:
        return
    
    try:
        # 获取软件工程师分类信息
        get_category_info(conn, CATEGORY_ID)
        
        # 获取分类树结构
        get_category_tree(conn, CATEGORY_ID)
        
        # 获取所有子分类ID
        category_ids = get_subcategory_ids(conn, CATEGORY_ID)
        print(f"\n找到 {len(category_ids)} 个相关分类: {category_ids}")
        
        # 获取所有相关分类下的职业
        careers = get_careers_by_categories(conn, category_ids)
        
        # 显示职业数据
        display_careers(careers)
        
    except Exception as e:
        print(f"执行查询时出错: {e}")
    finally:
        conn.close()
        print("\n数据库连接已关闭")

if __name__ == "__main__":
    main() 