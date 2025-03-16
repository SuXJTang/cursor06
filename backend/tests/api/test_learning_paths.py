from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.tests.utils.career import create_random_career, create_learning_path

def test_create_learning_path(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试创建学习路径"""
    # 先创建一个职业
    career = create_random_career(db)
    
    data = {
        "title": "测试学习路径",
        "description": "这是一个用于测试的学习路径",
        "difficulty": "中级",
        "career_id": career.id,
        "estimated_time": "6个月",
        "content": "步骤1: 学习基础知识\n步骤2: 实践项目\n步骤3: 深入理解",
        "resources": "资源1: 在线课程\n资源2: 书籍推荐",
        "prerequisites": "需要具备基础编程知识",
        "view_count": 0
    }
    response = client.post(
        "/api/v1/learning-paths/", headers=superuser_token_headers, json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["difficulty"] == data["difficulty"]
    assert content["career_id"] == career.id
    assert "id" in content
    assert "created_at" in content

def test_read_learning_path(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取学习路径"""
    # 先创建一个职业
    career = create_random_career(db)
    # 创建学习路径
    learning_path = create_learning_path(db, career_id=career.id)
    
    response = client.get(
        f"/api/v1/learning-paths/{learning_path.id}", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == learning_path.title
    assert content["description"] == learning_path.description
    assert content["id"] == learning_path.id
    assert content["career_id"] == career.id
    assert content["view_count"] >= learning_path.view_count  # 应当增加了浏览次数

def test_read_learning_paths(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试读取所有学习路径"""
    # 创建职业
    career = create_random_career(db)
    # 创建多个学习路径
    for _ in range(3):
        create_learning_path(db, career_id=career.id)
    
    response = client.get(
        "/api/v1/learning-paths/", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) >= 3  # 至少包含我们刚刚创建的3个

def test_get_popular_learning_paths(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试获取热门学习路径"""
    # 创建职业
    career = create_random_career(db)
    # 创建多个学习路径，设置不同的浏览次数
    for view_count in [10, 50, 100]:
        path = create_learning_path(db, career_id=career.id)
        # 更新浏览次数
        path.view_count = view_count
        db.commit()
    
    response = client.get(
        "/api/v1/learning-paths/popular", headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    # 确保返回的路径按浏览次数降序排列
    for i in range(len(content) - 1):
        assert content[i]["view_count"] >= content[i+1]["view_count"]

def test_get_learning_paths_by_career(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试按职业获取学习路径"""
    # 创建两个职业
    career1 = create_random_career(db)
    career2 = create_random_career(db)
    
    # 为第一个职业创建路径
    path1 = create_learning_path(db, career_id=career1.id)
    path2 = create_learning_path(db, career_id=career1.id)
    
    # 为第二个职业创建路径
    path3 = create_learning_path(db, career_id=career2.id)
    
    response = client.get(
        f"/api/v1/learning-paths/career/{career1.id}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    path_ids = [p["id"] for p in content]
    assert path1.id in path_ids
    assert path2.id in path_ids
    assert path3.id not in path_ids  # 确保不属于该职业的路径不在结果中

def test_get_learning_paths_by_difficulty(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试按难度获取学习路径"""
    # 创建职业
    career = create_random_career(db)
    
    # 创建不同难度的路径
    path1 = create_learning_path(db, career_id=career.id, difficulty="初级")
    path2 = create_learning_path(db, career_id=career.id, difficulty="中级")
    path3 = create_learning_path(db, career_id=career.id, difficulty="高级")
    
    response = client.get(
        "/api/v1/learning-paths/difficulty/中级", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    path_ids = [p["id"] for p in content]
    assert path1.id not in path_ids
    assert path2.id in path_ids
    assert path3.id not in path_ids

def test_search_learning_paths(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试搜索学习路径"""
    # 创建职业
    career = create_random_career(db)
    
    # 创建带有特定关键词的路径
    unique_keyword = "uniquepathsearch"
    path = create_learning_path(db, career_id=career.id)
    path.title = f"测试路径 {unique_keyword}"
    db.commit()
    
    # 创建其他路径
    create_learning_path(db, career_id=career.id)
    create_learning_path(db, career_id=career.id)
    
    response = client.get(
        f"/api/v1/learning-paths/search/?keyword={unique_keyword}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    assert len(content) >= 1
    path_ids = [p["id"] for p in content]
    assert path.id in path_ids

def test_update_learning_path(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试更新学习路径"""
    # 创建职业和学习路径
    career = create_random_career(db)
    learning_path = create_learning_path(db, career_id=career.id)
    
    data = {
        "title": "更新后的学习路径",
        "description": "这是更新后的描述",
        "difficulty": "高级"
    }
    response = client.put(
        f"/api/v1/learning-paths/{learning_path.id}", 
        headers=superuser_token_headers, 
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["difficulty"] == data["difficulty"]
    assert content["id"] == learning_path.id

def test_delete_learning_path(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    """测试删除学习路径"""
    # 创建职业和学习路径
    career = create_random_career(db)
    learning_path = create_learning_path(db, career_id=career.id)
    
    response = client.delete(
        f"/api/v1/learning-paths/{learning_path.id}", 
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    
    # 确认已删除
    path_in_db = crud.learning_path.get(db=db, id=learning_path.id)
    assert path_in_db is None 