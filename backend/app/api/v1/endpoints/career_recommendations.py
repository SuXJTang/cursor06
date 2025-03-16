from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.recommendation_engine import generate_career_recommendations

router = APIRouter()

@router.get("/", response_model=schemas.CareerRecommendationList)
def get_recommendations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取当前用户的职业推荐
    """
    recommendations = crud.career_recommendation.get_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    
    # 将职业信息添加到推荐中
    result = []
    for rec in recommendations:
        career = crud.career.get(db=db, id=rec.career_id)
        if career:
            rec_with_career = schemas.CareerRecommendationWithCareer(
                **schemas.CareerRecommendation.from_orm(rec).dict(),
                career=career
            )
            result.append(rec_with_career)
    
    total = db.query(models.CareerRecommendation).filter(
        models.CareerRecommendation.user_id == current_user.id
    ).count()
    
    return {
        "recommendations": result,
        "total": total
    }

@router.get("/favorites", response_model=schemas.CareerRecommendationList)
def get_favorite_recommendations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取当前用户收藏的职业推荐
    """
    favorites = crud.career_recommendation.get_favorites(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    
    # 将职业信息添加到推荐中
    result = []
    for rec in favorites:
        career = crud.career.get(db=db, id=rec.career_id)
        if career:
            rec_with_career = schemas.CareerRecommendationWithCareer(
                **schemas.CareerRecommendation.from_orm(rec).dict(),
                career=career
            )
            result.append(rec_with_career)
    
    total = db.query(models.CareerRecommendation).filter(
        models.CareerRecommendation.user_id == current_user.id,
        models.CareerRecommendation.is_favorite == True
    ).count()
    
    return {
        "recommendations": result,
        "total": total
    }

@router.post("/generate", response_model=schemas.CareerRecommendationList)
def generate_recommendations(
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    为当前用户生成职业推荐
    """
    # 异步生成推荐
    background_tasks.add_task(
        generate_career_recommendations, 
        db=db, 
        user_id=current_user.id
    )
    
    return {
        "recommendations": [],
        "total": 0,
        "message": "正在生成推荐，请稍后查询"
    }

@router.post("/toggle-favorite", response_model=schemas.CareerRecommendation)
def toggle_favorite(
    *,
    db: Session = Depends(deps.get_db),
    favorite_request: schemas.FavoriteRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    切换收藏状态
    """
    recommendation = crud.career_recommendation.toggle_favorite(
        db=db, 
        recommendation_id=favorite_request.recommendation_id, 
        user_id=current_user.id
    )
    if not recommendation:
        raise HTTPException(status_code=404, detail="推荐不存在或不属于当前用户")
    return recommendation

@router.post("/feedback", response_model=schemas.CareerRecommendation)
def add_feedback(
    *,
    db: Session = Depends(deps.get_db),
    feedback_request: schemas.FeedbackRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    添加反馈
    """
    recommendation = crud.career_recommendation.add_feedback(
        db=db, 
        recommendation_id=feedback_request.recommendation_id, 
        user_id=current_user.id,
        feedback=feedback_request.feedback
    )
    if not recommendation:
        raise HTTPException(status_code=404, detail="推荐不存在或不属于当前用户")
    return recommendation 