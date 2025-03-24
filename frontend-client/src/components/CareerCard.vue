<template>
  <el-card class="career-card" shadow="hover" :class="{'card-highlight': isHighlighted}" @mouseenter="isHighlighted = true" @mouseleave="isHighlighted = false">
    <template #header>
      <div class="career-card-header">
        <h3 class="career-name">{{ career.title }}</h3>
        <el-tag :type="getCareerProspectType(career.future_prospect)" size="small" class="prospect-tag">
          {{ career.future_prospect || '未知' }}
        </el-tag>
      </div>
    </template>
    
    <div class="career-card-content">
      <div class="career-info-item salary-item">
        <el-icon><Money /></el-icon>
        <span>{{ formatSalary(career.salary_range) }}</span>
      </div>
      <div class="career-info-row">
        <div class="career-info-item">
          <el-icon><School /></el-icon>
          <span>{{ career.education_required || '未知' }}</span>
        </div>
        <div class="career-info-item">
          <el-icon><Clock /></el-icon>
          <span>{{ career.experience_required || '未知' }}</span>
        </div>
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
        <el-button type="primary" size="small" @click="$emit('view-detail', career)" class="detail-btn">
          查看详情
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          plain 
          @click="$emit('remove-favorite', career)" 
          class="unfavorite-btn"
        >
          {{ isFavoriteMode ? '取消收藏' : '收藏' }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Money, School, Clock } from '@element-plus/icons-vue'

interface SalaryRange {
  min?: number;
  max?: number;
  unit?: string;
}

interface Career {
  id: number;
  title: string;
  description?: string;
  required_skills?: string[];
  education_required?: string;
  experience_required?: string;
  future_prospect?: string;
  salary_range?: SalaryRange;
  category_id?: number;
}

interface Props {
  career: Career;
  isFavoriteMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isFavoriteMode: true
})

defineEmits<{
  (e: 'view-detail', career: Career): void
  (e: 'remove-favorite', career: Career): void
}>()

const isHighlighted = ref(false)

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

// 获取职业前景样式
const getCareerProspectType = (prospect?: string): string => {
  if (!prospect) return 'info'
  
  if (prospect.includes('高') || prospect === '高') return 'success'
  if (prospect.includes('中高')) return 'primary'
  if (prospect.includes('中') && !prospect.includes('中低')) return 'warning'
  if (prospect.includes('中低') || prospect.includes('低')) return 'danger'
  return 'info'
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.career-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  background-color: #fff;
  animation: fadeIn 0.5s ease-out forwards;
}

.career-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-highlight {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 30px rgba(64, 158, 255, 0.25);
  border: 1px solid rgba(64, 158, 255, 0.3);
  z-index: 1;
}

.card-highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.03), rgba(64, 158, 255, 0.08));
  border-radius: 12px;
  z-index: -1;
}

.career-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.career-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
  color: #2c3e50;
}

.prospect-tag {
  border-radius: 4px;
  font-weight: 500;
}

.career-card-content {
  display: flex;
  flex-direction: column;
  padding: 15px;
  flex: 1;
}

.career-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.career-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.salary-item {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 15px;
}

.career-info-item .el-icon {
  margin-right: 5px;
  color: #409EFF;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0 15px;
  min-height: 32px;
}

.career-tag {
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  background-color: rgba(64, 158, 255, 0.08);
  border-color: rgba(64, 158, 255, 0.2);
  color: #409EFF;
}

.career-card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.detail-btn, .unfavorite-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
}

.detail-btn {
  margin-right: 8px;
  font-weight: 500;
}

.unfavorite-btn {
  font-weight: 500;
}

@media (max-width: 768px) {
  .career-card-actions {
    flex-direction: column;
  }
  
  .detail-btn {
    margin-right: 0;
    margin-bottom: 8px;
  }
}
</style> 