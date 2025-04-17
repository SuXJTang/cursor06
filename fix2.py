#!/usr/bin/env python
# -*- coding: utf-8 -*-

# 读取原始文件
with open('backend/app/services/progress_service.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复complete_stage方法中的缩进错误
fixed_method = '''    async def complete_stage(self, user_id: str, session_id: str, stage_name: str) -> None:
        """
        完成当前阶段，更新进度到该阶段的100%
        
        参数:
            user_id: 用户ID
            session_id: 会话ID
            stage_name: 阶段名称
        """
        try:
            # 获取当前进度数据
            progress_data = self.progress_data.get(session_id)
            if not progress_data:
                self.logger.warning(f"【进度服务】找不到会话 {session_id} 的进度数据")
                return
                
            # 获取阶段信息
            stage_info = self.PROGRESS_STAGES.get(stage_name)
            if not stage_info:
                self.logger.warning(f"【进度服务】未知阶段名称: {stage_name}")
                return
            
            # 更新阶段状态为已完成
            stages = progress_data.get("stages", {})
            if stage_name in stages:
                stages[stage_name]["completed"] = True
                stages[stage_name]["end_time"] = time.time()
                
                # 计算阶段耗时
                start_time = stages[stage_name].get("start_time", stages[stage_name]["end_time"])
                duration = stages[stage_name]["end_time"] - start_time
                stages[stage_name]["duration"] = duration
                
                self.logger.info(f"【进度服务】阶段 {stage_name} 已完成，耗时 {duration:.2f} 秒")
            
            # 获取当前进度和目标进度
            current_progress = progress_data["overall_progress"]
            end_percent = stage_info.get("end_percent", 0)
            message = f"已完成{stage_info.get('display_name', stage_name)}"
            
            # 如果进度差距较大，平滑过渡
            if end_percent - current_progress > 10:
                await self.smooth_progress_transition(
                    session_id, 
                    current_progress, 
                    end_percent, 
                    f"正在完成{stage_info.get('display_name', stage_name)}...",
                    steps=4,
                    delay=0.25
                )
            else:
                # 直接更新进度
                await self.update_progress(session_id, end_percent, message)
            
            # 记录阶段完成时间
            self.stage_times[session_id] = {
                "last_stage": stage_name,
                "completed_at": time.time()
            }
            
        except Exception as e:
            self.logger.error(f"【进度服务】完成阶段出错: {str(e)}")
            traceback.print_exc()'''

# 使用正则表达式来替换整个方法
import re
pattern = re.compile(r'    async def complete_stage.*?traceback\.print_exc\(\)', re.DOTALL)
fixed_content = pattern.sub(fixed_method, content)

# 修复ensure_minimum_stage_duration方法中的缩进错误
pattern_ensure = re.compile(r'(\s+return\n\s+# 获取阶段信息)')
fixed_content = re.sub(pattern_ensure, r'                return\n            # 获取阶段信息', fixed_content)

# 修复task_failed方法中的缩进错误
pattern_task_failed = re.compile(r'        if not progress_data:\n(\s+)self\.logger\.warning')
fixed_content = re.sub(pattern_task_failed, r'            if not progress_data:\n                self.logger.warning', fixed_content)

# 修复start_task方法中的缩进错误
pattern_start_task = re.compile(r'        if not progress_data:\n(\s+)self\.logger\.warning')
fixed_content = re.sub(pattern_start_task, r'            if not progress_data:\n                self.logger.warning', fixed_content)

# 修复update_stage_progress方法的return缩进错误
pattern_update_stage = re.compile(r'(\s+)return\n\s+# 获取阶段信息')
fixed_content = re.sub(pattern_update_stage, r'                return\n            # 获取阶段信息', fixed_content)

# 将修复后的内容写入新文件
with open('backend/app/services/progress_service_fixed.py', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print('完整修复版本已创建') 