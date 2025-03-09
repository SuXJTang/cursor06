from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class LearningPath(Base):
    """学习路径模型"""
    __tablename__ = 'learning_paths'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, comment='用户ID')
    target_job_id = Column(Integer, ForeignKey('jobs.id'), comment='目标职位ID')
    target_career_id = Column(Integer, ForeignKey('careers.id'), comment='目标职业ID')
    current_level = Column(String(50), comment='当前水平')
    target_level = Column(String(50), comment='目标水平')
    required_skills = Column(JSON, comment='需要掌握的技能')
    learning_steps = Column(JSON, comment='学习步骤')
    timeline = Column(JSON, comment='时间线规划')
    resources = Column(JSON, comment='学习资源')
    progress = Column(Integer, default=0, comment='完成进度(0-100)')
    is_active = Column(Boolean, default=True, comment='是否激活')
    completion_date = Column(DateTime, comment='预计完成时间')
    notes = Column(Text, comment='备注')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    user = relationship('User', backref='learning_paths')
    target_job = relationship('Job', backref='learning_paths')
    target_career = relationship('Career', backref='learning_paths') 