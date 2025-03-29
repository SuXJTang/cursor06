from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core import security
from app.core.config import settings
from app.crud import user as crud_user
from app.schemas.token import Token
from app.schemas.user import User, UserCreate, UserResponse
from app.models.user import User as UserModel
from app.models.user_profile import UserProfile
from app.crud.user import get_user_by_email, get_user_by_username, create_user
from app.core.security import get_password_hash
from app.utils.logger import logger

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(deps.get_async_db)
) -> Any:
    """
    用户注册接口
    """
    logger.info(f"注册请求: {user_in.username}, {user_in.email}")
    
    # 检查用户名是否已存在
    user_by_username = await get_user_by_username(db, username=user_in.username)
    if user_by_username:
        logger.warning(f"用户名已存在: {user_in.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 检查邮箱是否已存在
    user_by_email = await get_user_by_email(db, email=user_in.email)
    if user_by_email:
        logger.warning(f"邮箱已被注册: {user_in.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )
    
    # 创建新用户
    try:
        # 密码哈希处理
        hashed_password = get_password_hash(user_in.password)
        user_data = user_in.dict()
        user_data["hashed_password"] = hashed_password
        del user_data["password"]  # 移除明文密码
        
        # 创建用户
        user = await create_user(db, user_data)
        logger.info(f"用户注册成功: {user.username}")
        
        # 返回用户信息，不包含密码
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
    except Exception as e:
        logger.error(f"用户注册失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="注册失败，请稍后重试"
        )

@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(deps.get_async_db)
):
    """
    OAuth2 登录验证(异步版本)
    """
    try:
        # 记录登录尝试
        logger.info(f"登录尝试 - 用户名: {form_data.username}")
        
        # 使用异步方式获取用户
        stmt = select(UserModel).where(UserModel.email == form_data.username)
        result = await db.execute(stmt)
        user = result.scalars().first()
        
        logger.info(f"查询用户 - 用户存在: {user is not None}")
        
        if not user:
            logger.warning(f"登录失败 - 用户不存在: {form_data.username}")
            raise HTTPException(
                status_code=400,
                detail="用户名或密码错误",
            )
        
        # 打印出密码哈希信息，帮助调试
        logger.info(f"密码哈希类型: {type(user.hashed_password)}")
        logger.info(f"密码哈希前缀: {user.hashed_password[:10]}...")
        
        # 尝试验证密码，捕获可能的异常
        try:
            is_password_valid = security.verify_password(form_data.password, user.hashed_password)
            logger.info(f"密码验证结果: {is_password_valid}")
            
            if not is_password_valid:
                logger.warning(f"登录失败 - 密码错误: {form_data.username}")
                raise HTTPException(
                    status_code=400,
                    detail="用户名或密码错误",
                )
        except Exception as password_error:
            logger.error(f"密码验证错误: {str(password_error)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail="密码验证错误，请联系管理员",
            )
        
        # 检查用户是否激活
        if not crud_user.is_active(user):
            logger.warning(f"登录失败 - 用户未激活: {form_data.username}")
            raise HTTPException(
                status_code=400, 
                detail="用户未激活"
            )
        
        # 更新最后登录时间
        logger.debug(f"更新最后登录时间: 用户 {user.id}")
        try:
            await crud_user.update_last_login_async(db, user=user)
        except Exception as e:
            logger.error(f"更新登录时间失败: {str(e)}")
            # 继续进行，这不是关键错误
        
        # 创建访问令牌
        logger.debug(f"生成访问令牌: 用户 {user.id}")
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = security.create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        
        logger.info(f"登录成功: 用户 {user.id}")
        return Token(access_token=token, token_type="bearer")
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 捕获并记录未预期的异常
        logger.error(f"登录过程中发生未知错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="登录过程中发生错误，请稍后再试"
        )

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: UserModel = Depends(deps.get_current_active_user_async),
    db: AsyncSession = Depends(deps.get_async_db),
) -> Any:
    """
    获取当前登录用户信息(异步版本)
    """
    try:
        # 从user_profiles表获取用户详细资料
        stmt = select(UserProfile).where(UserProfile.user_id == current_user.id)
        result = await db.execute(stmt)
        profile = result.scalars().first()
        
        # 将SQLAlchemy模型转换为Pydantic模型
        user_data = {
            "id": current_user.id,
            "email": current_user.email,
            "username": current_user.username,
            "is_active": current_user.is_active,
            "is_superuser": current_user.is_superuser,
            "avatar_url": current_user.avatar_url,
            "created_at": current_user.created_at,
            "updated_at": current_user.updated_at,
            # 添加用户详细资料，如果有的话
            "full_name": getattr(profile, "full_name", None) if profile else None,
            "education_level": getattr(profile, "education_level", None) if profile else None,
            "major": getattr(profile, "major", None) if profile else None,
            "experience_years": getattr(profile, "experience_years", None) if profile else None,
        }
        
        # 添加可能存在的其他资料字段
        if profile:
            if hasattr(profile, "skills"):
                user_data["skills"] = profile.skills
            if hasattr(profile, "interests"):
                user_data["interests"] = profile.interests
            
        return user_data
    except Exception as e:
        logger.error(f"获取当前用户信息出错: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="获取用户信息失败"
        ) 