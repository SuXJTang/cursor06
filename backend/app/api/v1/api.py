from fastapi import APIRouter
from app.api.v1.endpoints import users, auth, user_profiles, resumes, job_categories, jobs, job_imports

api_router = APIRouter()

# 注册用户路由
api_router.include_router(users.router, prefix="/users", tags=["users"])

# 注册认证相关路由
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# 注册用户个人资料路由
api_router.include_router(user_profiles.router, prefix="/profiles", tags=["profiles"])

# 注册简历管理路由
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])

# 注册职位类别路由
api_router.include_router(job_categories.router, prefix="/job-categories", tags=["job-categories"])

# 注册职位路由
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])

# 注册职位导入路由
api_router.include_router(job_imports.router, prefix="/job-imports", tags=["job-imports"])

# 后续可以添加更多路由
# api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
# api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"]) 