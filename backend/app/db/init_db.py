import logging
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
import time
from sqlalchemy.exc import OperationalError

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

def drop_all_tables():
    """删除所有数据库表"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # 使用原生SQL按照正确的顺序删除表
            with engine.begin() as connection:
                # 先禁用外键检查
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
                
                # 删除所有表
                Base.metadata.drop_all(bind=connection)
                
                # 重新启用外键检查
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
                
            logger.info("所有数据库表删除成功")
            break
        except OperationalError as e:
            retry_count += 1
            if retry_count >= max_retries:
                logger.error(f"删除数据库表时出错，已达到最大重试次数: {e}")
                raise
            logger.warning(f"删除数据库表时出现死锁，正在重试 ({retry_count}/{max_retries})")
            time.sleep(1)
        except Exception as e:
            logger.error(f"删除数据库表时出错: {e}")
            raise

def create_all_tables():
    """创建所有数据库表"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            with engine.begin() as connection:
                Base.metadata.create_all(bind=connection)
            logger.info("创建数据库表成功")
            break
        except OperationalError as e:
            retry_count += 1
            if retry_count >= max_retries:
                logger.error(f"创建数据库表时出错，已达到最大重试次数: {e}")
                raise
            logger.warning(f"创建数据库表时出现死锁，正在重试 ({retry_count}/{max_retries})")
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
            # 删除所有表
            drop_all_tables()
            
            # 创建所有表
            create_all_tables()
            
            # 检查超级用户是否已存在
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
                user = crud.user.create(db, obj_in=user_in)
                logger.info("超级用户创建成功")
            else:
                logger.info("超级用户已存在，跳过创建")

            # 检查职位分类是否已存在
            existing_categories = crud.job_category.get_multi(db, limit=100)
            if not existing_categories:
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
                logger.info("初始职位分类创建成功")
            else:
                logger.info("职位分类已存在，跳过创建")
                
            break
        except OperationalError as e:
            retry_count += 1
            if retry_count >= max_retries:
                logger.error(f"初始化数据库时出错，已达到最大重试次数: {e}")
                raise
            logger.warning(f"初始化数据库时出现死锁，正在重试 ({retry_count}/{max_retries})")
            time.sleep(1)
        except Exception as e:
            logger.error(f"初始化数据库时出错: {e}")
            raise 