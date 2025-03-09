from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.tests.utils.utils import get_superuser_token_headers


def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    """
    获取用户认证Headers
    """
    data = {"username": email, "password": password}

    r = client.post(f"{settings.API_V1_STR}/auth/login", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def create_random_user(db: Session) -> User:
    """
    创建随机用户
    """
    email = f"{settings.EMAIL_TEST_USER}+{crud.user.get_count(db)}@example.com"
    password = settings.EMAIL_TEST_USER_PASSWORD
    user_in = UserCreate(username=email, email=email, password=password)
    user = crud.user.create(db=db, obj_in=user_in)
    return user


def authentication_token_from_email(
    *, client: TestClient, email: str, db: Session
) -> Dict[str, str]:
    """
    从邮箱获取认证Token
    """
    password = settings.EMAIL_TEST_USER_PASSWORD
    user = crud.user.get_by_email(db, email=email)
    if not user:
        user_in_create = UserCreate(
            username=email,
            email=email,
            password=password,
            is_active=True,
            is_verified=True,
        )
        crud.user.create(db, obj_in=user_in_create)
    return user_authentication_headers(client=client, email=email, password=password) 