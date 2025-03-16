from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=schemas.CareerSearchResult)
def get_careers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取所有职业
    """
    careers = crud.career.get_multi(db, skip=skip, limit=limit)
    total = crud.career.count(db)
    return {
        "careers": careers,
        "total": total,
        "page": skip // limit + 1,
        "per_page": limit,
        "pages": (total + limit - 1) // limit
    }

@router.post("/", response_model=schemas.Career)
def create_career(
    *,
    db: Session = Depends(deps.get_db),
    career_in: schemas.CareerCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新职业（仅限管理员）
    """
    career = crud.career.create(db=db, obj_in=career_in)
    return career

@router.get("/{career_id}", response_model=schemas.CareerWithStats)
def get_career(
    *,
    db: Session = Depends(deps.get_db),
    career_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    根据ID获取指定职业
    """
    career = crud.career.get(db=db, id=career_id)
    if not career:
        raise HTTPException(status_code=404, detail="职业不存在")
    
    # 获取统计信息
    related_jobs_count = db.query(models.Job).filter(models.Job.category_id == career.category_id).count()
    learning_paths_count = db.query(models.LearningPath).filter(models.LearningPath.career_id == career_id).count()
    
    # 将职业对象转换为dict，然后添加统计信息
    career_dict = schemas.Career.from_orm(career).dict()
    career_dict.update({
        "related_jobs_count": related_jobs_count,
        "learning_paths_count": learning_paths_count
    })
    
    return career_dict

@router.put("/{career_id}", response_model=schemas.Career)
def update_career(
    *,
    db: Session = Depends(deps.get_db),
    career_id: int,
    career_in: schemas.CareerUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职业信息（仅限管理员）
    """
    career = crud.career.get(db=db, id=career_id)
    if not career:
        raise HTTPException(status_code=404, detail="职业不存在")
    career = crud.career.update(db=db, db_obj=career, obj_in=career_in)
    return career

@router.delete("/{career_id}", response_model=schemas.Career)
def delete_career(
    *,
    db: Session = Depends(deps.get_db),
    career_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除职业（仅限管理员）
    """
    career = crud.career.get(db=db, id=career_id)
    if not career:
        raise HTTPException(status_code=404, detail="职业不存在")
    career = crud.career.remove(db=db, id=career_id)
    return career

@router.get("/category/{category_id}", response_model=schemas.CareerSearchResult)
def get_careers_by_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    根据分类ID获取职业
    """
    careers = crud.career.get_by_category(db=db, category_id=category_id, skip=skip, limit=limit)
    total = db.query(models.Career).filter(models.Career.category_id == category_id).count()
    return {
        "careers": careers,
        "total": total,
        "page": skip // limit + 1,
        "per_page": limit,
        "pages": (total + limit - 1) // limit
    }

@router.get("/search/", response_model=schemas.CareerSearchResult)
def search_careers(
    *,
    db: Session = Depends(deps.get_db),
    keyword: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    搜索职业
    """
    careers = crud.career.search(db=db, keyword=keyword, skip=skip, limit=limit)
    
    # 计算搜索结果总数的一种方法（这可能不是最高效的，但对于示例来说足够了）
    search_pattern = f"%{keyword}%"
    total = db.query(models.Career).filter(
        models.Career.title.ilike(search_pattern)
    ).count()
    
    return {
        "careers": careers,
        "total": total,
        "page": skip // limit + 1,
        "per_page": limit,
        "pages": (total + limit - 1) // limit
    }

@router.get("/skills/", response_model=schemas.CareerSearchResult)
def get_careers_by_skills(
    *,
    db: Session = Depends(deps.get_db),
    skills: List[str] = Query(...),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    根据技能列表获取职业
    """
    careers = crud.career.get_by_skills(db=db, skills=skills, skip=skip, limit=limit)
    
    # 由于是复杂查询，简单返回结果集的长度作为总数
    total = len(careers)
    
    return {
        "careers": careers,
        "total": total,
        "page": skip // limit + 1,
        "per_page": limit,
        "pages": (total + limit - 1) // limit
    } 