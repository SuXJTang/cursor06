from typing import Dict

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.utils import random_email, random_lower_string
from app.schemas.user import UserCreate

def test_register_user(
    client: TestClient, db: Session
) -> None:
    """测试用户注册"""
    username = random_lower_string()
    email = random_email()
    password = random_lower_string()
    data = {
        "email": email,
        "username": username,
        "password": password,
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["email"] == email
    assert content["username"] == username
    assert "id" in content

def test_register_existing_username(
    client: TestClient, db: Session
) -> None:
    """测试注册已存在的用户名"""
    username = random_lower_string()
    email = random_email()
    password = random_lower_string()
    user_in_create = UserCreate(
        username=username,
        email=email,
        password=password
    )
    crud.user.create(db, obj_in=user_in_create)
    
    data = {
        "email": random_email(),
        "username": username,  # 使用相同的用户名
        "password": random_lower_string(),
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert "用户名已存在" in content["detail"]

def test_register_existing_email(
    client: TestClient, db: Session
) -> None:
    """测试注册已存在的邮箱"""
    username = random_lower_string()
    email = random_email()
    password = random_lower_string()
    user_in_create = UserCreate(
        username=username,
        email=email,
        password=password
    )
    crud.user.create(db, obj_in=user_in_create)
    
    data = {
        "email": email,  # 使用相同的邮箱
        "username": random_lower_string(),
        "password": random_lower_string(),
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert "邮箱已被注册" in content["detail"]

def test_login_success(
    client: TestClient, db: Session
) -> None:
    """测试登录成功"""
    username = random_lower_string()
    email = random_email()
    password = random_lower_string()
    user_in_create = UserCreate(
        username=username,
        email=email,
        password=password
    )
    crud.user.create(db, obj_in=user_in_create)
    
    data = {
        "username": email,
        "password": password,
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data=data,  # 注意：这里使用data而不是json
    )
    assert response.status_code == 200
    content = response.json()
    assert "access_token" in content
    assert content["token_type"] == "bearer"

def test_login_wrong_password(
    client: TestClient, db: Session
) -> None:
    """测试密码错误"""
    username = random_lower_string()
    email = random_email()
    password = random_lower_string()
    user_in_create = UserCreate(
        username=username,
        email=email,
        password=password
    )
    crud.user.create(db, obj_in=user_in_create)
    
    data = {
        "username": email,
        "password": "wrong_password",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data=data,
    )
    assert response.status_code == 401
    content = response.json()
    assert "邮箱或密码错误" in content["detail"]

def test_login_inactive_user(
    client: TestClient, db: Session
) -> None:
    """测试未激活用户登录"""
    username = random_lower_string()
    email = random_email()
    password = random_lower_string()
    user_in_create = UserCreate(
        username=username,
        email=email,
        password=password,
        is_active=False
    )
    crud.user.create(db, obj_in=user_in_create)
    
    data = {
        "username": email,
        "password": password,
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert "用户未激活" in content["detail"] 