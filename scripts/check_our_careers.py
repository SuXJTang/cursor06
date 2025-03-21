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

def check_imported_careers(conn):
    """查询我们导入的职业数据"""
    try:
        query = """
        SELECT 
            c.id, c.title, cat.id as category_id, cat.name as category_name, 
            cat.parent_id, parent.name as parent_category_name,
            c.description, c.required_skills, c.salary_range
        FROM 
            careers c
        JOIN 
            career_categories cat ON c.category_id = cat.id
        LEFT JOIN 
            career_categories parent ON cat.parent_id = parent.id
        WHERE 
            c.id >= 245  -- 假设我们导入的数据ID从245开始
        ORDER BY 
            c.id
        """
        df = pd.read_sql(query, conn)
        print("\n=== 我们导入的职业数据 ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
        print(f"共找到 {len(df)} 条记录")
        return df
    except Exception as e:
        print(f"查询导入职业数据失败: {e}")
        return None

def get_finance_careers(conn):
    """查询金融相关职业"""
    try:
        query = """
        SELECT 
            c.id, c.title, cat.id as category_id, cat.name as category_name, 
            c.description, c.salary_range, c.future_prospect
        FROM 
            careers c
        JOIN 
            career_categories cat ON c.category_id = cat.id
        WHERE 
            cat.name LIKE '%金融%' OR c.title LIKE '%金融%' OR
            cat.name LIKE '%财%' OR c.title LIKE '%财%' OR
            cat.name LIKE '%会计%' OR c.title LIKE '%会计%'
        ORDER BY 
            c.id
        """
        df = pd.read_sql(query, conn)
        print("\n=== 金融相关职业数据 ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
        print(f"共找到 {len(df)} 条记录")
    except Exception as e:
        print(f"查询金融职业数据失败: {e}")

def get_legal_careers(conn):
    """查询法律相关职业"""
    try:
        query = """
        SELECT 
            c.id, c.title, cat.id as category_id, cat.name as category_name, 
            c.description, c.salary_range
        FROM 
            careers c
        JOIN 
            career_categories cat ON c.category_id = cat.id
        WHERE 
            cat.name LIKE '%法%' OR c.title LIKE '%法%' OR
            cat.name LIKE '%律师%' OR c.title LIKE '%律师%'
        ORDER BY 
            c.id
        """
        df = pd.read_sql(query, conn)
        print("\n=== 法律相关职业数据 ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
        print(f"共找到 {len(df)} 条记录")
    except Exception as e:
        print(f"查询法律职业数据失败: {e}")

def get_software_careers(conn):
    """查询软件工程相关职业"""
    try:
        query = """
        SELECT 
            c.id, c.title, cat.id as category_id, cat.name as category_name, 
            c.description, c.required_skills
        FROM 
            careers c
        JOIN 
            career_categories cat ON c.category_id = cat.id
        WHERE 
            cat.name LIKE '%软件%' OR c.title LIKE '%软件%'
        ORDER BY 
            c.id
        """
        df = pd.read_sql(query, conn)
        print("\n=== 软件工程相关职业数据 ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
        print(f"共找到 {len(df)} 条记录")
    except Exception as e:
        print(f"查询软件工程职业数据失败: {e}")

def main():
    """主函数"""
    conn = connect_db()
    if conn:
        try:
            # 查询我们导入的职业数据
            imported_df = check_imported_careers(conn)
            
            # 查询特定领域职业
            get_finance_careers(conn)
            get_legal_careers(conn)
            get_software_careers(conn)
            
        except Exception as e:
            print(f"执行查询时出错: {e}")
        finally:
            conn.close()
            print("\n数据库连接已关闭")

if __name__ == "__main__":
    main() 