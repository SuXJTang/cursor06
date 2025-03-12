from sqlalchemy.orm import Session
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate
from typing import Optional
import os

def create_feedback(
    db: Session,
    feedback: FeedbackCreate,
    screenshots: Optional[str] = None
) -> Feedback:
    """
    创建新的反馈记录
    """
    db_feedback = Feedback(
        type=feedback.type,
        title=feedback.title,
        description=feedback.description,
        contact=feedback.contact,
        screenshots=screenshots
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def get_feedback(db: Session, feedback_id: int) -> Optional[Feedback]:
    """
    根据ID获取反馈
    """
    return db.query(Feedback).filter(Feedback.id == feedback_id).first()

def list_feedbacks(db: Session, skip: int = 0, limit: int = 100):
    """
    获取反馈列表
    """
    return db.query(Feedback).offset(skip).limit(limit).all() 