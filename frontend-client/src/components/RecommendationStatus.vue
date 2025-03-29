<template>
  <div class="recommendation-status">
    <div v-if="status === 'waiting'" class="status-waiting">
      <el-progress 
        type="circle" 
        :percentage="0" 
        status="warning"
        :stroke-width="10"
        :width="80"
      ></el-progress>
      <div class="status-text">正在等待开始...</div>
    </div>
    
    <div v-else-if="status === 'generating'" class="status-generating">
      <el-progress 
        type="circle" 
        :percentage="progress" 
        :status="progressStatus"
        :stroke-width="10"
        :width="80"
      ></el-progress>
      <div class="status-text">
        <span>{{ getStageText(progress) }}</span>
        <div class="stage-detail">{{ progress }}% 完成</div>
      </div>
    </div>
    
    <div v-else-if="status === 'completed'" class="status-completed">
      <el-progress 
        type="circle" 
        :percentage="100" 
        status="success"
        :stroke-width="10"
        :width="80"
      ></el-progress>
      <div class="status-text">推荐已完成</div>
    </div>
    
    <div v-else-if="status === 'failed'" class="status-failed">
      <el-progress 
        type="circle" 
        :percentage="progress" 
        status="exception"
        :stroke-width="10"
        :width="80"
      ></el-progress>
      <div class="status-text">
        <span>推荐生成失败</span>
        <div class="error-message">{{ error || '未知错误' }}</div>
        <el-button size="small" type="primary" @click="$emit('retry')">重试</el-button>
      </div>
    </div>
    
    <div v-else-if="status === 'error'" class="status-error">
      <el-progress 
        type="circle" 
        :percentage="progress" 
        status="exception"
        :stroke-width="10"
        :width="80"
      ></el-progress>
      <div class="status-text">
        <span>服务暂时不可用</span>
        <div class="error-message">{{ error || '网络连接失败' }}</div>
        <div class="error-actions">
          <el-button size="small" type="primary" @click="$emit('retry')">重试</el-button>
          <el-button size="small" @click="$emit('continue')">继续等待</el-button>
        </div>
        <div class="error-hint">系统将自动重试连接</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'idle'
  },
  progress: {
    type: Number,
    default: 0
  },
  error: {
    type: String,
    default: ''
  }
})

// 根据进度计算状态文本
const getStageText = (progress) => {
  if (progress < 25) return '数据准备中...'
  if (progress < 50) return '算法筛选职业...'
  if (progress < 75) return 'AI深度分析中...'
  return '保存推荐结果...'
}

defineEmits(['retry', 'continue'])

// 计算进度条状态
const progressStatus = computed(() => {
  if (props.progress < 30) return 'warning'
  if (props.progress < 70) return ''
  return 'success'
})
</script>

<style scoped>
.recommendation-status {
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.status-text {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.stage-detail {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.error-message {
  margin: 8px 0;
  font-size: 12px;
  color: #f56c6c;
}

.status-waiting,
.status-generating,
.status-completed,
.status-failed,
.status-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.error-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.error-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  font-style: italic;
}
</style> 