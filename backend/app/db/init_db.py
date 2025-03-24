import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import text
import sqlalchemy
from sqlalchemy.orm import Session

from app.db.session import get_async_session, async_engine
from app.db.base_class import Base
from app.models.career import Career
from app.models.career_recommendation import CareerRecommendation
from app.models.user import User
from app.models.skill import Skill
from app.core.config import settings
from app.schemas.user import UserCreate
from app.crud.user import user as crud_user
from loguru import logger

logger = logging.getLogger(__name__)

# 示例职业数据
SAMPLE_CAREERS = [
    {
        "title": "软件工程师",
        "description": "负责设计、开发和维护软件系统。需要精通编程语言、数据结构和算法。",
        "education_required": "本科",
        "experience_required": "2-5年",
        "salary_range": "15000-35000",
        "job_outlook": "增长",
        "work_environment": "办公室",
        "skills": ["编程", "算法", "问题解决能力", "团队协作"]
    },
    {
        "title": "数据分析师",
        "description": "收集、处理和分析数据，提供有价值的业务洞察。需要统计学和数据处理技能。",
        "education_required": "本科",
        "experience_required": "1-3年",
        "salary_range": "12000-25000",
        "job_outlook": "快速增长",
        "work_environment": "办公室",
        "skills": ["数据分析", "SQL", "统计学", "可视化", "Excel"]
    },
    {
        "title": "产品经理",
        "description": "负责产品规划、需求分析和产品生命周期管理。需要良好的沟通和项目管理能力。",
        "education_required": "本科",
        "experience_required": "3-5年",
        "salary_range": "18000-40000",
        "job_outlook": "稳定",
        "work_environment": "办公室",
        "skills": ["项目管理", "沟通能力", "需求分析", "市场分析", "领导能力"]
    }
]

# 示例技能数据
SAMPLE_SKILLS = [
    {"name": "编程", "description": "使用编程语言开发软件", "category": "技术技能"},
    {"name": "算法", "description": "设计和实现高效的算法解决问题", "category": "技术技能"},
    {"name": "问题解决能力", "description": "分析问题并找出解决方案", "category": "软技能"},
    {"name": "团队协作", "description": "与团队成员有效合作", "category": "软技能"},
    {"name": "数据分析", "description": "分析和解释数据", "category": "技术技能"},
    {"name": "SQL", "description": "使用SQL查询数据库", "category": "技术技能"},
    {"name": "统计学", "description": "应用统计方法分析数据", "category": "技术技能"},
    {"name": "可视化", "description": "创建数据可视化展示", "category": "技术技能"},
    {"name": "Excel", "description": "熟练使用Excel处理数据", "category": "技术技能"},
    {"name": "项目管理", "description": "规划和执行项目", "category": "管理技能"},
    {"name": "沟通能力", "description": "有效传达信息和想法", "category": "软技能"},
    {"name": "需求分析", "description": "分析和理解用户需求", "category": "业务技能"},
    {"name": "市场分析", "description": "分析市场趋势和竞争", "category": "业务技能"},
    {"name": "领导能力", "description": "引导和激励团队成员", "category": "管理技能"}
]

async def init_db() -> None:
    """初始化数据库，创建超级用户和首批数据"""
    
    try:
        # 创建超级用户
        await ensure_admin_exists()
        
        # 添加迁移代码
        async with get_async_session() as db:
            async with db.begin():
                # 检查表是否存在
                result = await db.execute(text(
                    "SELECT table_name FROM information_schema.tables "
                    "WHERE table_schema = 'cursor06' AND table_name = 'career_recommendations'"
                ))
                has_career_recommendations = result.scalar() is not None

                if has_career_recommendations:
                    # 检查列是否存在
                    result = await db.execute(text(
                        "SELECT column_name FROM information_schema.columns "
                        "WHERE table_schema = 'cursor06' AND table_name = 'career_recommendations' "
                        "AND column_name = 'session_id'"
                    ))
                    has_session_id = result.scalar() is not None

                    if not has_session_id:
                        # 添加session_id列
                        logger.info("正在添加session_id列到career_recommendations表...")
                        await db.execute(text(
                            "ALTER TABLE career_recommendations ADD COLUMN session_id INT NULL"
                        ))
                        await db.execute(text(
                            "ALTER TABLE career_recommendations ADD CONSTRAINT fk_session_id "
                            "FOREIGN KEY (session_id) REFERENCES recommendation_sessions(id) ON DELETE SET NULL"
                        ))
                        logger.info("成功添加session_id列")

                # 检查推荐会话表是否存在
                result = await db.execute(text(
                    "SELECT table_name FROM information_schema.tables "
                    "WHERE table_schema = 'cursor06' AND table_name = 'recommendation_sessions'"
                ))
                has_recommendation_sessions = result.scalar() is not None

                if not has_recommendation_sessions:
                    # 创建表
                    logger.info("正在创建recommendation_sessions表...")
                    create_table_sql = str(Base.metadata.tables['recommendation_sessions'].compile(db.bind))
                    await db.execute(text(create_table_sql))
                    logger.info("recommendation_sessions表创建成功")
            
    except Exception as e:
        logger.error(f"数据库迁移失败: {str(e)}")
        raise

async def ensure_admin_exists():
    """确保管理员用户存在"""
    try:
        logger.debug("检查管理员用户是否存在")
        
        # 硬编码默认管理员信息
        ADMIN_EMAIL = "admin@example.com"
        ADMIN_PASSWORD = "admin123"
        
        # 使用上下文管理器获取会话
        async with get_async_session() as db:
            # 查询管理员用户
            result = await db.execute(
                select(User).where(User.email == ADMIN_EMAIL)
            )
            admin_user = result.scalars().first()
            
            if not admin_user:
                logger.info("管理员用户不存在，创建管理员用户")
                user_in = UserCreate(
                    email=ADMIN_EMAIL,
                    username="admin",
                    phone="13800138000",
                    password=ADMIN_PASSWORD,
                    is_superuser=True,
                    is_active=True,
                )
                admin_user = await crud_user.create_async(db, obj_in=user_in)
                logger.info(f"管理员用户创建成功: {admin_user.id}")
            else:
                logger.info(f"管理员用户已存在: {admin_user.id}")
    except Exception as e:
        logger.error(f"确保管理员用户存在时出错: {str(e)}")
        raise

# 下面的初始化函数注释掉，暂时不使用
"""
async def init_skills() -> None:
    # 初始化技能数据，暂时不启用
    pass

async def init_careers() -> None:
    # 初始化职业数据，暂时不启用
    pass
"""

# 测试函数，开发环境使用
async def test_db_connection():
    """测试数据库连接"""
    try:
        async with get_async_session() as db:
            await db.execute(text("SELECT 1"))
            logger.info("数据库连接测试成功")
    except Exception as e:
        logger.error(f"数据库连接测试失败: {e}")
        raise

if __name__ == "__main__":
    # 用于直接运行此文件进行数据库初始化
    asyncio.run(init_db()) 