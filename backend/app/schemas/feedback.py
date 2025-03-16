from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FeedbackBase(BaseModel):
    type: str
    title: str
    description: str
    contact: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

# 添加更新类
class FeedbackUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    contact: Optional[str] = None
    status: Optional[str] = None

class FeedbackInDB(FeedbackBase):
    id: int
    created_at: datetime
    screenshots: Optional[str] = None

    class Config:
        from_attributes = True

# 为保持与其他schema文件一致，添加Feedback类作为FeedbackInDB的别名
Feedback = FeedbackInDB

class FeedbackResponse(BaseModel):
    message: str
    feedback_id: int 