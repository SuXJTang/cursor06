from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging_config import app_logger
from app.db.init_db import init_db
from app.api.v1.api import api_router
from app.db.session import SessionLocal

# 创建FastAPI应用实例
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    app_logger.info("应用启动")
    try:
        # 初始化数据库
        db = SessionLocal()
        try:
            init_db(db)
            app_logger.info("数据库初始化完成")
        finally:
            db.close()
    except Exception as e:
        app_logger.error(f"数据库初始化失败: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    app_logger.info("应用关闭")

@app.get("/")
async def root():
    """根路由"""
    return {"message": "欢迎使用求职平台API"}

@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"} 