import pymysql
import json
import time
from datetime import datetime

# 数据库配置
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "cursor06",
    "port": 3306
}

# 金融/财会领域职业数据
FINANCE_CAREERS = [
    {
        "title": "金融分析师",
        "description": "负责企业财务分析和投资决策支持",
        "category_id": 107,
        "required_skills": ["财务分析", "金融建模", "Excel", "投资分析", "报表分析"],
        "education_required": "本科及以上",
        "experience_required": "3年以上",
        "career_path": ["分析师", "高级分析师", "分析经理"],
        "salary_range": {"min": 12000, "max": 25000},
        "future_prospect": "需求稳定"
    },
    {
        "title": "投资顾问",
        "description": "为客户提供投资建议和理财规划",
        "category_id": 107,
        "required_skills": ["理财规划", "风险评估", "资产配置", "金融产品", "沟通技巧"],
        "education_required": "本科及以上",
        "experience_required": "3年以上",
        "career_path": ["理财顾问", "高级顾问", "财富管理经理"],
        "salary_range": {"min": 10000, "max": 30000},
        "future_prospect": "发展良好"
    },
    {
        "title": "风险管理师",
        "description": "评估和管理金融风险，制定风险控制策略",
        "category_id": 107,
        "required_skills": ["风险分析", "金融知识", "统计分析", "法规了解", "模型构建"],
        "education_required": "本科及以上",
        "experience_required": "3年以上",
        "career_path": ["风险分析师", "风险经理", "风险总监"],
        "salary_range": {"min": 15000, "max": 35000},
        "future_prospect": "需求增长"
    },
    {
        "title": "会计师",
        "description": "负责财务记录、报表编制和财务分析",
        "category_id": 108,
        "required_skills": ["会计原则", "财务报表", "税法", "审计", "财务软件"],
        "education_required": "本科及以上",
        "experience_required": "2年以上",
        "career_path": ["会计", "高级会计", "财务经理"],
        "salary_range": {"min": 8000, "max": 20000},
        "future_prospect": "稳定就业"
    },
    {
        "title": "税务专员",
        "description": "处理企业税务申报和税务筹划",
        "category_id": 108,
        "required_skills": ["税法", "财务知识", "税务申报", "税务筹划", "政策解读"],
        "education_required": "本科及以上",
        "experience_required": "2年以上",
        "career_path": ["税务专员", "税务经理", "税务总监"],
        "salary_range": {"min": 10000, "max": 25000},
        "future_prospect": "需求稳定"
    }
]

def connect_db():
    """连接到MySQL数据库"""
    try:
        conn = pymysql.connect(**DB_CONFIG)
        print("成功连接到数据库")
        return conn
    except Exception as e:
        print(f"连接数据库时发生错误: {str(e)}")
        return None

def insert_career(conn, career_data):
    """向数据库中插入职业数据"""
    try:
        with conn.cursor() as cursor:
            # 准备要插入的数据
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # 将列表和字典转换为JSON字符串
            required_skills = json.dumps(career_data["required_skills"], ensure_ascii=False)
            career_path = json.dumps(career_data["career_path"], ensure_ascii=False)
            salary_range = json.dumps(career_data["salary_range"], ensure_ascii=False)
            
            # SQL插入语句
            sql = """
            INSERT INTO careers (
                title, description, category_id, required_skills, 
                education_required, experience_required, career_path, 
                salary_range, future_prospect, created_at, updated_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            """
            
            # 执行SQL
            cursor.execute(sql, (
                career_data["title"],
                career_data["description"],
                career_data["category_id"],
                required_skills,
                career_data["education_required"],
                career_data["experience_required"],
                career_path,
                salary_range,
                career_data["future_prospect"],
                now,
                now
            ))
            
            # 提交事务
            conn.commit()
            print(f"成功插入职业: {career_data['title']}")
            return True
            
    except Exception as e:
        # 回滚事务
        conn.rollback()
        print(f"插入职业时发生错误: {career_data['title']}, 错误: {str(e)}")
        return False

def main():
    """主函数"""
    print("开始直接使用SQL语句导入金融/财会领域职业数据...")
    
    # 连接数据库
    conn = connect_db()
    if not conn:
        print("无法连接到数据库，程序终止")
        return
    
    try:
        # 统计
        success_count = 0
        fail_count = 0
        
        # 遍历所有职业数据
        for career_data in FINANCE_CAREERS:
            result = insert_career(conn, career_data)
            
            if result:
                success_count += 1
            else:
                fail_count += 1
            
            # 延迟一下，避免过快操作数据库
            time.sleep(0.1)
        
        print(f"\n导入完成! 成功: {success_count}, 失败: {fail_count}")
        
    finally:
        # 关闭数据库连接
        conn.close()
        print("数据库连接已关闭")

if __name__ == "__main__":
    main() 