import os
import pymysql

# 数据库配置
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06"

try:
    # 直接连接到MySQL数据库
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    with connection.cursor() as cursor:
        # 检查生活服务分类(ID=31)
        print("\n=== 生活服务分类(ID=31)检查 ===")
        
        # 查询当前数据
        cursor.execute("SELECT id, name, parent_id, level, description FROM career_categories WHERE id = 31")
        category = cursor.fetchone()
        
        if category:
            print(f"ID: {category[0]}")
            print(f"名称: {category[1]}")
            print(f"父分类ID: {category[2] if category[2] else 'NULL'}")
            print(f"级别: {category[3]}")
            print(f"描述: {category[4] if category[4] else '无'}")
            
            # 检查子分类
            cursor.execute("SELECT id, name, description FROM career_categories WHERE parent_id = 31")
            subcategories = cursor.fetchall()
            
            print(f"\n子分类数量: {len(subcategories)}")
            for sub in subcategories:
                print(f"- 【{sub[0]}】{sub[1]} - {sub[2]}")
        else:
            print("未找到生活服务分类(ID=31)")
            
        # 检查有异常字段的分类
        print("\n检查异常数据的分类...")
        cursor.execute("SELECT id, name, parent_id, level, description FROM career_categories WHERE level > 2 OR level <= 0")
        unusual = cursor.fetchall()
        
        if unusual:
            print("发现异常级别的分类:")
            for item in unusual:
                print(f"ID: {item[0]}, 名称: {item[1]}, 父分类ID: {item[2] if item[2] else 'NULL'}, 级别: {item[3]}, 描述: {item[4] if item[4] else '无'}")
        else:
            print("未发现异常级别的分类")
        
except Exception as e:
    print(f"查询数据时出错: {e}")
finally:
    if 'connection' in locals():
        connection.close() 