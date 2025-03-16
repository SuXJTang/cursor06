from typing import Dict, List, Optional

import random
import string
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string

def create_random_career_category(
    db: Session,
    *,
    name: Optional[str] = None,
    parent_id: Optional[int] = None
) -> models.CareerCategory:
    """
    创建随机职业分类
    """
    if name is None:
        name = random_lower_string()
    description = f"描述: {random_lower_string()}"
    
    career_category_in = schemas.CareerCategoryCreate(
        name=name,
        description=description,
        parent_id=parent_id
    )
    return crud.career_category.create(db=db, obj_in=career_category_in)

def create_random_career(
    db: Session,
    *,
    title: Optional[str] = None,
    category_id: Optional[int] = None
) -> models.Career:
    """
    创建随机职业
    """
    if title is None:
        title = f"职业-{random_lower_string()}"
    
    # 如果没有提供分类ID，创建一个新分类
    if not category_id:
        career_category = create_random_career_category(db=db)
        category_id = career_category.id
    
    skills_required = [
        f"技能{random.choice(string.ascii_uppercase)}{i}" 
        for i in range(random.randint(3, 6))
    ]
    
    related_majors = [
        f"专业{random.choice(string.ascii_uppercase)}{i}" 
        for i in range(random.randint(2, 4))
    ]
    
    work_activities = [
        f"工作内容{i}: {random_lower_string()}" 
        for i in range(random.randint(3, 5))
    ]
    
    education_levels = ["高中", "大专", "本科", "硕士", "博士"]
    
    career_in = schemas.CareerCreate(
        title=title,
        description=f"这是关于{title}的详细描述：{random_lower_string(30)}",
        skills_required=skills_required,
        average_salary=f"{random.randint(5, 30)}k-{random.randint(31, 50)}k",
        job_outlook=random.choice(["良好", "优秀", "一般", "强劲", "迅速增长"]),
        education_required=random.choice(education_levels),
        category_id=category_id,
        related_majors=related_majors,
        work_activities=work_activities,
        career_path=f"从初级{title}到高级{title}的职业发展路径：{random_lower_string(20)}"
    )
    
    return crud.career.create(db=db, obj_in=career_in)

def create_learning_path(
    db: Session,
    *,
    career_id: int,
    difficulty: Optional[str] = None
) -> models.LearningPath:
    """
    创建学习路径
    """
    if not difficulty:
        difficulty = random.choice(["初级", "中级", "高级"])
    
    career = crud.career.get(db=db, id=career_id)
    
    learning_path_in = schemas.LearningPathCreate(
        title=f"{career.title}的{difficulty}学习路径",
        description=f"这是为想成为{career.title}的学习者准备的{difficulty}学习路径",
        difficulty=difficulty,
        career_id=career_id,
        estimated_time=f"{random.randint(1, 12)}个月",
        content="\n".join([f"学习步骤{i+1}: {random_lower_string()}" for i in range(5)]),
        resources="\n".join([f"学习资源{i+1}: {random_lower_string()}" for i in range(3)]),
        prerequisites=f"需要掌握的前置知识: {random_lower_string(20)}",
        view_count=random.randint(0, 100)
    )
    
    return crud.learning_path.create(db=db, obj_in=learning_path_in)

def generate_recommendation_for_user(
    db: Session,
    *,
    user_id: int,
    career_id: int,
    is_favorite: bool = False
) -> models.CareerRecommendation:
    """
    为用户生成职业推荐
    """
    match_score = round(random.uniform(0.5, 1.0), 2)
    match_reasons = [
        f"原因{i+1}: {random_lower_string()}" 
        for i in range(random.randint(1, 3))
    ]
    
    recommendation_in = schemas.CareerRecommendationCreate(
        user_id=user_id,
        career_id=career_id,
        match_score=match_score,
        match_reasons=match_reasons,
        is_favorite=is_favorite
    )
    
    return crud.career_recommendation.create(db=db, obj_in=recommendation_in) 