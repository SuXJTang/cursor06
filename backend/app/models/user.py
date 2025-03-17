from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    """用户模型"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(100), unique=True, nullable=False, index=True, comment='邮箱')
    username = Column(String(50), unique=True, nullable=False, index=True, comment='用户名')
    phone = Column(String(20), unique=True, comment='手机号')
    hashed_password = Column(String(100), nullable=False, comment='密码哈希')
    avatar_url = Column(String(255), comment='头像URL')
    is_active = Column(Boolean, default=True, comment='是否激活')
    is_superuser = Column(Boolean, default=False, comment='是否为超级用户')
    is_verified = Column(Boolean, default=False, comment='是否验证')
    last_login = Column(DateTime, comment='最后登录时间')
    created_at = Column(DateTime, server_default=func.now(), comment='创建时间')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment='更新时间') 