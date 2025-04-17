#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re

# 读取文件
with open('backend/app/services/progress_service.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复update_progress方法中的return缩进问题
content = re.sub(
    r'            self\.logger\.warning\(f"【进度服务】找不到会话 {session_id} 的进度数据"\)\n( +)return',
    r'            self.logger.warning(f"【进度服务】找不到会话 {session_id} 的进度数据")\n            return',
    content
)

# 修复update_stage方法中的return缩进问题
content = re.sub(
    r'            self\.logger\.warning\(f"【进度服务】未知阶段: {stage_name}"\)\n( +)return',
    r'            self.logger.warning(f"【进度服务】未知阶段: {stage_name}")\n            return',
    content
)

# 修复complete_stage方法中的if和return缩进问题
content = re.sub(
    r'            progress_data = self\.progress_data\.get\(session_id\)\n( +)if not progress_data:',
    r'            progress_data = self.progress_data.get(session_id)\n            if not progress_data:',
    content
)

# 修复ensure_minimum_stage_duration方法中的if和return缩进问题
content = re.sub(
    r'            progress_data = self\.progress_data\.get\(session_id\)\n( +)if not progress_data:',
    r'            progress_data = self.progress_data.get(session_id)\n            if not progress_data:',
    content
)

# 修复task_failed方法中的if和return缩进问题
content = re.sub(
    r'            progress_data = self\.progress_data\.get\(session_id\)\n( +)if not progress_data:',
    r'            progress_data = self.progress_data.get(session_id)\n            if not progress_data:',
    content
)

# 修复start_task方法中的if和return缩进问题
content = re.sub(
    r'            progress_data = self\.progress_data\.get\(session_id\)\n( +)if not progress_data:',
    r'            progress_data = self.progress_data.get(session_id)\n            if not progress_data:',
    content
)

# 写回文件
with open('backend/app/services/progress_service.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('修复完成')  
