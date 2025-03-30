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
from datetime import datetime, timedelta
import traceback
import platform
import ctypes
import subprocess
import sys
import getpass
import stat

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

try:
    import win32api
    import win32con
    PYWIN32_AVAILABLE = True
except ImportError:
    PYWIN32_AVAILABLE = False

from app.core.logging_config import app_logger
from app.core.config import settings
from app import crud, models, schemas
from app.api import deps
from app.schemas.resume import ResumeCreate, ResumeFile, ResumeStatus
from app.services.resume import perform_resume_parsing

router = APIRouter()

@router.get("/", response_model=List[schemas.ResumeFile])
async def list_resume_files(
    *,
    db: Session = Depends(deps.get_async_db),
    current_user: models.User = Depends(deps.get_current_active_user_async),
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
    # 使用异步查询
    from sqlalchemy.future import select
    from sqlalchemy.orm import selectinload
    
    stmt = select(models.Resume).where(models.Resume.user_id == current_user.id)
    result = await db.execute(stmt)
    resume = result.scalars().first()
    
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
async def upload_resume_file(
    *,
    db: Session = Depends(deps.get_async_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user_async),
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
        
        # 生成唯一文件名
        timestamp = int(time.time())
        unique_filename = f"{timestamp}_{current_user.id}_{filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # 分块保存文件，避免将整个文件加载到内存
        file_size = 0
        chunk_size = 1024 * 1024  # 1MB块
        app_logger.info(f"开始分块保存文件: {unique_filename}")
        start_time = time.time()
        
        with open(file_path, "wb") as f:
            # 使用seek(0)确保从文件开头读取
            file.file.seek(0)
            
            # 分块读取并写入
            while chunk := file.file.read(chunk_size):
                f.write(chunk)
                file_size += len(chunk)
                
                # 检查文件大小
                if file_size > settings.MAX_UPLOAD_SIZE:
                    # 关闭并删除已写入的文件
                    f.close()
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"文件太大。最大允许大小: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
                    )
        
        end_time = time.time()
        app_logger.info(f"文件保存完成，耗时: {end_time - start_time:.2f}秒，大小: {file_size}字节")
        
        # 生成文件URL - 添加http前缀
        base_url = settings.SERVER_HOST if settings.SERVER_HOST.startswith(('http://', 'https://')) else f"http://{settings.SERVER_HOST}"
        file_url = f"{base_url}{settings.API_V1_STR}/resume-files/download/{unique_filename}"
        
        # 数据库处理
        db_start_time = time.time()
        
        # 查找用户的简历
        from sqlalchemy.future import select
        
        stmt = select(models.Resume).where(models.Resume.user_id == current_user.id)
        result = await db.execute(stmt)
        resume = result.scalars().first()
        
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
                app_logger.error(f"删除旧简历文件时出错: {str(e)}")
        
        # 如果没有简历记录，则创建一个新的
        if not resume:
            try:
                resume_in = ResumeCreate(
                    title=os.path.splitext(filename)[0][:50],  # 使用前50个字符作为标题
                    description="",  # 初始描述为空
                    content="",  # 初始内容为空
                    file_url=file_url,
                    status=ResumeStatus.DRAFT  # 使用枚举值
                )
                # 使用异步创建
                from app.models.resume import Resume
                
                # 创建新简历对象
                db_obj = Resume(
                    user_id=current_user.id,
                    title=resume_in.title,
                    description=resume_in.description,
                    content=resume_in.content,
                    file_url=resume_in.file_url,
                    status=resume_in.status
                )
                db.add(db_obj)
                await db.commit()
                await db.refresh(db_obj)
                resume = db_obj
                
                app_logger.info(f"已为用户 {current_user.id} 创建新简历，ID: {resume.id}")
            except Exception as e:
                app_logger.error(f"创建简历记录时出错: {str(e)}")
                app_logger.error(traceback.format_exc())
                # 尝试回滚事务
                await db.rollback()
                
                # 应该删除已上传的文件
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                        app_logger.info(f"上传文件处理失败，已删除文件: {file_path}")
                    except Exception as remove_err:
                        app_logger.error(f"删除上传文件时出错: {str(remove_err)}")
                
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"创建简历记录时出错: {str(e)}"
                )
        else:
            # 更新简历的文件URL
            resume.file_url = file_url
            await db.commit()
            await db.refresh(resume)
        
        db_end_time = time.time()
        app_logger.info(f"数据库操作完成，耗时: {db_end_time - db_start_time:.2f}秒")
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
        
        app_logger.info(f"用户 {current_user.id} 上传了简历文件: {filename}, 总耗时: {time.time() - start_time:.2f}秒")
        
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
    db: Session = Depends(deps.get_async_db),
    current_user: models.User = Depends(deps.get_current_active_user_async),
) -> Any:
    """
    删除简历文件
    同时删除数据库中的记录和物理存储的文件，以及相关的所有AI分析文件
    """
    try:
        app_logger.info(f"准备删除简历文件: {filename}, 用户ID: {current_user.id}")
        
        # URL解码文件名
        decoded_filename = unquote(filename)
        app_logger.info(f"解码后的文件名: {decoded_filename}")
        
        # 构建文件路径
        upload_dir = os.path.join(settings.STATIC_DIR, "resumes")
        file_path = os.path.join(upload_dir, decoded_filename)
        app_logger.info(f"简历文件路径: {file_path}")
        
        # 获取项目根目录
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        app_logger.info(f"项目根目录: {base_dir}")
        
        # 确保ai_responses目录存在
        ai_response_dir = os.path.join(base_dir, "data", "ai_responses")
        os.makedirs(ai_response_dir, exist_ok=True)
        app_logger.info(f"AI响应目录: {ai_response_dir}")
        
        # 1. 查找相关的简历记录(但还不删除)
        deleted_records = 0
        resumes_to_check = []
        ai_analysis_files = []
        
        # 方法1: 通过文件名直接查找
        resumes = await find_resume_by_filename(db, decoded_filename, current_user)
        if resumes:
            resumes_to_check.extend(resumes)
        
        # 方法2: 通过构造URL查找
        url_resumes = await find_resume_by_constructed_url(db, decoded_filename, current_user)
        if url_resumes:
            # 确保不会重复添加
            for resume in url_resumes:
                if resume not in resumes_to_check:
                    resumes_to_check.append(resume)
        
        # 方法3: 如果前两种方法都没找到，考虑检查用户的所有简历
        if not resumes_to_check:
            app_logger.info("无法通过文件名或URL找到简历记录，正在检查用户所有简历")
            all_resumes = await find_all_user_resumes(db, current_user)
            resumes_to_check = all_resumes  # 考虑用户所有简历
            
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
                            if resume not in resumes_to_check:
                                resumes_to_check.append(resume)
            except Exception as e:
                app_logger.warning(f"时间戳匹配过程中出错: {str(e)}")
        
        # 2. 从简历记录中获取相关信息
        domains = set()  # 使用集合避免重复
        timestamps = set()
        username = None
        user_id = str(current_user.id)
        resume_ids = []  # 保存所有简历ID用于标记删除
        
        for resume in resumes_to_check:
            app_logger.info(f"处理简历记录: {resume.id}")
            resume_ids.append(resume.id)
            
            # 从这里开始添加 - 立即标记简历为已删除，防止后台任务继续处理
            try:
                from app.services.resume import mark_resume_deleted
                await mark_resume_deleted(resume.id)
                app_logger.info(f"已标记简历ID {resume.id} 为已删除状态")
            except Exception as e:
                app_logger.warning(f"标记简历为已删除失败: {str(e)}")
            # 添加结束
            
            # 保存AI分析文件路径
            if hasattr(resume, 'ai_analysis_file') and resume.ai_analysis_file:
                # 如果是相对路径，转换为绝对路径
                ai_file_path = resume.ai_analysis_file
                if not os.path.isabs(ai_file_path):
                    ai_file_path = os.path.join(base_dir, ai_file_path)
                
                app_logger.info(f"找到AI分析文件路径: {ai_file_path}")
                if ai_file_path not in ai_analysis_files:
                    ai_analysis_files.append(ai_file_path)
            
            # 收集所有域名信息
            if hasattr(resume, 'domain') and resume.domain:
                domains.add(resume.domain)
                app_logger.info(f"添加简历domain: {resume.domain}")
            
            # 尝试获取用户名
            try:
                if hasattr(resume, 'user') and resume.user and resume.user.username:
                    username = resume.user.username
                    app_logger.info(f"用户名: {username}")
            except Exception as e:
                app_logger.warning(f"获取用户名失败: {str(e)}")
            
            # 提取所有可能的时间戳
            try:
                if resume.file_url:
                    resume_filename = resume.file_url.split('/')[-1]
                    parts = resume_filename.split("_")
                    if len(parts) >= 3:
                        timestamps.add(parts[0])
                        app_logger.info(f"添加时间戳: {parts[0]}")
                
                # 从创建时间和更新时间提取时间戳格式
                if hasattr(resume, 'created_at') and resume.created_at:
                    created_timestamp = resume.created_at.strftime("%Y%m%d")
                    timestamps.add(created_timestamp)
                    app_logger.info(f"添加创建时间戳: {created_timestamp}")
                
                if hasattr(resume, 'updated_at') and resume.updated_at:
                    updated_timestamp = resume.updated_at.strftime("%Y%m%d")
                    timestamps.add(updated_timestamp)
                    app_logger.info(f"添加更新时间戳: {updated_timestamp}")
            except Exception as e:
                app_logger.warning(f"提取时间戳失败: {str(e)}")
        
        # 添加当天的时间戳
        today_timestamp = datetime.now().strftime("%Y%m%d")
        timestamps.add(today_timestamp)
        app_logger.info(f"添加今日时间戳: {today_timestamp}")
        
        # 3. 构建所有可能的AI分析文件名模式
        file_patterns = []
        
        # 基于域名的模式
        for domain in domains:
            file_patterns.append(f"resume_analysis_{domain}_")
        
        # 基于时间戳的模式
        for timestamp in timestamps:
            file_patterns.append(f"resume_analysis_IT_{timestamp}")
            # 如果有域名，也组合域名和时间戳
            for domain in domains:
                file_patterns.append(f"resume_analysis_{domain}_{timestamp}")
        
        # 基于用户ID的模式
        file_patterns.append(f"resume_analysis_{user_id}_")
        
        # 基于用户名的模式
        if username:
            file_patterns.append(f"resume_analysis_{username}_")
        
        # 通用模式 - 通常使用的格式
        file_patterns.append("resume_analysis_IT_")
        file_patterns.append("resume_analysis_")
        
        app_logger.info(f"构建了 {len(file_patterns)} 个文件匹配模式")
        
        # 4. 扫描目录查找所有匹配的文件
        if os.path.exists(ai_response_dir):
            all_json_files = [f for f in os.listdir(ai_response_dir) if f.endswith(".json")]
            app_logger.info(f"发现 {len(all_json_files)} 个JSON文件")
            
            # 检查每个JSON文件是否匹配任何模式
            for json_file in all_json_files:
                matched = False
                
                # 检查是否匹配任何模式
                for pattern in file_patterns:
                    if pattern in json_file:
                        matched = True
                        file_path = os.path.join(ai_response_dir, json_file)
                        if file_path not in ai_analysis_files:
                            app_logger.info(f"通过模式匹配找到文件: {json_file}")
                            ai_analysis_files.append(file_path)
                        break
                
                # 如果没有匹配模式，检查文件内容
                if not matched:
                    file_path = os.path.join(ai_response_dir, json_file)
                    try:
                        # 检查文件修改时间，如果是最近创建的文件，优先检查内容
                        file_mtime = os.path.getmtime(file_path)
                        file_mtime_dt = datetime.fromtimestamp(file_mtime)
                        now_dt = datetime.now()
                        time_diff = (now_dt - file_mtime_dt).total_seconds()
                        
                        # 如果是最近30分钟内创建的文件
                        if time_diff < 1800:  # 30分钟 = 1800秒
                            app_logger.info(f"检查最近创建的文件内容: {json_file}")
                            
                            # 读取文件内容查找用户ID或其他标识
                            try:
                                with open(file_path, 'r', encoding='utf-8') as f:
                                    content = f.read()
                                    
                                    # 检查内容中是否包含用户ID或用户名
                                    identifiers = [user_id]
                                    if username:
                                        identifiers.append(username)
                                    
                                    # 检查内容中是否包含任何域名
                                    identifiers.extend(domains)
                                    
                                    for identifier in identifiers:
                                        if identifier in content:
                                            app_logger.info(f"通过内容匹配找到文件: {json_file}")
                                            if file_path not in ai_analysis_files:
                                                ai_analysis_files.append(file_path)
                                            break
                            except Exception as e:
                                app_logger.warning(f"读取文件内容失败: {json_file}, 错误: {str(e)}")
                    except Exception as e:
                        app_logger.warning(f"检查文件属性失败: {json_file}, 错误: {str(e)}")
        
        # 5. 删除所有找到的AI分析文件
        deleted_ai_files = 0
        for ai_file_path in ai_analysis_files:
            try:
                app_logger.info(f"尝试删除AI分析文件: {ai_file_path}")
                
                # 检查文件是否存在
                if os.path.exists(ai_file_path):
                    try:
                        # 先修改权限
                        try:
                            os.chmod(ai_file_path, 0o777)
                        except Exception as chmod_e:
                            app_logger.warning(f"修改文件权限失败: {str(chmod_e)}")
                        
                        # 尝试删除
                        os.remove(ai_file_path)
                        app_logger.info(f"成功删除AI分析文件")
                        deleted_ai_files += 1
                    except Exception as e:
                        app_logger.error(f"删除文件失败: {str(e)}")
                        
                        # 尝试使用替代方法
                        delete_methods = [
                            # 重命名后删除
                            lambda path: (os.rename(path, f"{path}.tmp"), time.sleep(1), os.remove(f"{path}.tmp")),
                            
                            # 使用unlink
                            lambda path: os.unlink(path),
                            
                            # 使用系统命令
                            lambda path: subprocess.run(
                                f'del /f /q "{path}"' if os.name == 'nt' else f'rm -f "{path}"',
                                shell=True, check=True
                            )
                        ]
                        
                        for i, method in enumerate(delete_methods):
                            try:
                                app_logger.info(f"尝试替代删除方法 {i+1}")
                                method(ai_file_path)
                                
                                if not os.path.exists(ai_file_path):
                                    app_logger.info(f"方法 {i+1} 成功删除文件")
                                    deleted_ai_files += 1
                                    break
                            except Exception as method_e:
                                app_logger.error(f"方法 {i+1} 失败: {str(method_e)}")
                else:
                    app_logger.warning(f"AI分析文件不存在: {ai_file_path}")
            except Exception as e:
                app_logger.error(f"处理AI分析文件时出错: {str(e)}")
                import traceback
                app_logger.error(traceback.format_exc())
                
        # 6. 清空目录中的所有相关文件
        # 获取当天和前一天的时间戳，彻底清理可能与用户相关的文件
        today = datetime.now().strftime("%Y%m%d")
        try:
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y%m%d")
            app_logger.info(f"彻底扫描目录，清理与用户有关的最近文件 (今天: {today}, 昨天: {yesterday})")
            
            if os.path.exists(ai_response_dir):
                remaining_files = [f for f in os.listdir(ai_response_dir) 
                                 if f.endswith(".json") and (today in f or yesterday in f)]
                
                for rem_file in remaining_files:
                    # 排除已处理的文件
                    rem_path = os.path.join(ai_response_dir, rem_file)
                    if rem_path not in ai_analysis_files:
                        app_logger.info(f"发现未处理的最近文件: {rem_file}")
                        
                        # 尝试读取文件检查是否与当前用户有关
                        try:
                            with open(rem_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                if str(current_user.id) in content:
                                    app_logger.info(f"文件内容含有用户ID，删除文件: {rem_file}")
                                    try:
                                        os.chmod(rem_path, 0o777)  # 先修改权限
                                        os.remove(rem_path)
                                        deleted_ai_files += 1
                                    except Exception as e:
                                        app_logger.error(f"删除关联文件失败: {str(e)}")
                        except Exception as e:
                            app_logger.warning(f"读取文件内容失败: {rem_file}, 错误: {str(e)}")
        except Exception as e:
            app_logger.error(f"清理最近文件出错: {str(e)}")
            
        # 7. 最后一次扫描，检查是否存在明确应当删除的文件但尚未删除
        try:
            # 今天创建的与IT或用户当前域名相关的所有文件
            final_scan_patterns = [f"resume_analysis_IT_{today}", f"resume_analysis_IT_{yesterday}"]
            for domain in domains:
                final_scan_patterns.append(f"resume_analysis_{domain}_{today}")
                final_scan_patterns.append(f"resume_analysis_{domain}_{yesterday}")
                
            if os.path.exists(ai_response_dir):
                all_files = os.listdir(ai_response_dir)
                for file in all_files:
                    if file.endswith(".json"):
                        for pattern in final_scan_patterns:
                            if pattern in file:
                                file_path = os.path.join(ai_response_dir, file)
                                app_logger.info(f"最终扫描发现相关文件: {file}")
                                
                                # 检查是否已处理
                                if file_path not in ai_analysis_files:
                                    try:
                                        os.chmod(file_path, 0o777)  # 先修改权限
                                        os.remove(file_path)
                                        app_logger.info(f"成功删除关联文件: {file}")
                                        deleted_ai_files += 1
                                    except Exception as e:
                                        app_logger.error(f"删除关联文件失败: {str(e)}")
        except Exception as e:
            app_logger.error(f"最终扫描清理出错: {str(e)}")
            
        # 8. 创建监控批处理脚本，用于后台持续删除文件
        try:
            # 检查是否有最新添加但尚未删除的文件
            if os.path.exists(ai_response_dir):
                bat_file = os.path.join(ai_response_dir, f"cleanup_{int(time.time())}.bat")
                app_logger.info(f"创建后台监控脚本: {bat_file}")
                
                with open(bat_file, 'w') as f:
                    f.write("@echo off\n")
                    f.write("REM 等待10秒，让系统有时间完成操作\n")
                    f.write("timeout /t 10 /nobreak > nul\n\n")
                    
                    # 添加删除命令，针对所有可能的文件模式
                    f.write("REM 删除所有可能的AI分析文件\n")
                    for pattern in final_scan_patterns:
                        f.write(f'del /f /q "{os.path.join(ai_response_dir, pattern)}*.json" > nul 2>&1\n')
                    
                    # 如果是Windows，使用forfiles命令删除最近创建的文件
                    if os.name == 'nt':
                        f.write("\nREM 删除今天创建的所有JSON文件\n")
                        f.write(f'forfiles /p "{ai_response_dir}" /m *.json /d 0 /c "cmd /c del /f /q @path" > nul 2>&1\n')
                    
                    # 最后删除脚本自身
                    f.write("\nREM 删除脚本自身\n")
                    f.write("(goto) 2>nul & del \"%~f0\"\n")
                
                # 执行批处理脚本
                if os.path.exists(bat_file):
                    app_logger.info("执行后台监控脚本")
                    subprocess.Popen(f'start /b "" "{bat_file}"', shell=True, 
                                    creationflags=subprocess.CREATE_NO_WINDOW)
        except Exception as e:
            app_logger.error(f"创建监控脚本失败: {str(e)}")

        # 9. 删除简历文件
        deleted_file = False
        try:
            # 检查文件是否存在
            if os.path.exists(file_path):
                app_logger.info(f"删除简历文件: {file_path}")
                os.remove(file_path)
                deleted_file = True
            else:
                app_logger.warning(f"简历文件不存在，尝试使用时间戳前缀匹配")
                
                # 如果直接匹配失败，尝试查找前缀匹配的文件
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
            app_logger.error(f"删除简历文件时出错: {str(e)}")
        
        # 最后删除数据库记录
        for resume in resumes_to_check:
            await db.delete(resume)
            deleted_records += 1
            app_logger.info(f"删除数据库记录: 简历ID {resume.id}")
        
        # 提交数据库更改
        if deleted_records > 0:
            await db.commit()
            app_logger.info(f"已删除 {deleted_records} 条简历记录")
        
        return {
            "success": True,
            "deleted_records": deleted_records,
            "deleted_file": deleted_file,
            "deleted_ai_files": deleted_ai_files,
            "message": f"简历文件删除成功，数据库记录已更新，已删除{deleted_ai_files}个AI分析结果文件"
        }
        
    except Exception as e:
        app_logger.error(f"删除简历文件失败: {str(e)}")
        import traceback
        app_logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除简历文件失败: {str(e)}"
        )

@router.get("/download/{filename}", response_class=FileResponse)
async def download_resume_file(
    filename: str,
    db: Session = Depends(deps.get_async_db),
    current_user: models.User = Depends(deps.get_current_active_user_async),
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
async def find_resume_by_filename(db: Session, filename: str, current_user: models.User) -> List[models.Resume]:
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
    from sqlalchemy.future import select
    
    # 如果提取出用户ID，使用它作为筛选条件
    if user_id is not None:
        stmt = select(models.Resume).where(models.Resume.user_id == user_id, models.Resume.file_url.like(f"%{filename}%"))
    else:
        # 否则默认使用当前用户的ID
        stmt = select(models.Resume).where(models.Resume.user_id == current_user.id, models.Resume.file_url.like(f"%{filename}%"))
    
    # 查找含有文件名的URL
    result = await db.execute(stmt)
    resumes = result.scalars().all()
    app_logger.info(f"通过文件名找到 {len(resumes)} 个简历记录")
    return resumes

# 辅助函数：通过构造的URL查找简历
async def find_resume_by_constructed_url(db: Session, filename: str, current_user: models.User) -> List[models.Resume]:
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
    from sqlalchemy.future import select
    
    resumes = []
    for url in possible_urls:
        app_logger.info(f"检查URL: {url}")
        stmt = select(models.Resume).where(models.Resume.file_url == url)
        result = await db.execute(stmt)
        found = result.scalars().all()
        if found:
            app_logger.info(f"通过URL {url} 找到 {len(found)} 个简历记录")
            resumes.extend(found)
    
    return resumes

# 辅助函数：查找用户的所有简历
async def find_all_user_resumes(db: Session, current_user: models.User) -> List[models.Resume]:
    app_logger.info(f"查找用户 {current_user.id} 的所有简历")
    
    from sqlalchemy.future import select
    
    stmt = select(models.Resume).where(models.Resume.user_id == current_user.id)
    result = await db.execute(stmt)
    resumes = result.scalars().all()
    
    app_logger.info(f"找到 {len(resumes)} 个简历记录")
    return resumes

@router.post("/cleanup", response_model=schemas.CleanupResponse)
async def cleanup_resume_files(
    db: Session = Depends(deps.get_async_db),
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

@router.get("/check-file-permissions", response_model=dict)
async def check_file_permissions(
    current_user: models.User = Depends(deps.get_current_active_user_async),
) -> Any:
    """
    检查文件权限
    """
    try:
        result = {
            "success": True,
            "permissions": {},
            "system_info": {},
            "files_info": {}
        }
        
        # 检查系统信息
        result["system_info"]["platform"] = platform.system()
        result["system_info"]["version"] = platform.version()
        result["system_info"]["current_user"] = getpass.getuser()
        result["system_info"]["admin_rights"] = is_admin()
        
        # 创建测试文件检查权限
        test_file_path = os.path.join(settings.STATIC_DIR, "test_permission.txt")
        test_dir_path = os.path.join(settings.STATIC_DIR, "test_dir")
        
        try:
            # 测试文件创建权限
            with open(test_file_path, 'w') as f:
                f.write("Test permission file")
            result["permissions"]["can_create_file"] = True
            
            # 测试文件删除权限
            try:
                os.remove(test_file_path)
                result["permissions"]["can_delete_file"] = True
            except Exception as e:
                result["permissions"]["can_delete_file"] = False
                result["permissions"]["delete_error"] = str(e)
        except Exception as e:
            result["permissions"]["can_create_file"] = False
            result["permissions"]["create_error"] = str(e)
        
        # 测试目录权限
        try:
            os.makedirs(test_dir_path, exist_ok=True)
            result["permissions"]["can_create_dir"] = True
            
            try:
                os.rmdir(test_dir_path)
                result["permissions"]["can_delete_dir"] = True
            except Exception as e:
                result["permissions"]["can_delete_dir"] = False
                result["permissions"]["delete_dir_error"] = str(e)
        except Exception as e:
            result["permissions"]["can_create_dir"] = False
            result["permissions"]["create_dir_error"] = str(e)
        
        # 检查AI响应目录
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        ai_response_dir = os.path.join(base_dir, "data", "ai_responses")
        
        if os.path.exists(ai_response_dir):
            result["files_info"]["ai_responses_dir_exists"] = True
            
            # 获取目录权限
            dir_stat = os.stat(ai_response_dir)
            result["files_info"]["ai_dir_perms"] = stat.filemode(dir_stat.st_mode)
            result["files_info"]["ai_dir_uid"] = dir_stat.st_uid
            result["files_info"]["ai_dir_gid"] = dir_stat.st_gid
            
            # 列出目录中的文件
            files = os.listdir(ai_response_dir)
            result["files_info"]["file_count"] = len(files)
            
            # 检查具体文件
            for file in files:
                if file.endswith(".json"):
                    file_path = os.path.join(ai_response_dir, file)
                    file_info = {}
                    
                    try:
                        file_stat = os.stat(file_path)
                        file_info["size"] = file_stat.st_size
                        file_info["perms"] = stat.filemode(file_stat.st_mode)
                        file_info["uid"] = file_stat.st_uid
                        file_info["gid"] = file_stat.st_gid
                        file_info["readable"] = os.access(file_path, os.R_OK)
                        file_info["writable"] = os.access(file_path, os.W_OK)
                        file_info["executable"] = os.access(file_path, os.X_OK)
                        
                        # 检查文件是否被锁定
                        file_info["locked"] = False
                        try:
                            with open(file_path, "a") as f:
                                pass  # 尝试打开文件进行追加写入
                        except IOError:
                            file_info["locked"] = True
                    except Exception as e:
                        file_info["error"] = str(e)
                    
                    result["files_info"][file] = file_info
        else:
            result["files_info"]["ai_responses_dir_exists"] = False
        
        return result
    except Exception as e:
        app_logger.error(f"检查文件权限失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"检查文件权限失败: {str(e)}"
        )

@router.delete("/force-delete/{filename}", response_model=dict)
async def force_delete_file(
    filename: str,
    current_user: models.User = Depends(deps.get_current_active_user_async),
) -> Any:
    """
    强制删除文件
    """
    try:
        # URL解码文件名
        decoded_filename = unquote(filename)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        ai_response_dir = os.path.join(base_dir, "data", "ai_responses")
        file_path = os.path.join(ai_response_dir, decoded_filename)
        
        result = {
            "success": False,
            "methods_tried": [],
            "file_exists": os.path.exists(file_path)
        }
        
        if not os.path.exists(file_path):
            result["message"] = "文件不存在"
            return result
        
        # 方法1: 使用os.remove
        try:
            os.chmod(file_path, 0o777)  # 先赋予所有权限
            os.remove(file_path)
            result["methods_tried"].append("os.remove - 成功")
            result["success"] = True
            return result
        except Exception as e:
            result["methods_tried"].append(f"os.remove - 失败: {str(e)}")
        
        # 方法2: 使用os.unlink
        try:
            os.unlink(file_path)
            result["methods_tried"].append("os.unlink - 成功")
            result["success"] = True
            return result
        except Exception as e:
            result["methods_tried"].append(f"os.unlink - 失败: {str(e)}")
        
        # 方法3: 使用del命令
        try:
            subprocess.run(f'del /f /q "{file_path}"', shell=True, check=True)
            if not os.path.exists(file_path):
                result["methods_tried"].append("del命令 - 成功")
                result["success"] = True
                return result
            else:
                result["methods_tried"].append("del命令 - 失败: 文件仍然存在")
        except Exception as e:
            result["methods_tried"].append(f"del命令 - 失败: {str(e)}")
        
        # 方法4: 使用Windows API
        if PYWIN32_AVAILABLE:
            try:
                win32api.SetFileAttributes(file_path, win32con.FILE_ATTRIBUTE_NORMAL)
                os.remove(file_path)
                result["methods_tried"].append("Win32 API - 成功")
                result["success"] = True
                return result
            except Exception as e:
                result["methods_tried"].append(f"Win32 API - 失败: {str(e)}")
        
        # 方法5: 使用管理员权限通过PowerShell
        try:
            cmd = f'powershell -Command "Start-Process cmd -ArgumentList \'/c del /f /q \"{file_path}\"\' -Verb RunAs"'
            subprocess.run(cmd, shell=True, check=False)
            
            # 等待一会儿再检查文件是否存在
            time.sleep(2)
            if not os.path.exists(file_path):
                result["methods_tried"].append("管理员权限 - 成功")
                result["success"] = True
                return result
            else:
                result["methods_tried"].append("管理员权限 - 失败: 文件仍然存在")
        except Exception as e:
            result["methods_tried"].append(f"管理员权限 - 失败: {str(e)}")
        
        # 方法6: 创建和执行批处理文件
        try:
            batch_path = os.path.join(ai_response_dir, f"del_{uuid.uuid4().hex}.bat")
            with open(batch_path, 'w') as f:
                f.write("@echo off\n")
                f.write("timeout /t 3 /nobreak > nul\n")  # 等待3秒
                f.write(f'del /f /q "{file_path}"\n')
                f.write(f'del /f /q "%~f0"\n')  # 删除批处理文件自身
            
            # 执行批处理
            subprocess.Popen(f'start /b "" "{batch_path}"', shell=True, 
                            creationflags=subprocess.CREATE_NO_WINDOW)
            result["methods_tried"].append("批处理文件 - 已启动，结果未知")
            result["message"] = "已启动后台删除进程，请稍后检查文件是否被删除"
        except Exception as e:
            result["methods_tried"].append(f"批处理文件 - 失败: {str(e)}")
        
        return result
    except Exception as e:
        app_logger.error(f"强制删除文件失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"强制删除文件失败: {str(e)}"
        )

# 检查当前进程是否具有管理员权限
def is_admin():
    try:
        if platform.system() == 'Windows':
            return ctypes.windll.shell32.IsUserAnAdmin() != 0
        else:
            return os.geteuid() == 0  # Unix系统检查是否为root
    except:
        return False

@router.get("/templates", response_model=List[schemas.TemplateFile])
async def list_templates(
    *,
    current_user: models.User = Depends(deps.get_current_active_user_async)
) -> Any:
    """
    获取系统提供的简历模板文件列表
    """
    # 获取模板目录
    template_dir = os.path.join(settings.STATIC_DIR, "templates")
    if not os.path.exists(template_dir):
        return []
    
    templates = []
    try:
        # 遍历模板目录
        for filename in os.listdir(template_dir):
            # 只显示Word和PDF文件
            _, ext = os.path.splitext(filename)
            if ext.lower() not in [".pdf", ".doc", ".docx"]:
                continue
            
            file_path = os.path.join(template_dir, filename)
            file_stats = os.stat(file_path)
            
            # 确定文件类型
            file_type = "application/octet-stream"
            if ext.lower() == ".pdf":
                file_type = "application/pdf"
            elif ext.lower() in [".doc", ".docx"]:
                file_type = "application/msword"
            
            # 构建完整的URL
            base_url = settings.SERVER_HOST if settings.SERVER_HOST.startswith(('http://', 'https://')) else f"http://{settings.SERVER_HOST}"
            file_url = f"{base_url}{settings.API_V1_STR}/resume-files/templates/{filename}"
            
            # 添加到模板列表
            templates.append({
                "filename": filename,
                "file_size": file_stats.st_size,
                "file_type": file_type,
                "file_url": file_url
            })
        
        # 按文件名排序
        templates.sort(key=lambda x: x["filename"])
        
    except Exception as e:
        app_logger.error(f"获取模板列表失败: {str(e)}")
    
    return templates

@router.get("/templates/{filename}", response_class=FileResponse)
async def download_template_file(
    filename: str,
    current_user: models.User = Depends(deps.get_current_active_user_async),
) -> Any:
    """
    下载简历模板文件
    """
    try:
        # URL解码文件名
        decoded_filename = unquote(filename)
        
        # 构建文件路径
        template_dir = os.path.join(settings.STATIC_DIR, "templates")
        file_path = os.path.join(template_dir, decoded_filename)
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="模板文件不存在"
            )
        
        # 获取文件MIME类型
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = "application/octet-stream"
        
        # 返回文件响应
        return FileResponse(
            path=file_path,
            filename=decoded_filename,
            media_type=mime_type
        )
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"下载模板文件失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"下载模板文件失败: {str(e)}"
        )
