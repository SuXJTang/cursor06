from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

# 共享属性
class JobCategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    description: Optional[str] = None

# 创建时的属性
class JobCategoryCreate(JobCategoryBase):
    pass

# 更新时的属性
class JobCategoryUpdate(JobCategoryBase):
    pass

# 数据库中的属性
class JobCategoryInDBBase(JobCategoryBase):
    id: int
    level: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 返回给API的属性
class JobCategory(JobCategoryInDBBase):
    class Config:
        from_attributes = True

# 存储在数据库中的完整属性
class JobCategoryInDB(JobCategoryInDBBase):
    pass 