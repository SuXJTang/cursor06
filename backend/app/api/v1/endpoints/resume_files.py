from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks, Query
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import Any, List, Optional
import os
import time
import uuid
import json
import mimetypes
from urllib.parse import unquote
from datetime import datetime

from app.core.logging_config import app_logger
from app.core.config import settings
from app import crud, models, schemas
from app.api import deps
from app.schemas.resume import ResumeCreate, ResumeFile
from app.services.resume import perform_resume_parsing

router = APIRouter()

@router.get("/", response_model=List[schemas.ResumeFile])
def list_resume_files(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    获取当前用户的简历文件列表
    遵循一用户一简历原则，只返回最新的简历文件
    """
    # 获取上传目录
    upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
    if not os.path.exists(upload_dir):
        return []
    
    # 获取数据库中用户的简历记录
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    if not resume or not resume.file_url:
        return []
    
    # 从简历记录的URL中提取文件名
    try:
        filename = resume.file_url.split("/")[-1]
        file_path = os.path.join(upload_dir, filename)
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            app_logger.warning(f"简历文件不存在: {file_path}")
            return []
        
        file_stats = os.stat(file_path)
        
        # 从文件名中提取原始文件名
        original_filename = "_".join(filename.split("_")[2:])
        file_ext = os.path.splitext(original_filename)[1].lower()
        
        # 确定文件类型
        file_type = "application/octet-stream"
        if file_ext == ".pdf":
            file_type = "application/pdf"
        elif file_ext in [".doc", ".docx"]:
            file_type = "application/msword"
        elif file_ext in [".jpg", ".jpeg"]:
            file_type = "image/jpeg"
        elif file_ext == ".png":
            file_type = "image/png"
        
        # 构建完整的URL
        base_url = settings.SERVER_HOST if settings.SERVER_HOST.startswith(('http://', 'https://')) else f"http://{settings.SERVER_HOST}"
        file_url = f"{base_url}{settings.API_V1_STR}/resume-files/download/{filename}"
        
        return [{
            "filename": original_filename,
            "file_size": file_stats.st_size,
            "file_type": file_type,
            "file_url": file_url
        }]
    except Exception as e:
        app_logger.error(f"获取简历文件列表失败: {str(e)}")
        return []

@router.post("/upload", response_model=ResumeFile)
def upload_resume_file(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_user),
    background_tasks: BackgroundTasks,
) -> Any:
    """上传简历文件
    
    遵循一用户一简历原则：如果用户已有简历文件，会删除旧文件并替换为新上传的文件
    上传后将自动进行简历解析
    
    - **file**: 要上传的文件（PDF, Word等格式）
    
    返回:
        上传成功的文件信息
    """
    try:
        # 读取文件内容
        content = file.file.read()
        file_size = len(content)
        
        # 检查文件大小
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"文件太大。最大允许大小: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
            
        # 获取文件名并检查文件扩展名
        filename = file.filename
        if not filename:
            filename = f"resume_{uuid.uuid4()}.pdf"
        
        # 获取文件扩展名
        _, ext = os.path.splitext(filename)
        
        # 确保扩展名以.开头
        if not ext.startswith('.'):
            ext = f".{ext}"
            
        # 检查文件类型
        if ext.lower() not in [".pdf", ".doc", ".docx"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="不支持的文件类型。只允许PDF和Word文档。"
            )
            
        # 创建上传目录
        upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
        os.makedirs(upload_dir, exist_ok=True)
        
        # 查找用户的简历
        resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
        
        # 如果用户已有简历文件，则删除旧文件
        if resume and resume.file_url:
            try:
                # 从URL中提取文件名
                old_filename = resume.file_url.split("/")[-1]
                old_file_path = os.path.join(upload_dir, old_filename)
                
                # 检查并删除旧文件
                if os.path.exists(old_file_path):
                    app_logger.info(f"删除用户 {current_user.id} 的旧简历文件: {old_filename}")
                    os.remove(old_file_path)
            except Exception as e:
                app_logger.warning(f"删除旧简历文件失败: {str(e)}")
        
        # 生成唯一文件名
        timestamp = int(time.time())
        unique_filename = f"{timestamp}_{current_user.id}_{filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # 保存文件
        with open(file_path, "wb") as f:
            f.write(content)
        
        # 生成文件URL - 添加http前缀
        base_url = settings.SERVER_HOST if settings.SERVER_HOST.startswith(('http://', 'https://')) else f"http://{settings.SERVER_HOST}"
        file_url = f"{base_url}{settings.API_V1_STR}/resume-files/download/{unique_filename}"
        
        # 如果用户没有简历，创建一个新的简历
        if not resume:
            app_logger.info(f"用户 {current_user.id} 没有简历记录，自动创建一个")
            # 创建简历对象
            resume_in = ResumeCreate(
                title=f"个人简历_{timestamp}",
                content=f"从文件 {filename} 自动创建的简历",
                is_active=True
            )
            # 保存到数据库
            resume = crud.resume.create_with_owner(db=db, obj_in=resume_in, user_id=current_user.id)
            app_logger.info(f"已为用户 {current_user.id} 创建新简历，ID: {resume.id}")
            
        # 更新简历的文件URL
        resume.file_url = file_url
        db.add(resume)
        db.commit()
        db.refresh(resume)
        app_logger.info(f"已自动关联文件 {filename} 到用户 {current_user.id} 的简历 ID: {resume.id}")
        
        # 创建文件响应对象
        file_response = {
            "filename": filename,
            "file_size": file_size,
            "file_type": file.content_type,
            "file_url": file_url
        }
        
        # 触发自动解析 - 使用BackgroundTasks处理异步任务
        try:
            # 添加背景任务进行简历解析
            background_tasks.add_task(
                perform_resume_parsing,
                file_path=file_path,
                resume_id=resume.id,
                user_id=current_user.id,
                filename=filename,
                content_type=file.content_type
            )
            app_logger.info(f"已添加简历 {resume.id} 的自动解析后台任务")
            
        except Exception as e:
            app_logger.error(f"启动自动解析失败: {str(e)}")
            # 不影响上传功能，即使解析失败也返回上传成功
        
        app_logger.info(f"用户 {current_user.id} 上传了简历文件: {filename}")
        
        return file_response
    except Exception as e:
        app_logger.error(f"简历文件上传失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"简历文件上传失败: {str(e)}"
        )

@router.delete("/{filename}", response_model=schemas.DeleteFileResponse)
async def delete_resume_file(
    filename: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    删除简历文件
    同时删除数据库中的记录和物理存储的文件
    """
    try:
        app_logger.info(f"准备删除简历文件: {filename}, 用户ID: {current_user.id}")
        
        # URL解码文件名
        decoded_filename = unquote(filename)
        app_logger.info(f"解码后的文件名: {decoded_filename}")
        
        # 构建文件路径
        upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
        file_path = os.path.join(upload_dir, decoded_filename)
        app_logger.info(f"文件路径: {file_path}")
        
        # 保存可能的AI分析文件路径
        ai_analysis_files = []
        
        # 1. 删除数据库记录
        deleted_records = 0
        
        # 尝试多种方式查找匹配的简历记录
        resumes_to_check = []
        
        # 方法1: 通过文件名直接查找
        resumes = find_resume_by_filename(db, decoded_filename, current_user)
        if resumes:
            resumes_to_check.extend(resumes)
        
        # 方法2: 通过构造URL查找
        url_resumes = find_resume_by_constructed_url(db, decoded_filename, current_user)
        if url_resumes:
            # 确保不会重复添加
            for resume in url_resumes:
                if resume not in resumes_to_check:
                    resumes_to_check.append(resume)
        
        # 方法3: 如果前两种方法都没找到，考虑检查用户的所有简历
        if not resumes_to_check:
            app_logger.info("无法通过文件名或URL找到简历记录，正在检查用户所有简历")
            all_resumes = find_all_user_resumes(db, current_user)
            
            # 如果文件名包含时间戳，尝试匹配
            timestamp_match = None
            try:
                parts = decoded_filename.split("_")
                if len(parts) >= 3:
                    timestamp_str = parts[0]
                    app_logger.info(f"从文件名提取的时间戳: {timestamp_str}")
                    
                    for resume in all_resumes:
                        if resume.file_url and timestamp_str in resume.file_url:
                            app_logger.info(f"通过时间戳匹配到简历: {resume.id}")
                            resumes_to_check.append(resume)
            except Exception as e:
                app_logger.warning(f"时间戳匹配过程中出错: {str(e)}")
        
        # 删除匹配的记录
        for resume in resumes_to_check:
            app_logger.info(f"处理简历记录: {resume.id}")
            
            # 保存可能的domain信息，用于匹配AI分析文件
            domain = None
            if hasattr(resume, 'domain') and resume.domain:
                domain = resume.domain
                app_logger.info(f"简历domain: {domain}")
                
                # 尝试从文件名中提取文件上传时间
                timestamp_str = None
                try:
                    resume_filename = resume.file_url.split('/')[-1]
                    parts = resume_filename.split("_")
                    if len(parts) >= 3:
                        timestamp_str = parts[0]
                        app_logger.info(f"从简历文件名提取的时间戳: {timestamp_str}")
                except Exception as e:
                    app_logger.error(f"从URL提取文件名失败: {str(e)}")
                    resume_filename = None
                
                # 保存AI分析文件路径用于后续删除
                if hasattr(resume, 'ai_analysis_file') and resume.ai_analysis_file:
                    ai_analysis_files.append(resume.ai_analysis_file)
                    app_logger.info(f"找到关联的AI分析文件: {resume.ai_analysis_file}")
                # 尝试基于domain和时间戳构建可能的AI分析文件路径
                elif domain and timestamp_str:
                    ai_response_dir = os.path.join(settings.BASE_DIR, "data", "ai_responses")
                    possible_ai_file = os.path.join(ai_response_dir, f"resume_analysis_{domain}_{timestamp_str}.json")
                    ai_analysis_files.append(possible_ai_file)
                    app_logger.info(f"构建可能的AI分析文件路径: {possible_ai_file}")
                
                # 完全删除简历记录
                db.delete(resume)
                deleted_records += 1
        
        # 提交数据库更改
        if deleted_records > 0:
            db.commit()
            app_logger.info(f"已删除 {deleted_records} 条简历记录")
        
        # 2. 删除物理文件
        deleted_file = False
        try:
            # 检查文件是否存在
            if os.path.exists(file_path):
                app_logger.info(f"准备删除文件: {file_path}")
                os.remove(file_path)
                deleted_file = True
                app_logger.info(f"物理文件已删除: {file_path}")
            else:
                app_logger.warning(f"文件不存在，尝试使用时间戳前缀匹配: {file_path}")
                
                # 如果直接匹配失败，尝试查找前缀匹配的文件
                # 用户ID和上传时间戳可能会作为文件名前缀
                try:
                    if os.path.exists(upload_dir):
                        for file in os.listdir(upload_dir):
                            # 尝试匹配用户ID_原始文件名格式
                            if f"_{current_user.id}_" in file:
                                app_logger.info(f"找到可能匹配的文件: {file}")
                                if decoded_filename in file or file.endswith(decoded_filename):
                                    match_path = os.path.join(upload_dir, file)
                                    os.remove(match_path)
                                    app_logger.info(f"删除匹配的文件: {match_path}")
                                    deleted_file = True
                except Exception as e:
                    app_logger.error(f"尝试匹配文件时出错: {str(e)}")
        except Exception as e:
            # 文件删除失败仅记录日志，不中断操作
            app_logger.error(f"删除物理文件时出错: {str(e)}")
        
        # 3. 检查文件是否真的被删除
        if os.path.exists(file_path):
            app_logger.warning(f"文件仍然存在，尝试强制删除: {file_path}")
            try:
                import shutil
                # 尝试使用shutil删除
                if os.path.isfile(file_path):
                    os.chmod(file_path, 0o777)  # 修改权限
                    os.unlink(file_path)  # 尝试使用unlink删除
                    app_logger.info(f"使用unlink删除文件: {file_path}")
                    deleted_file = True
            except Exception as e:
                app_logger.error(f"强制删除文件失败: {str(e)}")
        
        # 4. 删除AI分析文件
        deleted_ai_files = 0
        if ai_analysis_files:
            for ai_file_path in ai_analysis_files:
                try:
                    if os.path.exists(ai_file_path):
                        os.remove(ai_file_path)
                        app_logger.info(f"删除AI分析文件: {ai_file_path}")
                        deleted_ai_files += 1
                    else:
                        app_logger.warning(f"AI分析文件不存在: {ai_file_path}")
                except Exception as e:
                    app_logger.error(f"删除AI分析文件失败: {str(e)}")
        
        # 5. 如果还没找到AI分析文件，尝试扫描ai_responses目录查找匹配模式的文件
        if deleted_ai_files == 0:
            try:
                ai_response_dir = os.path.join(settings.BASE_DIR, "data", "ai_responses")
                app_logger.info(f"开始扫描AI分析文件目录: {ai_response_dir}")
                
                if os.path.exists(ai_response_dir):
                    # 尝试多种方式匹配AI分析文件
                    
                    # 方式1: 从被删除的简历文件名中提取时间戳
                    timestamp_str = None
                    try:
                        parts = decoded_filename.split("_")
                        if len(parts) >= 3:
                            timestamp_str = parts[0]
                            app_logger.info(f"从删除的文件名提取时间戳: {timestamp_str}")
                    except Exception as e:
                        app_logger.error(f"提取时间戳失败: {str(e)}")
                    
                    # 方式2: 查找所有文件，尝试各种匹配策略
                    app_logger.info(f"扫描AI分析目录中的所有文件")
                    all_files = os.listdir(ai_response_dir)
                    app_logger.info(f"目录中有 {len(all_files)} 个文件: {all_files}")
                    
                    for file in all_files:
                        try:
                            file_fullpath = os.path.join(ai_response_dir, file)
                            match_found = False
                            match_reason = ""
                            
                            # 策略1: 文件名以resume_analysis_开头且以.json结尾
                            if file.startswith("resume_analysis_") and file.endswith(".json"):
                                app_logger.info(f"检查AI分析文件: {file}")
                                
                                # 策略2: 如果有时间戳，检查是否匹配
                                if timestamp_str and timestamp_str in file:
                                    match_found = True
                                    match_reason = f"时间戳匹配: {timestamp_str}"
                                
                                # 策略3: 通配符匹配 - 针对domain
                                # 从文件名中提取domain
                                domain_match = None
                                try:
                                    # resume_analysis_DOMAIN_TIMESTAMP.json
                                    file_parts = file.split("_")
                                    if len(file_parts) >= 3:
                                        domain_match = file_parts[2]
                                        app_logger.info(f"从文件名提取的domain: {domain_match}")
                                        
                                        # 如果我们从数据库记录中知道domain
                                        if 'domain' in locals() and domain and domain == domain_match:
                                            match_found = True
                                            match_reason = f"Domain匹配: {domain}"
                                except Exception as e:
                                    app_logger.error(f"从文件名提取domain失败: {str(e)}")
                                
                                # 策略4: 检查文件的最后修改时间，如果在最近30分钟内创建，且没有其他匹配，也可以考虑删除
                                # 只有在没有更精确匹配的情况下使用
                                if not match_found:
                                    try:
                                        file_mod_time = os.path.getmtime(file_fullpath)
                                        file_mod_datetime = datetime.fromtimestamp(file_mod_time)
                                        now = datetime.now()
                                        time_diff = now - file_mod_datetime
                                        
                                        # 如果文件在过去30分钟内修改，且是唯一匹配的AI分析文件，也考虑删除
                                        if time_diff.total_seconds() < 1800 and len([f for f in all_files if f.startswith("resume_analysis_") and f.endswith(".json")]) == 1:
                                            match_found = True
                                            match_reason = f"时间接近: {file_mod_datetime}"
                                    except Exception as e:
                                        app_logger.error(f"检查文件修改时间失败: {str(e)}")
                            
                            # 如果找到匹配，删除文件
                            if match_found:
                                try:
                                    app_logger.info(f"匹配成功({match_reason})，删除AI分析文件: {file_fullpath}")
                                    os.remove(file_fullpath)
                                    deleted_ai_files += 1
                                except Exception as e:
                                    app_logger.error(f"删除匹配的AI分析文件失败: {str(e)}")
                        except Exception as e:
                            app_logger.error(f"处理文件 {file} 时出错: {str(e)}")
            except Exception as e:
                app_logger.error(f"扫描AI分析文件目录时出错: {str(e)}")
        
        return {
            "success": True,
            "deleted_records": deleted_records,
            "deleted_file": deleted_file,
            "deleted_ai_files": deleted_ai_files,
            "message": f"简历文件删除成功，数据库记录已更新，已删除{deleted_ai_files}个AI分析结果文件"
        }
        
    except Exception as e:
        app_logger.error(f"删除简历文件失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除简历文件失败: {str(e)}"
        )

@router.get("/download/{filename}", response_class=FileResponse)
def download_resume_file(
    filename: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    下载简历文件
    """
    try:
        # URL解码文件名
        decoded_filename = unquote(filename)
        
        # 构建文件路径
        upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
        file_path = os.path.join(upload_dir, decoded_filename)
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文件不存在"
            )
        
        # 尝试从文件名中提取原始文件名
        try:
            parts = decoded_filename.split("_", 2)
            original_filename = parts[2] if len(parts) >= 3 else decoded_filename
        except:
            original_filename = decoded_filename
        
        # 获取文件MIME类型
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = "application/octet-stream"
        
        # 返回文件响应
        return FileResponse(
            path=file_path,
            filename=original_filename,
            media_type=mime_type
        )
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"下载简历文件失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"下载简历文件失败: {str(e)}"
        )

# 辅助函数：通过文件名查找简历
def find_resume_by_filename(db: Session, filename: str, current_user: models.User) -> List[models.Resume]:
    app_logger.info(f"尝试通过文件名 {filename} 查找简历记录")
    
    # 尝试从文件名中提取用户ID
    user_id = None
    try:
        parts = filename.split("_")
        if len(parts) > 1:
            user_id = int(parts[1])
            app_logger.info(f"从文件名提取的用户ID: {user_id}")
    except (ValueError, IndexError) as e:
        app_logger.warning(f"无法从文件名提取用户ID: {str(e)}")
    
    # 构建查询
    query = db.query(models.Resume)
    
    # 如果提取出用户ID，使用它作为筛选条件
    if user_id is not None:
        query = query.filter(models.Resume.user_id == user_id)
    else:
        # 否则默认使用当前用户的ID
        query = query.filter(models.Resume.user_id == current_user.id)
    
    # 查找含有文件名的URL
    resumes = query.filter(models.Resume.file_url.like(f"%{filename}%")).all()
    app_logger.info(f"通过文件名找到 {len(resumes)} 个简历记录")
    return resumes

# 辅助函数：通过构造的URL查找简历
def find_resume_by_constructed_url(db: Session, filename: str, current_user: models.User) -> List[models.Resume]:
    app_logger.info(f"尝试通过构造URL查找简历记录")
    
    # 构造可能的URL形式
    base_url = settings.SERVER_HOST if settings.SERVER_HOST.startswith(('http://', 'https://')) else f"http://{settings.SERVER_HOST}"
    possible_urls = [
        f"{base_url}{settings.API_V1_STR}/resume-files/download/{filename}",
        f"{base_url}{settings.API_V1_STR}/resumes/download/{filename}",
        f"{settings.API_V1_STR}/resume-files/download/{filename}",
        f"{settings.API_V1_STR}/resumes/download/{filename}",
        f"/api/v1/resume-files/download/{filename}",
        f"/api/v1/resumes/download/{filename}"
    ]
    
    # 查询符合任一URL的简历
    resumes = []
    for url in possible_urls:
        app_logger.info(f"检查URL: {url}")
        found = db.query(models.Resume).filter(
            models.Resume.file_url == url
        ).all()
        if found:
            app_logger.info(f"通过URL {url} 找到 {len(found)} 个简历记录")
            resumes.extend(found)
    
    return resumes

# 辅助函数：查找用户的所有简历
def find_all_user_resumes(db: Session, current_user: models.User) -> List[models.Resume]:
    app_logger.info(f"获取用户 {current_user.id} 的所有简历记录")
    resumes = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).all()
    app_logger.info(f"找到用户 {current_user.id} 的 {len(resumes)} 个简历记录")
    return resumes

@router.post("/cleanup", response_model=schemas.CleanupResponse)
async def cleanup_resume_files(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    清理未关联的简历文件
    仅限超级管理员使用
    """
    try:
        app_logger.info(f"开始清理未关联的简历文件，操作者: {current_user.email}")
        
        # 获取上传目录
        upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
        if not os.path.exists(upload_dir):
            return {"success": True, "deleted_files": 0, "message": "上传目录不存在"}
        
        # 获取文件系统中所有简历文件
        try:
            all_files = os.listdir(upload_dir)
            app_logger.info(f"找到 {len(all_files)} 个文件")
        except Exception as e:
            app_logger.error(f"获取文件列表失败: {str(e)}")
            return {"success": False, "deleted_files": 0, "message": f"获取文件列表失败: {str(e)}"}
        
        # 获取数据库中所有简历记录
        all_resumes = db.query(models.Resume).all()
        app_logger.info(f"数据库中有 {len(all_resumes)} 条简历记录")
        
        # 提取所有有效的文件名
        valid_filenames = []
        for resume in all_resumes:
            if resume.file_url:
                try:
                    filename = resume.file_url.split('/')[-1]
                    valid_filenames.append(filename)
                except Exception as e:
                    app_logger.error(f"从简历URL提取文件名失败: {str(e)}, URL: {resume.file_url}")
        
        app_logger.info(f"数据库中有效的文件名: {valid_filenames}")
        
        # 删除未关联的文件
        deleted_files = 0
        for file in all_files:
            if file not in valid_filenames:
                try:
                    file_path = os.path.join(upload_dir, file)
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        app_logger.info(f"删除未关联的文件: {file}")
                        deleted_files += 1
                except Exception as e:
                    app_logger.error(f"删除文件失败: {str(e)}, 文件: {file}")
        
        return {
            "success": True,
            "deleted_files": deleted_files,
            "message": f"成功清理 {deleted_files} 个未关联的简历文件"
        }
        
    except Exception as e:
        app_logger.error(f"清理简历文件失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"清理简历文件失败: {str(e)}"
        )
