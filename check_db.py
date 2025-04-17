#!/usr/bin/env python
"""
检查数据库表结构和约束
"""
import pymysql
import sys
from backend.app.core.config import settings

def check_database_schema():
    """检查数据库表结构和约束"""
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
            # 检查career_recommendations表的recommendation_session_id列
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'career_recommendations' 
                AND COLUMN_NAME = 'recommendation_session_id'
            """)
            column_info = cursor.fetchone()
            
            if column_info:
                print(f"列信息: {column_info}")
            else:
                print("未找到recommendation_session_id列")
            
            # 检查外键约束
            cursor.execute("""
                SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, 
                       REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_NAME = 'career_recommendations'
                AND COLUMN_NAME = 'recommendation_session_id'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            """)
            constraints = cursor.fetchall()
            
            if constraints:
                print("外键约束:")
                for constraint in constraints:
                    print(f"  {constraint}")
            else:
                print("未找到外键约束")
                
            # 检查recommendation_sessions表的结构
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'recommendation_sessions' 
                AND COLUMN_NAME = 'session_id'
            """)
            ref_column_info = cursor.fetchone()
            
            if ref_column_info:
                print(f"引用列信息: {ref_column_info}")
            else:
                print("未找到session_id列")
            
            # 检查不符合外键约束的数据
            cursor.execute("""
                SELECT COUNT(*) FROM career_recommendations cr
                LEFT JOIN recommendation_sessions rs 
                ON cr.recommendation_session_id = rs.session_id
                WHERE rs.session_id IS NULL 
                AND cr.recommendation_session_id IS NOT NULL
            """)
            invalid_count = cursor.fetchone()[0]
            print(f"不符合外键约束的数据条数: {invalid_count}")
            
            if invalid_count > 0:
                print("检查前10条不符合约束的数据:")
                cursor.execute("""
                    SELECT cr.id, cr.recommendation_session_id 
                    FROM career_recommendations cr
                    LEFT JOIN recommendation_sessions rs 
                    ON cr.recommendation_session_id = rs.session_id
                    WHERE rs.session_id IS NULL 
                    AND cr.recommendation_session_id IS NOT NULL
                    LIMIT 10
                """)
                invalid_records = cursor.fetchall()
                for record in invalid_records:
                    print(f"  ID: {record[0]}, session_id: {record[1]}")
        
        return True
    
    except Exception as e:
        print(f"检查数据库结构时出错: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    success = check_database_schema()
    sys.exit(0 if success else 1) 