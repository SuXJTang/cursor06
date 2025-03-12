from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api import deps
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackInDB
from app.crud import feedback as crud_feedback
import os
import shutil
from datetime import datetime

router = APIRouter()

# 配置上传文件保存路径
UPLOAD_DIR = "uploads/screenshots"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/feedback", response_model=FeedbackResponse)
async def create_feedback(
    *,
    db: Session = Depends(deps.get_db),
    type: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    contact: Optional[str] = Form(None),
    screenshots: List[UploadFile] = File(None)
):
    """
    创建新的反馈
    """
    try:
        # 处理文件上传
        screenshot_paths = []
        if screenshots:
            for file in screenshots:
                if file.content_type.startswith('image/'):
                    # 生成唯一文件名
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"{timestamp}_{file.filename}"
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    
                    # 保存文件
                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(file.file, buffer)
                    
                    screenshot_paths.append(file_path)
                else:
                    raise HTTPException(status_code=400, detail="只支持图片文件上传")

        # 创建反馈数据
        feedback_in = FeedbackCreate(
            type=type,
            title=title,
            description=description,
            contact=contact
        )
        
        # 保存到数据库
        db_feedback = crud_feedback.create_feedback(
            db=db,
            feedback=feedback_in,
            screenshots=";".join(screenshot_paths) if screenshot_paths else None
        )

        return FeedbackResponse(
            message="反馈提交成功",
            feedback_id=db_feedback.id
        )

    except Exception as e:
        # 如果出错，删除已上传的文件
        for path in screenshot_paths:
            if os.path.exists(path):
                os.remove(path)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/{feedback_id}", response_model=FeedbackInDB)
def read_feedback(
    feedback_id: int,
    db: Session = Depends(deps.get_db)
):
    """
    获取特定反馈
    """
    feedback = crud_feedback.get_feedback(db, feedback_id)
    if feedback is None:
        raise HTTPException(status_code=404, detail="反馈不存在")
    return feedback

@router.get("/feedbacks/", response_model=List[FeedbackInDB])
def list_feedbacks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """
    获取反馈列表
    """
    feedbacks = crud_feedback.list_feedbacks(db, skip=skip, limit=limit)
    return feedbacks 