from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=schemas.JobCategory)
def create_job_category(
    *,
    db: Session = Depends(deps.get_db),
    job_category_in: schemas.JobCategoryCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新的职位分类。
    """
    job_category = crud.job_category.create(db=db, obj_in=job_category_in)
    return job_category.to_dict()

@router.get("/", response_model=List[schemas.JobCategory])
def read_job_categories(
    db: Session = Depends(deps.get_db),
    parent_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取职位分类列表。
    """
    job_categories = crud.job_category.get_multi_by_parent(
        db=db, parent_id=parent_id, skip=skip, limit=limit
    )
    return [category.to_dict() for category in job_categories]

@router.get("/tree", response_model=dict)
def read_job_category_tree(
    db: Session = Depends(deps.get_db),
    root_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取职位分类树。
    """
    return crud.job_category.get_tree(db=db, root_id=root_id)

@router.get("/{id}", response_model=schemas.JobCategory)
def read_job_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    通过ID获取职位分类。
    """
    job_category = crud.job_category.get(db=db, id=id)
    if not job_category:
        raise HTTPException(status_code=404, detail="Job category not found")
    return job_category.to_dict()

@router.put("/{id}", response_model=schemas.JobCategory)
def update_job_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    job_category_in: schemas.JobCategoryUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职位分类。
    """
    job_category = crud.job_category.get(db=db, id=id)
    if not job_category:
        raise HTTPException(status_code=404, detail="Job category not found")
    job_category = crud.job_category.update(db=db, db_obj=job_category, obj_in=job_category_in)
    return job_category.to_dict()

@router.put("/{id}/move", response_model=schemas.JobCategory)
def move_job_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    new_parent_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    移动职位分类（更改父分类）。
    """
    job_category = crud.job_category.update_tree(db=db, category_id=id, new_parent_id=new_parent_id)
    if not job_category:
        raise HTTPException(status_code=404, detail="Job category not found")
    return job_category.to_dict()

@router.get("/{id}/ancestors", response_model=List[schemas.JobCategory])
def read_job_category_ancestors(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取指定职位分类的所有祖先分类。
    """
    if not crud.job_category.get(db=db, id=id):
        raise HTTPException(status_code=404, detail="Job category not found")
    ancestors = crud.job_category.get_ancestors(db=db, category_id=id)
    return [ancestor.to_dict() for ancestor in ancestors]

@router.get("/{id}/descendants", response_model=List[schemas.JobCategory])
def read_job_category_descendants(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取指定职位分类的所有后代分类。
    """
    if not crud.job_category.get(db=db, id=id):
        raise HTTPException(status_code=404, detail="Job category not found")
    descendants = crud.job_category.get_descendants(db=db, category_id=id)
    return [descendant.to_dict() for descendant in descendants]

@router.delete("/{id}")
def delete_job_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除职位分类。
    """
    job_category = crud.job_category.get(db=db, id=id)
    if not job_category:
        raise HTTPException(status_code=404, detail="Job category not found")
    # 检查是否有子分类
    children = crud.job_category.get_multi_by_parent(db=db, parent_id=id)
    if children:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category with subcategories. Please delete subcategories first."
        )
    crud.job_category.remove(db=db, id=id)
    return {"status": "success"} 