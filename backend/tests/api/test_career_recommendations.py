from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.tests.utils.career import create_random_career, generate_recommendation_for_user
from app.tests.utils.user import create_random_user

def test_get_recommendations(
    client: TestClient, normal_user_token_headers: dict, db: Session
) -> None:
    """测试获取用户的职业推荐"""
    # 获取当前用户ID
    response = client.get("/api/v1/users/me", headers=normal_user_token_headers)
    assert response.status_code == 200
    user_id = response.json()["id"]
    
    # 创建职业
    career1 = create_random_career(db)
    career2 = create_random_career(db)
    
    # 为用户生成推荐
    recommendation1 = generate_recommendation_for_user(db, user_id=user_id, career_id=career1.id)
    recommendation2 = generate_recommendation_for_user(db, user_id=user_id, career_id=career2.id)
    
    response = client.get(
        "/api/v1/career-recommendations/", headers=normal_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    assert "recommendations" in content
    assert "total" in content
    assert content["total"] >= 2
    
    recommendation_ids = [r["id"] for r in content["recommendations"]]
    assert recommendation1.id in recommendation_ids
    assert recommendation2.id in recommendation_ids
    
    # 验证推荐中包含职业详情
    for recommendation in content["recommendations"]:
        assert "career" in recommendation
        assert "title" in recommendation["career"]
        assert "description" in recommendation["career"]

def test_get_favorite_recommendations(
    client: TestClient, normal_user_token_headers: dict, db: Session
) -> None:
    """测试获取用户收藏的职业推荐"""
    # 获取当前用户ID
    response = client.get("/api/v1/users/me", headers=normal_user_token_headers)
    assert response.status_code == 200
    user_id = response.json()["id"]
    
    # 创建职业
    career1 = create_random_career(db)
    career2 = create_random_career(db)
    
    # 为用户生成推荐，一个收藏一个不收藏
    recommendation1 = generate_recommendation_for_user(db, user_id=user_id, career_id=career1.id, is_favorite=True)
    recommendation2 = generate_recommendation_for_user(db, user_id=user_id, career_id=career2.id, is_favorite=False)
    
    response = client.get(
        "/api/v1/career-recommendations/favorites", headers=normal_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    
    assert "recommendations" in content
    assert "total" in content
    
    recommendation_ids = [r["id"] for r in content["recommendations"]]
    assert recommendation1.id in recommendation_ids
    assert recommendation2.id not in recommendation_ids  # 不是收藏的不应该在结果中

def test_toggle_favorite(
    client: TestClient, normal_user_token_headers: dict, db: Session
) -> None:
    """测试切换收藏状态"""
    # 获取当前用户ID
    response = client.get("/api/v1/users/me", headers=normal_user_token_headers)
    assert response.status_code == 200
    user_id = response.json()["id"]
    
    # 创建职业和推荐
    career = create_random_career(db)
    recommendation = generate_recommendation_for_user(db, user_id=user_id, career_id=career.id, is_favorite=False)
    
    # 切换为收藏
    data = {
        "recommendation_id": recommendation.id
    }
    response = client.post(
        "/api/v1/career-recommendations/toggle-favorite", 
        headers=normal_user_token_headers, 
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["is_favorite"] == True
    
    # 再次切换回不收藏
    response = client.post(
        "/api/v1/career-recommendations/toggle-favorite", 
        headers=normal_user_token_headers, 
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["is_favorite"] == False

def test_add_feedback(
    client: TestClient, normal_user_token_headers: dict, db: Session
) -> None:
    """测试添加反馈"""
    # 获取当前用户ID
    response = client.get("/api/v1/users/me", headers=normal_user_token_headers)
    assert response.status_code == 200
    user_id = response.json()["id"]
    
    # 创建职业和推荐
    career = create_random_career(db)
    recommendation = generate_recommendation_for_user(db, user_id=user_id, career_id=career.id)
    
    # 添加反馈
    feedback_text = "这个推荐非常符合我的职业规划，感谢推荐！"
    data = {
        "recommendation_id": recommendation.id,
        "feedback": feedback_text
    }
    response = client.post(
        "/api/v1/career-recommendations/feedback", 
        headers=normal_user_token_headers, 
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["feedback"] == feedback_text
    
    # 确认数据库中已更新
    updated_recommendation = crud.career_recommendation.get(db=db, id=recommendation.id)
    assert updated_recommendation.feedback == feedback_text

def test_generate_recommendations(
    client: TestClient, normal_user_token_headers: dict, db: Session
) -> None:
    """测试生成职业推荐"""
    # 这个测试可能比较复杂，因为涉及到异步操作
    # 简单地测试API响应是否正常，而不验证实际的生成结果
    response = client.post(
        "/api/v1/career-recommendations/generate", 
        headers=normal_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert "recommendations" in content
    assert "total" in content
    assert "message" in content 