#!/usr/bin/env python
"""
最终修复脚本
1. 清理不符合外键约束的数据
2. 重新添加外键约束
"""
import pymysql
import sys
from backend.app.core.config import settings

def final_database_fix():
    """最终数据库修复"""
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
            # 清理不符合外键约束的数据
            cursor.execute("""
                UPDATE career_recommendations cr
                LEFT JOIN recommendation_sessions rs 
                ON cr.recommendation_session_id = rs.session_id
                SET cr.recommendation_session_id = NULL
                WHERE rs.session_id IS NULL 
                AND cr.recommendation_session_id IS NOT NULL
            """)
            rows_affected = cursor.rowcount
            conn.commit()
            print(f"已将{rows_affected}条不符合约束的数据设置为NULL")
            
            # 检查是否还有不符合约束的数据
            cursor.execute("""
                SELECT COUNT(*) FROM career_recommendations cr
                LEFT JOIN recommendation_sessions rs 
                ON cr.recommendation_session_id = rs.session_id
                WHERE rs.session_id IS NULL 
                AND cr.recommendation_session_id IS NOT NULL
            """)
            invalid_count = cursor.fetchone()[0]
            
            if invalid_count > 0:
                print(f"警告：仍有{invalid_count}条不符合约束的数据")
                return False
            
            # 重新添加外键约束
            print("正在添加外键约束...")
            cursor.execute("""
                ALTER TABLE career_recommendations
                ADD CONSTRAINT fk_recommendation_session
                FOREIGN KEY (recommendation_session_id)
                REFERENCES recommendation_sessions(session_id)
                ON DELETE CASCADE
            """)
            conn.commit()
            print("外键约束已添加")
            
            # 验证约束已添加
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
                print("外键约束已成功添加:")
                for constraint in constraints:
                    print(f"  {constraint}")
                return True
            else:
                print("外键约束添加失败")
                return False
    
    except Exception as e:
        print(f"最终修复数据库时出错: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    success = final_database_fix()
    sys.exit(0 if success else 1) 