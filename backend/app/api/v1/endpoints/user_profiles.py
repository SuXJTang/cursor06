from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import user_profile as crud_user_profile
from app.models.user import User
from app.schemas.user_profile import UserProfile, UserProfileCreate, UserProfileUpdate

router = APIRouter()

@router.get("/me", response_model=UserProfile)
def get_my_profile(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    获取当前用户的个人资料
    """
    profile = crud_user_profile.get_by_user_id(db, user_id=current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="个人资料不存在"
        )
    return profile

@router.post("/me", response_model=UserProfile)
def create_my_profile(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    profile_in: UserProfileCreate
) -> Any:
    """
    创建当前用户的个人资料
    """
    # 检查是否已存在个人资料
    profile = crud_user_profile.get_by_user_id(db, user_id=current_user.id)
    if profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="个人资料已存在"
        )
    
    # 创建个人资料
    profile_in.user_id = current_user.id
    try:
        profile = crud_user_profile.create(db, obj_in=profile_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return profile

@router.put("/me", response_model=UserProfile)
def update_my_profile(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    profile_in: UserProfileUpdate
) -> Any:
    """
    更新当前用户的个人资料
    """
    profile = crud_user_profile.get_by_user_id(db, user_id=current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="个人资料不存在"
        )
    
    try:
        profile = crud_user_profile.update(db, db_obj=profile, obj_in=profile_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return profile

@router.put("/me/avatar", response_model=UserProfile)
def update_my_avatar(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    avatar_url: str
) -> Any:
    """
    更新当前用户的头像
    """
    profile = crud_user_profile.get_by_user_id(db, user_id=current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="个人资料不存在"
        )
    
    try:
        profile = crud_user_profile.update_avatar(
            db, profile=profile, avatar_url=avatar_url
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return profile

@router.put("/me/work-info", response_model=UserProfile)
def update_my_work_info(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    work_years: int,
    current_status: str,
    skills: list[str],
    skill_tags: list[str]
) -> Any:
    """
    更新当前用户的工作信息
    """
    profile = crud_user_profile.get_by_user_id(db, user_id=current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="个人资料不存在"
        )
    
    try:
        profile = crud_user_profile.update_work_info(
            db,
            profile=profile,
            work_years=work_years,
            current_status=current_status,
            skills=skills,
            skill_tags=skill_tags
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return profile 