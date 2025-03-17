from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import time
from fastapi.responses import FileResponse

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.post("/me", response_model=schemas.Resume)
def create_resume(
    *,
    db: Session = Depends(deps.get_db),
    resume_in: schemas.ResumeCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """创建或更新用户的简历（一用户一简历）"""
    # 检查用户是否已有简历
    existing_resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).first()
    
    if existing_resume:
        # 如果已有简历，更新内容
        updated_data = resume_in.dict(exclude_unset=True)
        for key, value in updated_data.items():
            setattr(existing_resume, key, value)
        
        db.add(existing_resume)
        db.commit()
        db.refresh(existing_resume)
        return existing_resume
    else:
        # 如果没有简历，创建新简历
        resume = crud.resume.create_with_owner(
            db=db, obj_in=resume_in, user_id=current_user.id
        )
        return resume

@router.get("/me", response_model=schemas.Resume)
def read_my_resume(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """获取当前用户的简历（如果存在）"""
    resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="您还没有创建简历"
        )
    return resume

@router.get("/{resume_id}", response_model=schemas.Resume)
def read_resume(
    *,
    db: Session = Depends(deps.get_db),
    resume_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """获取指定简历"""
    resume = crud.resume.get(db=db, id=resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="简历不存在"
        )
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限访问此简历"
        )
    return resume

@router.put("/me", response_model=schemas.Resume)
def update_my_resume(
    *,
    db: Session = Depends(deps.get_db),
    resume_in: schemas.ResumeUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """更新当前用户的简历"""
    resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="您还没有创建简历，无法更新"
        )
    
    # 更新简历内容
    updated_data = resume_in.dict(exclude_unset=True)
    for key, value in updated_data.items():
        setattr(resume, key, value)
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return resume

@router.put("/me/{resume_id}/status", response_model=schemas.Resume)
def update_resume_status(
    *,
    db: Session = Depends(deps.get_db),
    resume_id: int,
    status_in: schemas.ResumeStatusUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """更新简历状态"""
    resume = crud.resume.get(db=db, id=resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="简历不存在"
        )
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限修改此简历"
        )
    resume = crud.resume.update_status(db=db, db_obj=resume, status=status_in.status)
    return resume

@router.put("/me/{resume_id}/file", response_model=schemas.Resume)
def update_resume_file(
    *,
    db: Session = Depends(deps.get_db),
    resume_id: int,
    file_in: schemas.ResumeFileUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """更新简历文件"""
    resume = crud.resume.get(db=db, id=resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="简历不存在"
        )
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限修改此简历"
        )
    resume = crud.resume.update_file_url(db=db, db_obj=resume, file_url=str(file_in.file_url))
    return resume

@router.delete("/me/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    *,
    db: Session = Depends(deps.get_db),
    resume_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """删除简历"""
    resume = crud.resume.get(db=db, id=resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="简历不存在"
        )
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限删除此简历"
        )
    crud.resume.remove(db=db, id=resume_id)
    return None

@router.get("/", response_model=List[schemas.Resume])
def list_resumes(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_verified_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    列出所有简历（仅限已验证用户）
    """
    resumes = crud.resume.get_multi(db, skip=skip, limit=limit)
    return resumes 

@router.post("/upload", response_model=schemas.ResumeFile)
def upload_resume_file(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """上传简历文件"""
    # 检查文件扩展名
    filename = file.filename
    file_ext = os.path.splitext(filename)[1].lower()
    
    if file_ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件格式。允许的格式: {', '.join(settings.ALLOWED_UPLOAD_EXTENSIONS)}"
        )
    
    # 检查文件大小
    content = file.file.read()
    file_size = len(content)
    file.file.seek(0)  # 重置文件指针
    
    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"文件太大。最大允许大小: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )
    
    # 创建上传目录
    upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
    os.makedirs(upload_dir, exist_ok=True)
    
    # 生成唯一文件名
    timestamp = int(time.time())
    unique_filename = f"{timestamp}_{current_user.id}_{filename}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # 保存文件
    with open(file_path, "wb") as f:
        f.write(content)
    
    # 生成文件URL
    file_url = f"{settings.API_V1_STR}/resumes/download/{unique_filename}"
    
    return {
        "filename": filename,
        "file_size": file_size,
        "file_type": file.content_type,
        "file_url": file_url
    }

@router.get("/download/{filename}")
def download_resume_file(
    *,
    filename: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """下载简历文件"""
    file_path = os.path.join(settings.STATIC_DIR, "resumes", filename)
    
    # 检查文件是否存在
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="文件不存在"
        )
    
    # 检查文件所有权（从文件名中提取用户ID）
    try:
        parts = filename.split("_")
        if len(parts) >= 2:
            file_user_id = int(parts[1])
            if file_user_id != current_user.id and not current_user.is_superuser:
                raise HTTPException(
                    status_code=403,
                    detail="没有权限访问此文件"
                )
    except (ValueError, IndexError):
        # 如果文件名格式不正确，则只允许超级用户访问
        if not current_user.is_superuser:
            raise HTTPException(
                status_code=403,
                detail="没有权限访问此文件"
            )
    
    return FileResponse(
        file_path, 
        filename=filename.split("_", 2)[-1],  # 提取原始文件名
        media_type="application/octet-stream"
    )