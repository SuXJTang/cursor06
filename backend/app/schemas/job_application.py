from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel

# 共享属性
class JobApplicationBase(BaseModel):
    """工作申请基础模型"""
    job_id: int
    resume_id: Optional[int] = None
    cover_letter: Optional[str] = None
    interview_time: Optional[datetime] = None
    feedback: Optional[str] = None
    match_score: Optional[int] = None
    analysis_report: Optional[Dict[str, Any]] = None

class JobApplicationCreate(JobApplicationBase):
    """创建工作申请时的模型"""
    pass

class JobApplicationUpdate(BaseModel):
    """更新工作申请时的模型"""
    status: Optional[str] = None
    interview_time: Optional[datetime] = None
    feedback: Optional[str] = None
    match_score: Optional[int] = None
    analysis_report: Optional[Dict[str, Any]] = None

class JobApplicationInDBBase(JobApplicationBase):
    """数据库中的工作申请模型"""
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class JobApplication(JobApplicationInDBBase):
    """API响应中的工作申请模型"""
    pass

class JobApplicationInDB(JobApplicationInDBBase):
    """数据库中存储的工作申请模型"""
    pass 