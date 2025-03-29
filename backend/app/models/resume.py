from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Resume(Base):
    """简历模型"""
    __tablename__ = 'resumes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False, comment='简历标题')
    content = Column(Text, nullable=False, comment='简历内容')
    description = Column(Text, nullable=True, comment='简历描述')
    file_url = Column(String(255), comment='简历文件URL')
    status = Column(String(20), default='draft', comment='简历状态：draft-草稿，submitted-已提交，approved-已通过，rejected-已拒绝')
    is_active = Column(Boolean, default=True, comment='是否激活')
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, comment='用户ID')
    parsed_data = Column(Text, nullable=True, comment='解析后的结构化数据')
    last_parsed_at = Column(DateTime, nullable=True, comment='最后解析时间')
    ai_analysis_file = Column(String(255), nullable=True, comment='AI分析结果文件路径')
    domain = Column(String(50), nullable=True, comment='简历所属领域')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    user = relationship('User', back_populates='resumes') 