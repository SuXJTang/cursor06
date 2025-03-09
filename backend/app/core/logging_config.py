import logging
import sys
from pathlib import Path
from loguru import logger
from app.core.config import settings

# 日志文件路径
LOG_FILE_PATH = Path("app/logs/app.log")

# 确保日志目录存在
LOG_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)

# Loguru配置
config = {
    "handlers": [
        {
            "sink": sys.stdout,
            "format": "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            "level": settings.LOG_LEVEL,
        },
        {
            "sink": str(LOG_FILE_PATH),
            "format": "{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
            "level": settings.LOG_LEVEL,
            "rotation": "500 MB",  # 日志文件大小达到500MB时轮转
            "retention": "10 days",  # 保留10天的日志
            "compression": "zip",  # 压缩轮转的日志
            "encoding": "utf-8",  # 使用UTF-8编码
        },
    ],
}

# 配置Loguru
logger.configure(**config)

# 创建一个类来实现Python标准日志接口
class InterceptHandler(logging.Handler):
    def emit(self, record):
        # 获取对应的Loguru级别
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # 找到调用者的文件名和行号
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

# 配置标准库日志处理器
logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

# 替换uvicorn和FastAPI的日志处理器
for name in logging.root.manager.loggerDict:
    if name.startswith("uvicorn") or name.startswith("fastapi"):
        logging.getLogger(name).handlers = [InterceptHandler()]

# 导出logger实例
app_logger = logger 