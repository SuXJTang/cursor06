import os
from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core.config import settings
from app.utils.excel import create_template
from app.tests.utils.user import create_random_user, authentication_token_from_email, get_superuser_id
from app.tests.utils.utils import random_lower_string
from app.schemas.job_import import JobImportCreate, JobImportUpdate

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

def test_create_job_import(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试创建职业导入记录
    """
    data = {
        "filename": "test_import.csv",
        "status": "pending",
        "total_count": 100,
        "success_count": 0,
        "failed_count": 0,
        "error_details": None,
        "importer_id": get_superuser_id()  # 设置导入者ID为超级管理员ID
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-imports/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["filename"] == data["filename"]
    assert content["status"] == data["status"]
    assert content["total_count"] == data["total_count"]
    assert content["success_count"] == data["success_count"]
    assert content["failed_count"] == data["failed_count"]
    assert content["importer_id"] == data["importer_id"]

def test_read_job_import(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试读取职业导入记录
    """
    # 先创建一个导入记录
    job_import_in = JobImportCreate(
        filename="test_import.csv",
        status="pending",
        total_count=100,
        success_count=0,
        failed_count=0,
        importer_id=get_superuser_id()  # 设置导入者ID为超级管理员ID
    )
    job_import = crud.job_import.create(db=db, obj_in=job_import_in)

    response = client.get(
        f"{settings.API_V1_STR}/job-imports/{job_import.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["filename"] == job_import_in.filename
    assert content["status"] == job_import_in.status
    assert content["id"] == job_import.id

def test_read_job_imports(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试获取职业导入记录列表
    """
    # 创建3个导入记录
    for i in range(3):
        job_import_in = JobImportCreate(
            filename=f"test_import_{i}.csv",
            status="pending",
            total_count=100,
            success_count=0,
            failed_count=0,
            importer_id=get_superuser_id()  # 设置导入者ID为超级管理员ID
        )
        crud.job_import.create(db=db, obj_in=job_import_in)

    response = client.get(
        f"{settings.API_V1_STR}/job-imports/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) >= 3

def test_update_job_import(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试更新职业导入记录
    """
    # 先创建一个导入记录
    job_import_in = JobImportCreate(
        filename="test_import.csv",
        status="pending",
        total_count=100,
        success_count=0,
        failed_count=0,
        importer_id=get_superuser_id()  # 设置导入者ID为超级管理员ID
    )
    job_import = crud.job_import.create(db=db, obj_in=job_import_in)

    data = {
        "status": "completed",
        "success_count": 95,
        "error_count": 5,
        "error_message": "5 records failed to import"
    }
    response = client.put(
        f"{settings.API_V1_STR}/job-imports/{job_import.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["status"] == data["status"]
    assert content["success_count"] == data["success_count"]
    assert content["error_count"] == data["error_count"]
    assert content["error_message"] == data["error_message"]

def test_delete_job_import(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试删除职业导入记录
    """
    # 先创建一个导入记录
    job_import_in = JobImportCreate(
        filename="test_import.csv",
        status="pending",
        total_count=100,
        success_count=0,
        failed_count=0,
        importer_id=get_superuser_id()  # 设置导入者ID为超级管理员ID
    )
    job_import = crud.job_import.create(db=db, obj_in=job_import_in)

    response = client.delete(
        f"{settings.API_V1_STR}/job-imports/{job_import.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 204

    # 确认记录已被删除
    response = client.get(
        f"{settings.API_V1_STR}/job-imports/{job_import.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404

def test_create_job_import_by_normal_user(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试普通用户创建职业导入记录（应该被禁止）
    """
    data = {
        "file_url": "https://example.com/jobs.csv",
        "status": "pending",
        "total_count": 100,
        "success_count": 0,
        "error_count": 0
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-imports/",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403

def test_update_job_import_status(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """
    测试更新职业导入记录状态
    """
    # 先创建一个导入记录
    job_import_in = JobImportCreate(
        filename="test_import.csv",
        status="pending",
        total_count=100,
        success_count=0,
        failed_count=0,
        importer_id=get_superuser_id()  # 设置导入者ID为超级管理员ID
    )
    job_import = crud.job_import.create(db=db, obj_in=job_import_in)

    data = {
        "status": "processing",
        "success_count": 50,
        "error_count": 0
    }
    response = client.patch(
        f"{settings.API_V1_STR}/job-imports/{job_import.id}/status",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["status"] == data["status"]
    assert content["success_count"] == data["success_count"]
    assert content["error_count"] == data["error_count"] 