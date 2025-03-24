"""
OCR+AI联合解析器 - 结合OCR和大语言模型的简历解析功能
将OCR提取的文本直接传递给DeepSeek进行结构化解析
"""

from typing import Dict, Any, List, Optional
import logging
import json
import asyncio
import traceback
import os
from pathlib import Path
import uuid
import re
import hashlib

from app.services.resume.ocr_service import OCRService
from app.services.resume.deepseek_service import DeepSeekService
from app.core.config import settings

logger = logging.getLogger(__name__)

class OCRAIParser:
    """
    OCR+AI联合解析器：结合OCR和AI，处理扫描版和图片型简历
    """
    
    def __init__(
        self, 
        ocr_service: OCRService = None,
        ai_extractor = None,
        min_text_length: int = 0,
        ocr_texts_dir: str = None,
        ai_responses_dir: str = None
    ):
        """
        初始化OCR和AI联合解析器
        
        Args:
            ocr_service: OCR服务实例，如果为None则创建新实例
            ai_extractor: AI分析器实例，如果为None则尝试使用环境变量创建
            min_text_length: OCR提取文本的最小长度要求
            ocr_texts_dir: OCR文本保存目录
            ai_responses_dir: AI响应保存目录
        """
        # 设置OCR服务
        self.ocr_service = ocr_service if ocr_service is not None else OCRService(primary_engine="easyocr", save_ocr_text=False)
        
        # 设置AI分析器
        self.ai_extractor = ai_extractor
        if self.ai_extractor is None:
            # 尝试从环境变量获取API密钥
            api_key = os.getenv("DEEPSEEK_API_KEY")
            if not api_key:
                logger.warning("未配置DeepSeek API密钥，AI分析功能将不可用")
            
            from app.services.resume.deep_seek_service import DeepSeekService
            self.ai_extractor = DeepSeekService(
                api_key=api_key,
                api_url="https://api.deepseek.com/v1/chat/completions",
                model="deepseek-chat",
                ai_responses_dir=ai_responses_dir,
                save_raw_response=False  # 不保存原始响应文件
            )
        
        # 设置文本最小长度要求
        self.min_text_length = min_text_length
        logger.info(f"设置OCR文本最小长度要求: {self.min_text_length}")
        
        # 设置保存目录
        # 设置保存目录 - 固定为当前项目目录下的data文件夹
        self.ocr_texts_dir = ocr_texts_dir or os.path.join('data', 'ocr_texts')
        self.ai_responses_dir = ai_responses_dir or os.path.join('data', 'ai_responses')
        
        # 确保目录存在
        os.makedirs(self.ocr_texts_dir, exist_ok=True)
        os.makedirs(self.ai_responses_dir, exist_ok=True)
        
        logger.info(f"OCR文本将保存到: {self.ocr_texts_dir}")
        logger.info(f"AI响应将保存到: {self.ai_responses_dir}")
        
        # 存储文件哈希到ID的映射
        self.file_hash_map = {}
        # 初始化现有文件的哈希映射
        self._init_hash_map()
        
        logger.info("OCR+AI联合解析器初始化完成")
    
    def _init_hash_map(self):
        """初始化已解析文件的哈希映射"""
        try:
            # 查找ai_responses目录中的所有JSON文件
            for file in os.listdir(self.ai_responses_dir):
                if file.endswith('.json') and not file.endswith('_deepseek_response.json'):
                    file_path = os.path.join(self.ai_responses_dir, file)
                    file_id = os.path.splitext(file)[0]
                    # 查找对应的OCR文本文件
                    ocr_file = os.path.join(self.ocr_texts_dir, f"{file_id}.txt")
                    if os.path.exists(ocr_file):
                        # 读取OCR文本
                        with open(ocr_file, 'r', encoding='utf-8') as f:
                            ocr_text = f.read()
                        # 计算哈希值
                        file_hash = self._calculate_hash(ocr_text)
                        # 保存映射
                        self.file_hash_map[file_hash] = file_id
                        logger.info(f"已加载解析结果映射: Hash {file_hash[:8]}... -> ID {file_id}")
        except Exception as e:
            logger.error(f"初始化文件哈希映射失败: {str(e)}")
    
    def _calculate_hash(self, content: str) -> str:
        """计算内容哈希值"""
        return hashlib.md5(content.encode('utf-8')).hexdigest()
    
    async def parse(self, file_path: str) -> Dict:
        """
        解析简历文件
        
        Args:
            file_path: 简历文件路径
            
        Returns:
            Dict: 解析结果
        """
        logger.info(f"开始OCR和AI解析简历: {file_path}")
        
        # 确保目录存在
        os.makedirs(self.ocr_texts_dir, exist_ok=True)
        os.makedirs(self.ai_responses_dir, exist_ok=True)
        
        try:
            # 检查文件是否存在
            if not os.path.exists(file_path):
                logger.error(f"文件不存在: {file_path}")
                raise ValueError(f"文件不存在: {file_path}")
            
            # 首先尝试使用文件路径作为哈希键（快速检查）
            file_path_hash = self._calculate_hash(file_path)
            if file_path_hash in self.file_hash_map:
                # 尝试直接读取现有的解析结果
                existing_file_id = self.file_hash_map[file_path_hash]
                ai_response_path = os.path.join(self.ai_responses_dir, f"{existing_file_id}.json")
                if os.path.exists(ai_response_path):
                    try:
                        with open(ai_response_path, "r", encoding="utf-8") as f:
                            result = json.load(f)
                        logger.info(f"找到相同文件路径的解析结果，直接返回: {ai_response_path}")
                        return result
                    except Exception as e:
                        logger.warning(f"读取现有解析结果失败: {str(e)}，将继续解析")
            
            # 提取文本
            logger.info(f"开始从文件提取文本: {file_path}")
            logger.info(f"使用OCR服务: {self.ocr_service.__class__.__name__}, 主要引擎: {self.ocr_service.primary_engine}")
            
            try:
                # 确保OCR服务不会自动保存文本文件
                extracted_text = await self.ocr_service.extract_text_from_document_async(file_path)
                logger.info(f"OCR文本提取结果长度: {len(extracted_text) if extracted_text else 0}")
            except Exception as ocr_error:
                logger.error(f"OCR文本提取过程中出错: {str(ocr_error)}")
                logger.error(traceback.format_exc())
                raise ValueError(f"OCR文本提取失败: {str(ocr_error)}")
            
            if not extracted_text:
                logger.error("OCR文本提取失败，无法继续解析")
                raise ValueError("OCR文本提取失败")
            
            # 计算文本哈希值
            text_hash = self._calculate_hash(extracted_text)
            logger.info(f"OCR文本哈希值: {text_hash[:8]}...")
            
            # 检查是否已解析过相同内容的文件
            if text_hash in self.file_hash_map:
                existing_file_id = self.file_hash_map[text_hash]
                logger.info(f"发现已解析过的相同内容文件，ID: {existing_file_id}")
                
                # 读取现有的AI解析结果
                ai_response_path = os.path.join(self.ai_responses_dir, f"{existing_file_id}.json")
                if os.path.exists(ai_response_path):
                    try:
                        with open(ai_response_path, "r", encoding="utf-8") as f:
                            result = json.load(f)
                        logger.info(f"成功读取现有解析结果: {ai_response_path}")
                        return result
                    except Exception as e:
                        logger.warning(f"读取现有解析结果失败: {str(e)}，将重新解析")
                        # 如果读取失败，继续执行重新解析
                else:
                    logger.warning(f"找不到现有解析结果文件: {ai_response_path}，将重新解析")
            
            # 生成唯一文件标识符
            file_id = str(uuid.uuid4())
            
            # 保存OCR文本到统一管理的文件夹中
            ocr_text_path = os.path.join(self.ocr_texts_dir, f"{file_id}.txt")
            with open(ocr_text_path, "w", encoding="utf-8") as f:
                f.write(extracted_text)
            logger.info(f"OCR文本提取完成，新文件保存至: {ocr_text_path}")
            
            # 保存文件路径哈希和文本内容哈希，方便下次快速查找
            self.file_hash_map[file_path_hash] = file_id
            self.file_hash_map[text_hash] = file_id
            
            # 准备AI分析的提示词
            prompt = self._prepare_prompt(extracted_text)
            
            # 调用AI分析
            ai_response = await self.ai_extractor.analyze_text(prompt)
            
            # 保存AI响应
            ai_response_path = os.path.join(self.ai_responses_dir, f"{file_id}.json")
            
            # 处理AI响应
            result = {}
            if ai_response:
                # 清理响应并转换为JSON
                cleaned_response = self._clean_response_for_json(ai_response)
                
                # 尝试解析JSON
                try:
                    result = json.loads(cleaned_response)
                    
                    # 保存成功解析的结果
                    with open(ai_response_path, "w", encoding="utf-8") as f:
                        json.dump(result, f, ensure_ascii=False, indent=2)
                    
                    logger.info(f"AI解析成功，结果保存至: {ai_response_path}")
                except json.JSONDecodeError as e:
                    logger.error(f"AI响应JSON解析失败: {str(e)}")
                    
                    # 保存原始响应
                    with open(ai_response_path, "w", encoding="utf-8") as f:
                        f.write(ai_response)
                    
                    logger.info(f"已保存原始AI响应: {ai_response_path}")
                    raise ValueError(f"AI响应格式错误: {str(e)}")
                
                # 添加文件标识符
                result["file_id"] = file_id
                return result
            else:
                logger.error("AI分析失败，未返回有效响应")
                raise ValueError("AI分析失败，未返回有效响应")
        
        except Exception as e:
            logger.error(f"简历解析失败: {str(e)}")
            logger.error(traceback.format_exc())
            raise ValueError(f"简历解析失败: {str(e)}")
    
    def _prepare_prompt(self, text: str) -> str:
        """
        准备AI分析的提示词
        """
        return f"""
你是一个专业的简历分析专家。我现在给你一段通过OCR从扫描版简历或图片型简历中提取的文本。这段文本可能存在以下特点：
1. 包含大量的简历模板自带的提示文字，如"在此处添加你的工作经历"、"尽量简洁"、"使用数字说明成就"等
2. 可能包含一些因OCR识别错误导致的错别字或格式问题
3. 文本的顺序可能不完全符合简历原有的布局顺序
4. 这份简历很可能是一个模板，大部分字段未填写实际内容

**请分析以下所有文本，无论内容多少，都尝试提取有用信息。这是一份模板简历，需要你识别出哪些是真实信息，哪些是模板提示文字。**

请仔细分析这段文本，区分模板提示文字和实际填写内容，提取出有效的简历信息，并按照以下JSON格式返回结构化数据：

{{
  "basic_info": {{
    "name": "姓名",
    "age": "年龄",
    "gender": "性别",
    "ethnicity": "民族",
    "political_status": "政治面貌",
    "marital_status": "婚姻状况",
    "identity": "身份（如应届生等）",
    "location": "所在地/籍贯",
    "email": "电子邮箱",
    "phone": "电话号码",
    "address": "详细地址",
    "website": "个人网站/社交主页"
  }},
  "job_intention": {{
    "position": "期望职位",
    "industry": "期望行业",
    "location": "期望工作地点",
    "salary": "期望薪资"
  }},
  "education": [
    {{
      "school": "学校名称",
      "major": "专业",
      "degree": "学历/学位",
      "time": "起止时间",
      "description": "在校表现描述"
    }}
  ],
  "experience": [
    {{
      "company": "公司名称",
      "position": "职位",
      "time": "起止时间",
      "description": "工作职责描述",
      "salary": "薪资信息(如有)"
    }}
  ],
  "projects": [
    {{
      "name": "项目名称",
      "role": "担任角色",
      "time": "起止时间",
      "description": "项目描述与职责"
    }}
  ],
  "skills": ["技能1", "技能2", "技能3"],
  "certificates": ["证书1", "证书2", "证书3"],
  "languages": ["语言1及水平", "语言2及水平"],
  "awards": ["奖项1", "奖项2", "奖项3"],
  "summary": "自我评价/个人总结"
}}

重要规则：
1. 如果某个字段没有找到相关信息，或者只包含模板提示文字，请将其设置为空字符串或空数组
2. 明确识别并排除模板提示文字，如"详细描述你的职责范围"、"尽量简洁"、"可以在工作内容的第一句话加上简短的公司或主要产品介绍"等
3. 确保返回的数据是完全符合上述结构的有效JSON格式
4. 不要杜撰不存在的信息
5. 如果原文中某个条目（如工作经历）有明显的段落结构，请保留这种结构并合理处理
6. 不要在返回的数据中添加任何解释、说明或注释，仅返回JSON结构数据

识别模板提示文字的关键特征：
1. 包含指导性词语，如"例如"、"如"、"可以"、"应该"、"建议"、"尽量"等
2. 包含"填写"、"添加"、"描述"、"在此处"等提示性词语
3. 内容是一般性建议而非具体个人信息
4. 内容过于通用，适用于任何求职者

即使提取的有效内容很少，也请分析这段文本，尝试提取出实际的简历信息：

{text}
""" 

    def _clean_response_for_json(self, text: str) -> str:
        """
        清理AI响应文本，准备JSON解析
        
        Args:
            text: AI返回的原始文本
            
        Returns:
            str: 清理后的JSON文本
        """
        cleaned_text = text.strip()
        logger.info(f"开始清理AI响应文本，原始长度: {len(cleaned_text)}")
        
        # 移除JSON代码块标记
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
            logger.info("移除了开头的```json标记")
        elif cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]
            logger.info("移除了开头的```标记")
        
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
            logger.info("移除了结尾的```标记")
        
        # 清理前后的空白字符
        cleaned_text = cleaned_text.strip()
        
        # 查找JSON开始和结束的位置
        json_start = cleaned_text.find('{')
        json_end = cleaned_text.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            cleaned_text = cleaned_text[json_start:json_end]
            logger.info(f"提取JSON结构后的长度: {len(cleaned_text)}")
        
        # 尝试用宽松的JSON解析器
        try:
            import demjson3
            logger.info("尝试使用demjson3解析JSON...")
            try:
                # 设置宽松模式
                parsed_json = demjson3.decode(cleaned_text, strict=False)
                # 成功解析后重新转换为干净的JSON字符串
                import json
                clean_json = json.dumps(parsed_json, ensure_ascii=False)
                logger.info("demjson3解析成功")
                return clean_json
            except Exception as e:
                logger.error(f"demjson3解析失败: {str(e)}")
                # 尝试手动修复后再次解析
                cleaned_text = self._fix_common_json_issues(cleaned_text)
                return cleaned_text
        except ImportError:
            logger.warning("demjson3库未安装，无法使用宽松JSON解析")
            # 尝试手动修复
            cleaned_text = self._fix_common_json_issues(cleaned_text)
            return cleaned_text

    def _fix_common_json_issues(self, text: str) -> str:
        """手动修复常见的JSON格式问题"""
        logger.info("尝试手动修复JSON格式问题...")
        
        # 处理转义引号问题
        text = text.replace('\\"', '"')
        text = text.replace('\\\\', '\\')
        
        # 处理常见的格式问题
        # 1. 处理多余的换行和空格
        text = re.sub(r'\s+', ' ', text)
        
        # 2. 处理多余的逗号问题
        text = re.sub(r',\s*}', '}', text)
        text = re.sub(r',\s*]', ']', text)
        
        logger.info("JSON手动修复完成")
        return text 
