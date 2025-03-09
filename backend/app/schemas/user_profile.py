from datetime import date
from typing import Optional

from pydantic import BaseModel, constr

# 共享属性
class UserProfileBase(BaseModel):
    """用户档案基础模型"""
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    education: Optional[str] = None
    work_experience: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    """创建用户档案时的模型"""
    pass

class UserProfileUpdate(UserProfileBase):
    """更新用户档案时的模型"""
    pass

class UserProfileInDBBase(UserProfileBase):
    """数据库中的用户档案模型"""
    id: int
    user_id: int

    class Config:
        orm_mode = True

class UserProfile(UserProfileInDBBase):
    """API响应中的用户档案模型"""
    pass

class UserProfileInDB(UserProfileInDBBase):
    """数据库中存储的用户档案模型"""
    pass 