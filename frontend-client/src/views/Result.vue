<template>
  <div class="result-container">
      <div class="report-header">
      <h2>个人职业测评报告</h2>
      <p class="subtitle">根据您的回答，我们为您生成了详细的职业能力分析报告</p>
    </div>
    
    <div class="result-content">
      <!-- 左侧内容 -->
      <div class="left-panel">
        <el-card class="score-card">
          <template #header>
            <div class="card-header">
              <h3>职业匹配度</h3>
            </div>
          </template>
          <div class="score-display">
            <el-progress 
              type="dashboard" 
              :percentage="score" 
              :stroke-width="16"
              :width="160"
              :show-text="false"
              :color="progressColor"
            ></el-progress>
            <div class="score-text">
              <div class="score-number">{{ score }}</div>
              <div class="score-label">分</div>
            </div>
          </div>
        </el-card>
        <el-card class="career-info">
          <template #header>
            <div class="card-header">
              <h3>最适合的职业方向</h3>
            </div>
          </template>
          <div class="career-content">
            <div class="best-career-header">
              <div class="career-icon">
                <el-icon size="24">
                  <Briefcase />
                </el-icon>
              </div>
              <div>
                <h4>{{ bestCareer.title }}</h4>
                <div class="match-rate">
                  匹配度 <span class="highlight">{{ bestCareer.matchRate }}%</span>
                </div>
              </div>
            </div>
            <div class="career-tags">
              <el-tag 
                v-for="skill in bestCareer.skills" 
                :key="skill"
                class="skill-tag"
                type="primary"
                effect="light"
                size="small"
              >
                {{ skill }}
              </el-tag>
            </div>
          </div>
        </el-card>
        
        <!-- 性格特质分析 -->
        <el-card class="personality-analysis">
          <template #header>
            <div class="card-header">
              <h3>性格特质分析</h3>
            </div>
          </template>
          <div class="personality-content">
            <div v-for="trait in personalityTraits" :key="trait.name" class="trait-item">
              <div class="trait-header">
                <span class="trait-name">{{ trait.name }}</span>
                <span class="trait-score">{{ trait.score }}%</span>
              </div>
              <el-progress 
                :percentage="trait.score" 
                :color="trait.color"
                :stroke-width="8"
                :show-text="false"
              ></el-progress>
            </div>
            <div class="trait-summary">
              <p>{{ personalitySummary }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <!-- 兴趣偏好分析 -->
        <el-card class="interest-analysis">
          <template #header>
            <div class="card-header">
              <h3>兴趣偏好分析</h3>
            </div>
          </template>
          <div class="interest-content">
            <div class="interest-chart">
              <el-row :gutter="20">
                <el-col :span="12" v-for="interest in interests" :key="interest.category">
                  <div class="interest-item">
                    <div class="interest-label">
                      <span class="interest-icon" :style="{backgroundColor: interest.color}">
                        <el-icon><component :is="interest.icon" /></el-icon>
                      </span>
                      <span>{{ interest.category }}</span>
                    </div>
                    <div class="interest-bar-wrapper">
                      <div class="interest-bar" :style="{width: interest.score + '%', backgroundColor: interest.color}"></div>
                      <span class="interest-value">{{ interest.score }}%</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <p class="interest-description">{{ interestSummary }}</p>
          </div>
        </el-card>
        
        <!-- 能力倾向分析 -->
        <el-card class="ability-analysis">
          <template #header>
            <div class="card-header">
              <h3>能力倾向分析</h3>
            </div>
          </template>
          <div class="ability-content">
            <el-row :gutter="20">
              <el-col :span="8" v-for="ability in abilities" :key="ability.name">
                <div class="ability-item">
                  <el-progress type="circle" 
                    :percentage="ability.score" 
                    :color="ability.color"
                    :width="100"
                  ></el-progress>
                  <div class="ability-name">{{ ability.name }}</div>
                </div>
              </el-col>
            </el-row>
            <div class="ability-summary">
              <p>{{ abilitySummary }}</p>
            </div>
          </div>
        </el-card>
        
        <!-- 其他推荐职业 -->
        <el-card class="other-careers">
          <template #header>
            <div class="card-header">
              <h3>其他推荐职业</h3>
            </div>
          </template>
          <div class="career-list">
            <el-card 
              v-for="career in otherCareers" 
              :key="career.title" 
              class="career-item"
              shadow="hover"
            >
              <div class="career-item-header">
                <h4>{{ career.title }}</h4>
                <el-tag type="primary" effect="plain" size="small" class="match-badge">
                  {{ career.matchRate }}%
                </el-tag>
              </div>
              <div class="career-item-content">
                <p class="career-description">
                  {{ career.description }}
                </p>
                <div class="career-tags">
                  <el-tag 
                    v-for="skill in career.skills" 
                    :key="skill" 
                    size="small"
                    class="skill-tag"
                    effect="light"
                  >
                    {{ skill }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </div>
        </el-card>
      </div>
    </div>

    <div class="result-footer">
      <el-button type="primary" @click="downloadReport">
        下载完整报告
      </el-button>
      <el-button type="success" @click="goToFeedback">
        提交反馈
      </el-button>
      <el-button @click="backToHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Briefcase, Reading, DataLine, Opportunity, Pointer, Suitcase, Trophy, Monitor } from '@element-plus/icons-vue'
import { useRecommendationStore } from '@/stores/recommendation'

const router = useRouter()
const route = useRoute()
const score = ref(0)
const recommendationStore = useRecommendationStore() // 使用推荐store

// 根据路由参数获取测评结果
const assessmentId = computed(() => {
  return route.query.assessmentId || ''
})

// 根据分数计算进度条颜色
const progressColor = computed(() => {
  if (score.value >= 90) return '#67c23a'
  if (score.value >= 70) return '#409eff'
  if (score.value >= 50) return '#e6a23c'
  return '#f56c6c'
})

// 从store获取测评结果
onMounted(() => {
  if (assessmentId.value) {
    // 从store中查找对应ID的测评结果
    const assessment = recommendationStore.assessmentResults.find(
      result => result.id === assessmentId.value
    )
    
    if (assessment) {
      // 设置当前测评结果
      recommendationStore.currentAssessmentResult = assessment
      
      // 设置分数
      score.value = assessment.summary?.score || 88
      
      // 从assessment中获取推荐职业
      if (assessment.recommendedCareers && assessment.recommendedCareers.length > 0) {
        bestCareer.value = {
          title: assessment.recommendedCareers[0].title,
          matchRate: assessment.recommendedCareers[0].matchDegree,
          skills: assessment.recommendedCareers[0].skills || ['问题分析', '技术支持', '沟通能力', 'IT基础设施']
        }
        
        // 设置其他推荐职业
        if (assessment.recommendedCareers.length > 1) {
          otherCareers.value = assessment.recommendedCareers.slice(1).map(career => ({
            title: career.title,
            matchRate: career.matchDegree,
            description: career.description || `${career.title}负责相关工作，需要掌握多种技能。`,
            skills: career.skills || []
          }))
        }
      }
    } else {
      // 未找到对应测评结果，使用动画效果
      animateScore()
    }
  } else {
    // 没有提供测评ID，使用动画效果
    animateScore()
  }
})

// 分数动画效果
const animateScore = () => {
  let currentScore = 0
  const targetScore = 88
  const duration = 1500 // 1.5秒
  const interval = 16 // 约60fps
  const steps = duration / interval
  const increment = targetScore / steps

  const timer = setInterval(() => {
    currentScore += increment
    if (currentScore >= targetScore) {
      score.value = targetScore
      clearInterval(timer)
    } else {
      score.value = Math.round(currentScore)
    }
  }, interval)
}

// 最佳职业
const bestCareer = ref({
  title: '技术支持工程师',
  matchRate: 92,
  skills: ['问题分析', '技术支持', '沟通能力', 'IT基础设施']
})

// 其他推荐职业
const otherCareers = ref([
  {
    title: '系统运维工程师',
    matchRate: 85,
    description: '负责企业IT基础设施的运维和管理，确保系统稳定运行。',
    skills: ['系统运维', '网络管理', '故障排查']
  },
  {
    title: '技术文档工程师',
    matchRate: 78,
    description: '编写和维护技术文档，确保文档的准确性和可用性。',
    skills: ['技术写作', '文档管理', '需求分析']
  }
])

// 性格特质数据
const personalityTraits = ref([
  { name: '逻辑思考', score: 85, color: '#409eff' },
  { name: '协作能力', score: 76, color: '#67c23a' },
  { name: '细致认真', score: 92, color: '#409eff' },
  { name: '问题解决', score: 88, color: '#409eff' },
  { name: '适应性', score: 70, color: '#e6a23c' }
])
const personalitySummary = ref('您的性格特质表现出较强的逻辑思考能力和细致认真的工作态度，善于分析和解决问题。这与技术支持类工作所需的特质高度匹配。同时，您具备良好的协作能力，能够在团队中有效工作。')

// 兴趣偏好数据
const interests = ref([
  { category: '技术类', score: 86, color: '#409eff', icon: 'Monitor' },
  { category: '分析类', score: 75, color: '#67c23a', icon: 'DataLine' },
  { category: '教育类', score: 67, color: '#e6a23c', icon: 'Reading' },
  { category: '管理类', score: 42, color: '#909399', icon: 'Suitcase' }
])
const interestSummary = ref('您对技术和分析类工作展现出浓厚的兴趣，特别是在解决技术问题和提供技术支持方面。同时您也对知识传递和教育类工作有一定兴趣，这与技术支持和文档类工作的要求相吻合。')

// 能力倾向数据
const abilities = ref([
  { name: '技术理解力', score: 90, color: '#409eff' },
  { name: '沟通表达', score: 75, color: '#67c23a' },
  { name: '问题分析', score: 85, color: '#409eff' },
  { name: '学习适应力', score: 82, color: '#409eff' },
  { name: '团队协作', score: 70, color: '#e6a23c' },
  { name: '压力承受力', score: 78, color: '#67c23a' }
])
const abilitySummary = ref('您在技术理解和问题分析方面表现出色，能够快速理解技术概念并找到解决问题的方法。良好的沟通表达能力使您能够清晰地传达技术信息，这对技术支持工作尤为重要。您还具备较强的学习适应力，能够跟上技术的快速变化。')

const downloadReport = () => {
  // 实现下载报告功能
  console.log('下载报告')
}

const backToHome = () => {
  router.push('/')
}

// 跳转到反馈页面
const goToFeedback = () => {
  // 传递当前测评ID和推荐的职业ID作为参数
  const careerId = recommendationStore.currentAssessmentResult?.recommendedCareers?.[0]?.id || 'tech-support-engineer'
  
  router.push({
    path: '/feedback',
    query: {
      assessmentId: assessmentId.value,
      careerId: careerId
    }
  })
}
</script>

<style scoped>
.result-container {
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
  padding: 20px;
}

.report-header {
  max-width: 1000px;
  margin: 0 auto 20px;
  text-align: center;
  padding: 20px 0;
}

.report-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.subtitle {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

.result-content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  animation: appear 0.5s ease-out forwards;
}

/* 卡片通用样式 */
:deep(.el-card) {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-card__header) {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  font-weight: bold;
}

:deep(.el-card__body) {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

/* 左侧面板样式 */
.left-panel {
  display: flex;
  flex-direction: column;
}

.score-card {
  margin-bottom: 16px;
}

.score-display {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.score-text {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.career-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.best-career-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.career-icon {
  width: 40px;
  height: 40px;
  background-color: #ecf5ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  flex-shrink: 0;
}

.career-details h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.match-rate {
  margin-bottom: 0;
  font-size: 13px;
  color: #606266;
}

.match-rate .highlight {
  color: #409eff;
  font-weight: 600;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  border-radius: 4px;
}

/* 性格特质分析 */
.personality-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trait-item {
  margin-bottom: 12px;
}

.trait-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.trait-name {
  font-size: 14px;
  color: #606266;
}

.trait-score {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.trait-summary {
  margin-top: 16px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

/* 兴趣偏好分析 */
.interest-content {
  padding: 10px 0;
}

.interest-chart {
  margin-bottom: 16px;
}

.interest-item {
  margin-bottom: 16px;
}

.interest-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #303133;
}

.interest-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.interest-bar-wrapper {
  height: 10px;
  background-color: #f2f6fc;
  border-radius: 5px;
  position: relative;
}

.interest-bar {
  height: 100%;
  border-radius: 5px;
}

.interest-value {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: #606266;
  font-weight: 600;
}

.interest-description {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  margin: 10px 0 0;
}

/* 能力倾向分析 */
.ability-content {
  padding: 16px 0;
}

.ability-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.ability-name {
  margin-top: 8px;
  font-size: 14px;
  color: #303133;
  text-align: center;
}

.ability-summary {
  margin-top: 16px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

/* 右侧面板样式 */
.career-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.career-item {
  margin-bottom: 0 !important;
}

.career-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.match-badge {
  border-radius: 12px;
  font-weight: 500;
}

.career-description {
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.5;
  font-size: 13px;
}

.result-footer {
  max-width: 1000px;
  margin: 20px auto 0;
  text-align: center;
}

.result-footer .el-button {
  margin: 0 8px;
  height: 38px;
  font-size: 14px;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .result-content {
    grid-template-columns: 1fr;
  }
  
  .left-panel {
    position: static;
  }
}
</style>
