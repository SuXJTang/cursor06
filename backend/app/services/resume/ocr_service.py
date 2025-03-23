"""
OCR服务 - 用于从图像中提取文本
支持多种OCR引擎，包括EasyOCR(主要)和百度OCR(备选)
"""

from typing import List, Optional, Dict, Any, Tuple
from abc import ABC, abstractmethod
import os
import logging
import tempfile
import asyncio
from pathlib import Path
import uuid
import traceback

# PDF转图像需要的库
try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    logging.warning("pdf2image库未安装，PDF转图像功能将不可用")

# PDF直接文本提取需要的库
try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    try:
        from PyPDF2 import PdfReader
        PYPDF2_AVAILABLE = True
    except ImportError:
        PYPDF2_AVAILABLE = False
        PDFPLUMBER_AVAILABLE = False
        logging.warning("pdfplumber和PyPDF2库均未安装，PDF直接文本提取功能将不可用")
    else:
        PDFPLUMBER_AVAILABLE = False
        logging.info("将使用PyPDF2进行PDF文本提取")
else:
    PYPDF2_AVAILABLE = False
    logging.info("将使用pdfplumber进行PDF文本提取")

# Word转PDF需要的库
try:
    from docx2pdf import convert as docx2pdf_convert
    DOCX2PDF_AVAILABLE = True
except ImportError:
    DOCX2PDF_AVAILABLE = False
    logging.warning("docx2pdf库未安装，Word转PDF功能将不可用")

logger = logging.getLogger(__name__)

class OCREngine(ABC):
    """OCR引擎基类"""
    
    @abstractmethod
    async def extract_text(self, image_path: str) -> str:
        """提取图像中的文本 (异步方法)"""
        pass
    
    @abstractmethod
    def extract_text_sync(self, image_path: str) -> str:
        """提取图像中的文本 (同步方法)"""
        pass

class EasyOCREngine(OCREngine):
    """EasyOCR引擎实现"""
    
    def __init__(self):
        """初始化EasyOCR引擎"""
        try:
            import easyocr
            self.reader = easyocr.Reader(['ch_sim', 'en'])  # 支持中文和英文
            self.available = True
            logger.info("EasyOCR引擎初始化成功")
        except ImportError:
            self.available = False
            logger.warning("EasyOCR库未安装，此引擎将不可用")
        except Exception as e:
            self.available = False
            logger.error(f"EasyOCR引擎初始化失败: {str(e)}")
    
    async def extract_text(self, image_path: str) -> str:
        """提取图像中的文本 (异步版本)"""
        if not self.available:
            return ""
        
        try:
            # 使用异步方式调用同步函数
            def _sync_extract():
                results = self.reader.readtext(image_path)
                return " ".join([text for _, text, _ in results])
            
            # 在线程池中执行同步函数
            text = await asyncio.to_thread(_sync_extract)
            logger.info(f"EasyOCR成功提取文本，长度: {len(text)}")
            return text
        except Exception as e:
            logger.error(f"EasyOCR提取失败: {str(e)}")
            return ""
    
    def extract_text_sync(self, image_path: str) -> str:
        """提取图像中的文本 (同步版本)"""
        if not self.available:
            return ""
        
        try:
            # 直接调用同步函数
            results = self.reader.readtext(image_path)
            text = " ".join([text for _, text, _ in results])
            logger.info(f"EasyOCR成功提取文本，长度: {len(text)}")
            return text
        except Exception as e:
            logger.error(f"EasyOCR提取失败: {str(e)}")
            return ""

class BaiduOCREngine(OCREngine):
    """百度OCR引擎实现（备选）"""
    
    def __init__(self, app_id=None, api_key=None, secret_key=None):
        """初始化百度OCR引擎"""
        self.app_id = app_id or os.environ.get("BAIDU_OCR_APP_ID")
        self.api_key = api_key or os.environ.get("BAIDU_OCR_API_KEY")
        self.secret_key = secret_key or os.environ.get("BAIDU_OCR_SECRET_KEY")
        
        # 检查凭据是否完整
        self.available = all([self.app_id, self.api_key, self.secret_key])
        
        if self.available:
            try:
                from aip import AipOcr
                self.client = AipOcr(self.app_id, self.api_key, self.secret_key)
                logger.info("百度OCR引擎初始化成功")
            except ImportError:
                self.available = False
                logger.warning("百度OCR SDK未安装，此引擎将不可用")
            except Exception as e:
                self.available = False
                logger.error(f"百度OCR引擎初始化失败: {str(e)}")
        else:
            logger.warning("百度OCR凭据不完整，此引擎将不可用")
    
    async def extract_text(self, image_path: str) -> str:
        """提取图像中的文本"""
        if not self.available:
            return ""
        
        try:
            # 读取图片
            def _sync_extract():
                with open(image_path, 'rb') as fp:
                    image = fp.read()
                
                # 调用通用文字识别高精度版
                result = self.client.basicAccurate(image)
                
                # 提取文本
                if 'words_result' in result:
                    return " ".join([item['words'] for item in result['words_result']])
                return ""
            
            # 在线程池中执行同步函数
            text = await asyncio.to_thread(_sync_extract)
            logger.info(f"百度OCR成功提取文本，长度: {len(text)}")
            return text
        except Exception as e:
            logger.error(f"百度OCR提取失败: {str(e)}")
            return ""

    def extract_text_sync(self, image_path: str) -> str:
        """提取图像中的文本 (同步版本)"""
        if not self.available:
            return ""
        
        try:
            # 直接调用同步函数
            results = self.client.basicAccurate(image_path)
            text = " ".join([item['words'] for item in results['words_result']])
            logger.info(f"百度OCR成功提取文本，长度: {len(text)}")
            return text
        except Exception as e:
            logger.error(f"百度OCR提取失败: {str(e)}")
            return ""

class OCRService:
    """
    OCR服务：整合多个OCR引擎，支持各种文档格式
    """
    
    def __init__(
        self, 
        primary_engine: str = "easyocr",
        ocr_texts_dir: str = None,
        save_ocr_text: bool = False
    ):
        """
        初始化OCR服务
        
        Args:
            primary_engine: 主OCR引擎，默认为EasyOCR
            ocr_texts_dir: OCR文本保存目录
            save_ocr_text: 是否自动保存OCR文本，默认为False
        """
        # 设置OCR文本保存目录
        self.ocr_texts_dir = ocr_texts_dir or os.path.join(os.getcwd(), "data", "ocr_texts")
        self.save_ocr_text = save_ocr_text
        
        # 记录OCR文本保存配置
        logger.info(f"OCR文本将保存到: {self.ocr_texts_dir}")
        if self.save_ocr_text:
            logger.info("OCR文本自动保存已启用")
        else:
            logger.info("OCR文本自动保存已禁用")
        
        # 创建临时目录
        self.temp_dir = tempfile.mkdtemp()
        logger.debug(f"创建OCR临时目录: {self.temp_dir}")
        
        # 初始化引擎字典和备选引擎列表
        self.engines = {}
        self.fallback_engines = []
        self.primary_engine = primary_engine
        
        # 尝试初始化EasyOCR引擎
        try:
            self.engines["easyocr"] = EasyOCREngine()
            if not self.engines["easyocr"].available:
                logger.warning("EasyOCR引擎不可用")
                if primary_engine == "easyocr":
                    primary_engine = "baidu"  # 如果主引擎不可用，尝试切换到备选引擎
            else:
                logger.info("EasyOCR引擎就绪")
                self.fallback_engines.append("easyocr")
        except Exception as e:
            logger.error(f"初始化EasyOCR引擎失败: {str(e)}")
        
        # 尝试初始化百度OCR引擎
        try:
            self.engines["baidu"] = BaiduOCREngine()
            if not self.engines["baidu"].available:
                logger.warning("百度OCR引擎不可用")
            else:
                logger.info("百度OCR引擎就绪")
                self.fallback_engines.append("baidu")
        except Exception as e:
            logger.error(f"初始化百度OCR引擎失败: {str(e)}")
        
        # 确保主引擎可用
        if primary_engine not in self.engines or not self.engines[primary_engine].available:
            logger.warning(f"指定的主引擎 {primary_engine} 不可用，尝试使用其他可用引擎")
            # 尝试找到可用的引擎作为主引擎
            for engine_name, engine in self.engines.items():
                if engine.available:
                    self.primary_engine = engine_name
                    logger.info(f"自动选择 {engine_name} 作为主引擎")
                    break
            else:
                logger.error("所有OCR引擎都不可用，OCR功能将不可用")
        else:
            self.primary_engine = primary_engine
            logger.info(f"使用 {primary_engine} 作为主OCR引擎")
        
        # 设置备选引擎列表，不包括主引擎
        self.fallback_engines = [e for e in self.fallback_engines if e != self.primary_engine]
        
        # 检查PDF依赖是否可用
        if not PDF2IMAGE_AVAILABLE:
            logger.warning("pdf2image库未安装，PDF提取功能可能受限")
        
        if not DOCX2PDF_AVAILABLE:
            logger.warning("docx2pdf库未安装，Word文档提取功能可能受限")
    
    async def document_to_images(self, file_path: str) -> List[str]:
        """将文档转换为图像列表"""
        file_ext = Path(file_path).suffix.lower()
        images = []
        
        try:
            if file_ext == '.pdf':
                if not PDF2IMAGE_AVAILABLE:
                    logger.error("pdf2image库未安装，无法将PDF转换为图像")
                    return []
                
                # 针对Windows系统设置Poppler路径
                poppler_path = None
                if os.name == 'nt':  # Windows系统
                    # 尝试几个常见的Poppler安装路径
                    possible_paths = [
                        r"C:\poppler\poppler-23.11.0\Library\bin",
                        r"C:\poppler\Library\bin",
                        r"C:\Program Files\poppler\bin",
                        r"C:\poppler\bin",
                    ]
                    for path in possible_paths:
                        if os.path.exists(path):
                            poppler_path = path
                            logger.info(f"找到Poppler路径: {path}")
                            break
                
                # 定义同步函数以在线程池中执行
                def _convert_pdf():
                    # PDF转图像，使用更高分辨率提高质量
                    if poppler_path:
                        logger.info(f"使用Poppler路径: {poppler_path}")
                        pdf_images = convert_from_path(file_path, dpi=400, poppler_path=poppler_path)
                    else:
                        logger.info("使用默认配置将PDF转换为图像")
                        pdf_images = convert_from_path(file_path, dpi=400)
                    
                    result_images = []
                    for i, img in enumerate(pdf_images):
                        img_path = os.path.join(self.temp_dir, f"page_{i}.png")
                        img.save(img_path, 'PNG', quality=100)  # 使用最高质量保存
                        result_images.append(img_path)
                        logger.info(f"已保存PDF第 {i+1} 页图像: {img_path}")
                    return result_images
                
                # 在线程池中执行同步函数
                images = await asyncio.to_thread(_convert_pdf)
            
            elif file_ext in ['.docx', '.doc']:
                if not DOCX2PDF_AVAILABLE or not PDF2IMAGE_AVAILABLE:
                    logger.error("缺少必要的库，无法将Word转换为图像")
                    return []
                
                # 定义同步函数以在线程池中执行
                def _convert_word():
                    # Word转PDF
                    pdf_path = os.path.join(self.temp_dir, f"{uuid.uuid4()}.pdf")
                    docx2pdf_convert(file_path, pdf_path)
                    logger.info(f"已将Word转换为PDF: {pdf_path}")
                    
                    # 针对Windows系统设置Poppler路径
                    _poppler_path = None
                    if os.name == 'nt':  # Windows系统
                        # 尝试几个常见的Poppler安装路径
                        _possible_paths = [
                            r"C:\poppler\poppler-23.11.0\Library\bin",
                            r"C:\poppler\Library\bin",
                            r"C:\Program Files\poppler\bin",
                            r"C:\poppler\bin",
                        ]
                        for path in _possible_paths:
                            if os.path.exists(path):
                                _poppler_path = path
                                logger.info(f"找到Poppler路径: {path}")
                                break
                    
                    # PDF转图像，使用更高分辨率提高质量
                    result_images = []
                    if _poppler_path:
                        logger.info(f"使用Poppler路径: {_poppler_path}")
                        pdf_images = convert_from_path(pdf_path, dpi=400, poppler_path=_poppler_path)
                    else:
                        pdf_images = convert_from_path(pdf_path, dpi=400)
                    
                    for i, img in enumerate(pdf_images):
                        img_path = os.path.join(self.temp_dir, f"page_{i}.png")
                        img.save(img_path, 'PNG', quality=100)  # 使用最高质量保存
                        result_images.append(img_path)
                        logger.info(f"已保存Word第 {i+1} 页图像: {img_path}")
                    
                    # 删除临时PDF
                    os.remove(pdf_path)
                    return result_images
                
                # 在线程池中执行同步函数
                images = await asyncio.to_thread(_convert_word)
            
            else:
                logger.error(f"不支持的文件格式: {file_ext}")
        
        except Exception as e:
            logger.error(f"文档转图像失败: {str(e)}")
            logger.error(traceback.format_exc())
        
        return images
    
    async def extract_text(self, image_path: str) -> str:
        """使用OCR引擎提取图像中的文本"""
        # 尝试主引擎
        if self.primary_engine in self.engines:
            text = await self.engines[self.primary_engine].extract_text(image_path)
            if text:
                return text
        
        # 尝试备选引擎
        for engine_name in self.fallback_engines:
            if engine_name in self.engines:
                text = await self.engines[engine_name].extract_text(image_path)
                if text:
                    return text
        
        return ""
    
    async def _extract_with_engine(self, engine_name: str, image_path: str) -> str:
        """使用指定引擎提取图像中的文本"""
        if engine_name not in self.engines:
            logger.warning(f"引擎 {engine_name} 不可用")
            return ""
        
        try:
            text = await self.engines[engine_name].extract_text(image_path)
            if text:
                logger.info(f"使用 {engine_name} 引擎提取文本成功，长度: {len(text)}")
                return text
            
            logger.warning(f"使用 {engine_name} 引擎提取文本失败，尝试备选引擎")
            
            # 尝试备选引擎
            for fallback_engine in self.fallback_engines:
                if fallback_engine in self.engines and fallback_engine != engine_name:
                    text = await self.engines[fallback_engine].extract_text(image_path)
                    if text:
                        logger.info(f"使用备选引擎 {fallback_engine} 提取文本成功，长度: {len(text)}")
                        return text
            
            logger.error("所有引擎都无法提取文本")
            return ""
        except Exception as e:
            logger.error(f"使用 {engine_name} 引擎提取文本出错: {str(e)}")
            return ""
    
    def extract_text_from_document(self, file_path: str) -> str:
        """
        从文档中提取文本
        
        Args:
            file_path: 文档文件路径
            
        Returns:
            提取的文本内容
        """
        try:
            # 转换文档为图像
            images = []
            
            # 检查文件路径是否存在
            if not os.path.exists(file_path):
                logger.error(f"文件不存在: {file_path}")
                return ""
            
            # 获取文件扩展名
            file_ext = Path(file_path).suffix.lower()
            
            if file_ext == '.pdf':
                # 使用同步方式转换文档为图像
                if not PDF2IMAGE_AVAILABLE:
                    logger.error("pdf2image库未安装，无法将PDF转换为图像")
                    return ""
                
                # 针对Windows系统设置Poppler路径
                poppler_path = None
                if os.name == 'nt':  # Windows系统
                    # 尝试几个常见的Poppler安装路径
                    possible_paths = [
                        r"C:\poppler\poppler-23.11.0\Library\bin",
                        r"C:\poppler\Library\bin",
                        r"C:\Program Files\poppler\bin",
                        r"C:\poppler\bin",
                    ]
                    for path in possible_paths:
                        if os.path.exists(path):
                            poppler_path = path
                            logger.info(f"找到Poppler路径: {path}")
                            break
                
                # PDF转图像
                try:
                    if poppler_path:
                        logger.info(f"使用Poppler路径: {poppler_path}")
                        pdf_images = convert_from_path(file_path, dpi=300, poppler_path=poppler_path)
                    else:
                        logger.info("使用默认配置将PDF转换为图像")
                        pdf_images = convert_from_path(file_path, dpi=300)
                    
                    for i, img in enumerate(pdf_images):
                        img_path = os.path.join(self.temp_dir, f"page_{i}.png")
                        img.save(img_path, 'PNG')
                        images.append(img_path)
                        logger.info(f"已保存PDF第 {i+1} 页图像: {img_path}")
                except Exception as e:
                    logger.error(f"PDF转换为图像失败: {str(e)}")
                    return ""
                
            # 从每个图像中提取文本
            all_text = []
            for img_path in images:
                try:
                    # 使用同步方法提取文本，而不是在事件循环中调用asyncio.run
                    engine = self.engines.get(self.primary_engine)
                    if engine:
                        text = engine.extract_text_sync(img_path)
                        if text:
                            all_text.append(text)
                except Exception as e:
                    logger.error(f"从图像提取文本失败: {str(e)}")
            
            # 合并所有文本
            combined_text = "\n\n".join(all_text)
            logger.info(f"OCR提取完成，获取文本 {len(combined_text)} 字符")
            
            # 清理临时图像文件
            for img_path in images:
                if os.path.exists(img_path):
                    os.remove(img_path)
            
            return combined_text
            
        except Exception as e:
            logger.error(f"OCR文本提取失败: {str(e)}")
            return ""
    
    async def direct_pdf_extraction(self, pdf_path: str) -> str:
        """直接从PDF文件中提取文本，不经过OCR

        Args:
            pdf_path: PDF文件路径

        Returns:
            str: 提取的文本内容
        """
        logger.info(f"尝试直接从PDF提取文本: {pdf_path}")
        
        if not os.path.exists(pdf_path):
            logger.error(f"PDF文件不存在: {pdf_path}")
            return ""
            
        try:
            # 使用pdfplumber提取文本(更准确)
            if PDFPLUMBER_AVAILABLE:
                logger.info("使用pdfplumber提取PDF文本")
                return await asyncio.to_thread(self._extract_with_pdfplumber, pdf_path)
            
            # 使用PyPDF2提取文本(备选)
            elif PYPDF2_AVAILABLE:
                logger.info("使用PyPDF2提取PDF文本")
                return await asyncio.to_thread(self._extract_with_pypdf2, pdf_path)
            
            else:
                logger.warning("未安装PDF文本提取库，无法直接提取PDF文本")
                return ""
                
        except Exception as e:
            logger.error(f"直接提取PDF文本失败: {str(e)}")
            logger.error(traceback.format_exc())
            return ""
    
    def _extract_with_pdfplumber(self, pdf_path: str) -> str:
        """使用pdfplumber从PDF中提取文本"""
        all_text = []
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                if text.strip():
                    all_text.append(text)
                    logger.info(f"从PDF第{i+1}页提取了{len(text)}个字符")
                else:
                    logger.warning(f"PDF第{i+1}页文本为空")
        
        combined_text = "\n\n".join(all_text)
        logger.info(f"PDF直接文本提取完成，共{len(combined_text)}个字符")
        return combined_text
    
    def _extract_with_pypdf2(self, pdf_path: str) -> str:
        """使用PyPDF2从PDF中提取文本"""
        all_text = []
        pdf = PdfReader(pdf_path)
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            if text.strip():
                all_text.append(text)
                logger.info(f"从PDF第{i+1}页提取了{len(text)}个字符")
            else:
                logger.warning(f"PDF第{i+1}页文本为空")
        
        combined_text = "\n\n".join(all_text)
        logger.info(f"PDF直接文本提取完成，共{len(combined_text)}个字符")
        return combined_text

    async def extract_text_from_document_async(self, file_path: str) -> str:
        """从文档异步提取文本
        
        Args:
            file_path: 文档路径
            
        Returns:
            str: 提取的文本
        """
        logger.info(f"开始从文档提取文本: {file_path}")
        
        # 确保OCR文本保存目录存在
        if self.save_ocr_text:
            os.makedirs(self.ocr_texts_dir, exist_ok=True)
        
        try:
            # 获取文件扩展名
            file_ext = Path(file_path).suffix.lower()
            
            # PDF文件：先尝试直接提取，如果文本长度不足再使用OCR
            if file_ext == '.pdf':
                # 1. 首先尝试直接从PDF提取文本
                if PDFPLUMBER_AVAILABLE or PYPDF2_AVAILABLE:
                    direct_text = await self.direct_pdf_extraction(file_path)
                    
                    # 如果直接提取的文本长度足够，直接返回
                    if direct_text and len(direct_text) > 100:  # 至少包含100个字符才视为有效
                        logger.info(f"PDF直接提取文本成功，长度: {len(direct_text)}，跳过OCR")
                        return direct_text
                    else:
                        logger.warning(f"PDF直接提取文本质量不足，长度: {len(direct_text)}，将使用OCR")
            
            # Word文件：先转换为PDF再处理
            elif file_ext in ['.docx', '.doc']:
                if DOCX2PDF_AVAILABLE:
                    # 转换为PDF
                    pdf_path = os.path.join(self.temp_dir, f"{uuid.uuid4()}.pdf")
                    logger.info(f"开始将Word转换为PDF: {file_path} -> {pdf_path}")
                    
                    try:
                        await asyncio.to_thread(docx2pdf_convert, file_path, pdf_path)
                        logger.info(f"Word转PDF成功: {pdf_path}")
                        
                        # 尝试从转换后的PDF直接提取文本
                        if PDFPLUMBER_AVAILABLE or PYPDF2_AVAILABLE:
                            direct_text = await self.direct_pdf_extraction(pdf_path)
                            
                            # 如果直接提取的文本长度足够，直接返回
                            if direct_text and len(direct_text) > 100:
                                logger.info(f"Word转PDF后直接提取文本成功，长度: {len(direct_text)}，跳过OCR")
                                # 清理临时PDF
                                try:
                                    os.remove(pdf_path)
                                except Exception as e:
                                    logger.warning(f"清理临时PDF失败: {str(e)}")
                                return direct_text
                            else:
                                logger.warning(f"Word转PDF后直接提取文本质量不足，长度: {len(direct_text)}，将使用OCR")
                        
                        # 改用转换后的PDF路径进行后续OCR处理
                        file_path = pdf_path
                    except Exception as e:
                        logger.error(f"Word转PDF失败: {str(e)}")
                        # 继续使用原始Word文件进行OCR
            
            # 将文档转换为图像列表进行OCR
            image_paths = await self.document_to_images(file_path)
            
            if not image_paths:
                logger.error("文档转换为图像失败，无法继续OCR处理")
                return ""
            
            logger.info(f"文档已转换为 {len(image_paths)} 张图像")
            
            # 从图像中提取文本
            extracted_text = await self.extract_text_from_images(image_paths)
            
            # 清理临时图像文件
            for img_path in image_paths:
                try:
                    os.remove(img_path)
                except Exception as e:
                    logger.warning(f"清理临时图像失败 {img_path}: {str(e)}")
            
            # 清理临时PDF文件(如果是从Word转换的)
            if file_ext in ['.docx', '.doc'] and DOCX2PDF_AVAILABLE and file_path.startswith(self.temp_dir):
                try:
                    os.remove(file_path)
                    logger.info(f"已清理临时PDF文件: {file_path}")
                except Exception as e:
                    logger.warning(f"清理临时PDF文件失败: {str(e)}")
            
            # 只有当save_ocr_text为True时才保存OCR文本
            if self.save_ocr_text and extracted_text:
                # 生成唯一标识符并保存提取的OCR文本
                file_id = str(uuid.uuid4())
                save_path = os.path.join(self.ocr_texts_dir, f"{file_id}.txt")
                
                with open(save_path, "w", encoding="utf-8") as f:
                    f.write(extracted_text)
                
                logger.info(f"OCR文本已保存至: {save_path}")
            else:
                if not extracted_text:
                    logger.warning("OCR提取的文本为空")
                else:
                    logger.info(f"OCR文本自动保存已禁用，不保存OCR文本文件")
            
            return extracted_text
        
        except Exception as e:
            logger.error(f"文档文本提取过程失败: {str(e)}")
            logger.error(traceback.format_exc())
            return ""
    
    def cleanup(self):
        """清理临时文件和目录"""
        try:
            if os.path.exists(self.temp_dir):
                # 删除目录中的所有文件
                for file_name in os.listdir(self.temp_dir):
                    file_path = os.path.join(self.temp_dir, file_name)
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                
                # 删除目录
                os.rmdir(self.temp_dir)
                logger.info(f"已清理OCR临时目录: {self.temp_dir}")
        except Exception as e:
            logger.error(f"清理OCR临时文件失败: {str(e)}")
    
    def __del__(self):
        """析构函数 - 清理临时目录"""
        try:
            import shutil
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
                logger.info(f"已删除OCR临时目录: {self.temp_dir}")
        except Exception as e:
            logger.error(f"删除OCR临时目录失败: {str(e)}")

    async def extract_text_from_images(self, image_paths: List[str]) -> str:
        """从图像列表中提取文本"""
        if not image_paths:
            logger.error("没有图像可供OCR处理")
            return ""
        
        all_text = []
        
        # 首先尝试主OCR引擎
        try:
            # 确保主引擎名称是str类型
            if isinstance(self.primary_engine, str) and self.primary_engine in self.engines:
                engine = self.engines[self.primary_engine]
                logger.info(f"正在使用主OCR引擎（{self.primary_engine}）提取文本")
                
                # 创建协程列表
                tasks = [engine.extract_text(img_path) for img_path in image_paths]
                
                # 使用asyncio.gather并行执行所有协程
                results = await asyncio.gather(*tasks)
                
                # 收集所有结果
                for result in results:
                    if result and result.strip():  # 只添加非空文本
                        all_text.append(result)
                
                if all_text:  # 如果主引擎已提取到文本，则返回
                    combined_text = "\n\n".join(all_text)
                    logger.info(f"主OCR引擎成功提取文本，总长度: {len(combined_text)} 字符")
                    return combined_text
                else:
                    logger.warning("主OCR引擎未能提取到文本，将尝试备用OCR引擎")
            else:
                logger.warning(f"主OCR引擎 {self.primary_engine} 不可用或类型不正确")
                
        except Exception as e:
            logger.error(f"主OCR引擎提取文本失败: {str(e)}")
            logger.error(traceback.format_exc())
        
        # 如果主OCR引擎失败或未提取到文本，尝试备用OCR引擎
        if self.fallback_engines:
            for fallback_engine_name in self.fallback_engines:
                if isinstance(fallback_engine_name, str) and fallback_engine_name in self.engines:
                    try:
                        engine = self.engines[fallback_engine_name]
                        logger.info(f"正在使用备用OCR引擎（{fallback_engine_name}）提取文本")
                        
                        # 创建协程列表
                        tasks = [engine.extract_text(img_path) for img_path in image_paths]
                        
                        # 使用asyncio.gather并行执行所有协程
                        results = await asyncio.gather(*tasks)
                        
                        # 收集所有结果
                        backup_text = []
                        for result in results:
                            if result and result.strip():  # 只添加非空文本
                                backup_text.append(result)
                        
                        if backup_text:
                            combined_text = "\n\n".join(backup_text)
                            logger.info(f"备用OCR引擎成功提取文本，总长度: {len(combined_text)} 字符")
                            return combined_text
                    except Exception as e:
                        logger.error(f"备用OCR引擎 {fallback_engine_name} 提取文本失败: {str(e)}")
                        logger.error(traceback.format_exc())
            
            logger.error("所有备用OCR引擎都未能提取到文本")
            return ""
        else:
            logger.warning("未配置备用OCR引擎，无法继续尝试文本提取")
            return "" 