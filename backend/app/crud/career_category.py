from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.career_category import CareerCategory
from app.schemas.career_category import CareerCategoryCreate, CareerCategoryUpdate

class CRUDCareerCategory(CRUDBase[CareerCategory, CareerCategoryCreate, CareerCategoryUpdate]):
    def get_root_categories(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[CareerCategory]:
        """获取根分类（没有父分类的分类）"""
        return (
            db.query(self.model)
            .filter(CareerCategory.parent_id == None)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_subcategories(
        self, db: Session, *, parent_id: int, skip: int = 0, limit: int = 100
    ) -> List[CareerCategory]:
        """获取子分类"""
        return (
            db.query(self.model)
            .filter(CareerCategory.parent_id == parent_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_category_tree(
        self, db: Session, *, category_id: int
    ) -> Optional[Dict]:
        """获取分类树"""
        category = db.query(self.model).filter(CareerCategory.id == category_id).first()
        if not category:
            return None
            
        result = {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "subcategories": []
        }
        
        subcategories = self.get_subcategories(db, parent_id=category.id)
        for subcat in subcategories:
            result["subcategories"].append(self.get_category_tree(db, category_id=subcat.id))
            
        return result

career_category = CRUDCareerCategory(CareerCategory) 