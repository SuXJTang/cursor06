from typing import List, Optional, Dict, Union
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.career_import import CareerImport
from app.schemas.career_import import CareerImportCreate, CareerImportUpdate, CareerImportStatusUpdate

class CRUDCareerImport(CRUDBase[CareerImport, CareerImportCreate, CareerImportUpdate]):
    def get(self, db: Session, id: int) -> Optional[CareerImport]:
        """获取导入记录"""
        return db.query(CareerImport).filter(CareerImport.id == id).first()

    def get_by_importer(
        self, db: Session, *, importer_id: int, skip: int = 0, limit: int = 100
    ) -> List[Dict]:
        """获取用户的导入记录列表"""
        records = db.query(CareerImport).filter(
            CareerImport.importer_id == importer_id
        ).offset(skip).limit(limit).all()
        return [jsonable_encoder(record) for record in records]

    def create_import(
        self, db: Session, *, obj_in: CareerImportCreate
    ) -> CareerImport:
        """创建导入记录"""
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = CareerImport(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_import_status(
        self,
        db: Session,
        *,
        db_obj: CareerImport,
        total_count: int,
        success_count: int,
        failed_count: int,
        status: str,
        error_details: Optional[Dict] = None
    ) -> CareerImport:
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
        db_obj: CareerImport,
        obj_in: CareerImportStatusUpdate
    ) -> CareerImport:
        """更新导入记录状态"""
        update_data = obj_in.dict(exclude_unset=True)
        if "error_count" in update_data:
            update_data["failed_count"] = update_data.pop("error_count")
        return super().update(db, db_obj=db_obj, obj_in=update_data)

career_import = CRUDCareerImport(CareerImport) 