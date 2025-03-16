from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.crud.base import CRUDBase
from app.models.career_recommendation import CareerRecommendation
from app.schemas.career_recommendation import CareerRecommendationCreate, CareerRecommendationUpdate

class CRUDCareerRecommendation(CRUDBase[CareerRecommendation, CareerRecommendationCreate, CareerRecommendationUpdate]):
    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[CareerRecommendation]:
        """获取用户的职业推荐"""
        return (
            db.query(self.model)
            .filter(CareerRecommendation.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_favorites(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[CareerRecommendation]:
        """获取用户收藏的职业推荐"""
        return (
            db.query(self.model)
            .filter(CareerRecommendation.user_id == user_id)
            .filter(CareerRecommendation.is_favorite == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def toggle_favorite(
        self, db: Session, *, recommendation_id: int, user_id: int
    ) -> Optional[CareerRecommendation]:
        """切换收藏状态"""
        recommendation = (
            db.query(self.model)
            .filter(CareerRecommendation.id == recommendation_id)
            .filter(CareerRecommendation.user_id == user_id)
            .first()
        )
        if not recommendation:
            return None
            
        recommendation.is_favorite = not recommendation.is_favorite
        recommendation.updated_at = datetime.now()
        db.commit()
        db.refresh(recommendation)
        return recommendation
        
    def add_feedback(
        self, db: Session, *, recommendation_id: int, user_id: int, feedback: str
    ) -> Optional[CareerRecommendation]:
        """添加反馈"""
        recommendation = (
            db.query(self.model)
            .filter(CareerRecommendation.id == recommendation_id)
            .filter(CareerRecommendation.user_id == user_id)
            .first()
        )
        if not recommendation:
            return None
            
        recommendation.feedback = feedback
        recommendation.updated_at = datetime.now()
        db.commit()
        db.refresh(recommendation)
        return recommendation

career_recommendation = CRUDCareerRecommendation(CareerRecommendation) 