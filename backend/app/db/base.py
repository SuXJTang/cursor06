# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.user_profile import UserProfile  # noqa
from app.models.career import Career  # noqa
from app.models.career_category import CareerCategory  # noqa
from app.models.career_recommendation import CareerRecommendation  # noqa
from app.models.career_import import CareerImport  # noqa
from app.models.job import Job  # noqa
from app.models.job_category import JobCategory  # noqa
from app.models.job_import import JobImport  # noqa 