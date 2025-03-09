from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class JobApplication(Base):
    """工作申请模型"""
    __tablename__ = 'job_applications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, comment='申请人ID')
    job_id = Column(Integer, ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False, comment='工作ID')
    resume_id = Column(Integer, ForeignKey('resumes.id'), comment='简历ID')
    status = Column(String(20), default='pending', comment='申请状态：pending-待处理，reviewing-审核中，accepted-已接受，rejected-已拒绝')
    cover_letter = Column(Text, comment='求职信')
    interview_time = Column(DateTime, comment='面试时间')
    feedback = Column(Text, comment='面试反馈')
    match_score = Column(Integer, comment='匹配分数')
    analysis_report = Column(JSON, comment='分析报告')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    user = relationship('User', backref='job_applications')
    job = relationship('Job', backref='applications')
    resume = relationship('Resume', backref='applications') 