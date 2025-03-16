from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.crud.base import CRUDBase
from app.models.learning_path import LearningPath
from app.schemas.learning_path import LearningPathCreate, LearningPathUpdate

class CRUDLearningPath(CRUDBase[LearningPath, LearningPathCreate, LearningPathUpdate]):
    def get_by_career(
        self, db: Session, *, career_id: int, skip: int = 0, limit: int = 100
    ) -> List[LearningPath]:
        """获取特定职业的学习路径"""
        return (
            db.query(self.model)
            .filter(LearningPath.career_id == career_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_by_difficulty(
        self, db: Session, *, difficulty: str, skip: int = 0, limit: int = 100
    ) -> List[LearningPath]:
        """根据难度获取学习路径"""
        return (
            db.query(self.model)
            .filter(LearningPath.difficulty == difficulty)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def search(
        self, db: Session, *, keyword: str, skip: int = 0, limit: int = 100
    ) -> List[LearningPath]:
        """搜索学习路径"""
        search_pattern = f"%{keyword}%"
        return (
            db.query(self.model)
            .filter(
                or_(
                    LearningPath.title.ilike(search_pattern),
                    LearningPath.description.ilike(search_pattern),
                    LearningPath.resources.ilike(search_pattern),
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_popular_paths(
        self, db: Session, *, skip: int = 0, limit: int = 10
    ) -> List[LearningPath]:
        """获取热门学习路径"""
        return (
            db.query(self.model)
            .order_by(LearningPath.view_count.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def increment_view_count(
        self, db: Session, *, path_id: int
    ) -> Optional[LearningPath]:
        """增加学习路径的浏览次数"""
        path = db.query(self.model).filter(LearningPath.id == path_id).first()
        if not path:
            return None
            
        path.view_count = path.view_count + 1
        db.commit()
        db.refresh(path)
        return path

learning_path = CRUDLearningPath(LearningPath) 