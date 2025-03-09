from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class SkillAssessment(Base):
    """技能评估模型"""
    __tablename__ = 'skill_assessments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, comment='用户ID')
    skill_name = Column(String(100), nullable=False, comment='技能名称')
    skill_category = Column(String(50), comment='技能类别')
    proficiency_level = Column(Float, comment='熟练度评分')
    assessment_type = Column(String(50), comment='评估类型：self-自评，test-测试，interview-面试，ai-AI评估')
    assessment_details = Column(JSON, comment='评估详情')
    improvement_suggestions = Column(Text, comment='改进建议')
    next_level_requirements = Column(JSON, comment='下一等级要求')
    verified = Column(Boolean, default=False, comment='是否经过验证')
    verifier_id = Column(Integer, ForeignKey('users.id'), comment='验证人ID')
    verification_date = Column(DateTime, comment='验证时间')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    user = relationship('User', foreign_keys=[user_id], backref='skill_assessments')
    verifier = relationship('User', foreign_keys=[verifier_id], backref='verified_assessments') 