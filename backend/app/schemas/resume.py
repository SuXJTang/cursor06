from datetime import datetime
from typing import Optional, Union, Any, Annotated
from enum import Enum

from pydantic import BaseModel, Field, HttpUrl, AnyUrl

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
    file_url: Optional[str] = None
    status: Optional[ResumeStatus] = ResumeStatus.DRAFT

class ResumeCreate(ResumeBase):
    """创建简历时的模型"""
    title: Annotated[str, Field(min_length=1, max_length=255)]
    content: Optional[str] = ""
    description: Optional[str] = ""
    
    class Config:
        use_enum_values = True

class ResumeUpdate(ResumeBase):
    """更新简历时的模型"""
    pass

class ResumeFileUpdate(BaseModel):
    """更新简历文件时的模型"""
    file_url: str

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
        from_attributes = True

class Resume(ResumeInDBBase):
    """API响应中的简历模型"""
    pass

class ResumeInDB(ResumeInDBBase):
    """数据库中存储的简历模型"""
    pass 

# 新增：文件上传响应模型
class ResumeFile(BaseModel):
    '''上传简历文件的响应模型'''
    filename: str
    file_size: int
    file_type: str
    file_url: str

class DeleteFileResponse(BaseModel):
    success: bool
    deleted_records: int
    deleted_file: bool
    message: str

# 用于清理操作的响应模型
class CleanupResponse(BaseModel):
    success: bool
    deleted_files: int
    message: str

class TemplateFile(BaseModel):
    """模板文件响应模型"""
    filename: str
    file_size: int
    file_type: str
    file_url: str
