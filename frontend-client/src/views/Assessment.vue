<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AssessmentBanner from '../components/common/AssessmentBanner.vue'
import { ElMessage } from 'element-plus'
import { useRecommendationStore } from '@/stores/recommendation'
import request from '@/api/request'
import { Check, Setting, Back, Loading, Connection } from '@element-plus/icons-vue'
import ProgressBar from '@/components/ProgressBar.vue'

const router = useRouter()
const recommendationStore = useRecommendationStore()

// 定义计时器引用
const analyzeTimer = ref<number | null>(null)
const pollingTimer = ref<number | null>(null)
const timeoutTimer = ref<number | null>(null)

// 处理状态
const isAnalyzing = ref(false)
const currentStep = ref(0)
const analysisProgress = ref(0)
const currentQuestionIndex = ref(0)

// 处理统计
const processStats = reactive({
  startTime: 0,
  elapsedTime: 0,
  retryCount: 0,
  processedCareers: 0,
  candidateCareers: 0,
  finalCareers: 0,
  currentBatch: 0,
  stageInfo: '',
  message: '',
  stageTimeout: 60
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

// 定义分析步骤
const detailSteps = reactive([
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
  const step = detailSteps.find(s => s.id === stepId)
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
    
    try {
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
          console.warn(`${type}类型问题数据为空，使用本地问题`);
          // 使用本地问题数据
          const localItems = getLocalQuestions(type as 'interest' | 'ability' | 'personality').slice(0, questionsPerDimension);
          questionsData.push({
            type,
            title: type === 'interest' ? '兴趣测评' : 
                  type === 'ability' ? '能力测评' : '性格测评',
            items: localItems
          });
        }
      }
      
      // 如果获取到了问题数据，则替换本地数据
      if (questionsData.length > 0) {
        questions.splice(0, questions.length, ...questionsData);
      } else {
        // 所有API请求都失败，使用本地模拟数据
        ElMessage.warning('无法从服务器获取问题数据，将使用本地问题');
        useLocalQuestions();
      }
    } catch (apiError: any) {
      console.error('API请求失败:', apiError);
      
      if (apiError.response && apiError.response.status === 401) {
        ElMessage.warning('当前未登录或会话已过期，将使用本地测评问题');
      } else {
        ElMessage.warning(`无法连接到服务器，将使用本地测评问题`);
      }
      
      // 使用本地模拟数据
      useLocalQuestions();
    }
    
    // 隐藏问题选择器，显示测评界面
    showQuestionSelector.value = false;
  } catch (error: any) {
    console.error('测评启动失败:', error);
    ElMessage.error(`测评启动失败: ${error.message || '未知错误'}`);
    
    // 无论如何，仍然允许用户继续测试
    showQuestionSelector.value = false;
  } finally {
    isLoading.value = false;
  }
}

// 从数组中随机选择指定数量的元素
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 获取本地问题数据
const getLocalQuestions = (type: 'interest' | 'ability' | 'personality'): ProcessedQuestion[] => {
  const index = type === 'interest' ? 0 : type === 'ability' ? 1 : 2;
  return questions[index]?.items || [];
}

// 使用本地问题数据，根据测评模式筛选数量
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
    
    // 重置所有步骤状态
    detailSteps.forEach(step => {
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
    
    // 获取当前用户ID
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    const userId = userInfo.id || 1
    console.log("使用用户ID:", userId, "localStorage中的用户信息:", localStorage.getItem('user_info'));
    
    // 当前日期时间（格式化为YYYY-MM-DD HH:MM:SS格式）
    const now = new Date()
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    
    // 检查是否有答案数据
    const answersCount = Object.keys(answers).length;
    if (answersCount === 0) {
      ElMessage.error('没有测评数据，请至少回答一个问题');
      isAnalyzing.value = false;
      clearInterval(analyzeTimer.value);
      return;
    }
    console.log(`已回答${answersCount}个问题，准备提交测评数据`);
    
    // 按类型分类答案
    interface AnswerItem {
      question_id: string;
      question: string;
      selected_option: string;
    }
    
    const answersByType: Record<string, AnswerItem[]> = {
      interest: [],
      ability: [],
      personality: []
    }
    
    // 遍历所有问题和答案，按类型组织
    questions.forEach((section: any) => {
      const type = section.type // 获取类型：interest, ability, personality
      
      // 遍历该类型下的所有问题
      section.items.forEach((question: any) => {
        // 如果该问题已回答，则添加到对应类型中
        if (answers[question.id] !== undefined) {
          // 获取选项文本而不是数值
          const selectedValue = answers[question.id]
          const selectedOption = question.options.find((opt: any) => opt.value === selectedValue)?.label || "未知选项"
          
          // 生成8位数字的随机ID
          const randomId = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
          
          answersByType[type].push({
            "question_id": `${type}_${randomId}`,
            "question": question.content,
            "selected_option": selectedOption
          })
        }
      })
    })
    
    // 构建完整的测评数据数组
    interface AssessmentItem {
      type: string;
      completion_date: string;
      answers: AnswerItem[];
    }
    
    const assessments: AssessmentItem[] = []
    
    // 添加三种测评类型，即使没有回答也添加空数组
    Object.entries({
      interest: '兴趣测评',
      ability: '能力测评',
      personality: '性格测评'
    }).forEach(([type, title]) => {
      assessments.push({
        type,
        completion_date: currentDate,
        answers: answersByType[type]
      })
    })
    
    // 构建最终提交数据格式
    const submitData = {
      "user_id": userId,
      "assessments": assessments
    }
    
    console.log('准备提交测评数据:', JSON.stringify(submitData, null, 2))
    
    // 第1步：提交测评数据到后端
    let submissionSuccessful = false
    try {
      console.log('步骤1: 正在提交测评数据...')
      console.log('POST请求URL:', '/api/v1/assessments/submit')
      
      // 使用直接的XMLHttpRequest发送请求，确保可以查看详细的网络错误
      const submitResponse = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/v1/assessments/submit');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              resolve(xhr.responseText);
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText
            });
          }
        };
        xhr.onerror = function() {
          reject({
            status: xhr.status,
            statusText: 'XMLHttpRequest Error',
            response: null
          });
        };
        xhr.send(JSON.stringify(submitData));
      });
      
      console.log('测评数据提交成功:', submitResponse)
      submissionSuccessful = true
      updateStepStatus('user_data', '已完成')
      updateStepStatus('assessment_data', '处理中')
    } catch (error) {
      console.error('提交测评数据失败:', error)
      ElMessage.warning('提交测评数据失败，将使用本地分析结果')
      // 继续处理，不中断流程
    }
    
    // 更新进度
    analysisProgress.value = 15
    updateStepStatus('assessment_data', '已完成')
    
    // 第2步：调用推荐生成API
    console.log('步骤2: 正在启动职业推荐生成...')
    try {
      console.log('POST请求URL:', '/api/v1/career-recommendations/generate', {user_id: userId})
      
      // 使用直接的XMLHttpRequest发送生成请求
      const genResponseData = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/v1/career-recommendations/generate');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              resolve({data: {success: true}});
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText
            });
          }
        };
        xhr.onerror = function() {
          reject({
            status: xhr.status,
            statusText: 'XMLHttpRequest Error',
            response: null
          });
        };
        xhr.send(JSON.stringify({user_id: userId}));
      });
      
      console.log('推荐生成任务已启动:', genResponseData)
      
      if (genResponseData?.data?.success) {
        console.log('职业推荐任务启动成功，开始轮询进度')
        // 第3步：启动进度轮询
        startProgressPolling(userId)
      } else {
        console.log('职业推荐启动返回成功但数据无效, 仍尝试开始轮询:', genResponseData)
        startProgressPolling(userId)
      }
    } catch (error) {
      console.error('启动推荐生成API失败:', error);
      ElMessage.error('启动推荐生成失败，但仍将尝试获取进度');
      // 仍然尝试启动轮询
      startProgressPolling(userId);
    }
    
    // 设置总体超时保护
    timeoutTimer.value = window.setTimeout(() => {
      ElMessage.warning('分析时间过长，请刷新页面重试')
      cleanupTimers()
      isAnalyzing.value = false
      clearInterval(analyzeTimer.value)
    }, 300000) // 5分钟总超时
    
  } catch (error) {
    console.error('启动分析过程失败:', error)
    isAnalyzing.value = false
    clearInterval(analyzeTimer.value)
    ElMessage.error('启动推荐分析失败，请重试')
  }
}

// 进度轮询函数
const startProgressPolling = (userId: number | string) => {
  console.log('开始轮询推荐生成进度...');
  updateStepStatus('recommendation_gen', '处理中');
  analysisProgress.value = 30;
  
  // 清除可能存在的旧轮询计时器
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
  }
  
  // 初始化计数器
  let pollingCount = 0;
  const maxPollingCount = 60; // 最多轮询60次，即5分钟
  
  // 设置轮询计时器
  pollingTimer.value = window.setInterval(async () => {
    try {
      pollingCount++;
      console.log(`轮询进度 (${pollingCount}/${maxPollingCount})...`);
      
      // 使用XMLHttpRequest发送请求以获取详细错误信息
      const progressResponseData = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/v1/career-recommendations/progress?user_id=${userId}`);
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              resolve({ data: { progress: 0, status: 'unknown' } });
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText
            });
          }
        };
        xhr.onerror = function() {
          reject({
            status: xhr.status,
            statusText: 'XMLHttpRequest Error',
            response: null
          });
        };
        xhr.send();
      });
      
      console.log('进度查询结果:', progressResponseData);
      
      // 从响应中提取进度数据
      const progress = progressResponseData?.data?.progress || 0;
      const status = progressResponseData?.data?.status || 'processing';
      
      // 更新显示的进度
      if (progress > 0) {
        analysisProgress.value = 30 + Math.min(65, Math.floor(progress * 0.65));
      }
      
      // 如果进度完成
      if (status === 'completed' || progress >= 100) {
        console.log('推荐生成已完成!');
        if (pollingTimer.value) clearInterval(pollingTimer.value);
        updateStepStatus('recommendation_gen', '已完成');
        analysisProgress.value = 95;
        
        // 转到结果处理
        setTimeout(() => {
          finalizeAnalysis(userId);
        }, 1000);
        return;
      }
      
      // 如果超过最大轮询次数
      if (pollingCount >= maxPollingCount) {
        console.log('达到最大轮询次数，停止轮询');
        if (pollingTimer.value) clearInterval(pollingTimer.value);
        ElMessage.warning('推荐生成时间过长，请稍后在"职业推荐"页面查看结果');
        
        // 直接完成流程以避免用户等待
        finalizeAnalysis(userId);
        return;
      }
      
    } catch (error) {
      console.error('轮询进度失败:', error);
      processStats.retryCount++;
      
      // 如果连续失败次数过多，停止轮询
      if (processStats.retryCount >= 3) {
        console.log('连续失败次数过多，停止轮询');
        if (pollingTimer.value) clearInterval(pollingTimer.value);
        ElMessage.warning('无法获取推荐生成进度，请稍后在"职业推荐"页面查看结果');
        
        // 仍然尝试完成流程
        finalizeAnalysis(userId);
      }
    }
  }, 5000); // 每5秒轮询一次
};

// 完成分析并清理
const finalizeAnalysis = async (userId: number | string) => {
  try {
    updateStepStatus('finalizing', '处理中');
    analysisProgress.value = 95;
    
    console.log('最终化分析结果...');
    
    // 尝试获取最终推荐结果
    try {
      console.log('获取推荐结果:', `/api/v1/career-recommendations?user_id=${userId}`);
      
      const resultResponseData = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/v1/career-recommendations?user_id=${userId}`);
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('无效的响应数据'));
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText
            });
          }
        };
        xhr.onerror = function() {
          reject({
            status: xhr.status,
            statusText: 'XMLHttpRequest Error',
            response: null
          });
        };
        xhr.send();
      });
      
      console.log('获取到推荐结果:', resultResponseData);
      
      // 检查数据有效性
      const recommendationData = resultResponseData?.data;
      if (recommendationData && Array.isArray(recommendationData.recommendations)) {
        console.log('推荐数据有效，将跳转到推荐页面');
        // 保存最近的推荐ID，以便在推荐页面中显示
        localStorage.setItem('latestRecommendationId', recommendationData.id || '');
      } else {
        console.warn('推荐数据无效或为空:', recommendationData);
      }
    } catch (error) {
      console.error('获取最终推荐结果失败:', error);
      ElMessage.warning('获取推荐结果失败，请稍后在"职业推荐"页面查看');
    }
    
    // 完成分析
    updateStepStatus('finalizing', '已完成');
    analysisProgress.value = 100;
    
    // 显示成功消息
    ElMessage.success('职业测评分析完成！');
    
    // 清理所有计时器
    cleanupTimers();
    
    // 短暂延迟后跳转到推荐页面
    setTimeout(() => {
      isAnalyzing.value = false;
      router.push('/career-recommend');
    }, 1500);
    
  } catch (finalError) {
    console.error('完成分析过程失败:', finalError);
    ElMessage.error('完成分析时出错，请重试');
    cleanupTimers();
    isAnalyzing.value = false;
  }
};

// 清理所有计时器
const cleanupTimers = () => {
  // 清理分析计时器
  if (analyzeTimer.value) {
    clearInterval(analyzeTimer.value);
    analyzeTimer.value = null;
  }
  
  // 清理轮询计时器
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
  
  // 清理超时计时器
  if (timeoutTimer.value) {
    clearTimeout(timeoutTimer.value);
    timeoutTimer.value = null;
  }
};

// 格式化时间函数（秒转为分:秒格式）
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  } else if (activeStep.value > 0) {
    activeStep.value--
    currentQuestionIndex.value = questions[activeStep.value].items.length - 1
  }
}

// 计算总分
const calculateOverallScore = () => {
  const values = Object.values(answers)
  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round((total / (values.length * 5)) * 100)
}

// 确定职业方向
const determineCareerDirection = () => {
  // 根据答案分析职业倾向
  const interests = questions[0].items.map(q => answers[q.id] || 0)
  const abilities = questions[1].items.map(q => answers[q.id] || 0)
  
  // 简单示例：根据得分判断职业方向
  const totalInterest = interests.reduce((sum, score) => sum + score, 0)
  const totalAbility = abilities.reduce((sum, score) => sum + score, 0)
  
  if (totalInterest > 12 && totalAbility > 12) return '软件开发工程师'
  if (totalInterest > 12) return '产品经理'
  if (totalAbility > 12) return '系统架构师'
  return '技术支持工程师'
}

// 计算匹配度
const calculateMatchDegree = () => {
  const values = Object.values(answers)
  const total = values.reduce((sum, value) => sum + value, 0)
  const matchPercentage = Math.round((total / (values.length * 5)) * 100)
  return matchPercentage
}

// 分析特征
const analyzeCharacteristics = () => {
  const characteristics = []
  
  // 分析逻辑思维能力
  if ((answers[1] || 0) > 3 && (answers[5] || 0) > 3) {
    characteristics.push('逻辑思维能力强')
  }
  
  // 分析学习能力
  if ((answers[4] || 0) > 3) {
    characteristics.push('学习能力出色')
  }
  
  // 分析团队协作
  if ((answers[3] || 0) > 3 && (answers[7] || 0) > 3) {
    characteristics.push('善于团队协作')
  }
  
  return characteristics
}

// 分析兴趣维度
const analyzeInterest = () => {
  const interestScores = questions[0].items.map(q => answers[q.id] || 0)
  const score = Math.round((interestScores.reduce((sum, score) => sum + score, 0) / (interestScores.length * 5)) * 100)
  
  return {
    score,
    highlights: ['技术创新', '问题解决', '持续学习'],
    careers: ['软件工程师', '系统架构师', '技术主管']
  }
}

// 分析能力维度
const analyzeAbility = () => {
  const abilityScores = questions[1].items.map(q => answers[q.id] || 0)
  const score = Math.round((abilityScores.reduce((sum, score) => sum + score, 0) / (abilityScores.length * 5)) * 100)
  
  return {
    score,
    strengths: ['编程技能', '系统设计', '项目管理'],
    improvements: ['沟通表达', '时间管理']
  }
}

// 分析性格维度
const analyzePersonality = () => {
  const personalityScores = questions[2].items.map(q => answers[q.id] || 0)
  const score = Math.round((personalityScores.reduce((sum, score) => sum + score, 0) / (personalityScores.length * 5)) * 100)
  
  return {
    score,
    traits: ['逻辑性强', '注重细节', '善于合作'],
    suggestions: ['加强领导力培养', '提升沟通技巧']
  }
}

// 确定职业发展路径
const determineCareerPath = () => {
  return {
    current: '初级开发工程师',
    next: '高级开发工程师',
    future: '技术架构师',
    timeframe: '3-5年'
  }
}

// 修改提交函数
const handleSubmit = () => {
  try {
    console.log('开始提交测评...')
    
    // 检查是否有足够的问题被回答
    const answeredCount = Object.keys(answers).length
    if (answeredCount < 5) {
      ElMessage.warning('至少需要回答5个问题才能获得准确的职业推荐')
      return
    }
    
    // 开始分析流程
    startAnalysis()
  } catch (error) {
    console.error('提交测评失败:', error)
    ElMessage.error('提交测评时出错，请重试')
  }
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
            <el-icon><InfoFilled /></el-icon>
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
                <component :is="mode.icon" />
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
            <p>我们正在为您分析数据并生成个性化职业推荐，整个过程预计需要1-2分钟</p>
          </div>
          
          <div class="analysis-progress-container">
            <div class="main-progress">
            <el-progress 
                type="dashboard" 
                :percentage="Math.round(analysisProgress)" 
                :stroke-width="10"
                :status="analysisProgress >= 100 ? 'success' : ''"
              />
              <div class="progress-stats">
                <div class="time-stat">
                  <span class="stat-label">已处理时间</span>
                  <span class="stat-value">{{ formatTime(processStats.elapsedTime) }}</span>
                </div>
                <div class="progress-divider"></div>
                <div class="time-stat">
                  <span class="stat-label">预计剩余</span>
                  <span class="stat-value">{{ analysisProgress >= 100 ? '0:00' : '~1:00' }}</span>
                </div>
              </div>
          </div>
          
            <div class="processing-info">
              <div class="processing-stage">
                <span class="stage-label">当前阶段：</span>
                <span class="stage-value">{{ detailSteps[currentStep].title }}</span>
              </div>
              <div class="processing-details" v-if="processStats.stageInfo">
                {{ processStats.stageInfo }}
              </div>
            </div>
          </div>
          
          <div class="analysis-flow">
            <div class="flow-stages">
              <div 
                v-for="(step, index) in detailSteps" 
                :key="index" 
                class="flow-stage" 
                :class="{ 
                  'active': currentStep === index,
                  'completed': currentStep > index
                }"
              >
                <div class="stage-icon">
                  <el-icon v-if="currentStep > index"><Check /></el-icon>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="stage-content">
                  <div class="stage-header">
                    <div class="stage-title">{{ step.title }}</div>
                    <div class="stage-progress">{{ step.status === '已完成' ? '已完成' : '进行中' }}</div>
                  </div>
                  <div class="stage-description">{{ step.status === '已完成' ? '已完成' : '进行中' }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="result-footer">
            <div class="processing-filter">
              <div class="filter-title">分析进度</div>
              <div class="filter-visual">
                <div class="filter-stage">
                  <div class="filter-count">{{ analysisProgress }}%</div>
                  <div class="filter-label">已完成</div>
                </div>
              </div>
            </div>
            
            <el-alert
              type="info"
              :closable="false"
              show-icon
            >
              <template #title>
                <span class="tip-title">处理说明</span>
              </template>
              <div class="tip-content">
                {{ processStats.message }}
              </div>
            </el-alert>
          </div>
        </el-card>
      </div>
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
}

.analysis-content {
  max-width: 900px;
  width: 95%;
  position: relative;
  z-index: 1;
  animation: contentFadeIn 0.8s ease-out;
}

.result-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
</style>
