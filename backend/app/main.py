from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import logging
import asyncio
import json
from datetime import datetime
from enum import Enum
from pydantic import BaseModel
import traceback

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.core.cache import cache
from app.utils.redis_service import start_redis_service
from app.db.session import async_redis_client

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("app")

# 自定义JSON编码器，处理特殊类型
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # 处理日期时间类型
        if isinstance(obj, datetime):
            return obj.isoformat()
        # 处理枚举类型
        if isinstance(obj, Enum):
            return obj.value
        # 其他默认处理
        return super().default(obj)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动事件
    logger.info("应用启动")
    try:
        # 启动Redis服务
        logger.info("正在启动Redis服务...")
        if not start_redis_service():
            logger.error("Redis服务启动失败，应用将无法使用缓存功能")
            # 不抛出异常，让应用继续运行
            pass
        else:
            # 测试Redis连接
            try:
                await async_redis_client.ping()
                logger.info("Redis连接测试成功")
            except Exception as e:
                logger.error(f"Redis连接测试失败: {str(e)}")
        
        # 初始化数据库
        logger.info("正在初始化数据库...")
        db = SessionLocal()
        try:
            init_db(db)
            logger.info("数据库初始化完成")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"应用启动失败: {str(e)}")
        # 不抛出异常，让应用继续运行
        pass
    
    yield  # 应用运行
    
    # 关闭事件
    logger.info("应用关闭")
    try:
        await async_redis_client.close()
    except Exception as e:
        logger.error(f"关闭Redis连接时出错: {str(e)}")

app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    # 添加自定义JSON序列化器
    json_encoder=CustomJSONEncoder
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # 明确允许前端地址
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],  # 明确允许的HTTP方法
    allow_headers=["*"],  # 允许所有头部
    expose_headers=["Content-Type", "Authorization"],  # 暴露特定头部
)

# 添加调试路由
@app.get("/debug-openapi")
def debug_openapi():
    """调试OpenAPI文档生成"""
    try:
        # 尝试获取OpenAPI schema
        openapi_schema = app.openapi()
        # 返回简化版，避免返回过大的响应
        return {
            "success": True,
            "schema_keys": list(openapi_schema.keys()),
            "paths_count": len(openapi_schema.get("paths", {})),
            "components_count": len(openapi_schema.get("components", {}).get("schemas", {}))
        }
    except Exception as e:
        # 捕获并返回详细错误信息
        error_detail = traceback.format_exc()
        logger.error(f"OpenAPI生成错误: {error_detail}")
        return {
            "success": False,
            "error": str(e),
            "error_type": str(type(e)),
            "traceback": error_detail
        }

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

# 添加测试路由
@app.get("/test-cache")
@cache(ttl=60)  # 缓存1分钟
async def test_cache():
    """测试缓存功能的简单API"""
    try:
        logger.debug("正在生成测试缓存数据...")
        # 添加一个时间戳，用于验证缓存是否生效
        result = {
            "message": "缓存测试",
            "timestamp": time.time(),
            "note": "如果缓存生效，多次请求的timestamp应该相同"
        }
        logger.debug(f"生成的测试数据: {result}")
        logger.debug("正在返回测试数据...")
        return result
    except Exception as e:
        logger.error(f"缓存测试失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"缓存测试失败: {str(e)}")

@app.get("/test")
async def test():
    """测试API"""
    try:
        logger.debug("正在生成测试数据...")
        # 添加一个时间戳，用于测试
        result = {
            "message": "测试成功",
            "timestamp": time.time()
        }
        logger.debug(f"生成的测试数据: {result}")
        return result
    except Exception as e:
        logger.error(f"测试失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"测试失败: {str(e)}")

@app.get("/")
async def root():
    """根路由"""
    return {"message": "欢迎使用求职平台API"}

@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"} 