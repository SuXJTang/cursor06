from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Dict, Any, Optional, Union
import uuid
import json
from datetime import datetime
import logging
import traceback
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.user import User
from app.schemas.assessment import (
    AssessmentQuestionResponse,
    AssessmentSubmitRequest,
    AssessmentResponse,
    MultiAssessmentSubmitRequest,
    MultiAssessmentResponse,
    AssessmentFileResponse
)
from app.core.config import settings
from app.services.recommendation_service import get_recommendation_service, DeepSeekRecommendationService
from app.services.optimized_recommendation_service import OptimizedRecommendationService

# 获取logger
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/questions/{assessment_type}", response_model=List[AssessmentQuestionResponse])
async def get_assessment_questions(
    assessment_type: str, 
    db: AsyncSession = Depends(deps.get_async_db)
) -> List[Dict[str, Any]]:
    """
    获取特定类型的测评问题
    """
    logger.info(f"开始处理获取测评问题请求，类型: {assessment_type}")
    
    # 检查测评类型是否有效
    valid_types = ["interest", "ability", "personality"]
    if assessment_type not in valid_types:
        logger.warning(f"无效的测评类型: {assessment_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"无效的测评类型: {assessment_type}, 有效值为: {', '.join(valid_types)}"
        )
    
    try:
        # 使用ORM模型查询，而不是原始SQL
        from app.models.assessment_question import AssessmentQuestion
        from sqlalchemy import select
        
        # 创建查询对象
        query = select(AssessmentQuestion).where(AssessmentQuestion.type == assessment_type)
        result = await db.execute(query)
        
        # 获取所有行
        questions = result.scalars().all()
        
        logger.info(f"查询结果: 获取到 {len(questions)} 个测评问题")
        
        if not questions:
            logger.warning(f"未找到类型为 {assessment_type} 的测评问题")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"未找到类型为 {assessment_type} 的测评问题"
            )
        
        # 转换为响应格式
        response = []
        for q in questions:
            # 使用固定选项
            standard_options = ["非常符合", "比较符合", "一般", "比较不符合", "非常不符合"]
            
            question_data = {
                "id": q.id,  # 这里id是整数类型
                "type": q.type,
                "question": q.question,
                "options": standard_options if q.options is None else q.options
            }
            response.append(question_data)
        
        logger.info(f"成功构建响应，共 {len(response)} 个问题")
        return response
    except Exception as e:
        logger.error(f"查询测评问题时出错: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"查询测评问题时出错: {str(e)}"
        )

def generate_analysis(assessment_type: str, answers: list) -> dict:
    """
    根据测评类型和答案生成分析结果
    """
    # 检查是否有答案
    if not answers or len(answers) == 0:
        # 返回默认分析结果
        return {
            "message": "没有足够的答案进行分析",
            "characteristics": [] if assessment_type == "interest" else None,
            "suitable_areas": [] if assessment_type == "interest" else None,
            "notable_skills": [] if assessment_type == "ability" else None,
            "skill_characteristics": {} if assessment_type == "ability" else None,
            "personality_characteristics": {} if assessment_type == "personality" else None,
            "work_preferences": {} if assessment_type == "personality" else None,
            "suitable_environments": [] if assessment_type == "personality" else None,
        }
    
    # 统计答案分布
    answer_counts = {
        "非常符合": 0,
        "比较符合": 0,
        "一般": 0,
        "比较不符合": 0,
        "非常不符合": 0
    }
    
    for answer in answers:
        option = answer["selected_option"]
        answer_counts[option] = answer_counts.get(option, 0) + 1
    
    # 防止除以零
    answers_count = max(1, len(answers))  # 确保分母至少为1
    
    # 计算倾向性
    positive_score = (answer_counts["非常符合"] * 2 + answer_counts["比较符合"]) / answers_count
    negative_score = (answer_counts["非常不符合"] * 2 + answer_counts["比较不符合"]) / answers_count
    
    if assessment_type == "interest":
        # 兴趣测评分析
        if positive_score > 0.6:
            characteristics = ["数据分析", "逻辑思维", "技术应用"]
            suitable_areas = ["IT行业", "数据科学", "研究工作"]
        elif positive_score > 0.4:
            characteristics = ["项目管理", "团队协作", "沟通能力"]
            suitable_areas = ["管理咨询", "人力资源", "市场营销"]
        else:
            characteristics = ["创意设计", "艺术表现", "创新思维"]
            suitable_areas = ["设计行业", "媒体传播", "文化创意"]
        
        return {
            "characteristics": characteristics,
            "suitable_areas": suitable_areas
        }
        
    elif assessment_type == "ability":
        # 能力测评分析
        if positive_score > 0.6:
            skill_level = "优势领域"
        elif positive_score > 0.4:
            skill_level = "中等水平"
        else:
            skill_level = "需要提升"
            
        return {
            "notable_skills": ["学习能力", "问题解决", "技术应用"],
            "skill_characteristics": {
                "技术能力": skill_level,
                "分析能力": skill_level,
                "沟通能力": "中等水平"
            }
        }
        
    else:  # personality
        # 性格测评分析
        if positive_score > negative_score:
            personality_type = "外向型"
            work_style = "团队合作"
        else:
            personality_type = "内向型"
            work_style = "独立工作"
            
        return {
            "personality_characteristics": {
                "openness": "喜欢新体验" if positive_score > 0.5 else "倾向传统",
                "conscientiousness": "注重细节" if positive_score > 0.5 else "灵活应变",
                "extraversion": "外向社交" if positive_score > 0.5 else "内向沉稳",
                "agreeableness": "友善合作" if positive_score > 0.5 else "独立自主",
                "neuroticism": "情绪稳定" if positive_score > 0.5 else "敏感谨慎"
            },
            "work_preferences": {
                "approach": "关注细节" if positive_score > 0.5 else "整体把握",
                "innovation": "创新思考" if positive_score > 0.5 else "遵循传统",
                "collaboration": "团队协作" if positive_score > 0.5 else "独立工作",
                "autonomy": "自主决策" if positive_score > 0.5 else "寻求指导"
            },
            "suitable_environments": [
                "创新企业" if positive_score > 0.5 else "稳定企业",
                "团队合作" if positive_score > 0.5 else "独立办公",
                "有挑战性的工作环境" if positive_score > 0.5 else "结构化的工作环境"
            ]
        }

@router.post("/submit", response_model=AssessmentResponse)
async def submit_assessment(
    request: Union[AssessmentSubmitRequest, MultiAssessmentSubmitRequest, Dict[str, Any]],
    current_user: User = Depends(deps.get_current_user_async),
    db: AsyncSession = Depends(deps.get_async_db),
    background_tasks: BackgroundTasks = None
):
    """
    提交测评答案
    支持单一测评类型提交和多测评类型批量提交
    """
    try:
        logger.info(f"接收到测评提交请求: {request}")
        
        # 正确区分请求类型
        if isinstance(request, dict):
            # 字典类型请求
            if "assessments" in request:
                # 多测评类型提交
                logger.info("检测到多测评提交格式")
                return await process_multi_assessment(request, current_user, db, background_tasks)
            elif "type" in request:
                # 单一测评类型提交
                logger.info(f"检测到单测评提交格式，类型: {request['type']}")
                return await process_single_assessment(request, current_user, db, background_tasks)
            else:
                logger.error("请求格式错误，既没有assessments也没有type字段")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="无效的请求格式，缺少assessments或type字段"
                )
        elif hasattr(request, 'assessments'):
            # Pydantic模型多测评类型提交
            logger.info("检测到Pydantic模型多测评提交格式")
            return await process_multi_assessment(request, current_user, db, background_tasks)
        else:
            # Pydantic模型单测评类型提交
            logger.info(f"检测到Pydantic模型单测评提交格式，类型: {request.type}")
            return await process_single_assessment(request, current_user, db, background_tasks)
    except Exception as e:
        await db.rollback()
        logger.error(f"提交测评答案时出错: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"提交测评答案时出错: {str(e)}"
        )

@router.post("/submit/{assessment_type}", response_model=AssessmentResponse)
async def submit_assessment_with_type(
    assessment_type: str,
    request: Dict[str, Any],
    current_user: User = Depends(deps.get_current_user_async),
    db: AsyncSession = Depends(deps.get_async_db),
    background_tasks: BackgroundTasks = None
):
    """
    提交测评答案（路径参数中包含测评类型）
    此端点专门用于前端未包含type字段的情况
    """
    logger.info(f"接收到带类型参数的测评提交请求: {assessment_type}")
    
    try:
        # 验证测评类型
        valid_types = ["interest", "ability", "personality"]
        if assessment_type not in valid_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"无效的测评类型: {assessment_type}, 有效值为: {', '.join(valid_types)}"
            )
        
        # 构建一个有效的请求对象
        if "answers" not in request:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="请求中缺少answers字段"
            )
        
        # 从路径参数中获取的类型构建请求
        valid_request_data = {
            "type": assessment_type,
            "answers": request["answers"]
        }
        
        # 使用Pydantic验证请求
        from pydantic import TypeAdapter
        try:
            validated_request = TypeAdapter(AssessmentSubmitRequest).validate_python(valid_request_data)
            logger.info(f"成功构建验证后的请求: {validated_request}")
        except Exception as e:
            logger.error(f"验证请求数据时出错: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"验证请求数据失败: {str(e)}"
            )
        
        # 处理单一测评
        return await process_single_assessment(validated_request, current_user, db, background_tasks)
    
    except Exception as e:
        await db.rollback()
        logger.error(f"提交测评答案时出错: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"提交测评答案时出错: {str(e)}"
        )

async def process_multi_assessment(
    request: MultiAssessmentSubmitRequest,
    current_user: User,
    db: AsyncSession,
    background_tasks: BackgroundTasks = None
) -> AssessmentResponse:
    """处理多测评类型提交"""
    
    # 使用当前认证用户的ID，不再从请求中读取
    user_id = current_user.id
    logger.info(f"使用当前登录用户ID: {user_id}")
    
    # 固定文件路径格式，不再使用时间戳
    file_path = f"data/assessments/user_{user_id}.json"
    
    # 检查用户现有的测评记录
    query = text("""
    SELECT id, file_path 
    FROM assessment_files 
    WHERE user_id = :user_id 
    LIMIT 1
    """)
    result = await db.execute(query, {"user_id": user_id})
    existing_file = result.first()
    
    file_id = None
    # 准备保存的数据
    assessment_data = {
        "user_id": user_id,
        "assessments": []
    }
    
    # 如果已有文件记录，则使用现有ID并尝试读取现有文件内容
    if existing_file:
        file_id = existing_file.id
        logger.info(f"用户已有测评文件记录: {file_id}")
        
        # 尝试读取现有文件内容
        import os
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    assessment_data = json.load(f)
                logger.info(f"成功读取现有测评文件: {file_path}")
            except (json.JSONDecodeError, FileNotFoundError) as e:
                logger.warning(f"无法读取现有文件: {str(e)}，将使用新数据")
    else:
        # 创建新的文件ID
        file_id = f"assessment_file_{uuid.uuid4().hex[:8]}"
        logger.info(f"为用户创建新的测评文件记录: {file_id}")
        
        # 创建文件记录
        insert_file_query = text("""
        INSERT INTO assessment_files 
        (id, user_id, file_path, created_at, updated_at)
        VALUES (:id, :user_id, :file_path, NOW(), NOW())
        """)
        await db.execute(insert_file_query, {
            "id": file_id,
            "user_id": user_id,
            "file_path": file_path
        })
    
    # 将前端发送的数据处理并保存，更新已有的测评类型
    # 处理assessments字段，支持字典和对象访问
    assessments = request["assessments"] if isinstance(request, dict) else request.assessments
    
    for new_assessment in assessments:
        # 检查是否已有此类型的测评
        existing_index = None
        
        # 获取测评类型，支持字典和对象
        assessment_type = new_assessment["type"] if isinstance(new_assessment, dict) else new_assessment.type
        assessment_completion_date = new_assessment["completion_date"] if isinstance(new_assessment, dict) else new_assessment.completion_date
        assessment_answers = new_assessment["answers"] if isinstance(new_assessment, dict) else new_assessment.answers
        
        for i, existing_assessment in enumerate(assessment_data["assessments"]):
            if existing_assessment["type"] == assessment_type:
                existing_index = i
                break
        
        # 准备新的测评数据
        assessment_item = {
            "type": assessment_type,
            "completion_date": assessment_completion_date,
            "answers": [
                {
                    "question_id": answer["question_id"] if isinstance(answer, dict) else answer.question_id,
                    "question": answer["question"] if isinstance(answer, dict) else answer.question,
                    "selected_option": answer["selected_option"] if isinstance(answer, dict) else answer.selected_option
                } for answer in assessment_answers
            ]
        }
        
        # 更新或添加测评数据
        if existing_index is not None:
            assessment_data["assessments"][existing_index] = assessment_item
            logger.info(f"更新用户现有的测评类型: {assessment_type}")
        else:
            assessment_data["assessments"].append(assessment_item)
            logger.info(f"添加用户新的测评类型: {assessment_type}")
    
    # 保存JSON文件
    import os
    file_dir = os.path.dirname(file_path)
    os.makedirs(file_dir, exist_ok=True)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(assessment_data, f, ensure_ascii=False, indent=2)
    logger.info(f"成功保存测评文件: {file_path}")
    
    # 为每种测评类型创建或更新记录
    record_ids = {}
    for assessment in assessments:
        # 获取测评类型，支持字典和对象
        assessment_type = assessment["type"] if isinstance(assessment, dict) else assessment.type
        
        # 检查是否已有此类型的记录
        check_query = text("""
        SELECT id FROM assessment_records 
        WHERE user_id = :user_id AND type = :type
        LIMIT 1
        """)
        result = await db.execute(check_query, {
            "user_id": user_id,
            "type": assessment_type
        })
        existing_record = result.first()
        
        if existing_record:
            # 更新现有记录
            record_id = existing_record.id
            update_query = text("""
            UPDATE assessment_records
            SET assessment_file_id = :file_id, status = 'completed', 
                completion_date = NOW(), updated_at = NOW()
            WHERE id = :id
            """)
            await db.execute(update_query, {
                "id": record_id,
                "file_id": file_id
            })
            logger.info(f"更新用户现有的测评记录: {record_id}, 类型: {assessment_type}")
        else:
            # 创建新记录
            record_id = f"assessment_{uuid.uuid4().hex[:8]}"
            insert_record_query = text("""
            INSERT INTO assessment_records
            (id, user_id, assessment_file_id, type, status, completion_date, created_at, updated_at)
            VALUES (:id, :user_id, :file_id, :type, 'completed', NOW(), NOW(), NOW())
            """)
            await db.execute(insert_record_query, {
                "id": record_id,
                "user_id": user_id,
                "file_id": file_id,
                "type": assessment_type
            })
            logger.info(f"创建用户新的测评记录: {record_id}, 类型: {assessment_type}")
        
        record_ids[assessment_type] = record_id
    
    await db.commit()
    
    # 检查用户是否已完成所有三种测评
    # 获取测评类型集合，支持字典和对象
    if isinstance(request, dict):
        assessment_types = set([a["type"] for a in request["assessments"]])
    else:
        assessment_types = set([assessment.type for assessment in request.assessments])
        
    all_types = set(["interest", "ability", "personality"])
    saved_types = set([a["type"] for a in assessment_data["assessments"]])
    
    if saved_types.issuperset(all_types) and background_tasks:
        logger.info(f"用户{user_id}已完成所有三种测评，自动触发职业推荐生成")
        try:
            # 使用优化版推荐服务
            recommendation_service = OptimizedRecommendationService()
            
            # 添加生成推荐的后台任务
            background_tasks.add_task(
                recommendation_service.start_recommendation,
                user_id=user_id, 
                skip_assessment_check=True  # 已完成测评，跳过检查
            )
            logger.info(f"已将用户{user_id}的职业推荐生成任务添加到后台队列(使用优化版服务)")
        except Exception as e:
            logger.error(f"触发职业推荐生成失败: {str(e)}")
            logger.error(traceback.format_exc())
    
    # 为响应选择第一个测评类型的record_id
    # 获取第一个测评类型，支持字典和对象
    if assessments:
        first_assessment = assessments[0]
        first_type = first_assessment["type"] if isinstance(first_assessment, dict) else first_assessment.type
    else:
        first_type = "unknown"
    
    record_id = record_ids.get(first_type, f"assessment_{uuid.uuid4().hex[:8]}")
    
    # 生成第一个测评类型的分析结果
    if assessments:
        first_assessment = assessments[0]
        first_type = first_assessment["type"] if isinstance(first_assessment, dict) else first_assessment.type
        
        # 获取答案，支持字典和对象
        if isinstance(first_assessment, dict):
            answers_data = [
                {
                    "question_id": a["question_id"],
                    "selected_option": a["selected_option"]
                }
                for a in first_assessment["answers"]
            ]
        else:
            answers_data = [
                {
                    "question_id": a.question_id,
                    "selected_option": a.selected_option
                }
                for a in first_assessment.answers
            ]
            
        analysis = generate_analysis(first_type, answers_data)
    else:
        analysis = {}
    
    # 返回响应
    return {
        "id": record_id,
        "type": first_type,
        "user_id": user_id,
        "status": "completed",
        "message": "所有测评已成功提交",
        "analysis": analysis
    }

async def process_single_assessment(
    request: AssessmentSubmitRequest,
    current_user: User,
    db: AsyncSession,
    background_tasks: BackgroundTasks = None
) -> AssessmentResponse:
    """处理单一测评类型提交（原有逻辑）"""
    # 检查测评类型是否有效
    valid_types = ["interest", "ability", "personality"]
    if request.type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"无效的测评类型: {request.type}, 有效值为: {', '.join(valid_types)}"
        )
    
    # 获取问题详情
    query = text("SELECT id, type, question FROM assessment_questions WHERE type = :type")
    result = await db.execute(query, {"type": request.type})
    questions = {q.id: {"id": q.id, "type": q.type, "question": q.question} for q in result.all()}
    
    # 准备完整的答案数据
    full_answers = []
    for answer in request.answers:
        if answer.question_id in questions:
            full_answers.append({
                "question_id": answer.question_id,
                "question": questions[answer.question_id]["question"],
                "selected_option": answer.selected_option
            })
    
    # 生成分析结果（仅用于API响应）
    analysis = generate_analysis(request.type, full_answers)
    
    # 准备单次测评数据
    assessment_item = {
        "type": request.type,
        "completion_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "answers": full_answers
    }
    
    import os
    
    # 生成唯一的记录ID
    record_id = f"assessment_{uuid.uuid4().hex[:8]}"
    
    # 固定文件路径格式，不再使用时间戳
    file_path = f"data/assessments/user_{current_user.id}.json"
    
    # 检查用户是否已有测评文件记录
    query = text("""
    SELECT id FROM assessment_files 
    WHERE user_id = :user_id 
    LIMIT 1
    """)
    result = await db.execute(query, {"user_id": current_user.id})
    existing_file = result.first()
    
    file_id = None
    
    if existing_file:
        # 使用现有文件记录
        file_id = existing_file.id
        logger.info(f"使用现有文件记录: {file_id}")
        
        # 尝试加载现有文件数据
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    assessments_data = json.load(f)
                logger.info(f"成功读取现有测评文件: {file_path}")
            except (json.JSONDecodeError, FileNotFoundError) as e:
                logger.warning(f"无法读取现有文件: {str(e)}，将创建新数据")
                assessments_data = {
                    "user_id": current_user.id,
                    "assessments": []
                }
        else:
            assessments_data = {
                "user_id": current_user.id,
                "assessments": []
            }
            
        # 检查是否已有该类型测评
        type_exists = False
        for i, item in enumerate(assessments_data["assessments"]):
            if item["type"] == request.type:
                # 更新现有类型的测评数据
                assessments_data["assessments"][i] = assessment_item
                type_exists = True
                logger.info(f"更新现有类型的测评数据: {request.type}")
                break
        
        if not type_exists:
            # 添加新类型的测评数据
            assessments_data["assessments"].append(assessment_item)
            logger.info(f"添加新类型的测评数据: {request.type}")
    else:
        # 创建新文件记录
        file_id = f"assessment_file_{uuid.uuid4().hex[:8]}"
        logger.info(f"创建新文件记录: {file_id}")
        
        # 初始化新数据
        assessments_data = {
            "user_id": current_user.id,
            "assessments": [assessment_item]
        }
        
        # 创建文件记录
        insert_file_query = text("""
        INSERT INTO assessment_files 
        (id, user_id, file_path, created_at, updated_at)
        VALUES (:id, :user_id, :file_path, NOW(), NOW())
        """)
        await db.execute(insert_file_query, {
            "id": file_id,
            "user_id": current_user.id,
            "file_path": file_path
        })
    
    # 确保目录存在
    file_dir = os.path.dirname(file_path)
    os.makedirs(file_dir, exist_ok=True)
    
    # 保存JSON文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(assessments_data, f, ensure_ascii=False, indent=2)
    logger.info(f"成功保存测评文件: {file_path}")
    
    # 创建或更新assessment_records记录
    query = text("""
    SELECT id FROM assessment_records 
    WHERE user_id = :user_id AND type = :type
    LIMIT 1
    """)
    result = await db.execute(query, {
        "user_id": current_user.id,
        "type": request.type
    })
    existing_record = result.first()
    
    if existing_record:
        # 更新现有记录
        update_query = text("""
        UPDATE assessment_records
        SET status = 'completed', assessment_file_id = :file_id,
            completion_date = NOW(), updated_at = NOW()
        WHERE id = :id
        """)
        await db.execute(update_query, {
            "id": existing_record.id,
            "file_id": file_id
        })
        record_id = existing_record.id
        logger.info(f"更新现有测评记录: {record_id}")
    else:
        # 创建新记录
        insert_record_query = text("""
        INSERT INTO assessment_records
        (id, user_id, assessment_file_id, type, status, completion_date, created_at, updated_at)
        VALUES (:id, :user_id, :file_id, :type, 'completed', NOW(), NOW(), NOW())
        """)
        await db.execute(insert_record_query, {
            "id": record_id,
            "user_id": current_user.id,
            "file_id": file_id,
            "type": request.type
        })
        logger.info(f"创建新测评记录: {record_id}")
    
    await db.commit()
    
    # 检查用户是否已完成所有三种测评
    if background_tasks:
        # 检查保存的测评类型是否包含所有三种测评
        saved_types = set([a["type"] for a in assessments_data["assessments"]])
        all_types = set(["interest", "ability", "personality"])
        
        if saved_types.issuperset(all_types):
            logger.info(f"用户{current_user.id}已完成所有三种测评，自动触发职业推荐生成")
            try:
                # 使用优化版推荐服务
                recommendation_service = OptimizedRecommendationService()
                
                # 添加生成推荐的后台任务
                background_tasks.add_task(
                    recommendation_service.start_recommendation,
                    user_id=current_user.id, 
                    skip_assessment_check=True  # 已完成测评，跳过检查
                )
                logger.info(f"已将用户{current_user.id}的职业推荐生成任务添加到后台队列(使用优化版服务)")
            except Exception as e:
                logger.error(f"触发职业推荐生成失败: {str(e)}")
                logger.error(traceback.format_exc())
    
    # 返回响应
    return {
        "id": record_id,
        "type": request.type,
        "user_id": current_user.id,
        "status": "completed",
        "message": "测评已成功提交",
        "analysis": analysis
    }

@router.get("/test")
async def test_endpoint():
    """简单测试端点"""
    logger.info("测试端点被调用")
    return {"message": "测试成功", "timestamp": datetime.now().isoformat()}

@router.get("/test-multi-submission")
async def test_multi_submission():
    """
    测试批量提交接口
    返回一个测试用的多类型测评提交请求示例，可用于前端开发参考
    """
    logger.info("批量提交测试端点被调用")
    
    sample_request = {
        "user_id": 1,
        "assessments": [
            {
                "type": "interest",
                "completion_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "answers": [
                    {
                        "question_id": "interest_95103711",
                        "question": "我愿意花时间优化流程和系统",
                        "selected_option": "非常同意"
                    },
                    {
                        "question_id": "interest_90527613",
                        "question": "我更喜欢结构化的工作环境",
                        "selected_option": "一般"
                    }
                ]
            },
            {
                "type": "ability",
                "completion_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "answers": [
                    {
                        "question_id": "ability_08341136",
                        "question": "我能够有效地向不同级别的听众演讲",
                        "selected_option": "比较不同意"
                    },
                    {
                        "question_id": "ability_90261343",
                        "question": "我能够承受压力并在紧张环境中工作",
                        "selected_option": "非常同意"
                    }
                ]
            },
            {
                "type": "personality",
                "completion_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "answers": [
                    {
                        "question_id": "personality_71122386",
                        "question": "我倾向于根据逻辑而非情感做决定",
                        "selected_option": "非常同意"
                    },
                    {
                        "question_id": "personality_81523454",
                        "question": "我通常对细节很关注",
                        "selected_option": "一般"
                    }
                ]
            }
        ]
    }
    
    return {
        "message": "批量提交测试示例",
        "sample_request": sample_request,
        "note": "此示例仅供参考，实际使用时需要根据真实问题ID和选项进行调整"
    }

@router.get("/me", response_model=AssessmentFileResponse)
async def get_user_assessment(
    current_user: User = Depends(deps.get_current_user_async),
    db: AsyncSession = Depends(deps.get_async_db)
):
    """
    获取当前用户的测评文件
    
    返回用户在assessment_files表中的记录，包含测评文件路径
    """
    try:
        logger.info(f"开始处理获取用户测评文件请求，用户ID: {current_user.id}")
        
        # 首先检查表是否存在
        check_table_query = text("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'assessment_files'
        )
        """)
        check_result = await db.execute(check_table_query)
        table_exists = check_result.scalar()
        
        if not table_exists:
            logger.error("assessment_files表不存在")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="数据库表结构不完整"
            )
        
        # 查询用户现有的测评记录
        query = text("""
        SELECT id, file_path, user_id
        FROM assessment_files 
        WHERE user_id = :user_id 
        ORDER BY id DESC
        LIMIT 1
        """)
        
        try:
            result = await db.execute(query, {"user_id": current_user.id})
            assessment_file = result.first()
        except Exception as query_error:
            logger.error(f"执行查询时出错: {str(query_error)}")
            logger.error(traceback.format_exc())
            
            # 代替方案：创建模拟数据用于测试
            # 这是一个临时解决方案，以便前端可以继续开发
            logger.info("使用模拟数据进行响应")
            return {
                "id": 1,
                "user_id": current_user.id,
                "file_path": f"data/assessments/user_{current_user.id}.json",
                "created_at": None,
                "updated_at": None
            }
        
        if not assessment_file:
            logger.warning(f"未找到用户ID {current_user.id} 的测评文件记录")
            
            # 如果没有记录，也创建一个模拟数据
            return {
                "id": 0,  # 使用0表示这是模拟数据
                "user_id": current_user.id,
                "file_path": f"data/assessments/user_{current_user.id}.json",
                "created_at": None,
                "updated_at": None
            }
            
        logger.info(f"成功获取用户测评文件，ID: {assessment_file.id}")
        
        # 构建响应数据
        response_data = {
            "id": assessment_file.id,
            "file_path": assessment_file.file_path,
            "user_id": current_user.id,
            "created_at": None,
            "updated_at": None
        }
        
        return response_data
        
    except HTTPException:
        # 直接重新抛出HTTP异常
        raise
    except Exception as e:
        logger.error(f"获取用户测评文件时出错: {str(e)}")
        logger.error(traceback.format_exc())
        
        # 发生错误时返回模拟数据，以便前端开发继续
        return {
            "id": -1,  # 错误状态
            "user_id": current_user.id,
            "file_path": f"data/assessments/user_{current_user.id}.json",
            "created_at": None,
            "updated_at": None
        }

@router.post("/test-submit", response_model=Dict[str, Any])
async def test_submit(
    request: Dict[str, Any],
):
    """
    测试测评提交接口，无需认证
    用于验证请求解析和处理逻辑
    """
    try:
        logger.info(f"接收到测试测评提交请求: {request}")
        
        # 验证请求格式
        if "assessments" in request:
            logger.info("检测到多测评提交格式")
            
            # 尝试访问字典中的字段
            assessments = request["assessments"]
            user_id = request.get("user_id", 0)
            
            result = {
                "message": "多测评提交格式有效",
                "user_id": user_id,
                "assessments_count": len(assessments),
                "types": [a["type"] for a in assessments if "type" in a]
            }
        elif "type" in request:
            logger.info(f"检测到单测评提交格式，类型: {request['type']}")
            
            result = {
                "message": "单测评提交格式有效",
                "type": request["type"],
                "answers_count": len(request.get("answers", []))
            }
        else:
            logger.error("请求格式错误，既没有assessments也没有type字段")
            result = {
                "message": "无效的请求格式",
                "error": "缺少assessments或type字段"
            }
            
        return result
    except Exception as e:
        logger.error(f"测试提交时出错: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "message": "处理请求时出错",
            "error": str(e),
            "traceback": traceback.format_exc()
        } 