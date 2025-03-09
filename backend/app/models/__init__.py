from .user import User
from .user_profile import UserProfile
from .career import Career
from .career_category import CareerCategory
from .career_recommendation import CareerRecommendation
from .career_import import CareerImport
from .job import Job
from .job_category import JobCategory
from .job_import import JobImport
from .resume import Resume
from .job_application import JobApplication
from .skill_assessment import SkillAssessment
from .learning_path import LearningPath

# 导出所有模型
__all__ = [
    "User",
    "UserProfile",
    "Career",
    "CareerCategory",
    "CareerRecommendation",
    "CareerImport",
    "Job",
    "JobCategory",
    "JobImport",
    "Resume",
    "JobApplication",
    "SkillAssessment",
    "LearningPath"
] 