from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field

class JobImportBase(BaseModel):
    filename: str = Field(..., description="导入文件名", max_length=200)

    class Config:
        from_attributes = True

class JobImportCreate(JobImportBase):
    class Config:
        from_attributes = True

class JobImportUpdate(BaseModel):
    total_count: Optional[int] = Field(None, description="总记录数")
    success_count: Optional[int] = Field(None, description="成功导入数")
    failed_count: Optional[int] = Field(None, description="失败记录数")
    status: Optional[str] = Field(None, description="导入状态")
    error_details: Optional[Dict] = Field(None, description="错误详情")

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

class JobImport(JobImportInDBBase):
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

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