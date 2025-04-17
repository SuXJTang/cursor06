<template>
  <div class="favorite-careers-container">
    <!-- 页面状态通知 -->
    <el-alert
      v-if="showAlert"
      :title="alertMessage"
      :type="alertType"
      :closable="true"
      @close="showAlert = false"
      show-icon
      center
      class="status-alert"
    />

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="page-header-card">
          <div class="page-header">
            <div class="page-title">
              <h2>我的收藏职业</h2>
              <span class="career-count" v-if="favoriteCareers.length > 0">共 {{ favoriteCareers.length }} 个职业</span>
            </div>
            <div class="header-actions">
              <el-input
                v-if="favoriteCareers.length > 0" 
                v-model="searchQuery" 
                placeholder="搜索职业名称..." 
                clearable
                class="search-input"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button v-if="favoriteCareers.length > 0" type="primary" @click="refreshData">
                <el-icon><RefreshRight /></el-icon>刷新
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 过滤标签 -->
    <el-row v-if="favoriteCareers.length > 0" :gutter="20" class="filter-row">
      <el-col :span="24">
        <div class="filter-container">
          <span class="filter-label">职业前景:</span>
          <el-radio-group v-model="prospectFilter" size="small" @change="applyFilters">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="高">高</el-radio-button>
            <el-radio-button label="中高">中高</el-radio-button>
            <el-radio-button label="中">中</el-radio-button>
            <el-radio-button label="低">低</el-radio-button>
          </el-radio-group>
          
          <span class="filter-label filter-label-spacing">排序:</span>
          <el-radio-group v-model="sortType" size="small" @change="applyFilters">
            <el-radio-button label="default">默认</el-radio-button>
            <el-radio-button label="salary">薪资</el-radio-button>
            <el-radio-button label="prospect">前景</el-radio-button>
          </el-radio-group>
        </div>
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
    <el-row v-else-if="filteredCareers.length === 0" :gutter="20" class="career-list-row">
      <el-col :span="24">
        <div class="empty-container">
          <el-empty :description="favoriteCareers.length > 0 ? '没有找到匹配的职业' : '您还没有收藏任何职业'">
            <el-button type="primary" @click="goToCareerLibrary">浏览职业库</el-button>
            <el-button v-if="favoriteCareers.length > 0 && (prospectFilter || searchQuery)" @click="resetFilters">重置筛选</el-button>
          </el-empty>
        </div>
      </el-col>
    </el-row>

    <!-- 职业列表 -->
    <el-row v-else :gutter="20" class="career-list-row">
      <el-col 
        v-for="career in filteredCareers" 
        :key="career.id" 
        :xs="24" 
        :sm="24" 
        :md="12" 
        :lg="8"
        class="career-column"
      >
        <!-- 不使用自定义组件，而是直接内联显示职业卡片 -->
        <el-card class="career-card" shadow="hover">
          <div class="career-card-header">
            <div class="career-title" :title="career.title">{{ career.title }}</div>
            <el-tag 
              v-if="career.future_prospect" 
              :type="getProspectType(career.future_prospect)"
              size="small"
              class="prospect-tag"
            >
              前景: {{ career.future_prospect }}
            </el-tag>
          </div>
          
          <div class="career-card-content">
            <div class="career-info-item company-item" v-if="career.company_name || career.company">
              <el-icon><OfficeBuilding /></el-icon>
              <span :title="career.company_name || career.company">{{ career.company_name || career.company }}</span>
            </div>
            
            <div class="career-info-item salary-item">
              <el-icon><Money /></el-icon>
              <span :title="JSON.stringify(career.salary_range || career.salary)">{{ formatSalary(career.salary_range || career.salary) }}</span>
            </div>
            
            <div class="career-info-item" v-if="career.education_required">
              <el-icon><School /></el-icon>
              <span>{{ career.education_required }}</span>
            </div>
            
            <div class="career-info-item" v-if="career.experience_required">
              <el-icon><Clock /></el-icon>
              <span>{{ career.experience_required }}</span>
            </div>
          </div>
          
          <div class="career-skills" v-if="career.required_skills && career.required_skills.length > 0">
            <el-tag
              v-for="(skill, index) in career.required_skills.slice(0, 3)"
              :key="index"
              size="small"
              class="skill-tag"
              effect="plain"
            >
              {{ skill }}
            </el-tag>
            <span v-if="career.required_skills.length > 3" class="more-skills">
              +{{ career.required_skills.length - 3 }}
            </span>
          </div>
          
          <div class="career-card-actions">
            <el-button 
              size="small" 
              type="primary" 
              @click="viewCareerDetail(career)"
            >
              查看详情
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="removeFavorite(career)"
            >
              取消收藏
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshRight, Search, Money, School, Clock, OfficeBuilding } from '@element-plus/icons-vue'
import request from '../api/request'

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
  salary?: any;
  category_id?: number;
  company_name?: string;
  company?: string;
}

interface ApiResponse {
  careers?: Career[];
  [key: string]: any;
}

const router = useRouter()
const loading = ref(true)
const favoriteCareers = ref<Career[]>([])
const searchQuery = ref('')
const prospectFilter = ref('')
const sortType = ref('default')
const highlightedCardId = ref<number | null>(null)

// 状态通知相关
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'warning' | 'info' | 'error'>('info')

// 显示状态通知
const showNotification = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
  
  // 5秒后自动关闭
  setTimeout(() => {
    showAlert.value = false
  }, 5000)
}

// 计算过滤后的职业列表
const filteredCareers = computed(() => {
  let result = [...favoriteCareers.value]
  
  // 应用搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(career => 
      career.title.toLowerCase().includes(query) || 
      (career.description && career.description.toLowerCase().includes(query))
    )
  }
  
  // 应用前景过滤
  if (prospectFilter.value) {
    result = result.filter(career => 
      career.future_prospect && career.future_prospect.includes(prospectFilter.value)
    )
  }
  
  // 应用排序
  if (sortType.value === 'salary') {
    // 按薪资排序
    result.sort((a, b) => {
      const salaryA = a.salary_range?.max || 0
      const salaryB = b.salary_range?.max || 0
      return salaryB - salaryA
    })
  } else if (sortType.value === 'prospect') {
    // 按前景排序
    const prospectOrder: Record<string, number> = {
      '高': 4,
      '中高': 3,
      '中': 2,
      '中低': 1,
      '低': 0
    }
    
    result.sort((a, b) => {
      const prospectA = a.future_prospect || ''
      const prospectB = b.future_prospect || ''
      return (prospectOrder[prospectB] || 0) - (prospectOrder[prospectA] || 0)
    })
  }
  
  return result
})

// 获取收藏职业列表
const fetchFavoriteCareers = async () => {
  loading.value = true
  
  try {
    const response = await request.get<ApiResponse | Career[]>('/api/v1/careers/user/favorites')
    console.log('API返回数据:', response)
    
    if (response && 'careers' in response && Array.isArray(response.careers)) {
      favoriteCareers.value = response.careers
      console.log('获取到收藏职业:', favoriteCareers.value.length)
      // 打印第一个职业数据以便调试
      if (favoriteCareers.value.length > 0) {
        console.log('第一个职业数据示例:', JSON.stringify(favoriteCareers.value[0]))
        console.log('薪资数据类型:', typeof favoriteCareers.value[0].salary)
        console.log('薪资数据:', favoriteCareers.value[0].salary)
        console.log('薪资范围数据:', favoriteCareers.value[0].salary_range)
      }
    } else if (Array.isArray(response)) {
      // 如果API直接返回数组数据
      favoriteCareers.value = response
      console.log('获取到收藏职业:', favoriteCareers.value.length)
      // 打印第一个职业数据以便调试
      if (favoriteCareers.value.length > 0) {
        console.log('第一个职业数据示例:', JSON.stringify(favoriteCareers.value[0]))
        console.log('薪资数据类型:', typeof favoriteCareers.value[0].salary)
        console.log('薪资数据:', favoriteCareers.value[0].salary)
        console.log('薪资范围数据:', favoriteCareers.value[0].salary_range)
      }
    } else {
      console.error('API返回数据格式不符合预期:', response)
      favoriteCareers.value = []
      throw new Error('获取数据格式不符合预期')
    }
    
    return Promise.resolve()
  } catch (error) {
    console.error('获取收藏职业失败:', error)
    favoriteCareers.value = []
    return Promise.reject(error)
  } finally {
    loading.value = false
  }
}

// 格式化薪资范围
const formatSalary = (salary?: SalaryRange | any): string => {
  // 调试输出
  console.log('原始薪资数据:', salary);
  
  // 防止undefined或null
  if (!salary) return '薪资未知';
  
  // 1. 如果salary就是一个字符串，直接进入字符串处理逻辑
  if (typeof salary === 'string') {
    return formatSalaryString(salary);
  }
  
  // 2. 处理对象格式
  if (typeof salary === 'object') {
    console.log('对象格式薪资:', salary);
    
    // 2.1 检查salary_range特殊格式：{text: "1-1.5万"}
    if (salary.salary_range && typeof salary.salary_range === 'object' && salary.salary_range.text) {
      return formatSalaryString(salary.salary_range.text);
    }
    
    // 2.2 检查是否有自定义显示文本
    if (salary.display_text || salary.salary_text || salary.text) {
      const displayText = salary.display_text || salary.salary_text || salary.text;
      if (displayText && typeof displayText === 'string') {
        return formatSalaryString(displayText);
      }
    }
    
    // 2.3 检查是否直接包含"面议"字段
    if (salary.type === '面议' || salary.desc === '面议' || 
        salary.negotiable === true || salary.is_negotiable === true) {
      return '薪资面议';
    }
    
    // 2.4 确保min和max值是有效的数字
    let min: number | null = null;
    let max: number | null = null;
    
    // 尝试解析min值
    if (salary.min !== undefined && salary.min !== null) {
      min = typeof salary.min === 'string' ? parseInt(salary.min.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.min), 10);
      if (isNaN(min)) min = null;
    }
    
    // 尝试解析max值
    if (salary.max !== undefined && salary.max !== null) {
      max = typeof salary.max === 'string' ? parseInt(salary.max.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.max), 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查其他可能的字段名称
    if (min === null && salary.minimum !== undefined) {
      min = typeof salary.minimum === 'string' ? parseInt(salary.minimum.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.minimum), 10);
      if (isNaN(min)) min = null;
    }
    
    if (max === null && salary.maximum !== undefined) {
      max = typeof salary.maximum === 'string' ? parseInt(salary.maximum.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.maximum), 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查salary_min和salary_max字段
    if (min === null && salary.salary_min !== undefined) {
      min = typeof salary.salary_min === 'string' ? parseInt(salary.salary_min.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.salary_min), 10);
      if (isNaN(min)) min = null;
    }
    
    if (max === null && salary.salary_max !== undefined) {
      max = typeof salary.salary_max === 'string' ? parseInt(salary.salary_max.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.salary_max), 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查salaryMin和salaryMax字段
    if (min === null && salary.salaryMin !== undefined) {
      min = typeof salary.salaryMin === 'string' ? parseInt(salary.salaryMin.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.salaryMin), 10);
      if (isNaN(min)) min = null;
    }
    
    if (max === null && salary.salaryMax !== undefined) {
      max = typeof salary.salaryMax === 'string' ? parseInt(salary.salaryMax.replace(/[^\d]/g, ''), 10) : parseInt(String(salary.salaryMax), 10);
      if (isNaN(max)) max = null;
    }
    
    // 格式化薪资显示
    if (min && max) {
      return `${(min/1000).toFixed(0)}K-${(max/1000).toFixed(0)}K/月`;
    } else if (min) {
      return `${(min/1000).toFixed(0)}K+/月`;
    } else if (max) {
      return `${(max/1000).toFixed(0)}K以下/月`;
    }
  }
  
  // 4. 如果是数字，格式化为k单位
  if (typeof salary === 'number') {
    return `${(salary/1000).toFixed(0)}K/月`;
  }
  
  // 其他情况
  return '薪资未知';
};

// 字符串格式薪资处理辅助函数
const formatSalaryString = (salaryStr: string): string => {
  if (!salaryStr) return '薪资未知';
  
  const cleanSalary = String(salaryStr).trim();
  
  // 如果字符串中包含"面议"，直接返回
  if (cleanSalary.includes('面议') || cleanSalary.toLowerCase().includes('negotiable')) {
    return '薪资面议';
  }
  
  // 直接保留原格式的情况
  if (cleanSalary.includes('万/年') || 
      cleanSalary.includes('万/月') || 
      cleanSalary.includes('千-') || 
      cleanSalary.match(/\d+\s*[-~～]\s*\d+\s*万/)) {
    return cleanSalary;
  }
  
  // 尝试解析带单位的字符串，如"10k-20k"或"¥10k-20k/月"
  const matches = cleanSalary.match(/(\d+\.?\d*)[kK千][-~～](\d+\.?\d*)[kK千]/i);
  if (matches) {
    const min = parseFloat(matches[1]);
    const max = parseFloat(matches[2]);
    return `${min}K-${max}K/月`;
  }
  
  // 尝试解析数字范围，如"10000-20000"或"1-1.5万"
  const rangeMatches = cleanSalary.match(/(\d+\.?\d*)[-~～](\d+\.?\d*)/);
  if (rangeMatches) {
    const min = parseFloat(rangeMatches[1]);
    const max = parseFloat(rangeMatches[2]);
    if (!isNaN(min) && !isNaN(max)) {
      if (min > 1000 || max > 1000) {
        return `${(min/1000).toFixed(1)}K-${(max/1000).toFixed(1)}K/月`;
      } else {
        return `${min}-${max}K/月`;
      }
    }
  }
  
  // 尝试解析单一数字
  const singleNumberMatch = cleanSalary.match(/(\d+\.?\d*)/);
  if (singleNumberMatch) {
    let value = parseFloat(singleNumberMatch[1]);
    if (!isNaN(value)) {
      if (value > 1000) {
        return `${(value/1000).toFixed(1)}K/月`;
      } else {
        return `${value}K/月`;
      }
    }
  }
  
  // 如果没有匹配到特定格式，直接返回原字符串
  return cleanSalary;
};

// 获取职业前景标签类型
const getProspectType = (prospect?: string): string => {
  if (!prospect) return 'info'
  
  if (prospect.includes('高') || prospect === '高') return 'success'
  if (prospect.includes('中高')) return 'primary'
  if (prospect.includes('中') && !prospect.includes('中低')) return 'warning'
  if (prospect.includes('中低') || prospect.includes('低')) return 'danger'
  return 'info'
}

// 取消收藏
const removeFavorite = async (career: Career) => {
  try {
    await ElMessageBox.confirm(`确定要取消收藏"${career.title}"吗？`, '取消收藏', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    showNotification('正在取消收藏...', 'info')
    
    await request.delete(`/api/v1/careers/${career.id}/favorite`)
    
    // 从列表中移除
    favoriteCareers.value = favoriteCareers.value.filter(c => c.id !== career.id)
    
    showNotification(`已取消收藏"${career.title}"`, 'success')
    return Promise.resolve()
  } catch (error) {
    if (error === 'cancel') {
      return Promise.resolve()
    }
    
    console.error('取消收藏失败:', error)
    showNotification('取消收藏失败，请稍后重试', 'error')
    return Promise.reject(error)
  }
}

// 查看职业详情
const viewCareerDetail = (career: Career) => {
  router.push(`/career/${career.id}`)
}

// 跳转到职业库
const goToCareerLibrary = () => {
  router.push('/career-library')
}

// 应用过滤器
const applyFilters = () => {
  console.log('应用过滤器:', { prospectFilter: prospectFilter.value, sortType: sortType.value })
}

// 重置过滤条件
const resetFilters = () => {
  prospectFilter.value = ''
  searchQuery.value = ''
  sortType.value = 'default'
}

// 刷新数据
const refreshData = async () => {
  showNotification('正在刷新数据...', 'info')
  try {
    await fetchFavoriteCareers()
    showNotification('数据已刷新', 'success')
  } catch (error) {
    showNotification('刷新数据失败', 'error')
  }
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

/* 为CSS变量提供类型声明 */
:root {
  --index: 0;
}

/* 添加淡入效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.status-alert,
.page-header-card,
.filter-container,
.loading-container,
.empty-container {
  animation: fadeIn 0.5s ease-out forwards;
}

.status-alert {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.page-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.career-count {
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 240px;
}

.filter-row {
  margin-bottom: 20px;
}

.filter-container {
  padding: 15px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-label {
  font-weight: 500;
  color: #606266;
}

.filter-label-spacing {
  margin-left: 15px;
}

.career-list-row {
  margin-bottom: 20px;
}

.loading-container,
.empty-container {
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
}

.loading-container {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.empty-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 职业卡片样式 */
.career-card {
  width: 100%;
  margin-bottom: 0;
  transition: all 0.3s ease;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 70px; /* 增加底部空间确保内容不被按钮覆盖 */
}

.career-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.career-card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.career-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-right: 10px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal !important;
  overflow: visible;
  max-width: 100%;
  line-height: 1.3;
}

.prospect-tag {
  margin-top: 8px;
  align-self: flex-start;
}

.career-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  flex-grow: 1;
  min-height: 100px; /* 确保内容区域有足够的高度 */
}

.career-info-item {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.career-info-item .el-icon {
  margin-right: 8px;
  font-size: 16px;
  color: #409EFF;
  flex-shrink: 0;
}

.salary-item {
  color: #F56C6C;
  font-weight: 500;
}

.career-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 32px;
}

.skill-tag {
  margin-right: 0;
}

.more-skills {
  font-size: 12px;
  color: #909399;
}

.career-card-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-label-spacing {
    margin-left: 0;
    margin-top: 10px;
  }

  .career-card-actions {
    flex-direction: row;
    justify-content: center;
  }
}

.career-column {
  display: flex;
  margin-bottom: 20px;
}

.company-item {
  color: #409EFF;
  font-weight: 500;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal !important;
  overflow: visible;
  line-height: 1.3;
}
</style> 