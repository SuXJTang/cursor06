import logging
from fastapi import FastAPI, Request, Response, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
from contextlib import asynccontextmanager
import json
from typing import Any, Dict
from datetime import datetime
import time
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from pathlib import Path
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi.responses import RedirectResponse

# 添加这一块代码，预先导入所有模型
# 预先导入所有模型，确保它们正确初始化
from app.db.base_class import Base
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.career import Career
from app.models.career_category import CareerCategory
from app.models.skill import Skill
from app.models.skill_assessment import SkillAssessment
from app.models.assessment import Assessment, AssessmentResult, AssessmentAnswer
from app.models.resume import Resume
from app.models.learning_path import LearningPath
from app.models.user_favorite_career import UserFavoriteCareer
from app.models.recommendation_session import RecommendationSession
from app.models.career_recommendation import CareerRecommendation
from app.models.feedback import Feedback

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging_config import app_logger, cleanup_old_logs
from app.db.session import create_database_if_not_exists
from app.core.file_utils import ensure_directories
# 添加错误处理中间件
from app.middleware.error_handler import add_error_handler
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

# 清理旧日志
cleanup_old_logs()

# 定义启动和关闭事件
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行
    app_logger.info("应用程序启动...")
    
    # 初始化Redis连接
    try:
        from app.db.redis_client import init_redis, close_redis
        await init_redis()
        app_logger.info("Redis连接初始化成功")
    except Exception as e:
        app_logger.error(f"初始化Redis连接时出错: {e}")
    
    # 初始化DeepSeek服务
    try:
        from app.services.deepseek_service import init_deepseek_service
        # 从环境变量获取API密钥，如果没有则使用默认值（开发环境）
        api_key = os.getenv("DEEPSEEK_API_KEY", "sk-dummy-development-key")
        await init_deepseek_service(api_key=api_key)
        app_logger.info("DeepSeek AI服务初始化成功")
    except Exception as e:
        app_logger.error(f"DeepSeek AI服务初始化失败: {str(e)}")
        app_logger.error("推荐功能将不可用，请配置正确的DeepSeek API密钥")
    
    yield
    
    # 关闭时执行
    app_logger.info("应用程序关闭...")
    
    # 关闭Redis连接
    try:
        from app.db.redis_client import close_redis
        await close_redis()
        app_logger.info("Redis连接已关闭")
    except Exception as e:
        app_logger.error(f"关闭Redis连接时出错: {e}")

# 确保数据库存在
create_database_if_not_exists()

# 确保必要的目录存在
ensure_directories()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    lifespan=lifespan
)

# 添加全局错误处理中间件
add_error_handler(app)
app_logger.info("已添加全局错误处理中间件")

# 确保静态目录存在
base_dir = os.path.abspath(os.path.dirname(__file__))
project_root = os.path.abspath(os.path.join(base_dir, ".."))
static_dir = os.path.join(project_root, "static")
avatars_dir = os.path.join(static_dir, "avatars")
resumes_dir = os.path.join(static_dir, "resumes")

# 创建目录（如果不存在）
os.makedirs(static_dir, exist_ok=True)
os.makedirs(avatars_dir, exist_ok=True)
os.makedirs(resumes_dir, exist_ok=True)
app_logger.info(f"确保静态目录存在: {static_dir}")
app_logger.info(f"确保头像目录存在: {avatars_dir}")
app_logger.info(f"确保简历目录存在: {resumes_dir}")

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Set all CORS enabled origins
# 不再依赖settings中的配置，直接硬编码所有需要的源
allowed_origins = [
    "http://localhost:5173",  # 前端开发服务器
    "http://127.0.0.1:5173",  # 前端IP访问
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:4173",
    "http://localhost:8000",  # 添加文档页面URL
    "http://127.0.0.1:8000",  # 添加文档页面IP访问
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:4173",
    "*"  # 允许所有源
]

app_logger.info(f"开始配置CORS，直接使用硬编码允许的源: {allowed_origins}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "X-CSRFToken", "Authorization"],
    max_age=600
)
app_logger.info(f"CORS配置完成: 允许的源: {allowed_origins}")

# 包含API路由
app.include_router(api_router, prefix="/api/v1")

# 添加路由兼容层，解决前端可能重复添加/api前缀的问题
@app.middleware("http")
async def fix_duplicate_api_prefix(request: Request, call_next):
    """中间件：修复重复的/api前缀问题"""
    path = request.url.path
    if path.startswith("/api/api/v1"):
        # 将/api/api/v1替换为/api/v1
        correct_path = path.replace("/api/api/v1", "/api/v1", 1)
        app_logger.warning(f"检测到重复的API前缀，将路径 {path} 重定向到 {correct_path}")
        
        # 构建新的URL
        url = str(request.url).replace(path, correct_path)
        return RedirectResponse(url=url)
    
    # 正常处理请求
    return await call_next(request)

# 添加头像访问兼容路由
compat_router = APIRouter()

@compat_router.get("/users/avatars/{filename}")
async def get_avatar_compat(filename: str):
    """
    获取头像（兼容前端路径）
    """
    logging.info(f"请求获取头像(兼容路径): {filename}")
    
    # 处理包含路径分隔符的文件名
    if '/' in filename:
        filename = filename.replace('/', '_')
        logging.info(f"修正后的文件名: {filename}")
    
    # 确定基础目录路径
    base_dir = os.path.abspath(os.path.dirname(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, ".."))
    avatars_dir = os.path.join(project_root, "static", "avatars")
    
    # 构建文件路径
    file_path = os.path.join(avatars_dir, filename)
    logging.info(f"头像文件路径: {file_path}")
    
    # 检查文件是否存在，如果不存在则使用默认头像
    if not os.path.exists(file_path):
        logging.warning(f"头像文件不存在: {file_path}，将使用默认头像")
        # 查找目录中的任何一张JPG作为默认头像
        default_avatars = [f for f in os.listdir(avatars_dir) if f.endswith('.jpg')]
        if default_avatars:
            file_path = os.path.join(avatars_dir, default_avatars[0])
            logging.info(f"使用默认头像: {file_path}")
        else:
            logging.error(f"没有找到可用的默认头像")
            raise HTTPException(
                status_code=404,
                detail="头像文件不存在且没有默认头像"
            )
    
    # 确定媒体类型
    media_type = None
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext == '.jpg' or file_ext == '.jpeg':
        media_type = 'image/jpeg'
    elif file_ext == '.png':
        media_type = 'image/png'
    elif file_ext == '.gif':
        media_type = 'image/gif'
    else:
        media_type = 'application/octet-stream'
    
    logging.info(f"返回头像文件: {file_path}, 媒体类型: {media_type}")
    return FileResponse(file_path, media_type=media_type)

app.include_router(compat_router, prefix="")

# 添加测试路由
@app.get("/")
def root() -> Dict[str, str]:
    return {"message": "职业推荐系统API服务正在运行"}

# 添加直接v1路径头像访问支持
@app.get("/v1/users/avatars/{filename}")
async def get_avatar_v1_direct(filename: str):
    """
    获取头像（支持直接v1前缀路径）
    """
    logging.info(f"请求获取头像(v1直接路径): {filename}")
    
    # 处理包含路径分隔符的文件名
    if '/' in filename:
        filename = filename.replace('/', '_')
        logging.info(f"修正后的文件名: {filename}")
    
    # 确定基础目录路径
    base_dir = os.path.abspath(os.path.dirname(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, ".."))
    avatars_dir = os.path.join(project_root, "static", "avatars")
    
    # 构建文件路径
    file_path = os.path.join(avatars_dir, filename)
    logging.info(f"头像文件路径: {file_path}")
    
    # 检查文件是否存在，如果不存在则使用默认头像
    if not os.path.exists(file_path):
        logging.warning(f"头像文件不存在: {file_path}，将使用默认头像")
        # 查找目录中的任何一张JPG作为默认头像
        default_avatars = [f for f in os.listdir(avatars_dir) if f.endswith('.jpg')]
        if default_avatars:
            file_path = os.path.join(avatars_dir, default_avatars[0])
            logging.info(f"使用默认头像: {file_path}")
        else:
            logging.error(f"没有找到可用的默认头像")
            raise HTTPException(
                status_code=404,
                detail="头像文件不存在且没有默认头像"
            )
    
    # 确定媒体类型
    media_type = None
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext == '.jpg' or file_ext == '.jpeg':
        media_type = 'image/jpeg'
    elif file_ext == '.png':
        media_type = 'image/png'
    elif file_ext == '.gif':
        media_type = 'image/gif'
    else:
        media_type = 'application/octet-stream'
    
    logging.info(f"返回头像文件: {file_path}, 媒体类型: {media_type}")
    return FileResponse(file_path, media_type=media_type)

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
    
    # 初始化AI服务
    try:
        from app.services.ai import init_ai_services
        init_ai_services()
        app_logger.info("AI服务初始化完成")
    except Exception as e:
        app_logger.error(f"初始化AI服务时出错: {e}")
    
    app_logger.info("Application startup complete.") 

# 添加WebSocket兼容路由
@app.websocket("/api/v1/ws/recommendations/{session_id}")
async def websocket_recommendation_endpoint(websocket: WebSocket, session_id: str):
    """
    兼容前端的WebSocket路由 - 不需要认证，只需要有效的session_id
    """
    from app.api.v1.endpoints.optimized_recommendations import websocket_manager

    try:
        # 接受连接
        await websocket.accept()
        app_logger.info(f"WebSocket连接已接受 - 会话ID: {session_id}")
        
        # 注册连接
        await websocket_manager.connect(session_id, websocket)
        
        # 发送初始状态
        await websocket.send_text(json.dumps({
            "type": "status",
            "message": "已连接到推荐系统",
            "session_id": session_id,
            "status": "connected"
        }))
        
        # 保持连接，等待关闭
        try:
            while True:
                # 接收消息并简单回显
                data = await websocket.receive_text()
                await websocket.send_text(f"服务器收到消息: {data}")
        except WebSocketDisconnect:
            app_logger.info(f"WebSocket连接已断开 - 会话ID: {session_id}")
    except Exception as e:
        app_logger.error(f"WebSocket处理时出错 - 会话ID: {session_id}, 错误: {str(e)}")
    finally:
        # 确保断开连接并清理资源
        await websocket_manager.disconnect(session_id)
        app_logger.info(f"WebSocket资源已清理 - 会话ID: {session_id}") 