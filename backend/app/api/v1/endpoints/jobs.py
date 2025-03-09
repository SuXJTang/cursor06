from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=schemas.Job)
def create_job(
    *,
    db: Session = Depends(deps.get_db),
    job_in: schemas.JobCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新的职位。
    """
    # 验证职位分类是否存在
    if not crud.job_category.get(db=db, id=job_in.category_id):
        raise HTTPException(
            status_code=404,
            detail="Job category not found"
        )
    job = crud.job.create(db=db, obj_in=job_in)
    return job

@router.get("/", response_model=List[schemas.Job])
def read_jobs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取职位列表。
    """
    if category_id:
        jobs = crud.job.get_multi_by_category(
            db=db, category_id=category_id, skip=skip, limit=limit
        )
    else:
        jobs = crud.job.get_multi(db=db, skip=skip, limit=limit)
    return jobs

@router.get("/search", response_model=List[schemas.Job])
def search_jobs(
    *,
    db: Session = Depends(deps.get_db),
    params: schemas.JobSearchParams = Depends(),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    搜索职位。
    """
    jobs = crud.job.search(db=db, params=params, skip=skip, limit=limit)
    return jobs

@router.get("/{id}", response_model=schemas.Job)
def read_job(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    通过ID获取职位。
    """
    job = crud.job.get(db=db, id=id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{id}", response_model=schemas.Job)
def update_job(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    job_in: schemas.JobUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职位。
    """
    job = crud.job.get(db=db, id=id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # 如果更新了分类ID，验证新的分类是否存在
    if job_in.category_id and not crud.job_category.get(db=db, id=job_in.category_id):
        raise HTTPException(
            status_code=404,
            detail="Job category not found"
        )
    
    job = crud.job.update(db=db, db_obj=job, obj_in=job_in)
    return job

@router.put("/{id}/status", response_model=schemas.Job)
def update_job_status(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    status: str = Body(..., embed=True),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职位状态。
    """
    job = crud.job.update_status(db=db, job_id=id, status=status)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.delete("/{id}")
def delete_job(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除职位。
    """
    job = crud.job.get(db=db, id=id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    crud.job.remove(db=db, id=id)
    return {"status": "success"} 