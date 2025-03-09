from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class UserProfile(Base):
    """用户资料模型"""
    __tablename__ = 'user_profiles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True, comment='用户ID')
    full_name = Column(String(50), comment='姓名')
    date_of_birth = Column(DateTime, comment='出生日期')
    address = Column(String(200), comment='地址')
    education = Column(String(50), comment='学历')
    work_experience = Column(String(1000), comment='工作经验')
    skills = Column(JSON, comment='技能列表')
    bio = Column(String(1000), comment='个人简介')
    avatar_url = Column(String(200), comment='头像URL')
    learning_ability = Column(Float, comment='学习能力评分')
    skill_tags = Column(JSON, comment='技能标签')
    interests = Column(JSON, comment='兴趣爱好')
    career_interests = Column(JSON, comment='职业兴趣方向')
    personality_traits = Column(JSON, comment='性格特征评估结果')
    work_style = Column(JSON, comment='工作风格偏好')
    learning_style = Column(String(50), comment='学习风格')
    growth_potential = Column(Float, comment='发展潜力评分')
    recommended_paths = Column(JSON, comment='推荐的发展路径')
    ai_analysis = Column(JSON, comment='AI分析的综合评估结果')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    user = relationship('User', backref='profile') 