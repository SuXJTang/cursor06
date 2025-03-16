from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.crud.base import CRUDBase
from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate, JobSearchParams

class CRUDJob(CRUDBase[Job, JobCreate, JobUpdate]):
    def create(self, db: Session, *, obj_in: JobCreate) -> Job:
        """创建职位"""
        # 将Pydantic模型转换为字典，以便处理可能的空值
        obj_in_data = obj_in.dict(exclude_unset=True)
        
        # 创建Job模型实例
        db_obj = Job(**obj_in_data)
        
        # 添加到数据库会话
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_category(
        self, db: Session, *, category_id: int, skip: int = 0, limit: int = 100
    ) -> List[Job]:
        """获取指定分类下的所有职位"""
        return (
            db.query(self.model)
            .filter(Job.category_id == category_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def search(
        self, db: Session, *, params: JobSearchParams, skip: int = 0, limit: int = 100
    ) -> List[Job]:
        """搜索职位"""
        query = db.query(self.model)

        if params.keyword:
            query = query.filter(
                or_(
                    Job.title.ilike(f"%{params.keyword}%"),
                    Job.company.ilike(f"%{params.keyword}%"),
                    Job.description.ilike(f"%{params.keyword}%"),
                    Job.requirements.ilike(f"%{params.keyword}%"),
                )
            )

        if params.category_id:
            query = query.filter(Job.category_id == params.category_id)

        if params.location:
            query = query.filter(Job.location.ilike(f"%{params.location}%"))

        if params.job_type:
            query = query.filter(Job.job_type == params.job_type)

        if params.experience_required:
            query = query.filter(Job.experience_required == params.experience_required)

        if params.education_required:
            query = query.filter(Job.education_required == params.education_required)

        if params.status:
            query = query.filter(Job.status == params.status)

        # TODO: 实现薪资范围搜索（需要先统一薪资格式）

        return query.offset(skip).limit(limit).all()

    def update_status(
        self, db: Session, *, job_id: int, status: str
    ) -> Optional[Job]:
        """更新职位状态"""
        job = db.query(self.model).filter(Job.id == job_id).first()
        if not job:
            return None
        job.status = status
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    def get_by_company(
        self, db: Session, *, company: str, skip: int = 0, limit: int = 100
    ) -> List[Job]:
        """获取指定公司的所有职位"""
        return (
            db.query(self.model)
            .filter(Job.company == company)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_owner(
        self, db: Session, *, obj_in: JobCreate, owner_id: int
    ) -> Job:
        obj_in_data = obj_in.dict()
        db_obj = self.model(**obj_in_data, owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Job]:
        return (
            db.query(self.model)
            .filter(Job.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

job = CRUDJob(Job) 