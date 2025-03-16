from typing import Any, Dict, List, Optional, Union

from pydantic import BaseSettings, validator
import os
from dotenv import load_dotenv
import json

# 加载.env文件
load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "cursor06"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # 数据库配置
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "123456"
    DB_NAME: str = "cursor06"
    SQLALCHEMY_DATABASE_URL: str = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key"  # 请更改为安全的密钥
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"  # JWT加密算法
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Elasticsearch配置
    ELASTICSEARCH_HOST: str = "localhost"
    ELASTICSEARCH_PORT: int = 9200
    
    # Redis配置
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # 文件上传配置
    STATIC_DIR: str = "static"  # 静态文件根目录
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]
    
    # 测试用户配置
    EMAIL_TEST_USER: str = "test@example.com"
    EMAIL_TEST_USER_PASSWORD: str = "test123"
    
    # 超级用户配置
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_USERNAME: str = "admin"  # 添加超级用户用户名
    FIRST_SUPERUSER_PASSWORD: str = "admin123"
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        case_sensitive = True

# 创建设置实例
settings = Settings() 