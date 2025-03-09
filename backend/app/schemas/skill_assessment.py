from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, confloat

# 共享属性
class SkillAssessmentBase(BaseModel):
    """技能评估基础模型"""
    skill_name: str
    skill_category: Optional[str] = None
    proficiency_level: Optional[confloat(ge=0, le=10)] = None  # 0-10分
    assessment_type: str
    assessment_details: Optional[Dict[str, Any]] = None
    improvement_suggestions: Optional[str] = None
    next_level_requirements: Optional[Dict[str, Any]] = None

class SkillAssessmentCreate(SkillAssessmentBase):
    """创建技能评估时的模型"""
    pass

class SkillAssessmentUpdate(BaseModel):
    """更新技能评估时的模型"""
    skill_name: Optional[str] = None
    skill_category: Optional[str] = None
    proficiency_level: Optional[confloat(ge=0, le=10)] = None
    assessment_type: Optional[str] = None
    assessment_details: Optional[Dict[str, Any]] = None
    improvement_suggestions: Optional[str] = None
    next_level_requirements: Optional[Dict[str, Any]] = None
    verified: Optional[bool] = None
    verifier_id: Optional[int] = None

class SkillAssessmentInDBBase(SkillAssessmentBase):
    """数据库中的技能评估模型"""
    id: int
    user_id: int
    verified: bool
    verifier_id: Optional[int] = None
    verification_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SkillAssessment(SkillAssessmentInDBBase):
    """API响应中的技能评估模型"""
    pass

class SkillAssessmentInDB(SkillAssessmentInDBBase):
    """数据库中存储的技能评估模型"""
    pass 