<template>
  <div class="result-container">
    <div class="result-content">
      <!-- 左侧内容 -->
      <div class="left-panel">
        <div class="score-card">
          <div class="score-header">
            <h2>职业匹配度</h2>
          </div>
          <div class="score-display">
            <div class="score-circle">
              <svg viewBox="0 0 100 100">
                <circle class="score-circle-bg" cx="50" cy="50" r="45" />
                <circle class="score-circle-progress" cx="50" cy="50" r="45" />
                <text x="50" y="45" class="score-text">{{ score }}</text>
                <text x="50" y="65" class="score-label">分</text>
              </svg>
            </div>
          </div>
        </div>
        <div class="career-info">
          <h3>最适合的职业方向</h3>
          <div class="career-card">
            <div class="career-icon">
              <el-icon size="32"><Briefcase /></el-icon>
            </div>
            <div class="career-details">
              <h4>{{ bestCareer.title }}</h4>
              <div class="match-rate">匹配度 {{ bestCareer.matchRate }}%</div>
              <div class="career-tags">
                <el-tag v-for="skill in bestCareer.skills" :key="skill">{{ skill }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <div class="other-careers">
          <h3>其他推荐职业</h3>
          <div class="career-list">
            <div v-for="career in otherCareers" :key="career.title" class="career-item">
              <div class="career-item-header">
                <h4>{{ career.title }}</h4>
                <span class="match-badge">{{ career.matchRate }}%</span>
              </div>
              <div class="career-item-content">
                <p class="career-description">{{ career.description }}</p>
                <div class="career-tags">
                  <el-tag v-for="skill in career.skills" :key="skill" size="small">{{ skill }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-footer">
      <el-button type="primary" @click="downloadReport">下载完整报告</el-button>
      <el-button @click="backToHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Briefcase } from '@element-plus/icons-vue'

const router = useRouter()
const score = ref(0)

onMounted(() => {
  // 添加动画效果，让分数从0增长到88
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
})

const bestCareer = ref({
  title: '技术支持工程师',
  matchRate: 92,
  skills: ['问题分析', '技术支持', '沟通能力', 'IT基础设施']
})

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

const downloadReport = () => {
  // 实现下载报告功能
  console.log('下载报告')
}

const backToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  background: #141c2f;
  padding: 32px;
}

.result-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* 左侧面板样式 */
.left-panel {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: fit-content;
  position: sticky;
  top: 32px;
}

.score-card {
  position: relative;
  padding: 24px;
  color: white;
  overflow: hidden;
}

.score-header h2 {
  margin: 0 0 32px 0;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
}

.score-display {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.score-circle {
  width: 100%;
  height: 100%;
  position: relative;
}

.score-circle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.score-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(180deg);
}

.score-circle-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 6;
}

.score-circle-progress {
  fill: none;
  stroke: #3bf4fb;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: calc(283 - (283 * (100 - v-bind('score'))) / 100);
  filter: drop-shadow(0 0 6px rgba(59, 244, 251, 0.5));
  transition: stroke-dashoffset 1.5s ease;
}

.score-text {
  fill: white;
  font-size: 36px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transform: translateY(-6px) rotate(180deg);
}

.score-label {
  fill: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-anchor: middle;
  dominant-baseline: central;
  transform: translateY(16px) rotate(180deg);
}

.career-info {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.career-info h3 {
  margin: 0 0 24px 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  letter-spacing: 1px;
}

.career-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.career-card:hover {
  border-color: #3bf4fb;
  box-shadow: 0 0 20px rgba(59, 244, 251, 0.1);
}

.career-icon {
  width: 48px;
  height: 48px;
  background: rgba(59, 244, 251, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3bf4fb;
  margin-bottom: 20px;
}

.career-details h4 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.match-rate {
  color: #3bf4fb;
  font-weight: 500;
  margin-bottom: 16px;
  font-size: 14px;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.career-tags .el-tag {
  background: rgba(59, 244, 251, 0.1);
  color: #3bf4fb;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

/* 右侧面板样式 */
.right-panel {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
}

.right-panel h3 {
  margin: 0 0 24px 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.right-panel h3::before {
  content: '';
  display: block;
  width: 3px;
  height: 16px;
  background: #3bf4fb;
  border-radius: 2px;
}

.career-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.career-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.career-item:hover {
  border-color: #3bf4fb;
  box-shadow: 0 0 20px rgba(59, 244, 251, 0.1);
}

.career-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.career-item-header h4 {
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.match-badge {
  background: rgba(59, 244, 251, 0.1);
  color: #3bf4fb;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.career-description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px 0;
  line-height: 1.6;
  font-size: 14px;
}

.result-footer {
  max-width: 1200px;
  margin: 32px auto 0;
  text-align: center;
}

.result-footer .el-button {
  margin: 0 8px;
  height: 40px;
  font-size: 14px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.result-footer .el-button--primary {
  background: rgba(59, 244, 251, 0.1);
  border-color: #3bf4fb;
  color: #3bf4fb;
}

.result-footer .el-button--primary:hover {
  background: rgba(59, 244, 251, 0.2);
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

.result-content {
  animation: appear 0.5s ease-out forwards;
}
</style>