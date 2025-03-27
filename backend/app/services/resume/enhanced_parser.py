"""
增强版简历解析器 - 用于处理各种各样的简历文件
支持多种格式、多种布局、多种行业领域的简历解析
结合规则引擎和AI模型的混合提取策略
"""

from typing import Dict, Any, List, Optional, BinaryIO
from fastapi import UploadFile
import asyncio
import logging
import os
import json
from enum import Enum, IntEnum
import time
import tempfile
import shutil

from app.services.resume.format_adapter import EnhancedFormatAdapter
from app.services.resume.layout_analyzer import IntelligentLayoutAnalyzer
from app.services.resume.extractors.rule_extractor import RuleExtractor
from app.services.resume.extractors.ai_extractor import AIExtractor
from app.services.resume.post_processor import PostProcessor
from app.services.resume.domain_classifier import DomainClassifier
from app.services.resume.quality_evaluator import QualityEvaluator
from app.core.config import settings

logger = logging.getLogger(__name__)

class ResumeComplexity(IntEnum):
    """简历复杂度分类"""
    SIMPLE = 1  # 标准格式，结构清晰
    MODERATE = 2  # 略有变化，但基本结构可识别
    COMPLEX = 3  # 非标准格式，或包含复杂内容
    VERY_COMPLEX = 4  # 极其复杂，需要高级处理

class EnhancedResumeParser:
    """
    增强版简历解析器 - 使用多层次混合解析架构
    可处理各种各样的简历格式和内容
    """
    
    def __init__(self, use_ai_for_complex: bool = False, api_key: Optional[str] = None):
        """
        初始化解析器
        
        Args:
            use_ai_for_complex: 是否对复杂内容使用AI辅助解析
            api_key: DeepSeek API密钥，如果不提供则使用配置中的密钥
        """
        self.format_adapter = EnhancedFormatAdapter()
        self.layout_analyzer = IntelligentLayoutAnalyzer()
        self.rule_extractor = RuleExtractor()
        self.domain_classifier = DomainClassifier()
        self.quality_evaluator = QualityEvaluator()
        self.post_processor = PostProcessor()
        
        self.use_ai_for_complex = use_ai_for_complex  # 使用传入的参数控制AI功能
        self.ai_extractor = AIExtractor(api_key)
        
        if self.use_ai_for_complex:
            logger.info("AI辅助解析已启用")
        else:
            logger.info("AI辅助解析已禁用")
        
        # 性能统计
        self.extraction_stats = {
            'rule_based_sections': 0,
            'ai_based_sections': 0,
            'processing_time': 0
        }
    
    async def parse(self, file: UploadFile) -> Dict[str, Any]:
        """
        解析简历文件
        
        Args:
            file: 上传的简历文件

        Returns:
            提取的结构化信息
        """
        start_time = time.time()
        temp_file_path = None
        
        try:
            logger.info(f"开始解析简历: {file.filename}")
            
            # 保存上传的文件到临时目录
            temp_file_path = await self._save_upload_file(file)
            logger.info(f"文件已保存到临时路径: {temp_file_path}")
            
            # 重新打开文件以便处理
            with open(temp_file_path, "rb") as f:
                file_content = f.read()
            
            # 创建新的UploadFile对象以供后续处理
            await file.seek(0)
            
            # 1. 文件转换 - 将不同格式转换为统一文本
            text = await self.format_adapter.convert(file)
            logger.info(f"文件转换完成，提取文本长度: {len(text)}")
            
            # 检查文本是否为空或过短（可能是简历模板而非填写过的简历）
            if len(text.strip()) < 200 or "无法处理" in text or "处理失败" in text:
                logger.warning(f"提取的文本内容过少或无效，可能是空白模板: {text[:100]}")
                return self._generate_empty_result(
                    error_message=f"简历内容不足或无法解析，可能是空白模板未填写内容。请确保上传已填写信息的简历文件。"
                )
            
            # 2. 版面分析 - 分析文档结构
            blocks = await self.layout_analyzer.analyze(text)
            logger.info(f"版面分析完成，识别出 {len(blocks)} 个内容块")
            
            # 3. 领域分类 - 识别简历所属行业领域
            domain = await self.domain_classifier.classify(text)
            logger.info(f"领域分类完成，识别为: {domain}")
            
            # 4. 复杂度评估 - 评估简历的复杂程度
            complexity = self._assess_complexity(blocks)
            logger.info(f"复杂度评估完成，复杂度: {complexity.name}")
            
            # 5. 基于规则的信息提取
            result = await self.rule_extractor.extract(blocks, domain)
            self.extraction_stats['rule_based_sections'] = len(result.keys())
            logger.info(f"规则提取完成，提取 {self.extraction_stats['rule_based_sections']} 个字段")
            
            # 检查结果是否为空（规则提取失败）
            if self._is_empty_result(result):
                if self.use_ai_for_complex:
                    logger.info("规则提取结果为空，尝试使用AI辅助提取")
                    ai_extraction = await self.ai_extractor.extract(blocks, text, domain)
                    ai_result = ai_extraction["result"]
                    ai_file_path = ai_extraction["file_path"]
                    
                    # 如果AI结果不为空，使用AI结果
                    if not self._is_empty_result(ai_result):
                        result = ai_result
                        # 添加AI分析文件路径到结果中
                        if ai_file_path:
                            result["ai_analysis_file"] = ai_file_path
                    else:
                        logger.warning("AI辅助提取也未能提取出有效信息")
                        return self._generate_empty_result(
                            error_message="即使使用AI辅助分析，也无法提取简历信息。请确保简历格式正确且包含必要信息。"
                        )
                else:
                    logger.warning("规则提取结果为空，且AI辅助提取未启用")
                    return self._generate_empty_result(
                        error_message="无法提取简历信息。请确保简历格式正确且包含必要信息，或启用AI辅助解析。"
                    )
            
            # 6. 检测未能提取的内容或复杂内容
            elif self.use_ai_for_complex and (complexity >= ResumeComplexity.COMPLEX or self._has_missing_fields(result)):
                logger.info("检测到复杂内容或缺失字段，启用AI辅助提取")
                
                # 6.1 找出需要AI处理的内容块
                complex_blocks = self._identify_complex_blocks(blocks, result)
                logger.info(f"识别出 {len(complex_blocks)} 个需要AI处理的复杂块")
                
                if complex_blocks:
                    # 6.2 AI辅助提取
                    ai_extraction = await self.ai_extractor.extract(complex_blocks, text, domain)
                    ai_result = ai_extraction["result"]
                    ai_file_path = ai_extraction["file_path"]
                    self.extraction_stats['ai_based_sections'] = len(ai_result.keys())
                    logger.info(f"AI提取完成，提取 {self.extraction_stats['ai_based_sections']} 个字段")
                    
                    # 6.3 合并结果
                    result = self._merge_results(result, ai_result)
                    # 添加AI分析文件路径到结果中
                    if ai_file_path:
                        result["ai_analysis_file"] = ai_file_path
                    logger.info("结果合并完成")
            
            # 7. 后处理和验证
            result = await self.post_processor.process(result, domain)
            logger.info("后处理和验证完成")
            
            # 8. 质量评估
            quality = self.quality_evaluator.evaluate(result)
            logger.info(f"质量评估完成，总体得分: {quality['overall_score']}")
            
            # 9. 记录解析统计信息
            self.extraction_stats['processing_time'] = time.time() - start_time
            logger.info(f"简历解析完成，耗时: {self.extraction_stats['processing_time']:.2f}秒")
            
            return result
        
        except Exception as e:
            logger.error(f"简历解析出错: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            
            # 返回空结果并包含错误信息
            return self._generate_empty_result(
                error_message=f"解析过程出错: {str(e)}"
            )
        
        finally:
            # 清理临时文件
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                    logger.info(f"已删除临时文件: {temp_file_path}")
                except Exception as e:
                    logger.error(f"删除临时文件失败: {str(e)}")
    
    async def _save_upload_file(self, file: UploadFile) -> str:
        """将上传的文件保存到临时目录"""
        try:
            # 创建临时文件
            suffix = os.path.splitext(file.filename)[1] if file.filename else ""
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                # 读取并写入上传的文件内容
                await file.seek(0)
                content = await file.read()
                temp_file.write(content)
                temp_path = temp_file.name
                
            # 重置文件位置以供后续读取
            await file.seek(0)
            return temp_path
        except Exception as e:
            logger.error(f"保存上传文件时发生错误: {str(e)}")
            raise
    
    def _assess_complexity(self, blocks: List[Any]) -> ResumeComplexity:
        """评估简历的复杂程度"""
        if len(blocks) < 5:
            return ResumeComplexity.SIMPLE
        
        # 计算不同类型块的数量
        block_types = {}
        for block in blocks:
            if block.block_type:
                block_types[block.block_type] = block_types.get(block.block_type, 0) + 1
        
        # 评估文本长度和复杂性
        total_text_length = sum(len(block.text) for block in blocks)
        avg_text_length = total_text_length / len(blocks) if blocks else 0
        
        # 检测特殊符号和结构
        special_chars_count = sum(sum(1 for c in block.text if not c.isalnum() and not c.isspace()) for block in blocks)
        special_chars_ratio = special_chars_count / total_text_length if total_text_length else 0
        
        # 评估块之间的关联性
        block_similarity = 0
        for i in range(len(blocks) - 1):
            if blocks[i].block_type == blocks[i+1].block_type:
                block_similarity += 1
        block_similarity_ratio = block_similarity / (len(blocks) - 1) if len(blocks) > 1 else 0
        
        # 综合评分
        complexity_score = (
            len(block_types) * 0.4 + 
            (avg_text_length / 100) * 0.3 + 
            special_chars_ratio * 20 * 0.2 +
            (1 - block_similarity_ratio) * 0.1
        )
        
        logger.debug(f"复杂度评分: {complexity_score:.2f}，块类型数量: {len(block_types)}，平均文本长度: {avg_text_length:.2f}，特殊字符比例: {special_chars_ratio:.4f}")
        
        if complexity_score < 3:
            return ResumeComplexity.SIMPLE
        elif complexity_score < 5:
            return ResumeComplexity.MODERATE
        elif complexity_score < 7:
            return ResumeComplexity.COMPLEX
        else:
            return ResumeComplexity.VERY_COMPLEX
    
    def _has_missing_fields(self, result: Dict[str, Any]) -> bool:
        """检查关键字段是否缺失"""
        # 检查基本信息
        if not result.get('basic_info', {}).get('name'):
            return True
        
        # 检查教育经历
        if not result.get('education', []):
            return True
        
        # 检查工作经历
        if not result.get('experience', []):
            return True
        
        # 检查技能
        if not result.get('skills', []):
            return True
        
        return False
    
    def _identify_complex_blocks(self, blocks: List[Any], result: Dict[str, Any]) -> List[Any]:
        """识别需要AI处理的复杂块"""
        complex_blocks = []
        
        # 如果基本信息缺失，添加包含可能是姓名的块
        if not result.get('basic_info', {}).get('name'):
            for block in blocks:
                if len(block.text) < 30 and not any(char.isdigit() for char in block.text):
                    complex_blocks.append(block)
        
        # 如果教育经历缺失，添加可能包含教育信息的块
        if not result.get('education', []):
            for block in blocks:
                if any(keyword in block.text.lower() for keyword in ['大学', '学院', '学历', '专业', '本科', '硕士']):
                    complex_blocks.append(block)
        
        # 如果工作经历缺失，添加可能包含工作信息的块
        if not result.get('experience', []):
            for block in blocks:
                if any(keyword in block.text.lower() for keyword in ['工作', '经验', '实习', '职位', '公司']):
                    complex_blocks.append(block)
        
        # 如果技能缺失，添加可能包含技能信息的块
        if not result.get('skills', []):
            for block in blocks:
                if any(keyword in block.text.lower() for keyword in ['技能', '专长', '熟悉', '掌握', '精通']):
                    complex_blocks.append(block)
        
        return complex_blocks
    
    def _merge_results(self, rule_result: Dict[str, Any], ai_result: Dict[str, Any]) -> Dict[str, Any]:
        """合并规则提取和AI提取的结果"""
        merged = rule_result.copy()
        
        # 合并基本信息
        if 'basic_info' in ai_result:
            if 'basic_info' not in merged:
                merged['basic_info'] = {}
            for key, value in ai_result['basic_info'].items():
                if not merged['basic_info'].get(key) and value:
                    merged['basic_info'][key] = value
        
        # 合并自我评价
        if 'summary' in ai_result and ai_result['summary']:
            if not merged.get('summary'):
                merged['summary'] = ai_result['summary']
            # 如果两者都有值，选择较长的那个
            elif len(ai_result['summary']) > len(merged['summary']):
                merged['summary'] = ai_result['summary']
        
        # 合并列表类型的字段
        list_fields = ['education', 'experience', 'projects', 'skills', 'certificates', 'awards']
        for field in list_fields:
            if field in ai_result and ai_result[field]:
                if field not in merged:
                    merged[field] = []
                # 对于列表类型，我们需要去重
                if isinstance(ai_result[field], list):
                    # 简单情况：纯字符串列表（如技能）
                    if field == 'skills' and all(isinstance(x, str) for x in ai_result[field]):
                        current_items = set(merged[field])
                        for item in ai_result[field]:
                            if item not in current_items:
                                merged[field].append(item)
                                current_items.add(item)
                    # 复杂情况：字典列表（如教育经历）
                    else:
                        # 尝试基于某些关键字段去重
                        key_fields = {
                            'education': ['school', 'major', 'time'],
                            'experience': ['company', 'position', 'time'],
                            'projects': ['name', 'time']
                        }
                        
                        if field in key_fields:
                            # 创建已有项的特征集合
                            existing_features = set()
                            for item in merged[field]:
                                feature = tuple(str(item.get(k, '')) for k in key_fields[field])
                                existing_features.add(feature)
                            
                            # 添加非重复项
                            for ai_item in ai_result[field]:
                                ai_feature = tuple(str(ai_item.get(k, '')) for k in key_fields[field])
                                if ai_feature not in existing_features:
                                    merged[field].append(ai_item)
                                    existing_features.add(ai_feature)
                        else:
                            # 对于没有明确去重标准的字段，简单合并
                            merged[field].extend(ai_result[field])
        
        return merged 

    def _is_empty_result(self, result: Dict[str, Any]) -> bool:
        """检查结果是否为空（没有任何有效内容）"""
        # 检查基本信息
        basic_info = result.get('basic_info', {})
        if not basic_info or all(v is None for v in basic_info.values()):
            # 基本信息为空
            # 检查其他关键部分是否也为空
            if (not result.get('education', []) and 
                not result.get('experience', []) and
                not result.get('skills', [])):
                return True
        
        return False
        
    def _generate_empty_result(self, error_message: str = None) -> Dict[str, Any]:
        """生成空结果模板，可包含错误信息"""
        result = {
            'basic_info': {
                'name': None,
                'age': None,
                'birth_date': None,
                'gender': None,
                'email': None,
                'phone': None,
                'wechat': None,
                'github': None,
                'linkedin': None,
                'website': None
            },
            'education': [],
            'experience': [],
            'skills': [],
            'projects': [],
            'certificates': [],
            'languages': [],
            'summary': "",
            'awards': []
        }
        
        if error_message:
            result['error'] = error_message
            
        return result 

async def perform_resume_parsing(file_path: str, resume_id: int, user_id: int, filename: str, content_type: str):
    """后台执行简历解析任务"""
    try:
        logger.info(f"开始执行简历 {resume_id} 的后台解析任务")
        
        # 导入必要的模块
        from app.db.session import get_db
        from app.models import Resume, User
        from sqlalchemy.orm import Session
        import tempfile
        import json
        from datetime import datetime
        
        # 获取数据库会话
        db = next(get_db())
        
        try:
            # 获取简历和用户记录
            resume = db.query(Resume).filter(Resume.id == resume_id).first()
            if not resume:
                logger.error(f"找不到ID为 {resume_id} 的简历记录")
                return
                
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"找不到ID为 {user_id} 的用户记录")
                return
                
            # 使用增强解析器解析简历
            parser = EnhancedResumeParser(use_ai_for_complex=True)
            
            # 重新打开文件
            with open(file_path, "rb") as f:
                file_content = f.read()
            
            # 使用临时文件
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            temp_file.write(file_content)
            temp_file.close()
            
            # 创建UploadFile对象 - 使用自定义类代替直接设置属性
            class CustomUploadFile(UploadFile):
                def __init__(self, filename, content_type, file):
                    super().__init__(filename=filename, file=file)
                    self._content_type = content_type
                
                @property
                def content_type(self):
                    return self._content_type
            
            # 创建符合要求的UploadFile对象
            file_obj = CustomUploadFile(
                filename=filename,
                content_type=content_type,
                file=open(temp_file.name, "rb")
            )
            
            # 解析简历
            result = await parser.parse(file_obj)
            
            # 关闭文件并删除临时文件
            file_obj.file.close()
            os.unlink(temp_file.name)
            
            # 如果解析成功，保存解析结果到简历记录
            if result and not result.get("error"):
                # 提取关键信息
                basic_info = result.get("basic_info", {})
                skills = result.get("skills", [])
                experience = result.get("experience", [])
                education = result.get("education", [])
                
                # 保存到简历记录
                resume.parsed_data = json.dumps(result, ensure_ascii=False)
                resume.last_parsed_at = datetime.now()
                
                # 如果有AI分析文件路径，保存到简历记录
                if "ai_analysis_file" in result:
                    resume.ai_analysis_file = result["ai_analysis_file"]
                    logger.info(f"保存AI分析文件路径: {result['ai_analysis_file']}")
                
                # 保存领域信息
                if "domain" in result:
                    resume.domain = result["domain"]
                
                # 添加提取的关键信息
                if basic_info:
                    # 更新用户信息
                    if basic_info.get("name") and not user.full_name:
                        user.full_name = basic_info.get("name")
                    
                    if basic_info.get("email") and not user.email:
                        user.email = basic_info.get("email")
                        
                    # 更新简历内容
                    resume_content = []
                    if basic_info:
                        resume_content.append(f"基本信息: {json.dumps(basic_info, ensure_ascii=False)}")
                    if education:
                        resume_content.append(f"教育经历: {json.dumps(education, ensure_ascii=False)}")
                    if experience:
                        resume_content.append(f"工作经验: {json.dumps(experience, ensure_ascii=False)}")
                    if skills:
                        resume_content.append(f"技能: {', '.join(skills)}")
                        
                    resume.content = "\n\n".join(resume_content)
                
                # 保存更改
                db.add(resume)
                db.add(user)
                db.commit()
                
                logger.info(f"简历 {resume_id} 自动解析完成并保存结果")
            else:
                logger.warning(f"简历 {resume_id} 自动解析失败: {result.get('error', '未知错误')}")
                
        except Exception as e:
            logger.error(f"解析简历 {resume_id} 时出错: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            
        finally:
            # 关闭数据库会话
            db.close()
            
    except Exception as e:
        logger.error(f"执行后台解析任务时出错: {str(e)}")
        import traceback
        logger.error(traceback.format_exc()) 