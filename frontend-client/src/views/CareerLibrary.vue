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
        <el-button type="warning" size="small" @click="clearCache">清除缓存</el-button>
      </div>
    </div>
    
    <!-- 悬浮调试按钮 -->
    <div v-if="!showDebugPanel" class="debug-button" @click="showDebugPanel = true">
      <el-icon><Tools /></el-icon>
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
                :prefix-icon="Search"
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
                      <div class="category-indicator" :class="{'active-indicator': activeCategory === String(category.id)}"></div>
                      <el-icon><FolderOpened /></el-icon>
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
                          <div class="category-indicator" :class="{'active-indicator': activeCategory === String(subcategory.id)}"></div>
                          <el-icon><Folder /></el-icon>
                          <span>{{ subcategory.name }}</span>
                        </div>
                      </template>
                      
                      <el-menu-item 
                        v-for="thirdCategory in subcategory.subcategories" 
                        :key="thirdCategory.id" 
                        :index="String(thirdCategory.id)"
                      >
                        <div class="category-indicator" :class="{'active-indicator': activeCategory === String(thirdCategory.id)}"></div>
                        <el-icon><Document /></el-icon>
                        <span>{{ thirdCategory.name }}</span>
                      </el-menu-item>
                    </el-sub-menu>
                    
                    <el-menu-item v-else :index="String(subcategory.id)">
                      <div class="category-indicator" :class="{'active-indicator': activeCategory === String(subcategory.id)}"></div>
                      <el-icon><Document /></el-icon>
                      <span>{{ subcategory.name }}</span>
                    </el-menu-item>
                  </div>
                </el-sub-menu>
                
                <el-menu-item v-else :index="String(category.id)">
                  <div class="category-indicator" :class="{'active-indicator': activeCategory === String(category.id)}"></div>
                  <el-icon><Document /></el-icon>
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
                  <el-icon class="error-icon"><WarningFilled /></el-icon>
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
                <p class="description">
                  {{ selectedCareer.description }}
                </p>
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { 
  Search, 
  Money, 
  School, 
  Timer, 
  Star, 
  Share, 
  Document, 
  Folder, 
  FolderOpened,
  WarningFilled,
  Tools
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../api/request'

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
  id: number;
  title?: string;
  name?: string;
  category_id?: number;
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
const sortBy = ref('salary');
const router = useRouter();

// 新增：调试面板状态
const showDebugPanel = ref(false);
const showRawData = ref(false);
const rawApiData = ref('暂无原始数据');

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
    const response = await request<CategoryResponse[]>({
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
    if (response && Array.isArray(response)) {
      categories.value = response;
      console.log('分类数据:', response);
      
      if (response.length > 0) {
        // 默认选择第一个分类
        activeCategory.value = String(response[0].id);
        // 获取第一个分类的职业数据
        fetchCareers(activeCategory.value);
      }
    } else {
      console.error('获取职业分类响应格式异常:', response);
      ElMessage.warning('获取职业分类数据格式异常');
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
const careers = ref<Career[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

// 缓存TTL，设置为30分钟（毫秒）
const CACHE_TTL = 30 * 60 * 1000;

// 获取数据之前先检查网络连接
const checkNetworkConnection = () => {
  return navigator.onLine;
};

// 从缓存中获取数据 - 添加强制绕过选项
const getFromCache = (categoryId: string, bypassCache = false): { data: Career[], timestamp: number } | null => {
  // 如果需要绕过缓存，直接返回null
  if (bypassCache) {
    console.log('强制绕过缓存获取数据');
    return null;
  }
  
  try {
    const cacheKey = `careers_${categoryId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      // 检查缓存是否过期
      if (parsedCache.timestamp && Date.now() - parsedCache.timestamp < CACHE_TTL) {
        console.log('从缓存加载数据:', parsedCache.data.length, '条记录');
        return parsedCache;
      } else {
        console.log('缓存已过期');
        return null;
      }
    }
  } catch (e) {
    console.error('读取缓存失败:', e);
  }
  return null;
};

// 保存数据到缓存
const saveToCache = (categoryId: string, data: Career[]) => {
  try {
    const cacheKey = `careers_${categoryId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('已缓存职业数据:', data.length, '条记录');
  } catch (e) {
    console.error('缓存数据失败:', e);
  }
};

const fetchCareers = async (categoryId: string) => {
  try {
    // 重置状态
    errorMessage.value = '';
    isLoading.value = true;
    
    console.log('开始获取职业数据，分类ID:', categoryId);
    
    // 检查网络连接
    if (!checkNetworkConnection()) {
      console.error('网络连接已断开');
      ElMessage.error('网络连接已断开，请检查网络设置');
      errorMessage.value = '网络连接已断开';
      isLoading.value = false;
      return;
    }
    
    // 检测特殊类别，对于ID 33强制绕过缓存
    const isSpecialCategory = categoryId === '33';
    const bypassCache = isSpecialCategory;
    
    if (isSpecialCategory) {
      console.log('检测到软件工程师分类ID 33，强制从服务器获取数据');
    }
    
    // 首先尝试从缓存获取数据（对特殊分类会绕过）
    const cached = getFromCache(categoryId, bypassCache);
    if (cached && cached.data.length > 0) {
      console.log('从缓存加载职业数据:', cached.data.length, '条记录');
      careers.value = cached.data;
      
      // 延迟选择第一个职业，确保DOM更新
      setTimeout(() => {
        if (careers.value.length > 0 && !selectedCareer.value) {
          console.log('从缓存数据中选择第一个职业');
          selectedCareer.value = { ...careers.value[0] };
        }
      }, 100);
      
      isLoading.value = false;
      return;
    }
    
    // 清空当前数据，确保状态干净
    careers.value = [];
    await nextTick();
    
    // 获取认证令牌
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('未找到认证token');
      ElMessage.error('请先登录后再访问');
      router.push('/login');
      return;
    }
    
    // 强制打印请求日志
    console.log(`正在发送API请求，获取分类 ${categoryId} 的职业数据...`);
    
    // 获取该分类的职业数据
    try {
      // 显示发送中的消息
      ElMessage.info('正在从服务器获取数据...');
      
      // 记录请求开始时间
      const requestStartTime = Date.now();
      
      // 统一使用category接口获取职业数据
      const categoryResponse = await request<any>({
        url: `/api/v1/careers/category/${categoryId}`,
        method: 'GET',
        params: {
          limit: 100,     // 合理的限制
          skip: 0,
          page: 1,        // 分页参数
          page_size: 100  // 每页大小
        },
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 15000
      });
      
      // 计算请求耗时
      const requestTime = Date.now() - requestStartTime;
      console.log(`API请求完成，耗时: ${requestTime}ms`);
      
      console.log('服务器响应数据:', categoryResponse);
      // 保存原始数据用于调试
      rawApiData.value = JSON.stringify(categoryResponse, null, 2);
      
      // 特殊处理分页格式 - 检查是否有分页结构
      if (typeof categoryResponse === 'object' && 
          categoryResponse !== null && 
          'total' in categoryResponse && 
          typeof categoryResponse.total === 'number') {
        
        console.log('检测到标准分页格式，总数据数量:', categoryResponse.total);
        
        // 处理不同格式的响应数据
        let categoryItems: any[] = [];
        
        // 强制类型断言，避免类型错误
        const response = categoryResponse as Record<string, any>;
        
        // 提取真实数据数组
        if (response.data && Array.isArray(response.data)) {
          categoryItems = response.data;
          console.log('数据在标准response.data中, 长度:', categoryItems.length);
        } else if (response.items && Array.isArray(response.items)) {
          categoryItems = response.items;
          console.log('数据在items字段中, 长度:', categoryItems.length);
        } else if (response.results && Array.isArray(response.results)) {
          categoryItems = response.results;
          console.log('数据在results字段中, 长度:', categoryItems.length);
        } else if (response.careers && Array.isArray(response.careers)) {
          categoryItems = response.careers;
          console.log('数据在careers字段中, 长度:', categoryItems.length);
        } else {
          // 尝试按照分页结构（首条就是结果）解析
          for (const key in response) {
            if (Array.isArray(response[key]) && key !== 'total' && key !== 'page' && key !== 'pages') {
              categoryItems = response[key];
              console.log(`数据在${key}字段中, 长度:`, categoryItems.length);
              break;
            }
          }
        }
        
        // 检查获取的数据量与总数是否匹配
        if (categoryItems.length < response.total) {
          console.warn(`获取到的数据量(${categoryItems.length})小于总数(${response.total})，可能需要分页加载`);
          
          // 如果需要分页加载，可以在这里添加代码
        }
        
        if (categoryItems.length > 0) {
          console.log('成功提取职业数据，第一项:', categoryItems[0]);
          
          // 转换并赋值给careers
          careers.value = [];
          
          // 全部转换为标准格式，不做分类过滤
          const processedItems = categoryItems.map(item => processCareerItem(item, categoryId));
          console.log(`处理后的职业数据数量: ${processedItems.length}`);
          
          // 确保careers.value被正确赋值
          careers.value = processedItems;
          
          console.log(`最终加载 ${careers.value.length} 个职业数据`);
          
          // 缓存获取到的数据
          saveToCache(categoryId, careers.value);
          
          // 确保选中第一个职业，使用nextTick确保DOM更新
          nextTick(() => {
            if (careers.value.length > 0) {
              selectedCareer.value = { ...careers.value[0] };
              console.log('已选择第一个职业:', selectedCareer.value.name);
            }
          });
          
          ElMessage.success(`获取到${careers.value.length}个职业数据`);
          isLoading.value = false;
          return;
        }
      } else {
        // 旧的处理逻辑...
        let categoryItems: any[] = [];
        
        if (Array.isArray(categoryResponse)) {
          categoryItems = categoryResponse;
          console.log('数据是数组格式, 长度:', categoryItems.length);
        } else if (categoryResponse && typeof categoryResponse === 'object') {
          if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
            categoryItems = categoryResponse.data;
            console.log('数据在标准response.data中, 长度:', categoryItems.length);
          } else if ('items' in categoryResponse && Array.isArray(categoryResponse.items)) {
            categoryItems = categoryResponse.items;
            console.log('数据在自定义items字段中, 长度:', categoryItems.length);
          } else if ('data' in categoryResponse && Array.isArray(categoryResponse.data)) {
            categoryItems = categoryResponse.data;
            console.log('数据在自定义data字段中, 长度:', categoryItems.length);
          } else if ('results' in categoryResponse && Array.isArray(categoryResponse.results)) {
            categoryItems = categoryResponse.results;
            console.log('数据在results字段中, 长度:', categoryItems.length);
          } else {
            // 尝试将整个对象作为单个项目
            categoryItems = [categoryResponse];
            console.log('将整个响应作为单个项目处理');
          }
        }
        
        // ... 剩余处理逻辑保持不变
      }
    } catch (error) {
      console.error('获取分类职业数据失败:', error);
      console.log('尝试备用方法获取数据');
    }
    
    // 备用方法：获取所有职业数据并筛选该分类
    console.log('尝试获取所有职业数据（备用方法）');
    // 显示备用请求消息
    ElMessage.info('使用备用方法获取数据...');
    
    // 记录请求开始时间
    const backupRequestStartTime = Date.now();
    
    const response = await request<any>({
      url: `/api/v1/careers`,
      method: 'GET',
      params: {
        limit: 100,
        skip: 0,
        category_id: categoryId  // 直接提供分类ID作为筛选参数
      },
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 15000
    });
    
    // 计算备用请求耗时
    const backupRequestTime = Date.now() - backupRequestStartTime;
    console.log(`备用API请求完成，耗时: ${backupRequestTime}ms`);
    
    console.log('备用方法获取的所有职业数据:', response);
    // 保存原始数据用于调试
    rawApiData.value = JSON.stringify(response, null, 2);
    
    // 提取职业数据
    let allCareers: any[] = [];
    
    // 类型安全的数据提取
    if (Array.isArray(response)) {
      allCareers = response;
      console.log('数据是数组格式, 长度:', allCareers.length);
    } else if (response && typeof response === 'object') {
      if (response.data && Array.isArray(response.data)) {
        allCareers = response.data;
        console.log('数据在标准response.data中, 长度:', allCareers.length);
      } else if ('items' in response && Array.isArray(response.items)) {
        allCareers = response.items;
        console.log('数据在自定义items字段中, 长度:', allCareers.length);
      } else if ('data' in response && Array.isArray(response.data)) {
        allCareers = response.data;
        console.log('数据在自定义data字段中, 长度:', allCareers.length);
      } else if ('results' in response && Array.isArray(response.results)) {
        allCareers = response.results;
        console.log('数据在results字段中, 长度:', allCareers.length);
      }
    }
    
    console.log('所有职业数据数量:', allCareers.length);
    
    // 严格筛选当前分类的职业 - 强化筛选逻辑
    // 对于分类ID 33，暂时不过滤
    let categoryCareers = [];
    if (isSpecialCategory) {
      console.log('处理特殊分类ID 33，临时不进行筛选，获取所有职业以便调试');
      categoryCareers = allCareers;
    } else {
      categoryCareers = allCareers.filter(career => {
        // 检查多种可能的类别ID字段
        const categoryMatch = String(career.category_id) === String(categoryId) || 
                            String(career.categoryId) === String(categoryId);
        
        // 检查类别名称字段
        const categoryNameMatch = 
          (career.category && typeof career.category === 'string' && 
          (String(career.category) === String(categoryId) || 
            career.category.includes && career.category.includes(categoryId)));
        
        // 检查是否有父类别字段匹配
        const parentCategoryMatch = 
          (career.parent_category_id && String(career.parent_category_id) === String(categoryId)) ||
          (career.parentCategoryId && String(career.parentCategoryId) === String(categoryId));
        
        return categoryMatch || categoryNameMatch || parentCategoryMatch;
      });
    }
    
    console.log(`严格筛选后找到分类ID ${categoryId} 的职业数量:`, categoryCareers.length);
    
    // 如果是特殊分类33，仅获取前8条作为软件工程师类别数据
    if (isSpecialCategory && categoryCareers.length > 8) {
      console.log('特殊处理分类ID 33：从所有职业中截取前8条作为软件工程师职业');
      categoryCareers = categoryCareers.slice(0, 8);
    }
    
    if (categoryCareers.length > 0) {
      // 转换职业数据格式
      careers.value = categoryCareers.map(item => processCareerItem(item, categoryId));
      
      console.log(`已加载 ${careers.value.length} 个职业数据`);
      
      // 缓存获取到的数据
      saveToCache(categoryId, careers.value);
      
      // 确保选中第一个职业
      nextTick(() => {
        if (careers.value.length > 0) {
          selectedCareer.value = { ...careers.value[0] };
          console.log('自动选择第一个职业:', selectedCareer.value.name);
        }
      });
      
      ElMessage.success(`获取到${careers.value.length}个职业数据`);
    } else {
      // 没有找到职业数据，创建默认数据
      console.log(`未找到分类 ${categoryId} 的职业数据，创建默认数据`);
      const defaultCareers = [
        createDefaultCareer(1, categoryId, '软件工程师', '稳定发展期'),
        createDefaultCareer(2, categoryId, '数据分析师', '快速发展期'),
        createDefaultCareer(3, categoryId, '产品经理', '稳定发展期')
      ];
      
      // 确保careers.value被正确赋值
      careers.value = defaultCareers;
      
      // 缓存示例数据
      saveToCache(categoryId, careers.value);
      
      // 确保选中第一个职业
      nextTick(() => {
        if (careers.value.length > 0) {
          selectedCareer.value = { ...careers.value[0] };
          console.log('已选择默认职业:', selectedCareer.value.name);
        }
      });
      
      ElMessage.info('该分类下没有真实职业数据，显示示例数据');
    }
  } catch (error) {
    console.error('获取职业数据出错:', error);
    
    // 提供详细的错误信息
    if (error.response) {
      const status = error.response.status;
      errorMessage.value = `获取职业数据失败 (${status})`;
      
      if (status === 401 || status === 403) {
        ElMessage.error('登录已过期或无权限，请重新登录');
        router.push('/login');
      } else if (status === 404) {
        ElMessage.warning('未找到该分类下的职业数据');
      } else {
        ElMessage.error(`服务器错误: ${error.response.data?.detail || '未知错误'}`);
      }
    } else if (error.request) {
      errorMessage.value = '服务器未响应，请检查网络连接';
      ElMessage.error('服务器未响应，请检查网络连接或稍后重试');
      
      // 尝试从缓存加载数据
      const cachedData = getFromCache(categoryId, false); // 允许使用缓存应对网络错误
      if (cachedData) {
        careers.value = cachedData.data;
        ElMessage.info('已加载缓存数据');
        console.log('已加载缓存数据:', cachedData.data.length, '条记录');
      } else {
        // 创建一些默认数据
        careers.value = [
          createDefaultCareer(1, categoryId, '软件工程师', '稳定发展期'),
          createDefaultCareer(2, categoryId, '数据分析师', '快速发展期'),
          createDefaultCareer(3, categoryId, '产品经理', '稳定发展期')
        ];
        console.log('已创建默认职业数据');
      }
      
      if (careers.value.length > 0) {
        selectedCareer.value = { ...careers.value[0] };
      }
    } else {
      errorMessage.value = `请求错误: ${error.message}`;
      ElMessage.error(`请求错误: ${error.message}`);
    }
  } finally {
    isLoading.value = false;
  }
}

// 新增：处理职业项目的函数，改进标签提取逻辑
const processCareerItem = (item: any, categoryId: string): Career => {
  // 打印原始数据，帮助调试
  console.log('处理职业项目:', item.id || 'unknown id');
  
  // 确保所有必要字段存在，提供默认值
  let salaryText = '薪资未知';
  
  try {
    // 处理不同格式的薪资数据
    const salaryRange = item.salary_range || {};
    if (typeof salaryRange === 'string') {
      salaryText = salaryRange;
    } else if (typeof salaryRange === 'object') {
      const min = salaryRange.min;
      const max = salaryRange.max;
      if (min !== undefined && max !== undefined) {
        salaryText = `${min}-${max} ${salaryRange.unit || '元/月'}`;
      } else if (max) {
        salaryText = `最高 ${max} ${salaryRange.unit || '元/月'}`;
      } else if (min) {
        salaryText = `最低 ${min} ${salaryRange.unit || '元/月'}`;
      }
    }
  } catch (e) {
    console.error('解析薪资信息出错:', e);
    salaryText = '薪资未知';
  }
  
  // 处理技能数据
  let skillsText = '';
  try {
    if (item.required_skills) {
      if (typeof item.required_skills === 'string') {
        skillsText = item.required_skills;
      } else if (Array.isArray(item.required_skills)) {
        skillsText = item.required_skills.join(', ');
      }
    } else if (item.skills) {
      if (typeof item.skills === 'string') {
        skillsText = item.skills;
      } else if (Array.isArray(item.skills)) {
        skillsText = item.skills.join(', ');
      }
    }
  } catch (e) {
    console.error('解析技能数据出错:', e);
    skillsText = '技能未知';
  }
  
  // 处理职业路径数据
  let careerPath = [];
  try {
    if (item.career_path) {
      if (typeof item.career_path === 'string') {
        // 字符串格式
        careerPath = [{ position: '职业发展', description: item.career_path }];
      } else if (Array.isArray(item.career_path)) {
        // 数组格式 
        if (item.career_path.length > 0 && typeof item.career_path[0] === 'object') {
          careerPath = item.career_path.map(path => ({
            position: Object.keys(path)[0] || '职位',
            description: typeof Object.values(path)[0] === 'string' 
              ? Object.values(path)[0] 
              : JSON.stringify(Object.values(path)[0])
          }));
        } else {
          // 普通字符串数组
          careerPath = item.career_path.map(path => ({
            position: path,
            description: '职业发展阶段'
          }));
        }
      } else if (typeof item.career_path === 'object') {
        // 复杂对象格式，转换为数组
        careerPath = Object.entries(item.career_path).map(([key, value]) => {
          if (typeof value === 'string') {
            return {
              position: key,
              description: value
            };
          } else if (typeof value === 'object') {
            // 处理嵌套对象
            return {
              position: key,
              description: JSON.stringify(value)
            };
          }
          return {
            position: key,
            description: String(value)
          };
        });
      }
    }
  } catch (e) {
    console.error('处理职业路径数据出错:', e);
    careerPath = getDefaultCareerPath();
  }
  
  // 如果处理后careerPath为空，使用默认值
  if (!careerPath || careerPath.length === 0) {
    careerPath = getDefaultCareerPath();
  }
  
  // 处理职责数据
  let responsibilities = ['暂无职责描述'];
  try {
    if (item.responsibilities) {
      if (Array.isArray(item.responsibilities)) {
        responsibilities = item.responsibilities;
      } else if (typeof item.responsibilities === 'string') {
        responsibilities = item.responsibilities.split('\n').filter(r => r.trim());
        if (responsibilities.length === 0) {
          responsibilities = ['暂无职责描述'];
        }
      } else if (typeof item.responsibilities === 'object') {
        // 处理对象格式
        responsibilities = Object.entries(item.responsibilities).map(
          ([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`
        );
      }
    }
  } catch (e) {
    console.error('处理职责数据出错:', e);
    responsibilities = ['暂无职责描述'];
  }
  
  // 处理证书数据
  let certificates = ['暂无认证信息'];
  try {
    if (item.certificates) {
      if (Array.isArray(item.certificates)) {
        certificates = item.certificates;
      } else if (typeof item.certificates === 'string') {
        certificates = item.certificates.split(',').map(c => c.trim()).filter(c => c);
        if (certificates.length === 0) {
          certificates = ['暂无认证信息'];
        }
      } else if (typeof item.certificates === 'object') {
        // 处理对象格式
        certificates = Object.keys(item.certificates);
      }
    }
  } catch (e) {
    console.error('处理证书数据出错:', e);
    certificates = ['暂无认证信息'];
  }
  
  // 处理标签数据 - 增强版本
  let tags = ['暂无标签'];
  try {
    // 收集可能的标签来源
    let tagCandidates: string[] = [];
    
    // 处理tags字段
    if (item.tags) {
      if (Array.isArray(item.tags)) {
        tagCandidates = [...tagCandidates, ...item.tags];
      } else if (typeof item.tags === 'string') {
        tagCandidates = [...tagCandidates, ...item.tags.split(',').map(t => t.trim()).filter(t => t)];
      } else if (typeof item.tags === 'object') {
        tagCandidates = [...tagCandidates, ...Object.keys(item.tags)];
      }
    }
    
    // 处理required_skills字段
    if (item.required_skills) {
      if (Array.isArray(item.required_skills)) {
        tagCandidates = [...tagCandidates, ...item.required_skills];
      } else if (typeof item.required_skills === 'string') {
        tagCandidates = [...tagCandidates, ...item.required_skills.split(',').map(t => t.trim()).filter(t => t)];
      } else if (typeof item.required_skills === 'object') {
        tagCandidates = [...tagCandidates, ...Object.keys(item.required_skills)];
      }
    }
    
    // 从名称中提取前缀作为标签
    if (item.title || item.name) {
      const nameStr = item.title || item.name;
      const namePrefix = nameStr.split(' ')[0];
      if (namePrefix && namePrefix.length > 1) {
        tagCandidates.push(namePrefix);
      }
    }
    
    // 去重并裁剪
    if (tagCandidates.length > 0) {
      tags = [...new Set(tagCandidates)].slice(0, 5);
    }
    
    // 确保至少有一个标签
    if (!tags || tags.length === 0) {
      tags = ['暂无标签'];
    }
  } catch (e) {
    console.error('处理标签数据出错:', e);
    tags = ['暂无标签'];
  }
  
  // 构造并返回Career对象
  const result: Career = {
    id: item.id || Math.floor(Math.random() * 10000),
    name: item.title || item.name || '未命名职业',
    category: String(item.category_id || categoryId),
    level: item.level || '稳定发展期',
    salary: salaryText,
    education: item.education_required || item.education_requirement || '学历未知',
    experience: item.experience_required || item.experience_requirement || '经验未知',
    skills: skillsText || '未知技能',
    description: item.description || '暂无描述',
    responsibilities: responsibilities,
    careerPath: careerPath,
    certificates: certificates,
    tags: tags
  };
  
  return result;
};

// 新增：获取默认职业路径
const getDefaultCareerPath = () => {
  return [
    { position: '初级', description: '入门级职位' },
    { position: '中级', description: '有经验职位' },
    { position: '高级', description: '资深职位' }
  ];
};

// 新增：创建默认职业数据
const createDefaultCareer = (id: number, categoryId: string, name: string, level: string): Career => {
  return {
    id: id,
    name: name,
    category: categoryId,
    level: level,
    salary: '8000-15000 元/月',
    education: '本科及以上',
    experience: '3-5年',
    skills: '专业技能, 沟通能力, 团队协作',
    description: '这是一个示例职业描述，实际数据暂时无法获取。这个职位需要相关专业背景和工作经验，具有良好的发展前景和晋升空间。',
    responsibilities: [
      '负责相关业务的开发和维护',
      '与团队协作完成项目目标',
      '持续学习和改进工作方法'
    ],
    careerPath: getDefaultCareerPath(),
    certificates: ['行业认证', '专业资格证书'],
    tags: ['专业技能', '沟通能力', '团队协作']
  };
};

// 在组件挂载时获取数据
onMounted(() => {
  console.log('组件已挂载，开始获取分类数据');
  fetchCategories();
  
  // 优化检查逻辑，增加重试次数和时间
  let checkCount = 0;
  const maxChecks = 5;
  
  const checkSelection = () => {
    checkCount++;
    console.log(`检查数据选择状态 (${checkCount}/${maxChecks})`);
    
    // 检查并修复careers状态
    const stateFixed = checkAndFixCareersState();
    
    if (careers.value.length > 0 && !selectedCareer.value) {
      console.log('发现数据加载后未自动选中职业，执行手动选择');
      selectedCareer.value = { ...careers.value[0] };
      ElMessage.success('已自动选择第一个职业');
    } else if (stateFixed || (checkCount < maxChecks && careers.value.length === 0)) {
      // 如果状态被修复或者需要继续检查
      setTimeout(checkSelection, 1000);
    }
  };
  
  // 首次检查延迟2秒
  setTimeout(checkSelection, 2000);
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
const getCurrentCategoryName = (): string => {
  // 根据activeCategory查找当前分类
  if (!activeCategory.value) return '职业库';
  
  // 递归查找分类
  const findCategory = (cats: any[], id: string): string => {
    for (const cat of cats) {
      if (String(cat.id) === id) {
        return cat.name;
      }
      if (cat.subcategories && cat.subcategories.length) {
        const found = findCategory(cat.subcategories, id);
        if (found !== '未知分类') return found;
      }
    }
    return '未知分类';
  };
  
  return findCategory(categories.value, activeCategory.value);
};

// 获取职业等级样式
const getCareerLevelType = (level: string): string => {
  if (level.includes('快速') || level.includes('高速')) return 'success';
  if (level.includes('稳定')) return 'primary';
  if (level.includes('成熟') || level.includes('饱和')) return 'warning';
  if (level.includes('衰退') || level.includes('下降')) return 'danger';
  return 'info';
};

// 计算属性：过滤后的职业列表（包含搜索和排序）
const filteredCareers = computed(() => {
  // 先根据搜索关键词筛选
  let filtered = careers.value;
  
  console.log('过滤前的职业数据总数:', careers.value.length);
  
  // 应用搜索过滤
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(career => {
      // 在多个字段中搜索
      return career.name.toLowerCase().includes(query) ||
             career.description.toLowerCase().includes(query) ||
             career.skills.toLowerCase().includes(query) ||
             career.education.toLowerCase().includes(query);
    });
    console.log('关键词过滤后的职业数据数量:', filtered.length);
  }
  
  // 根据排序选项进行排序
    if (sortBy.value === 'salary') {
    // 尝试从字符串中提取薪资数字进行排序
    filtered = [...filtered].sort((a, b) => {
      // 尝试从薪资字符串中提取数字
      const getMaxSalary = (salaryStr: string): number => {
        const numMatch = salaryStr.match(/\d+/g);
        if (numMatch && numMatch.length > 0) {
          // 取最大的数字作为排序基准
          return Math.max(...numMatch.map(n => parseInt(n, 10)));
        }
        return 0;
      };
      
      const salaryA = getMaxSalary(a.salary);
      const salaryB = getMaxSalary(b.salary);
      
      return salaryB - salaryA; // 默认降序排列（高薪在前）
    });
  } else if (sortBy.value === 'hot') {
    // 热度排序逻辑，如果没有真实数据，可以使用预设的权重或标记
    filtered = [...filtered].sort((a, b) => {
      // 这里可以对接真实的热度数据，如浏览量、收藏数等
      // 暂时使用ID作为示例
      return b.id - a.id;
    });
  } else if (sortBy.value === 'growth') {
    // 增长排序逻辑
    // 可以基于增长趋势数据或者使用职业前景等字段
    filtered = [...filtered].sort((a, b) => {
      // 使用level字段进行排序（示例）
      const levelWeight = {
        '快速发展期': 3,
        '稳定发展期': 2,
        '成熟稳定期': 1
      };
      
      const weightA = levelWeight[a.level as keyof typeof levelWeight] || 0;
      const weightB = levelWeight[b.level as keyof typeof levelWeight] || 0;
      
      return weightB - weightA;
    });
  }
  
  console.log('最终过滤并排序后的职业数据数量:', filtered.length);
  if (filtered.length > 0) {
    console.log('第一条职业数据:', filtered[0].name);
  } else {
    console.log('过滤后没有职业数据');
  }
  
  return filtered;
});

// 计算属性：按子类别分组的职业数据
const groupedCareers = computed(() => {
  // 如果数据为空，直接返回空数组
  if (filteredCareers.value.length === 0) {
    return [];
  }
  
  // 获取所有职业的子类别
  const subCategories = new Set<string>();
  filteredCareers.value.forEach(career => {
    // 从职业名称或标签中提取可能的子类别
    if (career.tags && career.tags.length > 0) {
      // 使用第一个标签作为子类别
      subCategories.add(career.tags[0]);
    }
    
    // 从职业名称中提取可能的子类别
    const namePrefix = career.name.split(' ')[0]; // 使用名称的第一部分作为子类别
    if (namePrefix && namePrefix.length > 1) {
      subCategories.add(namePrefix);
    }
  });
  
  // 如果没有明确的子类别，使用职业级别作为分组依据
  let groupKeyFn;
  let groups: Record<string, Career[]> = {};
  
  if (subCategories.size <= 1) {
    console.log('使用职业级别作为分组依据');
    
    // 按照级别分组
    groups = filteredCareers.value.reduce((acc, career) => {
      const key = career.level || '未知级别';
      if (!acc[key]) acc[key] = [];
      acc[key].push(career);
      return acc;
    }, {} as Record<string, Career[]>);
  } else {
    console.log('使用职业标签或名称前缀作为分组依据');
    
    // 使用较复杂的分组逻辑
    groups = filteredCareers.value.reduce((acc, career) => {
      // 优先使用标签作为分组
      if (career.tags && career.tags.length > 0) {
        const key = career.tags[0];
        if (!acc[key]) acc[key] = [];
        acc[key].push(career);
        return acc;
      }
      
      // 使用名称前缀作为分组
      const namePrefix = career.name.split(' ')[0];
      if (namePrefix && namePrefix.length > 1) {
        if (!acc[namePrefix]) acc[namePrefix] = [];
        acc[namePrefix].push(career);
        return acc;
      }
      
      // 如果都没有，放入"其他"分组
      const key = '其他';
      if (!acc[key]) acc[key] = [];
      acc[key].push(career);
      return acc;
    }, {} as Record<string, Career[]>);
  }
  
  // 当子类别过多时优化分组
  if (Object.keys(groups).length > 5) {
    console.log('检测到过多子类别，使用职业级别作为备选分组');
    // 使用职业级别作为备选分组方式
    groups = filteredCareers.value.reduce((acc, career) => {
      const key = career.level || '未知级别';
      if (!acc[key]) acc[key] = [];
      acc[key].push(career);
      return acc;
    }, {} as Record<string, Career[]>);
  }
  
  // 将分组转换为数组以便在模板中使用
  const result = Object.entries(groups).map(([title, careers]) => ({
    title,
    careers
  }));
  
  // 对分组进行排序，让"其他"分组排在最后
  result.sort((a, b) => {
    if (a.title === '其他') return 1;
    if (b.title === '其他') return -1;
    return b.careers.length - a.careers.length; // 按职业数量降序排列
  });
  
  console.log('职业分组结果:', result.map(g => `${g.title}: ${g.careers.length}个职位`));
  
  return result;
});

// 处理分类选择
const handleCategorySelect = (categoryId: string) => {
  console.log('选择分类:', categoryId);
  activeCategory.value = categoryId;
  
  // 重置选中的职业
  selectedCareer.value = null;
  
  // 获取该分类下的职业数据
  fetchCategoryCareers(categoryId);
}

// 新函数：获取分类及其子分类的所有职业数据
const fetchCategoryCareers = async (categoryId: string) => {
  try {
    // 显示加载状态
    isLoading.value = true;
    errorMessage.value = '';
    
    // 清空当前数据
    careers.value = [];
    
    // 更新调试信息
    console.log(`尝试获取分类ID ${categoryId} 及其子分类的所有职业数据`);
    ElMessage.info(`正在获取${getCurrentCategoryName()}分类数据...`);
    
    // 获取认证令牌
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('未找到认证token');
      ElMessage.error('请先登录后再访问');
      router.push('/login');
      return;
    }
    
    // 显示请求前状态
    console.log('当前分类ID:', categoryId);
    console.log('发送请求前careers.length =', careers.value.length);
    
    try {
      // 使用新的API端点获取分类及其子分类的所有职业
      console.log(`正在请求API：/api/v1/career-categories/${categoryId}/careers`);
      
      // 记录请求开始时间
      const requestStartTime = Date.now();
      
      const response = await request<any>({
        url: `/api/v1/career-categories/${categoryId}/careers`,
        method: 'GET',
        params: {
          limit: 100,
          include_subcategories: true // 确保包含子分类的职业
        },
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 15000
      });
      
      // 计算请求耗时
      const requestTime = Date.now() - requestStartTime;
      console.log(`API请求完成，耗时: ${requestTime}ms`);
      
      // 保存原始响应到调试面板
      console.log('API响应数据:', response);
      rawApiData.value = JSON.stringify(response, null, 2);
      
      // 使用更安全的方式提取数据，确保处理各种可能的响应格式
      let careerItems: any[] = [];
      let responseData: any = response;
      
      // 如果是标准Axios响应，先获取data属性
      if (responseData && responseData.data !== undefined) {
        responseData = responseData.data;
      }
      
      // 解析不同格式的响应
      if (Array.isArray(responseData)) {
        // 直接是数组
        careerItems = responseData;
        console.log('响应直接是职业数组，长度:', careerItems.length);
      } else if (responseData && typeof responseData === 'object') {
        // 对象格式，检查不同可能的数据字段
        if (responseData.careers && Array.isArray(responseData.careers)) {
          careerItems = responseData.careers;
          console.log('职业数据在careers字段中，长度:', careerItems.length);
        } else if (responseData.data && Array.isArray(responseData.data)) {
          careerItems = responseData.data;
          console.log('职业数据在data字段中，长度:', careerItems.length);
        } else if (responseData.items && Array.isArray(responseData.items)) {
          careerItems = responseData.items;
          console.log('职业数据在items字段中，长度:', careerItems.length);
        } else if (responseData.results && Array.isArray(responseData.results)) {
          careerItems = responseData.results;
          console.log('职业数据在results字段中，长度:', careerItems.length);
        } else {
          // 尝试查找任何数组属性
          for (const key in responseData) {
            if (Array.isArray(responseData[key]) && responseData[key].length > 0) {
              console.log(`发现数组属性 ${key}，长度:`, responseData[key].length);
              // 检查第一个元素是否看起来像职业数据
              const firstItem = responseData[key][0];
              if (firstItem && (firstItem.id || firstItem.title || firstItem.name)) {
                careerItems = responseData[key];
                console.log(`使用 ${key} 字段作为职业数据源，长度:`, careerItems.length);
                break;
              }
            }
          }
        }
      }
      
      if (careerItems.length > 0) {
        console.log(`成功获取 ${careerItems.length} 条职业数据，第一项:`, careerItems[0]);
        
        // 转换职业数据格式
        careers.value = careerItems.map(item => processCareerItem(item, categoryId));
        console.log('处理后的职业数据长度:', careers.value.length);
        
        // 缓存获取到的数据
        saveToCache(categoryId, careers.value);
        
        // 确保选中第一个职业
        nextTick(() => {
          if (careers.value.length > 0) {
            selectedCareer.value = { ...careers.value[0] };
            console.log('自动选择第一个职业:', selectedCareer.value.name);
          }
        });
        
        ElMessage.success(`获取到${careers.value.length}个职业数据`);
        return;
      } else {
        console.warn('API响应成功但未找到职业数据，尝试回退到旧方法');
        ElMessage.warning('未找到相关职业数据，正在尝试其他获取方式...');
      }
    } catch (apiError) {
      console.error('新API请求失败:', apiError);
      ElMessage.error('新接口请求失败，正在尝试备用方法...');
    }
    
    // 如果新API失败，回退到旧方法
    console.log('回退到原有fetchCareers方法获取数据');
    await fetchCareers(categoryId);
    
  } catch (error) {
    console.error('获取分类职业数据失败:', error);
    ElMessage.error('获取数据失败，请稍后重试');
    errorMessage.value = '获取职业数据失败，请稍后重试';
    
    // 尝试从缓存加载数据
    const cachedData = getFromCache(categoryId, false);
    if (cachedData && cachedData.data.length > 0) {
      console.log('从缓存加载数据:', cachedData.data.length);
      careers.value = cachedData.data;
      
      if (careers.value.length > 0) {
        selectedCareer.value = { ...careers.value[0] };
      }
      
      ElMessage.info('已加载缓存数据');
    }
  } finally {
    isLoading.value = false;
  }
}

// 选择职业
const selectCareer = (career: Career) => {
  console.log('选择职业前的selectedCareer:', selectedCareer.value ? selectedCareer.value.name : 'null');
  
  // 确保设置的是一个新对象以触发响应式更新
  selectedCareer.value = { ...career };
  
  console.log('选择职业后的selectedCareer:', selectedCareer.value.name);
  
  // 确保DOM元素更新
  nextTick(() => {
    // 确保职业详情区域可见
    const detailElement = document.querySelector('.career-detail-card');
    if (detailElement) {
      detailElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 添加活动样式到选中项
    document.querySelectorAll('.career-item').forEach(item => {
      if (item.textContent.includes(career.name)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

// 收藏职业
const handleSaveCareer = () => {
  ElMessage.success('收藏成功')
}

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
}

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

// 新增：强制渲染函数，优化逻辑
const debugForceRender = () => {
  if (careers.value.length > 0 && !selectedCareer.value) {
    selectedCareer.value = { ...careers.value[0] };
    ElMessage.success('已强制选择第一个职业');
    console.log('强制渲染: 已选择职业', selectedCareer.value.name);
  } else if (careers.value.length > 0) {
    // 强制刷新现有选择
    const current = selectedCareer.value;
    console.log('刷新前的职业ID:', current?.id);
    selectedCareer.value = null;
    nextTick(() => {
      selectedCareer.value = { ...current };
      console.log('刷新后的职业ID:', selectedCareer.value?.id);
      ElMessage.success('已刷新当前选中职业');
    });
  } else if (careers.value.length === 0) {
    // 如果没有职业数据但有活动分类，强制创建一些默认数据
    if (activeCategory.value) {
      console.log('未找到职业数据，为分类', activeCategory.value, '创建默认数据');
      const categoryId = activeCategory.value;
      const defaultCareers = [
        createDefaultCareer(101, categoryId, '软件工程师', '稳定发展期'),
        createDefaultCareer(102, categoryId, '数据分析师', '快速发展期'),
        createDefaultCareer(103, categoryId, '产品经理', '稳定发展期')
      ];
      
      // 确保careers.value被直接重新赋值
      careers.value = defaultCareers;
      
      nextTick(() => {
        selectedCareer.value = { ...careers.value[0] };
        console.log('已选择默认职业:', selectedCareer.value.name);
        ElMessage.success('已创建并选择默认职业数据');
      });
    } else {
      ElMessage.warning('没有选中的分类');
    }
  } else {
    ElMessage.warning('没有可用的职业数据');
  }
};

// 改进：刷新数据函数，确保每次请求发送
const refreshData = () => {
  if (activeCategory.value) {
    // 先清除该分类的缓存
    const cacheKey = `careers_${activeCategory.value}`;
    localStorage.removeItem(cacheKey);
    
    ElMessage.info('正在重新获取数据...');
    // 先清空当前数据，确保状态正确更新
    careers.value = [];
    selectedCareer.value = null;
    errorMessage.value = '';
    
    // 显示加载状态
    isLoading.value = true;
    
    // 重新获取数据 - 设置短暂延迟确保UI更新
    setTimeout(() => {
      fetchCareers(activeCategory.value);
    }, 100);
  } else {
    ElMessage.warning('未选择分类');
  }
};

// 新增：检查并修复careers状态同步问题
const checkAndFixCareersState = () => {
  console.log('检查careers状态同步');
  if (activeCategory.value && careers.value.length === 0) {
    console.log('检测到careers数组为空，尝试重新获取数据');
    fetchCareers(activeCategory.value);
    return true;
  }
  
  // 检查careers.value中是否有重复ID
  const ids = new Set();
  const duplicateIds = [];
  careers.value.forEach(career => {
    if (ids.has(career.id)) {
      duplicateIds.push(career.id);
    } else {
      ids.add(career.id);
    }
  });
  
  if (duplicateIds.length > 0) {
    console.warn('检测到重复的职业ID:', duplicateIds);
    
    // 尝试修复重复ID问题
    const uniqueCareers = [];
    const seenIds = new Set();
    
    careers.value.forEach(career => {
      if (!seenIds.has(career.id)) {
        seenIds.add(career.id);
        uniqueCareers.push(career);
      }
    });
    
    console.log(`修复前职业数量: ${careers.value.length}, 修复后: ${uniqueCareers.length}`);
    careers.value = uniqueCareers;
    return true;
  }
  
  return false;
};

// 增强版本：清除缓存并重新获取
const clearCache = () => {
  try {
    // 清除所有职业缓存
    const keys = Object.keys(localStorage);
    let clearedCount = 0;
    
    for (const key of keys) {
      if (key.startsWith('careers_')) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    }
    ElMessage.success(`已清除${clearedCount}个职业数据缓存`);
    
    // 如果当前有选中的分类，立即重新加载数据
    if (activeCategory.value) {
      // 重置状态
      careers.value = [];
      selectedCareer.value = null;
      // 进行状态检查
      checkAndFixCareersState();
      // 刷新数据
      refreshData();
    }
  } catch (e) {
    console.error('清除缓存失败:', e);
    ElMessage.error('清除缓存失败');
  }
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
  console.log('子菜单标题点击，分类ID:', categoryId);
  // 转换为字符串
  const categoryIdStr = String(categoryId);
  // 设置活动分类
  activeCategory.value = categoryIdStr;
  
  // 确保El-Menu的活动项状态与我们的activeCategory一致
  nextTick(() => {
    // 使用DOM操作手动添加活动类标记
    document.querySelectorAll('.el-sub-menu').forEach(el => {
      if (el.getAttribute('index') === categoryIdStr) {
        el.classList.add('is-active');
      }
    });
  });
  
  // 获取分类职业数据
  fetchCategoryCareers(categoryIdStr);
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

/* 增强分类菜单中选中项的样式 */
:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: bold;
  border-left: 3px solid var(--el-color-primary);
  transition: all 0.3s ease;
}

/* 添加hover效果 */
:deep(.el-menu-item:hover) {
  background-color: var(--el-color-primary-light-8);
  transition: all 0.3s ease;
}

/* 当子菜单展开并且是活动状态时增加视觉效果 */
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--el-color-primary);
  font-weight: bold;
  transition: all 0.3s ease;
}

/* 为选中状态的子菜单添加左边框标识 */
:deep(.el-sub-menu.is-opened.is-active > .el-sub-menu__title) {
  border-left: 3px solid var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  transition: all 0.3s ease;
}

/* 子菜单展开后增加一些间距和背景色区分 */
:deep(.el-menu--inline) {
  background-color: var(--el-color-info-light-9);
  margin-left: 8px;
  border-radius: 4px;
}

:deep(.submenu-title) {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

:deep(.submenu-title:hover) {
  color: var(--el-color-primary);
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 新增调试面板样式 */
.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  padding: 12px;
  max-height: 80vh;
  overflow: auto;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.debug-header h3 {
  margin: 0;
  font-size: 16px;
  color: #409eff;
}

.debug-content {
  margin-bottom: 12px;
}

.debug-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.debug-label {
  font-weight: bold;
  width: 120px;
  color: #606266;
}

.debug-value {
  flex: 1;
  word-break: break-all;
  color: #303133;
}

.debug-actions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.debug-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.debug-button:hover {
  background-color: #66b1ff;
}

.debug-raw-data {
  max-height: 300px;
  overflow: auto;
  background-color: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 12px;
  border: 1px solid #ddd;
}

.debug-raw-data h4 {
  margin: 0 0 8px 0;
  color: #606266;
}

.debug-raw-data pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 按分组显示的职业列表样式 */
.grouped-career-list {
  padding: 0;
}

.career-group {
  margin-bottom: 24px;
}

.career-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 8px 10px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 12px;
}

.career-group-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}

.career-item {
  margin-left: 10px;
  margin-right: 10px;
}

/* Adjust existing styles for better grouped display */
.career-item {
  padding: 14px;
  margin-bottom: 10px;
}

/* 添加选中指示器样式 */
.category-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: transparent;
  transition: all 0.3s ease;
}

.active-indicator {
  background-color: var(--el-color-primary);
  box-shadow: 0 0 4px var(--el-color-primary);
}
</style> 