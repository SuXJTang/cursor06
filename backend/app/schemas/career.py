from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# 基础Career模型
class CareerBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    education_required: Optional[str] = None
    experience_required: Optional[str] = None
    career_path: Optional[List[str]] = None
    market_analysis: Optional[Dict[str, Any]] = None
    salary_range: Optional[Dict[str, Any]] = None
    future_prospect: Optional[str] = None
    category_id: Optional[int] = None
    # 以下字段是示例数据脚本需要的字段，但不会存储到数据库中

# 创建时使用的Career模型
class CareerCreate(BaseModel):
    title: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    education_required: Optional[str] = None
    experience_required: Optional[str] = None
    career_path: Optional[List[str]] = None
    market_analysis: Optional[Dict[str, Any]] = None
    salary_range: Optional[Dict[str, Any]] = None
    future_prospect: Optional[str] = None
    category_id: int  # 创建时必须指定分类ID

# 更新时使用的Career模型
class CareerUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    education_required: Optional[str] = None
    experience_required: Optional[str] = None
    career_path: Optional[List[str]] = None
    market_analysis: Optional[Dict[str, Any]] = None
    salary_range: Optional[Dict[str, Any]] = None
    future_prospect: Optional[str] = None
    category_id: Optional[int] = None

# 数据库中的Career模型基础
class CareerInDBBase(CareerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# API响应中的Career模型
class Career(CareerInDBBase):
    pass

# 数据库中的Career完整模型
class CareerInDB(CareerInDBBase):
    pass

# 带有统计信息的Career模型
class CareerWithStats(Career):
    related_jobs_count: int
    learning_paths_count: int

# 职业搜索结果模型
class CareerSearchResult(BaseModel):
    careers: List[Career]
    total: int
    page: int
    per_page: int
    pages: int 