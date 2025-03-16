from sqlalchemy import create_engine, text
from app.core.config import settings
import json

def check_job_imports_table():
    """检查 job_imports 表中的数据"""
    # 创建数据库引擎
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)
    
    try:
        # 连接数据库
        with engine.connect() as conn:
            # 检查表结构
            columns_sql = text("SHOW COLUMNS FROM job_imports")
            columns_result = conn.execute(columns_sql)
            columns = [row[0] for row in columns_result]
            
            print(f"job_imports 表的列: {columns}")
            
            # 检查记录数
            count_sql = text("SELECT COUNT(*) FROM job_imports")
            count_result = conn.execute(count_sql)
            count = count_result.scalar()
            
            print(f"job_imports 表中的记录数: {count}")
            
            if count > 0:
                # 获取最新的记录
                imports_sql = text("SELECT * FROM job_imports ORDER BY id DESC LIMIT 5")
                imports_result = conn.execute(imports_sql)
                imports = [dict(zip(columns, row)) for row in imports_result]
                
                print("\n最新的 5 条记录:")
                for i, import_record in enumerate(imports):
                    print(f"\n--- 导入记录 {i+1} ---")
                    for key, value in import_record.items():
                        if key == 'error_details' and value:
                            try:
                                # 尝试解析 JSON 字段
                                parsed_value = json.loads(value)
                                print(f"{key}: {json.dumps(parsed_value, ensure_ascii=False, indent=2)}")
                            except:
                                print(f"{key}: {value}")
                        else:
                            print(f"{key}: {value}")
    except Exception as e:
        print(f"检查表时出错: {e}")

if __name__ == "__main__":
    check_job_imports_table() 