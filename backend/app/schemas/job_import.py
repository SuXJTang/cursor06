from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field
from pydantic import validator

class JobImportBase(BaseModel):
    filename: str = Field(..., description="导入文件名", max_length=200)
    total_count: int = Field(0, description="总记录数")
    success_count: int = Field(0, description="成功导入数")
    failed_count: int = Field(0, description="失败记录数")
    status: str = Field("pending", description="导入状态")
    error_details: Optional[Dict] = Field(None, description="错误详情")

    class Config:
        from_attributes = True

class JobImportCreate(JobImportBase):
    importer_id: Optional[int] = None

    class Config:
        from_attributes = True

class JobImportUpdate(BaseModel):
    """职业导入更新模型"""
    filename: Optional[str] = None
    status: Optional[str] = None
    total_count: Optional[int] = None
    success_count: Optional[int] = None
    failed_count: Optional[int] = None
    error_count: Optional[int] = None
    error_details: Optional[Dict] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True

class JobImportInDBBase(JobImportBase):
    id: int
    total_count: int = Field(0, description="总记录数")
    success_count: int = Field(0, description="成功导入数")
    failed_count: int = Field(0, description="失败记录数")
    status: str = Field("pending", description="导入状态")
    error_details: Optional[Dict] = Field(None, description="错误详情")
    importer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobImport(JobImportBase):
    id: int
    importer_id: int
    error_count: Optional[int] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        @validator("error_count", pre=True, always=True)
        def set_error_count(cls, v, values):
            return values.get("failed_count", 0) if v is None else v

class JobImportInDB(JobImportInDBBase):
    class Config:
        from_attributes = True

# Excel导入模板的列定义
class ExcelColumn(BaseModel):
    name: str = Field(..., description="列名")
    required: bool = Field(True, description="是否必填")
    description: str = Field(..., description="列描述")
    example: str = Field(..., description="示例值")

    class Config:
        from_attributes = True

# Excel导入的错误信息
class ImportError(BaseModel):
    row: int = Field(..., description="行号")
    column: str = Field(..., description="列名")
    value: str = Field(..., description="错误值")
    message: str = Field(..., description="错误信息")

    class Config:
        from_attributes = True

class JobImportStatusUpdate(BaseModel):
    """职业导入状态更新模型"""
    status: str
    success_count: int
    error_count: int

    class Config:
        from_attributes = True 