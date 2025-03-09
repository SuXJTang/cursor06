from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, constr, HttpUrl

class ResumeStatus(str, Enum):
    """简历状态枚举"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"

# 共享属性
class ResumeBase(BaseModel):
    """简历基础模型"""
    title: Optional[str] = None
    content: Optional[str] = None
    is_active: Optional[bool] = True
    file_url: Optional[HttpUrl] = None
    status: Optional[ResumeStatus] = ResumeStatus.DRAFT

class ResumeCreate(ResumeBase):
    """创建简历时的模型"""
    title: constr(min_length=1, max_length=255)
    content: constr(min_length=1)

class ResumeUpdate(ResumeBase):
    """更新简历时的模型"""
    pass

class ResumeFileUpdate(BaseModel):
    """更新简历文件时的模型"""
    file_url: HttpUrl

class ResumeStatusUpdate(BaseModel):
    """更新简历状态时的模型"""
    status: ResumeStatus

class ResumeInDBBase(ResumeBase):
    """数据库中的简历模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Resume(ResumeInDBBase):
    """API响应中的简历模型"""
    pass

class ResumeInDB(ResumeInDBBase):
    """数据库中存储的简历模型"""
    pass 