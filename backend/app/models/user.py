from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base
from app.models.association_tables import user_skill
from typing import List, Optional

class User(Base):
    """用户模型"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(100), unique=True, nullable=False, index=True, comment='邮箱')
    username = Column(String(50), unique=True, nullable=False, index=True, comment='用户名')
    phone = Column(String(20), unique=True, comment='手机号')
    hashed_password = Column(String(100), nullable=False, comment='密码哈希')
    avatar_url = Column(String(255), comment='头像URL')
    is_active = Column(Boolean, default=True, comment='是否激活')
    is_superuser = Column(Boolean, default=False, comment='是否为超级用户')
    is_verified = Column(Boolean, default=False, comment='是否验证')
    last_login = Column(DateTime, comment='最后登录时间')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')
    
    # 关系
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    skills = relationship("Skill", secondary=user_skill, back_populates="users")
    skill_assessments = relationship("SkillAssessment", foreign_keys="SkillAssessment.user_id", back_populates="user")
    verified_assessments = relationship("SkillAssessment", foreign_keys="SkillAssessment.verifier_id", back_populates="verifier")
    favorite_careers = relationship("UserFavoriteCareer", back_populates="user")
    recommendations = relationship("CareerRecommendation", back_populates="user")
    recommendation_sessions = relationship("RecommendationSession", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    
    # 兼容性属性 - 提供对已移动到profile的字段的访问
    @property
    def full_name(self):
        """从用户资料获取全名"""
        return self.profile.full_name if self.profile else None
        
    @property
    def education_level(self):
        """从用户资料获取教育水平"""
        return self.profile.education_level if self.profile else None
        
    @property
    def major(self):
        """从用户资料获取专业"""
        return self.profile.major if self.profile else None
        
    @property
    def experience_years(self):
        """从用户资料获取工作经验年限"""
        return self.profile.experience_years if self.profile else 0
        
    @property
    def interests(self):
        """从用户资料获取兴趣爱好"""
        return self.profile.interests if self.profile else None
        
    @property
    def resume_path(self):
        """从用户资料获取简历路径"""
        return self.profile.resume_path if hasattr(self.profile, 'resume_path') and self.profile else None
    
    def to_dict(self):
        """将用户对象转换为字典"""
        profile_data = {}
        if self.profile:
            profile_data = {
                "full_name": self.profile.full_name,
                "education_level": self.profile.education_level,
                "major": self.profile.major,
                "experience_years": self.profile.experience_years,
                "interests": self.profile.interests.split(",") if self.profile.interests else [],
            }
        
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            **profile_data,
            "skills": [skill.name for skill in self.skills] if self.skills else []
        } 