from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.CareerCategory])
def get_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取所有职业分类
    """
    categories = crud.career_category.get_multi(db, skip=skip, limit=limit)
    return categories

@router.get("/roots", response_model=List[schemas.CareerCategory])
def get_root_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取根职业分类（没有父分类的分类）
    """
    categories = crud.career_category.get_root_categories(db, skip=skip, limit=limit)
    return categories

@router.get("/{category_id}", response_model=schemas.CareerCategory)
def get_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    根据ID获取指定职业分类
    """
    category = crud.career_category.get(db=db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="职业分类不存在")
    return category

@router.get("/{category_id}/subcategories", response_model=List[schemas.CareerCategory])
def get_subcategories(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取指定分类的子分类
    """
    subcategories = crud.career_category.get_subcategories(db=db, parent_id=category_id, skip=skip, limit=limit)
    return subcategories

@router.get("/{category_id}/tree", response_model=schemas.CategoryTree)
def get_category_tree(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取指定分类的分类树
    """
    category_tree = crud.career_category.get_category_tree(db=db, category_id=category_id)
    if not category_tree:
        raise HTTPException(status_code=404, detail="职业分类不存在")
    return category_tree

@router.post("/", response_model=schemas.CareerCategory)
def create_category(
    *,
    db: Session = Depends(deps.get_db),
    category_in: schemas.CareerCategoryCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新职业分类（仅限管理员）
    """
    category = crud.career_category.create(db=db, obj_in=category_in)
    return category

@router.put("/{category_id}", response_model=schemas.CareerCategory)
def update_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    category_in: schemas.CareerCategoryUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职业分类（仅限管理员）
    """
    category = crud.career_category.get(db=db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="职业分类不存在")
    category = crud.career_category.update(db=db, db_obj=category, obj_in=category_in)
    return category

@router.delete("/{category_id}", response_model=schemas.CareerCategory)
def delete_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除职业分类（仅限管理员）
    """
    category = crud.career_category.get(db=db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="职业分类不存在")
    
    # 检查该分类下是否有子分类
    subcategories = crud.career_category.get_subcategories(db=db, parent_id=category_id)
    if subcategories:
        raise HTTPException(status_code=400, detail="无法删除含有子分类的分类")
    
    # 检查该分类下是否有职业
    careers = crud.career.get_by_category(db=db, category_id=category_id)
    if careers:
        raise HTTPException(status_code=400, detail="无法删除含有职业的分类")
    
    category = crud.career_category.remove(db=db, id=category_id)
    return category 