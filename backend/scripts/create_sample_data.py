#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
职业推荐系统示例数据生成脚本

该脚本创建演示用的职业分类、职业、学习路径和推荐数据
"""

import random
import logging
import json
from sqlalchemy.orm import Session
from typing import Dict, List, Any
from datetime import datetime

from app.db.session import SessionLocal
from app.models.user import User
from app import crud, models, schemas
from app.core.security import get_password_hash

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 职业分类示例数据
CAREER_CATEGORIES = [
    # 技术/互联网
    {
        "name": "技术/互联网",
        "description": "与计算机技术、互联网产品开发和维护相关的职业",
        "subcategories": [
            {
                "name": "软件开发",
                "description": "从事软件应用程序设计和开发的职业",
                "subcategories": []
            },
            {
                "name": "人工智能",
                "description": "与机器学习、深度学习和人工智能应用相关的职业",
                "subcategories": []
            },
            {
                "name": "网络与运维",
                "description": "负责网络系统和IT基础设施的安装、配置和维护的职业",
                "subcategories": []
            },
            {
                "name": "数据科学",
                "description": "处理和分析数据以提供见解和支持决策的职业",
                "subcategories": []
            }
        ]
    },
    # 金融/财会
    {
        "name": "金融/财会",
        "description": "与金融市场、投资、会计和财务管理相关的职业",
        "subcategories": [
            {
                "name": "银行业",
                "description": "在银行和金融机构工作的职业",
                "subcategories": []
            },
            {
                "name": "投资与证券",
                "description": "从事投资分析、基金管理和证券交易的职业",
                "subcategories": []
            },
            {
                "name": "会计与审计",
                "description": "负责财务记录、审计和税务的职业",
                "subcategories": []
            }
        ]
    },
    # 医疗/健康
    {
        "name": "医疗/健康",
        "description": "与医疗保健、护理和健康管理相关的职业",
        "subcategories": [
            {
                "name": "临床医学",
                "description": "直接参与患者诊断和治疗的医疗职业",
                "subcategories": []
            },
            {
                "name": "护理",
                "description": "提供患者护理和治疗支持的职业",
                "subcategories": []
            },
            {
                "name": "健康管理",
                "description": "管理健康计划和医疗机构的职业",
                "subcategories": []
            }
        ]
    },
    # 教育/培训
    {
        "name": "教育/培训",
        "description": "与教学、培训和教育管理相关的职业",
        "subcategories": [
            {
                "name": "基础教育",
                "description": "在幼儿园、小学和中学从事教育工作的职业",
                "subcategories": []
            },
            {
                "name": "高等教育",
                "description": "在大学和研究机构从事教学和研究的职业",
                "subcategories": []
            },
            {
                "name": "教育技术",
                "description": "开发和应用教育技术产品的职业",
                "subcategories": []
            }
        ]
    }
]

# 职业示例数据
CAREERS = [
    # 软件开发类
    {
        "title": "全栈开发工程师",
        "subcategory": "软件开发",
        "description": "全栈开发工程师是掌握前端和后端开发技能的工程师，能够独立完成从用户界面到服务器端的完整应用开发。他们通常精通多种编程语言和框架，具备数据库设计和系统架构能力，能够解决开发过程中的各种技术难题。",
        "skills_required": ["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "微服务架构"],
        "average_salary": "15k-35k",
        "job_outlook": "增长迅速",
        "education_required": "本科",
        "related_majors": ["计算机科学", "软件工程", "信息技术"],
        "work_activities": ["设计并实现前端用户界面", "开发服务器端应用程序和API", "数据库设计和优化", "系统集成和部署", "代码审查和质量保证"],
        "career_path": "初级开发工程师 -> 高级开发工程师 -> 技术架构师 -> 技术总监"
    },
    {
        "title": "前端开发工程师",
        "subcategory": "软件开发",
        "description": "前端开发工程师专注于创建用户界面和交互体验，负责将设计师的视觉创意转化为可交互的网站或应用程序。他们精通HTML、CSS和JavaScript，熟悉前端框架和库，能够构建响应式、高性能的用户界面。",
        "skills_required": ["HTML", "CSS", "JavaScript", "React", "Vue", "Webpack", "UI/UX设计基础"],
        "average_salary": "12k-30k",
        "job_outlook": "需求旺盛",
        "education_required": "本科",
        "related_majors": ["计算机科学", "软件工程", "网页设计"],
        "work_activities": ["构建用户界面", "实现交互功能", "优化网站性能", "确保兼容性", "前端测试"],
        "career_path": "初级前端工程师 -> 高级前端工程师 -> 前端架构师 -> 技术经理"
    },
    {
        "title": "后端开发工程师",
        "subcategory": "软件开发",
        "description": "后端开发工程师负责开发和维护支持应用程序的服务器端逻辑，包括API设计、数据库交互和业务逻辑实现。他们处理数据存储、性能优化和系统安全，确保应用程序能够高效可靠地运行。",
        "skills_required": ["Java", "Python", "C#", "Node.js", "SQL", "NoSQL", "RESTful API设计"],
        "average_salary": "15k-35k",
        "job_outlook": "稳定增长",
        "education_required": "本科",
        "related_majors": ["计算机科学", "软件工程", "信息系统"],
        "work_activities": ["设计和实现API", "数据库架构", "服务器配置", "性能调优", "系统集成"],
        "career_path": "初级后端工程师 -> 高级后端工程师 -> 技术架构师 -> CTO"
    },
    
    # 人工智能类
    {
        "title": "机器学习工程师",
        "subcategory": "人工智能",
        "description": "机器学习工程师专注于开发能够从数据中学习的算法和模型，使计算机系统能够自动改进和适应。他们处理大规模数据集，训练和优化机器学习模型，并将这些模型集成到实际应用中。",
        "skills_required": ["Python", "TensorFlow", "PyTorch", "数据预处理", "模型评估", "深度学习", "数学与统计"],
        "average_salary": "20k-45k",
        "job_outlook": "快速增长",
        "education_required": "硕士",
        "related_majors": ["计算机科学", "人工智能", "应用数学", "统计学"],
        "work_activities": ["数据收集与预处理", "特征工程", "模型设计与训练", "参数调优", "模型部署"],
        "career_path": "初级ML工程师 -> 高级ML工程师 -> ML架构师 -> AI研究科学家"
    },
    {
        "title": "自然语言处理工程师",
        "subcategory": "人工智能",
        "description": "自然语言处理工程师专门研究和开发计算机理解、分析和生成人类语言的技术。他们设计语言模型、情感分析系统、翻译工具和对话机器人，使机器能够处理和响应人类语言。",
        "skills_required": ["Python", "NLP库", "深度学习", "语言学知识", "BERT/GPT模型", "文本分析", "机器翻译"],
        "average_salary": "25k-50k",
        "job_outlook": "高速增长",
        "education_required": "硕士",
        "related_majors": ["计算机科学", "计算语言学", "人工智能"],
        "work_activities": ["文本处理与分析", "语义模型构建", "情感分析", "对话系统开发", "语言生成"],
        "career_path": "NLP研究员 -> 高级NLP工程师 -> NLP架构师 -> AI研究主管"
    },
    
    # 数据科学类
    {
        "title": "数据分析师",
        "subcategory": "数据科学",
        "description": "数据分析师负责收集、处理和分析数据，提取有价值的洞察并支持决策制定。他们使用统计方法和可视化工具解读数据趋势，准备报告和展示，并提出基于数据的建议。",
        "skills_required": ["SQL", "Excel", "Python/R", "数据可视化", "统计分析", "商业智能工具", "数据仓库"],
        "average_salary": "10k-25k",
        "job_outlook": "稳定增长",
        "education_required": "本科",
        "related_majors": ["统计学", "数学", "计算机科学", "经济学"],
        "work_activities": ["数据收集与清洗", "探索性数据分析", "报告生成", "指标监控", "业务分析"],
        "career_path": "初级数据分析师 -> 高级数据分析师 -> 数据科学家 -> 分析主管"
    },
    {
        "title": "大数据工程师",
        "subcategory": "数据科学",
        "description": "大数据工程师负责设计、构建和维护处理海量数据的系统和架构。他们使用分布式计算框架，确保数据的获取、存储、处理和检索高效可靠，为数据分析和机器学习提供基础支持。",
        "skills_required": ["Hadoop", "Spark", "Kafka", "Hive", "NoSQL", "数据仓库", "ETL"],
        "average_salary": "18k-40k",
        "job_outlook": "需求旺盛",
        "education_required": "本科",
        "related_majors": ["计算机科学", "数据工程", "信息系统"],
        "work_activities": ["数据管道构建", "ETL流程开发", "分布式系统管理", "数据架构设计", "性能优化"],
        "career_path": "数据工程师 -> 高级数据工程师 -> 数据架构师 -> 技术总监"
    },
    
    # 金融类
    {
        "title": "金融分析师",
        "subcategory": "投资与证券",
        "description": "金融分析师评估投资机会，研究经济和商业趋势，分析财务数据，为个人或组织提供投资建议。他们撰写财务报告，评估公司绩效，预测市场走势，帮助客户做出明智的投资决策。",
        "skills_required": ["财务建模", "Excel高级应用", "财务报表分析", "估值技术", "行业研究", "预测", "金融市场知识"],
        "average_salary": "15k-35k",
        "job_outlook": "稳定",
        "education_required": "本科",
        "related_majors": ["金融学", "经济学", "会计学", "商业分析"],
        "work_activities": ["财务报表分析", "投资研究", "估值分析", "市场趋势跟踪", "客户咨询"],
        "career_path": "初级分析师 -> 高级分析师 -> 投资经理 -> 投资总监"
    }
]

# 学习路径示例数据（每个职业对应3个学习路径：初级、中级、高级）
def create_learning_paths_data(career_title: str, career_id: int) -> List[Dict[str, Any]]:
    return [
        {
            "title": f"{career_title}的初级学习路径",
            "description": f"适合零基础或初学者的{career_title}入门学习路径，帮助你建立基础知识和技能。",
            "difficulty": "初级",
            "career_id": career_id,
            "estimated_time": "3-6个月",
            "content": f"""
1. 基础知识学习：了解{career_title}的基本概念和工作职责
2. 核心技能入门：掌握该领域必备的入门级技能和工具
3. 小型项目实践：完成2-3个简单的实践项目，巩固所学知识
4. 基础认证准备：准备并获取相关的入门级认证（如适用）
5. 职业规划：了解在该领域的职业发展路径和下一步学习方向
            """,
            "resources": """
资源1: 入门级在线课程（Coursera、Udemy等平台）
资源2: 初学者友好的技术书籍
资源3: 免费的在线教程和文档
            """,
            "prerequisites": "基本的计算机操作能力，学习热情和毅力",
            "view_count": random.randint(100, 500)
        },
        {
            "title": f"{career_title}的中级学习路径",
            "description": f"适合已具备基础知识，希望提升专业能力的{career_title}进阶学习路径。",
            "difficulty": "中级",
            "career_id": career_id,
            "estimated_time": "6-12个月",
            "content": f"""
1. 深入专业知识：系统学习{career_title}的进阶概念和理论
2. 高级技能培养：掌握该领域的高级工具和技术
3. 中型项目实战：参与或独立完成中等复杂度的实际项目
4. 专业认证获取：准备并获取行业认可的专业认证
5. 团队协作：学习团队协作的最佳实践和项目管理知识
            """,
            "resources": """
资源1: 进阶专业课程
资源2: 行业专家的技术博客和文章
资源3: 专业社区和论坛
资源4: 中级技术书籍和实践指南
            """,
            "prerequisites": f"{career_title}的基础知识，1-2年相关经验",
            "view_count": random.randint(50, 300)
        },
        {
            "title": f"{career_title}的高级学习路径",
            "description": f"面向有丰富经验的专业人士，旨在培养领导力和前沿专业能力的{career_title}高级进阶路径。",
            "difficulty": "高级",
            "career_id": career_id,
            "estimated_time": "12-18个月",
            "content": f"""
1. 前沿技术研究：探索{career_title}领域的最新发展和创新技术
2. 领导力发展：培养团队领导和项目管理能力
3. 架构设计：学习系统架构和战略规划的原则和方法
4. 复杂问题解决：通过高级案例研究提升解决复杂问题的能力
5. 行业贡献：参与开源项目、撰写技术文章或行业分享
            """,
            "resources": """
资源1: 高级专业研讨会和工作坊
资源2: 行业会议和专业交流活动
资源3: 高级技术文献和研究论文
资源4: 专家级技术书籍和最佳实践指南
            """,
            "prerequisites": f"{career_title}的中级知识，3年以上相关工作经验",
            "view_count": random.randint(30, 150)
        }
    ]

def create_career_category(db: Session, category_data: Dict[str, Any], parent_id: int = None, level: int = 1) -> models.CareerCategory:
    """创建职业分类及其子分类"""
    # 检查是否已存在同名分类
    db_category = db.query(models.CareerCategory).filter(
        models.CareerCategory.name == category_data["name"]
    ).first()
    
    if db_category:
        logger.info(f"职业分类 '{category_data['name']}' 已存在，ID: {db_category.id}，跳过创建")
    else:
        category_in = schemas.CareerCategoryCreate(
            name=category_data["name"],
            description=category_data["description"],
            parent_id=parent_id,
            level=level
        )
        db_category = crud.career_category.create(db=db, obj_in=category_in)
        logger.info(f"创建职业分类: {db_category.name} (ID: {db_category.id})")
    
    # 创建子分类
    for subcategory_data in category_data.get("subcategories", []):
        create_career_category(db, subcategory_data, db_category.id, level + 1)
    
    return db_category

def create_career(db: Session, career_data: Dict[str, Any], category_map: Dict[str, int]) -> models.Career:
    """创建职业"""
    # 检查是否已存在同名职业
    db_career = db.query(models.Career).filter(
        models.Career.title == career_data["title"]
    ).first()
    
    if db_career:
        logger.info(f"职业 '{career_data['title']}' 已存在，ID: {db_career.id}，跳过创建")
        return db_career
        
    # 获取对应子分类的ID
    subcategory = career_data["subcategory"]
    category_id = category_map.get(subcategory)
    
    if not category_id:
        logger.warning(f"找不到分类 '{subcategory}'，使用默认分类")
        # 使用第一个分类作为默认
        category_id = list(category_map.values())[0]
    
    # 将average_salary字符串转换为salary_range字典
    salary_range = {
        "min": career_data["average_salary"].split("-")[0] if "-" in career_data["average_salary"] else career_data["average_salary"],
        "max": career_data["average_salary"].split("-")[1] if "-" in career_data["average_salary"] else career_data["average_salary"],
        "currency": "CNY",
        "period": "monthly"
    }
    
    # 创建新职业实例
    db_career = models.Career(
        title=career_data["title"],
        description=career_data["description"],
        required_skills=career_data["skills_required"],
        salary_range=salary_range,
        future_prospect=career_data["job_outlook"],
        education_required=career_data["education_required"],
        category_id=category_id,
        career_path=career_data["career_path"].split(" -> ") if " -> " in career_data["career_path"] else [career_data["career_path"]]
    )
    
    db.add(db_career)
    db.commit()
    db.refresh(db_career)
    
    logger.info(f"创建职业: {db_career.title} (ID: {db_career.id})")
    return db_career

def create_learning_path(db: Session, path_data: Dict[str, Any]) -> models.LearningPath:
    """创建学习路径"""
    # 检查是否已存在同样的学习路径
    db_learning_path = db.query(models.LearningPath).filter(
        models.LearningPath.target_career_id == path_data["career_id"],
        models.LearningPath.notes.like(f"%{path_data['title']}%")
    ).first()
    
    if db_learning_path:
        logger.info(f"学习路径 '{path_data['title']}' 已存在，ID: {db_learning_path.id}，跳过创建")
        return db_learning_path
    
    # 模拟用户ID，使用固定的测试用户ID
    test_user_email = "test@example.com"
    test_user = db.query(models.User).filter(models.User.email == test_user_email).first()
    
    if not test_user:
        # 创建测试用户
        test_user = models.User(
            email=test_user_email,
            username="testuser",
            hashed_password=get_password_hash("testpassword"),
            is_active=True,
            is_superuser=False,
            is_verified=True
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        logger.info(f"创建测试用户: {test_user.email} (ID: {test_user.id})")
    
    # 将内容转换为学习步骤
    learning_steps = []
    content_lines = path_data["content"].strip().split("\n")
    for line in content_lines:
        line = line.strip()
        if line and line[0].isdigit() and ". " in line:
            step_number, step_content = line.split(". ", 1)
            learning_steps.append({
                "step": int(step_number),
                "content": step_content,
                "completed": False
            })
    
    # 将资源转换为JSON格式
    resources_list = []
    resources_lines = path_data["resources"].strip().split("\n")
    for line in resources_lines:
        line = line.strip()
        if line and line.startswith("资源"):
            resource_parts = line.split(": ", 1)
            if len(resource_parts) > 1:
                resources_list.append({
                    "name": resource_parts[0],
                    "link": resource_parts[1],
                    "type": "online"
                })
    
    # 创建新学习路径实例    
    db_learning_path = models.LearningPath(
        user_id=test_user.id,
        target_career_id=path_data["career_id"],
        current_level="beginner" if path_data["difficulty"] == "初级" else ("intermediate" if path_data["difficulty"] == "中级" else "advanced"),
        target_level="intermediate" if path_data["difficulty"] == "初级" else ("advanced" if path_data["difficulty"] == "中级" else "expert"),
        required_skills=[],
        learning_steps=learning_steps,
        timeline={"estimated_time": path_data["estimated_time"]},
        resources=resources_list,
        progress=0,
        is_active=True,
        notes=f"{path_data['title']}\n{path_data['description']}\n{path_data['prerequisites']}"
    )
    
    db.add(db_learning_path)
    db.commit()
    db.refresh(db_learning_path)
    
    logger.info(f"创建学习路径: {path_data['title']} (ID: {db_learning_path.id})")
    return db_learning_path

def create_recommendation(db: Session, user_id: int, career_id: int, score: float, reasons: List[str], is_favorite: bool = False) -> models.CareerRecommendation:
    """创建职业推荐"""
    # 检查是否已存在该用户的该职业推荐
    db_recommendation = db.query(models.CareerRecommendation).filter(
        models.CareerRecommendation.user_id == user_id,
        models.CareerRecommendation.career_id == career_id
    ).first()
    
    if db_recommendation:
        logger.info(f"职业推荐已存在，用户ID {user_id}, 职业ID {career_id}，跳过创建")
        return db_recommendation
    
    # 创建分析报告
    analysis_report = {
        "reasons": reasons,
        "score": score,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "recommendation_type": "基于技能和兴趣的推荐"
    }
    
    # 创建新职业推荐实例    
    db_recommendation = models.CareerRecommendation(
        user_id=user_id,
        career_id=career_id,
        match_score=int(score * 100),  # 转换为0-100的整数
        analysis_report=analysis_report,
        is_accepted=is_favorite,  # 收藏的视为已接受
        feedback=None
    )
    
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)
    
    logger.info(f"创建职业推荐: 用户ID {user_id}, 职业ID {career_id}, 匹配分数 {score}")
    return db_recommendation

def main():
    """主函数，创建所有示例数据"""
    db = SessionLocal()
    try:
        logger.info("开始创建示例数据...")
        
        # 1. 创建职业分类
        logger.info("创建职业分类...")
        category_map = {}  # 存储分类名称到ID的映射
        
        for category_data in CAREER_CATEGORIES:
            root_category = create_career_category(db, category_data)
            
            # 记录所有二级分类的ID映射
            for subcategory in category_data.get("subcategories", []):
                # 查询子分类
                db_subcategory = db.query(models.CareerCategory).filter(
                    models.CareerCategory.name == subcategory["name"]
                ).first()
                
                if db_subcategory:
                    category_map[subcategory["name"]] = db_subcategory.id
        
        # 2. 创建职业
        logger.info("创建职业...")
        career_map = {}  # 存储职业名称到ID的映射
        
        for career_data in CAREERS:
            db_career = create_career(db, career_data, category_map)
            career_map[db_career.title] = db_career.id
            
            # 3. 为每个职业创建学习路径
            logger.info(f"为职业 '{db_career.title}' 创建学习路径...")
            learning_paths_data = create_learning_paths_data(db_career.title, db_career.id)
            
            for path_data in learning_paths_data:
                create_learning_path(db, path_data)
        
        # 4. 创建职业推荐（为测试用户创建）
        test_user_email = "test@example.com"
        test_user = db.query(models.User).filter(models.User.email == test_user_email).first()
        
        if test_user:
            logger.info(f"为用户 '{test_user.email}' 创建职业推荐...")
            
            # 为用户创建3个收藏的和3个非收藏的职业推荐
            career_ids = list(career_map.values())
            random.shuffle(career_ids)
            
            # 跳过如果没有足够的职业
            if len(career_ids) < 6:
                logger.warning(f"职业数量不足6个，只有{len(career_ids)}个，将创建所有可用职业的推荐")
            
            # 收藏的推荐
            for i in range(min(3, len(career_ids))):
                career_id = career_ids[i]
                score = round(random.uniform(0.8, 1.0), 2)  # 高匹配度
                reasons = [
                    f"你的技能与该职业所需技能高度匹配",
                    f"你的教育背景适合此职业",
                    f"该职业符合你的职业发展目标"
                ]
                create_recommendation(db, test_user.id, career_id, score, reasons, True)
            
            # 非收藏的推荐
            for i in range(3, min(6, len(career_ids))):
                career_id = career_ids[i]
                score = round(random.uniform(0.5, 0.79), 2)  # 中等匹配度
                reasons = [
                    f"基于你的兴趣推荐",
                    f"该职业当前市场需求旺盛",
                    f"该职业有良好的发展前景"
                ]
                create_recommendation(db, test_user.id, career_id, score, reasons, False)
        else:
            logger.warning("找不到测试用户，跳过创建职业推荐")
        
        logger.info("示例数据创建完成!")
        
    except Exception as e:
        logger.error(f"创建示例数据时出错: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main() 