#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
数据库迁移脚本：添加work_years字段并同步数据
解决字段映射问题
"""

import os
import sys
from sqlalchemy import create_engine, text
import sqlite3

# 获取数据库文件路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# 创建引擎
engine = create_engine(DATABASE_URL)

def run_migration():
    """运行数据库迁移"""
    print("=== 开始数据库迁移：添加work_years字段并同步 ===")
    print(f"使用数据库: {DB_PATH}")
    
    # 检查数据库文件是否存在
    if not os.path.exists(DB_PATH):
        print(f"错误: 数据库文件 {DB_PATH} 不存在!")
        return False
    
    try:
        with engine.connect() as conn:
            
            # 检查表是否存在
            check_query = text("SELECT name FROM sqlite_master WHERE type='table' AND name='user_profiles'")
            result = conn.execute(check_query)
            if not result.scalar():
                print("错误: user_profiles表不存在")
                return False
            
            # 检查work_years字段是否存在
            check_column_query = text("PRAGMA table_info(user_profiles)")
            columns = conn.execute(check_column_query).fetchall()
            column_names = [col[1] for col in columns]
            
            # 如果work_years字段已存在，检查是否有NULL值需要同步
            if 'work_years' in column_names:
                print("work_years字段已存在，检查数据同步情况...")
                
                # 检查work_years为NULL但experience_years不为NULL的记录
                sync_check_query = text("""
                    SELECT COUNT(*) FROM user_profiles 
                    WHERE (work_years IS NULL AND experience_years IS NOT NULL)
                    OR (experience_years IS NULL AND work_years IS NOT NULL)
                """)
                sync_needed_count = conn.execute(sync_check_query).scalar()
                
                if sync_needed_count > 0:
                    print(f"需要同步 {sync_needed_count} 条记录...")
                    
                    # 从experience_years同步到work_years
                    sync_query1 = text("""
                        UPDATE user_profiles 
                        SET work_years = experience_years 
                        WHERE work_years IS NULL AND experience_years IS NOT NULL
                    """)
                    conn.execute(sync_query1)
                    
                    # 从work_years同步到experience_years
                    sync_query2 = text("""
                        UPDATE user_profiles 
                        SET experience_years = work_years 
                        WHERE experience_years IS NULL AND work_years IS NOT NULL
                    """)
                    conn.execute(sync_query2)
                    
                    print("数据同步完成")
                else:
                    print("无需数据同步")
                
            # 如果work_years字段不存在，添加该字段并同步数据
            else:
                print("work_years字段不存在，开始添加...")
                
                # 添加work_years字段
                add_column_query = text("""
                    ALTER TABLE user_profiles 
                    ADD COLUMN work_years INTEGER
                """)
                conn.execute(add_column_query)
                print("work_years字段添加成功")
                
                # 从experience_years同步数据到work_years
                sync_query = text("""
                    UPDATE user_profiles 
                    SET work_years = experience_years 
                    WHERE experience_years IS NOT NULL
                """)
                conn.execute(sync_query)
                print("数据同步完成")
            
            # 检查当前所有用户资料的work_years和experience_years
            check_data_query = text("""
                SELECT id, user_id, full_name, work_years, experience_years 
                FROM user_profiles
            """)
            profiles = conn.execute(check_data_query).fetchall()
            
            if profiles:
                print("\n当前用户资料数据:")
                for profile in profiles:
                    print(f"用户ID: {profile[1]}, 姓名: {profile[2]}, "
                          f"work_years: {profile[3]}, experience_years: {profile[4]}")
            else:
                print("没有用户资料数据")
            
            print("\n迁移成功完成!")
            return True
            
    except Exception as e:
        print(f"迁移过程中发生错误: {str(e)}")
        return False

if __name__ == "__main__":
    run_migration() 