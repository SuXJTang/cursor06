from typing import Optional

from sqlalchemy.orm import Session

from app import crud, models
from app.schemas.resume import ResumeCreate
from app.tests.utils.user import create_random_user


def create_random_resume(
    db: Session, *, user_id: Optional[int] = None
) -> models.Resume:
    """
    创建随机简历
    """
    if user_id is None:
        user = create_random_user(db)
        user_id = user.id
        
    resume_in = ResumeCreate(
        user_id=user_id,
        name="Test User",
        phone="13800138000",
        email="test@example.com",
        education=[{
            "school": "Test University",
            "major": "Computer Science",
            "degree": "Bachelor",
            "start_date": "2018-09",
            "end_date": "2022-06",
            "gpa": "3.8"
        }],
        work_experience=[{
            "company": "Test Company",
            "position": "Software Engineer",
            "start_date": "2022-07",
            "end_date": "2023-12",
            "description": "Developed web applications"
        }],
        project_experience=[{
            "name": "Test Project",
            "role": "Backend Developer",
            "start_date": "2023-01",
            "end_date": "2023-12",
            "description": "Developed RESTful APIs"
        }],
        skills=["Python", "FastAPI", "SQLAlchemy"],
        self_evaluation="Passionate about programming",
        job_intention={
            "positions": ["Software Engineer", "Backend Developer"],
            "cities": ["Beijing", "Shanghai"],
            "salary_range": "15k-25k"
        }
    )
    resume = crud.resume.create(db=db, obj_in=resume_in)
    return resume 