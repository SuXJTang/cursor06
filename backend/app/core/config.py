from typing import Any, Dict, List, Optional, Union

from pydantic import validator
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
import json
import secrets

# 加载.env文件
load_dotenv()

class Settings(BaseSettings):
    model_config = {"extra": "ignore", "env_file": ".env", "case_sensitive": True}
    
    # 项目根目录
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "cursor06"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # 前端开发服务器
        "http://localhost:3000",  # 可能的其他前端开发服务器
        "http://localhost:8080",  # 可能的其他前端开发服务器
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://localhost:4173",  # Vite预览服务器
        "http://127.0.0.1:4173",
        "http://192.168.77.1:5173",  # 本地网络地址
        "http://192.168.77.1:8000",  # 后端服务器地址
        "http://192.168.143.1:5173",  # 其他本地网络地址
        "http://192.168.1.100:5173",  # 其他可能的本地IP
        "http://192.168.0.100:5173",  # 其他可能的本地IP
        "*"  # 允许所有源，开发环境使用
    ]
    
    # 数据库配置
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "123456"
    MYSQL_DATABASE: str = "cursor06"
    SQLALCHEMY_DATABASE_URI: str = f"mysql+aiomysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    
    # 同步数据库连接URI
    SYNC_SQLALCHEMY_DATABASE_URI: str = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    
    # 旧配置兼容
    DB_HOST: str = MYSQL_HOST
    DB_PORT: int = MYSQL_PORT
    DB_USER: str = MYSQL_USER
    DB_PASSWORD: str = MYSQL_PASSWORD
    DB_NAME: str = MYSQL_DATABASE
    SQLALCHEMY_DATABASE_URL: str = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    
    # JWT配置
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))  # 优先使用环境变量
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"  # JWT加密算法
    
    # 日志配置
    LOG_LEVEL: str = "DEBUG"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Elasticsearch配置
    ELASTICSEARCH_HOST: str = "localhost"
    ELASTICSEARCH_PORT: int = 9200
    
    # Redis配置
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    # 文件上传配置
    STATIC_DIR: str = "static"  # 静态文件根目录
    UPLOAD_DIR: str = "uploads"
    DATA_DIR: str = "data"  # 数据文件目录
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]
    
    # 服务器主机配置
    SERVER_HOST: str = "localhost:8000"  # 用于生成完整URL
    
    # 测试用户配置
    EMAIL_TEST_USER: str = "test@example.com"
    EMAIL_TEST_USER_PASSWORD: str = "test123"
    
    # 超级用户配置
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_USERNAME: str = "admin"  # 添加超级用户用户名
    FIRST_SUPERUSER_PASSWORD: str = "admin123"
    
    # DeepSeek API配置
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "sk-c694d610737e48eda2b04d0b21959bf7")
    DEEPSEEK_API_BASE_URL: str = os.getenv("DEEPSEEK_API_BASE_URL", "https://api.deepseek.com/v1")
    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    
    # AI服务设置
    ENABLE_AI_SERVICES: bool = os.getenv("ENABLE_AI_SERVICES", "True").lower() in ("true", "1", "t")  # 是否启用AI服务
    
    # 邮件服务配置
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "app/email-templates/build"
    EMAILS_ENABLED: bool = False

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

# 创建设置实例
settings = Settings() 