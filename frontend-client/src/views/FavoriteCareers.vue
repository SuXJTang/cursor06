<template>
  <div class="favorite-careers-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="page-header-card">
          <div class="page-header">
            <h2>我的收藏职业</h2>
            <el-button v-if="favoriteCareers.length > 0" type="primary" @click="refreshData">
              <el-icon><RefreshRight /></el-icon>刷新
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 加载状态 -->
    <el-row v-if="loading" :gutter="20" class="career-list-row">
      <el-col :span="24">
        <div class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-row v-else-if="favoriteCareers.length === 0" :gutter="20" class="career-list-row">
      <el-col :span="24">
        <el-empty description="您还没有收藏任何职业">
          <el-button type="primary" @click="goToCareerLibrary">浏览职业库</el-button>
        </el-empty>
      </el-col>
    </el-row>

    <!-- 职业列表 -->
    <el-row v-else :gutter="20" class="career-list-row">
      <el-col 
        v-for="career in favoriteCareers" 
        :key="career.id" 
        :xs="24" 
        :sm="12" 
        :md="8" 
        :lg="6"
      >
        <el-card class="career-card" shadow="hover">
          <template #header>
            <div class="career-card-header">
              <h3 class="career-name">{{ career.title }}</h3>
              <el-tag :type="getCareerProspectType(career.future_prospect)" size="small">
                {{ career.future_prospect || '未知' }}
              </el-tag>
            </div>
          </template>
          
          <div class="career-card-content">
            <div class="career-info-item">
              <el-icon><Money /></el-icon>
              <span>{{ formatSalary(career.salary_range) }}</span>
            </div>
            <div class="career-info-item">
              <el-icon><School /></el-icon>
              <span>{{ career.education_required || '未知' }}</span>
            </div>
            <div class="career-info-item">
              <el-icon><Clock /></el-icon>
              <span>{{ career.experience_required || '未知' }}</span>
            </div>
            
            <div class="career-tags">
              <el-tag 
                v-for="skill in (career.required_skills || []).slice(0, 3)" 
                :key="skill" 
                size="small" 
                effect="plain" 
                class="career-tag"
              >
                {{ skill }}
              </el-tag>
            </div>
            
            <div class="career-card-actions">
              <el-button type="primary" @click="viewCareerDetail(career)">
                查看详情
              </el-button>
              <el-button type="danger" plain @click="removeFavorite(career)">
                <el-icon><Delete /></el-icon>取消收藏
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Money, School, Clock, Delete, RefreshRight } from '@element-plus/icons-vue'
import request from '@/api/request'

interface SalaryRange {
  min?: number;
  max?: number;
  unit?: string;
}

interface Career {
  id: number;
  title: string;
  description: string;
  required_skills?: string[];
  education_required?: string;
  experience_required?: string;
  future_prospect?: string;
  salary_range?: SalaryRange;
  category_id?: number;
}

const router = useRouter()
const loading = ref(true)
const favoriteCareers = ref<Career[]>([])

// 获取收藏职业列表
const fetchFavoriteCareers = async () => {
  loading.value = true
  try {
    const response = await request.get('/api/v1/careers/user/favorites')
    console.log('API返回数据:', response)
    
    if (response && response.careers) {
      favoriteCareers.value = response.careers
      console.log('获取到收藏职业:', favoriteCareers.value.length)
    } else {
      console.error('API返回数据格式不符合预期:', response)
      favoriteCareers.value = []
    }
  } catch (error) {
    console.error('获取收藏职业失败:', error)
    ElMessage.error('获取收藏职业失败，请稍后重试')
    favoriteCareers.value = []
  } finally {
    loading.value = false
  }
}

// 格式化薪资范围
const formatSalary = (salaryRange?: SalaryRange): string => {
  if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
    return '薪资未知'
  }
  
  const min = salaryRange.min || '?'
  const max = salaryRange.max || '?'
  const unit = salaryRange.unit || '元/月'
  
  return `${min}-${max} ${unit}`
}

// 取消收藏
const removeFavorite = async (career: Career) => {
  try {
    await ElMessageBox.confirm(`确定要取消收藏"${career.title}"吗？`, '取消收藏', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await request.delete(`/api/v1/careers/${career.id}/favorite`)
    ElMessage.success('已取消收藏')
    
    // 从列表中移除
    favoriteCareers.value = favoriteCareers.value.filter(c => c.id !== career.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消收藏失败:', error)
      ElMessage.error('操作失败，请稍后重试')
    }
  }
}

// 获取职业前景样式
const getCareerProspectType = (prospect?: string): string => {
  if (!prospect) return 'info'
  
  if (prospect.includes('高') || prospect === '高') return 'success'
  if (prospect.includes('中高')) return 'primary'
  if (prospect.includes('中') && !prospect.includes('中低')) return 'warning'
  if (prospect.includes('中低') || prospect.includes('低')) return 'danger'
  return 'info'
}

// 查看职业详情
const viewCareerDetail = (career: Career) => {
  // 跳转到职业库页面并选中该职业
  router.push({
    path: '/career-library',
    query: { careerId: career.id.toString() }
  })
}

// 跳转至职业库
const goToCareerLibrary = () => {
  router.push('/career-library')
}

// 刷新数据
const refreshData = () => {
  fetchFavoriteCareers()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchFavoriteCareers()
})
</script>

<style scoped>
.favorite-careers-container {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.page-header-card {
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.career-list-row {
  margin-top: 20px;
}

.loading-container {
  padding: 40px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.career-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.career-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.career-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.career-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.career-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.career-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.career-info-item .el-icon {
  margin-right: 5px;
  color: #409EFF;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0;
}

.career-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.career-card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style> 