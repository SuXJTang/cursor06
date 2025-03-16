from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils.logger import logger

router = APIRouter()

@router.post("/", response_model=schemas.Job)
def create_job(
    *,
    db: Session = Depends(deps.get_db),
    job_in: schemas.JobCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新职位。
    """
    try:
        # 记录请求信息
        logger.info(f"创建新岗位请求，标题: {job_in.title}，请求用户: {current_user.email}")
        
        # 验证职位分类是否存在
        if not crud.job_category.get(db=db, id=job_in.category_id):
            logger.warning(f"职位分类不存在，ID: {job_in.category_id}")
            raise HTTPException(
                status_code=404,
                detail="职位分类不存在"
            )
        
        # 开始数据库事务
        db.begin_nested()
        
        # 创建岗位
        job = crud.job.create(db=db, obj_in=job_in)
        
        # 提交事务
        db.commit()
        
        logger.info(f"成功创建岗位，ID: {job.id}，标题: {job.title}")
        return job
    except HTTPException:
        # 回滚事务
        db.rollback()
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 回滚事务
        db.rollback()
        # 记录详细错误信息
        logger.error(f"创建岗位失败，标题: {job_in.title}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="创建岗位时发生内部错误"
        )

@router.get("/", response_model=List[schemas.Job])
def read_jobs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取职位列表。
    """
    try:
        # 记录请求信息
        logger.info(f"获取岗位列表请求，skip: {skip}, limit: {limit}, category_id: {category_id}，请求用户: {current_user.email}")
        
        if category_id:
            # 验证分类是否存在
            if not crud.job_category.get(db=db, id=category_id):
                logger.warning(f"职位分类不存在，ID: {category_id}")
                raise HTTPException(
                    status_code=404,
                    detail="职位分类不存在"
                )
            jobs = crud.job.get_multi_by_category(
                db=db, category_id=category_id, skip=skip, limit=limit
            )
        else:
            jobs = crud.job.get_multi(db=db, skip=skip, limit=limit)
        
        # 直接返回jobs列表
        logger.info(f"成功获取岗位列表，返回 {len(jobs)} 条记录")
        return jobs
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 记录详细错误信息
        logger.error(f"获取岗位列表失败，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="获取岗位列表时发生内部错误"
        )

@router.get("/search", response_model=List[schemas.Job])
def search_jobs(
    *,
    db: Session = Depends(deps.get_db),
    params: schemas.JobSearchParams = Depends(),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    搜索职位。
    """
    try:
        # 记录请求信息
        logger.info(f"搜索岗位请求，参数: {params}，skip: {skip}, limit: {limit}，请求用户: {current_user.email}")
        
        jobs = crud.job.search(db=db, params=params, skip=skip, limit=limit)
        
        # 序列化岗位数据
        jobs_data = jsonable_encoder(jobs)
        logger.info(f"成功搜索岗位，返回 {len(jobs)} 条记录")
        return jobs_data
    except Exception as e:
        # 记录详细错误信息
        logger.error(f"搜索岗位失败，参数: {params}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="搜索岗位时发生内部错误"
        )

@router.get("/{id}", response_model=schemas.Job)
def read_job(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    通过ID获取职位。
    """
    try:
        # 记录请求信息
        logger.info(f"获取岗位信息，ID: {id}，请求用户: {current_user.email}")
        
        job = crud.job.get(db=db, id=id)
        if not job:
            logger.warning(f"岗位不存在，ID: {id}")
            raise HTTPException(status_code=404, detail="岗位不存在")
        
        # 直接返回job对象
        logger.info(f"成功获取岗位信息，ID: {id}")
        return job
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 记录详细错误信息
        logger.error(f"获取岗位失败，ID: {id}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="获取岗位信息时发生内部错误"
        )

@router.put("/{id}", response_model=schemas.Job)
def update_job(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    job_in: schemas.JobUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职位。
    """
    try:
        # 记录请求信息
        logger.info(f"更新岗位请求，ID: {id}，请求用户: {current_user.email}")
        
        job = crud.job.get(db=db, id=id)
        if not job:
            logger.warning(f"岗位不存在，ID: {id}")
            raise HTTPException(status_code=404, detail="岗位不存在")
        
        # 如果更新了分类ID，验证新分类是否存在
        if job_in.category_id and job_in.category_id != job.category_id:
            if not crud.job_category.get(db=db, id=job_in.category_id):
                logger.warning(f"职位分类不存在，ID: {job_in.category_id}")
                raise HTTPException(
                    status_code=404,
                    detail="职位分类不存在"
                )
        
        # 开始数据库事务
        db.begin_nested()
        
        # 更新岗位
        job = crud.job.update(db=db, db_obj=job, obj_in=job_in)
        
        # 提交事务
        db.commit()
        
        # 直接返回job对象
        logger.info(f"成功更新岗位，ID: {id}")
        return job
    except HTTPException:
        # 回滚事务
        db.rollback()
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 回滚事务
        db.rollback()
        # 记录详细错误信息
        logger.error(f"更新岗位失败，ID: {id}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="更新岗位时发生内部错误"
        )

@router.put("/{id}/status", response_model=schemas.Job)
def update_job_status(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    status: str = Body(...),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新职位状态。
    """
    try:
        # 记录请求信息
        logger.info(f"更新岗位状态请求，ID: {id}，状态: {status}，请求用户: {current_user.email}")
        
        # 验证状态值是否有效
        valid_statuses = ["active", "closed"]
        if status not in valid_statuses:
            logger.warning(f"无效的岗位状态: {status}")
            raise HTTPException(
                status_code=400,
                detail=f"无效的岗位状态，有效值为: {', '.join(valid_statuses)}"
            )
        
        job = crud.job.get(db=db, id=id)
        if not job:
            logger.warning(f"岗位不存在，ID: {id}")
            raise HTTPException(status_code=404, detail="岗位不存在")
        
        # 开始数据库事务
        db.begin_nested()
        
        # 更新岗位状态
        job_in = {"status": status}
        job = crud.job.update(db=db, db_obj=job, obj_in=job_in)
        
        # 提交事务
        db.commit()
        
        # 序列化岗位数据
        job_data = jsonable_encoder(job)
        logger.info(f"成功更新岗位状态，ID: {id}，新状态: {status}")
        return job_data
    except HTTPException:
        # 回滚事务
        db.rollback()
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 回滚事务
        db.rollback()
        # 记录详细错误信息
        logger.error(f"更新岗位状态失败，ID: {id}，状态: {status}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="更新岗位状态时发生内部错误"
        )

@router.delete("/{id}", response_model=schemas.Job)
def delete_job(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除职位。
    """
    try:
        # 记录请求信息
        logger.info(f"删除岗位请求，ID: {id}，请求用户: {current_user.email}")
        
        job = crud.job.get(db=db, id=id)
        if not job:
            logger.warning(f"岗位不存在，ID: {id}")
            raise HTTPException(status_code=404, detail="岗位不存在")
        
        # 开始数据库事务
        db.begin_nested()
        
        # 删除岗位
        job = crud.job.remove(db=db, id=id)
        
        # 提交事务
        db.commit()
        
        # 序列化岗位数据
        job_data = jsonable_encoder(job)
        logger.info(f"成功删除岗位，ID: {id}")
        return job_data
    except HTTPException:
        # 回滚事务
        db.rollback()
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 回滚事务
        db.rollback()
        # 记录详细错误信息
        logger.error(f"删除岗位失败，ID: {id}，错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="删除岗位时发生内部错误"
        ) 