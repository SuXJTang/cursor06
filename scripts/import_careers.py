import json
import requests
import time

# 配置信息
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
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
    ],
    
    # 算法工程师 (ID: 35)
    35: [
        {
            "title": "机器学习工程师",
            "description": "开发和优化机器学习模型和算法",
            "required_skills": ["Python", "TensorFlow/PyTorch", "数据分析", "数学统计", "机器学习算法"],
            "education_required": "硕士及以上",
            "experience_required": "3年以上",
            "career_path": ["研究员", "高级算法工程师", "AI架构师"],
            "salary_range": {"min": 20000, "max": 40000},
            "future_prospect": "高速发展中"
        },
        {
            "title": "计算机视觉工程师",
            "description": "专注于图像处理和计算机视觉算法研发",
            "required_skills": ["Python", "OpenCV", "深度学习", "图像处理", "神经网络"],
            "education_required": "硕士及以上",
            "experience_required": "2年以上",
            "career_path": ["研究员", "高级工程师", "技术专家"],
            "salary_range": {"min": 18000, "max": 35000},
            "future_prospect": "前景广阔"
        },
        {
            "title": "数据挖掘工程师",
            "description": "负责从大量数据中提取有价值的信息和模式",
            "required_skills": ["Python/R", "SQL", "数据分析", "统计学", "机器学习"],
            "education_required": "本科及以上",
            "experience_required": "3年以上",
            "career_path": ["数据分析师", "高级数据科学家", "数据架构师"],
            "salary_range": {"min": 15000, "max": 30000},
            "future_prospect": "需求稳定增长"
        }
    ]
}

def create_career(career_data, category_id):
    """创建职业数据"""
    # 确保category_id设置正确
    career_data["category_id"] = category_id
    
    try:
        response = requests.post(
            f"{BASE_URL}/careers/",
            headers=HEADERS,
            json=career_data
        )
        
        if response.status_code == 200 or response.status_code == 201:
            print(f"成功创建职业: {career_data['title']}")
            return response.json()
        else:
            print(f"创建职业失败: {career_data['title']}, 状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            return None
    except Exception as e:
        print(f"创建职业时发生错误: {str(e)}")
        return None

def main():
    """主函数"""
    print("开始导入职业数据...")
    
    # 统计
    success_count = 0
    fail_count = 0
    
    # 遍历所有分类及其职业
    for category_id, careers in CATEGORY_CAREERS.items():
        print(f"\n处理分类ID {category_id}...")
        
        for career_data in careers:
            result = create_career(career_data, category_id)
            
            if result:
                success_count += 1
            else:
                fail_count += 1
            
            # 稍微延迟一下，避免请求过快
            time.sleep(0.5)
    
    print(f"\n导入完成! 成功: {success_count}, 失败: {fail_count}")

if __name__ == "__main__":
    main() 