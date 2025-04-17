<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AssessmentBanner from '../components/common/AssessmentBanner.vue'
import { ElMessage } from 'element-plus'
import { useRecommendationStore } from '@/stores/recommendation'
import request from '@/api/request'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ProgressBar from '@/components/ProgressBar.vue'

const router = useRouter()
const recommendationStore = useRecommendationStore()

// 定义用户ID，从localStorage获取
const userId = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
  return userInfo.id || 1
})

// 定义计时器引用
const analyzeTimer = ref<number | null>(null)
const pollingTimer = ref<number | null>(null)
const timeoutTimer = ref<number | null>(null)

// 获取环境变量中的API地址
const API_URL = 'http://localhost:8000'
console.log('使用API地址:', API_URL)

// 处理状态
const isAnalyzing = ref(false)
const currentStep = ref(0)
const analysisProgress = ref(0)
const currentQuestionIndex = ref(0)

// 处理统计
const processStats = reactive({
  startTime: Date.now(),
  elapsedTime: 0,
  retryCount: 0,
  stageInfo: '',
  stageTimeout: 120,
  message: '',
  sessionId: "",
  socket: null as WebSocket | null,
  backupTimer: null as number | null,
  progress: 0,
  statusMessage: '',
  completed: false,
  error: false,
  errorMessage: '',
  result: null,
  isWebSocketConnected: false // 新增字段用于跟踪WebSocket连接状态
})

// 测评问题和答案
const questions = reactive<Array<{
  type: string;
  title: string;
  items: Array<{
    id: number | string;
    content: string;
    options: Array<{
      label: string;
      value: number;
    }>;
  }>;
}>>([])

// 答案存储
const answers = reactive<Record<string | number, number>>({})

// 测评数据对象，用于提交
const assessmentData = reactive({
  answers: [] as Array<{question_id: string; answer: number}>
})

// 更新答案时同时更新assessmentData
const updateAnswers = (questionId: string | number, value: number) => {
  answers[questionId] = value;
  
  // 更新assessmentData
  assessmentData.answers = Object.entries(answers).map(([id, val]) => ({
    question_id: id,
    answer: val
  }));
}

// 定义类型接口
interface DetailStep {
  id: string;
  title: string;
  status: string;
  icon: string;
  group: number;
}

// 定义分析步骤
const detailSteps = reactive<DetailStep[]>([
  { id: 'user_data', title: '用户资料收集', status: '处理中', icon: 'User', group: 0 },
  { id: 'resume_data', title: '简历数据收集', status: '等待中', icon: 'Document', group: 0 },
  { id: 'assessment_data', title: '测评数据收集', status: '等待中', icon: 'DataLine', group: 0 },
  { id: 'basic_match', title: '基础职业匹配', status: '等待中', icon: 'Connection', group: 1 },
  { id: 'ai_analysis', title: 'AI语义分析', status: '等待中', icon: 'CPU', group: 2 },
  { id: 'final_filter', title: '候选职业筛选', status: '等待中', icon: 'Filter', group: 3 },
  { id: 'report', title: '推荐报告生成', status: '等待中', icon: 'Document', group: 3 }
])

// 更新步骤状态的函数
const updateStepStatus = (stepId: string, status: string) => {
  const step = detailSteps.find((s: { id: string }) => s.id === stepId)
  if (step) {
    step.status = status
  }
}

// 测评步骤
const steps = [
  {
    title: '兴趣测评',
    description: '了解您的职业兴趣倾向'
  },
  {
    title: '能力测评',
    description: '评估您的专业技能水平'
  },
  {
    title: '性格测评',
    description: '分析您的性格特征'
  }
]

// 当前步骤
const activeStep = ref(0)

// 修改测评选择界面状态
const showQuestionSelector = ref(true)
const selectedQuestionMode = ref('standard')
const isLoading = ref(false) // 添加加载状态
const isCustomizing = ref(false) // 添加自定义设置状态

// 问题数量选项
const questionModes = reactive([
  {
    value: 'simple',
    label: '简洁测评',
    description: '约9个问题，3-5分钟完成',
    icon: 'Timer',
    questions: 9
  },
  {
    value: 'standard',
    label: '标准测评',
    description: '约21个问题，10-15分钟完成',
    icon: 'List',
    questions: 21
  },
  {
    value: 'detailed',
    label: '详细测评',
    description: '约27个问题，15-20分钟完成',
    icon: 'DocumentChecked',
    questions: 27
  }
])

// 定义问题模式类型
interface QuestionMode {
  value: string
  label: string
  description: string
  icon: string
  questions: number
}

// 更新问题描述
const updateQuestionDescription = (mode: QuestionMode) => {
  const questions = mode.questions;
  let time = '3-5';
  if (questions > 15) {
    time = '10-15';
  } else if (questions > 9) {
    time = '5-10';
  }
  mode.description = `约${questions}个问题，${time}分钟完成`;
}

// 根据用户选择的模式筛选问题
const filteredQuestions = computed(() => {
  const mode = questionModes.find(mode => mode.value === selectedQuestionMode.value)
  const questionsPerSection = Math.ceil(mode?.questions || 9) // 默认为9个问题
  
  return questions.map(section => {
    const filteredItems = [...section.items].slice(0, questionsPerSection)
    return { ...section, items: filteredItems }
  })
})

// 定义问题类型接口
interface Question {
  id: number | string;
  question: string;
  type: string;
  options?: Array<{
    label: string;
    value: number;
  }>;
}

// 定义转换后的问题类型
interface ProcessedQuestion {
  id: number | string;
  content: string;
  options: Array<{
    label: string;
    value: number;
  }>;
}

// 定义问题组类型
interface QuestionGroup {
  type: string;
  title: string;
  items: ProcessedQuestion[];
}

// 修改开始测评函数，加入API调用
const startAssessment = async () => {
  isLoading.value = true
  
  try {
    console.log(`开始请求测评问题，模式: ${selectedQuestionMode.value}`);
    
    // 准备三个问题类型的API请求
    const questionTypes = ['interest', 'ability', 'personality'] as const;
    const questionsData: QuestionGroup[] = [];
    
    // 确定每种类型选取的问题数量
    const questionsPerType = questionModes.find((mode: QuestionMode) => mode.value === selectedQuestionMode.value)?.questions || 9;
    // 每个维度的问题数为总数的三分之一
    const questionsPerDimension = Math.floor(questionsPerType / 3);
    
    console.log(`当前测评模式: ${selectedQuestionMode.value}, 每个维度选取: ${questionsPerDimension}个问题`);
    
    // 并行请求三种类型的问题
    const requests = questionTypes.map(type => 
      request.get<Question[]>(`/api/v1/assessments/questions/${type}`)
        .then((response: Question[]) => {
          // 确保response是数组
          const questions = Array.isArray(response) ? response : [];
          return {
            type,
            data: questions.map(q => ({
              id: q.id,
              content: q.question,
              options: [
                { label: '非常同意', value: 5 },
                { label: '比较同意', value: 4 },
                { label: '一般', value: 3 },
                { label: '比较不同意', value: 2 },
                { label: '非常不同意', value: 1 }
              ]
            }))
          };
        })
        .catch((error: Error) => {
          console.error(`获取${type}类型问题失败:`, error);
          return { type, data: [] };
        })
    );
    
    // 等待所有请求完成
    const results = await Promise.all(requests);
    
    // 处理请求结果
    for (const result of results) {
      const { type, data } = result;
      
      if (data.length > 0) {
        console.log(`成功获取${type}类型问题，数量: ${data.length}`);
        
        // 随机选择指定数量的问题
        const selectedItems = data.length > questionsPerDimension 
          ? getRandomItems(data, questionsPerDimension)
          : data;
        
        questionsData.push({
          type,
          title: type === 'interest' ? '兴趣测评' : 
                type === 'ability' ? '能力测评' : '性格测评',
          items: selectedItems
        });
      } else {
        console.warn(`${type}类型问题数据为空`);
      }
    }
    
    // 判断是否获取到足够的问题数据
    if (questionsData.length === 3 && questionsData.every(group => group.items.length > 0)) {
      // 替换问题数据
      questions.splice(0, questions.length, ...questionsData);
      
      // 初始化第一个问题
      activeStep.value = 0;
      currentQuestionIndex.value = 0;
      
      // 隐藏问题选择器，显示测评界面
      showQuestionSelector.value = false;
      
      console.log('测评已启动，问题数据:', questions);
    } else {
      // 未获取到足够的问题数据
      ElMessage.error('未能获取到完整的测评问题，请稍后重试');
      console.error('问题数据不完整:', questionsData);
      // 确保不会跳转，保持在选择页面
      showQuestionSelector.value = true;
    }
  } catch (error: any) {
    console.error('测评启动失败:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error('当前未登录或会话已过期，请重新登录后再尝试');
      } else if (error.response.status === 404) {
        ElMessage.error('请求的资源不存在，请联系管理员');
      } else {
        ElMessage.error(`服务器错误 (${error.response.status})，请稍后再试`);
      }
    } else if (error.request) {
      ElMessage.error('无法连接到服务器，请检查网络连接');
    } else {
      ElMessage.error(`测评启动失败: ${error.message || '未知错误'}`);
    }
    
    // 确保不会跳转，保持在选择页面
    showQuestionSelector.value = true;
  } finally {
    isLoading.value = false;
  }
}

// 从数组中随机选择指定数量的元素
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 获取本地问题数据 - 已废弃，保留以备将来需要
// TODO: 此函数已不再使用，将在稳定后移除
const getLocalQuestions = (type: 'interest' | 'ability' | 'personality'): ProcessedQuestion[] => {
  const index = type === 'interest' ? 0 : type === 'ability' ? 1 : 2;
  return questions[index]?.items || [];
}

// 使用本地问题数据 - 已废弃，保留以备将来需要
// TODO: 此函数已不再使用，将在稳定后移除
const useLocalQuestions = () => {
  const mode = questionModes.find(mode => mode.value === selectedQuestionMode.value);
  const questionsPerDimension = Math.floor((mode?.questions || 9) / 3);
  
  const mockQuestions = [
    {
      type: 'interest',
      title: '兴趣测评',
      items: getLocalQuestions('interest').slice(0, questionsPerDimension)
    },
    {
      type: 'ability',
      title: '能力测评',
      items: getLocalQuestions('ability').slice(0, questionsPerDimension)
    },
    {
      type: 'personality',
      title: '性格测评',
      items: getLocalQuestions('personality').slice(0, questionsPerDimension)
    }
  ];
  
  questions.splice(0, questions.length, ...mockQuestions);
}

// 添加标记表示是否获取到了有效的推荐数据
const hasValidRecommendation = ref(false);

// 设置WebSocket连接
const setupWebSocket = (sessionId: string) => {
  try {
    if (!sessionId) {
      console.error('无效的sessionId，无法建立WebSocket连接');
      return null;
    }

    // 检查身份验证Token
    const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!authToken) {
      console.error('用户未登录，无法建立WebSocket连接');
      ElMessage.error('请先登录后再进行测评');
      router.push('/login');
      return null;
    }

    console.log('建立WebSocket连接...');
    
    // 关闭已存在的WebSocket连接
    if (processStats.socket && processStats.socket.readyState !== WebSocket.CLOSED) {
      processStats.socket.close();
    }

    // 重置WebSocket连接状态
    processStats.isWebSocketConnected = false;

    // 构建WebSocket URL - 使用当前主机名代替硬编码的localhost
    const host = window.location.hostname;
    const port = '8000'; // 或者根据环境变量配置
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // 使用正确的路径格式，确保包含认证令牌
    const wsUrl = `${wsProtocol}//${host}:${port}/api/v1/v2/ws/recommendations/${sessionId}?token=${encodeURIComponent(authToken)}`;
    console.log('WebSocket URL:', wsUrl);

    // 创建WebSocket连接
    const socket = new WebSocket(wsUrl);
    processStats.socket = socket;
    
    // 创建心跳检测
    let heartbeatInterval: number | null = null;
    const heartbeat = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: "ping" }));
          console.log('Heartbeat sent');
        } catch (e) {
          console.error('Heartbeat发送失败:', e);
        }
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('收到WebSocket消息:', data);
        
        // 处理消息
        handleWebSocketMessage(data);
        
        // 重置重连次数，连接正常
        processStats.retryCount = 0;
      } catch (e) {
        console.error("WebSocket消息解析错误", e);
      }
    };

    socket.onopen = () => {
      console.log('WebSocket连接已成功建立');
      // 更新连接状态
      processStats.isWebSocketConnected = true;
      
      // 记录调试信息
      console.log('=== WebSocket已连接 ===');
      console.log('readyState:', socket.readyState);
      console.log('url:', socket.url);
      console.log('协议:', socket.protocol);
      console.log('sessionId:', sessionId);
      console.log('认证令牌长度:', authToken.length);
      console.log('====================');
      
      // 开始心跳检测
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      heartbeatInterval = window.setInterval(heartbeat, 15000); // 每15秒心跳一次
      
      // 发送ping消息保持连接活跃，确保格式符合后端要求
      try {
        console.log('发送初始ping消息...');
        socket.send(JSON.stringify({
          type: "ping"
        }));
        console.log('ping消息已发送');
      } catch (e) {
        console.error('发送ping消息失败:', e);
      }
      
      // 主动请求一次状态
      try {
        console.log('发送get_status消息...');
        socket.send(JSON.stringify({
          type: "get_status"
        }));
        console.log('get_status消息已发送');
      } catch (e) {
        console.error('发送get_status消息失败:', e);
      }
      
      // 更新UI状态
      updateStatusMessage("已连接到推荐服务");
    };

    socket.onclose = (event) => {
      console.log('WebSocket连接已关闭，代码:', event.code, '原因:', event.reason);
      // 更新连接状态
      processStats.isWebSocketConnected = false;
      
      // 清除心跳检测
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      
      // 如果意外关闭，尝试重新连接
      if (event.code !== 1000 && event.code !== 1001) {
        console.warn('WebSocket异常关闭，尝试重新连接');
        
        // 增加重试次数和延迟
        processStats.retryCount = (processStats.retryCount || 0) + 1;
        const delay = Math.min(30000, Math.pow(1.5, processStats.retryCount) * 1000); // 指数退避策略
        
        console.log(`WebSocket将在${delay/1000}秒后第${processStats.retryCount}次尝试重连`);
        setTimeout(() => {
          if (processStats.retryCount < 10) { // 最多尝试10次
            setupWebSocket(sessionId);
          } else {
            console.error('WebSocket重连失败次数过多，切换到HTTP轮询');
            checkRecommendationStatus(sessionId);
          }
        }, delay);
      }
      
      processStats.socket = null;
    };

    socket.onerror = (error) => {
      console.error('WebSocket连接错误:', error);
      // 更新连接状态
      processStats.isWebSocketConnected = false;
      
      // 记录更详细的错误信息
      console.error('WebSocket URL:', wsUrl);
      console.error('WebSocket State:', socket.readyState);
      
      // 连接失败时，通过HTTP API获取状态
      console.warn('WebSocket连接出错，尝试通过API获取状态');
      setTimeout(() => checkRecommendationStatus(sessionId), 2000);
    };

    return socket; // 返回socket对象供清理使用
  } catch (error) {
    console.error('创建WebSocket连接失败:', error);
    // 更新连接状态
    processStats.isWebSocketConnected = false;
    
    // 失败时也通过HTTP API获取状态
    if (sessionId) {
      setTimeout(() => checkRecommendationStatus(sessionId), 2000);
    }
    return null;
  }
}

// 处理WebSocket消息
const handleWebSocketMessage = (data: any) => {
  try {
    console.log('处理WebSocket消息:', data);
    
    // 根据消息类型处理
    switch (data.type) {
      case 'connected':
        // 连接成功消息
        console.log('WebSocket连接确认:', data);
        // 发送一次状态请求
        if (processStats.socket && processStats.socket.readyState === WebSocket.OPEN) {
          processStats.socket.send(JSON.stringify({
            type: "get_status"
          }));
        }
        break;
        
      case 'pong':
        // 服务器响应ping
        console.log('接收到服务器pong响应');
        break;
        
      case 'status':
        // 完整的状态消息
        console.log('接收到状态更新:', data);
        // 如果包含阶段信息，更新UI
        if (data.current_stage) {
          processStats.stageInfo = data.current_stage;
        }
        
        // 如果包含进度信息
        if (data.overall_progress !== undefined) {
          const progress = parseFloat(data.overall_progress);
          if (!isNaN(progress)) {
            console.log(`更新进度条: ${progress}%`);
            processStats.progress = progress;
            // 更新进度条 - 确保使用整数值
            analysisProgress.value = Math.round(progress);
          }
        }
        
        // 如果包含当前状态消息
        if (data.message || data.current_stage_message) {
          processStats.statusMessage = data.message || data.current_stage_message;
          // 更新状态消息
          updateStatusMessage(processStats.statusMessage);
        }
        
        // 如果推荐已完成
        if (data.is_completed || data.overall_progress >= 99) {
          processStats.completed = true;
          // 获取推荐结果，添加一点延迟确保服务器已完成处理
          setTimeout(() => {
            fetchRecommendationResults(data.session_id);
          }, 2000);
        }
        break;
        
      case 'progress':
        // 进度更新消息
        console.log('接收到进度更新:', data);
        
        // 更新进度 - 确保数值有效且以整数显示
        if (data.overall_progress !== undefined) {
          const progress = parseFloat(data.overall_progress);
          if (!isNaN(progress)) {
            console.log(`更新进度条: ${progress}%`);
            processStats.progress = progress;
            // 更新进度条 - 确保使用整数值
            analysisProgress.value = Math.round(progress);
            
            // 调试日志 - 确认进度值
            console.log(`进度条已更新为: ${analysisProgress.value}%`);
          }
        }
        
        // 更新消息
        if (data.message) {
          processStats.statusMessage = data.message;
          // 更新状态消息
          updateStatusMessage(data.message);
        }
        
        // 如果包含阶段信息，更新UI
        if (data.current_stage) {
          processStats.stageInfo = data.current_stage;
        }
        
        // 如果进度达到99%或100%，可以认为处理已完成
        if (data.overall_progress >= 99) {
          processStats.completed = true;
          // 获取推荐结果，添加延迟确保服务器已完成结果保存
          console.log('进度达到完成阶段，准备获取结果');
          setTimeout(() => {
            fetchRecommendationResults(data.session_id);
          }, 2000); // 延迟2秒获取结果，确保服务器已完成结果保存
        }
        break;
        
      case 'complete':
        // 完成消息
        console.log('收到完成消息:', data);
        processStats.completed = true;
        analysisProgress.value = 100; // 强制设置为100%
        
        // 更新消息
        if (data.message) {
          processStats.statusMessage = data.message;
          updateStatusMessage(data.message);
        } else {
          updateStatusMessage("推荐分析已完成");
        }
        
        // 获取推荐结果
        setTimeout(() => {
          fetchRecommendationResults(data.session_id);
        }, 1000);
        break;
        
      case 'error':
        // 错误消息
        console.error('收到WebSocket错误:', data);
        ElMessage.error(data.message || '推荐过程出错');
        processStats.error = true;
        processStats.errorMessage = data.message || '未知错误';
        break;
        
      default:
        console.log('收到未知类型的WebSocket消息:', data);
    }
  } catch (error) {
    console.error('处理WebSocket消息时出错:', error);
  }
};

// 用户手动发送get_status消息获取最新状态
const requestStatus = () => {
  if (processStats.socket && processStats.socket.readyState === WebSocket.OPEN) {
    try {
      processStats.socket.send(JSON.stringify({
        type: "get_status"
      }));
      console.log('已发送get_status请求');
    } catch (error) {
      console.error('发送状态请求失败:', error);
          }
        } else {
    console.warn('WebSocket未连接，无法请求状态');
    // 如果WebSocket未连接，尝试通过API获取
    if (processStats.sessionId) {
      checkRecommendationStatus(processStats.sessionId);
    }
  }
}

// 保持WebSocket连接活跃
const keepAlive = () => {
  if (processStats.socket && processStats.socket.readyState === WebSocket.OPEN) {
    try {
      processStats.socket.send(JSON.stringify({
        type: "ping"
      }));
      console.log('发送ping保持连接');
    } catch (error) {
      console.error('发送ping失败:', error);
    }
  }
}

// 启动分析流程
const startAnalysis = async () => {
  try {
    console.log("开始启动分析流程...");
    isAnalyzing.value = true
    currentStep.value = 0
    analysisProgress.value = 0
    processStats.startTime = Date.now()
    processStats.elapsedTime = 0
    processStats.retryCount = 0
    processStats.sessionId = ""
    
    // 重置所有步骤状态
    detailSteps.forEach((step: any) => {
      step.status = step.id === 'user_data' ? '处理中' : '等待中'
    })
    
    // 清除可能存在的旧计时器
    if (analyzeTimer.value) {
      clearInterval(analyzeTimer.value)
    }
    
    // 更新计时器
    analyzeTimer.value = window.setInterval(() => {
      processStats.elapsedTime = Math.floor((Date.now() - processStats.startTime) / 1000)
    }, 1000)
    
    // 检查是否有答案数据
    const answersCount = Object.keys(answers).length;
    if (answersCount === 0) {
      ElMessage.error('没有测评数据，请至少回答一个问题');
      isAnalyzing.value = false;
      clearInterval(analyzeTimer.value);
      return;
    }
    console.log(`已回答${answersCount}个问题，准备提交测评数据`);
    
    // 提交优化的分析请求
    submitOptimizedAnalysisRequest();
    
  } catch (error) {
    console.error('启动分析过程失败:', error);
    isAnalyzing.value = false;
    clearInterval(analyzeTimer.value);
    ElMessage.error('启动分析失败，请重试');
  }
}

// 按照后端API要求发送请求
const submitOptimizedAnalysisRequest = () => {
  try {
    console.log('提交优化的分析请求...');
    
    // 准备数据
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const userId = userInfo.id || 1;
    
    // 检查用户是否已登录
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      console.error('用户未登录，无法进行测评分析');
      ElMessage.error('请先登录后再进行测评');
      router.push('/login');
      isAnalyzing.value = false;
      return;
    }
    
    // 第1步：获取用户数据
    updateStepStatus('user_data', '处理中');
    processStats.message = '正在获取用户资料...';
    
    // 将答案数据转换为API所需格式
    const assessmentData = {
      answers: Object.entries(answers).map(([id, value]) => ({
        question_id: id,
        answer: value
      }))
    };
    
    console.log('提交的测评数据:', assessmentData);
    
    // 使用XMLHttpRequest发送POST请求
    const xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        // 成功处理
        try {
          const startResponse = JSON.parse(xhr.responseText);
          console.log('职业推荐分析开始响应:', startResponse);
          
          // 获取会话ID
          const sessionId = startResponse.session_id;
          
          // 会话ID格式检查 - 后端规范要求以rec_开头
          if (sessionId && typeof sessionId === 'string') {
            processStats.sessionId = sessionId;
            processStats.message = `已启动职业推荐分析，会话ID: ${sessionId}`;
            
            // 更新步骤状态
            updateStepStatus('user_data', '已完成');
            updateStepStatus('assessment_data', '处理中');
            
            // 第3步：连接WebSocket接收进度更新
            setupWebSocket(sessionId);
            
            // 设置ping保持连接活跃
            if (!processStats.backupTimer) {
              processStats.backupTimer = window.setInterval(() => {
                keepAlive();
              }, 30000); // 每30秒ping一次
            }
          } else {
            console.error('服务器返回的session_id无效:', sessionId);
            ElMessage.error('服务器返回无效的会话ID，无法继续分析');
            isAnalyzing.value = false;
          }
  } catch (error) {
          console.error('解析服务器响应失败:', error);
          ElMessage.error('无法解析服务器响应');
          isAnalyzing.value = false;
        }
      } else {
        // 错误处理
        console.error('提交数据失败:', {
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText
        });
        
        // 处理身份验证错误
        if (xhr.status === 401 || xhr.status === 403) {
          ElMessage.error('身份验证失败，请重新登录');
          router.push('/login');
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            ElMessage.error(errorResponse.detail || '提交数据失败');
          } catch (e) {
            ElMessage.error(`提交数据失败: ${xhr.statusText || '未知错误'}`);
          }
        }
        
        isAnalyzing.value = false;
      }
    };
    
    xhr.onerror = function() {
      console.error('网络请求错误');
      ElMessage.error('网络连接错误，请检查网络连接');
      isAnalyzing.value = false;
    };
    
    // 设置POST请求 - 使用正确的API路径
    xhr.open('POST', 'http://localhost:8000/api/v1/v2/recommendations/start');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // 添加身份验证头
    const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    
    // 发送数据 - 使用正确的请求体格式
    xhr.send(JSON.stringify({
      user_id: userId,
      assessment_data: assessmentData
    }));
  } catch (error) {
    console.error('提交分析请求失败:', error);
    ElMessage.error('提交数据时发生错误');
    isAnalyzing.value = false;
  }
};

// 通过HTTP API检查推荐状态
const checkRecommendationStatus = (sessionId: string) => {
  if (!sessionId) {
    console.error('无效的sessionId，无法检查状态');
    return;
  }

  console.log('通过HTTP API检查推荐状态:', sessionId);
  
  // 获取认证令牌
  const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (!authToken) {
    console.error('未找到认证令牌，无法检查状态');
    ElMessage.error('请先登录后再进行操作');
    return;
  }
  
  // 使用当前主机名构建API URL
  const host = window.location.hostname;
  const port = '8000'; // 或者根据环境变量配置
  const statusUrl = `http://${host}:${port}/api/v1/v2/recommendations/${sessionId}/status`;
  console.log('状态API URL:', statusUrl);
  
  // 调用状态API
  fetch(statusUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`状态检查失败: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('获取到状态:', data);
    
    // 更新进度条
    if (data.overall_progress !== undefined) {
      const progress = parseFloat(data.overall_progress);
      if (!isNaN(progress)) {
        analysisProgress.value = progress;
        processStats.progress = progress;
      }
    }
    
    // 更新状态消息
    if (data.current_stage_message) {
      updateStatusMessage(data.current_stage_message);
      processStats.statusMessage = data.current_stage_message;
    }
    
    // 更新阶段信息
    if (data.current_stage) {
      processStats.stageInfo = data.current_stage;
      updateStepStatus('analysis', '进行中'); // 根据实际情况更新
    }
    
    // 检查是否完成
    if (data.is_completed) {
      processStats.completed = true;
      fetchRecommendationResults(sessionId);
    } else {
      // 如果未完成，继续轮询
      setTimeout(() => checkRecommendationStatus(sessionId), 3000);
    }
  })
  .catch(error => {
    console.error('检查状态时出错:', error);
    processStats.retryCount++;
    
    // 最多重试5次
    if (processStats.retryCount < 5) {
      console.log(`状态检查失败，${processStats.retryCount}/5 次重试...`);
      setTimeout(() => checkRecommendationStatus(sessionId), 5000);
    } else {
      ElMessage.error('无法获取推荐状态，请稍后再试');
      isAnalyzing.value = false;
    }
  });
};

// 获取推荐结果
const fetchRecommendationResults = (sessionId: string) => {
  if (!sessionId) {
    console.error('无效的sessionId，无法获取结果');
    return;
  }

  console.log('获取推荐结果:', sessionId);
  const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
  
  // 调用结果API
  fetch(`http://localhost:8000/api/v1/v2/recommendations/${sessionId}/results`, {
    method: 'GET',
    headers: {
      'Authorization': authToken ? `Bearer ${authToken}` : '',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`获取结果失败: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('结果API返回:', data);
    
    // 存储结果
    processStats.result = data;
    
    // 进入结果页
    if (data && data.recommendation_id) {
      router.push(`/result/${data.recommendation_id}`);
    } else {
      console.error('返回的结果缺少recommendation_id');
      ElMessage.error('获取结果失败，请稍后再试');
    }
  })
  .catch(error => {
    console.error('获取结果出错:', error);
    ElMessage.error('获取结果失败，请稍后再试');
  });
};

// 清理所有计时器和连接
const cleanupTimers = () => {
  // 清理计时器
  if (analyzeTimer.value) {
    clearInterval(analyzeTimer.value);
    analyzeTimer.value = null;
  }
  
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
  
  if (timeoutTimer.value) {
    clearTimeout(timeoutTimer.value);
    timeoutTimer.value = null;
  }
  
  if (processStats.backupTimer) {
    clearInterval(processStats.backupTimer);
    processStats.backupTimer = null;
  }
  
  // 关闭WebSocket连接
  if (processStats.socket) {
    try {
      processStats.socket.close();
    } catch (e) {
      console.error('关闭WebSocket连接失败:', e);
    }
    processStats.socket = null;
  }
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  cleanupTimers();
});

// 更新状态消息函数
const updateStatusMessage = (message: string) => {
  console.log("状态更新:", message);
  processStats.message = message;
}

// 格式化时间（将秒转换为分:秒格式）
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 获取当前阶段的所有问题
const getCurrentSectionQuestions = computed(() => {
  if (questions.length === 0 || !questions[activeStep.value]) {
    return [];
  }
  return questions[activeStep.value].items || [];
});

// 获取当前问题
const currentQuestion = computed(() => {
  if (getCurrentSectionQuestions.value.length === 0) {
    return { id: 0, content: '加载问题中...', options: [] };
  }
  return getCurrentSectionQuestions.value[currentQuestionIndex.value] || { id: 0, content: '问题加载失败', options: [] };
});

// 是否是最后一个问题
const isLastQuestion = computed(() => {
  const isLastInSection = currentQuestionIndex.value === getCurrentSectionQuestions.value.length - 1;
  const isLastSection = activeStep.value === questions.length - 1;
  return isLastInSection && isLastSection;
});

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  } else if (activeStep.value > 0) {
    activeStep.value--;
    currentQuestionIndex.value = questions[activeStep.value].items.length - 1;
  }
};

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < getCurrentSectionQuestions.value.length - 1) {
    currentQuestionIndex.value++;
  } else if (activeStep.value < questions.length - 1) {
    activeStep.value++;
    currentQuestionIndex.value = 0;
  }
};

// 选择答案
const selectAnswer = (value: number) => {
  if (currentQuestion.value) {
    // 使用updateAnswers更新答案
    updateAnswers(currentQuestion.value.id, value);
    
    // 短暂延迟后自动跳转到下一题
    setTimeout(() => {
      if (!isLastQuestion.value) {
        nextQuestion();
      }
    }, 300);
  }
};

// 获取进度
const getProgress = computed(() => {
  const totalQuestions = questions.reduce((sum: number, section: any) => sum + section.items.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  return Math.round((answeredQuestions / totalQuestions) * 100) || 0;
});

// 获取各部分进度
const getSectionProgress = (stepIndex: number) => {
  if (!questions[stepIndex] || !questions[stepIndex].items) return 0;
  
  const sectionQuestions = questions[stepIndex].items;
  let answeredCount = 0;
  
  sectionQuestions.forEach((q) => {
    if (answers[q.id] !== undefined) answeredCount++;
  });
  
  return Math.round((answeredCount / sectionQuestions.length) * 100) || 0;
};

// 获取各部分颜色
const getSectionColor = (stepIndex: number) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C'];
  return colors[stepIndex % colors.length];
};

// 估计剩余时间
const getEstimatedTime = () => {
  const totalQuestions = questions.reduce((sum: number, section: any) => sum + section.items.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const remainingQuestions = totalQuestions - answeredQuestions;
  
  // 每题预估时间15秒
  const remainingSeconds = remainingQuestions * 15;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  return `${minutes}分${seconds}秒`;
};

// 获取剩余时间
const getRemainingTime = () => {
  const totalSeconds = Math.ceil(processStats.stageTimeout - processStats.elapsedTime);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 获取当前进行阶段
const getCurrentStageLabel = () => {
  const stage = detailSteps[currentStep.value];
  return stage ? stage.title : '未知阶段';
};

// 获取当前阶段描述
const getStageDescription = () => {
  const stage = detailSteps[currentStep.value];
  return stage ? stage.status === '已完成' ? '已完成' : '进行中' : '未知阶段';
};

// 获取当前阶段进度
const getStageGroupProgress = (group: number) => {
  const stage = detailSteps.find((s: { group: number }) => s.group === group);
  if (!stage) return 0;
  return getSectionProgress(detailSteps.indexOf(stage));
};

// 获取当前阶段颜色
const getStageColor = (index: number) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C'];
  return colors[index % colors.length];
};

// 数据源列表
const dataSources = reactive([
  { id: 'user_data', name: '用户数据', status: '处理中', active: true, icon: 'User' },
  { id: 'resume_data', name: '简历数据', status: '等待中', active: true, icon: 'Document' },
  { id: 'assessment_data', name: '测评数据', status: '等待中', active: true, icon: 'DataLine' },
  { id: 'basic_match', name: '基础匹配', status: '等待中', active: true, icon: 'Connection' },
  { id: 'ai_analysis', name: 'AI分析', status: '等待中', active: true, icon: 'Setting' },
  { id: 'final_filter', name: '候选筛选', status: '等待中', active: true, icon: 'Filter' },
  { id: 'report', name: '推荐报告', status: '等待中', active: true, icon: 'Document' }
]);

// 获取数据源状态
const getSourceStatus = (id: string) => {
  const source = dataSources.find((s: { id: string }) => s.id === id);
  return source ? source.status : '未知状态';
};

// 是否激活数据源
const isSourceActive = (id: string) => {
  const source = dataSources.find((s: { id: string }) => s.id === id);
  return source ? source.active : false;
};

// 分析洞察列表
const analysisInsights = reactive([
  { icon: 'Star', content: '分析逻辑思维能力' },
  { icon: 'Monitor', content: '分析学习能力' },
  { icon: 'User', content: '分析团队协作' }
]);

// 当前分析洞察索引
const currentInsightIndex = ref(0);

// 是否暂停分析
const isPaused = ref(false);

// 切换暂停状态
const togglePause = () => {
  isPaused.value = !isPaused.value;
};

// 后台运行
const runInBackground = () => {
  // 这里可以添加后台运行的逻辑
  console.log('后台运行');
};

// 初步职业匹配预览
const previewCareers = reactive([
  { title: '软件开发工程师', match: 85, tags: ['技术创新', '问题解决', '持续学习'], opacity: 1 },
  { title: '产品经理', match: 75, tags: ['市场分析', '产品设计', '团队管理'], opacity: 0.8 },
  { title: '系统架构师', match: 90, tags: ['系统设计', '项目管理', '技术领导'], opacity: 0.9 },
  { title: '技术支持工程师', match: 70, tags: ['沟通表达', '问题解决', '持续学习'], opacity: 0.7 }
]);

// 分析洞察滚动位置
const insightScrollPosition = ref(0);

// 定义阶段组
const stageGroups = reactive([
  { name: '数据收集', group: 0 },
  { name: '基础匹配', group: 1 },
  { name: 'AI分析', group: 2 },
  { name: '结果整合', group: 3 }
]);

// 处理提交函数
const handleSubmit = () => {
  try {
    console.log('开始提交测评...');
    
    // 检查是否有足够的问题被回答
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 1) {
      ElMessage.warning('请至少回答1个问题');
      return;
    }
    
    // 开始分析流程
    startAnalysis();
  } catch (error) {
    console.error('提交测评失败:', error);
    ElMessage.error('提交测评时出错，请重试');
  }
};

// 添加startRecommendation函数
// 启动职业推荐流程
const startRecommendation = async () => {
  try {
    console.log('开始推荐过程...');
    
    // 检查是否已回答了所有问题
    const allSectionsCompleted = validateAllSectionsCompleted();
    if (!allSectionsCompleted) {
      ElMessage.warning('请先完成所有部分的问题再继续');
      return;
    }
    
    // 计算总分
    const { totalScore, sectionScores } = calculateAndSaveTotalScore();
    
    // 设置处理状态
    isAnalyzing.value = true;
    analysisProgress.value = 0;
    updateStatusMessage('正在开始推荐流程...');
    updateStepStatus('analysis', '等待');
    
    // 获取用户信息
    const userInfo = {
      user_id: localStorage.getItem('user_id') || '1', // 默认使用ID 1
      // 可以添加其他用户信息
    };
    
    // 准备请求数据 - 格式必须与API要求匹配
    const requestData = {
      user_id: userInfo.user_id,
      assessment_data: answers
    };
    
    console.log('开始推荐请求:', requestData);
    
    // 获取认证令牌
    const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!authToken) {
      throw new Error('未找到认证令牌，请先登录');
    }
    
    // 使用当前主机名构建API URL
    const host = window.location.hostname;
    const port = '8000'; // 或者根据环境变量配置
    const apiUrl = `http://${host}:${port}/api/v1/v2/recommendations/start`;
    console.log('API URL:', apiUrl);
    
    // 调用API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(requestData)
    });
    
    // 检查响应
    if (!response.ok) {
      // 处理错误状态码
      if (response.status === 401 || response.status === 403) {
        throw new Error('身份验证失败，请重新登录');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `服务器返回错误: ${response.status}`);
      }
    }
    
    // 解析响应
    const data = await response.json();
    console.log('推荐开始响应:', data);
    
    // 保存会话ID并设置WebSocket连接
    if (data.session_id) {
      // 更新会话ID
      processStats.sessionId = data.session_id;
      console.log('获取到会话ID:', data.session_id);
      
      // 更新UI状态
      updateStatusMessage('推荐分析已开始，正在连接到WebSocket...');
      updateStepStatus('analysis', '进行中');
      
      // 向控制台记录当前环境信息
      console.log('=== 调试信息 ===');
      console.log('当前主机名:', window.location.hostname);
      console.log('当前端口:', window.location.port);
      console.log('当前协议:', window.location.protocol);
      console.log('当前完整URL:', window.location.href);
      console.log('WebSocket会话ID:', data.session_id);
      console.log('认证令牌长度:', authToken.length);
      console.log('===============');
      
      // 重置所有WebSocket连接尝试状态
      processStats.isWebSocketConnected = false;
      if (processStats.socket && processStats.socket.readyState !== WebSocket.CLOSED) {
        processStats.socket.close();
        processStats.socket = null;
      }
      
      // 确保WebSocket连接建立 - 采用递增延迟策略
      let wsConnectionAttempts = 0;
      const maxAttempts = 5; // 增加到5次尝试
      
      const attemptWSConnection = () => {
        if (wsConnectionAttempts >= maxAttempts) {
          console.warn(`已尝试${maxAttempts}次WebSocket连接，将使用HTTP API获取状态`);
          checkRecommendationStatus(data.session_id);
          return;
        }
        
        wsConnectionAttempts++;
        // 使用更短的初始延迟: 第一次0.5秒
        const delay = wsConnectionAttempts === 1 ? 500 : wsConnectionAttempts * 800;
        console.log(`正在尝试WebSocket连接，第${wsConnectionAttempts}次...延迟：${delay}ms`);
        
        // 尝试建立WebSocket连接
        const wsInstance = setupWebSocket(data.session_id);
        console.log('WebSocket实例创建结果:', wsInstance ? '成功' : '失败');
        
        // 检查连接结果
        setTimeout(() => {
          console.log(`连接尝试${wsConnectionAttempts}检查 - WebSocket连接状态:`, processStats.isWebSocketConnected);
          if (processStats.isWebSocketConnected) {
            console.log('WebSocket连接成功！');
            // 连接成功后立即请求当前状态
            if (processStats.socket && processStats.socket.readyState === WebSocket.OPEN) {
              console.log('立即请求当前状态...');
              processStats.socket.send(JSON.stringify({
                type: "get_status"
              }));
            }
          } else {
            console.warn(`WebSocket连接尝试${wsConnectionAttempts}失败，${wsConnectionAttempts < maxAttempts ? "正在重试..." : "达到最大重试次数"}`);
            if (wsConnectionAttempts < maxAttempts) {
              attemptWSConnection();
            } else {
              // 使用HTTP API作为备选方案
              console.log('改用HTTP API获取状态...');
              checkRecommendationStatus(data.session_id);
            }
          }
        }, delay); // 使用递增延迟时间
      };
      
      // 先延迟500ms再开始尝试连接，确保后端已准备好
      setTimeout(attemptWSConnection, 500);
    } else {
      throw new Error('服务器未返回有效的会话ID');
    }
  } catch (error) {
    console.error('启动推荐过程时出错:', error);
    
    // 显示错误消息
    ElMessage.error(error instanceof Error ? error.message : '启动推荐过程失败');
    
    // 重置状态
    isAnalyzing.value = false;
    updateStatusMessage('推荐分析失败');
  }
};

// 添加onMounted钩子注册图标组件
onMounted(() => {
  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    if (key === 'Setting' || key === 'Check' || key === 'Connection') {
      console.log(`注册图标组件: ${key}`);
    }
  }
  
  // 当测评完成并开始推荐时，自动设置WebSocket连接
  if (processStats.sessionId) {
    setupWebSocket(processStats.sessionId);
  }
});

// 计算总分并保存
const calculateAndSaveTotalScore = () => {
  // 重置总分
  let totalScore = 0;
  let sectionScores: Record<string, number> = {};
  
  // 计算每个部分的总分
  Object.entries(answers).forEach(([sectionId, sectionAnswers]) => {
    let sectionTotal = 0;
    
    // 计算该部分的总分
    Object.values(sectionAnswers).forEach((answer) => {
      if (typeof answer === 'number') {
        sectionTotal += answer;
      }
    });
    
    // 保存部分总分
    sectionScores[sectionId] = sectionTotal;
    totalScore += sectionTotal;
  });
  
  console.log('计算得分结果:', { totalScore, sectionScores });
  
  // 保存到本地存储
  try {
    localStorage.setItem('assessmentTotalScore', totalScore.toString());
    localStorage.setItem('assessmentSectionScores', JSON.stringify(sectionScores));
  } catch (e) {
    console.error('无法保存得分到本地存储:', e);
  }
  
  // 分析部分得分分布并显示图表
  analyzeScoreDistribution(sectionScores);
  
  return { totalScore, sectionScores };
};

// 分析分数分布并生成图表
const analyzeScoreDistribution = (sectionScores: Record<string, number>) => {
  // 转换数据格式为图表所需
  const chartData = Object.entries(sectionScores).map(([section, score]) => {
    // 查找部分名称
    const sectionObj = assessmentSections.find(s => s.id === section);
    const label = sectionObj ? sectionObj.title : section;
    
    return {
      name: label,
      value: score
    };
  });
  
  console.log('图表数据:', chartData);
  
  // 这里可以调用图表渲染函数
  // renderChart(chartData);
};

// 检查是否完成了所有部分
const validateAllSectionsCompleted = (): boolean => {
  // 检查每个部分
  for (const section of assessmentSections) {
    const sectionId = section.id;
    const sectionAnswers = answers[sectionId] || {};
    
    // 获取该部分的所有问题
    const questions = getSpecificSectionQuestions(sectionId);
    
    // 检查每个问题是否都已回答
    for (const question of questions) {
      if (!sectionAnswers[question.id] && sectionAnswers[question.id] !== 0) {
        console.log(`部分 ${sectionId} 的问题 ${question.id} 未回答`);
        return false;
      }
    }
  }
  
  return true;
};

// 获取当前部分的题目
const getSpecificSectionQuestions = (sectionId: string): Question[] => {
  // 找到当前部分
  const currentSection = assessmentSections.find(s => s.id === sectionId);
  if (!currentSection) {
    console.error(`未找到部分: ${sectionId}`);
    return [];
  }
  
  // 获取该部分的题目
  return allQuestions.filter(q => q.section === sectionId);
};

// 验证某个部分的完成情况
const validateSectionComplete = (sectionId: string): boolean => {
  const sectionQuestions = questions
    .find((s: { id: string }) => s.id === sectionId)?.items || [];
    
  let answeredCount = 0;
  
  sectionQuestions.forEach((q: { id: string }) => {
    if (answers[q.id] !== undefined) answeredCount++;
  });
  
  return answeredCount === sectionQuestions.length;
}
</script>

<template>
  <div class="assessment-container">
    <!-- 使用Banner组件 -->
    <AssessmentBanner />

    <!-- 测评内容 -->
    <div v-if="showQuestionSelector" class="question-selector">
      <el-card class="panel-card">
        <template #header>
          <div class="panel-header">
            <el-icon><component :is="ElementPlusIconsVue.InfoFilled" /></el-icon>
            <span>选择测评模式</span>
            <div class="customize-button">
              <el-button 
                type="text" 
                @click="isCustomizing = !isCustomizing"
                size="small"
              >
                {{ isCustomizing ? '返回' : '自定义问题数量' }}
              </el-button>
            </div>
          </div>
        </template>
        <div v-if="!isCustomizing" class="question-modes">
          <el-radio-group v-model="selectedQuestionMode">
            <el-radio-button
              v-for="mode in questionModes"
              :key="mode.value"
              :label="mode.value"
            >
              <el-icon :size="20" :color="mode.icon">
                <component :is="ElementPlusIconsVue[mode.icon]" />
              </el-icon>
              <span>{{ mode.label }}</span>
              <p>{{ mode.description }}</p>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div v-else class="customize-panel">
          <h3>自定义问题数量</h3>
          <p class="customize-tip">调整各测评模式的问题数量，建议为3的倍数</p>
          
          <div v-for="mode in questionModes" :key="mode.value" class="customize-item">
            <div class="customize-header">
              <span>{{ mode.label }}</span>
              <el-tag size="small" effect="plain">{{ mode.questions }}题</el-tag>
            </div>
            <el-slider
              v-model="mode.questions"
              :min="3"
              :max="30"
              :step="3"
              show-stops
              @change="updateQuestionDescription(mode)"
            />
          </div>
          
          <div class="customize-actions">
            <el-button 
              type="success" 
              size="small" 
              @click="isCustomizing = false"
            >
              应用设置
            </el-button>
          </div>
        </div>
        <div v-if="!isCustomizing" class="start-button">
          <el-button
            type="primary"
            @click="startAssessment"
            :loading="isLoading"
            :disabled="isLoading"
          >
            {{ isLoading ? '获取问题中...' : '开始测评' }}
          </el-button>
        </div>
        <div v-if="isLoading" class="loading-tip">
          <el-alert
            type="info"
            :closable="false"
            show-icon
          >
            正在从服务器获取{{ 
              selectedQuestionMode === 'simple' ? '简洁' : 
              selectedQuestionMode === 'standard' ? '标准' : '详细' 
            }}测评题目，请稍候...
          </el-alert>
        </div>
      </el-card>
    </div>

    <div v-else-if="!isAnalyzing" class="assessment-layout">
      <!-- 左侧说明面板 -->
      <div class="side-panel left-panel">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-header">
              <el-icon><InfoFilled /></el-icon>
              <span>测评说明</span>
            </div>
          </template>
          <div class="assessment-guide">
            <h4>测评目的</h4>
            <p>通过科学的测评帮助您了解自己的职业倾向，为职业规划提供参考。</p>
            
            <h4>测评维度</h4>
            <ul class="dimension-list">
              <li>
                <el-icon><Star /></el-icon>
                <div>
                  <strong>兴趣测评</strong>
                  <p>了解您对不同职业领域的兴趣程度</p>
                </div>
              </li>
              <li>
                <el-icon><Monitor /></el-icon>
                <div>
                  <strong>能力测评</strong>
                  <p>评估您在各个领域的专业技能水平</p>
                </div>
              </li>
              <li>
                <el-icon><User /></el-icon>
                <div>
                  <strong>性格测评</strong>
                  <p>分析您的性格特征与职业的匹配度</p>
                </div>
              </li>
            </ul>

            <h4>注意事项</h4>
            <ul class="notice-list">
              <li>请在安静的环境下完成测评</li>
              <li>每个问题建议思考10-15秒</li>
              <li>请根据第一印象作答</li>
              <li>测评预计需要{{ selectedQuestionMode === 'simple' ? '3-5' : selectedQuestionMode === 'standard' ? '10-15' : '15-20' }}分钟</li>
            </ul>
          </div>
        </el-card>
      </div>

      <!-- 中间主要内容 -->
      <div class="assessment-content">
        <div class="assessment-header">
          <div class="header-left">
            <h2>{{ filteredQuestions[activeStep].title }}</h2>
            <div class="step-progress">
              <span class="step-count">第 {{ currentQuestionIndex + 1 }}/{{ getCurrentSectionQuestions.length }} 题</span>
              <el-progress 
                :percentage="getSectionProgress(activeStep)"
                :stroke-width="8"
                :color="getSectionColor(activeStep)"
              />
            </div>
          </div>
          <div class="step-nav">
            <el-button
              v-for="(step, index) in steps"
              :key="index"
              :type="index === activeStep ? 'primary' : 'default'"
              :class="{ 'completed': getSectionProgress(index) === 100 }"
              size="small"
              @click="activeStep = index"
            >
              {{ step.title }}
            </el-button>
          </div>
        </div>

        <div class="question-content">
          <div class="question-item">
            <h3>{{ currentQuestionIndex + 1 }}. {{ currentQuestion.content }}</h3>
            <div class="options-group">
              <div
                v-for="option in currentQuestion.options"
                :key="option.value"
                class="option-item"
                :class="{ 
                  'selected': answers[currentQuestion.id] === option.value,
                  'hoverable': answers[currentQuestion.id] !== option.value
                }"
                @click="selectAnswer(option.value)"
              >
                <div class="option-content">
                  <div class="option-radio">
                    <div v-if="answers[currentQuestion.id] === option.value" class="radio-inner" />
                  </div>
                  <span>{{ option.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="assessment-footer">
          <el-button
            v-if="!(activeStep === 0 && currentQuestionIndex === 0)"
            class="nav-button"
            @click="prevQuestion"
          >
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>
          <el-button
            type="primary"
            :disabled="!answers[currentQuestion.id]"
            class="nav-button"
            @click="isLastQuestion ? handleSubmit() : nextQuestion()"
          >
            {{ isLastQuestion ? '提交测评' : '下一题' }}
            <el-icon v-if="!isLastQuestion">
              <ArrowRight />
            </el-icon>
          </el-button>
        </div>
      </div>

      <!-- 右侧进度面板 -->
      <div class="side-panel right-panel">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-header">
              <el-icon><Histogram /></el-icon>
              <span>答题进度</span>
            </div>
          </template>
          <div class="progress-stats">
            <div class="stat-item">
              <div class="stat-label">
                总体进度
              </div>
              <el-progress type="circle" :percentage="getProgress" />
            </div>
            <div v-for="(section, index) in questions" :key="index" class="stat-item">
              <div class="stat-label">
                {{ section.title }}
              </div>
              <el-progress 
                :percentage="getSectionProgress(index)"
                :color="getSectionColor(index)"
                :stroke-width="10"
                :format="(p) => `${p}%`"
              />
            </div>
            <div class="time-estimate">
              <el-icon><Timer /></el-icon>
              <span>预计剩余时间：{{ getEstimatedTime() }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 分析动画 -->
    <div v-else class="analysis-container">
      <div class="analysis-content">
        <el-card class="result-card">
          <div class="result-header">
            <h2>职业推荐生成中</h2>
            <p>我们正在为您分析数据并生成个性化职业推荐</p>
          </div>
          
          <!-- 主进度区域 -->
          <div class="analysis-progress-container">
            <!-- 动态进度环 -->
            <div class="main-progress">
              <div class="progress-ring">
                <el-progress 
                  type="dashboard" 
                  :percentage="Math.round(analysisProgress)" 
                  :stroke-width="12"
                  :width="180"
                  :status="analysisProgress >= 100 ? 'success' : ''"
                  :format="() => ''"
                  class="pulse-effect"
                />
                <div class="progress-center">
                  <div class="progress-percentage">{{ Math.round(analysisProgress) }}%</div>
                  <div class="progress-label">分析完成</div>
                </div>
              </div>
              
              <div class="progress-stats">
                <div class="time-stat">
                  <span class="stat-label">已处理时间</span>
                  <span class="stat-value">{{ formatTime(processStats.elapsedTime) }}</span>
                </div>
                <div class="progress-divider"></div>
                <div class="time-stat">
                  <span class="stat-label">预计剩余</span>
                  <span class="stat-value remaining-time">{{ analysisProgress >= 100 ? '0:00' : getRemainingTime() }}</span>
                </div>
              </div>
            </div>
            
            <!-- 处理信息和阶段 -->
            <div class="processing-info">
              <div class="processing-stage">
                <div class="stage-header">
                  <span class="stage-label">当前进行：</span>
                  <span class="stage-value typewriter">{{ getCurrentStageLabel() }}</span>
                </div>
                <p class="stage-description">{{ getStageDescription() }}</p>
              </div>
              
              <!-- 细分进度条区域 -->
              <div class="stage-progress-bars">
                <div class="stage-bar" v-for="(stage, index) in stageGroups" :key="index">
                  <div class="stage-bar-label">{{ stage.name }}</div>
                  <el-progress 
                    :percentage="getStageGroupProgress(stage.group)" 
                    :color="getStageColor(index)"
                    :stroke-width="8"
                    :format="p => `${p}%`"
                    class="stage-progress"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- 实时数据流区域 -->
          <div class="data-flow-container">
            <!-- 数据收集可视化 -->
            <div class="data-collection">
              <h3>数据分析进行中</h3>
              <div class="data-sources">
                <div class="data-source" v-for="(source, index) in dataSources" :key="index"
                     :class="{'active-source': isSourceActive(source.id)}">
                  <div class="source-icon">
                    <el-icon><component :is="source.icon === 'Connection' ? Connection : source.icon === 'Setting' ? Setting : Check" /></el-icon>
                  </div>
                  <div class="source-info">
                    <div class="source-name">{{ source.name }}</div>
                    <div class="source-status">{{ getSourceStatus(source.id) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 匹配职业预览 -->
            <div class="career-preview">
              <h3>初步职业匹配</h3>
              <div class="career-matches">
                <div class="career-match-placeholder" v-if="analysisProgress < 40">
                  <div class="placeholder-text">正在分析中，即将显示初步匹配...</div>
                  <div class="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div class="career-match-cards" v-else>
                  <div class="career-card" v-for="(career, index) in previewCareers" :key="index"
                       :style="{'--delay': `${index * 0.2}s`, 'opacity': career.opacity}">
                    <div class="career-title">{{ career.title }}</div>
                    <div class="career-match">
                      <div class="match-progress">
                        <div class="match-bar" :style="{width: `${career.match}%`}"></div>
                      </div>
                      <div class="match-percent">{{ career.match }}%</div>
                    </div>
                    <div class="career-tags">
                      <span class="career-tag" v-for="(tag, tagIndex) in career.tags" :key="tagIndex">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分析洞察与互动元素 -->
          <div class="insights-container">
            <div class="insights-scroller">
              <div class="insight-items" :style="{'--scroll-position': `${insightScrollPosition}px`}">
                <div class="insight-item" v-for="(insight, index) in analysisInsights" :key="index"
                     :class="{'active-insight': index === currentInsightIndex}">
                  <div class="insight-icon">
                    <el-icon><Setting /></el-icon>
                  </div>
                  <div class="insight-content">{{ insight.content }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 交互控制区域 -->
          <div class="controls-container">
            <el-button 
              :type="isPaused ? 'primary' : 'default'"
              class="control-button"
              @click="togglePause"
              :disabled="analysisProgress >= 100"
            >
              {{ isPaused ? '继续分析' : '暂停分析' }}
            </el-button>
            
            <el-button 
              type="info"
              class="control-button"
              @click="runInBackground"
            >
              后台运行
            </el-button>
            
            <el-button type="success" class="control-button">
              完成后通知
            </el-button>
          </div>
          
          <!-- 进度提示 -->
          <div class="progress-tip" v-if="processStats.message">
            <el-alert
              type="info"
              :closable="false"
              show-icon
            >
              <template #title>
                <span class="tip-title">处理提示</span>
              </template>
              <div class="tip-content">
                {{ processStats.message }}
              </div>
            </el-alert>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 分析状态面板 -->
    <div v-if="isAnalyzing" class="analysis-overlay">
      <el-card class="analysis-card">
        <div v-if="errorState.hasError" class="error-container">
          <el-alert
            title="处理出错"
            type="error"
            :description="errorState.errorMessage"
            show-icon
            :closable="false"
          />
          <div class="error-actions">
            <el-button type="primary" @click="startRecommendation()">重试</el-button>
            <el-button @click="isAnalyzing = false">取消</el-button>
          </div>
        </div>
        <div v-else class="analysis-container">
          <!-- 这里可以添加分析状态的详细内容 -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.assessment-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 顶部Banner样式 */
.assessment-banner {
  position: relative;
  background: linear-gradient(135deg, #409eff, #67c23a);
  padding: 40px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.banner-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  left: 10%;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 20px;
  left: 30%;
  background: rgba(255, 255, 255, 0.15);
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.banner-content h1 {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 600;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

/* 进度条样式 */
.assessment-progress-bar {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  position: relative;
  padding: 0 10px;
}

.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #dcdfe6;
  z-index: 0;
}

.progress-step.active:not(:last-child)::after,
.progress-step.completed:not(:last-child)::after {
  background-color: #67c23a;
}

.step-node {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #909399;
  z-index: 1;
}

.progress-step.active .step-node {
  border-color: #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}

.progress-step.completed .step-node {
  border-color: #67c23a;
  background-color: #67c23a;
  color: white;
}

.step-info {
  flex-grow: 1;
}

.step-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: #909399;
}

.total-progress {
  margin-top: 10px;
}

.assessment-layout {
  display: flex;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
  align-items: flex-start;
}

.side-panel {
  width: 300px;
  flex-shrink: 0;
}

.assessment-content {
  flex-grow: 1;
  min-width: 0;
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 重置所有卡片的默认样式 */
:deep(.el-card) {
  border: none !important;
  margin: 0 !important;
}

:deep(.el-card__header) {
  padding: 15px 20px !important;
  margin: 0 !important;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px !important;
  margin: 0 !important;
}

.panel-card, .assessment-card {
  position: relative;
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.assessment-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.assessment-guide {
  flex: 1;
  overflow-y: auto;
}

.progress-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.assessment-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.assessment-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.header-left {
  flex-grow: 1;
}

.header-left h2 {
  margin: 0 0 12px;
  font-size: 24px;
  color: #303133;
}

.step-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-count {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.step-progress :deep(.el-progress) {
  width: 120px;
}

.step-nav {
  margin: 0;
  padding: 0;
}

.step-nav .el-button {
  font-size: 13px;
}

.step-nav .completed {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

.question-content {
  min-height: 300px;
  margin-bottom: 20px;
}

.question-item {
  padding: 0;
  margin: 0;
}

.question-item h3 {
  margin: 0 0 24px;
  font-size: 18px;
  color: #303133;
  line-height: 1.6;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  padding: 16px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none; /* 防止文字被选中 */
}

.option-item.hoverable:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.option-item.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
  pointer-events: none; /* 选中后禁止再次点击 */
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-radio {
  width: 16px;
  height: 16px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.option-item.selected .option-radio {
  border-color: #409eff;
}

.radio-inner {
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border-radius: 50%;
}

.assessment-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.nav-button {
  min-width: 120px;
}

.assessment-guide h4 {
  margin: 20px 0 10px;
  color: #303133;
  font-size: 16px;
}

.assessment-guide p {
  margin: 0 0 15px;
  color: #606266;
  line-height: 1.6;
}

.dimension-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}

.dimension-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.dimension-list .el-icon {
  font-size: 20px;
  color: #409eff;
  margin-top: 2px;
}

.dimension-list strong {
  display: block;
  margin-bottom: 4px;
  color: #303133;
}

.dimension-list p {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 12px;
  color: #606266;
  line-height: 1.5;
}

.notice-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #409eff;
  font-weight: bold;
}

.time-estimate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #606266;
}

.analysis-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f7fa;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  animation: fadeIn 0.5s ease-out;
  padding: 20px;
  /* 解决右侧滚动条问题 */
  width: 100vw;
  overflow-x: hidden;
}

.analysis-content {
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 1;
  animation: contentFadeIn 0.8s ease-out;
}

.result-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* 确保内容不溢出 */
  overflow-x: hidden;
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 10px;
}

.result-header h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 8px;
}

.result-header p {
  font-size: 16px;
  color: #606266;
}

.analysis-progress-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.main-progress {
  flex: 0 0 auto;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-stats {
  display: flex;
  margin-top: 15px;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 8px 15px;
  width: 100%;
}

.time-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.progress-divider {
  width: 1px;
  background: #dcdfe6;
  margin: 0 10px;
}

.processing-info {
  flex: 1;
  background: #f0f9ff;
  border-radius: 8px;
  padding: 15px;
}

.processing-stage {
  margin-bottom: 8px;
}

.stage-label {
  color: #909399;
}

.stage-value {
  font-weight: 500;
  color: #409EFF;
}

.processing-details {
  color: #606266;
  font-size: 14px;
}

.analysis-flow {
  margin: 30px 0;
  padding: 0 20px;
}

.flow-stages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.flow-stage {
  display: flex;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.flow-stage.active {
  background: #ecf5ff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.2);
}

.flow-stage.completed {
  background: #f0f9eb;
}

.stage-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
}

.active .stage-icon {
  background: #409EFF;
}

.completed .stage-icon {
  background: #67C23A;
}

.stage-content {
  flex: 1;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.stage-title {
  font-weight: 500;
  color: #303133;
}

.stage-progress {
  font-size: 13px;
  color: #606266;
}

.stage-description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.detail-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.detail-step {
  flex: 1 0 45%;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #dcdfe6;
  min-width: 200px;
}

.detail-active {
  background: #ecf5ff;
  border-left-color: #409EFF;
}

.detail-completed {
  background: #f0f9eb;
  border-left-color: #67C23A;
}

.detail-icon {
  margin-right: 10px;
  color: #909399;
}

.detail-active .detail-icon {
  color: #409EFF;
}

.detail-completed .detail-icon {
  color: #67C23A;
}

.detail-content {
  flex: 1;
}

.detail-title {
  font-weight: 500;
  font-size: 13px;
  color: #303133;
}

.detail-desc {
  font-size: 12px;
  color: #909399;
}

.detail-status {
  font-size: 12px;
  color: #909399;
}

.detail-active .detail-status {
  color: #409EFF;
}

.detail-completed .detail-status {
  color: #67C23A;
}

.processing-icon {
  animation: spin 1.5s linear infinite;
}

.result-footer {
  margin-top: 30px;
}

.processing-filter {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.filter-title {
  font-weight: 500;
  margin-bottom: 15px;
  color: #303133;
}

.filter-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-stage {
  text-align: center;
}

.filter-count {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
}

.filter-label {
  font-size: 13px;
  color: #606266;
}

.filter-arrow {
  margin: 0 15px;
  color: #909399;
  font-size: 20px;
}

.tip-title {
  font-weight: 600;
}

.tip-content {
  padding: 8px 0;
  line-height: 1.6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 问题选择器界面样式 */
.question-selector {
  max-width: 800px;
  margin: 40px auto;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.question-modes {
  margin: 30px 0;
}

.el-radio-button {
  width: 100%;
  height: 120px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.el-radio-button:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.el-radio-button:deep(.el-radio-button__inner) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none !important;
  box-shadow: none !important;
}

.el-radio-button span {
  margin: 10px 0 5px;
  font-size: 16px;
  font-weight: 600;
}

.el-radio-button p {
  font-size: 14px;
  color: #606266;
  margin: 5px 0 0;
}

.start-button {
  text-align: center;
  margin: 20px 0;
}

.start-button button {
  width: 200px;
  height: 50px;
  font-size: 16px;
}

.loading-tip {
  margin-top: 10px;
}

.customize-button {
  float: right;
}

.customize-panel {
  padding: 20px;
}

.customize-item {
  margin-bottom: 20px;
}

.customize-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.customize-tip {
  font-size: 12px;
  color: #909399;
}

.customize-actions {
  text-align: right;
  margin-top: 20px;
}

.progress-ring {
  position: relative;
  display: inline-block;
  width: 180px;
  height: 180px;
  margin-right: 30px;
}

.progress-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background: white;
  border-radius: 50%;
}

.progress-percentage {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1;
}

.progress-label {
  font-size: 14px;
  color: #606266;
  line-height: 1;
}

.stage-progress-bars {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.stage-bar {
  flex: 1;
  text-align: center;
}

.stage-bar-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
}

.data-flow-container {
  margin-top: 30px;
}

.data-collection {
  margin-bottom: 20px;
}

.data-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.data-source {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.data-source:hover {
  background-color: #ecf5ff;
}

.source-icon {
  margin-right: 10px;
  color: #409EFF;
}

.source-info {
  flex: 1;
}

.source-name {
  font-size: 14px;
  color: #303133;
}

.source-status {
  font-size: 12px;
  color: #606266;
}

.career-preview {
  margin-top: 20px;
}

.career-matches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.career-match-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.placeholder-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background-color: #409EFF;
  border-radius: 50%;
  animation: blink 1s linear infinite;
}

.career-match-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.career-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.career-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.career-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 10px;
}

.career-match {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.match-progress {
  flex: 1;
  height: 10px;
  background-color: #f0f9eb;
  border-radius: 5px;
  overflow: hidden;
}

.match-bar {
  height: 100%;
  background-color: #409EFF;
}

.match-percent {
  margin-left: 10px;
  font-size: 12px;
  color: #606266;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.career-tag {
  font-size: 12px;
  color: #606266;
  padding: 5px 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.insights-container {
  margin-top: 30px;
}

.insights-scroller {
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.insight-items {
  display: inline-block;
}

.insight-item {
  display: inline-block;
  margin-right: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.insight-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.insight-icon {
  margin-right: 10px;
  color: #409EFF;
}

.insight-content {
  font-size: 14px;
  color: #606266;
}

.controls-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.control-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.control-button:hover {
  background-color: #ecf5ff;
}

.progress-tip {
  margin-top: 20px;
}

.blink {
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.analysis-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.error-container {
  margin-bottom: 20px;
}

.error-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
