from typing import List, Optional, Dict, Union
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.job_import import JobImport
from app.schemas.job_import import JobImportCreate, JobImportUpdate, JobImportStatusUpdate

class CRUDJobImport(CRUDBase[JobImport, JobImportCreate, JobImportUpdate]):
    def get(self, db: Session, id: int) -> Optional[JobImport]:
        """获取导入记录"""
        return db.query(JobImport).filter(JobImport.id == id).first()

    def get_by_importer(
        self, db: Session, *, importer_id: int, skip: int = 0, limit: int = 100
    ) -> List[Dict]:
        """获取用户的导入记录列表"""
        records = db.query(JobImport).filter(
            JobImport.importer_id == importer_id
        ).offset(skip).limit(limit).all()
        return [jsonable_encoder(record) for record in records]

    def create_import(
        self, db: Session, *, obj_in: JobImportCreate
    ) -> JobImport:
        """创建导入记录"""
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = JobImport(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_import_status(
        self,
        db: Session,
        *,
        db_obj: JobImport,
        total_count: int,
        success_count: int,
        failed_count: int,
        status: str,
        error_details: Optional[Dict] = None
    ) -> JobImport:
        """更新导入状态"""
        db_obj.total_count = total_count
        db_obj.success_count = success_count
        db_obj.failed_count = failed_count
        db_obj.status = status
        db_obj.error_details = error_details
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_status(
        self,
        db: Session,
        *,
        db_obj: JobImport,
        obj_in: JobImportStatusUpdate
    ) -> JobImport:
        """更新导入记录状态"""
        update_data = obj_in.dict(exclude_unset=True)
        if "error_count" in update_data:
            update_data["failed_count"] = update_data.pop("error_count")
        return super().update(db, db_obj=db_obj, obj_in=update_data)

job_import = CRUDJobImport(JobImport) 