from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.tests.utils.career import create_random_career_category

def test_create_career_category(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试创建职业分类"""
    data = {
        "name": "测试职业分类",
        "description": "这是一个用于测试的职业分类",
        "parent_id": None
    }
    response = client.post(
        "/api/v1/career-categories/", headers=superuser_token_headers, json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]
    assert "id" in content
    assert "created_at" in content

def test_read_career_category(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取职业分类"""
    category = create_random_career_category(db)
    response = client.get(
        f"/api/v1/career-categories/{category.id}", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == category.name
    assert content["description"] == category.description
    assert content["id"] == category.id

def test_read_career_categories(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取所有职业分类"""
    # 创建多个职业分类
    for _ in range(3):
        create_random_career_category(db)
    
    response = client.get(
        "/api/v1/career-categories/", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 3  # 至少包含我们刚刚创建的3个

def test_read_root_categories(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取根职业分类"""
    # 创建根分类
    root_category = create_random_career_category(db, parent_id=None)
    
    # 创建子分类
    child_category = create_random_career_category(db, parent_id=root_category.id)
    
    response = client.get(
        "/api/v1/career-categories/roots", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    categories = response.json()
    
    # 确保根分类在返回结果中
    root_ids = [cat["id"] for cat in categories]
    assert root_category.id in root_ids
    
    # 确保子分类不在返回结果中
    assert child_category.id not in root_ids

def test_read_subcategories(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取子职业分类"""
    # 创建根分类
    root_category = create_random_career_category(db, parent_id=None)
    
    # 创建子分类
    child_category1 = create_random_career_category(db, parent_id=root_category.id)
    child_category2 = create_random_career_category(db, parent_id=root_category.id)
    
    response = client.get(
        f"/api/v1/career-categories/{root_category.id}/subcategories", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    subcategories = response.json()
    
    subcategory_ids = [cat["id"] for cat in subcategories]
    assert child_category1.id in subcategory_ids
    assert child_category2.id in subcategory_ids

def test_read_category_tree(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取职业分类树"""
    # 创建根分类
    root_category = create_random_career_category(db, parent_id=None)
    
    # 创建子分类
    child_category = create_random_career_category(db, parent_id=root_category.id)
    
    # 创建孙分类
    grandchild_category = create_random_career_category(db, parent_id=child_category.id)
    
    response = client.get(
        f"/api/v1/career-categories/{root_category.id}/tree", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    tree = response.json()
    
    assert tree["id"] == root_category.id
    assert tree["name"] == root_category.name
    assert len(tree["subcategories"]) == 1
    
    child_tree = tree["subcategories"][0]
    assert child_tree["id"] == child_category.id
    assert child_tree["name"] == child_category.name
    assert len(child_tree["subcategories"]) == 1
    
    grandchild_tree = child_tree["subcategories"][0]
    assert grandchild_tree["id"] == grandchild_category.id
    assert grandchild_tree["name"] == grandchild_category.name

def test_update_career_category(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试更新职业分类"""
    category = create_random_career_category(db)
    data = {
        "name": "更新后的职业分类",
        "description": "这是更新后的描述"
    }
    response = client.put(
        f"/api/v1/career-categories/{category.id}", 
        headers=superuser_token_headers, 
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]
    assert content["id"] == category.id

def test_delete_career_category(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试删除职业分类"""
    category = create_random_career_category(db)
    response = client.delete(
        f"/api/v1/career-categories/{category.id}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    
    # 确认已删除
    category_in_db = crud.career_category.get(db=db, id=category.id)
    assert category_in_db is None 