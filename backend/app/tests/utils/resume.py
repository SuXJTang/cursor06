from typing import Optional

from sqlalchemy.orm import Session

from app import crud, models
from app.schemas.resume import ResumeCreate
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string

def create_random_resume(
    db: Session, *, user_id: Optional[int] = None
) -> models.Resume:
    """创建随机简历"""
    if user_id is None:
        user = create_random_user(db)
        user_id = user.id
    title = random_lower_string()
    content = random_lower_string()
    resume_in = ResumeCreate(title=title, content=content)
    return crud.resume.create_with_owner(db=db, obj_in=resume_in, user_id=user_id) 