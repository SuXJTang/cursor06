<template>
  <div class="career-library">
    <el-row :gutter="20">
      <!-- 左侧分类和搜索 -->
      <el-col :span="6">
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <el-input
                v-model="searchQuery"
                placeholder="搜索职业..."
                :prefix-icon="Search"
                clearable
              />
            </div>
          </template>
          <el-menu
            :default-active="activeCategory"
            class="category-menu"
            @select="handleCategorySelect"
          >
            <el-menu-item
              v-for="category in categories"
              :key="category.id"
              :index="category.id"
            >
              <el-icon><FolderOpened /></el-icon>
              <span>{{ category.name }}</span>
              <template #title>
                <span class="career-count">({{ getCategoryCount(category.id) }})</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 中间职业列表 -->
      <el-col :span="8">
        <el-card class="career-list-card">
          <template #header>
            <div class="list-header">
              <h3>{{ getCurrentCategoryName() }}</h3>
              <div class="sort-actions">
                <el-radio-group v-model="sortBy" size="small">
                  <el-radio-button label="salary">薪资</el-radio-button>
                  <el-radio-button label="hot">热度</el-radio-button>
                  <el-radio-button label="growth">增长</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <el-scrollbar height="calc(100vh - 180px)">
            <div class="career-list">
              <div
                v-for="career in filteredCareers"
                :key="career.id"
                class="career-item"
                :class="{ active: selectedCareer?.id === career.id }"
                @click="selectCareer(career)"
              >
                <div class="career-item-header">
                  <h4>{{ career.name }}</h4>
                  <el-tag :type="getCareerLevelType(career.level)" size="small">
                    {{ career.level }}
                  </el-tag>
                </div>
                <div class="career-brief">
                  <div class="salary-range">
                    <el-icon><Money /></el-icon>
                    {{ career.salary }}
                  </div>
                  <div class="education-req">
                    <el-icon><School /></el-icon>
                    {{ career.education }}
                  </div>
                  <div class="experience-req">
                    <el-icon><Timer /></el-icon>
                    {{ career.experience }}
                  </div>
                </div>
                <div class="career-tags">
                  <el-tag
                    v-for="tag in career.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>

      <!-- 右侧职业详情 -->
      <el-col :span="10">
        <el-card v-if="selectedCareer" class="career-detail-card">
          <template #header>
            <div class="detail-header">
              <h2>{{ selectedCareer.name }}</h2>
              <div class="action-buttons">
                <el-button type="primary" @click="handleSaveCareer">
                  <el-icon><Star /></el-icon>收藏
                </el-button>
                <el-button @click="handleShareCareer">
                  <el-icon><Share /></el-icon>分享
                </el-button>
              </div>
            </div>
          </template>
          
          <el-scrollbar height="calc(100vh - 180px)">
            <div class="career-detail">
              <!-- 基本信息 -->
              <section class="detail-section">
                <h3>基本信息</h3>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="职业类别">
                    {{ selectedCareer.category }}
                  </el-descriptions-item>
                  <el-descriptions-item label="发展阶段">
                    {{ selectedCareer.level }}
                  </el-descriptions-item>
                  <el-descriptions-item label="薪资范围">
                    {{ selectedCareer.salary }}
                  </el-descriptions-item>
                  <el-descriptions-item label="经验要求">
                    {{ selectedCareer.experience }}
                  </el-descriptions-item>
                  <el-descriptions-item label="学历要求">
                    {{ selectedCareer.education }}
                  </el-descriptions-item>
                  <el-descriptions-item label="技能要求">
                    {{ selectedCareer.skills }}
                  </el-descriptions-item>
                </el-descriptions>
              </section>

              <!-- 职业描述 -->
              <section class="detail-section">
                <h3>职业描述</h3>
                <p class="description">{{ selectedCareer.description }}</p>
              </section>

              <!-- 工作职责 -->
              <section class="detail-section">
                <h3>工作职责</h3>
                <ul class="responsibility-list">
                  <li v-for="(item, index) in selectedCareer.responsibilities" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </section>

              <!-- 发展路径 -->
              <section class="detail-section">
                <h3>发展路径</h3>
                <el-steps :active="2" direction="vertical">
                  <el-step 
                    v-for="(step, index) in selectedCareer.careerPath"
                    :key="index"
                    :title="step.position"
                    :description="step.description"
                  />
                </el-steps>
              </section>

              <!-- 相关证书 -->
              <section class="detail-section">
                <h3>相关证书</h3>
                <div class="certificate-list">
                  <el-tag
                    v-for="cert in selectedCareer.certificates"
                    :key="cert"
                    class="certificate-item"
                    effect="dark"
                  >
                    {{ cert }}
                  </el-tag>
                </div>
              </section>
            </div>
          </el-scrollbar>
        </el-card>
        <el-empty v-else description="请选择职业查看详细信息" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Money, School, Timer, Star, Share, FolderOpened } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 职业类型定义
interface Career {
  id: number
  name: string
  category: string
  level: string
  salary: string
  education: string
  experience: string
  skills: string
  description: string
  responsibilities: string[]
  careerPath: Array<{
    position: string
    description: string
  }>
  certificates: string[]
  tags: string[]
}

// 职业分类
const categories = [
  { id: 'tech', name: '技术类' },
  { id: 'finance', name: '金融类' },
  { id: 'management', name: '管理类' },
  { id: 'creative', name: '创意类' },
  { id: 'medical', name: '医疗类' },
  { id: 'education', name: '教育类' }
]

// 模拟职业数据
const careers: Career[] = [
  {
    id: 1,
    name: '软件工程师',
    category: 'tech',
    level: '快速发展期',
    salary: '15k-30k',
    education: '本科及以上',
    experience: '3-5年',
    skills: 'Java, Spring Boot, MySQL, Redis',
    description: '软件工程师负责设计、开发和维护软件系统，需要具备扎实的编程功底和系统设计能力。',
    responsibilities: [
      '参与软件系统的设计和开发',
      '编写高质量、可维护的代码',
      '解决技术难题和性能优化',
      '参与代码评审和技术分享'
    ],
    careerPath: [
      { position: '初级工程师', description: '基础编码工作' },
      { position: '中级工程师', description: '独立负责模块开发' },
      { position: '高级工程师', description: '系统架构设计' },
      { position: '技术专家', description: '技术战略规划' }
    ],
    certificates: [
      'Oracle认证工程师',
      'AWS解决方案架构师',
      'PMP项目管理认证'
    ],
    tags: ['高薪', '发展快', '技术导向']
  }
]

const activeCategory = ref('tech')
const searchQuery = ref('')
const selectedCareer = ref<Career | null>(null)
const sortBy = ref('salary')

// 获取分类职业数量
const getCategoryCount = (categoryId: string) => {
  return careers.filter(career => career.category === categoryId).length
}

// 获取当前分类名称
const getCurrentCategoryName = () => {
  const category = categories.find(c => c.id === activeCategory.value)
  return category ? category.name : ''
}

// 获取职业等级样式
const getCareerLevelType = (level: string) => {
  const levelMap: Record<string, string> = {
    '快速发展期': 'success',
    '稳定发展期': 'warning',
    '成熟期': 'info'
  }
  return levelMap[level] || 'info'
}

// 过滤后的职业列表
const filteredCareers = computed(() => {
  let result = careers.filter(career => {
    const matchCategory = career.category === activeCategory.value
    const matchSearch = !searchQuery.value || 
      career.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })

  // 排序
  result.sort((a, b) => {
    if (sortBy.value === 'salary') {
      return parseInt(b.salary) - parseInt(a.salary)
    }
    return 0
  })

  return result
})

// 处理分类选择
const handleCategorySelect = (categoryId: string) => {
  activeCategory.value = categoryId
  selectedCareer.value = null
}

// 选择职业
const selectCareer = (career: Career) => {
  selectedCareer.value = career
}

// 收藏职业
const handleSaveCareer = () => {
  ElMessage.success('收藏成功')
}

// 分享职业
const handleShareCareer = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}
</script>

<style scoped>
.career-library {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.filter-card,
.career-list-card,
.career-detail-card {
  height: calc(100vh - 100px);
}

.filter-header {
  margin-bottom: 16px;
}

.category-menu {
  border-right: none;
}

.career-count {
  margin-left: 4px;
  color: #909399;
  font-size: 12px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.career-list {
  padding: 10px;
}

.career-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
}

.career-item:hover,
.career-item.active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary);
}

.career-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.career-item-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--el-color-primary);
}

.career-brief {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
}

.career-brief .el-icon {
  margin-right: 4px;
}

.career-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.career-detail {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.description {
  line-height: 1.6;
  color: #606266;
}

.responsibility-list {
  padding-left: 20px;
  margin: 0;
  color: #606266;
}

.responsibility-list li {
  margin-bottom: 8px;
}

.certificate-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.certificate-item {
  margin-bottom: 8px;
}

:deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 0;
}
</style> 