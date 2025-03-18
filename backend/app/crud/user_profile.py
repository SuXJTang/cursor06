from typing import Any, Dict, List, Optional, Union
import json

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
        # 将Pydantic模型转为字典
        obj_in_data = self._prepare_create_data(obj_in, user_id)
        
        # 创建数据库对象
        db_obj = UserProfile(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def _prepare_create_data(
        self, obj_in: Union[UserProfileCreate, Dict[str, Any]], user_id: int
    ) -> Dict[str, Any]:
        """准备创建数据，处理JSON字段"""
        if isinstance(obj_in, dict):
            obj_in_data = obj_in.copy()
        else:
            obj_in_data = obj_in.dict(exclude_unset=True)
        
        # 添加用户ID
        obj_in_data["user_id"] = user_id
        
        # 处理可能的JSON字段 - 确保字典和列表类型正确存储
        self._prepare_json_fields(obj_in_data)
        
        # 同步工作年限字段 - work_years和experience_years
        self._sync_work_years_fields(obj_in_data)
        
        return obj_in_data
    
    def _prepare_json_fields(self, data: Dict[str, Any]) -> None:
        """处理JSON字段，确保正确的格式"""
        json_fields = [
            "skills", "interests", "skill_tags", "learning_ability",
            "career_interests", "personality_traits", "work_style",
            "learning_style", "growth_potential", "recommended_paths", "ai_analysis"
        ]
        
        for field in json_fields:
            if field in data and data[field] is not None:
                # 如果是字符串且看起来像JSON，尝试解析
                if isinstance(data[field], str) and (
                    data[field].startswith("[") or data[field].startswith("{")
                ):
                    try:
                        data[field] = json.loads(data[field])
                    except json.JSONDecodeError:
                        # 如果不是有效的JSON，保持原样
                        pass
                
                # 确保非字符串值被正确处理
                if not isinstance(data[field], str):
                    # 保持Python对象，SQLAlchemy的JSON类型会处理转换
                    pass
    
    def _sync_work_years_fields(self, data: Dict[str, Any]) -> None:
        """同步工作年限相关字段"""
        # 如果设置了work_years，同步到experience_years
        if "work_years" in data and data["work_years"] is not None:
            data["experience_years"] = data["work_years"]
        
        # 如果设置了experience_years，同步到work_years
        elif "experience_years" in data and data["experience_years"] is not None:
            data["work_years"] = data["experience_years"]
    
    def update(
        self, db: Session, *, db_obj: UserProfile, obj_in: Union[UserProfileUpdate, Dict[str, Any]]
    ) -> UserProfile:
        """更新用户资料，处理复杂JSON字段"""
        # 准备更新数据
        update_data = self._prepare_update_data(obj_in)
        
        # 使用父类方法更新
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def _prepare_update_data(
        self, obj_in: Union[UserProfileUpdate, Dict[str, Any]]
    ) -> Dict[str, Any]:
        """准备更新数据，处理JSON字段"""
        if isinstance(obj_in, dict):
            update_data = obj_in.copy()
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        # 处理可能的JSON字段
        self._prepare_json_fields(update_data)
        
        # 同步工作年限字段
        self._sync_work_years_fields(update_data)
        
        return update_data
    
    def update_avatar(
        self, db: Session, *, profile: UserProfile, avatar_url: str
    ) -> UserProfile:
        """更新用户头像"""
        # 创建更新数据
        update_data = {"avatar_url": avatar_url}
        
        # 使用通用更新方法
        return self.update(db, db_obj=profile, obj_in=update_data)

user_profile = CRUDUserProfile(UserProfile) 