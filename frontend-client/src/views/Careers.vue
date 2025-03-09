<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 职业类型接口
interface Career {
  id: number
  name: string
  category: string
  description: string
  requirements: string[]
  skills: string[]
  salary: string
  prospects: string
}

// 职业分类
const categories = [
  '技术类',
  '金融类',
  '教育类',
  '医疗类',
  '管理类',
  '艺术类',
  '服务类',
  '其他'
]

// 搜索关键词
const searchKeyword = ref('')
// 选中的分类
const selectedCategory = ref('')

// 模拟的职业数据
const careers = ref<Career[]>([
  {
    id: 1,
    name: '软件工程师',
    category: '技术类',
    description: '从事软件开发、测试、维护等工作，为用户提供优质的软件解决方案。',
    requirements: ['计算机相关专业', '熟悉主流编程语言', '良好的问题解决能力'],
    skills: ['Java', 'Python', 'JavaScript', '数据库', '算法'],
    salary: '10k-30k',
    prospects: '随着数字化转型的深入，软件工程师的需求持续增长，发展前景广阔。'
  },
  {
    id: 2,
    name: '数据分析师',
    category: '技术类',
    description: '通过数据挖掘和分析，为企业决策提供数据支持和建议。',
    requirements: ['统计学或相关专业', '数据分析能力', '良好的商业敏感度'],
    skills: ['SQL', 'Python', 'Excel', '数据可视化', '统计分析'],
    salary: '8k-25k',
    prospects: '大数据时代，数据分析师在各行各业都有广泛的应用需求。'
  },
  {
    id: 3,
    name: '教师',
    category: '教育类',
    description: '在学校或教育机构从事教学工作，培养下一代。',
    requirements: ['教育学相关专业', '教师资格证', '良好的沟通能力'],
    skills: ['课程设计', '教学技能', '班级管理', '教育心理学'],
    salary: '6k-15k',
    prospects: '教育行业稳定，随着教育改革深入，优秀教师的发展空间较大。'
  }
])

// 根据关键词和分类筛选职业
const filteredCareers = computed(() => {
  return careers.value.filter(career => {
    const matchKeyword = searchKeyword.value ? 
      career.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      career.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
      : true
    
    const matchCategory = selectedCategory.value ? 
      career.category === selectedCategory.value 
      : true
    
    return matchKeyword && matchCategory
  })
})

// 查看职业详情
const showCareerDetail = (career: Career) => {
  ElMessage.success(`查看${career.name}的详细信息`)
  // TODO: 实现查看详情的功能
}
</script>

<template>
  <div class="careers-container">
    <div class="careers-header">
      <h1>职业库</h1>
      <p class="subtitle">探索不同职业的详细信息，了解职业发展前景</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索职业名称或描述"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select
        v-model="selectedCategory"
        placeholder="选择职业类别"
        clearable
        class="category-select"
      >
        <el-option
          v-for="category in categories"
          :key="category"
          :label="category"
          :value="category"
        />
      </el-select>
    </div>

    <!-- 职业列表 -->
    <div class="careers-grid">
      <el-card
        v-for="career in filteredCareers"
        :key="career.id"
        class="career-card"
        @click="showCareerDetail(career)"
      >
        <div class="career-header">
          <h3>{{ career.name }}</h3>
          <el-tag size="small">{{ career.category }}</el-tag>
        </div>
        
        <p class="career-description">{{ career.description }}</p>
        
        <div class="career-info">
          <div class="info-item">
            <h4>薪资范围</h4>
            <p>{{ career.salary }}</p>
          </div>
          
          <div class="info-item">
            <h4>必备技能</h4>
            <div class="skills-list">
              <el-tag
                v-for="skill in career.skills.slice(0, 3)"
                :key="skill"
                size="small"
                type="info"
                effect="plain"
              >
                {{ skill }}
              </el-tag>
              <span v-if="career.skills.length > 3" class="more-skills">
                +{{ career.skills.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.careers-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.careers-header {
  text-align: center;
  margin-bottom: 40px;
}

.careers-header h1 {
  font-size: 2.5em;
  color: #303133;
  margin-bottom: 10px;
}

.subtitle {
  color: #606266;
  font-size: 1.2em;
}

.search-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
}

.category-select {
  width: 200px;
}

.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.career-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.career-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.career-header h3 {
  margin: 0;
  font-size: 1.3em;
  color: #303133;
}

.career-description {
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.career-info {
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

.info-item {
  margin-bottom: 15px;
}

.info-item h4 {
  color: #909399;
  font-size: 0.9em;
  margin: 0 0 8px 0;
}

.info-item p {
  color: #303133;
  margin: 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.more-skills {
  color: #909399;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .careers-header h1 {
    font-size: 2em;
  }

  .subtitle {
    font-size: 1.1em;
  }

  .search-section {
    flex-direction: column;
  }

  .category-select {
    width: 100%;
  }

  .careers-grid {
    grid-template-columns: 1fr;
  }
}
</style> 