from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.tests.utils.utils import random_email, random_lower_string

def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    """获取用户认证头"""
    data = {"username": email, "password": password}
    r = client.post("/api/v1/auth/login", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers

def create_random_user(db: Session) -> User:
    """创建随机用户"""
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    user_in = UserCreate(username=username, email=email, password=password)
    user = crud.user.create(db=db, obj_in=user_in)
    return user

def create_random_superuser(db: Session) -> User:
    """创建随机超级用户"""
    email = random_email()
    password = random_lower_string()
    username = random_lower_string()
    user_in = UserCreate(
        username=username,
        email=email,
        password=password,
        is_superuser=True,
        is_active=True
    )
    user = crud.user.create(db=db, obj_in=user_in)
    return user

def authentication_token_from_email(
    *, client: TestClient, email: str, db: Session
) -> Dict[str, str]:
    """根据邮箱获取认证令牌"""
    password = random_lower_string()
    user = crud.user.get_by_email(db, email=email)
    if not user:
        username = random_lower_string()
        user_in_create = UserCreate(username=username, email=email, password=password)
        user = crud.user.create(db, obj_in=user_in_create)
    else:
        user_in_update = {"password": password}
        user = crud.user.update(db, db_obj=user, obj_in=user_in_update)

    return user_authentication_headers(client=client, email=email, password=password)

def get_superuser_id() -> int:
    """获取超级管理员ID"""
    return 2  # 在测试数据库中，超级管理员的ID是2 