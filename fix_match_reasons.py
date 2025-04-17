import pymysql
import json
import random

# 数据库连接信息
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06" 
DB_PORT = 3306

def generate_match_reasons(career_id, career_title=None):
    """生成匹配原因"""
    
    # 可能的匹配原因模板
    reason_templates = [
        "您的专业背景与{title}的要求相符",
        "您掌握了{title}所需的核心技能",
        "您的教育背景满足{title}的需求",
        "您的工作经验符合{title}要求",
        "您的能力特质适合从事{title}工作",
        "{title}的薪资水平符合您的期望",
        "{title}的发展前景与您的职业目标一致",
        "您的问题解决能力适合{title}岗位",
        "您的团队协作能力是{title}的重要素质",
        "您的学习能力使您能够快速适应{title}岗位",
        "您的分析思维能力是{title}的关键要求",
        "您的沟通表达能力符合{title}的工作需要"
    ]
    
    # 根据职业ID选择特定原因
    if "0103" in career_id:  # 假设这是开发相关职业
        specific_reasons = [
            "您的编程技能使您适合从事开发工作",
            "您对技术的理解能力是开发工作的关键",
            "您的代码质量和编程习惯符合开发要求"
        ]
    elif "0106" in career_id:  # 假设这是管理相关职业
        specific_reasons = [
            "您的领导能力适合担任管理类职位",
            "您的决策和判断能力是管理岗位的核心素质",
            "您的项目管理经验对管理岗位非常有价值"
        ]
    elif "0097" in career_id:  # 假设这是数据相关职业
        specific_reasons = [
            "您的数据分析能力适合数据相关工作",
            "您的数理统计基础是数据分析的重要支撑",
            "您对数据可视化和解读的能力非常适合此岗位"
        ]
    else:
        specific_reasons = [
            "您的综合能力与岗位要求匹配度高",
            "您的专业知识是此岗位的重要基础",
            "您的成长潜力适合此职业发展方向"
        ]
    
    # 如果没有提供职业标题，使用通用标题
    if not career_title:
        career_title = "该职业"
    
    # 从模板生成匹配原因，替换{title}为实际职业标题
    general_reasons = [template.format(title=career_title) for template in random.sample(reason_templates, 4)]
    
    # 合并一般原因和特定原因
    all_reasons = general_reasons + specific_reasons
    
    # 随机选择5个原因
    selected_reasons = random.sample(all_reasons, min(5, len(all_reasons)))
    
    return selected_reasons

def update_match_reasons():
    """更新数据库中的匹配原因字段"""
    try:
        # 连接到数据库
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            charset='utf8mb4'
        )
        
        print(f"成功连接到数据库: {DB_NAME}")
        
        with conn.cursor() as cursor:
            # 获取所有职业推荐记录
            cursor.execute("""
                SELECT id, career_id
                FROM career_recommendations
            """)
            
            records = cursor.fetchall()
            
            if not records:
                print("没有找到任何推荐记录。")
                return
            
            print(f"找到 {len(records)} 条推荐记录需要更新匹配原因")
            
            # 获取职业标题
            career_titles = {}
            cursor.execute("SELECT id, title FROM careers")
            for career_id, title in cursor.fetchall():
                career_titles[career_id] = title
            
            # 更新每条记录的匹配原因
            update_count = 0
            for record in records:
                rec_id, career_id = record
                
                # 使用职业标题，如果没有则使用"该职业"
                career_title = career_titles.get(career_id, "该职业")
                
                # 生成匹配原因
                match_reasons = generate_match_reasons(career_id, career_title)
                json_reasons = json.dumps(match_reasons, ensure_ascii=False)
                
                # 更新数据库
                cursor.execute(
                    "UPDATE career_recommendations SET match_reasons = %s WHERE id = %s",
                    (json_reasons, rec_id)
                )
                update_count += 1
                
                if update_count % 10 == 0 or update_count == len(records):
                    print(f"已更新 {update_count}/{len(records)} 条记录")
            
            # 提交更改
            conn.commit()
            print(f"成功更新了 {update_count} 条记录的匹配原因")
            
    except Exception as e:
        print(f"错误: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()
            print("数据库连接已关闭")

if __name__ == "__main__":
    update_match_reasons() 