<template>
  <div class="career-library">
    <!-- 调试面板 -->
    <div v-if="showDebugPanel" class="debug-panel">
      <div class="debug-header">
        <h3>调试面板</h3>
        <el-button size="small" @click="showDebugPanel = false">关闭</el-button>
      </div>
      <div class="debug-content">
        <div class="debug-item">
          <div class="debug-label">当前分类ID:</div>
          <div class="debug-value">{{ activeCategory }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">分类总数:</div>
          <div class="debug-value">{{ categories.length }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">职业总数:</div>
          <div class="debug-value">{{ careers.length }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">筛选后职业数:</div>
          <div class="debug-value">{{ filteredCareers.length }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">已选职业:</div>
          <div class="debug-value">{{ selectedCareer?.name || '无' }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">加载状态:</div>
          <div class="debug-value">{{ isLoading ? '加载中' : '加载完成' }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">错误信息:</div>
          <div class="debug-value">{{ errorMessage || '无' }}</div>
        </div>
        <div class="debug-item">
          <div class="debug-label">API原始数据:</div>
          <div class="debug-value">
            <el-button type="info" size="small" @click="showRawData = !showRawData">
              {{ showRawData ? '隐藏' : '显示' }}原始数据
            </el-button>
          </div>
        </div>
        <div v-if="showRawData" class="debug-raw-data">
          <h4>原始数据:</h4>
          <pre>{{ rawApiData }}</pre>
        </div>
      </div>
      <div class="debug-actions">
        <el-button type="primary" size="small" @click="debugForceRender">强制渲染</el-button>
        <el-button type="success" size="small" @click="refreshData">刷新数据</el-button>
        <el-button type="warning" size="small" @click="debugClearCache">清除缓存</el-button>
      </div>
    </div>
    
    <!-- 悬浮调试按钮 -->
    <div v-if="!showDebugPanel" class="debug-button" @click="showDebugPanel = true">
      <el-icon><ElementIcons.Tools /></el-icon>
    </div>
    
    <el-row :gutter="20">
      <!-- 左侧分类和搜索 -->
      <el-col :span="6">
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <el-input
                v-model="searchQuery"
                placeholder="搜索职业..."
                :prefix-icon="ElementIcons.Search"
                clearable
              />
            </div>
          </template>
          <el-scrollbar height="calc(100vh - 180px)">
            <el-menu
              :default-active="activeCategory"
              class="category-menu"
              @select="handleCategorySelect"
            >
              <div v-for="category in categories" :key="category.id">
                <el-sub-menu v-if="category.subcategories && category.subcategories.length" :index="String(category.id)">
                  <template #title>
                    <div 
                      class="submenu-title" 
                      @click.stop="handleSubMenuTitleClick(category.id)"
                    >
                      <div class="category-indicator" :class="{'active-indicator': activeCategory === String(category.id)}" />
                      <el-icon><ElementIcons.Folder /></el-icon>
                      <span>{{ category.name }}</span>
                    </div>
                  </template>
                  
                  <div v-for="subcategory in category.subcategories" :key="subcategory.id">
                    <el-sub-menu v-if="subcategory.subcategories && subcategory.subcategories.length" :index="String(subcategory.id)">
                      <template #title>
                        <div 
                          class="submenu-title" 
                          @click.stop="handleSubMenuTitleClick(subcategory.id)"
                        >
                          <div class="category-indicator" :class="{'active-indicator': activeCategory === String(subcategory.id)}" />
                          <el-icon><ElementIcons.Folder /></el-icon>
                          <span>{{ subcategory.name }}</span>
                        </div>
                      </template>
                      
                      <el-menu-item 
                        v-for="thirdCategory in subcategory.subcategories" 
                        :key="thirdCategory.id" 
                        :index="String(thirdCategory.id)"
                      >
                        <div class="category-indicator" :class="{'active-indicator': activeCategory === String(thirdCategory.id)}" />
                        <el-icon><ElementIcons.Document /></el-icon>
                        <span>{{ thirdCategory.name }}</span>
                      </el-menu-item>
                    </el-sub-menu>
                    
                    <el-menu-item v-else :index="String(subcategory.id)">
                      <div class="category-indicator" :class="{'active-indicator': activeCategory === String(subcategory.id)}" />
                      <el-icon><ElementIcons.Document /></el-icon>
                      <span>{{ subcategory.name }}</span>
                    </el-menu-item>
                  </div>
                </el-sub-menu>
                
                <el-menu-item v-else :index="String(category.id)">
                  <div class="category-indicator" :class="{'active-indicator': activeCategory === String(category.id)}" />
                  <el-icon><ElementIcons.Document /></el-icon>
                  <span>{{ category.name }}</span>
                </el-menu-item>
              </div>
            </el-menu>
          </el-scrollbar>
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
                  <el-radio-button label="salary">
                    薪资
                  </el-radio-button>
                  <el-radio-button label="hot">
                    热度
                  </el-radio-button>
                  <el-radio-button label="growth">
                    增长
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          
          <!-- 添加加载状态 -->
          <el-scrollbar height="calc(100vh - 180px)">
            <!-- 加载中显示 -->
            <div v-if="isLoading" class="loading-container">
              <el-skeleton :rows="8" animated />
            </div>
            
            <!-- 错误消息显示 -->
            <div v-else-if="errorMessage" class="error-container">
              <el-empty :description="errorMessage">
                <template #image>
                  <el-icon class="error-icon"><ElementIcons.WarningFilled /></el-icon>
                </template>
                <el-button @click="retryFetchCareers">重试</el-button>
              </el-empty>
            </div>
            
            <!-- 空数据显示 -->
            <div v-else-if="filteredCareers.length === 0" class="empty-container">
              <el-empty description="该分类下暂无职业数据">
                <el-button type="primary" @click="handleGoToCategory">
                  浏览其他分类
                </el-button>
              </el-empty>
            </div>
            
            <!-- 正常数据显示（按子类别分组） -->
            <div v-else class="career-list grouped-career-list">
              <div v-for="group in groupedCareers" :key="group.title" class="career-group">
                <div class="career-group-header">
                  <h4>{{ group.title }}</h4>
                  <el-tag size="small" type="info">{{ group.careers.length }}个职位</el-tag>
                </div>
                
                <div 
                  v-for="career in group.careers"
                  :key="career.id"
                  class="career-item"
                  :class="{ active: selectedCareer?.id === career.id }"
                  @click="selectCareer(career)"
                >
                  <div v-if="isCareerFavorited(career.id)" class="favorite-icon" @click.stop="toggleFavorite(career)">
                    <el-icon color="#FFD700">
                      <ElementIcons.Star fill="true" />
                    </el-icon>
                  </div>
                  <div class="career-item-header">
                    <h4>{{ career.name }}</h4>
                  </div>
                  <div class="career-level">
                    <el-tag :type="getCareerLevelType(career.level)" size="small">
                      {{ career.level }}
                    </el-tag>
                  </div>
                  <div class="career-brief">
                    <div class="salary-range">
                      <el-icon><ElementIcons.Money /></el-icon>
                      {{ career.salary }}
                    </div>
                    <div class="education-req">
                      <el-icon><ElementIcons.School /></el-icon>
                      {{ career.education }}
                    </div>
                    <div class="experience-req">
                      <el-icon><ElementIcons.Timer /></el-icon>
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
              
              <!-- 分页控件 -->
              <div class="pagination-container" v-if="totalPages > 1">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalItems"
                  @size-change="handleSizeChange"
                  @current-change="handlePageChange"
                  background
                />
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
                  <el-icon><ElementIcons.Star /></el-icon>{{ isFavorite ? '取消收藏' : '收藏' }}
                </el-button>
                <el-button @click="handleShareCareer">
                  <el-icon><ElementIcons.Share /></el-icon>分享
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
                <p class="description">
                  {{ selectedCareer.description }}
                </p>
              </section>

              <!-- 公司信息部分 - 新增 -->
              <section v-if="selectedCareer.companyName" class="detail-section">
                <h3>公司信息</h3>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="公司名称">
                    <div class="company-name">
                      <img v-if="selectedCareer.companyLogo" :src="selectedCareer.companyLogo" class="company-logo" alt="公司Logo">
                      {{ selectedCareer.companyName }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item label="公司行业">
                    {{ selectedCareer.companyField || '未知' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="公司性质">
                    {{ selectedCareer.companyNature || '未知' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="公司规模">
                    {{ selectedCareer.companySize || '未知' }}
                  </el-descriptions-item>
                </el-descriptions>
                <div v-if="selectedCareer.companyInfo" class="company-info">
                  <h4>公司简介</h4>
                  <p>{{ selectedCareer.companyInfo }}</p>
                </div>
                <div v-if="selectedCareer.companyLink" class="company-link">
                  <a :href="selectedCareer.companyLink" target="_blank">访问公司网站</a>
                </div>
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
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import request from '../api/request'
import { ElMessage } from 'element-plus'
// 导入所有图标
import * as ElementIcons from '@element-plus/icons-vue'
import { useCareerStore } from '../stores/career'
// 导入收藏相关API
import { addFavoriteCareer, removeFavoriteCareer, checkIsFavorite } from '@/api/favorites'

// 职业类型定义
interface Career {
  id: string | number;
  name: string;
  category: string;
  level: string;
  salary: string;
  education: string;
  experience: string;
  skills: string;
  description: string;
  responsibilities: string[];
  careerPath: Array<{ position: string; description: string }>;
  certificates: string[];
  tags: string[];
  companyName: string;
  companyLogo: string;
  companyField: string;
  companyNature: string;
  companySize: string;
  companyLink: string;
  companyInfo: string;
}

// API响应类型
interface CategoryResponse {
  id: number;
  name: string;
  parent_id?: number | null;
  subcategories?: CategoryResponse[];
  [key: string]: any;
}

// API职业数据响应类型
interface CareerResponse {
  id: string | number;
  title?: string;
  name?: string;
  category_id?: string | number;
  education_required?: string;
  education_requirement?: string;
  experience_required?: string;
  experience_requirement?: string;
  salary_range?: string | { min?: number; max?: number; unit?: string };
  required_skills?: string[] | string;
  description?: string;
  responsibilities?: string[] | string;
  career_path?: string | Record<string, string> | Record<string, string>[];
  certificates?: string[] | string;
  level?: string;
  // 增加新字段
  company_name?: string;
  company_logo?: string;
  company_field?: string;
  company_nature?: string;
  company_size?: string;
  company_link?: string;
  company_info?: string;
  skill_tags?: string | string[];
  [key: string]: any;
}

interface ApiResponse<T> {
  items?: T[];
  total?: number;
  page?: number;
  [key: string]: any;
}

// 职业分类
const categories = ref<CategoryResponse[]>([]);
const activeCategory = ref('');
const searchQuery = ref('');
const selectedCareer = ref<Career | null>(null);
const selectedCareerId = ref<number | null>(null);
const isFavorite = ref(false);
const sortBy = ref('salary');
const router = useRouter();
const authStore = useAuthStore();

// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);

// 新增：调试面板状态
const showDebugPanel = ref(false);
const showRawData = ref(false);
const rawApiData = ref('暂无原始数据');

// 在setup函数内
const careerStore = useCareerStore()

// 职业列表和加载状态
const careers = ref<Career[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

// 收藏职业相关
const favoriteCareers = ref<Career[]>([]);

// 计算属性：过滤后的职业列表
const filteredCareers = computed(() => {
  // 如果有搜索关键字，根据关键字过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    return careers.value.filter(career => 
      career.name.toLowerCase().includes(query) || 
      career.tags.some(tag => tag.toLowerCase().includes(query)) ||
      career.description.toLowerCase().includes(query)
    );
  }
  
  // 否则返回所有职业
  return careers.value;
});

// 计算属性：按子类别分组的职业列表
const groupedCareers = computed(() => {
  const sortedCareers = [...filteredCareers.value].sort((a, b) => {
    if (sortBy.value === 'salary') {
      // 薪资排序逻辑 (假设薪资格式为 "5k-10k" 或类似)
      const extractMinSalary = (salaryStr: string): number => {
        const match = salaryStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      return extractMinSalary(b.salary) - extractMinSalary(a.salary);
    } else if (sortBy.value === 'hot') {
      // 热度排序，这里简单地按字母顺序排序
      return a.name.localeCompare(b.name);
    } else {
      // 其他排序逻辑
      return 0;
    }
  });
  
  // 按职业等级分组
  const grouped: { title: string; careers: Career[] }[] = [];
  const groups: Record<string, Career[]> = {};
  
  // 分组逻辑
  sortedCareers.forEach(career => {
    const groupKey = career.level || '未分类';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(career);
  });
  
  // 转换为数组格式
  Object.keys(groups).forEach(title => {
    grouped.push({
      title,
      careers: groups[title]
    });
  });
  
  return grouped;
});

// 工具函数：检查网络连接
const checkNetworkConnection = () => {
  return navigator.onLine;
};

// 职业数据处理
const processCareerItem = (item: any, categoryId: string): Career => {
  return {
    id: item.id || item.career_id || '',
    name: item.name || item.title || `职业${item.id}`,
    title: item.title || item.name || '',
    category: item.category || categoryId || '',
    level: item.level || item.career_level || '初级',
    salary: item.salary || item.salary_range || '面议',
    education: item.education || item.education_required || '不限',
    experience: item.experience || item.experience_required || '不限',
    skills: item.skills || (Array.isArray(item.required_skills) ? item.required_skills.join(', ') : (item.required_skills || '')),
    description: item.description || '暂无描述',
    responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : 
      (typeof item.responsibilities === 'string' ? [item.responsibilities] : ['职责描述暂无']),
    careerPath: item.career_path || [],
    certificates: Array.isArray(item.certificates) ? item.certificates : 
      (typeof item.certificates === 'string' ? [item.certificates] : []),
    tags: Array.isArray(item.tags) ? item.tags : 
      (typeof item.tags === 'string' ? [item.tags] : [])
  };
};

// 创建默认职业数据
const createDefaultCareer = (id: string, categoryId: string, name: string, level: string): Career => {
  return {
    id,
    name,
    title: name,
    category: categoryId,
    level,
    salary: '5k-15k',
    education: '本科',
    experience: '1-3年',
    skills: '专业技能, 沟通能力',
    description: '这是一个示例职业描述，展示职业的基本情况和工作内容。',
    responsibilities: [
      '负责相关专业工作',
      '与团队协作完成项目',
      '持续学习和改进工作方法'
    ],
    careerPath: [
      { position: '初级', description: '入门阶段' },
      { position: '中级', description: '进阶阶段' },
      { position: '高级', description: '专业阶段' }
    ],
    certificates: ['行业认证', '专业资格证书'],
    tags: ['专业技能', '沟通能力', '团队协作'],
    companyName: '',
    companyLogo: '',
    companyField: '',
    companyNature: '',
    companySize: '',
    companyLink: '',
    companyInfo: ''
  };
};

// 缓存数据
const saveToCache = (categoryId: string, data: Career[]) => {
  try {
    if (!data || data.length === 0) {
      console.warn('试图缓存空数据，categoryId:', categoryId);
      return;
    }
    
    // 同时保存到Pinia存储
    careerStore.updateCareers(categoryId, adaptCareerForStore(data, categoryId));
    
    // 保存到本地存储作为备份
    const cacheKey = `careers_${categoryId}`;
    const cacheData = {
      timestamp: Date.now(),
      data: data
    };
    
    // 将数据转为JSON字符串
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`成功缓存职业数据 (categoryId: ${categoryId}), ${data.length} 条记录`);
  } catch (error) {
    console.error('缓存职业数据失败:', error);
  }
};

// 获取职业数据
const fetchCareers = async (categoryId: string) => {
  try {
    // 重置状态
    errorMessage.value = '';
    isLoading.value = true;
    
    console.log('开始获取职业数据，分类ID:', categoryId, '页码:', currentPage.value, '每页数量:', pageSize.value);
    
    // 检查网络连接
    if (!checkNetworkConnection()) {
      console.error('网络连接已断开');
      ElMessage.error('网络连接已断开，请检查网络设置');
      errorMessage.value = '网络连接已断开';
      isLoading.value = false;
      return;
    }
    
    // 获取认证令牌
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('未找到认证token');
      ElMessage.error('请先登录后再访问');
      router.push('/login');
      return;
    }
    
    // 使用正确的API端点获取职业数据，添加分页参数
    const response = await request<any>({
      url: '/api/v1/careers',
      method: 'GET',
      params: {
        category_id: categoryId,
        page: currentPage.value,
        per_page: pageSize.value
      },
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 15000
    });
    
    // 更新调试面板中的原始数据
    rawApiData.value = JSON.stringify(response, null, 2);
    
    console.log('API响应数据:', response);
    
    // 处理响应数据
    let careerItems: any[] = [];
    
    // 解析不同格式的响应
    if (response) {
      // 提取职业列表数据
      if (response.items && Array.isArray(response.items)) {
        careerItems = response.items;
      } else if (response.data && Array.isArray(response.data)) {
        careerItems = response.data;
      } else if (response.careers && Array.isArray(response.careers)) {
        careerItems = response.careers;
      } else if (response.results && Array.isArray(response.results)) {
        careerItems = response.results;
      } else if (Array.isArray(response)) {
        careerItems = response;
      }
      
      // 提取分页信息
      totalItems.value = response.total || response.count || careerItems.length;
      
      // 如果响应中包含页码信息，优先使用
      if (response.page) {
        currentPage.value = response.page;
      }
      
      // 如果响应中包含每页数量信息，优先使用
      if (response.per_page) {
        pageSize.value = response.per_page;
      } else if (response.page_size) {
        pageSize.value = response.page_size;
      } else if (response.limit) {
        pageSize.value = response.limit;
      }
    }
    
    console.log(`获取到 ${careerItems.length} 条职业数据，总计 ${totalItems.value} 条`);
    
    // 计算总页数
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);
    
    if (careerItems.length > 0) {
      // 转换职业数据格式
      careers.value = careerItems.map(item => processCareerItem(item, categoryId));
      
      console.log(`已加载第 ${currentPage.value}/${totalPages.value} 页，${careers.value.length} 条职业数据`);
      
      // 缓存获取到的数据
      saveToCache(categoryId, careers.value);
      
      // 确保选中第一个职业，使用nextTick确保DOM更新
      nextTick(() => {
        if (careers.value.length > 0 && !selectedCareer.value) {
          selectedCareer.value = { ...careers.value[0] };
          console.log('已选择第一个职业:', selectedCareer.value.name);
        }
      });
      
      ElMessage.success(`获取到${careers.value.length}个职业数据`);
    } else {
      // 没有找到职业数据，创建默认数据
      console.log(`未找到分类 ${categoryId} 的职业数据，创建默认数据`);
      const defaultCareers = [
        createDefaultCareer('1', categoryId, '软件工程师', '稳定发展期'),
        createDefaultCareer('2', categoryId, '数据分析师', '快速发展期'),
        createDefaultCareer('3', categoryId, '产品经理', '稳定发展期')
      ];
      
      // 确保careers.value被正确赋值
      careers.value = defaultCareers;
      totalItems.value = defaultCareers.length;
      totalPages.value = 1;
      
      // 缓存示例数据
      saveToCache(categoryId, careers.value);
      
      // 确保选中第一个职业
      nextTick(() => {
        if (careers.value.length > 0) {
          selectedCareer.value = { ...careers.value[0] };
          console.log('已选择默认职业:', selectedCareer.value.name);
        }
      });
      
      ElMessage.info('该分类下没有职业数据，显示示例数据');
    }
  } catch (error: any) {
    console.error('获取职业数据失败:', error);
    errorMessage.value = `获取职业数据失败: ${error.message || '未知错误'}`;
    ElMessage.error(errorMessage.value);
    careers.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 切换页码的处理函数
const handlePageChange = (page: number) => {
  console.log(`切换到第 ${page} 页`);
  currentPage.value = page;
  fetchCareers(activeCategory.value);
};

// 切换每页显示数量的处理函数
const handleSizeChange = (size: number) => {
  console.log(`修改每页显示数量为 ${size} 条`);
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
  fetchCareers(activeCategory.value);
};

// 选择职业
const selectCareer = (career: Career) => {
  console.log('选择职业:', career.name);
  
  // 更新当前选中的职业
  selectedCareer.value = { ...career };
  selectedCareerId.value = Number(career.id);
  
  // 检查是否已收藏
  checkIsFavorite(career.id);
  
  // 确保DOM元素更新
  nextTick(() => {
    // 滚动到详情
    const detailsElement = document.querySelector('.career-details');
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 添加活动样式到选中项
    document.querySelectorAll('.career-item').forEach(item => {
      if (item.textContent && item.textContent.includes(career.name)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
};

// 收藏职业
const handleSaveCareer = async () => {
  try {
    if (!selectedCareerId.value) {
      ElMessage.warning('请先选择职业');
      return;
    }
    
    if (!authStore.isAuthenticated) {
      ElMessage.warning('请先登录');
      router.push('/login');
      return;
    }
    
    console.log('保存/取消收藏职业ID:', selectedCareerId.value, '类型:', typeof selectedCareerId.value);
    
    try {
      // 安全转换为整数
      const numericId = safeParseInt(selectedCareerId.value);
      
      // 添加请求调试信息
      const token = localStorage.getItem('auth_token');
      console.log('当前令牌:', token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : '未设置');
      console.log('认证状态:', authStore.isAuthenticated ? '已登录' : '未登录');
      
      if (isFavorite.value) {
        // 已收藏，取消收藏
        console.log(`准备取消收藏: ${numericId}`);
        
        // 使用正确的DELETE API端点
        const url = `/api/v1/careers/${numericId}/favorite`;
        console.log(`调用API: ${url} (DELETE)`);
        
        try {
          // 使用DELETE方法
          const response = await request.delete(url);
          console.log('API响应:', response);
          
          isFavorite.value = false;
          // 从收藏集合中移除
          favoriteCareersIds.value.delete(String(selectedCareerId.value));
          ElMessage.success('已取消收藏');
        } catch (apiError) {
          console.error('API调用失败:', apiError);
          
          // 详细记录API错误信息
          if (apiError.response) {
            console.error('错误状态码:', apiError.response.status);
            console.error('错误头信息:', apiError.response.headers);
            console.error('错误数据:', apiError.response.data);
            
            // 尝试使用备用方法
            if (apiError.response.status === 404 || apiError.response.status === 422) {
              console.log('尝试使用备用方法...');
              const success = await tryFallbackFavorite(numericId, 'delete');
              
              if (success) {
                favoriteCareersIds.value.delete(String(selectedCareerId.value));
                
                // 如果当前选中的职业就是这个，也要更新其状态
                if (String(selectedCareerId.value) === String(selectedCareer.value?.id)) {
                  isFavorite.value = false;
                }
                
                ElMessage.success('已取消收藏 (备用方法)');
                return;
              }
            }
            
            // 根据错误码提供更具体的提示
            const statusCode = apiError.response.status;
            if (statusCode === 401) {
              ElMessage.error('请重新登录');
              router.push('/login');
            } else if (statusCode === 404) {
              ElMessage.error('职业不存在');
            } else if (statusCode === 422) {
              ElMessage.error('参数验证错误: ' + 
                (apiError.response.data.detail || '请检查职业ID格式'));
            } else {
              ElMessage.error(`操作失败 (${statusCode}): ${apiError.response.data.message || '未知错误'}`);
            }
          } else {
            ElMessage.error('网络连接失败，请稍后重试');
          }
        }
      } else {
        // 未收藏，添加收藏
        console.log(`准备添加收藏: ${numericId}`);
        
        // 使用正确的POST API端点
        const url = `/api/v1/careers/${numericId}/favorite`;
        console.log(`调用API: ${url} (POST)`);
        
        try {
          // 使用POST方法
          const response = await request.post(url);
          console.log('API响应:', response);
          
          isFavorite.value = true;
          // 添加到收藏集合
          favoriteCareersIds.value.add(String(selectedCareerId.value));
          ElMessage.success('收藏成功');
        } catch (apiError) {
          console.error('API调用失败:', apiError);
          
          // 详细记录API错误信息
          if (apiError.response) {
            console.error('错误状态码:', apiError.response.status);
            console.error('错误头信息:', apiError.response.headers);
            console.error('错误数据:', apiError.response.data);
            
            // 尝试使用备用方法
            if (apiError.response.status === 404 || apiError.response.status === 422) {
              console.log('尝试使用备用方法...');
              const success = await tryFallbackFavorite(numericId, 'add');
              
              if (success) {
                favoriteCareersIds.value.add(String(selectedCareerId.value));
                
                // 如果当前选中的职业就是这个，也要更新其状态
                if (String(selectedCareerId.value) === String(selectedCareer.value?.id)) {
                  isFavorite.value = true;
                }
                
                ElMessage.success('收藏成功 (备用方法)');
                return;
              }
            }
            
            // 根据错误码提供更具体的提示
            const statusCode = apiError.response.status;
            if (statusCode === 401) {
              ElMessage.error('请重新登录');
              router.push('/login');
            } else if (statusCode === 404) {
              ElMessage.error('职业不存在');
            } else if (statusCode === 422) {
              ElMessage.error('参数验证错误: ' + 
                (apiError.response.data.detail || '请检查职业ID格式'));
            } else {
              ElMessage.error(`操作失败 (${statusCode}): ${apiError.response.data.message || '未知错误'}`);
            }
          } else {
            ElMessage.error('网络连接失败，请稍后重试');
          }
        }
      }
    } catch (conversionError) {
      console.error('ID转换失败:', conversionError);
      ElMessage.error('无效的职业ID格式');
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    // 增加更详细的错误信息
    if (error.response) {
      console.error('错误响应数据:', error.response.data);
      console.error('错误状态码:', error.response.status);
      ElMessage.error(`操作失败 (${error.response.status}): ${error.response.data.message || '未知错误'}`);
    } else {
      ElMessage.error('操作失败，请稍后重试');
    }
  }
};

// 分享职业
const handleShareCareer = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

// 重试获取职业数据
const retryFetchCareers = () => {
  if (activeCategory.value) {
    ElMessage.info('正在重新获取数据...');
    errorMessage.value = '';
    fetchCareers(activeCategory.value);
  }
};

// 处理空数据显示
const handleGoToCategory = () => {
  // 跳转到第一个有数据的分类
  // 这里简单地选择第一个根分类
  if (categories.value.length > 0) {
    const firstCat = categories.value[0];
    handleCategorySelect(String(firstCat.id));
    ElMessage.info(`已切换到${firstCat.name}分类`);
  }
}

// 刷新数据
const refreshData = async () => {
  ElMessage.info('正在刷新所有数据...');
  
  // 清空缓存
  clearCache();
  
  // 重新获取分类数据
  await fetchCategories();
  
  ElMessage.success('数据已刷新');
};

// 清除缓存
const clearCache = () => {
  // 清除与职业相关的所有缓存
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('careers_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  ElMessage.success(`已清除${keysToRemove.length}项缓存数据`);
};

// 检查并修复职业数据状态
const checkAndFixCareersState = () => {
  if (careers.value.length === 0 && activeCategory.value) {
    console.log('检测到空职业数据，尝试重新获取分类:', activeCategory.value);
    fetchCategoryCareers(activeCategory.value);
    return true;
  }
  return false;
};

// 修复渲染问题：使用更强大的watch，监视多个可能影响渲染的值
watch([() => careers.value.length, activeCategory], ([careersLength, newCategory]) => {
  console.log(`watch触发: careers长度=${careersLength}, 分类=${newCategory}`);
  
  // 如果有职业数据但没有选中职业，选择第一个
  if (careersLength > 0 && !selectedCareer.value) {
    nextTick(() => {
      console.log('watch: 职业数据已更新，自动选择第一个职业');
      selectedCareer.value = { ...careers.value[0] };
    });
  }
}, { immediate: true });

// 添加特殊处理ID 33的监视
watch(() => activeCategory.value, (newCategory) => {
  if (newCategory === '33') {
    console.log('检测到软件工程师分类(ID 33)被选中');
    
    // 强制刷新此分类数据
    console.log('强制刷新软件工程师分类数据');
    
    // 清除该分类的缓存
    const cacheKey = `careers_${newCategory}`;
    localStorage.removeItem(cacheKey);
    
    // 清空当前数据
    careers.value = [];
    selectedCareer.value = null;
    
    // 立即重新获取数据
    fetchCareers(newCategory);
  }
}, { immediate: true });

// 新增函数：处理子菜单标题点击事件
const handleSubMenuTitleClick = (categoryId: number | string) => {
  console.log('点击子菜单标题:', categoryId);
  handleCategorySelect(String(categoryId));
};

// 处理分类选择
const handleCategorySelect = (categoryId: string) => {
  console.log('选择分类:', categoryId);
  
  // 更新当前选中的分类
  activeCategory.value = categoryId;
  
  // 重置分页参数
  currentPage.value = 1;
  
  // 获取该分类下的职业数据
  fetchCategoryCareers(categoryId);
};

// 处理职业选择
const handleCareerSelect = (career: Career) => {
  selectCareer(career);
}

// 检查职业是否已收藏 - 强化版
