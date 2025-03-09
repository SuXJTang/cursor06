from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import resume as crud_resume
from app.models.user import User
from app.schemas.resume import (
    Resume, ResumeCreate, ResumeUpdate,
    ResumeFileUpdate, ResumeStatusUpdate
)

router = APIRouter()

@router.get("/me", response_model=List[Resume])
def get_my_resumes(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取当前用户的所有简历
    """
    resumes = crud_resume.get_by_user_id(db, user_id=current_user.id)
    return resumes

@router.post("/me", response_model=Resume)
def create_my_resume(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    resume_in: ResumeCreate
) -> Any:
    """
    创建当前用户的简历
    """
    try:
        resume = crud_resume.create_with_user(
            db, 
            obj_in=resume_in, 
            user_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return resume

@router.put("/me/{resume_id}", response_model=Resume)
def update_my_resume(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    resume_id: int,
    resume_in: ResumeUpdate
) -> Any:
    """
    更新当前用户的指定简历
    """
    resume = crud_resume.get(db, id=resume_id)
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
    
    try:
        resume = crud_resume.update(db, db_obj=resume, obj_in=resume_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return resume

@router.delete("/me/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_resume(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    resume_id: int
) -> None:
    """
    删除当前用户的指定简历
    """
    resume = crud_resume.get(db, id=resume_id)
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
    
    crud_resume.remove(db, id=resume_id)

@router.put("/me/{resume_id}/file", response_model=Resume)
def update_my_resume_file(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    resume_id: int,
    resume_in: ResumeFileUpdate
) -> Any:
    """
    更新简历文件
    """
    resume = crud_resume.get(db, id=resume_id)
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
    
    resume = crud_resume.update(db, db_obj=resume, obj_in={"file_url": str(resume_in.file_url)})
    return resume

@router.put("/me/{resume_id}/status", response_model=Resume)
def update_my_resume_status(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    resume_id: int,
    resume_in: ResumeStatusUpdate
) -> Any:
    """
    更新简历状态
    """
    resume = crud_resume.get(db, id=resume_id)
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
    
    resume = crud_resume.update(db, db_obj=resume, obj_in={"status": resume_in.status})
    return resume

@router.get("/", response_model=List[Resume])
def list_resumes(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_verified_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    列出所有简历（仅限已验证用户）
    """
    resumes = crud_resume.get_multi(db, skip=skip, limit=limit)
    return resumes 