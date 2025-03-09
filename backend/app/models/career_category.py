from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class CareerCategory(Base):
    """职业分类模型"""
    __tablename__ = 'career_categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False, comment='分类名称')
    parent_id = Column(Integer, ForeignKey('career_categories.id'), comment='父分类ID')
    level = Column(Integer, nullable=False, comment='分类层级')
    description = Column(String(200), comment='分类描述')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    parent = relationship('CareerCategory', remote_side=[id], backref='children') 