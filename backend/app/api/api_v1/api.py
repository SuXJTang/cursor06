from fastapi import APIRouter

from app.api.api_v1.endpoints import users, login, jobs, job_categories, resumes, user_profiles, careers, career_categories, career_recommendations, learning_paths, job_imports, career_imports

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(job_categories.router, prefix="/job-categories", tags=["job_categories"])
api_router.include_router(job_imports.router, prefix="/job-imports", tags=["job_imports"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(user_profiles.router, prefix="/user-profiles", tags=["user_profiles"])
api_router.include_router(careers.router, prefix="/careers", tags=["careers"])
api_router.include_router(career_categories.router, prefix="/career-categories", tags=["career_categories"])
api_router.include_router(career_recommendations.router, prefix="/career-recommendations", tags=["career_recommendations"])
api_router.include_router(career_imports.router, prefix="/career-imports", tags=["career_imports"])
api_router.include_router(learning_paths.router, prefix="/learning-paths", tags=["learning_paths"]) 