import os
import pymysql

# 数据库配置
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06"

print(f"连接到数据库: {DB_HOST}:{DB_PORT}, {DB_USER}/{DB_PASSWORD}, 数据库: {DB_NAME}")

try:
    # 直接连接到MySQL数据库
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    print("数据库连接成功!")
    
    with connection.cursor() as cursor:
        # 修复行政职业分类(ID=29)
        print("\n=== 修复行政职业分类(ID=29) ===")
        cursor.execute("DESCRIBE career_categories")
        columns = cursor.fetchall()
        print("表结构:")
        for col in columns:
            print(f"{col[0]}: {col[1]}")
        
        # 查询当前数据
        cursor.execute("SELECT id, name, parent_id, level, description FROM career_categories WHERE id = 29")
        category_29 = cursor.fetchone()
        print("\n修复前:")
        print(f"ID: {category_29[0]}")
        print(f"名称: {category_29[1]}")
        print(f"父分类ID: {category_29[2] if category_29[2] else 'NULL'}")
        print(f"级别: {category_29[3]}")
        print(f"描述: {category_29[4] if category_29[4] else '无'}")
        
        # 更新行政职业分类
        affected = cursor.execute("""
            UPDATE career_categories 
            SET parent_id = NULL, 
                level = 1,
                description = '负责办公室行政管理工作的职业分类'
            WHERE id = 29
        """)
        connection.commit()
        print(f"\n更新操作影响的行数: {affected}")
        
        # 检查修复结果
        cursor.execute("SELECT id, name, parent_id, level, description FROM career_categories WHERE id = 29")
        fixed_29 = cursor.fetchone()
        print("\n修复后:")
        print(f"ID: {fixed_29[0]}")
        print(f"名称: {fixed_29[1]}")
        print(f"父分类ID: {fixed_29[2] if fixed_29[2] else 'NULL'}")
        print(f"级别: {fixed_29[3]}")
        print(f"描述: {fixed_29[4] if fixed_29[4] else '无'}")
        
        print("\n行政职业分类数据修复完成!")
        
except Exception as e:
    print(f"修复数据时出错: {e}")
finally:
    if 'connection' in locals():
        connection.close()
        print("数据库连接已关闭") 