from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Career(Base):
    """职业模型"""
    __tablename__ = 'careers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False, comment='职业名称')
    description = Column(Text, comment='职业描述')
    required_skills = Column(JSON, comment='所需技能')
    education_required = Column(String(50), comment='学历要求')
    experience_required = Column(String(50), comment='经验要求')
    career_path = Column(JSON, comment='职业发展路径')
    market_analysis = Column(JSON, comment='市场分析')
    salary_range = Column(JSON, comment='薪资范围')
    future_prospect = Column(String(50), comment='发展前景')
    category_id = Column(Integer, ForeignKey('career_categories.id'), nullable=False, comment='分类ID')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    category = relationship('CareerCategory', backref='careers') 