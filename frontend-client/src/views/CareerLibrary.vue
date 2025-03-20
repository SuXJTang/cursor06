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
            <div v-for="category in categories" :key="category.id">
              <el-sub-menu v-if="category.subcategories && category.subcategories.length" :index="String(category.id)">
                <template #title>
                  <el-icon><FolderOpened /></el-icon>
                  <span>{{ category.name }}</span>
                </template>
                
                <div v-for="subcategory in category.subcategories" :key="subcategory.id">
                  <el-sub-menu v-if="subcategory.subcategories && subcategory.subcategories.length" :index="String(subcategory.id)">
                    <template #title>
                      <el-icon><Folder /></el-icon>
                      <span>{{ subcategory.name }}</span>
                    </template>
                    
                    <el-menu-item 
                      v-for="thirdCategory in subcategory.subcategories" 
                      :key="thirdCategory.id" 
                      :index="String(thirdCategory.id)"
                    >
                      <el-icon><Document /></el-icon>
                      <span>{{ thirdCategory.name }}</span>
                    </el-menu-item>
                  </el-sub-menu>
                  
                  <el-menu-item v-else :index="String(subcategory.id)">
                    <el-icon><Document /></el-icon>
                    <span>{{ subcategory.name }}</span>
                  </el-menu-item>
                </div>
              </el-sub-menu>
              
              <el-menu-item v-else :index="String(category.id)">
                <el-icon><Document /></el-icon>
                <span>{{ category.name }}</span>
              </el-menu-item>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { 
  Search, 
  Money, 
  School, 
  Timer, 
  Star, 
  Share, 
  Document, 
  Folder, 
  FolderOpened 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '@/api/request'

// 职业类型定义
interface Career {
  id: number;
  name: string;
  category: string;
  level: string;
  salary: string;
  education: string;
  experience: string;
  skills: string;
  description: string;
  responsibilities: string[];
  careerPath: Array<{
    position: string;
    description: string;
  }>;
  certificates: string[];
  tags: string[];
}

// 职业分类
const categories = ref([]);
const activeCategory = ref('');
const searchQuery = ref('');
const selectedCareer = ref<Career | null>(null);
const sortBy = ref('salary');
const router = useRouter();

// 获取职业分类数据
const fetchCategories = async () => {
  try {
    // 从本地存储获取token，使用auth_token作为键名
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      console.error('未找到认证token')
      ElMessage.error('请先登录后再访问')
      // 添加重定向到登录页的逻辑
      router.push('/login')
      return
    }
    
    // 使用封装好的request发送请求
    const response = await request({
      url: '/api/v1/career-categories/roots',
      method: 'GET',
      params: {
        include_children: true,
        include_all_children: true
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // 处理响应数据
    if (response) {
      categories.value = response;
      console.log('分类数据:', response);
      
      if (response.length > 0) {
        // 默认选择第一个分类
        activeCategory.value = String(response[0].id);
        // 获取第一个分类的职业数据
        fetchCareers(activeCategory.value);
      }
    }
  } catch (error) {
    console.error('获取职业分类出错:', error);
    
    // 显示详细错误信息
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error('请先登录后再访问')
        // 添加跳转到登录页面的逻辑
        router.push('/login')
      } else {
        ElMessage.error(`获取职业分类失败: ${error.response.status} ${error.response.data?.detail || ''}`)
      }
    } else if (error.request) {
      ElMessage.error('服务器未响应，请检查网络连接')
    } else {
      ElMessage.error(`请求错误: ${error.message}`)
    }
  }
}

// 获取特定分类的职业数据
const fetchCareers = async (categoryId: string) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('未找到认证token')
      return
    }
    
    // 显示加载状态
    ElMessage.info('正在加载职业数据...')
    
    // 获取职业数据
    const response = await request({
      url: '/api/v1/careers/',
      method: 'GET',
      params: {
        category_id: categoryId,
        limit: 50,  // 限制返回数量
        offset: 0   // 从第一条开始
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response && response.items) {
      // 更新职业数据
      careers.value = response.items.map(item => ({
        id: item.id,
        name: item.name,
        category: String(item.category_id),
        level: item.development_stage || '稳定发展期',
        salary: item.salary_range || '薪资未知',
        education: item.education_requirement || '学历未知',
        experience: item.experience_requirement || '经验未知',
        skills: item.skills_required || '',
        description: item.description || '暂无描述',
        responsibilities: item.responsibilities 
          ? item.responsibilities.split('\n').filter(r => r.trim()) 
          : ['暂无职责描述'],
        careerPath: [
          { position: '初级', description: item.entry_level_description || '入门级职位' },
          { position: '中级', description: item.mid_level_description || '有经验职位' },
          { position: '高级', description: item.senior_level_description || '资深职位' }
        ],
        certificates: item.certifications 
          ? item.certifications.split(',').map(c => c.trim()).filter(c => c) 
          : ['暂无认证信息'],
        tags: item.tags 
          ? item.tags.split(',').map(t => t.trim()).filter(t => t) 
          : ['暂无标签']
      }));
      
      console.log(`已加载 ${careers.value.length} 个职业数据`);
      
      // 如果没有选中的职业，自动选择第一个
      if (careers.value.length > 0 && !selectedCareer.value) {
        selectedCareer.value = careers.value[0];
      }
    } else {
      // 如果没有数据，清空职业列表
      careers.value = [];
      selectedCareer.value = null;
      console.log('该分类下没有职业数据');
    }
  } catch (error) {
    console.error('获取职业数据出错:', error);
    ElMessage.error('获取职业数据失败');
    careers.value = []; // 清空数据
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  fetchCategories()
})

// 递归查找分类
const findCategory = (id, categoryList) => {
  for (const category of categoryList || []) {
    if (String(category.id) === String(id)) {
      return category
    }
    
    // 查找子分类
    if (category.subcategories) {
      const found = findCategory(id, category.subcategories)
      if (found) return found
    }
  }
  return null
}

// 获取分类职业数量
const getCategoryCount = (categoryId) => {
  return careers.value.filter(career => career.category === categoryId).length || 0
}

// 获取当前分类名称
const getCurrentCategoryName = () => {
  const category = findCategory(activeCategory.value, categories.value)
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
  let result = careers.value.filter(career => {
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
  // 加载所选分类的职业数据
  fetchCareers(categoryId)
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

// 模拟职业数据 (改为空数组，数据将从API获取)
const careers = ref<Career[]>([]);
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