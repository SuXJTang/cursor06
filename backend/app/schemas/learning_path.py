from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, conint

# 共享属性
class LearningPathBase(BaseModel):
    """学习路径基础模型"""
    title: str
    description: str
    difficulty: Optional[str] = None  # 初级、中级、高级
    career_id: Optional[int] = None
    target_job_id: Optional[int] = None
    estimated_time: Optional[str] = None
    content: Optional[str] = None
    resources: Optional[str] = None
    prerequisites: Optional[str] = None
    view_count: Optional[int] = 0
    # 以下字段为原有字段，保留向后兼容性
    current_level: Optional[str] = None
    target_level: Optional[str] = None
    required_skills: Optional[List[Dict[str, Any]]] = None
    learning_steps: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[Dict[str, Any]] = None
    progress: Optional[conint(ge=0, le=100)] = 0  # 0-100
    is_active: bool = True
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None

class LearningPathCreate(LearningPathBase):
    """创建学习路径时的模型"""
    pass

class LearningPathUpdate(BaseModel):
    """更新学习路径时的模型"""
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    career_id: Optional[int] = None
    target_job_id: Optional[int] = None
    estimated_time: Optional[str] = None
    content: Optional[str] = None
    resources: Optional[str] = None
    prerequisites: Optional[str] = None
    view_count: Optional[int] = None
    # 以下字段为原有字段，保留向后兼容性
    current_level: Optional[str] = None
    target_level: Optional[str] = None
    required_skills: Optional[List[Dict[str, Any]]] = None
    learning_steps: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[Dict[str, Any]] = None
    progress: Optional[conint(ge=0, le=100)] = None
    is_active: Optional[bool] = None
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None

class LearningPathInDBBase(LearningPathBase):
    """数据库中的学习路径模型"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True

class LearningPath(LearningPathInDBBase):
    """API响应中的学习路径模型"""
    pass

class LearningPathInDB(LearningPathInDBBase):
    """数据库中存储的学习路径模型"""
    pass 