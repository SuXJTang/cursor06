import os
import time
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import excel

router = APIRouter()

def safe_remove_file(file_path: str, max_retries: int = 5, delay: int = 1):
    """安全删除文件，带有重试机制"""
    for i in range(max_retries):
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except PermissionError:
            if i < max_retries - 1:
                time.sleep(delay)
                continue
            else:
                return False
    return True

def process_import_file(
    db: Session,
    import_id: int,
    file_path: str,
    current_user_id: int
):
    """处理导入文件（后台任务）"""
    try:
        # 验证Excel数据
        valid_data, errors = excel.validate_excel(file_path)
        
        if errors:
            # 更新导入状态为失败
            crud.job_import.update_import_status(
                db=db,
                db_obj=crud.job_import.get(db=db, id=import_id),
                total_count=len(valid_data) + len(errors),
                success_count=0,
                failed_count=len(errors),
                status="failed",
                error_details={"errors": [error.dict() for error in errors]}
            )
            return

        # 开始导入数据
        success_count = 0
        failed_count = 0
        import_errors = []

        for job_data in valid_data:
            try:
                crud.job.create(db=db, obj_in=job_data)
                success_count += 1
            except Exception as e:
                failed_count += 1
                import_errors.append({
                    "data": job_data.dict(),
                    "error": str(e)
                })

        # 更新导入状态
        crud.job_import.update_import_status(
            db=db,
            db_obj=crud.job_import.get(db=db, id=import_id),
            total_count=len(valid_data),
            success_count=success_count,
            failed_count=failed_count,
            status="completed" if failed_count == 0 else "partial",
            error_details={"errors": import_errors} if import_errors else None
        )

    except Exception as e:
        # 更新导入状态为失败
        crud.job_import.update_import_status(
            db=db,
            db_obj=crud.job_import.get(db=db, id=import_id),
            total_count=0,
            success_count=0,
            failed_count=0,
            status="failed",
            error_details={"error": str(e)}
        )
    finally:
        # 使用安全删除函数清理临时文件
        safe_remove_file(file_path)

@router.get("/template")
def download_template(
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    下载职位导入模板
    """
    template_path = excel.create_template()
    return FileResponse(
        template_path,
        filename="job_import_template.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.post("/upload", response_model=schemas.JobImport)
async def upload_jobs(
    *,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    上传职位Excel文件进行导入
    """
    # 验证文件格式
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(
            status_code=400,
            detail="只支持.xlsx格式的Excel文件"
        )

    # 保存文件
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # 创建导入记录
    import_record = crud.job_import.create_import(
        db=db,
        filename=file.filename,
        importer_id=current_user.id
    )

    # 添加后台任务
    background_tasks.add_task(
        process_import_file,
        db=db,
        import_id=import_record.id,
        file_path=file_path,
        current_user_id=current_user.id
    )

    return jsonable_encoder(import_record)

@router.get("/records", response_model=List[schemas.JobImport])
def read_import_records(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取导入记录列表
    """
    records = crud.job_import.get_by_importer(
        db=db, importer_id=current_user.id, skip=skip, limit=limit
    )
    return records

@router.get("/records/{id}", response_model=schemas.JobImport)
def read_import_record(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取导入记录详情
    """
    record = crud.job_import.get(db=db, id=id)
    if not record:
        raise HTTPException(status_code=404, detail="导入记录不存在")
    if record.importer_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此导入记录")
    return jsonable_encoder(record) 