from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

# 基础Career Category模型
class CareerCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    level: int = 1  # 默认为1级分类

# 创建时使用的Career Category模型
class CareerCategoryCreate(CareerCategoryBase):
    pass

# 更新时使用的Career Category模型
class CareerCategoryUpdate(CareerCategoryBase):
    name: Optional[str] = None
    level: Optional[int] = None

# 数据库中的Career Category模型基础
class CareerCategoryInDBBase(CareerCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# API响应中的Career Category模型
class CareerCategory(CareerCategoryInDBBase):
    pass

# 数据库中的Career Category完整模型
class CareerCategoryInDB(CareerCategoryInDBBase):
    pass

# 带有子分类的Career Category模型
class CareerCategoryWithChildren(CareerCategory):
    subcategories: List['CareerCategoryWithChildren'] = []

CareerCategoryWithChildren.update_forward_refs()

# 分类树模型
class CategoryTree(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    level: int
    subcategories: List['CategoryTree'] = []

CategoryTree.update_forward_refs() 