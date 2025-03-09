from fastapi import APIRouter, HTTPException
from app.core.logging_config import app_logger

router = APIRouter()

@router.get("/test")
async def test_users_endpoint():
    """测试用户路由是否正常工作"""
    try:
        app_logger.info("访问用户测试接口")
        return {"message": "用户路由测试成功"}
    except Exception as e:
        app_logger.error(f"用户测试接口出错: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器内部错误") 