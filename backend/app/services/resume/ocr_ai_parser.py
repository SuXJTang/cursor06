"""
OCR和AI结合的简历解析器
"""

import os
import logging
import json
import uuid
from typing import Dict, Any, Optional
from .ocr_service import OCRService

logger = logging.getLogger(__name__)

class OCRAIParser:
    """
    OCR和AI结合的简历解析器
    使用OCR服务提取文本，然后使用AI服务解析结构化数据
    """
    
    def __init__(
        self,
        ocr_service: OCRService,
        ai_extractor: Any,
        ocr_texts_dir: str = "data/ocr_texts",
        ai_responses_dir: str = "data/ai_responses",
        min_text_length: int = 0
    ):
        """
        初始化OCR+AI解析器
        
        Args:
            ocr_service: OCR服务实例
            ai_extractor: AI解析服务实例
            ocr_texts_dir: OCR文本保存目录
            ai_responses_dir: AI响应保存目录
            min_text_length: 最小文本长度要求
        """
        self.ocr_service = ocr_service
        self.ai_extractor = ai_extractor
        self.ocr_texts_dir = ocr_texts_dir
        self.ai_responses_dir = ai_responses_dir
        self.min_text_length = min_text_length
        
        # 确保目录存在
        os.makedirs(ocr_texts_dir, exist_ok=True)
        os.makedirs(ai_responses_dir, exist_ok=True)
    
    async def parse(self, file_path: str) -> Dict[str, Any]:
        """
        解析简历文件
        
        Args:
            file_path: 文件路径
            
        Returns:
            解析后的结构化数据
        """
        logger.info(f"开始OCR+AI解析文件: {file_path}")
        
        # 生成唯一ID
        parse_id = str(uuid.uuid4())
        
        # 步骤1: 使用OCR提取文本
        ocr_text = await self.ocr_service.extract_text(file_path)
        
        # 保存OCR文本
        ocr_text_path = os.path.join(self.ocr_texts_dir, f"{parse_id}.txt")
        with open(ocr_text_path, "w", encoding="utf-8") as f:
            f.write(ocr_text)
        
        logger.info(f"OCR文本提取完成，长度: {len(ocr_text)}，保存到: {ocr_text_path}")
        
        # 检查文本长度是否满足要求
        if len(ocr_text) < self.min_text_length:
            logger.warning(f"OCR文本长度({len(ocr_text)})小于最小要求({self.min_text_length})，放弃解析")
            return {
                "error": "提取的文本太短，无法进行有效解析",
                "ocr_text": ocr_text,
                "file_id": parse_id
            }
        
        # 步骤2: 使用AI解析结构化数据
        try:
            # 使用AI服务解析
            result = await self.ai_extractor.extract_resume_data(ocr_text)
            
            # 添加文件ID
            result["file_id"] = parse_id
            
            # 保存AI响应
            ai_response_path = os.path.join(self.ai_responses_dir, f"{parse_id}.json")
            with open(ai_response_path, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
                
            logger.info(f"AI解析完成，保存到: {ai_response_path}")
            
            return result
            
        except Exception as e:
            logger.error(f"AI解析失败: {str(e)}")
            return {
                "error": f"AI解析失败: {str(e)}",
                "ocr_text": ocr_text,
                "file_id": parse_id
            } 