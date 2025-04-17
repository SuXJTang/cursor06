<template>
  <div class="dev-progress-monitor">
    <h2>进度条监控器</h2>
    
    <div class="monitor-panel">
      <div class="connection-panel">
        <h3>连接状态</h3>
        <div class="status-indicator" :class="connectionStatus"></div>
        <div class="status-text">{{ connectionStatusText }}</div>
        <div class="actions">
          <button @click="connectWebSocket" :disabled="connected">连接</button>
          <button @click="disconnectWebSocket" :disabled="!connected">断开</button>
        </div>
      </div>
      
      <div class="progress-test-panel">
        <h3>进度测试</h3>
        <div class="manual-progress">
          <label>手动设置进度 (0-100):</label>
          <div class="progress-input">
            <input type="number" v-model="manualProgress" min="0" max="100" />
            <button @click="sendManualProgress">发送</button>
          </div>
        </div>
        
        <div class="stage-test">
          <label>切换阶段:</label>
          <select v-model="selectedStage">
            <option v-for="(stage, index) in stages" :key="index" :value="stage.name">
              {{ stage.displayName }} ({{ stage.startPercent }}-{{ stage.endPercent }}%)
            </option>
          </select>
          <button @click="sendStageUpdate">更新阶段</button>
        </div>
        
        <div class="substage-test" v-if="selectedStage">
          <label>子阶段进度 (0-100%):</label>
          <div class="progress-input">
            <input type="number" v-model="substageProgress" min="0" max="100" />
            <select v-model="selectedSubstage">
              <option v-for="(weight, name) in getSubstages(selectedStage)" :key="name" :value="name">
                {{ name }} (权重: {{ weight }})
              </option>
            </select>
            <button @click="sendSubstageUpdate">更新子阶段</button>
          </div>
        </div>
        
        <div class="preset-scenarios">
          <h4>预设场景</h4>
          <button @click="runScenario('normalFlow')">正常流程</button>
          <button @click="runScenario('quickJump')">快速跳跃</button>
          <button @click="runScenario('errorTest')">错误测试</button>
          <button @click="runScenario('smoothTransition')">平滑过渡</button>
        </div>
      </div>
    </div>
    
    <div class="progress-preview">
      <h3>进度条预览</h3>
      <RecommendationProgress 
        :sessionId="sessionId"
        :userId="userId"
        :autoConnect="false"
        @progress-update="onProgressUpdate"
        @completed="onCompleted"
        @error="onError"
      />
    </div>
    
    <div class="message-log">
      <h3>通信日志</h3>
      <div class="log-actions">
        <button @click="clearLogs">清除日志</button>
        <label>
          <input type="checkbox" v-model="autoScroll" />
          自动滚动
        </label>
      </div>
      <div class="log-container" ref="logContainer">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          class="log-entry"
          :class="log.type"
        >
          <div class="log-time">{{ formatTime(log.time) }}</div>
          <div class="log-type">{{ log.type.toUpperCase() }}</div>
          <div class="log-content">
            <pre>{{ typeof log.content === 'object' ? JSON.stringify(log.content, null, 2) : log.content }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import RecommendationProgress from './RecommendationProgress.vue'

// 生成随机会话ID
const generateSessionId = () => {
  return 'dev-' + Math.random().toString(36).substring(2, 15)
}

// 状态变量
const sessionId = ref(generateSessionId())
const userId = ref('dev-user-123')
const socket = ref<WebSocket | null>(null)
const connected = ref(false)
const connectionStatus = ref('disconnected')
const logs = ref<any[]>([])
const autoScroll = ref(true)
const logContainer = ref<HTMLElement | null>(null)
const manualProgress = ref(0)
const selectedStage = ref('')
const selectedSubstage = ref('')
const substageProgress = ref(0)

// 连接状态文本
const connectionStatusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return '已连接'
    case 'connecting': return '连接中...'
    case 'disconnected': return '未连接'
    case 'error': return '连接错误'
    default: return '未知状态'
  }
})

// 定义阶段和子阶段
const stages = [
  { name: 'preparation', displayName: '系统准备', startPercent: 0, endPercent: 10 },
  { name: 'data_collection', displayName: '数据收集', startPercent: 10, endPercent: 30 },
  { name: 'basic_matching', displayName: '基础匹配', startPercent: 30, endPercent: 50 },
  { name: 'ai_analysis', displayName: 'AI深度分析', startPercent: 50, endPercent: 80 },
  { name: 'result_preparation', displayName: '结果整理', startPercent: 80, endPercent: 100 }
]

const substages = {
  'data_collection': {
    'profile': 0.3,
    'careers': 0.3,
    'assessment': 0.4
  },
  'basic_matching': {
    'filtering': 0.5,
    'scoring': 0.5
  },
  'ai_analysis': {
    'preparation': 0.1,
    'analysis': 0.7,
    'summary': 0.2
  },
  'result_preparation': {
    'saving': 0.4,
    'report': 0.6
  }
}

// 获取指定阶段的子阶段
const getSubstages = (stageName: string) => {
  return substages[stageName as keyof typeof substages] || {}
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 添加日志
const addLog = (type: string, content: any) => {
  logs.value.push({
    time: Date.now(),
    type,
    content
  })
  
  // 如果启用了自动滚动，等待DOM更新后滚动到底部
  if (autoScroll.value) {
    setTimeout(() => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight
      }
    }, 0)
  }
}

// 清除日志
const clearLogs = () => {
  logs.value = []
}

// 连接WebSocket
const connectWebSocket = () => {
  try {
    connectionStatus.value = 'connecting'
    addLog('info', `尝试连接WebSocket: ${sessionId.value}`)
    
    // 构建WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsHost = window.location.host
    const wsUrl = `${protocol}//${wsHost}/ws/recommendations/${sessionId.value}`
    
    // 创建WebSocket
    socket.value = new WebSocket(wsUrl)
    
    // 注册事件处理函数
    socket.value.onopen = handleOpen
    socket.value.onmessage = handleMessage
    socket.value.onclose = handleClose
    socket.value.onerror = handleError
    
  } catch (error) {
    connectionStatus.value = 'error'
    addLog('error', `创建WebSocket连接出错: ${error}`)
  }
}

// WebSocket连接成功
const handleOpen = () => {
  connected.value = true
  connectionStatus.value = 'connected'
  addLog('success', '已成功连接到WebSocket服务器')
  
  // 订阅进度更新
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({
      type: 'subscribe',
      session_id: sessionId.value
    }))
    
    addLog('sent', {
      type: 'subscribe',
      session_id: sessionId.value
    })
  }
}

// 处理WebSocket消息
const handleMessage = (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data)
    addLog('received', data)
  } catch (error) {
    addLog('error', `解析WebSocket消息出错: ${error}`)
  }
}

// 处理WebSocket关闭
const handleClose = (event: CloseEvent) => {
  connected.value = false
  connectionStatus.value = 'disconnected'
  addLog('info', `WebSocket连接已关闭: ${event.code} ${event.reason}`)
  socket.value = null
}

// 处理WebSocket错误
const handleError = (event: Event) => {
  connectionStatus.value = 'error'
  addLog('error', `WebSocket连接错误`)
}

// 断开WebSocket连接
const disconnectWebSocket = () => {
  if (socket.value) {
    socket.value.close()
    addLog('info', '主动断开WebSocket连接')
  }
}

// 发送手动设置的进度
const sendManualProgress = () => {
  if (!connected.value || !socket.value) {
    addLog('warning', '无法发送进度: WebSocket未连接')
    return
  }
  
  const message = {
    type: 'progress_update',
    session_id: sessionId.value,
    data: {
      progress: parseFloat(manualProgress.value.toString()),
      message: `手动设置进度: ${manualProgress.value}%`,
      status: 'processing',
      timestamp: Date.now()
    }
  }
  
  socket.value.send(JSON.stringify(message))
  addLog('sent', message)
}

// 发送阶段更新
const sendStageUpdate = () => {
  if (!connected.value || !socket.value) {
    addLog('warning', '无法更新阶段: WebSocket未连接')
    return
  }
  
  const stage = stages.find(s => s.name === selectedStage.value)
  if (!stage) {
    addLog('warning', `未找到阶段: ${selectedStage.value}`)
    return
  }
  
  const message = {
    type: 'progress_update',
    session_id: sessionId.value,
    data: {
      progress: stage.startPercent,
      current_stage: selectedStage.value,
      stage_progress: 0,
      message: `开始${stage.displayName}...`,
      status: 'processing',
      timestamp: Date.now()
    }
  }
  
  socket.value.send(JSON.stringify(message))
  addLog('sent', message)
}

// 发送子阶段更新
const sendSubstageUpdate = () => {
  if (!connected.value || !socket.value) {
    addLog('warning', '无法更新子阶段: WebSocket未连接')
    return
  }
  
  if (!selectedStage.value || !selectedSubstage.value) {
    addLog('warning', '请选择阶段和子阶段')
    return
  }
  
  const stage = stages.find(s => s.name === selectedStage.value)
  if (!stage) {
    addLog('warning', `未找到阶段: ${selectedStage.value}`)
    return
  }
  
  // 计算总体进度
  const normalizedProgress = substageProgress.value / 100
  const substageWeight = getSubstages(selectedStage.value)[selectedSubstage.value] || 1
  const stageRange = stage.endPercent - stage.startPercent
  const stageProgress = normalizedProgress * substageWeight
  const overallProgress = stage.startPercent + (stageProgress * stageRange / substageWeight)
  
  const message = {
    type: 'progress_update',
    session_id: sessionId.value,
    data: {
      progress: Math.min(overallProgress, stage.endPercent),
      current_stage: selectedStage.value,
      current_substage: selectedSubstage.value,
      stage_progress: normalizedProgress * 100,
      message: `正在${stage.displayName} - ${selectedSubstage.value} (${substageProgress.value}%)`,
      status: 'processing',
      timestamp: Date.now()
    }
  }
  
  socket.value.send(JSON.stringify(message))
  addLog('sent', message)
}

// 运行预设场景
const runScenario = async (scenario: string) => {
  if (!connected.value || !socket.value) {
    addLog('warning', '无法运行场景: WebSocket未连接')
    return
  }
  
  addLog('info', `开始运行场景: ${scenario}`)
  
  switch (scenario) {
    case 'normalFlow':
      await runNormalFlowScenario()
      break
    case 'quickJump':
      await runQuickJumpScenario()
      break
    case 'errorTest':
      await runErrorTestScenario()
      break
    case 'smoothTransition':
      await runSmoothTransitionScenario()
      break
  }
}

// 正常流程场景
const runNormalFlowScenario = async () => {
  // 初始化
  sendProgressUpdate(0, 'preparation', 0, null, '初始化中...')
  await delay(1000)
  
  // 系统准备
  sendProgressUpdate(2, 'preparation', 20, null, '系统准备中...')
  await delay(1000)
  sendProgressUpdate(5, 'preparation', 50, null, '加载组件...')
  await delay(1000)
  sendProgressUpdate(10, 'preparation', 100, null, '系统准备完成')
  await delay(1000)
  
  // 数据收集
  sendProgressUpdate(10, 'data_collection', 0, null, '开始收集数据...')
  await delay(1000)
  sendProgressUpdate(15, 'data_collection', 30, 'profile', '收集个人资料...')
  await delay(1000)
  sendProgressUpdate(20, 'data_collection', 70, 'careers', '收集职业信息...')
  await delay(1000)
  sendProgressUpdate(25, 'data_collection', 90, 'assessment', '收集测评结果...')
  await delay(1000)
  sendProgressUpdate(30, 'data_collection', 100, null, '数据收集完成')
  await delay(1000)
  
  // 基础匹配
  sendProgressUpdate(30, 'basic_matching', 0, null, '开始基础匹配...')
  await delay(1000)
  sendProgressUpdate(35, 'basic_matching', 30, 'filtering', '过滤职业...')
  await delay(1000)
  sendProgressUpdate(40, 'basic_matching', 70, 'scoring', '职业评分...')
  await delay(1000)
  sendProgressUpdate(50, 'basic_matching', 100, null, '基础匹配完成')
  await delay(1000)
  
  // AI分析
  sendProgressUpdate(50, 'ai_analysis', 0, null, '开始AI深度分析...')
  await delay(1000)
  sendProgressUpdate(55, 'ai_analysis', 10, 'preparation', '准备分析数据...')
  await delay(1000)
  sendProgressUpdate(60, 'ai_analysis', 40, 'analysis', '分析中...')
  await delay(1000)
  sendProgressUpdate(70, 'ai_analysis', 80, 'analysis', '深度分析...')
  await delay(1000)
  sendProgressUpdate(75, 'ai_analysis', 95, 'summary', '生成分析结果...')
  await delay(1000)
  sendProgressUpdate(80, 'ai_analysis', 100, null, 'AI分析完成')
  await delay(1000)
  
  // 结果准备
  sendProgressUpdate(80, 'result_preparation', 0, null, '开始准备结果...')
  await delay(1000)
  sendProgressUpdate(85, 'result_preparation', 40, 'saving', '保存结果...')
  await delay(1000)
  sendProgressUpdate(90, 'result_preparation', 70, 'report', '生成报告...')
  await delay(1000)
  sendProgressUpdate(95, 'result_preparation', 90, 'report', '美化报告...')
  await delay(1000)
  sendProgressUpdate(100, 'result_preparation', 100, null, '结果准备完成', 'completed')
}

// 快速跳跃场景
const runQuickJumpScenario = async () => {
  // 系统准备
  sendProgressUpdate(0, 'preparation', 0, null, '系统准备中...')
  await delay(500)
  sendProgressUpdate(10, 'preparation', 100, null, '系统准备完成')
  await delay(500)
  
  // 直接跳到基础匹配
  sendProgressUpdate(30, 'basic_matching', 0, null, '开始基础匹配...')
  await delay(500)
  sendProgressUpdate(50, 'basic_matching', 100, null, '基础匹配完成')
  await delay(500)
  
  // 直接跳到结果准备
  sendProgressUpdate(80, 'result_preparation', 0, null, '开始准备结果...')
  await delay(500)
  sendProgressUpdate(100, 'result_preparation', 100, null, '结果准备完成', 'completed')
}

// 错误测试场景
const runErrorTestScenario = async () => {
  // 正常开始
  sendProgressUpdate(0, 'preparation', 0, null, '系统准备中...')
  await delay(1000)
  sendProgressUpdate(10, 'preparation', 100, null, '系统准备完成')
  await delay(1000)
  
  // 数据收集
  sendProgressUpdate(15, 'data_collection', 30, 'profile', '收集个人资料...')
  await delay(1000)
  
  // 发生错误
  const errorMessage = {
    type: 'progress_update',
    session_id: sessionId.value,
    data: {
      progress: 25,
      current_stage: 'data_collection',
      current_substage: 'assessment',
      stage_progress: 60,
      message: '数据收集失败，请重试',
      status: 'exception',
      timestamp: Date.now()
    }
  }
  
  if (socket.value) {
    socket.value.send(JSON.stringify(errorMessage))
    addLog('sent', errorMessage)
  }
}

// 平滑过渡场景
const runSmoothTransitionScenario = async () => {
  // 初始化
  sendProgressUpdate(0, 'preparation', 0, null, '初始化中...')
  await delay(500)
  
  // 系统准备 - 平滑过渡
  for (let i = 0; i <= 10; i++) {
    sendProgressUpdate(i, 'preparation', i * 10, null, '系统准备中...')
    await delay(200)
  }
  await delay(500)
  
  // 数据收集 - 平滑过渡
  for (let i = 0; i <= 20; i++) {
    const progress = 10 + i
    sendProgressUpdate(progress, 'data_collection', (i / 20) * 100, 'profile', '收集数据中...')
    await delay(100)
  }
  await delay(500)
  
  // 基础匹配 - 平滑过渡
  for (let i = 0; i <= 20; i++) {
    const progress = 30 + i
    sendProgressUpdate(progress, 'basic_matching', (i / 20) * 100, 'scoring', '基础匹配中...')
    await delay(100)
  }
  await delay(500)
  
  // AI分析 - 平滑过渡
  for (let i = 0; i <= 30; i++) {
    const progress = 50 + i
    sendProgressUpdate(progress, 'ai_analysis', (i / 30) * 100, 'analysis', 'AI分析中...')
    await delay(100)
  }
  await delay(500)
  
  // 结果准备 - 平滑过渡
  for (let i = 0; i <= 20; i++) {
    const progress = 80 + i
    sendProgressUpdate(progress, 'result_preparation', (i / 20) * 100, 'report', '准备结果中...')
    await delay(100)
  }
  
  // 完成
  sendProgressUpdate(100, 'result_preparation', 100, null, '结果准备完成', 'completed')
}

// 发送进度更新
const sendProgressUpdate = (progress: number, stageName: string, stageProgress: number, substageName: string | null, message: string, status: string = 'processing') => {
  if (!connected.value || !socket.value) {
    addLog('warning', '无法发送进度更新: WebSocket未连接')
    return
  }
  
  const updateMessage = {
    type: 'progress_update',
    session_id: sessionId.value,
    data: {
      progress,
      current_stage: stageName,
      current_substage: substageName,
      stage_progress: stageProgress,
      message,
      status,
      timestamp: Date.now()
    }
  }
  
  socket.value.send(JSON.stringify(updateMessage))
  addLog('sent', updateMessage)
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 进度更新事件处理
const onProgressUpdate = (data: any) => {
  addLog('event', {
    type: 'progress-update',
    data
  })
}

// 完成事件处理
const onCompleted = () => {
  addLog('event', {
    type: 'completed'
  })
}

// 错误事件处理
const onError = (error: any) => {
  addLog('error', {
    type: 'error',
    error
  })
}

// 组件挂载后自动连接
onMounted(() => {
  // 不自动连接，让用户手动连接
})

// 组件卸载前断开连接
onBeforeUnmount(() => {
  disconnectWebSocket()
})
</script>

<style scoped lang="scss">
.dev-progress-monitor {
  width: 100%;
  padding: 20px;
  font-family: Arial, sans-serif;
  
  h2 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  
  h3 {
    margin: 12px 0;
    color: #444;
  }
  
  .monitor-panel {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    
    .connection-panel, .progress-test-panel {
      flex: 1;
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
      
      &.connected {
        background-color: #67C23A;
        box-shadow: 0 0 6px #67C23A;
      }
      
      &.connecting {
        background-color: #E6A23C;
        box-shadow: 0 0 6px #E6A23C;
        animation: pulse 1s infinite;
      }
      
      &.disconnected {
        background-color: #909399;
      }
      
      &.error {
        background-color: #F56C6C;
        box-shadow: 0 0 6px #F56C6C;
      }
    }
    
    .status-text {
      display: inline-block;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .actions {
      margin-top: 10px;
      display: flex;
      gap: 10px;
    }
    
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background-color: #409EFF;
      color: white;
      cursor: pointer;
      font-size: 14px;
      
      &:hover {
        background-color: #66b1ff;
      }
      
      &:disabled {
        background-color: #a0cfff;
        cursor: not-allowed;
      }
    }
    
    .manual-progress, .stage-test, .substage-test {
      margin-bottom: 15px;
      
      label {
        display: block;
        margin-bottom: 6px;
        font-weight: bold;
      }
      
      .progress-input {
        display: flex;
        gap: 8px;
        align-items: center;
        
        input, select {
          padding: 6px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }
        
        input[type="number"] {
          width: 80px;
        }
        
        select {
          flex: 1;
        }
      }
    }
    
    .preset-scenarios {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      button {
        background-color: #67C23A;
        
        &:hover {
          background-color: #85ce61;
        }
      }
    }
  }
  
  .progress-preview {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .message-log {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    
    .log-actions {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      
      button {
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        background-color: #F56C6C;
        color: white;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
          background-color: #f78989;
        }
      }
    }
    
    .log-container {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background-color: #1e1e1e;
      color: #eee;
      padding: 10px;
      font-family: monospace;
      
      .log-entry {
        margin-bottom: 8px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #333;
        padding-bottom: 6px;
        
        &.info {
          color: #909399;
        }
        
        &.sent {
          color: #67C23A;
        }
        
        &.received {
          color: #409EFF;
        }
        
        &.error {
          color: #F56C6C;
        }
        
        &.warning {
          color: #E6A23C;
        }
        
        &.success {
          color: #67C23A;
        }
        
        &.event {
          color: #9966FF;
        }
        
        .log-time {
          min-width: 100px;
          margin-right: 8px;
        }
        
        .log-type {
          min-width: 80px;
          font-weight: bold;
          margin-right: 8px;
        }
        
        .log-content {
          flex: 1;
          min-width: 100%;
          margin-top: 4px;
          
          pre {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-all;
          }
        }
      }
    }
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
}

@media (max-width: 768px) {
  .monitor-panel {
    flex-direction: column;
  }
}
</style> 