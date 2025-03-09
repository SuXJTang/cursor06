import uvicorn
from app.core.config import settings
from app.core.logging_config import app_logger

if __name__ == "__main__":
    app_logger.info("启动服务器...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 开发模式下启用热重载
        workers=1,    # 工作进程数
        log_level=settings.LOG_LEVEL.lower(),
    ) 