from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.crud.base import CRUDBase
from app.models.job_category import JobCategory
from app.schemas.job_category import JobCategoryCreate, JobCategoryUpdate

class CRUDJobCategory(CRUDBase[JobCategory, JobCategoryCreate, JobCategoryUpdate]):
    def create(self, db: Session, *, obj_in: JobCategoryCreate) -> JobCategory:
        """创建职位分类"""
        # 如果有父分类，设置正确的层级
        level = 1
        if obj_in.parent_id:
            parent = db.query(JobCategory).filter(JobCategory.id == obj_in.parent_id).first()
            if parent:
                level = parent.level + 1
        
        db_obj = JobCategory(
            name=obj_in.name,
            parent_id=obj_in.parent_id,
            description=obj_in.description,
            level=level
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_parent(
        self, db: Session, *, parent_id: Optional[int] = None, skip: int = 0, limit: int = 100
    ) -> List[JobCategory]:
        """获取指定父分类下的所有子分类"""
        query = db.query(self.model).filter(self.model.parent_id == parent_id)
        return query.offset(skip).limit(limit).all()

    def get_tree(self, db: Session, *, root_id: Optional[int] = None) -> Dict:
        """获取分类树结构"""
        def build_tree(parent_id: Optional[int] = None) -> List[Dict]:
            categories = db.query(self.model).filter(self.model.parent_id == parent_id).all()
            result = []
            for category in categories:
                category_dict = category.to_dict()
                category_dict["children"] = build_tree(category.id)
                result.append(category_dict)
            return result

        if root_id:
            root = db.query(self.model).filter(self.model.id == root_id).first()
            if not root:
                return {}
            root_dict = root.to_dict()
            root_dict["children"] = build_tree(root.id)
            return root_dict
        return {"categories": build_tree(None)}

    def get_ancestors(self, db: Session, *, category_id: int) -> List[JobCategory]:
        """获取指定分类的所有祖先分类"""
        ancestors = []
        current = db.query(self.model).filter(self.model.id == category_id).first()
        while current and current.parent_id:
            parent = db.query(self.model).filter(self.model.id == current.parent_id).first()
            if parent:
                ancestors.append(parent)
                current = parent
            else:
                break
        return ancestors

    def get_descendants(self, db: Session, *, category_id: int) -> List[JobCategory]:
        """获取指定分类的所有后代分类"""
        def get_children(parent_id: int) -> List[JobCategory]:
            children = db.query(self.model).filter(self.model.parent_id == parent_id).all()
            result = []
            for child in children:
                result.append(child)
                result.extend(get_children(child.id))
            return result
        
        return get_children(category_id)

    def update_tree(self, db: Session, *, category_id: int, new_parent_id: Optional[int]) -> JobCategory:
        """更新分类的父节点，同时更新所有子节点的层级"""
        category = db.query(self.model).filter(self.model.id == category_id).first()
        if not category:
            return None

        # 计算层级变化
        old_level = category.level
        new_level = 1
        if new_parent_id:
            parent = db.query(self.model).filter(self.model.id == new_parent_id).first()
            if parent:
                new_level = parent.level + 1
        level_diff = new_level - old_level

        # 更新当前节点
        category.parent_id = new_parent_id
        category.level = new_level
        
        # 更新所有后代节点的层级
        descendants = self.get_descendants(db, category_id=category_id)
        for desc in descendants:
            desc.level += level_diff

        db.commit()
        db.refresh(category)
        return category

job_category = CRUDJobCategory(JobCategory) 