import logging
import sys
import os
import locale
from pathlib import Path
from logging.handlers import RotatingFileHandler

# 创建日志目录
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

# 检测系统编码
system_encoding = locale.getpreferredencoding()

# 配置日志格式
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()

# 创建logger
logger = logging.getLogger("app")
logger.setLevel(getattr(logging, LOG_LEVEL))

# 防止日志重复
if not logger.handlers:
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    # 设置控制台输出编码为UTF-8
    console_handler.setStream(sys.stdout)
    logger.addHandler(console_handler)
    
    # 文件处理器（按大小滚动）
    file_handler = RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(file_handler)

# 禁用传播到根日志记录器
logger.propagate = False 