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
    
    print("数据库连接成功!")
    
    with connection.cursor() as cursor:
        # 统计分类数量
        cursor.execute("SELECT COUNT(*) FROM career_categories")
        total_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE parent_id IS NULL")
        level1_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE level = 2")
        level2_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE level = 3")
        level3_count = cursor.fetchone()[0]
        
        print("=== 职业分类统计 ===")
        print(f"总分类数: {total_count}")
        print(f"顶级分类数: {level1_count}")
        print(f"二级分类数: {level2_count}")
        print(f"三级分类数: {level3_count}")
        print()
        
        # 获取所有顶级分类
        cursor.execute("""
            SELECT id, name, description
            FROM career_categories 
            WHERE parent_id IS NULL 
            ORDER BY id
        """)
        level1_categories = cursor.fetchall()
        
        print("=== 分类层次结构详情 ===")
        
        # 遍历顶级分类
        for level1 in level1_categories:
            level1_id, level1_name, level1_desc = level1
            print(f"\n【一级分类】{level1_name} (ID: {level1_id})")
            print(f"  描述: {level1_desc}")
            
            # 获取二级分类
            cursor.execute(f"""
                SELECT id, name, description
                FROM career_categories
                WHERE parent_id = {level1_id}
                ORDER BY id
            """)
            level2_categories = cursor.fetchall()
            
            # 遍历二级分类
            for level2 in level2_categories:
                level2_id, level2_name, level2_desc = level2
                print(f"\n  【二级分类】{level2_name} (ID: {level2_id})")
                print(f"    描述: {level2_desc}")
                
                # 获取三级分类
                cursor.execute(f"""
                    SELECT id, name, description
                    FROM career_categories
                    WHERE parent_id = {level2_id}
                    ORDER BY id
                """)
                level3_categories = cursor.fetchall()
                
                # 遍历三级分类
                print("    【三级分类】:")
                for level3 in level3_categories:
                    level3_id, level3_name, level3_desc = level3
                    print(f"      - {level3_name} (ID: {level3_id})")
                    print(f"        描述: {level3_desc}")
                
                # 如果没有三级分类
                if not level3_categories:
                    print("      (无三级分类)")
            
            # 如果没有二级分类
            if not level2_categories:
                print("  (无二级分类)")
        
        # 检查异常情况
        print("\n=== 异常检查 ===")
        
        # 检查没有父分类的二级或三级分类
        cursor.execute("""
            SELECT id, name, level
            FROM career_categories
            WHERE level > 1 AND parent_id IS NULL
        """)
        orphans = cursor.fetchall()
        
        if orphans:
            print("发现没有父分类的子分类:")
            for orphan in orphans:
                print(f"  - {orphan[1]} (ID: {orphan[0]}, 级别: {orphan[2]})")
        else:
            print("未发现没有父分类的子分类")
        
        # 检查级别与层次不匹配的分类
        cursor.execute("""
            SELECT c.id, c.name, c.level, p.level
            FROM career_categories c
            JOIN career_categories p ON c.parent_id = p.id
            WHERE (c.level != p.level + 1)
        """)
        level_mismatches = cursor.fetchall()
        
        if level_mismatches:
            print("\n发现级别与层次不匹配的分类:")
            for mismatch in level_mismatches:
                print(f"  - {mismatch[1]} (ID: {mismatch[0]}, 级别: {mismatch[2]}, 父级别: {mismatch[3]})")
        else:
            print("\n未发现级别与层次不匹配的分类")
        
        print("\n分类层次结构检查完成!")
        
except Exception as e:
    print(f"检查分类数据时出错: {e}")
finally:
    if 'connection' in locals():
        connection.close()
        print("数据库连接已关闭") 