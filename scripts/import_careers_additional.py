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

# 更多三级分类ID及其对应的职业数据
CATEGORY_CAREERS = {
    # 产品经理 (ID: 36)
    36: [
        {
            "title": "产品经理",
            "description": "负责产品从概念到发布的全过程管理，协调各方资源",
            "required_skills": ["需求分析", "用户研究", "项目管理", "原型设计", "沟通能力"],
            "education_required": "本科及以上",
            "experience_required": "3年以上",
            "career_path": ["助理产品经理", "高级产品经理", "产品总监"],
            "salary_range": {"min": 15000, "max": 35000},
            "future_prospect": "需求稳定，发展空间大"
        },
        {
            "title": "用户体验设计师",
            "description": "专注于产品用户体验优化，提升用户满意度",
            "required_skills": ["用户研究", "交互设计", "原型设计", "用户测试", "数据分析"],
            "education_required": "本科及以上",
            "experience_required": "2年以上",
            "career_path": ["初级UX设计师", "高级UX设计师", "UX设计总监"],
            "salary_range": {"min": 12000, "max": 25000},
            "future_prospect": "持续增长"
        }
    ],
    
    # 运营 (ID: 37)
    37: [
        {
            "title": "内容运营专员",
            "description": "负责内容策划、创作和发布，提高用户粘性",
            "required_skills": ["内容创作", "用户洞察", "数据分析", "社交媒体运营", "活动策划"],
            "education_required": "本科及以上",
            "experience_required": "1-3年",
            "career_path": ["内容专员", "内容主管", "内容总监"],
            "salary_range": {"min": 8000, "max": 18000},
            "future_prospect": "需求稳定"
        },
        {
            "title": "用户增长经理",
            "description": "专注于用户获取与留存策略的制定和执行",
            "required_skills": ["数据分析", "用户行为分析", "营销策略", "A/B测试", "渠道管理"],
            "education_required": "本科及以上",
            "experience_required": "3年以上",
            "career_path": ["增长专员", "增长经理", "增长总监"],
            "salary_range": {"min": 12000, "max": 25000},
            "future_prospect": "前景广阔"
        },
        {
            "title": "社区运营专员",
            "description": "负责建设和管理线上社区，提高用户活跃度",
            "required_skills": ["社区管理", "内容创作", "用户互动", "活动策划", "危机处理"],
            "education_required": "大专及以上",
            "experience_required": "1-2年",
            "career_path": ["社区专员", "社区经理", "社区总监"],
            "salary_range": {"min": 7000, "max": 15000},
            "future_prospect": "稳定发展"
        }
    ],
    
    # 数据分析 (ID: 38)
    38: [
        {
            "title": "数据分析师",
            "description": "负责收集、处理和分析数据，提供决策支持",
            "required_skills": ["SQL", "Excel", "数据可视化", "统计分析", "业务理解能力"],
            "education_required": "本科及以上",
            "experience_required": "2年以上",
            "career_path": ["初级分析师", "高级分析师", "数据分析经理"],
            "salary_range": {"min": 10000, "max": 20000},
            "future_prospect": "需求持续增长"
        },
        {
            "title": "商业智能分析师",
            "description": "专注于业务数据的分析和商业决策支持",
            "required_skills": ["数据仓库", "BI工具", "SQL", "数据建模", "统计分析"],
            "education_required": "本科及以上",
            "experience_required": "3年以上",
            "career_path": ["BI分析师", "BI经理", "数据总监"],
            "salary_range": {"min": 12000, "max": 25000},
            "future_prospect": "需求旺盛"
        }
    ],
    
    # 职场顾问 (ID: 107) - 假设这是金融/财会分类下的三级分类
    107: [
        {
            "title": "职业规划顾问",
            "description": "为客户提供专业的职业发展规划和咨询服务",
            "required_skills": ["职业规划", "沟通技巧", "心理学知识", "行业洞察", "咨询技巧"],
            "education_required": "本科及以上",
            "experience_required": "3年以上相关行业经验",
            "career_path": ["初级顾问", "资深顾问", "咨询总监"],
            "salary_range": {"min": 10000, "max": 20000},
            "future_prospect": "市场需求增长中"
        },
        {
            "title": "高管猎头顾问",
            "description": "专注于高端人才招聘和企业高管寻访",
            "required_skills": ["人才评估", "行业研究", "商务谈判", "人脉资源", "项目管理"],
            "education_required": "本科及以上",
            "experience_required": "5年以上",
            "career_path": ["猎头顾问", "资深顾问", "合伙人"],
            "salary_range": {"min": 15000, "max": 50000},
            "future_prospect": "高端市场稳定"
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
    print("开始导入额外职业数据...")
    
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