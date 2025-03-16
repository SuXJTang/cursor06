from sqlalchemy import create_engine, text
from app.core.config import settings
import json

def check_jobs_table():
    """检查 jobs 表中的数据"""
    # 创建数据库引擎
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)
    
    try:
        # 连接数据库
        with engine.connect() as conn:
            # 检查表结构
            columns_sql = text("SHOW COLUMNS FROM jobs")
            columns_result = conn.execute(columns_sql)
            columns = [row[0] for row in columns_result]
            
            print(f"jobs 表的列: {columns}")
            
            # 检查记录数
            count_sql = text("SELECT COUNT(*) FROM jobs")
            count_result = conn.execute(count_sql)
            count = count_result.scalar()
            
            print(f"jobs 表中的记录数: {count}")
            
            if count > 0:
                # 获取最新的记录
                jobs_sql = text("SELECT * FROM jobs ORDER BY id DESC LIMIT 5")
                jobs_result = conn.execute(jobs_sql)
                jobs = [dict(zip(columns, row)) for row in jobs_result]
                
                print("\n最新的 5 条记录:")
                for i, job in enumerate(jobs):
                    print(f"\n--- 职位 {i+1} ---")
                    for key, value in job.items():
                        if key in ['required_skills', 'benefits', 'salary_range'] and value:
                            try:
                                # 尝试解析 JSON 字段
                                parsed_value = json.loads(value)
                                print(f"{key}: {parsed_value}")
                            except:
                                print(f"{key}: {value}")
                        else:
                            print(f"{key}: {value}")
    except Exception as e:
        print(f"检查表时出错: {e}")

if __name__ == "__main__":
    check_jobs_table() 