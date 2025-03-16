import mysql.connector
import json
from datetime import datetime

# 连接数据库
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="cursor06"
    )
    cursor = conn.cursor()
    
    # 准备岗位数据
    title = "测试岗位-直接添加"
    company = "测试公司"
    description = "这是一个用于测试的岗位"
    requirements = "测试要求"
    skills = json.dumps(["Python", "测试"])
    education_required = "本科"
    experience_required = "2年"
    salary_range = json.dumps("15k-20k")
    location = "北京"
    job_type = "全职"
    status = "active"
    benefits = json.dumps(["五险一金", "带薪年假"])
    category_id = 1
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    updated_at = created_at
    
    # 插入数据
    sql = """
    INSERT INTO jobs (
        title, company, description, requirements, skills, 
        education_required, experience_required, salary_range, 
        location, job_type, status, benefits, category_id, 
        created_at, updated_at
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    )
    """
    
    values = (
        title, company, description, requirements, skills,
        education_required, experience_required, salary_range,
        location, job_type, status, benefits, category_id,
        created_at, updated_at
    )
    
    cursor.execute(sql, values)
    conn.commit()
    
    job_id = cursor.lastrowid
    print(f"成功添加岗位，ID: {job_id}")
    
    # 关闭连接
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"添加岗位失败: {str(e)}") 