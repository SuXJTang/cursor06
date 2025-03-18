#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
用户资料字段映射修复脚本 - 主要解决work_years字段映射问题
"""

import requests
import json
import sys
import os
from sqlalchemy import create_engine, Column, Integer, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 打印信息
print("开始执行用户资料字段映射修复脚本", file=sys.stderr)

# 数据库连接 - 使用硬编码路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"
print(f"数据库URL: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 检查模型字段
def check_model_fields():
    """检查模型字段情况"""
    print("\n=== 检查数据库表字段 ===")
    
    # 获取表结构
    try:
        with engine.connect() as conn:
            # 检查user_profiles表是否存在
            table_exists = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='user_profiles'"
            )).fetchone()
            
            if not table_exists:
                print("user_profiles表不存在!")
                return False
            
            # 获取表结构
            table_info = conn.execute(text("PRAGMA table_info(user_profiles)")).fetchall()
            
            # 打印表字段
            print("user_profiles表结构:")
            for column in table_info:
                print(f"  {column[1]} ({column[2]})")
                
            # 检查工作年限字段
            work_years_exists = any(col[1] == 'work_years' for col in table_info)
            experience_years_exists = any(col[1] == 'experience_years' for col in table_info)
            
            print(f"\n工作年限字段检查:")
            print(f"  work_years字段存在: {work_years_exists}")
            print(f"  experience_years字段存在: {experience_years_exists}")
            
            return True
    except Exception as e:
        print(f"检查表结构时发生错误: {str(e)}")
        return False

# 添加work_years字段
def add_work_years_field():
    """添加work_years字段"""
    print("\n=== 添加work_years字段 ===")
    
    try:
        with engine.connect() as conn:
            # 检查字段是否存在
            table_info = conn.execute(text("PRAGMA table_info(user_profiles)")).fetchall()
            work_years_exists = any(col[1] == 'work_years' for col in table_info)
            
            if work_years_exists:
                print("work_years字段已存在，无需添加")
                return True
            
            # 添加字段
            conn.execute(text("ALTER TABLE user_profiles ADD COLUMN work_years INTEGER"))
            print("成功添加work_years字段")
            
            # 同步experience_years中的数据
            conn.execute(text("UPDATE user_profiles SET work_years = experience_years"))
            print("同步experience_years中的数据到work_years")
            
            return True
    except Exception as e:
        print(f"添加字段时发生错误: {str(e)}")
        return False

# 查看用户资料数据
def view_profiles():
    """查看用户资料数据"""
    print("\n=== 查看用户资料数据 ===")
    
    try:
        with engine.connect() as conn:
            # 获取所有用户资料
            profiles = conn.execute(text("SELECT id, user_id, full_name, work_years, experience_years FROM user_profiles")).fetchall()
            
            if not profiles:
                print("没有用户资料数据")
                return
            
            print(f"共有 {len(profiles)} 条用户资料记录:")
            for profile in profiles:
                print(f"  ID: {profile[0]}, 用户ID: {profile[1]}, 姓名: {profile[2]}, "
                      f"work_years: {profile[3]}, experience_years: {profile[4]}")
    except Exception as e:
        print(f"查看资料数据时发生错误: {str(e)}")

# 运行修复脚本
def run_fix():
    """运行修复脚本"""
    print("=== 开始修复用户资料字段映射 ===\n")
    
    # 检查字段
    if not check_model_fields():
        print("❌ 检查字段失败，无法继续")
        return
    
    # 添加work_years字段(如果需要)
    if not add_work_years_field():
        print("❌ 添加work_years字段失败")
    
    # 查看修复后的数据
    view_profiles()
    
    print("\n=== 用户资料字段映射修复完成 ===")

if __name__ == "__main__":
    run_fix() 