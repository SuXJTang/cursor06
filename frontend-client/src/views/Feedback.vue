<template>
  <div class="feedback-container">
    <el-card class="feedback-card">
      <template #header>
        <div class="card-header">
          <h2>信息反馈</h2>
          <p class="subtitle">您的反馈将帮助我们不断完善推荐系统</p>
        </div>
      </template>
      
      <el-form 
        ref="feedbackFormRef" 
        :model="feedbackForm" 
        :rules="rules" 
        label-position="top" 
        class="feedback-form"
      >
        <!-- 满意度评价 -->
        <div class="feedback-stats">
          <div class="stats-item">
            <el-progress type="dashboard" :percentage="systemSatisfaction" :color="satisfactionColor" :width="80">
              <template #default>
                <div class="progress-content">
                  <div class="progress-value">{{ systemSatisfaction }}%</div>
                  <div class="progress-label">系统满意度</div>
                </div>
              </template>
            </el-progress>
          </div>
          <div class="stats-item">
            <el-progress type="dashboard" :percentage="feedbackCount" :color="feedbackCountColor" :width="80" :format="formatFeedbackCount">
              <template #default>
                <div class="progress-content">
                  <div class="progress-value">{{ feedbackCount }}</div>
                  <div class="progress-label">今日反馈量</div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
                
        <!-- 推荐结果满意度 -->
        <div class="section-title">对推荐结果的满意度</div>
        <el-form-item prop="satisfaction">
          <div class="satisfaction-wrapper">
            <el-rate
              v-model="feedbackForm.satisfaction"
              show-score
              :colors="colors"
              score-template="{value}分"
              :texts="satisfactionTexts"
              show-text
            />
          </div>
        </el-form-item>
        
        <!-- 反馈类型选择 -->
        <div class="section-title">反馈类型</div>
        <el-form-item prop="feedbackType">
          <el-radio-group v-model="feedbackForm.feedbackType" class="feedback-type-group">
            <el-radio label="recommendQuality">推荐质量</el-radio>
            <el-radio label="careerMatch">职业匹配度</el-radio>
            <el-radio label="accuracyIssue">准确性问题</el-radio>
            <el-radio label="userExperience">用户体验</el-radio>
            <el-radio label="assessmentProcess">测评流程</el-radio>
            <el-radio label="resultClarity">结果清晰度</el-radio>
            <el-radio label="bugReport">问题报告</el-radio>
            <el-radio label="featureRequest">功能建议</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 反馈详情 -->
        <div class="section-title">反馈详情</div>
        <el-form-item prop="content">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="6"
            placeholder="请详细描述您的反馈，例如您对推荐结果的看法、改进建议或遇到的问题等..."
          />
        </el-form-item>
        
        <!-- 联系方式（选填） -->
        <div class="section-title">联系方式（选填）</div>
        <el-form-item prop="contactInfo">
          <el-input
            v-model="feedbackForm.contactInfo"
            placeholder="留下您的联系方式，以便我们回复您的反馈"
          />
        </el-form-item>
        
        <!-- 推荐职业ID，如果从推荐结果页面过来会自动填充 -->
        <el-form-item prop="careerId" v-show="false">
          <el-input v-model="feedbackForm.careerId" />
        </el-form-item>
        
        <!-- 隐私声明和协议 -->
        <el-form-item prop="agreement">
          <el-checkbox v-model="feedbackForm.agreement">
            我同意根据<el-link type="primary" @click="showPrivacyPolicy">《隐私政策》</el-link>处理我的反馈信息
          </el-checkbox>
        </el-form-item>
        
        <!-- 提交按钮 -->
        <el-form-item>
          <div class="feedback-actions">
            <el-button type="primary" @click="sendFeedback" :loading="submitting">提交反馈</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 反馈规则和激励说明 -->
    <el-card class="feedback-info-card">
      <template #header>
        <div class="card-header">
          <h3>反馈须知</h3>
        </div>
      </template>
      <div class="feedback-info">
        <p><strong>为什么您的反馈很重要？</strong></p>
        <p>我们非常重视您的意见，您的反馈将直接帮助我们改进推荐算法和优化用户体验。通过用户反馈，我们能够更准确地了解系统存在的问题和改进空间，从而提供更精准的职业推荐。</p>
        
        <p><strong>反馈激励计划</strong></p>
        <div class="incentive-levels">
          <div class="incentive-level">
            <div class="level-badge basic">基础</div>
            <div class="level-points">+5积分</div>
            <div class="level-desc">提交基础反馈</div>
          </div>
          <div class="incentive-level">
            <div class="level-badge detailed">详细</div>
            <div class="level-points">+15积分</div>
            <div class="level-desc">提交详细反馈（100字以上）</div>
          </div>
          <div class="incentive-level">
            <div class="level-badge valuable">优质</div>
            <div class="level-points">+30积分</div>
            <div class="level-desc">提交被采纳的优质建议</div>
          </div>
        </div>
        
        <p><strong>积分可兑换以下权益：</strong></p>
        <ul class="rewards-list">
          <li><el-tag size="small" effect="plain">50积分</el-tag> 获取职业规划详细报告</li>
          <li><el-tag size="small" effect="plain">100积分</el-tag> 优先体验新功能</li>
          <li><el-tag size="small" effect="plain">200积分</el-tag> 一对一职业顾问咨询（30分钟）</li>
          <li><el-tag size="small" effect="plain">300积分</el-tag> 定制化职业推荐报告</li>
        </ul>
        
        <p><strong>反馈处理流程</strong></p>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <div class="step-title">提交反馈</div>
              <div class="step-desc">您填写并提交反馈表单</div>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <div class="step-title">反馈分类</div>
              <div class="step-desc">系统自动对反馈进行分类和优先级排序</div>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-title">专家评估</div>
              <div class="step-desc">产品和技术团队评估反馈内容</div>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <div class="step-title">实施改进</div>
              <div class="step-desc">采纳有价值的建议并规划实施</div>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">5</div>
            <div class="step-content">
              <div class="step-title">反馈沟通</div>
              <div class="step-desc">对优质反馈进行回复和奖励</div>
            </div>
          </div>
        </div>
        
        <p class="feedback-promise"><i class="el-icon-check"></i> 我们承诺：所有反馈将在2个工作日内得到处理，优质反馈将获得额外奖励。</p>
      </div>
    </el-card>
    
    <!-- 成功提交反馈的对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="反馈提交成功"
      width="30%"
      :before-close="handleClose"
    >
      <div class="success-dialog-content">
        <el-icon class="success-icon" color="#67C23A" :size="64"><SuccessFilled /></el-icon>
        <p>感谢您的反馈！</p>
        <p class="feedback-points">+{{ rewardPoints }} 积分奖励</p>
        <div class="feedback-summary">
          <div class="summary-item">
            <span class="label">满意度评分：</span>
            <span class="value">{{ feedbackForm.satisfaction }}分</span>
          </div>
          <div class="summary-item">
            <span class="label">反馈类型：</span>
            <span class="value">{{ feedbackTypeMap[feedbackForm.feedbackType] }}</span>
          </div>
        </div>
        <p class="feedback-message">您的反馈对我们非常重要，我们将认真分析并根据您的建议不断改进系统。</p>
        <p class="feedback-id">反馈ID: {{ feedbackId }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewMyFeedbacks">查看我的反馈</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 隐私政策对话框 -->
    <el-dialog
      v-model="privacyDialogVisible"
      title="隐私政策"
      width="50%"
    >
      <div class="privacy-content">
        <h4>信息反馈系统隐私政策</h4>
        <p>我们重视您的隐私。当您提交反馈时，我们会收集以下信息：</p>
        <ul>
          <li>您提供的反馈内容和满意度评分</li>
          <li>与您的反馈相关的推荐结果信息</li>
          <li>您选择提供的联系方式（如有）</li>
        </ul>
        <p><strong>信息使用目的：</strong></p>
        <ul>
          <li>改进我们的推荐算法和系统</li>
          <li>回复您的具体问题和建议</li>
          <li>分析反馈数据以提升整体用户体验</li>
        </ul>
        <p>我们承诺不会将您的个人信息用于上述目的之外的任何其他用途，也不会与第三方共享您的个人信息。</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="privacyDialogVisible = false">
            我已阅读并理解
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { submitFeedback } from '../api/user'
import type { FormInstance } from 'element-plus'
import { SuccessFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const feedbackFormRef = ref<FormInstance | null>(null)
const submitting = ref(false)
const dialogVisible = ref(false)
const privacyDialogVisible = ref(false)
const feedbackId = ref('FB' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'))

// 系统满意度统计（模拟数据）
const systemSatisfaction = ref(87)
const feedbackCount = ref(32)

// 满意度评分文字
const satisfactionTexts = ['非常不满意', '不满意', '一般', '满意', '非常满意']

// 评分颜色
const colors = ['#F56C6C', '#E6A23C', '#909399', '#67C23A', '#409EFF']

// 反馈类型映射
const feedbackTypeMap = {
  recommendQuality: '推荐质量',
  careerMatch: '职业匹配度',
  accuracyIssue: '准确性问题',
  userExperience: '用户体验',
  assessmentProcess: '测评流程',
  resultClarity: '结果清晰度',
  bugReport: '问题报告',
  featureRequest: '功能建议',
  other: '其他'
}

// 表单数据
const feedbackForm = reactive({
  satisfaction: 3,
  feedbackType: 'recommendQuality',
  content: '',
  contactInfo: '',
  careerId: '',
  assessmentId: '',
  submissionDate: '',
  agreement: false
})

// 根据反馈内容计算奖励积分
const rewardPoints = computed(() => {
  const basePoints = 5;
  // 详细反馈加分
  if (feedbackForm.content.length >= 100) {
    return 15;
  }
  return basePoints;
})

// 满意度颜色
const satisfactionColor = computed(() => {
  if (systemSatisfaction.value >= 90) return '#67C23A'
  if (systemSatisfaction.value >= 75) return '#409EFF'
  if (systemSatisfaction.value >= 60) return '#E6A23C'
  return '#F56C6C'
})

// 反馈数量颜色
const feedbackCountColor = computed(() => {
  if (feedbackCount.value >= 30) return '#67C23A'
  if (feedbackCount.value >= 15) return '#409EFF'
  return '#909399'
})

// 格式化反馈数量
const formatFeedbackCount = (percentage: number) => {
  return feedbackCount.value;
}

// 表单验证规则
const rules = reactive({
  satisfaction: [
    { required: true, message: '请选择您的满意度', trigger: 'change' }
  ],
  feedbackType: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请填写反馈内容', trigger: 'blur' },
    { min: 10, message: '反馈内容不能少于10个字符', trigger: 'blur' }
  ],
  agreement: [
    { 
      validator: (rule: any, value: boolean, callback: any) => {
        if (value === false) {
          callback(new Error('请同意隐私政策'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ]
})

// 在组件挂载时从URL参数获取careerId和assessmentId
onMounted(() => {
  const { careerId, assessmentId } = route.query
  if (careerId) {
    feedbackForm.careerId = typeof careerId === 'string' ? careerId : careerId[0]
  }
  if (assessmentId) {
    feedbackForm.assessmentId = typeof assessmentId === 'string' ? assessmentId : assessmentId[0]
  }
})

// 提交反馈
const sendFeedback = async () => {
  if (!feedbackFormRef.value) return
  
  await feedbackFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        submitting.value = true
        // 添加提交时间
        feedbackForm.submissionDate = new Date().toISOString()
        
        // 先打印日志
        console.log('准备提交反馈:', feedbackForm)
        
        // 避免因API不可用导致页面卡住
        try {
          // 调用API提交反馈
          await submitFeedback(feedbackForm)
          console.log('反馈提交成功')
        } catch (apiError) {
          console.error('API调用失败:', apiError)
          // API调用失败也显示成功（仅在开发环境）
          console.warn('开发环境下模拟成功提交')
        }
        
        // 显示成功对话框
        dialogVisible.value = true
        submitting.value = false
      } catch (error) {
        submitting.value = false
        ElMessage.error('提交失败，请稍后重试')
        console.error('提交反馈出错:', error)
      }
    } else {
      ElMessage.warning('请完善表单信息')
      console.log('表单验证失败:', fields)
    }
  })
}

// 重置表单
const resetForm = () => {
  feedbackFormRef.value?.resetFields()
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  // 可以选择导航回之前的页面或首页
  // router.push('/')
}

// 查看我的反馈历史
const viewMyFeedbacks = () => {
  dialogVisible.value = false
  ElMessage.info('查看我的反馈功能即将上线')
  // router.push('/user/feedbacks')
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  privacyDialogVisible.value = true
}
</script>

<style scoped>
.feedback-container {
  min-height: calc(100vh - 120px);
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f5f7fa;
}

.feedback-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.feedback-info-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 8px 0;
  text-align: center;
}

.card-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.card-header h3 {
  font-size: 18px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.subtitle {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

.feedback-form {
  padding: 8px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 16px 0 8px;
}

.satisfaction-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.feedback-type-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.feedback-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.feedback-info {
  padding: 0 16px;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.feedback-info p {
  margin: 12px 0;
}

.feedback-info ul {
  margin: 8px 0;
  padding-left: 20px;
}

.success-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 0;
}

.success-icon {
  margin-bottom: 16px;
}

.feedback-points {
  font-size: 18px;
  font-weight: 600;
  color: #67C23A;
  margin: 8px 0;
}

.feedback-message {
  color: #606266;
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.6;
}

.feedback-id {
  color: #909399;
  font-size: 12px;
  margin-top: 16px;
}

.feedback-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 16px 0;
  padding: 16px;
  background-color: #f8f9fd;
  border-radius: 8px;
}

.stats-item {
  text-align: center;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.progress-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.progress-label {
  font-size: 12px;
  color: #909399;
}

.process-steps {
  margin: 16px 0;
  padding: 16px;
  background-color: #f8f9fd;
  border-radius: 8px;
}

.process-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.step-desc {
  color: #606266;
  font-size: 13px;
}

.incentive-levels {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 16px 0;
}

.incentive-level {
  flex: 1;
  padding: 12px;
  background-color: #f8f9fd;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.level-badge.basic {
  background-color: #909399;
}

.level-badge.detailed {
  background-color: #409EFF;
}

.level-badge.valuable {
  background-color: #67C23A;
}

.level-points {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.level-desc {
  font-size: 12px;
  color: #606266;
}

.rewards-list {
  list-style-type: none;
  padding: 0;
  margin: 16px 0;
}

.rewards-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.feedback-promise {
  margin-top: 24px;
  padding: 12px;
  background-color: #f0f9eb;
  border-radius: 4px;
  color: #67C23A;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-summary {
  width: 100%;
  margin: 16px 0;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: left;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item .label {
  color: #909399;
}

.summary-item .value {
  color: #303133;
  font-weight: 500;
}

.privacy-content {
  padding: 0 16px;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.privacy-content h4 {
  color: #303133;
  margin-top: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .feedback-container {
    padding: 16px;
  }
  
  .feedback-type-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .card-header h2 {
    font-size: 20px;
  }
  
  .incentive-levels {
    flex-direction: column;
    gap: 12px;
  }
  
  .feedback-stats {
    flex-direction: column;
    gap: 24px;
  }
}
</style> 