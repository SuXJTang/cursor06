import os
import pymysql

# 数据库配置
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06"

try:
    # 连接到MySQL数据库
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    with connection.cursor() as cursor:
        # 统计分类数量
        cursor.execute("SELECT COUNT(*) FROM career_categories")
        total_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE parent_id IS NULL")
        root_count = cursor.fetchone()[0]
        
        sub_count = total_count - root_count
        print(f"总分类数: {total_count} (顶级分类: {root_count}, 子分类: {sub_count})")
        
        # 获取所有顶级分类
        cursor.execute("""
            SELECT id, name, parent_id, level, description 
            FROM career_categories 
            WHERE parent_id IS NULL 
            ORDER BY id
        """)
        root_categories = cursor.fetchall()
        
        print("\n=== 所有顶级职业分类及其子分类 ===\n")
        
        # 遍历每个顶级分类
        for idx, root in enumerate(root_categories):
            print(f"{idx+1}. 【{root[0]}】{root[1]}")
            print(f"   父分类ID: {root[2] if root[2] else 'NULL'}")
            print(f"   级别: {root[3]}")
            print(f"   描述: {root[4] if root[4] else '无'}")
            
            # 获取该顶级分类下的子分类
            cursor.execute(f"""
                SELECT id, name, parent_id, level, description
                FROM career_categories
                WHERE parent_id = {root[0]}
                ORDER BY id
            """)
            subcategories = cursor.fetchall()
            
            if subcategories:
                print("   子分类:")
                for sub in subcategories:
                    print(f"     └─ 【{sub[0]}】{sub[1]} - {sub[4]}")
            else:
                print("   子分类: 暂无")
            
            print()
        
        # 检查异常分类数据
        print("\n检查异常分类数据...")
        cursor.execute("""
            SELECT id, name, parent_id, level, description FROM career_categories 
            WHERE parent_id IS NOT NULL 
            AND parent_id NOT IN (SELECT id FROM career_categories WHERE parent_id IS NULL)
        """)
        orphan_subcategories = cursor.fetchall()
        
        if orphan_subcategories:
            print("发现孤立的子分类（父分类ID不存在）:")
            for orphan in orphan_subcategories:
                print(f"  ID: {orphan[0]}, 名称: {orphan[1]}, 父分类ID: {orphan[2]}, 级别: {orphan[3]}, 描述: {orphan[4]}")
        else:
            print("未发现孤立的子分类")
        
        print("\n所有分类已检查完成.")
        
except Exception as e:
    print(f"查询分类数据时出错: {e}")
finally:
    if 'connection' in locals():
        connection.close() 