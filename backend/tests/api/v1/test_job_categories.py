from typing import Dict
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.user import create_random_user, authentication_token_from_email
from app.tests.utils.utils import random_lower_string

def test_create_job_category(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试创建职位分类"""
    data = {
        "name": "IT/互联网",
        "description": "IT和互联网相关职位"
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]
    assert content["level"] == 1  # 顶级分类
    assert content["parent_id"] is None
    assert "id" in content

def test_create_sub_category(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试创建子分类"""
    # 先创建父分类
    parent_data = {
        "name": "IT/互联网",
        "description": "IT和互联网相关职位"
    }
    parent_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=parent_data,
    )
    assert parent_response.status_code == 200
    parent_id = parent_response.json()["id"]

    # 创建子分类
    data = {
        "name": "后端开发",
        "description": "后端开发相关职位",
        "parent_id": parent_id
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["parent_id"] == parent_id
    assert content["level"] == 2  # 二级分类

def test_read_job_category(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试读取职位分类"""
    # 创建分类
    data = {
        "name": "IT/互联网",
        "description": "IT和互联网相关职位"
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data,
    )
    created_category = response.json()

    # 读取分类
    response = client.get(
        f"{settings.API_V1_STR}/job-categories/{created_category['id']}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]

def test_read_job_categories(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试获取职位分类列表"""
    # 创建两个分类
    data1 = {"name": "分类1", "description": "描述1"}
    data2 = {"name": "分类2", "description": "描述2"}
    
    client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data1,
    )
    client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data2,
    )

    response = client.get(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) >= 2  # 至少包含我们创建的两个分类

def test_update_job_category(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试更新职位分类"""
    # 创建分类
    data = {
        "name": "原始名称",
        "description": "原始描述"
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data,
    )
    created_category = response.json()

    # 更新分类
    update_data = {
        "name": "更新后的名称",
        "description": "更新后的描述"
    }
    response = client.put(
        f"{settings.API_V1_STR}/job-categories/{created_category['id']}",
        headers=superuser_token_headers,
        json=update_data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == update_data["name"]
    assert content["description"] == update_data["description"]

def test_delete_job_category(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试删除职位分类"""
    # 创建分类
    data = {
        "name": "待删除分类",
        "description": "这个分类将被删除"
    }
    response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=data,
    )
    created_category = response.json()

    # 删除分类
    response = client.delete(
        f"{settings.API_V1_STR}/job-categories/{created_category['id']}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200

    # 确认分类已被删除
    response = client.get(
        f"{settings.API_V1_STR}/job-categories/{created_category['id']}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404

def test_get_category_tree(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试获取分类树结构"""
    # 创建顶级分类
    parent_data = {
        "name": "IT/互联网",
        "description": "IT和互联网相关职位"
    }
    parent_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=parent_data,
    )
    parent_id = parent_response.json()["id"]

    # 创建子分类
    child_data = {
        "name": "后端开发",
        "description": "后端开发相关职位",
        "parent_id": parent_id
    }
    client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=child_data,
    )

    # 获取分类树
    response = client.get(
        f"{settings.API_V1_STR}/job-categories/tree",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert "categories" in content
    
    # 验证树结构
    categories = content["categories"]
    found_parent = False
    for category in categories:
        if category["id"] == parent_id:
            found_parent = True
            assert len(category["children"]) == 1
            child = category["children"][0]
            assert child["name"] == child_data["name"]
            assert child["level"] == 2
    assert found_parent

def test_move_category(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试移动分类（更改父分类）"""
    # 创建两个顶级分类
    parent1_data = {"name": "分类1", "description": "描述1"}
    parent2_data = {"name": "分类2", "description": "描述2"}
    
    parent1_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=parent1_data,
    )
    parent2_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=parent2_data,
    )
    
    parent1_id = parent1_response.json()["id"]
    parent2_id = parent2_response.json()["id"]

    # 创建子分类
    child_data = {
        "name": "子分类",
        "description": "子分类描述",
        "parent_id": parent1_id
    }
    child_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=child_data,
    )
    child_id = child_response.json()["id"]

    # 移动子分类到另一个父分类下
    response = client.put(
        f"{settings.API_V1_STR}/job-categories/{child_id}/move",
        headers=superuser_token_headers,
        params={"new_parent_id": parent2_id},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["parent_id"] == parent2_id

def test_get_ancestors_and_descendants(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试获取祖先和后代分类"""
    # 创建三级分类结构
    root_data = {"name": "根分类", "description": "根分类描述"}
    root_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=root_data,
    )
    root_id = root_response.json()["id"]

    parent_data = {
        "name": "父分类",
        "description": "父分类描述",
        "parent_id": root_id
    }
    parent_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=parent_data,
    )
    parent_id = parent_response.json()["id"]

    child_data = {
        "name": "子分类",
        "description": "子分类描述",
        "parent_id": parent_id
    }
    child_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=child_data,
    )
    child_id = child_response.json()["id"]

    # 获取子分类的祖先
    response = client.get(
        f"{settings.API_V1_STR}/job-categories/{child_id}/ancestors",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    ancestors = response.json()
    assert len(ancestors) == 2  # 应该有两个祖先：父分类和根分类

    # 获取根分类的后代
    response = client.get(
        f"{settings.API_V1_STR}/job-categories/{root_id}/descendants",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    descendants = response.json()
    assert len(descendants) == 2  # 应该有两个后代：父分类和子分类

def test_delete_category_with_children(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """测试删除带有子分类的分类（应该失败）"""
    # 创建父分类
    parent_data = {"name": "父分类", "description": "父分类描述"}
    parent_response = client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=parent_data,
    )
    parent_id = parent_response.json()["id"]

    # 创建子分类
    child_data = {
        "name": "子分类",
        "description": "子分类描述",
        "parent_id": parent_id
    }
    client.post(
        f"{settings.API_V1_STR}/job-categories/",
        headers=superuser_token_headers,
        json=child_data,
    )

    # 尝试删除父分类（应该失败）
    response = client.delete(
        f"{settings.API_V1_STR}/job-categories/{parent_id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 400  # 因为有子分类，所以不能删除 