<template>
  <div class="validator-container">
    <el-card class="validator-card">
      <template #header>
        <div class="card-header">
          <h2>职业三级类别验证工具</h2>
          <p class="subtitle">检查所有职业三级类别是否关联了职业信息</p>
        </div>
      </template>
      
      <div class="content">
        <el-alert
          v-if="!isLoggedIn"
          title="请先登录"
          type="warning"
          description="您需要登录后才能使用此功能"
          show-icon
        />
        
        <template v-else>
          <div v-if="!isRunning && !result" class="start-section">
            <p>此工具将检查所有职业三级类别是否有关联的职业信息，并生成详细报告。</p>
            <el-button type="primary" @click="runValidation" :disabled="isRunning">
              开始验证
            </el-button>
          </div>
          
          <div v-if="isRunning" class="progress-section">
            <el-progress type="circle" :percentage="progressPercentage" />
            <p class="progress-text">正在验证中，请稍候...</p>
            <p class="current-task">{{ currentTask }}</p>
          </div>
          
          <div v-if="result" class="result-section">
            <div class="summary-cards">
              <el-card class="summary-card" shadow="hover">
                <h3>总计类别</h3>
                <div class="number">{{ result.totalCategories }}</div>
              </el-card>
              
              <el-card class="summary-card" shadow="hover">
                <h3>有关联职业</h3>
                <div class="number success">{{ result.categoriesWithCareers }}</div>
              </el-card>
              
              <el-card class="summary-card" shadow="hover">
                <h3>缺少职业</h3>
                <div class="number error">{{ result.categoriesWithoutCareers }}</div>
              </el-card>
              
              <el-card class="summary-card" shadow="hover">
                <h3>覆盖率</h3>
                <div class="number">
                  {{ (result.categoriesWithCareers / result.totalCategories * 100).toFixed(2) }}%
                </div>
              </el-card>
            </div>
            
            <div class="actions">
              <el-button type="info" @click="downloadReport('text')">
                下载文本报告
              </el-button>
              <el-button type="info" @click="downloadReport('csv')">
                下载CSV报告
              </el-button>
              <el-button type="primary" @click="runValidation">
                重新验证
              </el-button>
            </div>
            
            <div v-if="result.missingCategories.length > 0" class="missing-categories">
              <h3>缺少职业信息的类别列表</h3>
              
              <el-table
                :data="result.missingCategories"
                style="width: 100%"
                max-height="400"
                border
              >
                <el-table-column type="index" width="50" />
                <el-table-column prop="id" label="类别ID" width="100" />
                <el-table-column prop="name" label="类别名称" width="200" />
                <el-table-column prop="path" label="完整路径" />
              </el-table>
            </div>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { validateCategoryCareerRelations, downloadReport as downloadReportFile } from '@/utils/careerCategoryValidator'

interface TestResult {
  totalCategories: number;
  categoriesWithCareers: number;
  categoriesWithoutCareers: number;
  missingCategories: Array<{id: number; name: string; path: string}>;
  report: string;
}

// 状态
const isLoggedIn = ref(!!localStorage.getItem('auth_token'))
const isRunning = ref(false)
const progressPercentage = ref(0)
const currentTask = ref('')
const result = ref<TestResult | null>(null)

// 开始验证
const runValidation = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再使用此功能')
    return
  }
  
  try {
    isRunning.value = true
    result.value = null
    progressPercentage.value = 0
    currentTask.value = '正在获取职业类别数据...'
    
    // 使用模拟进度更新
    const progressInterval = setInterval(() => {
      if (progressPercentage.value < 95) {
        progressPercentage.value += 5
        
        if (progressPercentage.value > 20 && progressPercentage.value < 80) {
          currentTask.value = '正在验证职业类别关联...'
        }
        
        if (progressPercentage.value >= 80) {
          currentTask.value = '正在生成报告...'
        }
      }
    }, 2000)
    
    // 执行验证
    const validationResult = await validateCategoryCareerRelations()
    
    // 完成
    clearInterval(progressInterval)
    progressPercentage.value = 100
    currentTask.value = '验证完成'
    
    // 显示结果
    setTimeout(() => {
      result.value = validationResult
      isRunning.value = false
    }, 500)
    
    // 显示结果通知
    ElMessage.success('验证完成')
  } catch (error) {
    isRunning.value = false
    ElMessage.error(`验证过程中发生错误: ${error.message || '未知错误'}`)
    console.error('验证错误:', error)
  }
}

// 下载报告
const downloadReport = (type: 'text' | 'csv') => {
  if (!result.value) return
  
  downloadReportFile(result.value, type)
  ElMessage.success(`${type === 'text' ? '文本' : 'CSV'}报告已下载`)
}
</script>

<style scoped lang="scss">
.validator-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  .validator-card {
    .card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      h2 {
        margin: 0;
        color: #303133;
      }
      
      .subtitle {
        color: #909399;
        margin-top: 8px;
      }
    }
    
    .content {
      padding: 20px 0;
      
      .start-section {
        text-align: center;
        padding: 40px 0;
        
        p {
          margin-bottom: 30px;
          color: #606266;
          font-size: 16px;
        }
      }
      
      .progress-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 0;
        
        .progress-text {
          margin-top: 20px;
          font-size: 16px;
          color: #303133;
        }
        
        .current-task {
          margin-top: 10px;
          color: #909399;
        }
      }
      
      .result-section {
        .summary-cards {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          
          .summary-card {
            width: 23%;
            text-align: center;
            
            h3 {
              font-size: 14px;
              color: #909399;
              margin: 0 0 10px 0;
            }
            
            .number {
              font-size: 28px;
              font-weight: bold;
              color: #303133;
              
              &.success {
                color: #67c23a;
              }
              
              &.error {
                color: #f56c6c;
              }
            }
          }
        }
        
        .actions {
          display: flex;
          justify-content: center;
          margin: 20px 0 30px;
          gap: 10px;
        }
        
        .missing-categories {
          margin-top: 30px;
          
          h3 {
            margin-bottom: 15px;
            color: #303133;
          }
        }
      }
    }
  }
}
</style> 