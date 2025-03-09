import os
from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core.config import settings
from app.utils.excel import create_template
from app.tests.utils.user import create_random_user, authentication_token_from_email
from app.tests.utils.utils import random_lower_string

# 在测试开始前生成模板文件
create_template("test_template.xlsx")

def test_download_template(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试下载模板"""
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/template",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
    # 保存文件用于后续测试
    with open("test_template.xlsx", "wb") as f:
        f.write(response.content)

def test_download_template_normal_user(
    client: TestClient, normal_user_token_headers: dict
) -> None:
    """测试普通用户无法下载模板"""
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/template",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403

def test_upload_invalid_file(
    client: TestClient, superuser_token_headers: dict
) -> None:
    """测试上传无效文件"""
    # 创建测试文件
    with open("test.txt", "w") as f:
        f.write("test")

    with open("test.txt", "rb") as f:
        response = client.post(
            f"{settings.API_V1_STR}/job-imports/upload",
            headers=superuser_token_headers,
            files={"file": ("test.txt", f, "text/plain")},
        )
    
    assert response.status_code == 400
    assert "只支持.xlsx格式的Excel文件" in response.json()["detail"]
    
    # 清理测试文件
    os.remove("test.txt")

def test_upload_valid_file(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试上传有效文件"""
    # 先下载模板
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/template",
        headers=superuser_token_headers,
    )
    with open("test_import.xlsx", "wb") as f:
        f.write(response.content)

    # 上传文件
    with open("test_import.xlsx", "rb") as f:
        response = client.post(
            f"{settings.API_V1_STR}/job-imports/upload",
            headers=superuser_token_headers,
            files={"file": ("test_import.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )
    
    assert response.status_code == 200
    result = response.json()
    assert result["filename"] == "test_import.xlsx"
    assert result["status"] == "pending"
    
    # 清理测试文件
    os.remove("test_import.xlsx")

def test_read_import_records(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试获取导入记录列表"""
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/records",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    result = response.json()
    assert isinstance(result, list)

def test_read_import_record(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试获取导入记录详情"""
    # 先创建一条导入记录
    with open("test_template.xlsx", "rb") as f:
        response = client.post(
            f"{settings.API_V1_STR}/job-imports/upload",
            headers=superuser_token_headers,
            files={"file": ("test_template.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )
    
    import_id = response.json()["id"]
    
    # 获取详情
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/records/{import_id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    result = response.json()
    assert result["id"] == import_id

def test_read_nonexistent_import_record(
    client: TestClient, superuser_token_headers: dict
) -> None:
    """测试获取不存在的导入记录"""
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/records/99999",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404

def test_read_others_import_record(
    client: TestClient, normal_user_token_headers: dict, superuser_token_headers: dict, db: Session
) -> None:
    """测试获取其他用户的导入记录"""
    # 超级管理员创建导入记录
    with open("test_template.xlsx", "rb") as f:
        response = client.post(
            f"{settings.API_V1_STR}/job-imports/upload",
            headers=superuser_token_headers,
            files={"file": ("test_template.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )
    
    import_id = response.json()["id"]
    
    # 普通用户尝试获取
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/records/{import_id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403

def test_cleanup():
    """清理测试文件"""
    if os.path.exists("test_template.xlsx"):
        os.remove("test_template.xlsx") 