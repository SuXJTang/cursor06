# 简历解析功能说明文档

## 功能概述

系统提供了三种简历解析API：

1. `/api/v1/resume/parse` - 基础解析功能
2. `/api/v1/resume/parse-ai` - 增强型AI解析功能（需配置DeepSeek API）
3. `/api/v1/resume/parse-ocr` - OCR辅助解析功能（适用于扫描版PDF和图像型文档）

支持的文件格式：

- PDF（基础与AI模式仅支持文本版，OCR模式支持扫描版）
- DOCX/DOC（文本格式）
- HTML
- TXT

> **注意**：基础和AI增强功能仅支持文本版文档，不支持扫描版PDF或图片格式。如果有扫描版文档，可以使用系统内置的OCR功能，通过`/api/v1/resume/parse-ocr`接口解析。

## 架构设计

简历解析系统采用了模块化、分层的架构设计，主要包括以下组件：

### 1. API层

- 位于 `backend/app/api/v1/endpoints/resume.py`
- 提供HTTP接口，接收文件上传并调用解析服务
- 处理错误和异常，返回标准化响应

### 2. 解析器层

- 基础解析器（`ResumeParser`）
- 增强解析器（`EnhancedResumeParser`）

### 3. 处理组件

- 格式适配器（`FormatAdapter`/`EnhancedFormatAdapter`）：将不同格式的文件转换为统一文本
- 布局分析器（`LayoutAnalyzer`/`IntelligentLayoutAnalyzer`）：分析文档结构，识别各部分内容
- 信息提取器（`InfoExtractor`/`RuleExtractor`/`AIExtractor`）：从文本中提取结构化信息
- OCR服务（`OCRService`）：将图像或扫描文档转换为文本
- 后处理器（`PostProcessor`）：对提取结果进行清洗、验证和增强

## 处理流程

简历解析的处理流程如下：

1. **文件接收与验证**

   - 验证文件格式是否支持
   - 保存文件到临时目录
   
2. **文件转换**

   - 根据文件类型选择相应的解析方法
   - PDF：使用PyPDF2提取文本
   - DOCX：使用python-docx提取文本
   - HTML：使用BeautifulSoup提取文本
   - TXT：直接读取文本内容
   - 对于OCR模式，将文档转换为图像后使用OCR提取文本
   
3. **文档布局分析**

   - 将文本分割为多个逻辑块（如标题、段落、列表等）
   - 识别每个块的类型和所属章节
   - 提取块之间的层级关系
   
4. **信息提取**

   - 使用规则引擎提取基本信息（姓名、联系方式等）
   - 提取教育背景、工作经历、项目经验、技能等
   - 对于复杂内容，可选择性使用AI增强提取
   
5. **后处理与验证**

   - 验证提取信息的完整性和一致性
   - 补充和修正缺失或不准确的信息
   - 标准化日期、电话号码等格式
   
6. **结果组装与返回**

   - 组装结构化的JSON响应
   - 返回给客户端

## AI增强功能

增强型解析器引入了AI辅助功能（需配置DeepSeek API）：

- 可以处理更复杂、非标准化的简历格式
- 对规则引擎无法处理的内容进行补充提取
- 提供更智能的技能识别和匹配
- 自动评估简历质量和完整性

### AI解析流程

当使用AI增强解析时，系统执行以下流程：

1. 首先通过规则引擎提取基础信息
2. 评估简历复杂度（从SIMPLE到VERY_COMPLEX四个级别）
3. 对于复杂度在COMPLEX或VERY_COMPLEX级别的简历，或者基础信息不完整的简历，触发AI辅助提取
4. 将简历全文发送给DeepSeek API进行分析
5. 合并规则引擎和AI提取的结果，确保信息的完整性和准确性

### 复杂度评估算法

系统使用以下指标评估简历复杂度：

- 文档块的类型多样性（40%权重）
- 平均文本块长度（30%权重）
- 特殊字符比例（20%权重）
- 文档块连贯性（10%权重）

这种多维度评估确保了对简历复杂性的准确判断，从而决定是否需要AI辅助解析。

## OCR辅助功能

OCR辅助解析引入了图像识别技术，可以处理以下类型的文档：

- 扫描版PDF文件
- 图像内嵌式PDF文件
- 特殊布局的Word文档

### OCR处理流程

当使用OCR辅助解析时，系统执行以下流程：

1. 首先尝试使用常规文本提取方法（与基础解析相同）
2. 如果常规方法提取的文本内容不足，触发OCR处理流程
3. 将文档转换为高质量图像
4. 使用EasyOCR引擎提取图像中的文本
5. 如果EasyOCR失败，可以选择使用百度OCR API作为备选（需配置）
6. 对提取的文本使用AI增强解析，提取结构化信息

### OCR引擎选择

系统支持两种OCR引擎：

- **EasyOCR**（默认）：开源本地OCR引擎，无需联网，支持中英文
- **百度OCR**（备选）：商业OCR服务，需要API密钥，提供更高准确率

## 依赖项

### 基础依赖

- Python 3.8+
- FastAPI
- Pydantic
- python-multipart
- aiofiles
- requests

### 文档处理

- python-docx (处理DOCX文件)
- PyPDF2 (处理PDF文件)
- pdfminer.six (备选PDF处理器)
- textract (可选，增强文档文本提取)

### AI增强依赖

- openai (与DeepSeek API通信)
- nltk (自然语言处理)

### OCR依赖

- easyocr (主要OCR引擎，基于本地处理)
- pdf2image (将PDF转换为图像)
- pillow (图像处理)
- docx2pdf (将Word文档转换为PDF)
- baidu-aip (可选，百度OCR API客户端)

**注意**：OCR功能需要额外安装:

```bash
pip install easyocr pdf2image pillow docx2pdf
```

Windows系统还需要安装:
- Poppler: https://github.com/oschwartz10612/poppler-windows/releases/
- 将poppler的bin目录添加到系统PATH环境变量

Linux系统:
```bash
apt-get install poppler-utils
```

## 配置与使用

### 基本配置

在 `.env`文件中配置DeepSeek API密钥：

```
DEEPSEEK_API_KEY=your_actual_api_key
```

或者在 `app/core/config.py`中直接配置：

```python
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your_default_key")
```

### 配置百度OCR（可选）

要使用百度OCR作为备选引擎，需配置百度OCR API密钥：

```
BAIDU_OCR_APP_ID=your_app_id
BAIDU_OCR_API_KEY=your_api_key
BAIDU_OCR_SECRET_KEY=your_secret_key
```

### 测试DeepSeek API

可以使用以下API端点测试DeepSeek API连接是否正常：

```
POST /api/v1/resume/test-deepseek
```

或者使用提供的测试脚本：

```bash
python test-resume-parser.py --test-api
```

如果配置正确，将返回成功信息和DeepSeek的响应内容。

### 使用解析API

```
# 基础解析API
POST /api/v1/resume/parse
Content-Type: multipart/form-data
file: [简历文件]

# AI增强解析API
POST /api/v1/resume/parse-ai
Content-Type: multipart/form-data
file: [简历文件]

# OCR辅助解析API
POST /api/v1/resume/parse-ocr
Content-Type: multipart/form-data
file: [简历文件]
```

### 通过命令行工具测试

可以使用提供的测试脚本测试不同解析模式：

```bash
# 基础解析
python test-resume-parser.py path/to/resume.pdf

# AI增强解析
python test-resume-parser.py path/to/resume.pdf --ai

# OCR辅助解析
python test-resume-parser.py path/to/resume.pdf --ocr
```

## 不同解析方法的对比

| 特性 | 基础解析 | AI增强解析 | OCR辅助解析 |
|------|---------|-----------|------------|
| 速度 | 快 | 中等 | 慢 |
| 图片/扫描版PDF支持 | ❌ | ❌ | ✅ |
| 文本型文档支持 | ✅ | ✅ | ✅ |
| 复杂布局处理能力 | 有限 | 良好 | 良好 |
| 非标准模板支持 | 有限 | 良好 | 良好 |
| 依赖外部服务 | ❌ | ✅ (DeepSeek API) | ❌ |
| 内存和CPU消耗 | 低 | 中等 | 高 |
| 适用场景 | 标准简历，快速处理 | 复杂简历，高准确度 | 扫描版/图片型简历 |

## 系统扩展性

系统设计考虑了扩展性：

1. 可以添加新的文件格式支持
2. 可以根据不同行业扩展规则引擎
3. 可以集成不同的AI模型，如OpenAI、DeepSeek等
4. 可以自定义简历评估和质量分析规则
5. 可以添加新的OCR引擎或图像预处理方法

## API接口

1. 基础解析接口（适用于文本型PDF和DOCX）：
   - 路径：`/api/v1/resume/parse`
   - 方法：POST
   - 支持格式：文本型PDF、DOCX、DOC

2. AI增强解析接口（结合大模型的解析能力）：
   - 路径：`/api/v1/resume/parse-ai`
   - 方法：POST
   - 支持格式：文本型PDF、DOCX、DOC

3. OCR辅助解析接口（适用于扫描版PDF和图片型文档）：
   - 路径：`/api/v1/resume/parse-ocr`
   - 方法：POST
   - 支持格式：PDF（包括扫描PDF和图片PDF）、DOCX、DOC

4. OCR+AI联合解析接口（结合OCR和大模型的强大解析能力）：
   - 路径：`/api/v1/resume/parse-ocr-ai`
   - 方法：POST
   - 支持格式：PDF（包括扫描PDF和图片PDF）、DOCX、DOC
   - 特点：首先通过OCR提取文本，然后使用DeepSeek大模型进行结构化分析，适合处理各种复杂格式的简历

## 解析方法比较

| 特性 | 基础解析 | AI增强解析 | OCR辅助解析 | OCR+AI联合解析 |
|-----|---------|-----------|-----------|--------------|
| 支持文本型PDF | ✅ | ✅ | ✅ | ✅ |
| 支持Word文档 | ✅ | ✅ | ✅ | ✅ |
| 支持扫描PDF | ❌ | ❌ | ✅ | ✅ |
| 支持图片型PDF | ❌ | ❌ | ✅ | ✅ |
| 支持复杂模板 | ⚠️ | ✅ | ⚠️ | ✅ |
| 解析深度 | 基本字段 | 深度语义理解 | 基本字段 | 深度语义理解 |
| 速度 | 快速 | 中等 | 较慢 | 慢 |
| API依赖 | 无 | DeepSeek | 无/可选百度OCR | DeepSeek |
| 适用场景 | 标准格式简历 | 复杂格式文本简历 | 扫描版标准简历 | 所有类型简历 |

## OCR+AI联合解析功能

### 功能说明

OCR+AI联合解析功能结合了OCR技术和大语言模型的能力，可以处理几乎所有类型的简历文件，包括：

- 扫描版PDF简历
- 图片型PDF简历
- 复杂格式的Word文档
- 非标准布局的简历

### 工作流程

1. 将上传的文档转换为高质量图像
2. 使用EasyOCR从图像中提取文本
3. 将提取的文本发送给DeepSeek大模型进行分析
4. DeepSeek返回结构化的简历数据
5. 系统整合处理结果并返回

### 依赖项

- EasyOCR：用于从图像中提取文本
- pdf2image：用于将PDF转换为图像
- DeepSeek API：用于文本分析和结构化

### 使用方法

```python
import requests

url = "http://your-server/api/v1/resume/parse-ocr-ai"
file_path = "path/to/your/resume.pdf"

with open(file_path, "rb") as f:
    files = {"file": (file_path, f)}
    response = requests.post(url, files=files)

if response.status_code == 200:
    result = response.json()
    print(result)
else:
    print(f"错误: {response.text}")
```

### 注意事项

- 此功能需要较长的处理时间，特别是对于多页面文档
- 确保已配置DeepSeek API密钥
- OCR质量会影响最终的解析结果
- 对于某些特殊字体或低质量图像，OCR可能无法正确识别
