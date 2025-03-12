from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.db.base_class import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)  # 反馈类型
    title = Column(String(200), nullable=False)  # 标题
    description = Column(Text, nullable=False)  # 详细描述
    contact = Column(String(100))  # 联系方式
    created_at = Column(DateTime, default=datetime.utcnow)
    screenshots = Column(Text)  # 存储图片路径，多个路径用分号分隔 