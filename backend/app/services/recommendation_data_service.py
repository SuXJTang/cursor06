import json
import re
import os
from typing import Dict, List, Optional, Any, Tuple

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from contextlib import AsyncExitStack

from app.models import User, Resume, UserProfile
from app.db.session import get_async_session
from app.utils.logger import logger
from app.core.config import settings

class RecommendationDataService:
    """职业推荐数据服务，负责收集和处理职业推荐所需的数据"""
    
    def __init__(self):
        """初始化数据服务"""
        self.db = None
        self._exit_stack = None
        self.logger = logger
    
    async def initialize(self):
        """初始化数据库连接"""
        try:
            # 初始化退出栈，用于管理异步资源
            self._exit_stack = AsyncExitStack()
            # 获取数据库会话
            self.db = await self._exit_stack.enter_async_context(get_async_session())
            self.logger.info("【推荐数据服务】数据库连接初始化成功")
            return True
        except Exception as e:
            self.logger.error(f"【推荐数据服务】数据库连接初始化失败: {str(e)}")
            if self._exit_stack:
                await self._exit_stack.aclose()
            self.db = None
            return False
            
    async def close(self):
        """关闭数据库连接"""
        if self._exit_stack:
            await self._exit_stack.aclose()
            self.logger.info("【推荐数据服务】数据库连接已关闭")
            self._exit_stack = None
            self.db = None
            
    async def execute_query(self, query, params=None):
        """执行SQL查询
        
        Args:
            query: SQL查询字符串或SQLAlchemy文本对象
            params: 查询参数
            
        Returns:
            查询结果
        """
        try:
            if not self.db:
                async with get_async_session() as db:
                    # 检查query是否已经是文本对象
                    query_obj = query if hasattr(query, 'text') else text(query)
                    result = await db.execute(query_obj, params or {})
                    return result
            else:
                # 检查query是否已经是文本对象
                query_obj = query if hasattr(query, 'text') else text(query)
                result = await self.db.execute(query_obj, params or {})
                return result
        except Exception as e:
            self.logger.error(f"【推荐数据服务】执行查询失败: {str(e)}")
            raise
    
    async def get_user_data(self, user_id: int) -> Optional[Dict[str, Any]]:
        """获取用户个人资料数据"""
        try:
            logger.info(f"开始获取用户 {user_id} 的个人资料数据")
            
            async with get_async_session() as db:
                # 获取用户基本信息
                user = await self._get_user_basic_info(db, user_id)
                if not user:
                    logger.error(f"无法获取用户 {user_id} 的基本信息")
                    return None
                    
                # 获取用户详细资料
                profile = await self._get_user_profile(db, user_id)
                
                # 合并数据
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_active": user.is_active,
                    "avatar_url": user.avatar_url,
                }
                
                # 如果有用户详细资料，添加所有字段
                if profile:
                    profile_dict = profile.to_dict() if hasattr(profile, 'to_dict') else {
                        "id": getattr(profile, "id", None),
                        "user_id": getattr(profile, "user_id", None),
                        "full_name": getattr(profile, "full_name", None),
                        "gender": getattr(profile, "gender", None),
                        "date_of_birth": getattr(profile, "date_of_birth", None),
                        "address": getattr(profile, "address", None),
                        "education": getattr(profile, "education", None),
                        "education_level": getattr(profile, "education_level", None),
                        "major": getattr(profile, "major", None),
                        "work_experience": getattr(profile, "work_experience", None),
                        "experience_years": getattr(profile, "experience_years", None),
                        "work_years": getattr(profile, "work_years", None),
                        "skills": getattr(profile, "skills", None),
                        "interests": getattr(profile, "interests", None),
                        "bio": getattr(profile, "bio", None),
                        "learning_ability": getattr(profile, "learning_ability", None),
                        "skill_tags": getattr(profile, "skill_tags", None),
                        "career_interests": getattr(profile, "career_interests", None),
                        "personality_traits": getattr(profile, "personality_traits", None),
                        "work_style": getattr(profile, "work_style", None),
                        "learning_style": getattr(profile, "learning_style", None),
                        "growth_potential": getattr(profile, "growth_potential", None),
                        "recommended_paths": getattr(profile, "recommended_paths", None),
                        "ai_analysis": getattr(profile, "ai_analysis", None),
                        "created_at": getattr(profile, "created_at", None),
                        "updated_at": getattr(profile, "updated_at", None)
                    }
                    
                    # 合并到用户数据中
                    user_data.update(profile_dict)
            
            logger.info(f"成功获取用户 {user_id} 的个人资料数据")
            return user_data
        except Exception as e:
            logger.error(f"获取用户 {user_id} 的个人资料出错: {str(e)}")
            return None
    
    async def get_resume_data(self, user_id: int) -> Optional[Dict[str, Any]]:
        """获取用户简历数据并解析为结构化格式"""
        try:
            logger.info(f"开始获取用户 {user_id} 的简历数据")
            
            async with get_async_session() as db:
                # 获取简历数据
                resume = await self._get_user_resume(db, user_id)
                if not resume:
                    logger.error(f"用户 {user_id} 没有简历数据")
                    return None
                
                # 检查是否有AI分析文件路径
                if not resume.ai_analysis_file:
                    logger.error(f"用户 {user_id} 的简历没有AI分析文件路径")
                    return None
                
                # 构建完整的文件路径
                file_path = os.path.join(settings.BASE_DIR, resume.ai_analysis_file)
                
                # 检查文件是否存在
                if not os.path.exists(file_path):
                    logger.error(f"用户 {user_id} 的简历AI分析文件不存在: {file_path}")
                    return None
                
                # 读取JSON文件内容
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        structured_data = json.load(f)
                except Exception as e:
                    logger.error(f"读取用户 {user_id} 的简历AI分析文件出错: {str(e)}")
                    return None
                
                # 基础简历信息
                resume_data = {
                    "id": resume.id,
                    "title": resume.title,
                    "status": resume.status,
                    "file_url": resume.file_url,
                    # 将解析后的内容添加到结果中
                    **structured_data
                }
            
            logger.info(f"成功获取并解析用户 {user_id} 的简历数据")
            return resume_data
        except Exception as e:
            logger.error(f"获取用户 {user_id} 的简历数据出错: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return None
    
    async def get_assessment_data(self, user_id: int) -> Optional[Dict[str, Any]]:
        """尝试获取用户测评数据，如果不存在则返回None"""
        try:
            logger.info(f"开始获取用户 {user_id} 的测评数据")
            
            async with get_async_session() as db:
                # 尝试获取技能评估数据
                skill_assessments = await self._get_skill_assessments(db, user_id)
                
                # 尝试获取职业兴趣测评结果
                career_assessment_answers = await self._get_career_assessment_answers(db, user_id)
                
                # 如果都没有数据，返回None
                if not skill_assessments and not career_assessment_answers:
                    logger.warning(f"用户 {user_id} 没有测评数据")
                    return None
                
                # 否则返回可用的数据
                assessment_data = {
                    "skill_assessments": skill_assessments or [],
                    "career_assessment_answers": career_assessment_answers or {}
                }
            
            logger.info(f"成功获取用户 {user_id} 的测评数据")
            return assessment_data
        except Exception as e:
            logger.error(f"获取用户 {user_id} 的测评数据出错: {str(e)}")
            return None
    
    async def collect_all_user_data(self, user_id: int) -> Tuple[Dict[str, Any], List[str]]:
        """
        收集用户的所有相关数据，包括个人资料、简历和测评
        
        返回:
            - 包含所有可用数据的字典
            - 缺失数据项的列表
        """
        all_data = {}
        missing_data = []
        
        # 获取用户资料
        user_data = await self.get_user_data(user_id)
        if user_data:
            all_data["user_profile"] = user_data
        else:
            missing_data.append("用户资料")
        
        # 获取简历数据
        resume_data = await self.get_resume_data(user_id)
        if resume_data:
            all_data["resume"] = resume_data
        else:
            missing_data.append("简历数据")
        
        # 获取测评数据（可选）
        assessment_data = await self.get_assessment_data(user_id)
        if assessment_data:
            all_data["assessment"] = assessment_data
        else:
            missing_data.append("测评数据")
        
        return all_data, missing_data
    
    # ---- 私有辅助方法 ----
    
    async def _get_user_basic_info(self, db: AsyncSession, user_id: int) -> Optional[User]:
        """获取用户基本信息"""
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def _get_user_profile(self, db: AsyncSession, user_id: int) -> Optional[UserProfile]:
        """获取用户详细资料"""
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def _get_user_resume(self, db: AsyncSession, user_id: int) -> Optional[Resume]:
        """获取用户最新的简历"""
        stmt = select(Resume).where(Resume.user_id == user_id).order_by(Resume.updated_at.desc())
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def _get_skill_assessments(self, db: AsyncSession, user_id: int) -> Optional[List[Dict]]:
        """获取用户技能评估数据"""
        try:
            # 尝试查询skill_assessments表
            # 注意：如果表不存在或结构不匹配，此查询会失败
            stmt = text("""
                SELECT * FROM skill_assessments
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """)
            result = await db.execute(stmt, {"user_id": user_id})
            rows = result.fetchall()
            
            if not rows:
                return None
                
            # 将行数据转换为字典列表
            assessments = []
            for row in rows:
                assessments.append(dict(row))
            
            return assessments
        except Exception as e:
            logger.error(f"获取技能评估数据失败: {str(e)}")
            return None
    
    async def _get_career_assessment_answers(self, db: AsyncSession, user_id: int) -> Optional[Dict]:
        """获取用户职业兴趣测评答案"""
        try:
            # 尝试查询career_assessment_answers表
            # 注意：如果表不存在或结构不匹配，此查询会失败
            stmt = text("""
                SELECT * FROM career_assessment_answers
                WHERE user_id = :user_id
                ORDER BY created_at DESC
                LIMIT 1
            """)
            result = await db.execute(stmt, {"user_id": user_id})
            row = result.fetchone()
            
            if not row:
                return None
                
            # 将行数据转换为字典
            answers = dict(row)
            
            # 尝试解析answers_json字段
            if "answers_json" in answers and answers["answers_json"]:
                try:
                    answers["answers"] = json.loads(answers["answers_json"])
                except json.JSONDecodeError:
                    logger.warning(f"无法解析用户 {user_id} 的测评答案JSON")
            
            return answers
        except Exception as e:
            logger.error(f"获取职业测评答案失败: {str(e)}")
            return None
    
    def _parse_resume_content(self, content: str) -> Dict[str, Any]:
        """解析简历内容字符串为结构化数据"""
        if not content:
            return {}
            
        result = {}
        
        # 使用正则表达式分离各个部分
        parts = re.split(r'\n\n', content)
        
        for part in parts:
            part = part.strip()
            
            # 解析基本信息
            if part.startswith("基本信息:"):
                json_str = part.replace("基本信息:", "", 1).strip()
                try:
                    result["basic_info"] = json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning(f"无法解析简历中的基本信息: {json_str}")
            
            # 解析教育经历
            elif part.startswith("教育经历:"):
                json_str = part.replace("教育经历:", "", 1).strip()
                try:
                    result["education"] = json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning(f"无法解析简历中的教育经历: {json_str}")
            
            # 解析工作经历
            elif part.startswith("工作经历:"):
                json_str = part.replace("工作经历:", "", 1).strip()
                try:
                    result["work_experience"] = json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning(f"无法解析简历中的工作经历: {json_str}")
            
            # 解析项目经验
            elif part.startswith("项目经验:"):
                json_str = part.replace("项目经验:", "", 1).strip()
                try:
                    result["projects"] = json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning(f"无法解析简历中的项目经验: {json_str}")
            
            # 解析技能
            elif part.startswith("技能:"):
                skills_str = part.replace("技能:", "", 1).strip()
                # 技能通常是逗号分隔的列表
                result["skills"] = [s.strip() for s in skills_str.split(",")]
        
        return result 