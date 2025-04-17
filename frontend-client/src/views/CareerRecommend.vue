<template>
  <div class="career-recommend-container">
    <div class="header-section">
      <h1 class="page-title">职业推荐</h1>
      <div class="action-buttons">
        <el-button type="primary" @click="generateNewRecommendation" :loading="loading">
          生成新推荐
        </el-button>
        <el-button @click="goToNewAssessment">去做测评</el-button>
      </div>
      <p class="page-description">
        基于您的职业测评结果，为您推荐最匹配的职业选择
      </p>
    </div>
    
    <!-- 推荐生成中状态 -->
    <div v-if="polling || !recommendedCareers.length" class="loading-section">
      <el-card class="recommendation-processing">
        <div class="processing-header">
          <h2>推荐生成中</h2>
          <el-button v-if="polling" size="small" @click="stopPolling">取消</el-button>
        </div>
        
        <!-- 使用新的推荐进度组件 -->
        <RecommendationProgress 
          v-if="sessionId" 
          :session-id="sessionId" 
          :user-id="userId" 
          @completed="handleRecommendationCompleted"
          @error="handleRecommendationError"
        />
        
        <!-- 替换之前的旧进度条 -->
        <div v-else>
          <el-progress 
            :percentage="currentProgress" 
            :stroke-width="18"
            :format="() => `${currentProgress}%`"
          ></el-progress>
          <div class="progress-message">{{ progressMessage }}</div>
        </div>
        
        <div class="note-section">
          <p>推荐生成过程包括：数据收集、职业匹配、智能分析和报告生成等步骤，预计需要30秒至2分钟</p>
        </div>
      </el-card>
    </div>
    
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DataAnalysis, PieChart, Connection, Trophy } from '@element-plus/icons-vue'
import { useRecommendationStore } from '@/stores/recommendation'
import { getRecommendationProgress, generateRecommendations } from '@/api/career_old'
import RecommendationProgress from '@/components/RecommendationProgress.vue'

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

// 添加会话ID
const sessionId = ref('')

// 获取用户ID
const userId = localStorage.getItem('userId') || '1'

// 初始化选中的测评ID
onMounted(async () => {
  try {
    loading.value = true
    console.log(`尝试加载用户${userId}的推荐数据`)
    
    // 尝试获取现有的推荐结果
    const result = await recommendationStore.fetchRecommendationsFromApi(userId)
    console.log('获取到推荐结果:', result)
    
    if (result) {
      // 有结果则更新选中的ID
      if (result.id) {
        selectedAssessmentId.value = result.id
        console.log('已选择最新的推荐结果:', result.id)
      } else if (result.status === 'processing') {
        // 推荐还在生成中
        console.log('推荐生成中，进度:', result.progress)
        
        // 设置会话ID用于WebSocket连接
        if (result.session_id) {
          sessionId.value = result.session_id
        } else {
          // 使用旧的轮询逻辑作为备选
          startPolling(userId)
        }
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

// 生成新的推荐
const generateNewRecommendation = async () => {
  try {
    loading.value = true
    
    // 清除旧的轮询
    stopPolling()
    
    // 调用API开始生成新的推荐
    const result = await generateRecommendations(userId, true)
    console.log('开始生成新推荐:', result)
    
    // 设置会话ID用于WebSocket连接
    if (result && result.session_id) {
      sessionId.value = result.session_id
      ElMessage.success('已开始生成新的职业推荐')
    } else {
      // 使用旧的轮询逻辑作为备选
      startPolling(userId)
    }
    
  } catch (err) {
    console.error('生成新推荐失败:', err)
    ElMessage.error('生成新推荐失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 推荐完成回调
const handleRecommendationCompleted = async () => {
  try {
    // 获取结果
    const result = await recommendationStore.fetchRecommendationsFromApi(userId)
    if (result && result.id) {
      selectedAssessmentId.value = result.id
      ElMessage.success('推荐生成完成')
    }
    stopPolling()
  } catch (err) {
    console.error('获取推荐结果失败:', err)
    ElMessage.warning('推荐生成完成，但获取结果失败，请刷新页面')
  }
}

// 推荐错误回调
const handleRecommendationError = (message: string) => {
  ElMessage.error(`推荐生成失败: ${message}`)
  stopPolling()
}
</script>

<style scoped lang="scss">
.career-recommend-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  .header-section {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    
    .page-title {
      font-size: 28px;
      color: #303133;
      margin-bottom: 8px;
    }
    
    .action-buttons {
      display: flex;
      margin-bottom: 16px;
      gap: 12px;
    }
    
    .page-description {
      color: #606266;
      font-size: 16px;
      margin-bottom: 16px;
    }
  }
  
  .loading-section {
    margin-bottom: 24px;
    
    .recommendation-processing {
      .processing-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        h2 {
          margin: 0;
          font-size: 20px;
          color: #303133;
        }
      }
      
      .progress-message {
        margin-top: 8px;
        margin-bottom: 16px;
        color: #606266;
        text-align: center;
      }
      
      .note-section {
        margin-top: 16px;
        font-size: 14px;
        color: #909399;
        background-color: #f9f9f9;
        padding: 12px;
        border-radius: 4px;
        
        p {
          margin: 0;
        }
      }
    }
  }
  
  .recommend-card {
    margin-bottom: 24px;
    
    .select-label {
      font-size: 16px;
      margin-bottom: 8px;
      color: #606266;
    }
    
    .assessment-select {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .test-info {
      margin-bottom: 16px;
      
      .info-item {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        
        .icon-wrapper {
          margin-right: 8px;
        }
        
        .info-label {
          color: #909399;
          margin-right: 8px;
        }
        
        .info-value {
          color: #303133;
          font-weight: 500;
        }
      }
    }
    
    .careers-list {
      margin-top: 24px;
      
      .careers-title {
        font-size: 18px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        
        .icon {
          margin-right: 8px;
        }
      }
      
      .career-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
        
        .career-card {
          height: 100%;
          transition: all 0.3s;
          
          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          
          .match-rate {
            font-size: 24px;
            font-weight: bold;
            color: #409EFF;
            text-align: center;
            margin-bottom: 12px;
          }
          
          .career-title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 12px;
            color: #303133;
          }
          
          .career-description {
            color: #606266;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .career-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
          }
        }
      }
      
      .no-careers {
        text-align: center;
        padding: 40px 0;
        color: #909399;
        
        .icon {
          font-size: 48px;
          margin-bottom: 16px;
          color: #DCDFE6;
        }
        
        .message {
          font-size: 16px;
          margin-bottom: 16px;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    
    .header-section {
      .page-title {
        font-size: 24px;
      }
    }
    
    .careers-list {
      .career-cards {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style> 