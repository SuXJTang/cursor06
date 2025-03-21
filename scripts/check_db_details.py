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

def check_table_schema(conn, table_name):
    """检查表结构"""
    try:
        cursor = conn.cursor()
        cursor.execute(f"DESCRIBE {table_name}")
        fields = cursor.fetchall()
        print(f"\n=== {table_name} 表结构 ===")
        headers = ["字段", "类型", "Null", "Key", "Default", "Extra"]
        print(tabulate(fields, headers=headers, tablefmt="grid"))
        cursor.close()
    except Exception as e:
        print(f"获取表结构失败: {e}")

def sample_data(conn, table_name, limit=10):
    """查看表数据样本"""
    try:
        query = f"SELECT * FROM {table_name} LIMIT {limit}"
        df = pd.read_sql(query, conn)
        print(f"\n=== {table_name} 表数据样本 (前{limit}条) ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
    except Exception as e:
        print(f"获取表数据失败: {e}")

def count_categories_by_level(conn):
    """统计各级分类数量"""
    try:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT parent_id IS NULL AS is_root, COUNT(*) AS count 
        FROM career_categories 
        GROUP BY parent_id IS NULL
        """)
        results = cursor.fetchall()
        print("\n=== 职业分类层级统计 ===")
        for row in results:
            level = "一级分类(根分类)" if row[0] == 1 else "子分类"
            print(f"{level}: {row[1]}条")
        cursor.close()
    except Exception as e:
        print(f"统计分类层级失败: {e}")

def count_careers_by_category(conn, limit=10):
    """统计各分类下职业数量"""
    try:
        query = """
        SELECT c.name AS category_name, COUNT(cr.id) AS career_count
        FROM career_categories c
        LEFT JOIN careers cr ON c.id = cr.category_id
        GROUP BY c.id
        ORDER BY career_count DESC
        LIMIT %s
        """
        df = pd.read_sql(query, conn, params=(limit,))
        print(f"\n=== 各分类下职业数量 (前{limit}个) ===")
        print(tabulate(df, headers=df.columns, tablefmt="grid", showindex=False))
    except Exception as e:
        print(f"统计各分类职业数量失败: {e}")

def main():
    """主函数"""
    conn = connect_db()
    if conn:
        try:
            # 检查表结构
            check_table_schema(conn, "career_categories")
            check_table_schema(conn, "careers")
            
            # 查看表数据样本
            sample_data(conn, "career_categories", 5)
            sample_data(conn, "careers", 5)
            
            # 统计分类层级
            count_categories_by_level(conn)
            
            # 统计各分类下职业数量
            count_careers_by_category(conn)
            
        except Exception as e:
            print(f"执行查询时出错: {e}")
        finally:
            conn.close()
            print("\n数据库连接已关闭")

if __name__ == "__main__":
    main() 