from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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
    """创建简历"""
    resume = crud.resume.create_with_owner(
        db=db, obj_in=resume_in, user_id=current_user.id
    )
    return resume

@router.get("/me", response_model=List[schemas.Resume])
def read_my_resumes(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """获取当前用户的所有简历"""
    resumes = crud.resume.get_multi_by_owner(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return resumes

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

@router.put("/me/{resume_id}", response_model=schemas.Resume)
def update_resume(
    *,
    db: Session = Depends(deps.get_db),
    resume_id: int,
    resume_in: schemas.ResumeUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """更新简历"""
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
    resume = crud.resume.update(db=db, db_obj=resume, obj_in=resume_in)
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