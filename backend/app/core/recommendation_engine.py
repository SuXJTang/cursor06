import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime
import random

from app import crud, models, schemas

logger = logging.getLogger(__name__)

def analyze_user_profile(
    db: Session, user_id: int
) -> Dict[str, Any]:
    """
    分析用户资料，提取用于推荐的特征
    """
    user_profile = crud.user_profile.get_by_user_id(db, user_id=user_id)
    if not user_profile:
        logger.warning(f"用户{user_id}没有完整的个人资料")
        return {}
    
    # 提取相关特征
    features = {
        "skills": user_profile.skills if user_profile.skills else [],
        "interests": user_profile.interests if user_profile.interests else [],
        "education_level": user_profile.education_level,
        "major": user_profile.major,
        "experience_years": user_profile.experience_years
    }
    
    # 获取用户简历信息
    resume = crud.resume.get_by_user_id(db, user_id=user_id)
    if resume:
        if resume.skills:
            features["skills"].extend(resume.skills)
        if resume.education:
            features["education"] = resume.education
        if resume.work_experience:
            features["work_experience"] = resume.work_experience
    
    return features

def match_careers_with_profile(
    db: Session, user_features: Dict[str, Any], limit: int = 10
) -> List[Dict[str, Any]]:
    """
    基于用户特征匹配合适的职业
    """
    matches = []
    
    # 基于技能匹配职业
    if "skills" in user_features and user_features["skills"]:
        skill_careers = crud.career.get_by_skills(db, skills=user_features["skills"], limit=20)
        for career in skill_careers:
            # 计算匹配程度
            match_score = calculate_match_score(career, user_features)
            match_reasons = generate_match_reasons(career, user_features)
            
            matches.append({
                "career_id": career.id,
                "match_score": match_score,
                "match_reasons": match_reasons
            })
    
    # 如果技能匹配不足，添加基于其他特征的匹配
    if len(matches) < limit:
        # 这里可以添加基于兴趣、教育背景等的匹配逻辑
        additional_careers = crud.career.get_multi(db, limit=limit)
        for career in additional_careers:
            # 检查是否已在匹配列表中
            if not any(m["career_id"] == career.id for m in matches):
                match_score = calculate_match_score(career, user_features)
                match_reasons = generate_match_reasons(career, user_features)
                
                matches.append({
                    "career_id": career.id,
                    "match_score": match_score,
                    "match_reasons": match_reasons
                })
                
                if len(matches) >= limit:
                    break
    
    # 按匹配程度排序
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return matches[:limit]

def calculate_match_score(career: models.Career, user_features: Dict[str, Any]) -> float:
    """
    计算职业与用户特征的匹配程度
    """
    score = 0.0
    
    # 技能匹配
    if "skills" in user_features and user_features["skills"] and career.skills_required:
        user_skills_set = set(s.lower() for s in user_features["skills"])
        career_skills_set = set(s.lower() for s in career.skills_required)
        if career_skills_set:
            skill_match_ratio = len(user_skills_set.intersection(career_skills_set)) / len(career_skills_set)
            score += skill_match_ratio * 0.5  # 技能匹配占50%权重
    
    # 教育水平匹配
    if "education_level" in user_features and user_features["education_level"] and career.education_required:
        education_levels = {
            "高中": 1,
            "大专": 2,
            "本科": 3,
            "硕士": 4,
            "博士": 5
        }
        
        user_edu_level = education_levels.get(user_features["education_level"], 0)
        career_edu_level = 0
        
        for level, value in education_levels.items():
            if level in career.education_required:
                career_edu_level = value
                break
        
        if career_edu_level > 0:
            if user_edu_level >= career_edu_level:
                score += 0.3  # 教育水平匹配占30%权重
            else:
                # 教育水平不足，但也给一些分数
                score += 0.15
    
    # 兴趣匹配
    if "interests" in user_features and user_features["interests"]:
        # 简单实现：检查职业标题或描述中是否含有用户兴趣
        for interest in user_features["interests"]:
            if interest.lower() in career.title.lower() or (career.description and interest.lower() in career.description.lower()):
                score += 0.2 / len(user_features["interests"])  # 兴趣匹配占20%权重
    
    # 增加一些随机性，避免推荐结果过于相似
    score += random.uniform(0, 0.1)
    
    return min(score, 1.0)  # 确保分数不超过1.0

def generate_match_reasons(career: models.Career, user_features: Dict[str, Any]) -> List[str]:
    """
    生成匹配原因
    """
    reasons = []
    
    # 技能匹配原因
    if "skills" in user_features and user_features["skills"] and career.skills_required:
        user_skills_set = set(s.lower() for s in user_features["skills"])
        career_skills_set = set(s.lower() for s in career.skills_required)
        matched_skills = user_skills_set.intersection(career_skills_set)
        if matched_skills:
            skill_str = ", ".join(list(matched_skills)[:3])
            reasons.append(f"您掌握的技能（{skill_str}等）与该职业所需技能匹配")
    
    # 教育水平匹配原因
    if "education_level" in user_features and user_features["education_level"] and career.education_required:
        if user_features["education_level"] in career.education_required:
            reasons.append(f"您的教育水平（{user_features['education_level']}）符合该职业要求")
    
    # 专业匹配原因
    if "major" in user_features and user_features["major"] and career.related_majors:
        for related_major in career.related_majors:
            if related_major.lower() in user_features["major"].lower():
                reasons.append(f"您的专业（{user_features['major']}）与该职业相关")
                break
    
    # 如果没有明确的匹配原因，添加一个通用原因
    if not reasons:
        reasons.append("根据您的整体资料，该职业可能适合您")
    
    return reasons

def save_recommendations(
    db: Session, user_id: int, matches: List[Dict[str, Any]]
) -> None:
    """
    保存职业推荐到数据库
    """
    # 清除该用户之前的推荐（可选，取决于业务需求）
    old_recommendations = crud.career_recommendation.get_by_user(db, user_id=user_id)
    for rec in old_recommendations:
        db.delete(rec)
    db.commit()
    
    # 添加新的推荐
    for match in matches:
        recommendation = schemas.CareerRecommendationCreate(
            user_id=user_id,
            career_id=match["career_id"],
            match_score=match["match_score"],
            match_reasons=match["match_reasons"],
            is_favorite=False
        )
        crud.career_recommendation.create(db=db, obj_in=recommendation)

def generate_career_recommendations(db: Session, user_id: int) -> None:
    """
    为用户生成职业推荐的主函数
    """
    try:
        logger.info(f"开始为用户{user_id}生成职业推荐")
        
        # 分析用户资料
        user_features = analyze_user_profile(db, user_id)
        if not user_features:
            logger.warning(f"用户{user_id}没有足够的资料用于生成推荐")
            return
        
        # 匹配职业
        matches = match_careers_with_profile(db, user_features)
        
        # 保存推荐结果
        save_recommendations(db, user_id, matches)
        
        logger.info(f"已为用户{user_id}生成{len(matches)}个职业推荐")
    except Exception as e:
        logger.error(f"为用户{user_id}生成职业推荐时出错: {str(e)}")
        # 确保数据库会话被回滚
        db.rollback() 