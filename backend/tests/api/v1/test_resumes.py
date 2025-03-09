from typing import Dict

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.db.session import SessionLocal
from app.tests.utils.resume import create_random_resume
from app.tests.utils.user import create_random_user, authentication_token_from_email

def test_create_resume(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试创建简历
    """
    data = {
        "title": "我的简历",
        "content": "这是一份简历的内容",
        "is_active": True
    }
    response = client.post(
        f"{settings.API_V1_STR}/resumes/me",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["content"] == data["content"]
    assert content["is_active"] == data["is_active"]
    assert "id" in content

def test_read_resumes(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试读取简历列表
    """
    user = create_random_user(db)
    token_headers = authentication_token_from_email(client=client, email=user.email, db=db)
    resume = create_random_resume(db, user_id=user.id)
    response = client.get(
        f"{settings.API_V1_STR}/resumes/me",
        headers=token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)
    assert len(content) > 0
    assert content[0]["title"] == resume.title
    assert content[0]["content"] == resume.content
    assert content[0]["is_active"] == resume.is_active
    assert content[0]["id"] == resume.id

def test_update_resume(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试更新简历
    """
    user = create_random_user(db)
    token_headers = authentication_token_from_email(client=client, email=user.email, db=db)
    resume = create_random_resume(db, user_id=user.id)
    data = {
        "title": "更新后的简历",
        "content": "这是更新后的简历内容",
        "is_active": True
    }
    response = client.put(
        f"{settings.API_V1_STR}/resumes/me/{resume.id}",
        headers=token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["content"] == data["content"]
    assert content["is_active"] == data["is_active"]
    assert content["id"] == resume.id

def test_delete_resume(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试删除简历
    """
    user = create_random_user(db)
    token_headers = authentication_token_from_email(client=client, email=user.email, db=db)
    resume = create_random_resume(db, user_id=user.id)
    resume_id = resume.id
    response = client.delete(
        f"{settings.API_V1_STR}/resumes/me/{resume_id}",
        headers=token_headers,
    )
    assert response.status_code == 204
    
    # 使用新的会话检查删除结果
    new_db = SessionLocal()
    try:
        resume_in_db = crud.resume.get(db=new_db, id=resume_id)
        assert resume_in_db is None
    finally:
        new_db.close()

def test_update_resume_unauthorized(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试未授权更新简历
    """
    other_user = create_random_user(db)
    resume = create_random_resume(db, user_id=other_user.id)
    data = {
        "title": "更新后的简历",
        "content": "这是更新后的简历内容",
        "is_active": True
    }
    response = client.put(
        f"{settings.API_V1_STR}/resumes/me/{resume.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403

def test_delete_resume_unauthorized(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试未授权删除简历
    """
    other_user = create_random_user(db)
    resume = create_random_resume(db, user_id=other_user.id)
    response = client.delete(
        f"{settings.API_V1_STR}/resumes/me/{resume.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403

def test_update_resume_file(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试更新简历文件
    """
    user = create_random_user(db)
    token_headers = authentication_token_from_email(client=client, email=user.email, db=db)
    resume = create_random_resume(db, user_id=user.id)
    data = {
        "file_url": "https://example.com/resume.pdf"
    }
    response = client.put(
        f"{settings.API_V1_STR}/resumes/me/{resume.id}/file",
        headers=token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["file_url"] == data["file_url"]
    assert content["id"] == resume.id

def test_update_resume_status(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试更新简历状态
    """
    user = create_random_user(db)
    token_headers = authentication_token_from_email(client=client, email=user.email, db=db)
    resume = create_random_resume(db, user_id=user.id)
    data = {
        "status": "submitted"
    }
    response = client.put(
        f"{settings.API_V1_STR}/resumes/me/{resume.id}/status",
        headers=token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["status"] == data["status"]
    assert content["id"] == resume.id

def test_list_resumes(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试列出所有简历
    """
    # 创建一个已验证的用户
    user = create_random_user(db)
    user.is_verified = True
    db.commit()

    # 创建测试简历
    resume1 = create_random_resume(db, user_id=user.id)
    resume2 = create_random_resume(db, user_id=user.id)

    token_headers = authentication_token_from_email(client=client, email=user.email, db=db)
    response = client.get(
        f"{settings.API_V1_STR}/resumes/me",
        headers=token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)
    assert len(content) >= 2
    assert any(r["id"] == resume1.id for r in content)
    assert any(r["id"] == resume2.id for r in content) 