import logging
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect

from app.crud.user import user as crud_user
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.schemas.user import UserCreate
from app import crud, schemas

# 确保所有的SQL Alchemy模型都被导入
# 否则，SQL Alchemy可能无法创建某些表
from app.models import user, user_profile, resume  # noqa: F401

logger = logging.getLogger(__name__)

def create_all_tables():
    """创建所有数据库表"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            with engine.begin() as connection:
                # 使用SQLAlchemy的Inspector来检查表是否存在
                inspector = inspect(connection)
                
                # 获取所有表名
                table_names = inspector.get_table_names()
                
                if not table_names:
                    # 只有当数据库中没有表时才创建表
                    Base.metadata.create_all(bind=connection)
                    logger.info("创建数据库表成功")
                else:
                    logger.info(f"数据库表已存在，跳过创建，已有表: {', '.join(table_names)}")
                break
        except OperationalError as e:
            retry_count += 1
            if retry_count >= max_retries:
                logger.error(f"创建数据库表时出错，已达到最大重试次数: {e}")
                raise
            logger.warning(f"创建数据库表时出现问题，正在重试 ({retry_count}/{max_retries})")
            time.sleep(1)
        except Exception as e:
            logger.error(f"创建数据库表时出错: {e}")
            raise

def init_db(db: Session) -> None:
    """初始化数据库"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # 创建表（如果不存在）
            create_all_tables()
            
            # 确保每个操作都在独立的事务中进行
            # 检查超级用户是否已存在
            try:
                existing_user = crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER)
                if not existing_user:
                    # 创建超级用户
                    user_in = schemas.UserCreate(
                        email=settings.FIRST_SUPERUSER,
                        username="admin",
                        password=settings.FIRST_SUPERUSER_PASSWORD,
                        is_superuser=True,
                        is_active=True
                    )
                    # 确保在创建用户前先提交之前的所有操作
                    db.commit()
                    
                    # 在新事务中创建用户
                    user = crud.user.create(db, obj_in=user_in)
                    db.commit()
                    logger.info("超级用户创建成功")
                else:
                    logger.info("超级用户已存在，跳过创建")
            except Exception as e:
                db.rollback()
                logger.error(f"创建超级用户时出错: {e}")
                # 继续执行，不要因为一个错误就中断整个初始化过程
            
            # 检查职位分类是否已存在
            try:
                existing_categories = crud.job_category.get_multi(db, limit=100)
                if not existing_categories:
                    # 确保在创建分类前先提交之前的所有操作
                    db.commit()
                    
                    # 创建初始职位分类
                    categories = [
                        {"name": "后端开发", "description": "负责服务器端应用程序的开发和维护"},
                        {"name": "前端开发", "description": "负责网站和应用程序的用户界面开发"},
                        {"name": "全栈开发", "description": "同时负责前端和后端开发工作"},
                        {"name": "运维工程师", "description": "负责系统运维和服务器管理"},
                        {"name": "测试工程师", "description": "负责软件测试和质量保证"},
                    ]
                    
                    for category_data in categories:
                        category_in = schemas.JobCategoryCreate(**category_data)
                        crud.job_category.create(db, obj_in=category_in)
                        # 每创建一个分类就提交一次，避免大事务
                        db.commit()
                    logger.info("初始职位分类创建成功")
                else:
                    logger.info("职位分类已存在，跳过创建")
            except Exception as e:
                db.rollback()
                logger.error(f"创建职位分类时出错: {e}")
                # 继续执行，不要因为一个错误就中断整个初始化过程
                
            logger.info("数据库初始化完成")
            break
        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                logger.error(f"初始化数据库时出错，已达到最大重试次数: {e}")
                raise
            logger.warning(f"初始化数据库时出现问题，正在重试 ({retry_count}/{max_retries})")
            time.sleep(1) 