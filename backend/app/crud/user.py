from typing import Any, Dict, Optional, Union
from datetime import datetime

from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.utils.logger import logger

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    # 同步API部分 - 保持兼容性
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """通过邮箱获取用户 (同步版本)"""
        return db.query(User).options(
            joinedload(User.profile)
        ).filter(User.email == email).first()
    
    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        """通过用户名获取用户 (同步版本)"""
        return db.query(User).options(
            joinedload(User.profile)
        ).filter(User.username == username).first()

    def get_by_phone(self, db: Session, *, phone: str) -> Optional[User]:
        """通过手机号获取用户 (同步版本)"""
        return db.query(User).options(
            joinedload(User.profile)
        ).filter(User.phone == phone).first()

    def get_profile(self, db: Session, *, user_id: int) -> Optional[Any]:
        """获取用户资料 (同步版本)"""
        from app.models.user_profile import UserProfile
        
        # 查询用户资料
        user_profile = db.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()
        
        return user_profile

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """创建新用户 (同步版本)"""
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            phone=obj_in.phone,
            hashed_password=get_password_hash(obj_in.password),
            is_active=obj_in.is_active,
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        """更新用户信息 (同步版本)"""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        """验证用户凭据 (同步版本)"""
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def update_last_login(self, db: Session, *, user: User) -> User:
        """更新用户最后登录时间 (同步版本)"""
        user.last_login = datetime.utcnow()
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
        
    # 异步API部分
    async def get_async(self, db: AsyncSession, *, id: int) -> Optional[User]:
        """通过ID获取用户 (异步版本)"""
        stmt = select(User).options(
            joinedload(User.profile)
        ).where(User.id == id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
        
    async def get_by_email_async(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """通过邮箱获取用户 (异步版本)"""
        stmt = select(User).options(
            joinedload(User.profile)
        ).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_by_username_async(self, db: AsyncSession, *, username: str) -> Optional[User]:
        """通过用户名获取用户 (异步版本)"""
        stmt = select(User).options(
            joinedload(User.profile)
        ).where(User.username == username)
        result = await db.execute(stmt)
        return result.scalars().first()
        
    async def get_by_phone_async(self, db: AsyncSession, *, phone: str) -> Optional[User]:
        """通过手机号获取用户 (异步版本)"""
        stmt = select(User).options(
            joinedload(User.profile)
        ).where(User.phone == phone)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def create_async(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        """创建新用户 (异步版本)"""
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            phone=obj_in.phone,
            hashed_password=get_password_hash(obj_in.password),
            is_active=obj_in.is_active,
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def authenticate_async(self, db: AsyncSession, *, email: str, password: str) -> Optional[User]:
        """验证用户凭据 (异步版本)"""
        user = await self.get_by_email_async(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
        
    async def update_last_login_async(self, db: AsyncSession, *, user: User) -> User:
        """更新用户最后登录时间 (异步版本)"""
        user.last_login = datetime.utcnow()
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    
    # 通用工具函数
    def is_active(self, user: User) -> bool:
        """检查用户是否活跃"""
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        """检查用户是否为超级管理员"""
        return user.is_superuser

    def is_verified(self, user: User) -> bool:
        """检查用户是否已验证"""
        return getattr(user, "is_verified", False)

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """根据邮箱获取用户"""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    """根据用户名获取用户"""
    result = await db.execute(select(User).where(User.username == username))
    return result.scalars().first()

async def get_user_by_email_or_username(db: AsyncSession, email_or_username: str) -> Optional[User]:
    """根据邮箱或用户名获取用户"""
    result = await db.execute(
        select(User).where(
            or_(User.email == email_or_username, User.username == email_or_username)
        )
    )
    return result.scalars().first()

async def create_user(db: AsyncSession, user_data: Dict[str, Any]) -> User:
    """创建新用户"""
    try:
        db_user = User(**user_data)
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except Exception as e:
        await db.rollback()
        logger.error(f"创建用户失败: {str(e)}")
        raise

async def get_user_by_id(db: AsyncSession, id: int) -> Optional[User]:
    """根据ID获取用户"""
    result = await db.execute(select(User).where(User.id == id))
    return result.scalars().first()

user = CRUDUser(User) 