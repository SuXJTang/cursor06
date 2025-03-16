from app.db.session import engine
from sqlalchemy import text

def check_tables():
    """检查数据库中的表"""
    with engine.connect() as conn:
        # 查看所有表
        result = conn.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result]
        print("数据库中的表：")
        for table in tables:
            print(f"- {table}")
        
        # 检查 job_imports 表结构
        if 'job_imports' in tables:
            result = conn.execute(text("DESCRIBE job_imports"))
            print("\njob_imports 表结构：")
            columns = []
            for row in result:
                columns.append({
                    "字段": row[0],
                    "类型": row[1],
                    "可空": row[2],
                    "键": row[3],
                    "默认值": row[4],
                    "额外信息": row[5]
                })
            
            # 打印表格形式的结果
            for col in columns:
                print(f"字段: {col['字段']:<15} 类型: {col['类型']:<15} 可空: {col['可空']:<5} 键: {col['键']:<5} 默认值: {col['默认值']}")
        else:
            print("\njob_imports 表不存在")
            
        # 检查 failed_count 字段是否存在
        if 'job_imports' in tables:
            result = conn.execute(text("SHOW COLUMNS FROM job_imports LIKE 'failed_count'"))
            rows = [row for row in result]
            if rows:
                print("\nfailed_count 字段存在")
                print(f"字段: {rows[0][0]}, 类型: {rows[0][1]}, 可空: {rows[0][2]}, 键: {rows[0][3]}, 默认值: {rows[0][4]}")
            else:
                print("\nfailed_count 字段不存在")
        
        # 查看 job_imports 表中的数据
        if 'job_imports' in tables:
            result = conn.execute(text("SELECT * FROM job_imports LIMIT 10"))
            rows = [row for row in result]
            if rows:
                print("\njob_imports 表中的数据：")
                for row in rows:
                    print(f"ID: {row[0]}, 文件名: {row[1]}, 状态: {row[6]}, 成功数: {row[4]}, 失败数: {row[5]}")
                
                # 统计数据
                result = conn.execute(text("SELECT COUNT(*) FROM job_imports"))
                count = result.scalar()
                print(f"\n总记录数: {count}")
                
                result = conn.execute(text("SELECT status, COUNT(*) FROM job_imports GROUP BY status"))
                print("\n按状态统计:")
                for row in result:
                    print(f"状态: {row[0]}, 数量: {row[1]}")
            else:
                print("\njob_imports 表中没有数据")

if __name__ == "__main__":
    check_tables() 