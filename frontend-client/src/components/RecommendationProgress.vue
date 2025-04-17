<template>
  <div class="recommendation-progress">
    <div class="progress-header">
      <div class="progress-title">
        <h3>{{ currentStage.displayName || '推荐生成中' }}</h3>
        <span class="progress-status">{{ getStatusText }}</span>
      </div>
      <div class="progress-percent">{{ Math.round(progress) }}%</div>
    </div>
    
    <el-progress 
      :percentage="progress" 
      :status="status"
      :stroke-width="10"
      :show-text="false"
      :color="progressColor"
    />
    
    <div class="progress-message">
      <span>{{ message }}</span>
      <span v-if="estimatedTimeLeft && status === 'processing'" class="time-left">
        预计剩余时间: {{ formatTimeLeft(estimatedTimeLeft) }}
      </span>
    </div>

    <div class="stages-container" v-if="showStages">
      <div class="stages-progress-bar">
        <div 
          v-for="(stage, index) in stages" 
          :key="`bar-${index}`"
          class="stage-progress-segment"
          :class="{ 
            'active': currentStage.name === stage.name,
            'completed': isStageCompleted(stage.name) || stages.findIndex(s => s.name === currentStage.name) > index
          }"
          :style="{
            width: getStageWidth(stage),
          }"
        >
          <div 
            class="segment-fill" 
            :style="{
              width: getStageDisplayInfo(stage.name).progress + '%'
            }"
          ></div>
        </div>
      </div>

      <div 
        v-for="(stage, index) in stages" 
        :key="index"
        class="stage-item"
        :class="{ 
          'active': currentStage.name === stage.name,
          'completed': isStageCompleted(stage.name) || stages.findIndex(s => s.name === currentStage.name) > index
        }"
      >
        <div class="stage-marker">
          <i v-if="isStageCompleted(stage.name)" class="el-icon-check"></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="stage-info">
          <div class="stage-name">{{ stage.displayName }}</div>
          <div class="stage-progress" v-if="currentStage.name === stage.name && !isStageCompleted(stage.name)">
            <el-progress 
              :percentage="getStageProgress(stage.name)" 
              :stroke-width="5"
              :show-text="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 从API文件直接导入函数
const getRecommendationProgress = async (userId?: string | number) => {
  try {
    return await fetch(`/api/v1/career-recommendations/progress?user_id=${userId}`)
      .then(response => response.json())
  } catch (error) {
    console.error('获取推荐进度失败:', error)
    throw error
  }
}

const props = defineProps({
  sessionId: {
    type: String,
    required: true
  },
  userId: {
    type: [String, Number],
    required: true
  },
  showStages: {
    type: Boolean,
    default: true
  },
  autoConnect: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['progress-update', 'completed', 'error'])

// 状态变量
const progress = ref(0)
const targetProgress = ref(0)
const message = ref('准备中...')
const status = ref('processing')
const estimatedTimeLeft = ref(0)
const socket = ref<WebSocket | null>(null)
const pollingInterval = ref<any>(null)
const retryCount = ref(0)
const maxRetries = 5
const transitionSpeed = 0.1 // 降低过渡速度，使动画更平滑
const animationFrameId = ref<number | null>(null)

// 当前阶段信息
const currentStage = ref({
  name: 'preparation',
  displayName: '准备中',
  progress: 0
})

// 定义推荐系统的处理阶段
const stages = [
  { name: 'preparation', displayName: '系统准备', startPercent: 0, endPercent: 10 },
  { name: 'data_collection', displayName: '数据收集', startPercent: 10, endPercent: 30 },
  { name: 'basic_matching', displayName: '基础匹配', startPercent: 30, endPercent: 50 },
  { name: 'ai_analysis', displayName: 'AI深度分析', startPercent: 50, endPercent: 80 },
  { name: 'result_preparation', displayName: '结果整理', startPercent: 80, endPercent: 100 }
]

// 已完成的阶段
const completedStages = ref<string[]>([])

// 进度条颜色
const progressColor = computed(() => {
  if (status.value === 'success') return '#67C23A'
  if (status.value === 'exception') return '#F56C6C'
  return [
    { color: '#6495ED', percentage: 30 },
    { color: '#1989FA', percentage: 70 },
    { color: '#67C23A', percentage: 100 }
  ]
})

// 状态显示文本
const getStatusText = computed(() => {
  switch (status.value) {
    case 'success': return '已完成'
    case 'exception': return '出错了'
    case 'processing': return '处理中'
    default: return '等待中'
  }
})

// 检查阶段是否完成
const isStageCompleted = (stageName: string) => {
  return completedStages.value.includes(stageName)
}

// 获取阶段进度
const getStageProgress = (stageName: string) => {
  if (stageName !== currentStage.value.name) {
    return isStageCompleted(stageName) ? 100 : 0
  }
  return currentStage.value.progress
}

// 格式化剩余时间
const formatTimeLeft = (seconds: number) => {
  if (seconds < 60) return `${Math.ceil(seconds)}秒`
  return `${Math.floor(seconds / 60)}分${Math.ceil(seconds % 60)}秒`
}

// 计算阶段的显示宽度
const getStageWidth = (stage: any) => {
  // 根据阶段的百分比范围确定其在UI中的宽度占比
  return `${stage.endPercent - stage.startPercent}%`
}

// 获取阶段的进度状态和显示
const getStageDisplayInfo = (stageName: string) => {
  const stage = stages.find(s => s.name === stageName)
  if (!stage) return { width: '20%', progress: 0, active: false }
  
  const isActive = currentStage.value.name === stageName
  const isCompleted = isStageCompleted(stageName)
  const stageIndex = stages.findIndex(s => s.name === stageName)
  const currentIndex = stages.findIndex(s => s.name === currentStage.value.name)
  
  // 如果是当前阶段之前的阶段，标记为已完成
  const isBefore = stageIndex < currentIndex
  
  // 如果是当前阶段，使用当前阶段的进度
  const stageProgress = isActive ? currentStage.value.progress : (isCompleted || isBefore ? 100 : 0)
  
  return {
    width: getStageWidth(stage),
    progress: stageProgress,
    active: isActive,
    completed: isCompleted || isBefore
  }
}

// 平滑更新进度
const animateProgress = () => {
  const diff = targetProgress.value - progress.value
  
  // 如果差距很小，直接设置为目标值
  if (Math.abs(diff) < 0.1) {
    progress.value = targetProgress.value
    animationFrameId.value = null
    return
  }
  
  // 根据当前进度和目标进度的差距动态调整速度
  // 差距越大，速度越快；差距越小，速度越慢
  const adaptiveSpeed = Math.max(0.05, Math.min(0.2, Math.abs(diff) * 0.01))
  
  // 应用平滑过渡
  progress.value += diff * adaptiveSpeed
  
  // 继续下一帧动画
  animationFrameId.value = requestAnimationFrame(animateProgress)
}

// 更新进度数据
const updateProgress = (data: any) => {
  // 更新目标进度
  const newTargetProgress = data.progress || 0
  
  // 如果目标进度发生大幅跳跃，插入中间过渡步骤
  if (newTargetProgress - targetProgress.value > 15) {
    // 中间步骤，分阶段过渡
    const midPoint = targetProgress.value + (newTargetProgress - targetProgress.value) * 0.4
    setTimeout(() => {
      targetProgress.value = midPoint
      
      // 启动平滑过渡动画
      if (!animationFrameId.value) {
        animationFrameId.value = requestAnimationFrame(animateProgress)
      }
      
      // 延迟后设置最终目标
      setTimeout(() => {
        targetProgress.value = newTargetProgress
      }, 800)
    }, 300)
  } else {
    // 小幅度变化直接更新目标
    targetProgress.value = newTargetProgress
    
    // 启动平滑过渡动画
    if (!animationFrameId.value) {
      animationFrameId.value = requestAnimationFrame(animateProgress)
    }
  }
  
  // 更新其他状态
  message.value = data.message || '处理中...'
  status.value = data.status || 'processing'
  
  // 更新当前阶段
  if (data.current_stage) {
    const stage = stages.find(s => s.name === data.current_stage)
    if (stage) {
      currentStage.value = {
        name: data.current_stage,
        displayName: stage.displayName,
        progress: data.stage_progress || 0
      }
      
      // 如果有前序阶段，标记为已完成
      const currentIndex = stages.findIndex(s => s.name === data.current_stage)
      if (currentIndex > 0) {
        for (let i = 0; i < currentIndex; i++) {
          if (!completedStages.value.includes(stages[i].name)) {
            completedStages.value.push(stages[i].name)
          }
        }
      }
    }
  }
  
  // 如果阶段已完成，标记
  if (data.completed_stages && Array.isArray(data.completed_stages)) {
    completedStages.value = data.completed_stages
  }
  
  // 更新预估剩余时间
  if (data.estimated_time_left) {
    estimatedTimeLeft.value = data.estimated_time_left
  }
  
  // 触发进度更新事件
  emit('progress-update', {
    progress: targetProgress.value,
    message: message.value,
    status: status.value,
    stage: currentStage.value
  })
  
  // 如果已完成，触发完成事件
  if (status.value === 'success' || targetProgress.value >= 100) {
    emit('completed')
    disconnect()
  } else if (status.value === 'exception') {
    emit('error', message.value)
    disconnect()
  }
}

// 连接WebSocket
const connect = () => {
  try {
    disconnect() // 确保先断开之前的连接
    
    // 构建WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsHost = window.location.host  // 使用当前主机名
    const wsUrl = `${protocol}//${wsHost}/ws/recommendations/${props.sessionId}`
    
    // 创建WebSocket
    socket.value = new WebSocket(wsUrl)
    
    // 注册事件处理程序
    socket.value.onopen = handleOpen
    socket.value.onmessage = handleMessage
    socket.value.onclose = handleClose
    socket.value.onerror = handleError
    
    console.log('正在连接到WebSocket:', wsUrl)
    return true
  } catch (error) {
    console.error('创建WebSocket连接出错:', error)
    startPolling() // 备用方案：启用轮询
    return false
  }
}

// WebSocket连接成功
const handleOpen = () => {
  console.log('WebSocket连接已建立, 会话ID:', props.sessionId)
  retryCount.value = 0
  stopPolling() // 连接成功后关闭轮询
  
  // 订阅进度更新
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({
      type: 'subscribe',
      session_id: props.sessionId
    }))
  }
}

// 处理收到的WebSocket消息
const handleMessage = (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data)
    console.log('收到WebSocket进度更新:', data)
    
    if (data.type === 'progress_update') {
      updateProgress(data.data || data)
    }
  } catch (error) {
    console.error('解析WebSocket消息出错:', error)
  }
}

// 处理WebSocket关闭事件
const handleClose = (event: CloseEvent) => {
  console.log('WebSocket连接已关闭:', event.code, event.reason)
  
  // 如果不是正常关闭，且未达到最大重试次数，尝试重连
  if (event.code !== 1000 && retryCount.value < maxRetries) {
    retryCount.value++
    const delay = Math.min(1000 * Math.pow(2, retryCount.value), 10000)
    
    console.log(`WebSocket将在${delay/1000}秒后尝试第${retryCount.value}次重连`)
    setTimeout(connect, delay)
  } else if (retryCount.value >= maxRetries) {
    console.warn('WebSocket重连失败次数过多，切换到轮询模式')
    startPolling()
  }
}

// 处理WebSocket错误
const handleError = (error: Event) => {
  console.error('WebSocket连接错误:', error)
  
  if (retryCount.value >= maxRetries) {
    console.warn('WebSocket频繁出错，切换到轮询模式')
    startPolling()
  }
}

// 断开WebSocket连接
const disconnect = () => {
  if (socket.value) {
    try {
      socket.value.close()
    } catch (error) {
      console.error('关闭WebSocket出错:', error)
    }
    socket.value = null
  }
  stopPolling()
}

// 开始轮询进度
const startPolling = () => {
  stopPolling()
  
  console.log('启动HTTP轮询获取进度')
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await getRecommendationProgress(props.userId)
      updateProgress(response)
    } catch (error) {
      console.error('轮询获取进度失败:', error)
      retryCount.value++
      
      if (retryCount.value >= maxRetries * 2) {
        ElMessage.error('无法获取推荐进度，请稍后刷新页面')
        stopPolling()
        emit('error', '连接失败')
      }
    }
  }, 2000) // 每2秒轮询一次
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// 组件挂载时自动连接
onMounted(() => {
  if (props.autoConnect) {
    // 先尝试WebSocket连接
    const connected = connect()
    
    // 如果连接失败，启动轮询
    if (!connected) {
      startPolling()
    }
  }
})

// 组件卸载前断开连接和取消动画
onBeforeUnmount(() => {
  disconnect()
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<style scoped lang="scss">
.recommendation-progress {
  width: 100%;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .progress-title {
      h3 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
      
      .progress-status {
        font-size: 14px;
        color: #909399;
        margin-left: 8px;
      }
    }
    
    .progress-percent {
      font-size: 22px;
      font-weight: bold;
      color: #409EFF;
    }
  }
  
  .progress-message {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 14px;
    color: #606266;
    
    .time-left {
      font-size: 12px;
      color: #909399;
    }
  }
  
  .stages-container {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #EBEEF5;
      z-index: 0;
    }
    
    .stage-item {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 8px;
      
      &.active {
        .stage-marker {
          background-color: #409EFF;
          border-color: #409EFF;
          color: white;
          transform: scale(1.2);
        }
        
        .stage-name {
          color: #409EFF;
          font-weight: 500;
        }
      }
      
      &.completed {
        .stage-marker {
          background-color: #67C23A;
          border-color: #67C23A;
          color: white;
        }
        
        .stage-name {
          color: #67C23A;
        }
      }
      
      .stage-marker {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: white;
        border: 2px solid #DCDFE6;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #606266;
        font-size: 12px;
        transition: all 0.3s ease;
        margin-bottom: 8px;
      }
      
      .stage-info {
        text-align: center;
        width: 100%;
        
        .stage-name {
          font-size: 12px;
          color: #606266;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .stage-progress {
          width: 100%;
          padding: 0 4px;
        }
      }
    }
  }
  
  .stages-progress-bar {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #EBEEF5;
    margin-bottom: 24px;
    display: flex;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 12px;
    
    .stage-progress-segment {
      position: relative;
      height: 100%;
      background-color: transparent;
      
      &.active {
        .segment-fill {
          background-color: #409EFF;
          animation: pulse 1.5s infinite;
        }
      }
      
      &.completed {
        .segment-fill {
          background-color: #67C23A;
        }
      }
      
      .segment-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #909399;
        transition: width 0.5s ease-out;
      }
    }
  }
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .stages-container {
      display: none;
    }
  }
}
</style> 