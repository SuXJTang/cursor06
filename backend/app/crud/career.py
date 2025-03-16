from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.crud.base import CRUDBase
from app.models.career import Career
from app.schemas.career import CareerCreate, CareerUpdate

class CRUDCareer(CRUDBase[Career, CareerCreate, CareerUpdate]):
    def get_by_category(
        self, db: Session, *, category_id: int, skip: int = 0, limit: int = 100
    ) -> List[Career]:
        """获取特定分类的职业"""
        return (
            db.query(self.model)
            .filter(Career.category_id == category_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def count(self, db: Session) -> int:
        """获取职业总数"""
        return db.query(self.model).count()
    
    def count_by_category(self, db: Session, *, category_id: int) -> int:
        """获取特定分类的职业数量"""
        return db.query(self.model).filter(Career.category_id == category_id).count()
        
    def search(
        self, db: Session, *, keyword: str, skip: int = 0, limit: int = 100
    ) -> List[Career]:
        """搜索职业"""
        return (
            db.query(self.model)
            .filter(
                or_(
                    Career.title.ilike(f"%{keyword}%"),
                    Career.description.ilike(f"%{keyword}%"),
                    Career.industry.ilike(f"%{keyword}%"),
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search_count(self, db: Session, *, keyword: str) -> int:
        """搜索职业的结果数量"""
        return (
            db.query(self.model)
            .filter(
                or_(
                    Career.title.ilike(f"%{keyword}%"),
                    Career.description.ilike(f"%{keyword}%"),
                    Career.industry.ilike(f"%{keyword}%"),
                )
            )
            .count()
        )
        
    def get_by_skills(
        self, db: Session, *, skills: List[str], skip: int = 0, limit: int = 100
    ) -> List[Career]:
        """根据技能获取职业"""
        result = []
        careers = db.query(self.model).all()
        
        for career in careers:
            if not career.required_skills:
                continue
                
            # 技能匹配逻辑 - 可能需要根据数据格式调整
            try:
                if isinstance(career.required_skills, str):
                    career_skills_str = career.required_skills.lower()
                else:
                    # 假设required_skills是JSON类型
                    career_skills_str = str(career.required_skills).lower()
                
                match_count = sum(1 for skill in skills if skill.lower() in career_skills_str)
                
                if match_count > 0:
                    result.append((career, match_count))
            except:
                # 处理可能的解析错误
                continue
                
        # 按匹配数排序
        result.sort(key=lambda x: x[1], reverse=True)
        
        # 返回排序后的职业列表
        return [item[0] for item in result][skip:skip+limit]

career = CRUDCareer(Career) 