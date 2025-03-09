import os
from typing import List, Dict, Optional, Tuple
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

from app.schemas.job import JobCreate
from app.schemas.job_import import ExcelColumn, ImportError

# Excel模板列定义
EXCEL_COLUMNS = [
    ExcelColumn(
        name="title",
        required=True,
        description="职位标题",
        example="Python开发工程师"
    ),
    ExcelColumn(
        name="company",
        required=True,
        description="公司名称",
        example="XX科技有限公司"
    ),
    ExcelColumn(
        name="description",
        required=True,
        description="职位描述",
        example="负责公司核心业务系统的开发..."
    ),
    ExcelColumn(
        name="requirements",
        required=True,
        description="职位要求",
        example="1. 熟练掌握Python编程..."
    ),
    ExcelColumn(
        name="skills",
        required=False,
        description="所需技能（用逗号分隔）",
        example="Python,Django,FastAPI"
    ),
    ExcelColumn(
        name="benefits",
        required=False,
        description="职位福利（用逗号分隔）",
        example="五险一金,年终奖,带薪休假"
    ),
    ExcelColumn(
        name="salary_range",
        required=True,
        description="薪资范围",
        example="15k-25k"
    ),
    ExcelColumn(
        name="location",
        required=True,
        description="工作地点",
        example="北京"
    ),
    ExcelColumn(
        name="job_type",
        required=True,
        description="工作类型",
        example="全职"
    ),
    ExcelColumn(
        name="category_id",
        required=True,
        description="职位分类ID",
        example="1"
    ),
    ExcelColumn(
        name="experience_required",
        required=True,
        description="所需工作经验",
        example="3-5年"
    ),
    ExcelColumn(
        name="education_required",
        required=True,
        description="学历要求",
        example="本科"
    ),
]

def create_template(file_path: str = "job_import_template.xlsx") -> str:
    """创建Excel导入模板
    
    Args:
        file_path: 模板文件保存路径，默认为 job_import_template.xlsx
        
    Returns:
        str: 模板文件保存路径
    """
    wb = Workbook()
    ws = wb.active
    ws.title = "职位信息"

    # 设置表头样式
    header_font = Font(bold=True)
    header_fill = PatternFill(start_color="CCCCCC", end_color="CCCCCC", fill_type="solid")

    # 写入表头
    headers = ["字段名", "是否必填", "描述", "示例值"]
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill

    # 写入字段信息
    for row, column in enumerate(EXCEL_COLUMNS, 2):
        ws.cell(row=row, column=1, value=column.name)
        ws.cell(row=row, column=2, value="是" if column.required else "否")
        ws.cell(row=row, column=3, value=column.description)
        ws.cell(row=row, column=4, value=column.example)

    # 调整列宽
    for col in range(1, 5):
        ws.column_dimensions[chr(64 + col)].width = 20

    # 创建数据sheet
    data_sheet = wb.create_sheet("导入数据")
    # 写入表头
    for col, column in enumerate(EXCEL_COLUMNS, 1):
        cell = data_sheet.cell(row=1, column=col)
        cell.value = column.name
        cell.font = header_font
        cell.fill = header_fill
        data_sheet.column_dimensions[chr(64 + col)].width = 20

    wb.save(file_path)
    return file_path

def validate_excel(file_path: str) -> Tuple[List[JobCreate], List[ImportError]]:
    """验证Excel文件并返回有效的数据和错误信息"""
    df = pd.read_excel(file_path, sheet_name="导入数据")
    
    valid_data = []
    errors = []
    required_columns = [col.name for col in EXCEL_COLUMNS if col.required]

    # 检查必填列是否存在
    for col in required_columns:
        if col not in df.columns:
            errors.append(
                ImportError(
                    row=0,
                    column=col,
                    value="",
                    message=f"缺少必填列: {col}"
                )
            )
    
    if errors:
        return [], errors

    # 验证每一行数据
    for index, row in df.iterrows():
        row_number = index + 2  # Excel行号从2开始（1是表头）
        row_errors = []
        row_data = {}

        # 检查必填字段
        for col in required_columns:
            value = row[col]
            if pd.isna(value) or str(value).strip() == "":
                row_errors.append(
                    ImportError(
                        row=row_number,
                        column=col,
                        value="",
                        message=f"必填字段不能为空"
                    )
                )
                continue
            row_data[col] = str(value).strip()

        # 处理可选字段
        for col in df.columns:
            if col not in required_columns:
                value = row[col]
                if not pd.isna(value) and str(value).strip() != "":
                    if col in ["skills", "benefits"]:
                        # 处理列表字段
                        row_data[col] = [item.strip() for item in str(value).split(",")]
                    else:
                        row_data[col] = str(value).strip()

        if row_errors:
            errors.extend(row_errors)
        else:
            try:
                # 尝试创建JobCreate对象
                job_data = JobCreate(**row_data)
                valid_data.append(job_data)
            except Exception as e:
                errors.append(
                    ImportError(
                        row=row_number,
                        column="",
                        value=str(row_data),
                        message=f"数据验证错误: {str(e)}"
                    )
                )

    return valid_data, errors 