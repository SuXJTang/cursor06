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

# 三级分类ID及其对应的职业数据
CATEGORY_CAREERS = {
    # 软件工程师 (ID: 33)
    33: [
        {
            "title": "全栈工程师",
            "description": "负责前后端全栈开发，精通多种编程语言和框架",
            "required_skills": ["JavaScript", "Python", "React", "Node.js", "SQL"],
            "education_required": "本科及以上",
            "experience_required": "3年以上",
            "career_path": ["初级开发", "高级开发", "技术专家", "架构师"],
            "salary_range": {"min": 15000, "max": 30000},
            "future_prospect": "发展前景广阔"
        },
        {
            "title": "后端工程师",
            "description": "负责服务器端开发，处理业务逻辑和数据存储",
            "required_skills": ["Java", "Python", "Spring", "MySQL", "Redis"],
            "education_required": "本科及以上",
            "experience_required": "2年以上",
            "career_path": ["初级开发", "高级开发", "架构师"],
            "salary_range": {"min": 12000, "max": 25000},
            "future_prospect": "稳定需求"
        },
        {
            "title": "移动开发工程师",
            "description": "专注于移动应用开发，包括iOS和Android平台",
            "required_skills": ["Swift", "Kotlin", "Java", "Flutter", "移动UI设计"],
            "education_required": "本科及以上",
            "experience_required": "2年以上",
            "career_path": ["初级开发", "高级开发", "移动架构师"],
            "salary_range": {"min": 13000, "max": 26000},
            "future_prospect": "需求稳定"
        }
    ],
    
    # 前端开发 (ID: 34)
    34: [
        {
            "title": "前端工程师",
            "description": "负责网站和应用的用户界面开发",
            "required_skills": ["HTML", "CSS", "JavaScript", "React/Vue/Angular", "响应式设计"],
            "education_required": "本科及以上",
            "experience_required": "1-3年",
            "career_path": ["初级前端", "高级前端", "前端架构师"],
            "salary_range": {"min": 10000, "max": 25000},
            "future_prospect": "需求量大"
        },
        {
            "title": "UI/UX设计师",
            "description": "负责用户界面和用户体验设计",
            "required_skills": ["Figma", "Sketch", "用户研究", "交互设计", "视觉设计"],
            "education_required": "本科及以上",
            "experience_required": "2年以上",
            "career_path": ["初级设计师", "高级设计师", "设计主管"],
            "salary_range": {"min": 12000, "max": 22000},
            "future_prospect": "行业需求稳定"
        }
    ]
}

def connect_db():
    """连接到MySQL数据库"""
    try:
        conn = pymysql.connect(**DB_CONFIG)
        print("成功连接到数据库")
        return conn
    except Exception as e:
        print(f"连接数据库时发生错误: {str(e)}")
        return None

def insert_career(conn, career_data, category_id):
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
                category_id,
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
    print("开始使用SQL直接导入职业数据...")
    
    # 连接数据库
    conn = connect_db()
    if not conn:
        print("无法连接到数据库，程序终止")
        return
    
    try:
        # 统计
        success_count = 0
        fail_count = 0
        
        # 遍历所有分类及其职业
        for category_id, careers in CATEGORY_CAREERS.items():
            print(f"\n处理分类ID {category_id}...")
            
            for career_data in careers:
                result = insert_career(conn, career_data, category_id)
                
                if result:
                    success_count += 1
                else:
                    fail_count += 1
                
                # 稍微延迟一下
                time.sleep(0.1)
        
        print(f"\n导入完成! 成功: {success_count}, 失败: {fail_count}")
        
    finally:
        # 关闭数据库连接
        conn.close()
        print("数据库连接已关闭")

if __name__ == "__main__":
    main() 