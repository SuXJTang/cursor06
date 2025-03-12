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

class FeedbackInDB(FeedbackBase):
    id: int
    created_at: datetime
    screenshots: Optional[str] = None

    class Config:
        from_attributes = True

class FeedbackResponse(BaseModel):
    message: str
    feedback_id: int 