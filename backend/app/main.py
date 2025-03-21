from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import logging
import asyncio

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
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # 指定具体的前端地址，不使用通配符
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    max_age=600,  # 预检请求缓存时间
)

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