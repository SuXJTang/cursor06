from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.LearningPath])
def get_learning_paths(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取所有学习路径
    """
    learning_paths = crud.learning_path.get_multi(db, skip=skip, limit=limit)
    return learning_paths

@router.get("/popular", response_model=List[schemas.LearningPath])
def get_popular_learning_paths(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 10,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取热门学习路径
    """
    learning_paths = crud.learning_path.get_popular_paths(db, skip=skip, limit=limit)
    return learning_paths

@router.get("/{path_id}", response_model=schemas.LearningPath)
def get_learning_path(
    *,
    db: Session = Depends(deps.get_db),
    path_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    根据ID获取指定学习路径
    """
    learning_path = crud.learning_path.get(db=db, id=path_id)
    if not learning_path:
        raise HTTPException(status_code=404, detail="学习路径不存在")
    
    # 增加浏览次数
    crud.learning_path.increment_view_count(db=db, path_id=path_id)
    
    return learning_path

@router.get("/career/{career_id}", response_model=List[schemas.LearningPath])
def get_learning_paths_by_career(
    *,
    db: Session = Depends(deps.get_db),
    career_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取指定职业的学习路径
    """
    learning_paths = crud.learning_path.get_by_career(db=db, career_id=career_id, skip=skip, limit=limit)
    return learning_paths

@router.get("/difficulty/{difficulty}", response_model=List[schemas.LearningPath])
def get_learning_paths_by_difficulty(
    *,
    db: Session = Depends(deps.get_db),
    difficulty: str,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    根据难度获取学习路径
    """
    learning_paths = crud.learning_path.get_by_difficulty(db=db, difficulty=difficulty, skip=skip, limit=limit)
    return learning_paths

@router.get("/search/", response_model=List[schemas.LearningPath])
def search_learning_paths(
    *,
    db: Session = Depends(deps.get_db),
    keyword: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    搜索学习路径
    """
    learning_paths = crud.learning_path.search(db=db, keyword=keyword, skip=skip, limit=limit)
    return learning_paths

@router.post("/", response_model=schemas.LearningPath)
def create_learning_path(
    *,
    db: Session = Depends(deps.get_db),
    learning_path_in: schemas.LearningPathCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新学习路径（仅限管理员）
    """
    learning_path = crud.learning_path.create(db=db, obj_in=learning_path_in)
    return learning_path

@router.put("/{path_id}", response_model=schemas.LearningPath)
def update_learning_path(
    *,
    db: Session = Depends(deps.get_db),
    path_id: int,
    learning_path_in: schemas.LearningPathUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新学习路径（仅限管理员）
    """
    learning_path = crud.learning_path.get(db=db, id=path_id)
    if not learning_path:
        raise HTTPException(status_code=404, detail="学习路径不存在")
    learning_path = crud.learning_path.update(db=db, db_obj=learning_path, obj_in=learning_path_in)
    return learning_path

@router.delete("/{path_id}", response_model=schemas.LearningPath)
def delete_learning_path(
    *,
    db: Session = Depends(deps.get_db),
    path_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除学习路径（仅限管理员）
    """
    learning_path = crud.learning_path.get(db=db, id=path_id)
    if not learning_path:
        raise HTTPException(status_code=404, detail="学习路径不存在")
    learning_path = crud.learning_path.remove(db=db, id=path_id)
    return learning_path 