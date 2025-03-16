from typing import List, Optional
from fastapi.encoders import jsonable_encoder
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

    def create_with_owner(
        self, db: Session, *, obj_in: ResumeCreate, user_id: int
    ) -> Resume:
        """创建简历，并指定所有者"""
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Resume]:
        """获取用户的所有简历"""
        return (
            db.query(self.model)
            .filter(Resume.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id_and_owner(
        self, db: Session, *, id: int, user_id: int
    ) -> Optional[Resume]:
        """根据ID和所有者获取简历"""
        return (
            db.query(self.model)
            .filter(Resume.id == id, Resume.user_id == user_id)
            .first()
        )

    def update_status(
        self, db: Session, *, db_obj: Resume, status: str
    ) -> Resume:
        """更新简历状态"""
        db_obj.status = status
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_file_url(
        self, db: Session, *, db_obj: Resume, file_url: str
    ) -> Resume:
        """更新简历文件URL"""
        db_obj.file_url = file_url
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

resume = CRUDResume(Resume) 