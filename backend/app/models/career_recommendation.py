from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class CareerRecommendation(Base):
    """职业推荐模型"""
    __tablename__ = 'career_recommendations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, comment='用户ID')
    career_id = Column(Integer, ForeignKey('careers.id'), nullable=False, comment='职业ID')
    match_score = Column(Integer, comment='匹配分数')
    analysis_report = Column(JSON, comment='分析报告')
    is_accepted = Column(Boolean, default=False, comment='是否接受推荐')
    feedback = Column(Text, comment='用户反馈')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    user = relationship('User', backref='recommendations')
    career = relationship('Career', backref='recommendations') 