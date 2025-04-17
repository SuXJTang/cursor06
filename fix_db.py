#!/usr/bin/env python
"""
修复数据库表结构脚本
将career_recommendations表中的recommendation_session_id列改为VARCHAR(36)
"""
import pymysql
import sys
from backend.app.core.config import settings

def fix_database_schema():
    """修改数据库表结构"""
    try:
        # 连接到MySQL数据库
        conn = pymysql.connect(
            host=settings.MYSQL_HOST,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            database=settings.MYSQL_DATABASE
        )
        
        # 创建游标对象
        with conn.cursor() as cursor:
            # 检查外键约束
            cursor.execute("""
                SELECT CONSTRAINT_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_NAME = 'career_recommendations'
                AND COLUMN_NAME = 'recommendation_session_id'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            """)
            constraint = cursor.fetchone()
            
            # 如果存在外键约束，先删除
            if constraint:
                constraint_name = constraint[0]
                print(f"发现外键约束: {constraint_name}，正在删除...")
                cursor.execute(f"""
                    ALTER TABLE career_recommendations
                    DROP FOREIGN KEY {constraint_name}
                """)
                conn.commit()
                print(f"外键约束 {constraint_name} 已删除")
            
            # 检查当前列类型
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'career_recommendations' 
                AND COLUMN_NAME = 'recommendation_session_id'
            """)
            column_info = cursor.fetchone()
            
            if column_info:
                print(f"当前列信息: {column_info}")
                column_name, data_type, max_length = column_info
                
                # 获取引用的表和列信息
                cursor.execute("""
                    SELECT REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE TABLE_NAME = 'career_recommendations'
                    AND COLUMN_NAME = 'recommendation_session_id'
                    AND REFERENCED_TABLE_NAME IS NOT NULL
                """)
                ref_info = cursor.fetchone()
                
                ref_table = "recommendation_sessions"
                ref_column = "session_id"
                if ref_info:
                    ref_table, ref_column = ref_info
                
                # 如果是整数类型，修改为VARCHAR(36)
                if data_type.lower() in ('int', 'integer', 'bigint'):
                    print("正在修改列类型为VARCHAR(36)...")
                    cursor.execute("""
                        ALTER TABLE career_recommendations 
                        MODIFY COLUMN recommendation_session_id VARCHAR(36)
                    """)
                    conn.commit()
                    print("列类型已修改为VARCHAR(36)")
                    
                    # 查询不符合外键约束的数据
                    print("检查不符合外键约束的数据...")
                    cursor.execute(f"""
                        SELECT cr.id, cr.recommendation_session_id 
                        FROM career_recommendations cr
                        LEFT JOIN {ref_table} rs 
                        ON cr.recommendation_session_id = rs.{ref_column}
                        WHERE rs.{ref_column} IS NULL 
                        AND cr.recommendation_session_id IS NOT NULL
                    """)
                    invalid_records = cursor.fetchall()
                    
                    if invalid_records:
                        print(f"发现{len(invalid_records)}条不符合外键约束的数据")
                        
                        # 询问是否删除这些数据
                        answer = input(f"是否删除这些数据？(y/n): ")
                        if answer.lower() == 'y':
                            for record in invalid_records:
                                record_id = record[0]
                                cursor.execute(f"""
                                    DELETE FROM career_recommendations
                                    WHERE id = {record_id}
                                """)
                            conn.commit()
                            print(f"已删除{len(invalid_records)}条不符合约束的数据")
                        else:
                            # 将这些记录的外键值设为NULL
                            for record in invalid_records:
                                record_id = record[0]
                                cursor.execute(f"""
                                    UPDATE career_recommendations
                                    SET recommendation_session_id = NULL
                                    WHERE id = {record_id}
                                """)
                            conn.commit()
                            print(f"已将{len(invalid_records)}条记录的外键值设为NULL")
                    
                    # 重新添加外键约束
                    print(f"重新添加外键约束到{ref_table}.{ref_column}...")
                    cursor.execute(f"""
                        ALTER TABLE career_recommendations
                        ADD CONSTRAINT fk_recommendation_session
                        FOREIGN KEY (recommendation_session_id)
                        REFERENCES {ref_table}({ref_column})
                        ON DELETE CASCADE
                    """)
                    conn.commit()
                    print("外键约束已重新添加")
                else:
                    print(f"列类型已经是{data_type}，无需修改")
            else:
                print("未找到recommendation_session_id列")
            
            # 验证修改
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'career_recommendations' 
                AND COLUMN_NAME = 'recommendation_session_id'
            """)
            column_info = cursor.fetchone()
            
            if column_info:
                print(f"修改后的列信息: {column_info}")
        
        print("数据库表结构修复完成")
        return True
    
    except Exception as e:
        print(f"修复数据库结构时出错: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    success = fix_database_schema()
    sys.exit(0 if success else 1) 