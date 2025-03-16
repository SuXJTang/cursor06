from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, constr, Json

# 共享属性
class JobBase(BaseModel):
    """工作基础模型"""
    title: str = Field(..., description="职位标题", max_length=100)
    company: str = Field(..., description="公司名称", max_length=100)
    description: str = Field(..., description="职位描述")
    requirements: str = Field(..., description="职位要求")
    skills: Optional[str] = Field(None, description="所需技能")
    salary_range: str = Field(..., description="薪资范围")
    location: str = Field(..., description="工作地点", max_length=100)
    job_type: str = Field(..., description="工作类型", max_length=50)
    category_id: int = Field(..., description="职位分类ID")
    experience_required: str = Field(..., description="所需工作经验", max_length=50)
    education_required: str = Field(..., description="学历要求", max_length=50)
    benefits: Optional[str] = Field(None, description="职位福利")
    status: str = Field("active", description="职位状态(active/inactive)", max_length=20)

    class Config:
        from_attributes = True
        orm_mode = True
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Dict: lambda v: v,
            List: lambda v: v
        }

# 创建时的属性
class JobCreate(JobBase):
    """创建工作时的模型"""
    pass

# 更新时的属性
class JobUpdate(JobBase):
    """更新工作时的模型"""
    pass

# 数据库中的属性
class JobInDBBase(JobBase):
    """数据库中的工作模型"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Dict: lambda v: v,
            List: lambda v: v
        }

# 返回给API的属性
class Job(JobInDBBase):
    """API响应中的工作模型"""
    class Config:
        from_attributes = True
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Dict: lambda v: v,
            List: lambda v: v
        }

# 存储在数据库中的完整属性
class JobInDB(JobInDBBase):
    pass

# 职位搜索参数
class JobSearchParams(BaseModel):
    """工作搜索参数"""
    keyword: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    education_required: Optional[str] = None
    experience_required: Optional[str] = None
    category_id: Optional[int] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    company: Optional[str] = None
    status: Optional[str] = None
    skills: Optional[List[str]] = None
    sort_by: Optional[str] = "created_at"
    sort_desc: bool = True
    skip: int = 0
    limit: int = 10 