from .user import user
from .user_profile import user_profile
from .job_category import job_category
from .job import job
from .job_import import job_import
from .resume import resume
from .career import career
from .career_category import career_category
from .career_recommendation import career_recommendation
from .learning_path import learning_path
from .career_import import career_import

# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate
# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item) 