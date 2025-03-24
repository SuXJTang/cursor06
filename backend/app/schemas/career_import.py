from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field

class CareerImportBase(BaseModel):
    """职业导入基础模型"""
    filename: str
    file_size: Optional[int] = None
    total_count: Optional[int] = None
    success_count: Optional[int] = None
    failed_count: Optional[int] = None
    status: str = "pending"  # pending, processing, completed, failed
    error_details: Optional[Dict[str, Any]] = None
    importer_id: int

class CareerImportCreate(CareerImportBase):
    """创建职业导入记录模型"""
    pass

class CareerImportUpdate(BaseModel):
    """更新职业导入记录模型"""
    filename: Optional[str] = None
    file_size: Optional[int] = None
    total_count: Optional[int] = None
    success_count: Optional[int] = None
    failed_count: Optional[int] = None
    status: Optional[str] = None
    error_details: Optional[Dict[str, Any]] = None

class CareerImportStatusUpdate(BaseModel):
    """更新职业导入记录状态模型"""
    total_count: Optional[int] = None
    success_count: Optional[int] = None
    failed_count: Optional[int] = None
    error_count: Optional[int] = None  # 兼容字段，等同于failed_count
    status: Optional[str] = None
    error_details: Optional[Dict[str, Any]] = None

class CareerImportInDBBase(CareerImportBase):
    """数据库中的职业导入记录模型"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class CareerImport(CareerImportInDBBase):
    """API响应中的职业导入记录模型"""
    pass

class CareerImportInDB(CareerImportInDBBase):
    """数据库中的完整职业导入记录模型"""
    pass

class ColumnDefinition(BaseModel):
    """Excel导入列定义"""
    name: str
    required: bool = False
    description: str
    example: str = ""

class ImportError(BaseModel):
    """导入错误信息"""
    row: int
    column: str
    value: str = ""
    message: str

    def dict(self):
        return {
            "row": self.row,
            "column": self.column,
            "value": self.value,
            "message": self.message
        }

class CareerExcelTemplate(BaseModel):
    """职业Excel模板字段"""
    title: str = Field(..., title="职业名称", example="前端开发工程师")
    description: str = Field(..., title="职业描述", example="负责网站前端开发和维护...")
    required_skills: str = Field(..., title="所需技能", example="HTML, CSS, JavaScript")
    education_required: Optional[str] = Field(None, title="学历要求", example="本科")
    experience_required: Optional[str] = Field(None, title="经验要求", example="3-5年")
    average_salary: Optional[str] = Field(None, title="平均薪资", example="15k-25k")
    job_outlook: Optional[str] = Field(None, title="就业前景", example="需求旺盛")
    related_majors: Optional[str] = Field(None, title="相关专业", example="计算机科学,软件工程")
    work_activities: Optional[str] = Field(None, title="工作内容", example="页面开发,性能优化")
    category_name: str = Field(..., title="职业分类", example="软件开发") 