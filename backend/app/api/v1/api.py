from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    user_profiles,
    resumes,
    job_categories,
    jobs,
    job_imports,
    careers,
    career_categories,
    career_recommendations,
    learning_paths,
    career_imports
)

api_router = APIRouter()

# 注册用户路由
api_router.include_router(users.router, prefix="/users", tags=["用户"])

# 注册认证相关路由
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])

# 注册用户个人资料路由
api_router.include_router(user_profiles.router, prefix="/user-profiles", tags=["用户资料"])

# 注册简历管理路由
api_router.include_router(resumes.router, prefix="/resumes", tags=["简历"])

# 注册职位类别路由
api_router.include_router(job_categories.router, prefix="/job-categories", tags=["工作分类"])

# 注册职位路由
api_router.include_router(jobs.router, prefix="/jobs", tags=["工作"])

# 注册职位导入路由
api_router.include_router(job_imports.router, prefix="/job-imports", tags=["工作导入"])

# 注册职业路由
api_router.include_router(careers.router, prefix="/careers", tags=["职业"])

# 注册职业分类路由
api_router.include_router(career_categories.router, prefix="/career-categories", tags=["职业分类"])

# 注册职业推荐路由
api_router.include_router(career_recommendations.router, prefix="/career-recommendations", tags=["职业推荐"])

# 注册学习路径路由
api_router.include_router(learning_paths.router, prefix="/learning-paths", tags=["学习路径"])

# 注册职业导入路由
api_router.include_router(career_imports.router, prefix="/career-imports", tags=["职业导入"])