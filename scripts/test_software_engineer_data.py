#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pymysql
import pandas as pd
from tabulate import tabulate

# 数据库连接配置
config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '123456',
    'database': 'cursor06',
    'port': 3306,
    'charset': 'utf8mb4'
}

def connect_db():
    """连接数据库"""
    try:
        conn = pymysql.connect(**config)
        print("成功连接到数据库")
        return conn
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None

def get_software_engineer_data(conn):
    """获取软件工程师分类下的职业数据"""
    try:
        # 软件工程师分类ID为33
        query = """
        SELECT 
            c.id, c.title, c.description, c.required_skills, c.salary_range, 
            cat.id as category_id, cat.name as category_name
        FROM 
            careers c
        JOIN 
            career_categories cat ON c.category_id = cat.id
        WHERE 
            c.category_id = 33
        ORDER BY 
            c.id
        """
        df = pd.read_sql(query, conn)
        print("\n=== 软件工程师分类下的职业数据 ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
        print(f"共找到 {len(df)} 条记录")
        return df
    except Exception as e:
        print(f"查询软件工程师职业数据失败: {e}")
        return None

def test_api_query(conn):
    """测试API查询逻辑"""
    try:
        # 模拟API查询逻辑，获取软件工程师分类下的职业
        query = """
        SELECT 
            c.id, c.title, c.description, c.required_skills, c.salary_range
        FROM 
            careers c
        WHERE 
            c.category_id = 33
        """
        df = pd.read_sql(query, conn)
        print("\n=== 模拟API查询软件工程师职业数据 ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
        print(f"API查询找到 {len(df)} 条记录")
        
        # 同时测试获取分类信息
        category_query = """
        SELECT 
            id, name, description, parent_id
        FROM 
            career_categories
        WHERE 
            id = 33
        """
        cat_df = pd.read_sql(category_query, conn)
        print("\n=== 软件工程师分类信息 ===")
        print(tabulate(cat_df, headers=cat_df.columns, tablefmt="grid", showindex=False))
    except Exception as e:
        print(f"测试API查询逻辑失败: {e}")

def main():
    """主函数"""
    conn = connect_db()
    if conn:
        try:
            # 获取软件工程师分类下的职业数据
            get_software_engineer_data(conn)
            
            # 测试API查询逻辑
            test_api_query(conn)
            
        except Exception as e:
            print(f"执行查询时出错: {e}")
        finally:
            conn.close()
            print("\n数据库连接已关闭")

if __name__ == "__main__":
    main() 