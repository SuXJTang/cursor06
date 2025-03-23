from fastapi import APIRouter
from app.api.v1.endpoints import career_recommendations

api_router = APIRouter()

# 注册各个API路径
api_router.include_router(
    career_recommendations.router,
    prefix='/career-recommendations',
    tags=['career_recommendations']
)
