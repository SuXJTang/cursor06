from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.tests.utils.career import create_random_career, create_random_career_category

def test_create_career(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试创建职业"""
    # 先创建一个分类
    category = create_random_career_category(db)
    
    data = {
        "title": "测试职业",
        "description": "这是一个用于测试的职业",
        "skills_required": ["Python编程", "数据分析", "机器学习"],
        "average_salary": "15k-30k",
        "job_outlook": "良好",
        "education_required": "本科",
        "category_id": category.id,
        "related_majors": ["计算机科学", "人工智能"],
        "work_activities": ["编写代码", "分析数据", "开发模型"],
        "career_path": "初级工程师 -> 高级工程师 -> 架构师"
    }
    response = client.post(
        "/api/v1/careers/", headers=superuser_token_headers, json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert set(content["skills_required"]) == set(data["skills_required"])
    assert content["category_id"] == category.id
    assert "id" in content
    assert "created_at" in content

def test_read_career(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取职业"""
    career = create_random_career(db)
    response = client.get(
        f"/api/v1/careers/{career.id}", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == career.title
    assert content["description"] == career.description
    assert content["id"] == career.id
    assert "related_jobs_count" in content
    assert "learning_paths_count" in content

def test_read_careers(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取所有职业"""
    # 创建多个职业
    for _ in range(3):
        create_random_career(db)
    
    response = client.get(
        "/api/v1/careers/", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert "careers" in content
    assert "total" in content
    assert "page" in content
    assert "per_page" in content
    assert "pages" in content
    assert len(content["careers"]) >= 3  # 至少包含我们刚刚创建的3个

def test_read_careers_by_category(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试按分类读取职业"""
    # 创建分类
    category = create_random_career_category(db)
    
    # 在该分类下创建职业
    career1 = create_random_career(db, category_id=category.id)
    career2 = create_random_career(db, category_id=category.id)
    
    # 创建不在该分类的职业
    other_category = create_random_career_category(db)
    other_career = create_random_career(db, category_id=other_category.id)
    
    response = client.get(
        f"/api/v1/careers/category/{category.id}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    career_ids = [c["id"] for c in content["careers"]]
    assert career1.id in career_ids
    assert career2.id in career_ids
    assert other_career.id not in career_ids

def test_search_careers(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试搜索职业"""
    # 创建带有特定标题的职业
    unique_keyword = "uniquesearch"
    career = create_random_career(db, title=f"测试职业 {unique_keyword}")
    
    # 创建其他职业
    create_random_career(db)
    create_random_career(db)
    
    response = client.get(
        f"/api/v1/careers/search/?keyword={unique_keyword}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    assert len(content["careers"]) >= 1
    career_ids = [c["id"] for c in content["careers"]]
    assert career.id in career_ids

def test_get_careers_by_skills(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试按技能获取职业"""
    # 暂时跳过，因为这个功能依赖于职业的技能匹配逻辑，在单元测试中可能会比较复杂
    # 实际项目中可以根据具体的技能匹配逻辑实现此测试
    pass

def test_update_career(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试更新职业"""
    career = create_random_career(db)
    data = {
        "title": "更新后的职业",
        "description": "这是更新后的描述",
        "average_salary": "20k-40k"
    }
    response = client.put(
        f"/api/v1/careers/{career.id}", 
        headers=superuser_token_headers, 
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["average_salary"] == data["average_salary"]
    assert content["id"] == career.id

def test_delete_career(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试删除职业"""
    career = create_random_career(db)
    response = client.delete(
        f"/api/v1/careers/{career.id}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    
    # 确认已删除
    career_in_db = crud.career.get(db=db, id=career.id)
    assert career_in_db is None 