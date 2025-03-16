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
from app.utils.logger import logger

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
    """下载导入模板"""
    template_path = excel.create_template()
    return FileResponse(
        template_path,
        filename="job_import_template.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.post("/upload")
def upload_jobs(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """上传职业数据文件"""
    try:
        # 记录请求信息
        logger.info(f"上传职位数据文件请求，文件名: {file.filename}，请求用户: {current_user.email}")
        
        # 验证文件格式
        if not file.filename.endswith(".xlsx"):
            logger.warning(f"不支持的文件格式: {file.filename}")
            raise HTTPException(status_code=400, detail="只支持.xlsx格式的Excel文件")

        # 保存文件
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        try:
            with open(file_path, "wb") as f:
                f.write(file.file.read())
        except Exception as e:
            logger.error(f"保存文件失败: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail="保存文件失败")

        # 开始数据库事务
        db.begin_nested()
        
        # 创建导入记录
        import_record = crud.job_import.create(
            db=db,
            obj_in=schemas.JobImportCreate(
                filename=file.filename,
                importer_id=current_user.id,
                total_count=0,
                success_count=0,
                failed_count=0,
                status="pending"
            )
        )
        
        # 提交事务
        db.commit()

        # 添加后台任务处理导入
        background_tasks.add_task(
            process_import_file,
            db=db,
            import_id=import_record.id,
            file_path=file_path,
            current_user_id=current_user.id
        )

        logger.info(f"成功创建导入任务，ID: {import_record.id}，文件名: {file.filename}")
        return jsonable_encoder(import_record)
    except HTTPException:
        # 回滚事务
        if 'db' in locals() and hasattr(db, 'rollback'):
            db.rollback()
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 回滚事务
        if 'db' in locals() and hasattr(db, 'rollback'):
            db.rollback()
        # 记录详细错误信息
        logger.error(f"上传职位数据文件失败，文件名: {file.filename if 'file' in locals() else 'unknown'}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="上传职位数据文件时发生内部错误"
        )

@router.get("/records")
def read_import_records(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """获取导入记录列表"""
    if current_user.is_superuser:
        records = crud.job_import.get_multi(db=db)
    else:
        records = crud.job_import.get_multi_by_importer(
            db=db, importer_id=current_user.id
        )
    return records

@router.get("/records/{record_id}")
def read_import_record(
    record_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """获取导入记录详情"""
    record = crud.job_import.get(db=db, id=record_id)
    if not record:
        raise HTTPException(status_code=404, detail="导入记录不存在")
    if not current_user.is_superuser and record.importer_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此导入记录")
    return record

@router.get("/")
def read_job_imports(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """获取所有职业导入记录"""
    return crud.job_import.get_multi(db=db)

@router.post("/")
def create_job_import(
    *,
    db: Session = Depends(deps.get_db),
    job_import_in: schemas.JobImportCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """创建职业导入记录"""
    job_import = crud.job_import.create(db=db, obj_in=job_import_in)
    return job_import

@router.get("/{job_import_id}")
def read_job_import(
    job_import_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """获取职业导入记录"""
    job_import = crud.job_import.get(db=db, id=job_import_id)
    if not job_import:
        raise HTTPException(status_code=404, detail="职业导入记录不存在")
    return job_import

@router.put("/{id}", response_model=schemas.JobImport)
def update_job_import(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    job_import_in: schemas.JobImportUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职业导入记录
    """
    job_import = crud.job_import.get(db=db, id=id)
    if not job_import:
        raise HTTPException(status_code=404, detail="Job import not found")
    
    # 创建更新数据字典，只包含非None值
    update_data = job_import_in.dict(exclude_unset=True)
    
    # 如果存在 error_count，将其映射到 failed_count
    if "error_count" in update_data:
        update_data["failed_count"] = update_data.pop("error_count")
    
    # 如果存在 error_message，将其添加到 error_details
    if "error_message" in update_data:
        error_message = update_data.pop("error_message")
        if error_message is not None:
            update_data["error_details"] = {"message": error_message}
    
    job_import = crud.job_import.update(db=db, db_obj=job_import, obj_in=update_data)
    
    # 在响应中添加 error_count 和 error_message
    response_data = jsonable_encoder(job_import)
    response_data["error_count"] = response_data.get("failed_count", 0)
    
    # 从 error_details 中提取 error_message
    error_details = response_data.get("error_details", {})
    if isinstance(error_details, dict):
        response_data["error_message"] = error_details.get("message")
    else:
        response_data["error_message"] = None
    
    return response_data

@router.delete("/{job_import_id}", status_code=204)
def delete_job_import(
    *,
    db: Session = Depends(deps.get_db),
    job_import_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """删除职业导入记录"""
    try:
        # 记录请求信息
        logger.info(f"删除导入记录请求，ID: {job_import_id}，请求用户: {current_user.email}")
        
        job_import = crud.job_import.get(db=db, id=job_import_id)
        if not job_import:
            logger.warning(f"导入记录不存在，ID: {job_import_id}")
            raise HTTPException(status_code=404, detail="职业导入记录不存在")
        
        # 开始数据库事务
        db.begin_nested()
        
        # 删除导入记录
        crud.job_import.remove(db=db, id=job_import_id)
        
        # 提交事务
        db.commit()
        
        logger.info(f"成功删除导入记录，ID: {job_import_id}")
        return None
    except HTTPException:
        # 回滚事务
        db.rollback()
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 回滚事务
        db.rollback()
        # 记录详细错误信息
        logger.error(f"删除导入记录失败，ID: {job_import_id}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="删除导入记录时发生内部错误"
        )

@router.patch("/{job_import_id}/status")
def update_job_import_status(
    *,
    db: Session = Depends(deps.get_db),
    job_import_id: int,
    status_update: schemas.JobImportStatusUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """更新职业导入记录状态"""
    job_import = crud.job_import.get(db=db, id=job_import_id)
    if not job_import:
        raise HTTPException(status_code=404, detail="职业导入记录不存在")
    job_import = crud.job_import.update_status(
        db=db,
        db_obj=job_import,
        obj_in=status_update
    )
    response = jsonable_encoder(job_import)
    response["error_count"] = response["failed_count"]
    return response

@router.get("/{job_import_id}/status", response_model=schemas.JobImport)
def get_job_import_status(
    *,
    db: Session = Depends(deps.get_db),
    job_import_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取职业导入记录状态
    """
    try:
        # 记录请求信息
        logger.info(f"获取导入记录状态请求，ID: {job_import_id}，请求用户: {current_user.email}")
        
        job_import = crud.job_import.get(db=db, id=job_import_id)
        if not job_import:
            logger.warning(f"导入记录不存在，ID: {job_import_id}")
            raise HTTPException(status_code=404, detail="职业导入记录不存在")
        
        # 检查权限
        if not current_user.is_superuser and job_import.importer_id != current_user.id:
            logger.warning(f"用户无权访问导入记录，用户ID: {current_user.id}，导入记录ID: {job_import_id}")
            raise HTTPException(status_code=403, detail="无权访问此导入记录")
        
        # 序列化导入记录数据
        response = jsonable_encoder(job_import)
        response["error_count"] = response["failed_count"]
        
        logger.info(f"成功获取导入记录状态，ID: {job_import_id}，状态: {job_import.status}")
        return response
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 记录详细错误信息
        logger.error(f"获取导入记录状态失败，ID: {job_import_id}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="获取导入记录状态时发生内部错误"
        ) 