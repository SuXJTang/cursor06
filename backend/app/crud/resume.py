from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate

class CRUDResume(CRUDBase[Resume, ResumeCreate, ResumeUpdate]):
    """简历的CRUD操作类"""
    def get_by_user_id(self, db: Session, *, user_id: int) -> List[Resume]:
        """获取用户的所有简历"""
        return db.query(Resume).filter(Resume.user_id == user_id).all()

    def get_active_by_user_id(self, db: Session, *, user_id: int) -> List[Resume]:
        """获取用户的所有活跃简历"""
        return db.query(Resume).filter(
            Resume.user_id == user_id,
            Resume.is_active == True
        ).all()

    def create_with_user(
        self, db: Session, *, obj_in: ResumeCreate, user_id: int
    ) -> Resume:
        """创建简历并关联用户ID"""
        db_obj = Resume(
            user_id=user_id,
            title=obj_in.title,
            content=obj_in.content,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

resume = CRUDResume(Resume) 