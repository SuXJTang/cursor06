from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Job(Base):
    """工作岗位模型"""
    __tablename__ = 'jobs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False, comment='岗位名称')
    company = Column(String(100), nullable=False, comment='公司名称')
    description = Column(Text, comment='岗位描述')
    requirements = Column(Text, comment='岗位要求')
    skills = Column(Text, comment='所需技能')
    education_required = Column(String(50), comment='学历要求')
    experience_required = Column(String(50), comment='经验要求')
    salary_range = Column(Text, comment='薪资范围')
    location = Column(String(100), comment='工作地点')
    job_type = Column(String(50), comment='工作类型：全职/兼职/实习')
    status = Column(String(20), default='active', comment='岗位状态：active-招聘中，closed-已结束')
    benefits = Column(Text, comment='福利待遇')
    category_id = Column(Integer, ForeignKey('job_categories.id'), nullable=False, comment='分类ID')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    category = relationship('JobCategory', backref='jobs') 