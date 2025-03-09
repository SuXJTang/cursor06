from sqlalchemy import create_engine, exc
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from app.core.logging_config import app_logger
import pymysql

def create_database_if_not_exists():
    try:
        # 先尝试连接MySQL服务器（不指定数据库）
        connection = pymysql.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            port=settings.DB_PORT
        )
        
        # 创建游标
        with connection.cursor() as cursor:
            # 创建数据库（如果不存在）
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
            app_logger.info(f"确保数据库 {settings.DB_NAME} 存在")
        
        connection.close()
    except Exception as e:
        app_logger.error(f"创建数据库时出错: {str(e)}")
        raise

try:
    # 确保数据库存在
    create_database_if_not_exists()
    
    # 测试数据库连接
    connection = pymysql.connect(
        host=settings.DB_HOST,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME,
        port=settings.DB_PORT
    )
    connection.close()
    app_logger.info("数据库连接测试成功")

    # 创建数据库引擎
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # 启用连接池心跳检测
        pool_size=5,  # 连接池大小
        max_overflow=10,  # 最大溢出连接数
        pool_recycle=3600,  # 连接回收时间（秒）
    )
    app_logger.info("数据库引擎创建成功")
except (exc.SQLAlchemyError, pymysql.Error) as e:
    app_logger.error(f"数据库连接错误: {str(e)}")
    raise
except Exception as e:
    app_logger.error(f"创建数据库引擎时出现未知错误: {str(e)}")
    raise

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基本模型类
Base = declarative_base()

# 获取数据库会话的依赖函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 