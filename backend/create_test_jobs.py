import os
import pandas as pd
from datetime import datetime

def create_test_jobs():
    """创建测试职位数据"""
    # 确保uploads目录存在
    os.makedirs("uploads", exist_ok=True)
    
    # 创建测试数据
    jobs_data = [
        {
            "title": "Python高级开发工程师",
            "company": "智能科技有限公司",
            "description": "负责公司核心业务系统的后端开发和优化，参与系统架构设计",
            "requirements": "1. 精通Python编程，熟悉主流框架\n2. 有5年以上开发经验\n3. 熟悉分布式系统设计",
            "skills": '["Python", "FastAPI", "Django", "MySQL", "Redis"]',
            "benefits": '["五险一金", "年终奖", "带薪休假", "免费三餐"]',
            "salary_range": "25k-45k",
            "location": "深圳",
            "job_type": "全职",
            "category_id": 1,  # 后端开发
            "experience_required": "5年以上",
            "education_required": "本科",
            "status": "active"
        },
        {
            "title": "前端开发工程师",
            "company": "创新网络科技",
            "description": "负责公司产品的前端开发和优化",
            "requirements": "1. 精通JavaScript、HTML5、CSS3\n2. 熟悉Vue.js或React\n3. 有3年以上前端开发经验",
            "skills": '["JavaScript", "Vue.js", "React", "HTML5", "CSS3"]',
            "benefits": '["五险一金", "年终奖", "弹性工作", "团队建设"]',
            "salary_range": "15k-25k",
            "location": "广州",
            "job_type": "全职",
            "category_id": 2,  # 前端开发
            "experience_required": "3年以上",
            "education_required": "本科",
            "status": "active"
        },
        {
            "title": "全栈开发工程师",
            "company": "未来科技有限公司",
            "description": "负责公司产品的全栈开发工作",
            "requirements": "1. 精通前后端开发技术\n2. 熟悉微服务架构\n3. 有5年以上开发经验",
            "skills": '["Python", "JavaScript", "Vue.js", "MySQL", "Docker"]',
            "benefits": '["五险一金", "年终奖", "期权激励", "免费工作餐"]',
            "salary_range": "30k-50k",
            "location": "北京",
            "job_type": "全职",
            "category_id": 3,  # 全栈开发
            "experience_required": "5年以上",
            "education_required": "本科",
            "status": "active"
        }
    ]
    
    # 创建DataFrame
    df = pd.DataFrame(jobs_data)
    
    # 保存为Excel文件，指定sheet_name为'导入数据'
    output_path = "uploads/test_jobs.xlsx"
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='导入数据', index=False)
    print(f"测试数据已创建：{output_path}")

if __name__ == "__main__":
    create_test_jobs() 