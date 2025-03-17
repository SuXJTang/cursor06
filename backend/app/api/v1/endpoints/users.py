from typing import Any
import os
import time

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.logging_config import app_logger
from app.core.config import settings
from app import crud, models, schemas
from app.api import deps

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

@router.post("/me/avatar", response_model=schemas.User)
def upload_avatar(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """上传用户头像"""
    try:
        # 检查文件扩展名
        filename = file.filename
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext not in ['.jpg', '.jpeg', '.png']:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的图片格式。允许的格式: .jpg, .jpeg, .png"
            )
        
        # 检查文件大小（限制为2MB）
        content = file.file.read()
        file_size = len(content)
        file.file.seek(0)  # 重置文件指针
        
        if file_size > 2 * 1024 * 1024:
            raise HTTPException(
                status_code=400, 
                detail=f"文件太大。最大允许大小: 2MB"
            )
        
        # 创建上传目录
        upload_dir = os.path.join(settings.STATIC_DIR, "avatars")
        os.makedirs(upload_dir, exist_ok=True)
        
        # 删除用户之前的头像文件(如果存在)
        if current_user.avatar_url:
            old_filename = current_user.avatar_url.split("/")[-1]
            old_file_path = os.path.join(upload_dir, old_filename)
            if os.path.exists(old_file_path):
                os.remove(old_file_path)
        
        # 生成唯一文件名
        timestamp = int(time.time())
        unique_filename = f"{timestamp}_{current_user.id}_{filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # 保存文件
        with open(file_path, "wb") as f:
            f.write(content)
        
        # 生成文件URL
        avatar_url = f"{settings.API_V1_STR}/users/avatars/{unique_filename}"
        
        # 更新用户的头像URL
        user = crud.user.update(
            db=db, 
            db_obj=current_user,
            obj_in={"avatar_url": avatar_url}
        )
        
        app_logger.info(f"用户 {current_user.id} 上传了新头像")
        return user
    except Exception as e:
        app_logger.error(f"头像上传失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"头像上传失败: {str(e)}"
        )

@router.patch("/me/avatar-url", response_model=schemas.User)
def update_avatar_url(
    *,
    db: Session = Depends(deps.get_db),
    avatar_data: schemas.UserAvatarUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """直接更新用户头像URL"""
    try:
        # 更新用户头像URL
        user = crud.user.update(
            db=db, 
            db_obj=current_user,
            obj_in={"avatar_url": avatar_data.avatar_url}
        )
        
        app_logger.info(f"用户 {current_user.id} 更新了头像URL")
        return user
    except Exception as e:
        app_logger.error(f"更新头像URL失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新头像URL失败: {str(e)}"
        )

@router.get("/avatars/{filename}")
def get_avatar(
    *,
    filename: str,
) -> Any:
    """获取用户头像"""
    try:
        file_path = os.path.join(settings.STATIC_DIR, "avatars", filename)
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=404,
                detail="头像文件不存在"
            )
        
        # 从文件扩展名判断媒体类型
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext in ['.jpg', '.jpeg']:
            media_type = "image/jpeg"
        elif file_ext == '.png':
            media_type = "image/png"
        else:
            media_type = "application/octet-stream"
        
        return FileResponse(
            file_path,
            media_type=media_type
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        app_logger.error(f"获取头像出错: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取头像失败: {str(e)}"
        ) 