import os
import pymysql
from dotenv import load_dotenv

# 加载环境变量
load_dotenv(".env")

# 数据库配置
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "123456")
DB_NAME = os.getenv("DB_NAME", "cursor06")

# 连接到数据库
connection = pymysql.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

try:
    with connection.cursor() as cursor:
        # 1. 显示当前生活服务分类数据
        cursor.execute("SELECT * FROM career_categories WHERE id = 31")
        before = cursor.fetchone()
        print("修复前:")
        print(f"ID: {before[0]}")
        print(f"名称: {before[1]}")
        print(f"描述: {before[2] if before[2] else '无'}")
        print(f"父分类ID: {before[3]}")
        print(f"级别: {before[4]}")
        
        # 2. 先将子分类的parent_id设为NULL
        cursor.execute("UPDATE career_categories SET parent_id = NULL WHERE parent_id = 31")
        
        # 3. 直接修复生活服务分类数据
        cursor.execute("""
            UPDATE career_categories 
            SET description = '生活服务和便民服务相关职业',
                parent_id = NULL,
                level = 1
            WHERE id = 31
        """)
        
        # 4. 提交更改
        connection.commit()
        
        # 5. 检查修复后的数据
        cursor.execute("SELECT * FROM career_categories WHERE id = 31")
        after = cursor.fetchone()
        print("\n修复后:")
        print(f"ID: {after[0]}")
        print(f"名称: {after[1]}")
        print(f"描述: {after[2] if after[2] else '无'}")
        print(f"父分类ID: {after[3]}")
        print(f"级别: {after[4]}")
        
        # 6. 恢复子分类的parent_id
        cursor.execute("UPDATE career_categories SET parent_id = 31 WHERE id IN (45, 46)")
        connection.commit()
        
        # 7. 检查子分类
        cursor.execute("SELECT id, name, parent_id FROM career_categories WHERE parent_id = 31")
        subs = cursor.fetchall()
        print("\n子分类恢复情况:")
        for sub in subs:
            print(f"  ID: {sub[0]}, 名称: {sub[1]}, 父分类ID: {sub[2]}")
        
        print("\n生活服务分类数据修复完成!")
        
finally:
    connection.close() 