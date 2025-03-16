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
        valid_data, errors = excel.validate_career_excel(file_path)
        
        if errors:
            # 更新导入状态为失败
            crud.career_import.update_import_status(
                db=db,
                db_obj=crud.career_import.get(db=db, id=import_id),
                total_count=len(valid_data) + len(errors),
                success_count=0,
                failed_count=len(errors),
                status="failed",
                error_details={"errors": errors}
            )
            return
        
        # 开始导入数据
        success_count = 0
        failed_count = 0
        failed_items = []
        
        # 更新状态为处理中
        crud.career_import.update_import_status(
            db=db,
            db_obj=crud.career_import.get(db=db, id=import_id),
            total_count=len(valid_data),
            success_count=0,
            failed_count=0,
            status="processing"
        )
        
        # 处理每条数据
        for item in valid_data:
            try:
                # 查找职业分类
                category_name = item.pop("category_name", "").strip()
                category = None
                
                if category_name:
                    # 查找已存在的分类
                    category = db.query(models.CareerCategory).filter(
                        models.CareerCategory.name == category_name
                    ).first()
                    
                    if not category:
                        # 查找包含该名称的分类
                        category = db.query(models.CareerCategory).filter(
                            models.CareerCategory.name.ilike(f"%{category_name}%")
                        ).first()
                        
                        if not category:
                            # 默认使用第一个分类
                            category = db.query(models.CareerCategory).first()
                
                # 如果没有找到分类，使用默认分类
                if not category:
                    category = db.query(models.CareerCategory).first()
                    if not category:
                        # 如果系统中没有任何分类，创建一个默认分类
                        category_in = schemas.CareerCategoryCreate(
                            name="未分类",
                            description="自动创建的默认分类"
                        )
                        category = crud.career_category.create(db=db, obj_in=category_in)
                
                # 处理技能列表
                if "required_skills" in item and isinstance(item["required_skills"], str):
                    item["required_skills"] = [
                        skill.strip() for skill in item["required_skills"].split(",") 
                        if skill.strip()
                    ]
                
                # 处理相关专业
                if "related_majors" in item and isinstance(item["related_majors"], str):
                    item["related_majors"] = [
                        major.strip() for major in item["related_majors"].split(",") 
                        if major.strip()
                    ]
                
                # 处理工作活动
                if "work_activities" in item and isinstance(item["work_activities"], str):
                    item["work_activities"] = [
                        activity.strip() for activity in item["work_activities"].split(",") 
                        if activity.strip()
                    ]
                
                # 处理薪资范围
                if "average_salary" in item and item["average_salary"]:
                    salary_range = {
                        "min": item["average_salary"].split("-")[0] if "-" in item["average_salary"] else item["average_salary"],
                        "max": item["average_salary"].split("-")[1] if "-" in item["average_salary"] else item["average_salary"],
                        "currency": "CNY",
                        "period": "monthly"
                    }
                    item["salary_range"] = salary_range
                
                # 处理就业前景
                if "job_outlook" in item and item["job_outlook"]:
                    item["future_prospect"] = item["job_outlook"]
                
                # 创建职业实例
                career_data = schemas.CareerCreate(
                    **item,
                    category_id=category.id
                )
                
                # 检查是否已存在同名职业
                existing_career = db.query(models.Career).filter(
                    models.Career.title == career_data.title
                ).first()
                
                if existing_career:
                    # 更新现有职业
                    crud.career.update(db=db, db_obj=existing_career, obj_in=career_data)
                else:
                    # 创建新职业
                    crud.career.create(db=db, obj_in=career_data)
                
                success_count += 1
            except Exception as e:
                logger.error(f"导入职业数据错误: {str(e)}")
                failed_count += 1
                failed_items.append({
                    "row": valid_data.index(item) + 2,  # 考虑标题行和0索引
                    "data": item,
                    "error": str(e)
                })
        
        # 更新导入状态
        status = "completed" if failed_count == 0 else "partial"
        error_details = {"failed_items": failed_items} if failed_items else None
        
        crud.career_import.update_import_status(
            db=db,
            db_obj=crud.career_import.get(db=db, id=import_id),
            total_count=len(valid_data),
            success_count=success_count,
            failed_count=failed_count,
            status=status,
            error_details=error_details
        )
        
    except Exception as e:
        logger.error(f"处理导入文件出错: {str(e)}")
        # 更新导入状态为失败
        crud.career_import.update_import_status(
            db=db,
            db_obj=crud.career_import.get(db=db, id=import_id),
            total_count=0,
            success_count=0,
            failed_count=0,
            status="failed",
            error_details={"error": str(e)}
        )
    finally:
        # 清理临时文件
        safe_remove_file(file_path)

@router.post("/", response_model=schemas.CareerImport)
def create_import(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    导入职业数据
    """
    # 验证文件类型
    if file.content_type not in [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/octet-stream"
    ]:
        raise HTTPException(
            status_code=400,
            detail="仅支持Excel文件格式"
        )
    
    # 确保上传目录存在
    upload_dir = os.path.join(settings.STATIC_DIR, "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    # 生成唯一文件名
    filename = f"{int(time.time())}_{file.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    # 保存上传的文件
    with open(file_path, "wb") as f:
        content = file.file.read()
        f.write(content)
        file_size = len(content)
    
    # 创建导入记录
    import_record = crud.career_import.create(
        db=db,
        obj_in=schemas.CareerImportCreate(
            filename=file.filename,
            file_size=file_size,
            status="pending",
            importer_id=current_user.id
        )
    )
    
    # 在后台处理文件
    background_tasks.add_task(
        process_import_file,
        db=db,
        import_id=import_record.id,
        file_path=file_path,
        current_user_id=current_user.id
    )
    
    return import_record

@router.get("/template", response_class=FileResponse)
def download_template(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    下载Excel导入模板
    """
    template_path = os.path.join(settings.STATIC_DIR, "templates", "career_import_template.xlsx")
    
    # 检查模板文件是否存在
    if not os.path.isfile(template_path):
        # 如果不存在，创建模板
        excel.create_career_import_template(template_path)
    
    return FileResponse(
        path=template_path,
        filename="职业导入模板.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.get("/", response_model=List[schemas.CareerImport])
def read_imports(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取导入记录列表
    """
    if current_user.is_superuser:
        return crud.career_import.get_multi(db=db, skip=skip, limit=limit)
    else:
        return crud.career_import.get_by_importer(
            db=db, importer_id=current_user.id, skip=skip, limit=limit
        )

@router.get("/{id}", response_model=schemas.CareerImport)
def read_import(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取导入记录详情
    """
    record = crud.career_import.get(db=db, id=id)
    if not record:
        raise HTTPException(status_code=404, detail="导入记录不存在")
    
    if not current_user.is_superuser and record.importer_id != current_user.id:
        raise HTTPException(status_code=403, detail="没有权限访问此记录")
        
    return record

@router.delete("/{id}", response_model=schemas.CareerImport)
def delete_import(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除导入记录
    """
    job_import = crud.career_import.get(db=db, id=id)
    if not job_import:
        raise HTTPException(status_code=404, detail="导入记录不存在")
    
    job_import = crud.career_import.remove(db=db, id=id)
    return job_import 