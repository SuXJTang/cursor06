from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from contextlib import asynccontextmanager
import json
from typing import Any, Dict
from datetime import datetime

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging_config import app_logger

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
    title="职业推荐系统API",
    version="1.0.0",
    lifespan=lifespan,
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 替换为具体前端域名
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头
)

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