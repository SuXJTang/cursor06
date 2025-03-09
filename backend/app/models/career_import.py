from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class CareerImport(Base):
    """职业导入模型"""
    __tablename__ = 'career_imports'

    id = Column(Integer, primary_key=True, autoincrement=True, comment='导入记录ID')
    filename = Column(String(200), nullable=False, comment='导入文件名')
    file_size = Column(Integer, comment='文件大小(字节)')
    total_count = Column(Integer, comment='总记录数')
    success_count = Column(Integer, comment='成功导入数')
    failed_count = Column(Integer, comment='失败记录数')
    status = Column(String(20), comment='导入状态：pending-待处理，processing-处理中，completed-已完成，failed-失败')
    error_details = Column(JSON, comment='错误详情')
    importer_id = Column(Integer, ForeignKey('users.id'), nullable=False, comment='导入人ID')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间')

    importer = relationship('User', backref='career_imports') 