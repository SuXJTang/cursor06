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

# 更多领域职业数据
MORE_CAREERS = [
    # 法律领域
    {
        "title": "法务专员",
        "description": "处理企业法律事务和合同管理",
        "category_id": 109,
        "required_skills": ["法律知识", "合同管理", "法律风险", "谈判技巧", "案例分析"],
        "education_required": "本科及以上",
        "experience_required": "2年以上",
        "career_path": ["法务专员", "法务经理", "法律总监"],
        "salary_range": {"min": 10000, "max": 25000},
        "future_prospect": "稳定需求"
    },
    {
        "title": "律师",
        "description": "提供法律咨询和诉讼代理服务",
        "category_id": 109,
        "required_skills": ["法律专业知识", "诉讼技巧", "案例研究", "法规解读", "文书撰写"],
        "education_required": "本科及以上",
        "experience_required": "3年以上",
        "career_path": ["律师助理", "执业律师", "合伙人"],
        "salary_range": {"min": 15000, "max": 40000},
        "future_prospect": "长期稳定"
    },
    
    # 教育领域
    {
        "title": "中学教师",
        "description": "负责中学学科教学和学生辅导",
        "category_id": 69,
        "required_skills": ["教学设计", "学科知识", "教学组织", "班级管理", "学生心理学"],
        "education_required": "本科及以上",
        "experience_required": "无经验要求",
        "career_path": ["助教", "教师", "教研组长", "教学主任"],
        "salary_range": {"min": 7000, "max": 15000},
        "future_prospect": "稳定就业"
    },
    {
        "title": "大学教授",
        "description": "负责高等教育教学和科研工作",
        "category_id": 69,
        "required_skills": ["专业研究", "论文发表", "教学能力", "课题申报", "学术指导"],
        "education_required": "博士",
        "experience_required": "5年以上",
        "career_path": ["讲师", "副教授", "教授", "系主任"],
        "salary_range": {"min": 15000, "max": 40000},
        "future_prospect": "稳定发展"
    },
    
    # 医疗健康领域
    {
        "title": "临床医生",
        "description": "负责患者的诊断和治疗",
        "category_id": 51,
        "required_skills": ["临床诊断", "治疗方案", "病历管理", "沟通能力", "专业知识"],
        "education_required": "本科及以上",
        "experience_required": "3年以上",
        "career_path": ["住院医师", "主治医师", "副主任医师", "主任医师"],
        "salary_range": {"min": 10000, "max": 40000},
        "future_prospect": "持续需求"
    },
    {
        "title": "护士",
        "description": "为患者提供护理和健康指导",
        "category_id": 51,
        "required_skills": ["护理技能", "健康评估", "沟通技巧", "心理疏导", "医疗设备操作"],
        "education_required": "大专及以上",
        "experience_required": "1年以上",
        "career_path": ["护士", "护师", "主管护师", "护士长"],
        "salary_range": {"min": 6000, "max": 15000},
        "future_prospect": "需求大"
    },
    
    # 运营领域
    {
        "title": "内容运营专员",
        "description": "负责内容策划和发布，提高用户粘性",
        "category_id": 37,
        "required_skills": ["内容策划", "用户运营", "数据分析", "活动策划", "创意写作"],
        "education_required": "本科及以上",
        "experience_required": "1年以上",
        "career_path": ["运营专员", "运营主管", "运营经理"],
        "salary_range": {"min": 8000, "max": 18000},
        "future_prospect": "需求稳定"
    },
    {
        "title": "电子商务运营",
        "description": "负责电商平台的商品管理和营销推广",
        "category_id": 37,
        "required_skills": ["商品管理", "营销策划", "活动运营", "数据分析", "用户体验"],
        "education_required": "本科及以上",
        "experience_required": "2年以上",
        "career_path": ["运营专员", "运营主管", "运营总监"],
        "salary_range": {"min": 10000, "max": 25000},
        "future_prospect": "前景广阔"
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
    print("开始导入更多领域的职业数据...")
    
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
        for career_data in MORE_CAREERS:
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