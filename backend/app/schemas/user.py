from typing import Optional, Annotated, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator
from pydantic.types import constr
import re

# 共享属性
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    avatar_url: Optional[str] = None

# 创建用户时需要的属性
class UserCreate(UserBase):
    email: EmailStr
    username: Annotated[str, Field(min_length=4, max_length=20)]
    password: Annotated[str, Field(min_length=8, max_length=32)]
    phone: Optional[Annotated[str, Field(pattern=r'^\d{11}$')]] = None

    @validator('username')
    def username_must_be_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('用户名只能包含字母、数字、下划线和连字符')
        return v
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$', v):
            raise ValueError('密码至少8位，需包含字母和数字')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "testuser",
                "password": "password123",
                "phone": "13800138000"
            }
        }

# 更新用户时可以更新的属性
class UserUpdate(UserBase):
    password: Optional[Annotated[str, Field(min_length=8, max_length=32)]] = None

# 更新用户头像URL的模型
class UserAvatarUpdate(BaseModel):
    avatar_url: str

# 数据库中存储的用户属性
class UserInDBBase(UserBase):
    id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# API返回的用户信息
class UserResponse(UserInDBBase):
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# 兼容旧代码，保留 User 类
class User(UserInDBBase):
    # 添加从用户资料中获取的字段
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    major: Optional[str] = None
    experience_years: Optional[int] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None

# 数据库中完整的用户信息
class UserInDB(UserInDBBase):
    hashed_password: str 