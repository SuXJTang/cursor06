from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, conint

# 共享属性
class LearningPathBase(BaseModel):
    """学习路径基础模型"""
    target_job_id: Optional[int] = None
    target_career_id: Optional[int] = None
    current_level: Optional[str] = None
    target_level: Optional[str] = None
    required_skills: Optional[List[Dict[str, Any]]] = None
    learning_steps: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[Dict[str, Any]] = None
    resources: Optional[List[Dict[str, Any]]] = None
    progress: Optional[conint(ge=0, le=100)] = 0  # 0-100
    is_active: bool = True
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None

class LearningPathCreate(LearningPathBase):
    """创建学习路径时的模型"""
    target_job_id: Optional[int] = None
    target_career_id: Optional[int] = None

class LearningPathUpdate(BaseModel):
    """更新学习路径时的模型"""
    current_level: Optional[str] = None
    target_level: Optional[str] = None
    required_skills: Optional[List[Dict[str, Any]]] = None
    learning_steps: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[Dict[str, Any]] = None
    resources: Optional[List[Dict[str, Any]]] = None
    progress: Optional[conint(ge=0, le=100)] = None
    is_active: Optional[bool] = None
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None

class LearningPathInDBBase(LearningPathBase):
    """数据库中的学习路径模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class LearningPath(LearningPathInDBBase):
    """API响应中的学习路径模型"""
    pass

class LearningPathInDB(LearningPathInDBBase):
    """数据库中存储的学习路径模型"""
    pass 