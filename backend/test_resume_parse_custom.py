import asyncio
import logging
import sys
import os
from app.services.resume.ocr_service import OCRService
from app.services.resume.deep_seek_service import DeepSeekService
from app.services.resume.ocr_ai_parser import OCRAIParser
from app.core.config import settings

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

async def test_resume_parse(file_path):
    """测试简历解析功能"""
    print(f"测试文件: {file_path}")
    print(f"文件存在: {os.path.exists(file_path)}")
    
    # 创建必要的目录
    ai_responses_dir = os.path.join("data", "ai_responses")
    ocr_texts_dir = os.path.join("data", "ocr_texts")
    results_dir = os.path.join("data", "resume_results")
    
    os.makedirs(ai_responses_dir, exist_ok=True)
    os.makedirs(ocr_texts_dir, exist_ok=True)
    os.makedirs(results_dir, exist_ok=True)
    
    print(f"AI响应目录: {ai_responses_dir}")
    print(f"OCR文本目录: {ocr_texts_dir}")
    print(f"结果保存目录: {results_dir}")
    
    # 创建OCR服务
    ocr_service = OCRService(primary_engine="easyocr", save_ocr_text=False)
    
    # 检查引擎状态
    print(f"主引擎: {ocr_service.primary_engine}")
    print(f"可用引擎: {ocr_service.engines.keys()}")
    
    # 创建DeepSeek服务
    api_key = settings.DEEPSEEK_API_KEY if hasattr(settings, 'DEEPSEEK_API_KEY') else None
    if not api_key:
        api_key = os.getenv("DEEPSEEK_API_KEY")
        
    deepseek_service = DeepSeekService(
        api_key=api_key,
        api_url="https://api.deepseek.com/v1/chat/completions",
        model="deepseek-chat",
        ai_responses_dir=ai_responses_dir,
        save_raw_response=False  # 不保存原始响应文件
    )
    
    # 创建OCR+AI解析器
    parser = OCRAIParser(
        ocr_service=ocr_service,
        ai_extractor=deepseek_service,
        ocr_texts_dir=ocr_texts_dir,
        ai_responses_dir=ai_responses_dir,
        min_text_length=0
    )
    
    # 解析简历
    print("开始解析简历...")
    try:
        result = await parser.parse(file_path)
        print("解析成功！")
        print(f"结果类型: {type(result)}")
        print(f"结果长度: {len(result) if isinstance(result, dict) else 0}")
        print("结果预览:")
        import json
        print(json.dumps(result, ensure_ascii=False, indent=2)[:500] + "..." if isinstance(result, dict) and len(json.dumps(result)) > 500 else result)
    except Exception as e:
        print(f"解析失败: {str(e)}")
        import traceback
        print(traceback.format_exc())
    
    return "测试完成"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "测试简历/研究生精选简历_20250323142300.pdf"
    
    print(f"将解析文件: {file_path}")
    result = asyncio.run(test_resume_parse(file_path))
    print(result) 