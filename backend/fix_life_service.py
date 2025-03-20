import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# 加载环境变量
load_dotenv(".env")

# 数据库配置
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "123456")
DB_NAME = os.getenv("DB_NAME", "cursor06")

# 创建数据库连接
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        # 修复生活服务分类数据
        print("=== 修复生活服务分类数据 ===")
        
        # 1. 先显示当前数据
        before = conn.execute(text("SELECT * FROM career_categories WHERE id = 31")).fetchone()
        print("修复前:")
        print(f"ID: {before[0]}")
        print(f"名称: {before[1]}")
        print(f"描述: {before[2] if before[2] else '无'}")
        print(f"父分类ID: {before[3]}")
        print(f"级别: {before[4]}")
        
        # 2. 先将子分类的parent_id设为NULL
        conn.execute(text("UPDATE career_categories SET parent_id = NULL WHERE parent_id = 31"))
        conn.commit()
        
        # 3. 使用一条直接的SQL更新语句（不使用参数绑定）
        conn.execute(text("""
            UPDATE career_categories 
            SET 
                description = '生活服务和便民服务相关职业', 
                parent_id = NULL, 
                level = 1 
            WHERE id = 31
        """))
        conn.commit()
        
        # 4. 显示更新后的数据
        after = conn.execute(text("SELECT * FROM career_categories WHERE id = 31")).fetchone()
        print("\n修复后:")
        print(f"ID: {after[0]}")
        print(f"名称: {after[1]}")
        print(f"描述: {after[2] if after[2] else '无'}")
        print(f"父分类ID: {after[3]}")
        print(f"级别: {after[4]}")
        
        # 5. 恢复子分类的parent_id
        conn.execute(text("UPDATE career_categories SET parent_id = 31 WHERE id IN (45, 46)"))
        conn.commit()
        
        # 6. 检查子分类
        subs = conn.execute(text("SELECT id, name, parent_id FROM career_categories WHERE parent_id = 31")).fetchall()
        print(f"\n子分类恢复情况:")
        for sub in subs:
            print(f"  ID: {sub[0]}, 名称: {sub[1]}, 父分类ID: {sub[2]}")
        
        print("\n生活服务分类数据修复完成!")
            
except Exception as e:
    print(f"修复数据时出错: {e}")
    sys.exit(1) 