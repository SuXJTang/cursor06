<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AssessmentBanner from '../components/common/AssessmentBanner.vue'
import { ElMessage } from 'element-plus'
import { useRecommendationStore } from '@/stores/recommendation'

const router = useRouter()

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

// 确保分析状态默认为false，显示问题界面
const isAnalyzing = ref(false)

// 测评问题
const questions = reactive([
  {
    type: 'interest',
    title: '兴趣测评',
    items: [
      {
        id: 1,
        content: '我喜欢解决复杂的问题',
        options: [
          { label: '非常同意', value: 5 },
          { label: '比较同意', value: 4 },
          { label: '一般', value: 3 },
          { label: '比较不同意', value: 2 },
          { label: '非常不同意', value: 1 }
        ]
      },
      {
        id: 2,
        content: '我对创新和发明感兴趣',
        options: [
          { label: '非常同意', value: 5 },
          { label: '比较同意', value: 4 },
          { label: '一般', value: 3 },
          { label: '比较不同意', value: 2 },
          { label: '非常不同意', value: 1 }
        ]
      },
      {
        id: 3,
        content: '我喜欢与人交流和合作',
        options: [
          { label: '非常同意', value: 5 },
          { label: '比较同意', value: 4 },
          { label: '一般', value: 3 },
          { label: '比较不同意', value: 2 },
          { label: '非常不同意', value: 1 }
        ]
      }
    ]
  },
  {
    type: 'ability',
    title: '能力测评',
    items: [
      {
        id: 4,
        content: '我能够快速学习新技术',
        options: [
          { label: '非常擅长', value: 5 },
          { label: '比较擅长', value: 4 },
          { label: '一般', value: 3 },
          { label: '不太擅长', value: 2 },
          { label: '非常不擅长', value: 1 }
        ]
      },
      {
        id: 5,
        content: '我善于分析和解决问题',
        options: [
          { label: '非常擅长', value: 5 },
          { label: '比较擅长', value: 4 },
          { label: '一般', value: 3 },
          { label: '不太擅长', value: 2 },
          { label: '非常不擅长', value: 1 }
        ]
      },
      {
        id: 6,
        content: '我具备良好的沟通表达能力',
        options: [
          { label: '非常擅长', value: 5 },
          { label: '比较擅长', value: 4 },
          { label: '一般', value: 3 },
          { label: '不太擅长', value: 2 },
          { label: '非常不擅长', value: 1 }
        ]
      }
    ]
  },
  {
    type: 'personality',
    title: '性格测评',
    items: [
      {
        id: 7,
        content: '我倾向于在团队中担任领导角色',
        options: [
          { label: '完全符合', value: 5 },
          { label: '比较符合', value: 4 },
          { label: '一般', value: 3 },
          { label: '不太符合', value: 2 },
          { label: '完全不符合', value: 1 }
        ]
      },
      {
        id: 8,
        content: '我喜欢尝试新事物和接受挑战',
        options: [
          { label: '完全符合', value: 5 },
          { label: '比较符合', value: 4 },
          { label: '一般', value: 3 },
          { label: '不太符合', value: 2 },
          { label: '完全不符合', value: 1 }
        ]
      },
      {
        id: 9,
        content: '我做事情喜欢追求完美',
        options: [
          { label: '完全符合', value: 5 },
          { label: '比较符合', value: 4 },
          { label: '一般', value: 3 },
          { label: '不太符合', value: 2 },
          { label: '完全不符合', value: 1 }
        ]
      }
    ]
  }
])

// 答案
const answers = reactive<Record<string, number>>({})

// 分析状态
const currentStep = ref(0)
const analyzeSteps = [
  { title: '数据整理', desc: '正在整理您的测评答案...' },
  { title: '兴趣分析', desc: '分析您的职业兴趣倾向...' },
  { title: '能力评估', desc: '评估您的专业技能水平...' },
  { title: '职业匹配', desc: '寻找最适合您的职业方向...' },
  { title: '报告生成', desc: '生成个性化测评报告...' }
]

// 获取推荐store
const recommendationStore = useRecommendationStore()

// 模拟分析过程
const startAnalysis = async () => {
  isAnalyzing.value = true
  currentStep.value = 0
  
  try {
    // 模拟每个步骤的分析过程
    for (let i = 0; i < analyzeSteps.length; i++) {
      currentStep.value = i
      await new Promise(resolve => setTimeout(resolve, 1500)) // 每步等待1.5秒
    }
    
    // 计算测评结果
    const result = {
      id: `assessment-${Date.now()}`,
      timestamp: new Date().toISOString(),
      summary: {
        score: calculateOverallScore(),
        careerDirection: determineCareerDirection(),
        matchDegree: calculateMatchDegree(),
        characteristics: analyzeCharacteristics()
      },
      dimensions: {
        interest: analyzeInterest(),
        ability: analyzeAbility(),
        personality: analyzePersonality()
      },
      recommendedCareers: [
        {
          id: 1,
          title: determineCareerDirection(),
          matchDegree: parseInt(calculateMatchDegree()),
          skills: ['问题分析', '技术支持', '沟通能力', 'IT基础设施']
        },
        {
          id: 2,
          title: '系统运维工程师',
          matchDegree: 85,
          skills: ['系统运维', '网络管理', '故障排查']
        },
        {
          id: 3,
          title: '技术文档工程师',
          matchDegree: 78,
          skills: ['技术写作', '文档管理', '需求分析']
        }
      ]
    }
    
    // 保存结果到推荐store
    recommendationStore.saveAssessmentResult(result)
    
    // 分析完成后重置状态
    isAnalyzing.value = false
    
    // 跳转到报告页面并携带数据
    router.push({
      path: '/result',
      query: { assessmentId: result.id }
    })
  } catch (error) {
    console.error('分析过程出错:', error)
    isAnalyzing.value = false // 确保发生错误时也重置状态
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
const handleSubmit = async () => {
  await startAnalysis()
}

// 当前问题索引
const currentQuestionIndex = ref(0)

// 获取当前部分的所有问题
const getCurrentSectionQuestions = computed(() => {
  return questions[activeStep.value].items
})

// 获取当前问题
const currentQuestion = computed(() => {
  return getCurrentSectionQuestions.value[currentQuestionIndex.value]
})

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < getCurrentSectionQuestions.value.length - 1) {
    currentQuestionIndex.value++
  } else if (activeStep.value < steps.length - 1) {
    activeStep.value++
    currentQuestionIndex.value = 0
  } else {
    handleSubmit()
  }
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

// 获取当前进度
const getProgress = computed<number>(() => {
  const totalQuestions = questions.reduce((sum, section) => sum + section.items.length, 0)
  const answeredQuestions = Object.keys(answers).length
  return Math.round((answeredQuestions / totalQuestions) * 100)
})

// 获取某个部分的完成进度
const getSectionProgress = (sectionIndex: number) => {
  const sectionQuestions = questions[sectionIndex].items
  const answeredCount = sectionQuestions.filter(q => answers[q.id] !== undefined).length
  return Math.round((answeredCount / sectionQuestions.length) * 100)
}

// 获取部分进度条颜色
const getSectionColor = (sectionIndex: number) => {
  const progress = getSectionProgress(sectionIndex)
  if (progress === 100) return '#67C23A'
  if (progress > 50) return '#409EFF'
  if (progress > 0) return '#E6A23C'
  return '#909399'
}

// 获取预计剩余时间
const getEstimatedTime = () => {
  const totalQuestions = questions.reduce((sum, section) => sum + section.items.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const remainingQuestions = totalQuestions - answeredQuestions
  const minutesPerQuestion = 1 // 假设每题平均1分钟
  const remainingMinutes = remainingQuestions * minutesPerQuestion
  return remainingMinutes > 0 ? `${remainingMinutes} 分钟` : '即将完成'
}

// 判断是否为最后一题
const isLastQuestion = computed(() => {
  return activeStep.value === steps.length - 1 && 
         currentQuestionIndex.value === getCurrentSectionQuestions.value.length - 1
})

// 选择答案并自动跳转
const selectAnswer = (value: number) => {
  const questionId = currentQuestion.value.id
  // 如果已经选择了这个答案，不做任何操作
  if (answers[questionId] === value) {
    return
  }
  
  // 保存答案
  answers[questionId] = value
  
  // 延迟300ms后跳转，给用户一个视觉反馈的时间
  setTimeout(() => {
    // 如果不是最后一题，自动跳转到下一题
    if (!isLastQuestion.value) {
      nextQuestion()
    }
  }, 300)
}

// 获取提示信息
const getCurrentTip = () => {
  const tips = [
    "测评结果会根据您的回答生成个性化的职业推荐",
    "职业匹配度越高，表示您与该职业的适配性越好",
    "您的测评结果将被保存，随时可以重新查看",
    "测评结果会从兴趣、能力和价值观多维度分析",
    "我们的算法基于职业心理学理论，为您提供科学的职业指导"
  ];
      
  return tips[Math.floor(Math.random() * tips.length)];
}

const analysisProgress = computed(() => {
  if (currentStep.value >= analyzeSteps.length) {
    return 100;
  }
  return Math.round((currentStep.value / analyzeSteps.length) * 100);
})
</script>

<template>
  <div class="assessment-container">
    <!-- 使用Banner组件 -->
    <AssessmentBanner />

    <!-- 测评内容 -->
    <div v-if="!isAnalyzing" class="assessment-layout">
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
              <li>测评预计需要15-20分钟</li>
            </ul>
          </div>
        </el-card>
      </div>

      <!-- 中间主要内容 -->
      <div class="assessment-content">
        <div class="assessment-header">
          <div class="header-left">
            <h2>{{ questions[activeStep].title }}</h2>
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
            @click="nextQuestion"
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
            <h2>数据分析中</h2>
            <p>正在为您生成职业测评报告，请稍候...</p>
          </div>
          
          <div class="analysis-progress">
            <el-progress 
              type="circle" 
              :percentage="analysisProgress" 
              :stroke-width="8"
              :status="currentStep >= analyzeSteps.length ? 'success' : ''"
              :color="currentStep >= analyzeSteps.length ? '#67C23A' : '#409EFF'"
            />
          </div>
          
          <div class="analysis-steps">
            <el-steps 
              :active="currentStep" 
              finish-status="success"
              align-center
            >
              <el-step 
                v-for="(step, index) in analyzeSteps" 
                :key="index" 
                :title="step.title"
                :description="step.desc"
              />
            </el-steps>
          </div>
          
          <div class="result-footer">
            <el-alert
              type="info"
              :closable="false"
              show-icon
            >
              <template #title>
                <span class="tip-title">职业小贴士</span>
              </template>
              <div class="tip-content">{{ getCurrentTip() }}</div>
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
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.analysis-content {
  max-width: 800px;
  width: 90%;
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

.analysis-progress {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.analysis-steps {
  margin: 40px 0;
}

.result-footer {
  margin-top: 30px;
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
</style>
