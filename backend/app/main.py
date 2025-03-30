from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from contextlib import asynccontextmanager
import json
from typing import Any, Dict
from datetime import datetime
import time
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging_config import app_logger
from app.utils.logger import logger as utils_logger
# 注释掉不存在的中间件导入
# from app.middleware.response_formatter import CustomResponseMiddleware
# from app.middleware.request_log import LoggingMiddleware

# 确保日志目录和模板目录存在
os.makedirs("app/logs", exist_ok=True)
os.makedirs("app/templates", exist_ok=True)
os.makedirs("app/uploads", exist_ok=True)

# 自定义JSON编码器，处理特殊类型
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj: Any) -> Any:
        if isinstance(obj, datetime):
            return obj.isoformat()
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)

# 定义启动和关闭事件
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动前执行
    app_logger.info("应用启动中...")
    
    try:
        from app.db.init_db import init_db
        try:
            await init_db()
            app_logger.info("数据库初始化完成")
        except Exception as e:
            app_logger.error(f"数据库初始化失败: {str(e)}", exc_info=True)
    except Exception as outer_e:
        app_logger.error(f"导入或调用init_db时出错: {str(outer_e)}", exc_info=True)
    
    # 启动Redis服务
    try:
        from app.utils.redis_service import start_redis_service_connection_check
        app_logger.info("启动Redis服务...")
        await start_redis_service_connection_check()
        app_logger.info("Redis服务已启动")
    except Exception as e:
        app_logger.error(f"Redis服务启动失败: {e}")
        pass
    
    # 初始化DeepSeek服务
    try:
        from app.services.deepseek_service import init_deepseek_service
        init_deepseek_service(
            api_key=settings.DEEPSEEK_API_KEY,
            api_base_url=settings.DEEPSEEK_API_BASE_URL
        )
        app_logger.info("DeepSeek服务初始化完成")
    except Exception as e:
        app_logger.error(f"DeepSeek服务初始化失败: {e}")
    
    app_logger.info("应用启动完成")
    yield  # 应用运行
    
    # 应用关闭时执行
    app_logger.info("应用关闭中...")
    
    # 关闭Redis连接
    try:
        from app.db.session import async_redis_client
        await async_redis_client.close()
        app_logger.info("Redis连接已关闭")
    except Exception as e:
        app_logger.error(f"关闭Redis连接时出错: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # 在这里添加OAuth2
    swagger_ui_oauth2_redirect_url=f"{settings.API_V1_STR}/docs/oauth2-redirect",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# 确保静态目录存在
base_dir = os.path.abspath(os.path.dirname(__file__))
project_root = os.path.abspath(os.path.join(base_dir, ".."))
static_dir = os.path.join(project_root, "static")
avatars_dir = os.path.join(static_dir, "avatars")

# 创建目录（如果不存在）
os.makedirs(static_dir, exist_ok=True)
os.makedirs(avatars_dir, exist_ok=True)
app_logger.info(f"确保静态目录存在: {static_dir}")
app_logger.info(f"确保头像目录存在: {avatars_dir}")

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    # 检查是否包含通配符
    if "*" in settings.BACKEND_CORS_ORIGINS:
        # 注意: 通配符*与allow_credentials=True不能同时使用，这是浏览器安全限制
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=False,  # 当使用通配符时，必须设置为False
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["Content-Type", "X-CSRFToken", "Authorization"],
            max_age=600  # 缓存预检请求的结果10分钟
        )
        app_logger.info("CORS配置: 允许所有源 (withCredentials 禁用)")
    else:
        # 否则只允许指定的源
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,  # 当使用具体源列表时，可以启用凭证
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["Content-Type", "X-CSRFToken", "Authorization"],
            max_age=600  # 缓存预检请求的结果10分钟
        )
        app_logger.info(f"CORS配置: 允许的源: {settings.BACKEND_CORS_ORIGINS}")

# 包含API路由
app.include_router(api_router, prefix="/api/v1")

# 添加测试路由
@app.get("/")
def root() -> Dict[str, str]:
    return {"message": "职业推荐系统API服务正在运行"}

@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"}

# 确保必要的数据目录存在
def ensure_dirs_exist():
    """确保必要的数据目录存在"""
    dirs = [
        "data",
        "data/ai_responses",
        "data/assessments",
        "data/resume_results",
        "data/resume_processing",
        "data/ocr_texts",
        "data/resources",
        "templates"
    ]
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
        app_logger.info(f"确保目录存在: {dir_path}")

@app.on_event("startup")
async def startup_event():
    """应用启动时执行的初始化操作"""
    # 确保必要目录存在
    ensure_dirs_exist()
    app_logger.info("Application startup complete.") 