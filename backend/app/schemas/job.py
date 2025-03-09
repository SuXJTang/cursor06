from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

# 共享属性
class JobBase(BaseModel):
    title: str = Field(..., description="职位标题", max_length=100)
    company: str = Field(..., description="公司名称", max_length=100)
    description: str = Field(..., description="职位描述", max_length=2000)
    requirements: str = Field(..., description="职位要求", max_length=1000)
    skills: Optional[List[str]] = Field(None, description="所需技能")
    salary_range: str = Field(..., description="薪资范围", max_length=50)
    location: str = Field(..., description="工作地点", max_length=50)
    job_type: str = Field(..., description="工作类型", max_length=20)
    category_id: int = Field(..., description="职位分类ID")
    experience_required: str = Field(..., description="所需工作经验", max_length=50)
    education_required: str = Field(..., description="学历要求", max_length=50)
    benefits: Optional[List[str]] = Field(None, description="职位福利")
    status: str = Field("active", description="职位状态(active/inactive)", max_length=20)

# 创建时的属性
class JobCreate(JobBase):
    pass

# 更新时的属性
class JobUpdate(JobBase):
    pass

# 数据库中的属性
class JobInDBBase(JobBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 返回给API的属性
class Job(JobInDBBase):
    class Config:
        from_attributes = True

# 存储在数据库中的完整属性
class JobInDB(JobInDBBase):
    pass

# 职位搜索参数
class JobSearchParams(BaseModel):
    keyword: Optional[str] = Field(None, description="关键词搜索")
    category_id: Optional[int] = Field(None, description="职位分类ID")
    location: Optional[str] = Field(None, description="工作地点")
    job_type: Optional[str] = Field(None, description="工作类型")
    experience: Optional[str] = Field(None, description="工作经验")
    education: Optional[str] = Field(None, description="学历要求")
    status: Optional[str] = Field(None, description="职位状态") 