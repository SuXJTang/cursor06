from sqlalchemy import create_engine, text
from app.core.config import settings

def update_job_table():
    """更新 jobs 表结构，将 job_status 字段重命名为 status"""
    # 创建数据库引擎
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)
    
    try:
        # 连接数据库
        with engine.connect() as conn:
            # 检查 job_status 字段是否存在
            check_job_status_sql = text("SHOW COLUMNS FROM jobs LIKE 'job_status'")
            result = conn.execute(check_job_status_sql)
            job_status_exists = result.fetchone() is not None
            
            # 检查 status 字段是否存在
            check_status_sql = text("SHOW COLUMNS FROM jobs LIKE 'status'")
            result = conn.execute(check_status_sql)
            status_exists = result.fetchone() is not None
            
            if job_status_exists and not status_exists:
                # 将 job_status 重命名为 status
                alter_sql = text("ALTER TABLE jobs CHANGE COLUMN job_status status VARCHAR(20) DEFAULT 'active' COMMENT '岗位状态：active-招聘中，closed-已结束'")
                conn.execute(alter_sql)
                print("成功将 job_status 字段重命名为 status")
            elif not job_status_exists and not status_exists:
                # 添加 status 字段
                alter_sql = text("ALTER TABLE jobs ADD COLUMN status VARCHAR(20) DEFAULT 'active' COMMENT '岗位状态：active-招聘中，closed-已结束'")
                conn.execute(alter_sql)
                print("成功添加 status 字段到 jobs 表")
            elif status_exists:
                print("status 字段已存在于 jobs 表中")
    except Exception as e:
        print(f"更新表结构时出错: {e}")

if __name__ == "__main__":
    update_job_table() 