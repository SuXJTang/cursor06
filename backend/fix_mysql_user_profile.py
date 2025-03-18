#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
MySQL数据库字段修复脚本 - 添加work_years字段并同步数据
"""

import sys
import pymysql
from sqlalchemy import create_engine, text

# MySQL数据库连接信息 - 根据项目配置调整
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06"

# 创建数据库连接URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# 打印信息
print("开始执行MySQL数据库字段修复脚本", file=sys.stderr)
print(f"数据库URL: {DATABASE_URL}", file=sys.stderr)

def fix_user_profile_table():
    """修复用户资料表字段"""
    print("=== 开始修复用户资料表 ===")
    
    try:
        # 创建SQLAlchemy引擎
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            # 检查表是否存在
            check_table_query = text("""
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_schema = :schema 
                AND table_name = 'user_profiles'
            """)
            result = conn.execute(check_table_query, {"schema": DB_NAME})
            if result.scalar() == 0:
                print("错误: user_profiles表不存在!")
                return False
            
            # 检查work_years字段是否存在
            check_column_query = text("""
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_schema = :schema 
                AND table_name = 'user_profiles' 
                AND column_name = 'work_years'
            """)
            result = conn.execute(check_column_query, {"schema": DB_NAME})
            
            if result.scalar() > 0:
                print("work_years字段已存在，检查数据同步情况...")
                
                # 检查需要同步的记录
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
            else:
                print("work_years字段不存在，开始添加...")
                
                # 添加work_years字段
                add_column_query = text("""
                    ALTER TABLE user_profiles 
                    ADD COLUMN work_years INT COMMENT '工作年限(与experience_years同步)'
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
            
            # 查看当前数据
            view_data_query = text("""
                SELECT id, user_id, full_name, work_years, experience_years 
                FROM user_profiles 
                LIMIT 10
            """)
            profiles = conn.execute(view_data_query).fetchall()
            
            if profiles:
                print("\n当前用户资料数据(前10条):")
                for profile in profiles:
                    print(f"ID: {profile[0]}, 用户ID: {profile[1]}, 姓名: {profile[2]}, "
                          f"work_years: {profile[3]}, experience_years: {profile[4]}")
            else:
                print("没有用户资料数据")
            
            print("\n数据库字段修复完成!")
            return True
            
    except Exception as e:
        print(f"修复过程中发生错误: {str(e)}")
        return False

if __name__ == "__main__":
    fix_user_profile_table() 