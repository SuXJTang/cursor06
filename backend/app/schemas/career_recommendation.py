from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from .career import Career

# 基础Career Recommendation模型
class CareerRecommendationBase(BaseModel):
    user_id: int
    career_id: int
    match_score: float
    match_reasons: List[str] = []
    is_favorite: bool = False
    feedback: Optional[str] = None

# 创建时使用的Career Recommendation模型
class CareerRecommendationCreate(CareerRecommendationBase):
    pass

# 更新时使用的Career Recommendation模型
class CareerRecommendationUpdate(BaseModel):
    match_score: Optional[float] = None
    match_reasons: Optional[List[str]] = None
    is_favorite: Optional[bool] = None
    feedback: Optional[str] = None

# 数据库中的Career Recommendation模型基础
class CareerRecommendationInDBBase(CareerRecommendationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# API响应中的Career Recommendation模型
class CareerRecommendation(CareerRecommendationInDBBase):
    pass

# 数据库中的Career Recommendation完整模型
class CareerRecommendationInDB(CareerRecommendationInDBBase):
    pass

# 带有职业详情的推荐模型
class CareerRecommendationWithCareer(CareerRecommendation):
    career: Career

# 收藏请求模型
class FavoriteRequest(BaseModel):
    recommendation_id: int

# 反馈请求模型
class FeedbackRequest(BaseModel):
    recommendation_id: int
    feedback: str

# 职业推荐集合模型
class CareerRecommendationList(BaseModel):
    recommendations: List[CareerRecommendationWithCareer]
    total: int 