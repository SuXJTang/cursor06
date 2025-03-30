<template>
  <div class="career-recommend-container">
    <el-card class="recommend-card">
      <template #header>
        <div class="card-header">
          <h2>职业推荐</h2>
          <div class="header-actions" v-if="hasAssessment">
            <!-- 删除顶部的重新测评按钮 -->
          </div>
        </div>
      </template>
      
      <div class="recommend-content">
        <!-- 无测评数据 -->
        <div v-if="!hasAssessment" class="no-data-section">
          <el-empty description="您还没有完成职业测评">
            <el-button type="primary" @click="goToNewAssessment">开始测评</el-button>
          </el-empty>
          
          <div class="feature-preview">
            <h3>测评后您将获得的信息</h3>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card class="feature-card">
                  <template #header>
                    <div class="feature-header">
                      <el-icon><DataAnalysis /></el-icon>
                      <span>个性化职业匹配</span>
                    </div>
                  </template>
                  <div class="feature-description">
                    基于您的个人简历和职业测评结果，智能推荐最适合您的职业方向和具体岗位。
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="8">
                <el-card class="feature-card">
                  <template #header>
                    <div class="feature-header">
                      <el-icon><PieChart /></el-icon>
                      <span>职业前景分析</span>
                    </div>
                  </template>
                  <div class="feature-description">
                    提供行业薪资水平、就业前景和发展趋势分析，帮助您做出明智的职业选择。
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="8">
                <el-card class="feature-card">
                  <template #header>
                    <div class="feature-header">
                      <el-icon><Connection /></el-icon>
                      <span>能力提升指南</span>
                    </div>
                  </template>
                  <div class="feature-description">
                    根据目标职业要求，为您提供个性化的能力提升建议和学习资源推荐。
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <!-- 有测评数据 -->
        <div v-else class="has-data-section">
          <!-- 标题：历史测评结果 -->
          <div class="section-title">
            <h3>历史测评结果</h3>
          </div>
          
          <!-- 测评结果卡片列表 -->
          <div class="assessment-cards-container">
            <div class="assessment-list">
              <el-card 
                v-for="assessment in sortedAssessmentResults" 
                :key="assessment.id"
                class="assessment-card" 
                shadow="hover"
              >
                <div class="assessment-card-header">
                  <el-tag type="info" size="small" effect="plain" class="assessment-time-tag">
                    {{ formatAssessmentTime(assessment.timestamp) }}
                  </el-tag>
                  <div class="assessment-card-actions">
                    <el-button type="primary" size="small" @click.stop="viewAssessmentDetail(assessment.id)">
                      查看详情
                    </el-button>
                  </div>
                </div>

                <div class="three-careers-layout">
                  <!-- 左侧：最佳匹配职业 -->
                  <div class="best-career-container" @click="viewCareerDetail(assessment.recommendedCareers[0])">
                    <div class="career-header">
                      <h4 class="career-title">{{ assessment.recommendedCareers[0].title }}</h4>
                      <div class="career-match">
                        <div class="match-rank">最匹配</div>
                        <el-tag type="success" size="small" class="match-tag">
                          匹配度 {{ assessment.recommendedCareers[0].matchDegree }}%
                        </el-tag>
                      </div>
                    </div>
                    
                    <div class="career-desc">{{ assessment.recommendedCareers[0].description?.substring(0, 80) || getDefaultDescription(assessment.recommendedCareers[0].title).substring(0, 80) }}...</div>
                    
                    <div class="career-skills">
                      <el-tag 
                        v-for="skill in assessment.recommendedCareers[0].skills.slice(0, 5)" 
                        :key="skill"
                        size="small"
                        effect="plain"
                        class="skill-tag"
                      >
                        {{ skill }}
                      </el-tag>
                    </div>
                  </div>
                  
                  <!-- 右侧：第二和第三匹配职业 -->
                  <div class="other-careers-container">
                    <!-- 第二匹配职业 -->
                    <div 
                      v-if="assessment.recommendedCareers.length > 1" 
                      class="other-career-item"
                      @click="viewCareerDetail(assessment.recommendedCareers[1])"
                    >
                      <div class="other-career-header">
                        <h5>{{ assessment.recommendedCareers[1].title }}</h5>
                        <div class="other-career-match">
                          <div class="match-rank-small">第2匹配</div>
                          <el-tag 
                            :type="getMatchRateType(assessment.recommendedCareers[1].matchDegree)" 
                            size="small"
                            class="match-tag-small"
                          >
                            {{ assessment.recommendedCareers[1].matchDegree }}%
                          </el-tag>
                        </div>
                      </div>
                      
                      <div class="other-career-skills">
                        <el-tag 
                          v-for="skill in assessment.recommendedCareers[1].skills.slice(0, 3)" 
                          :key="skill"
                          size="small"
                          effect="light"
                          class="skill-tag-mini"
                        >
                          {{ skill }}
                        </el-tag>
                      </div>
                    </div>
                    
                    <!-- 第三匹配职业 -->
                    <div 
                      v-if="assessment.recommendedCareers.length > 2" 
                      class="other-career-item"
                      @click="viewCareerDetail(assessment.recommendedCareers[2])"
                    >
                      <div class="other-career-header">
                        <h5>{{ assessment.recommendedCareers[2].title }}</h5>
                        <div class="other-career-match">
                          <div class="match-rank-small">第3匹配</div>
                          <el-tag 
                            :type="getMatchRateType(assessment.recommendedCareers[2].matchDegree)" 
                            size="small"
                            class="match-tag-small"
                          >
                            {{ assessment.recommendedCareers[2].matchDegree }}%
                          </el-tag>
                        </div>
                      </div>
                      
                      <div class="other-career-skills">
                        <el-tag 
                          v-for="skill in assessment.recommendedCareers[2].skills.slice(0, 3)" 
                          :key="skill"
                          size="small"
                          effect="light"
                          class="skill-tag-mini"
                        >
                          {{ skill }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DataAnalysis, PieChart, Connection, Trophy } from '@element-plus/icons-vue'
import { useRecommendationStore } from '@/stores/recommendation'
import { getRecommendationProgress } from '@/api/career'

const router = useRouter()
const recommendationStore = useRecommendationStore()
const loading = ref(false)
const polling = ref(false)
const currentProgress = ref(0)
const progressMessage = ref('')

// 所有测评结果
const assessmentResults = computed(() => {
  return recommendationStore.assessmentResults
})

// 选中的测评ID
const selectedAssessmentId = ref('')

// 是否有测评数据
const hasAssessment = computed(() => {
  return recommendationStore.hasAssessmentResults && 
         recommendationStore.assessmentResults.length > 0
})

// 获取选中的测评结果
const selectedAssessment = computed(() => {
  if (!selectedAssessmentId.value) {
    return recommendationStore.latestAssessmentResult
  }
  
  return assessmentResults.value.find(a => a.id === selectedAssessmentId.value) || 
         recommendationStore.latestAssessmentResult
})

// 初始化选中的测评ID
onMounted(async () => {
  loading.value = true
  
  try {
    // 获取用户ID
    const userId = localStorage.getItem('userId') || '1'
    
    // 加载最新推荐数据
    const result = await recommendationStore.fetchRecommendationsFromApi(userId)
    
    if (result) {
      // 有结果则更新选中的ID
      if (result.id) {
        selectedAssessmentId.value = result.id
        console.log('已选择最新的推荐结果:', result.id)
      } else if (result.status === 'processing') {
        // 推荐还在生成中，需要轮询
        console.log('推荐生成中，进度:', result.progress)
        startPolling(userId)
      }
    } else if (recommendationStore.latestAssessmentResult) {
      // 使用store中已有的最新测评结果
      selectedAssessmentId.value = recommendationStore.latestAssessmentResult.id
      console.log('使用本地存储的最新推荐结果:', selectedAssessmentId.value)
    }
  } catch (err) {
    console.error('加载推荐数据失败:', err)
    ElMessage.error('加载推荐数据失败，将显示本地缓存数据')
  } finally {
    loading.value = false
  }
})

// 轮询获取推荐进度
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)
const pollingCount = ref(0)
const maxPollingCount = 30 // 最多轮询30次，避免无限轮询

// 开始轮询
const startPolling = (userId: string | number) => {
  // 清除可能存在的定时器
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }
  
  pollingCount.value = 0
  polling.value = true
  
  // 每5秒查询一次进度
  pollingInterval.value = setInterval(async () => {
    pollingCount.value++
    
    // 超过最大轮询次数，停止轮询
    if (pollingCount.value > maxPollingCount) {
      stopPolling()
      ElMessage.warning('推荐生成超时，请稍后刷新页面查看')
      return
    }
    
    try {
      // 获取推荐进度
      const progress = await getRecommendationProgress(userId)
      console.log('轮询获取推荐进度:', progress)
      
      // 更新进度信息
      currentProgress.value = progress.progress || 0
      progressMessage.value = progress.message || '推荐生成中...'
      
      // 如果已完成，获取结果并停止轮询
      if (progress.status === 'completed') {
        const result = await recommendationStore.fetchRecommendationsFromApi(userId)
        if (result && result.id) {
          selectedAssessmentId.value = result.id
          ElMessage.success('推荐生成完成')
        }
        stopPolling()
      }
    } catch (err) {
      console.error('获取推荐进度失败:', err)
      // 错误次数过多则停止轮询
      if (pollingCount.value > 5) {
        stopPolling()
        ElMessage.error('获取推荐进度失败，请刷新页面重试')
      }
    }
  }, 5000) // 5秒轮询一次
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  polling.value = false
}

// 格式化测评结果选项标签
const formatAssessmentLabel = (assessment) => {
  if (!assessment || !assessment.timestamp) return '未知测评'
  
  try {
    const date = new Date(assessment.timestamp)
    const dateStr = date.toLocaleDateString('zh-CN')
    const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    
    const directionText = assessment.summary?.careerDirection || '职业方向'
    return `${dateStr} ${timeStr} (${directionText})`
  } catch (err) {
    console.error('格式化测评标签失败:', err)
    return '未知测评'
  }
}

// 格式化测评日期
const formattedTestDate = computed(() => {
  if (!selectedAssessment.value?.timestamp) return '未知时间'
  
  try {
    const date = new Date(selectedAssessment.value.timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (err) {
    console.error('日期格式化失败:', err)
    return '未知时间'
  }
})

// 获取推荐职业列表
const recommendedCareers = computed(() => {
  if (!selectedAssessment.value) return []
  
  const careers = selectedAssessment.value.recommendedCareers || []
  return careers
})

// 收藏职业列表
const favoritesCareers = ref([])

// 检查职业是否已收藏
const isInFavorites = (career) => {
  return favoritesCareers.value.includes(Number(career.id))
}

// 添加职业到收藏
const addToFavorites = (career) => {
  if (isInFavorites(career)) return
  
  favoritesCareers.value.push(Number(career.id))
  localStorage.setItem('favorite_careers', JSON.stringify(favoritesCareers.value))
  ElMessage.success(`已将 ${career.title} 添加到收藏`)
}

// 获取匹配度标签类型
const getMatchRateType = (rate) => {
  if (rate >= 85) return 'success'
  if (rate >= 70) return 'primary'
  if (rate >= 60) return 'warning'
  return 'info'
}

// 获取默认职业描述
const getDefaultDescription = (title) => {
  return `${title}是一个极具发展前景的职业，根据您的测评结果，这个职业与您的特质和能力高度匹配，您在这一领域有很大的发展潜力。`
}

// 查看职业详情
const viewCareerDetail = (career) => {
  router.push({
    path: '/career-detail',
    query: { id: career.id }
  })
}

// 跳转到职业测评
const goToNewAssessment = () => {
  router.push('/assessment')
}

// 查看完整测评报告
const goToAssessmentResult = () => {
  if (selectedAssessment.value?.id) {
    router.push({
      path: '/result',
      query: { assessmentId: selectedAssessment.value.id }
    })
  } else {
    ElMessage.warning('未找到测评报告')
  }
}

// 加载收藏职业列表
onMounted(() => {
  const savedFavorites = localStorage.getItem('favorite_careers')
  if (savedFavorites) {
    try {
      favoritesCareers.value = JSON.parse(savedFavorites)
    } catch (err) {
      console.error('加载收藏职业失败:', err)
    }
  }
})

// 按时间排序的测评结果
const sortedAssessmentResults = computed(() => {
  return [...assessmentResults.value].sort((a, b) => {
    const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timestampB - timestampA; // 降序排列，最新的在前
  });
});

// 格式化测评时间
const formatAssessmentTime = (timestamp) => {
  if (!timestamp) return '未知时间';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    console.error('格式化时间失败:', err);
    return '未知时间';
  }
};

// 选择一个测评结果
const selectAssessment = (assessmentId) => {
  selectedAssessmentId.value = assessmentId;
  router.push({
    path: '/career-detail',
    query: { assessmentId }
  });
};

// 查看测评详情
const viewAssessmentDetail = (assessmentId) => {
  router.push({
    path: '/result',
    query: { assessmentId }
  });
};
</script>

<style scoped>
.career-recommend-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.recommend-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommend-content {
  padding: 20px 0;
}

/* 无数据样式 */
.no-data-section {
  text-align: center;
  padding: 20px 0;
}

.feature-preview {
  margin-top: 40px;
  text-align: left;
}

.feature-preview h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #555;
  border-left: 4px solid #409eff;
  padding-left: 10px;
  text-align: left;
}

.feature-card {
  height: 100%;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-header {
  display: flex;
  align-items: center;
}

.feature-header .el-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #409eff;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

/* 有数据样式 - 单卡片多职业布局 */
.all-careers-card {
  margin-bottom: 30px;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.career-item {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  border: 2px solid transparent;
  padding: 10px;
}

.career-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
}

.career-item.best-match {
  border-color: #f56c6c;
  background-color: #fff9f9;
}

.career-item:nth-child(3) {
  border-color: #e6a23c;
  background-color: #fdf6ec;
}

.career-item:nth-child(5) {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.career-box-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 5px;
}

.career-info-side {
  flex: 1;
  padding-right: 15px;
}

.career-match-side {
  flex: 0 0 auto;
  text-align: right;
}

.match-tag {
  font-weight: bold;
  padding: 4px 8px;
}

.match-tag-small {
  font-weight: bold;
  padding: 2px 6px;
}

.career-title h4 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: #303133;
}

.career-description, .career-desc {
  margin: 5px 0;
  color: #606266;
  line-height: 1.5;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.career-skills-section {
  display: flex;
  align-items: flex-start;
  margin: 10px 0 5px;
  padding-top: 5px;
  border-top: 1px dashed #ebeef5;
}

.career-skills-section.small {
  margin: 5px 0;
}

.skills-label {
  font-weight: bold;
  margin-right: 8px;
  color: #606266;
  white-space: nowrap;
  font-size: 14px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
}

.skill-tag {
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}

.match-rank {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 10px;
  text-align: right;
}

.assessment-info {
  margin-top: 30px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.section-title {
  margin-bottom: 20px;
}

.section-title h3 {
  font-size: 18px;
  color: #303133;
  border-left: 4px solid #67c23a;
  padding-left: 10px;
  margin: 0;
}

/* 测评卡片样式 */
.assessment-cards-container {
  margin-bottom: 30px;
}

.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.assessment-card {
  width: 100%;
  transition: all 0.3s;
  cursor: default;
  border-radius: 10px;
  border-left: 5px solid #409eff;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.assessment-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.assessment-card:nth-child(3n+1) {
  border-left-color: #67c23a;
}

.assessment-card:nth-child(3n+2) {
  border-left-color: #e6a23c;
}

.assessment-card:nth-child(3n+3) {
  border-left-color: #409eff;
}

.assessment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.assessment-time-tag {
  margin-right: 10px;
  font-weight: 500;
  background-color: #f2f6fc;
  color: #606266;
  border: none;
}

.three-careers-layout {
  display: flex;
  gap: 15px;
}

.best-career-container {
  flex: 3;
  padding: 15px;
  border-radius: 8px;
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  cursor: pointer;
  transition: all 0.3s;
}

.best-career-container:hover {
  background-color: #e1f3d8;
  border-color: #c2e7b0;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.other-careers-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.other-career-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.other-career-item:nth-child(1) {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
}

.other-career-item:nth-child(2) {
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
}

.other-career-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.other-career-item:nth-child(1):hover {
  background-color: #faecd8;
  border-color: #f5dab1;
}

.other-career-item:nth-child(2):hover {
  background-color: #d9ecff;
  border-color: #b3d8ff;
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.career-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}

.career-match {
  text-align: right;
}

.match-rank {
  font-size: 14px;
  font-weight: bold;
  color: #67c23a;
  margin-bottom: 5px;
}

.match-rank-small {
  font-size: 12px;
  font-weight: bold;
  color: #e6a23c;
  margin-bottom: 3px;
}

.match-tag {
  font-weight: bold;
  padding: 4px 8px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.match-tag-small {
  font-weight: bold;
  padding: 2px 6px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.career-desc {
  margin: 10px 0;
  color: #606266;
  line-height: 1.5;
  font-size: 14px;
}

.career-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.other-career-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.other-career-header h5 {
  margin: 0;
  font-size: 14px;
  color: #303133;
  font-weight: bold;
}

.other-career-match {
  text-align: right;
}

.other-career-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.skill-tag {
  margin: 0;
  font-size: 12px;
  background-color: #f5f7fa;
  color: #409eff;
  border-color: #e4e7ed;
  transition: all 0.2s;
}

.skill-tag:hover {
  transform: scale(1.05);
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}

.skill-tag-mini {
  margin: 0;
  font-size: 11px;
  background-color: rgba(255, 255, 255, 0.6);
  border-color: transparent;
  transition: all 0.2s;
}

.skill-tag-mini:hover {
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .three-careers-layout {
    flex-direction: column;
  }
  
  .best-career-container {
    margin-bottom: 10px;
  }
}
</style> 