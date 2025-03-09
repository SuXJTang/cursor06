from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate, UserProfileUpdate

class CRUDUserProfile(CRUDBase[UserProfile, UserProfileCreate, UserProfileUpdate]):
    """用户档案的CRUD操作类"""
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[UserProfile]:
        """根据用户ID获取用户档案"""
        return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    def create_with_user(
        self, db: Session, *, obj_in: UserProfileCreate, user_id: int
    ) -> UserProfile:
        """创建用户档案并关联用户ID"""
        db_obj = UserProfile(
            user_id=user_id,
            full_name=obj_in.full_name,
            date_of_birth=obj_in.date_of_birth,
            address=obj_in.address,
            education=obj_in.education,
            work_experience=obj_in.work_experience,
            skills=obj_in.skills,
            bio=obj_in.bio,
            avatar_url=obj_in.avatar_url
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

user_profile = CRUDUserProfile(UserProfile) 