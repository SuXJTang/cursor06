<template>
  <div class="career-library-container">
    <!-- 左侧分类面板 -->
    <div class="category-panel category-sidebar">
      <div class="search-box category-search">
        <input type="text" placeholder="搜索职业..." v-model="searchText" />
      </div>
      <div v-if="loadingCategories" class="loading-indicator">
        <div class="spinner"></div>
        <span>加载分类中...</span>
      </div>
      <div v-else class="category-tree">
        <div v-for="category in filteredCategories" :key="category.id" class="category-item first-level">
          <div 
            class="category-title folder-item"
            :class="{'active': selectedCategory === category.id, 'folder-expanded': expandedCategories.includes(category.id)}"
            @click="toggleCategory(category.id)"
          >
            <i class="folder-icon el-icon-folder" :class="{'el-icon-folder-opened': expandedCategories.includes(category.id)}"></i>
            <span class="folder-label">{{ category.name }}</span>
            <i v-if="category.children && category.children.length > 0" 
               class="toggle-icon el-icon-arrow-right"
               :class="{'el-icon-arrow-down': expandedCategories.includes(category.id)}"></i>
          </div>
          <div v-if="category.children && expandedCategories.includes(category.id)" class="subcategories second-level">
            <div 
              v-for="subcat in category.children" 
              :key="subcat.id" 
              class="subcategory-item"
            >
              <div 
                class="folder-item"
                :class="{'active': selectedSubcategory === subcat.id, 'folder-expanded': expandedSubcategories.includes(subcat.id)}"
                @click.stop="toggleSubcategory(subcat.id)"
              >
                <i class="folder-icon el-icon-folder" :class="{'el-icon-folder-opened': expandedSubcategories.includes(subcat.id)}"></i>
                <span class="folder-label">{{ subcat.name }}</span>
                <i v-if="subcat.children && subcat.children.length > 0" 
                   class="toggle-icon el-icon-arrow-right"
                   :class="{'el-icon-arrow-down': expandedSubcategories.includes(subcat.id)}"></i>
              </div>
              
              <div v-if="subcat.children && expandedSubcategories.includes(subcat.id)" class="third-level">
                <div 
                  v-for="thirdCat in subcat.children" 
                  :key="thirdCat.id" 
                  class="third-level-item"
                >
                  <div 
                    class="folder-item"
                  :class="{'active': selectedThirdLevel === thirdCat.id}"
                  @click.stop="selectThirdLevel(thirdCat.id)"
                >
                    <i class="folder-icon el-icon-document"></i>
                    <span class="folder-label">{{ thirdCat.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div v-if="!loadingCategories && filteredCategories.length === 0" class="no-data">
        没有找到相关分类
      </div>
    </div>

    <!-- 中间职业列表面板 -->
    <div class="career-list-panel">
      <div class="career-list-header">
        <div class="category-navigation">
          <h3>{{ getActiveCategoryName() }}</h3>
          <div class="career-count" v-if="careers.length > 0">{{ totalCareers }}个职位</div>
        </div>
        <div class="tabs">
          <div class="tab active">新奇</div>
          <div class="tab">热度</div>
          <div class="tab">增长</div>
        </div>
      </div>
      <div class="filter-bar">
        <span>排序方式:</span>
        <select v-model="sortMethod">
          <option value="relevance">相关度</option>
          <option value="salary">薪资高低</option>
        </select>
      </div>
      <div v-if="loadingCareers" class="loading-indicator">
        <div class="spinner"></div>
        <span>加载职业中...</span>
      </div>
      <div v-else-if="careers.length === 0" class="no-data">
        没有找到相关职业，请选择其他分类
      </div>
      <div v-else class="career-items">
        <div 
          v-for="career in sortedCareers" 
          :key="career.id" 
          class="career-item"
          :class="{'selected': selectedCareer === career.id}"
          @click="selectCareer(career.id)"
        >
          <!-- 收藏图标 -->
          <div 
            class="favorite-icon" 
            v-if="favoritesLoaded && isCareerInFavorites(career.id)" 
            :title="'已收藏'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          
          <div class="career-main-info">
          <h4>{{ career.title }}</h4>
            <!-- 添加公司名称显示 -->
            <div class="career-company" v-if="career.company_name || career.company">
              {{ career.company_name || career.company || '未知公司' }}
            </div>
            <div class="career-salary" :title="JSON.stringify(career)">
              {{ formatSalaryFromCareer(career) }}
          </div>
            <div class="career-education">
              <span class="edu-badge">{{ career.education_required || '本科' }}</span>
              <span class="experience-badge">{{ career.experience_required || '3-5年' }}</span>
        </div>
            <div class="career-tags">
              <span v-for="(tag, tagIndex) in getCareeerTags(career)" :key="tagIndex" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination" v-if="careers.length > 0">
        <button :disabled="currentPage <= 1" @click="prevPage">上一页</button>
        <span>{{ currentPage }} / {{ totalPages || 1 }}</span>
        <button :disabled="currentPage >= totalPages" @click="nextPage">下一页</button>
      </div>
    </div>

    <!-- 右侧详情面板 -->
    <div class="career-detail-panel">
      <div v-if="loadingDetail" class="loading-indicator">
        <div class="spinner"></div>
        <span>加载职业详情中...</span>
      </div>
      <div v-else-if="currentCareerDetail" class="career-detail">
        <div class="detail-header">
          <h2>{{ currentCareerDetail.title }}</h2>
          <div class="header-actions">
            <button class="favorite-btn" @click="toggleFavorite" :class="{'is-favorite': isFavorite}">
              <span class="action-icon">{{ isFavorite ? '⭐️' : '☆' }}</span>
              收藏
            </button>
            <button class="share-btn">
              <span class="action-icon">↗</span>
              分享
            </button>
          </div>
        </div>
        
        <!-- 公司信息部分 -->
        <div class="company-info-section" v-if="currentCareerDetail.company_name">
          <div class="company-header">
            <img v-if="currentCareerDetail.company_logo" :src="currentCareerDetail.company_logo" class="company-logo" alt="公司logo">
            <div class="company-details">
              <h3>{{ currentCareerDetail.company_name }}</h3>
              <div class="company-meta" v-if="currentCareerDetail.company_field || currentCareerDetail.company_nature || currentCareerDetail.company_size">
                <span v-if="currentCareerDetail.company_field">{{ currentCareerDetail.company_field }}</span>
                <span v-if="currentCareerDetail.company_nature">{{ currentCareerDetail.company_nature }}</span>
                <span v-if="currentCareerDetail.company_size">{{ currentCareerDetail.company_size }}</span>
          </div>
          </div>
          </div>
        </div>
        
        <!-- 基本信息部分 -->
        <div class="basic-info-section" v-if="currentCareerDetail">
          <h3>基本信息</h3>
          <div class="info-grid">
            <div class="info-item" v-if="getActiveCategoryName()">
              <div class="info-label">职业类别</div>
              <div class="info-value">{{ getActiveCategoryName() }}</div>
            </div>
            <div class="info-item" v-if="currentCareerDetail.city || currentCareerDetail.area">
              <div class="info-label">工作地点</div>
              <div class="info-value">{{ currentCareerDetail.city || '' }} {{ currentCareerDetail.area || '' }}</div>
            </div>
            <div class="info-item" v-if="currentCareerDetail.developmentStage">
              <div class="info-label">发展阶段</div>
              <div class="info-value">{{ currentCareerDetail.developmentStage }}</div>
            </div>
            <div class="info-item" v-if="currentCareerDetail.salary_range || currentCareerDetail.salary">
              <div class="info-label">薪资范围</div>
              <div class="info-value" :title="JSON.stringify(currentCareerDetail.salary_range || currentCareerDetail.salary)">
                {{ (currentCareerDetail.salary_range?.text) || formatSalary(currentCareerDetail.salary_range) || formatSalary(currentCareerDetail.salary) }}
              </div>
            </div>
            <div class="info-item" v-if="currentCareerDetail.experience_required">
              <div class="info-label">经验要求</div>
              <div class="info-value">{{ currentCareerDetail.experience_required }}</div>
            </div>
            <div class="info-item" v-if="currentCareerDetail.education_required">
              <div class="info-label">学历要求</div>
              <div class="info-value">{{ currentCareerDetail.education_required }}</div>
            </div>
          </div>
        </div>
        
        <!-- 福利显示部分 - 移动到职业描述前面 -->
        <div class="detail-section benefits-section" v-if="hasBenefits() && getBenefitsArray() && getBenefitsArray().length > 0">
          <h3>福利待遇</h3>
          <div class="benefits-container">
            <div 
              v-for="(benefit, index) in getBenefitsArray()" 
              :key="index" 
              class="benefit-tag"
            >
              {{ benefit }}
            </div>
          </div>
        </div>
        
        <!-- 职业描述部分 -->
        <div class="detail-section description-section" v-if="currentCareerDetail.description">
          <h3>职业描述</h3>
          <div class="description-content" v-html="formatDescription(currentCareerDetail.description)"></div>
        </div>
        
        <!-- 技能要求部分 -->
        <div class="detail-section skill-section" v-if="hasSkills() && getSkillArray() && getSkillArray().length > 0">
          <h3>技能要求</h3>
          <div class="skill-tags">
            <span 
              v-for="(skill, index) in getSkillArray()" 
              :key="index" 
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
        
        <!-- 工作职责部分 -->
        <div class="detail-section" v-if="currentCareerDetail.responsibilities && currentCareerDetail.responsibilities.length > 0">
          <h3>工作职责</h3>
          <ul class="responsibility-list">
            <li v-for="(responsibility, index) in formatResponsibilities(currentCareerDetail.responsibilities)" :key="index">
              {{ responsibility }}
            </li>
          </ul>
        </div>

        <!-- 公司介绍部分 -->
        <div class="detail-section company-section" v-if="currentCareerDetail.company_info">
          <h3>公司介绍</h3>
          <div class="description-content" v-html="formatDescription(currentCareerDetail.company_info)"></div>
        </div>

        <!-- 相关链接部分 -->
        <div class="detail-section links-section" v-if="currentCareerDetail.job_link || currentCareerDetail.company_link">
          <h3>相关链接</h3>
          <div class="links-container">
            <a v-if="currentCareerDetail.job_link" :href="currentCareerDetail.job_link" target="_blank" class="external-link job-link">
              <i class="link-icon">🔗</i>
              <span>查看原始职位</span>
            </a>
            <a v-if="currentCareerDetail.company_link" :href="currentCareerDetail.company_link" target="_blank" class="external-link company-link">
              <i class="link-icon">🏢</i>
              <span>访问公司主页</span>
            </a>
            </div>
            </div>

        <!-- 元数据部分 -->
        <div class="detail-section metadata-section" v-if="currentCareerDetail.updated_at || (currentCareerDetail.learning_paths_count && currentCareerDetail.learning_paths_count > 0) || (currentCareerDetail.related_jobs_count && currentCareerDetail.related_jobs_count > 0)">
          <div class="metadata-container">
            <div class="metadata-item" v-if="currentCareerDetail.updated_at">
              <span class="metadata-label">数据更新：</span>
              <span class="metadata-value">{{ formatDate(currentCareerDetail.updated_at) }}</span>
            </div>
            <div class="metadata-item" v-if="currentCareerDetail.learning_paths_count && currentCareerDetail.learning_paths_count > 0">
              <span class="metadata-label">学习路径：</span>
              <span class="metadata-value">{{ currentCareerDetail.learning_paths_count }}个</span>
            </div>
            <div class="metadata-item" v-if="currentCareerDetail.related_jobs_count && currentCareerDetail.related_jobs_count > 0">
              <span class="metadata-label">相关职位：</span>
              <span class="metadata-value">{{ currentCareerDetail.related_jobs_count }}个</span>
          </div>
        </div>
        </div>
      </div>
      <div v-else class="no-selection">
        <div v-if="selectedCareer">
          无法获取所选职业的详细信息
          <div class="error-action">
            <button @click="loadCareersByCategories([selectedCategory])">重新加载数据</button>
          </div>
        </div>
        <div v-else>
        请从左侧选择一个职业类别，并从中间列表选择一个职业查看详情
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import request from '@/utils/request'; // 使用统一的request服务
// 不再直接依赖axios
// import axios from 'axios';

// 职业分类数据状态
const categories = ref([]);
const loadingCategories = ref(false);
const error = ref(null);

// 分类展开/选择状态
const expandedCategories = ref([]);
const expandedSubcategories = ref([]);
const selectedCategory = ref('');
const selectedSubcategory = ref('');
const selectedThirdLevel = ref('');

// 职业数据状态
const careers = ref([]);
const loadingCareers = ref(false);
const currentPage = ref(1);
const perPage = ref(10);
const totalCareers = ref(0);
const totalPages = ref(1);

// 职业详情状态
const currentCareerDetail = ref(null);
const loadingDetail = ref(false);
const isFavorite = ref(false);
const favoritedCareersIds = ref([]); // 存储用户收藏的职业ID列表

// 搜索和排序
const searchText = ref('');
const sortMethod = ref('relevance');
const selectedCareer = ref('');

// 在script setup部分顶部添加变量
const favoritesLoaded = ref(false); // 收藏数据是否已加载完成

// 获取API调用的通用headers - 不再需要，request服务会自动添加认证头
// 仅在回退方案中使用
const getHeaders = () => {
  // 使用与request.ts一致的认证令牌键名
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// API请求 - 获取职业分类树
const fetchCategoryTree = async () => {
  try {
    loadingCategories.value = true;
    error.value = null;
    
    console.log('开始获取职业分类树...');
    
    // 使用封装好的request服务
    const response = await request.get('/api/v1/career-categories/tree');
    console.log('职业分类树原始响应:', response);
    
    // 更新分类数据 - 处理正确的响应格式（支持多种可能的数据结构）
    let categoryData = [];
    
    if (Array.isArray(response)) {
      // 直接是数组格式
      categoryData = response;
    } else if (response.items && Array.isArray(response.items)) {
      // {items: [...]} 格式
      categoryData = response.items;
    } else if (response.categories && Array.isArray(response.categories)) {
      // {categories: [...]} 格式
      categoryData = response.categories;
    } else if (response.data && Array.isArray(response.data)) {
      // {data: [...]} 格式
      categoryData = response.data;
    }
    
    categories.value = categoryData;
    console.log('解析后的职业分类数据:', categories.value);
    
    // 默认展开第一个分类
    if (categories.value.length > 0) {
      const firstCategory = categories.value[0];
      expandedCategories.value = [firstCategory.id];
      selectedCategory.value = firstCategory.id;
      
      // 加载第一个分类的职业
      const categoryIds = getAllChildCategoryIds(firstCategory.id);
      loadCareersByCategories(categoryIds);
    }
    
  } catch (err) {
    console.error('获取职业分类失败:', err);
    error.value = '获取职业分类失败，请重试';
  } finally {
    loadingCategories.value = false;
  }
};

// 分类展开/折叠切换
const toggleCategory = (categoryId) => {
  // 选择当前分类
  selectedCategory.value = categoryId;
  selectedSubcategory.value = ''; // 清除二级分类选择
  selectedThirdLevel.value = ''; // 清除三级分类选择
  
  // 展开/折叠逻辑
  if (expandedCategories.value.includes(categoryId)) {
    expandedCategories.value = expandedCategories.value.filter(id => id !== categoryId);
  } else {
    expandedCategories.value.push(categoryId);
  }
  
  // 重置分页
  currentPage.value = 1;
  
  // 获取当前分类及其所有子分类的ID
  const categoryIds = getAllChildCategoryIds(categoryId);
  
  // 根据当前分类加载相关职业，包括所有子分类的职业
  loadCareersByCategories(categoryIds);
};

// 子分类展开/折叠切换
const toggleSubcategory = (subcategoryId) => {
  // 选择当前子分类，如果已选中则取消选择
  if (selectedSubcategory.value === subcategoryId) {
    selectedSubcategory.value = '';
  } else {
  selectedSubcategory.value = subcategoryId;
  }
  
  selectedThirdLevel.value = ''; // 清除三级分类选择
  
  // 展开/折叠逻辑 - 确保一次只有一个二级分类展开
  if (expandedSubcategories.value.includes(subcategoryId)) {
    // 关闭当前展开的
    expandedSubcategories.value = expandedSubcategories.value.filter(id => id !== subcategoryId);
  } else {
    // 清除其他展开的二级分类，只保留当前的
    expandedSubcategories.value = [subcategoryId];
  }
  
  // 重置分页
  currentPage.value = 1;
  
  // 获取当前二级分类及其所有三级子分类的ID
  const subcategoryIds = getThirdLevelCategoryIds(subcategoryId);
  
  // 根据当前子分类加载相关职业，包括所有三级子分类的职业
  loadCareersByCategories(subcategoryIds);
};

// 选择三级分类
const selectThirdLevel = (thirdLevelId) => {
  selectedThirdLevel.value = thirdLevelId;
  
  // 重置分页
  currentPage.value = 1;
  
  // 三级分类只加载自己的职业
  loadCareersByCategories([thirdLevelId]);
};

// 获取一级分类及其所有子分类的ID
const getAllChildCategoryIds = (categoryId) => {
  // 收集所有ID：一级分类、二级分类、三级分类
  const ids = [categoryId]; // 首先添加当前分类ID
  
  // 查找一级分类
  const category = categories.value.find(cat => cat.id === categoryId);
  if (category && category.children) {
    // 添加所有二级分类ID
    category.children.forEach(subcat => {
      ids.push(subcat.id);
      
      // 添加所有三级分类ID
      if (subcat.children) {
        subcat.children.forEach(thirdCat => {
          ids.push(thirdCat.id);
        });
      }
    });
  }
  
  return ids;
};

// 获取二级分类及其所有三级子分类的ID
const getThirdLevelCategoryIds = (subcategoryId) => {
  const ids = [subcategoryId]; // 首先添加当前二级分类ID
  
  // 查找包含该二级分类的一级分类
  for (const category of categories.value) {
    if (category.children) {
      const subcat = category.children.find(sub => sub.id === subcategoryId);
      if (subcat && subcat.children) {
        // 添加所有三级分类ID
        subcat.children.forEach(thirdCat => {
          ids.push(thirdCat.id);
        });
        break; // 找到后退出循环
      }
    }
  }
  
  return ids;
};

// API请求 - 根据多个分类ID加载职业
const loadCareersByCategories = async (categoryIds) => {
  try {
    loadingCareers.value = true;
    careers.value = [];
    
    // 构建API请求参数
    const params = {
      page: currentPage.value,
      per_page: perPage.value
    };
    
    console.log('加载分类职业，分类IDs:', categoryIds);
    
    // 使用request服务调用职业列表API
    try {
      let response;
      
      // 处理不同情况：单个分类ID还是多个分类ID
      if (categoryIds.length === 1) {
        // 单个分类ID - 使用新的同步分类API端点
        response = await request.get(`/api/v1/careers-sync/category/${categoryIds[0]}`, { params });
      } else {
        // 多个分类ID - 使用多分类筛选API端点
        response = await request.get('/api/v1/careers/', { 
          params: {
            ...params,
            category_ids: categoryIds.join(',') // 多个分类ID用逗号分隔
          }
        });
      }
      
      // 更新职业数据
      const data = response || {};
      careers.value = data.careers || data.items || [];
      totalCareers.value = data.total || 0;
      totalPages.value = data.pages || Math.ceil(totalCareers.value / perPage.value) || 1;
      
      console.log('加载分类相关职业成功:', careers.value);
      
      // 如果返回的职业为空，尝试使用备用API端点
      if (careers.value.length === 0 && categoryIds.length === 1) {
        try {
          console.log('尝试使用备用API端点加载职业数据');
          // 尝试使用另一个API端点格式
          const backupResponse = await request.get(`/api/v1/career-categories/${categoryIds[0]}/careers`, {
            params: {
              ...params,
              include_subcategories: true
            }
          });
          
          const backupData = backupResponse || {};
          careers.value = backupData.careers || backupData.items || [];
          totalCareers.value = backupData.total || 0;
          totalPages.value = backupData.pages || Math.ceil(totalCareers.value / perPage.value) || 1;
          
          console.log('使用备用API端点加载职业成功:', careers.value);
        } catch (backupError) {
          console.error('备用API调用也失败:', backupError);
        }
      }
    } catch (apiError) {
      console.error('API调用失败:', apiError);
      careers.value = [];
      totalCareers.value = 0;
      totalPages.value = 1;
    }
    
    // 如果有职业数据且未选中职业，选择第一个
    if (careers.value.length > 0 && !selectedCareer.value) {
      selectCareer(careers.value[0].id);
    }
    
  } catch (err) {
    console.error('加载职业失败:', err);
  } finally {
    loadingCareers.value = false;
  }
};

// 修改用于加载分类数据的现有函数
const loadCareersByCategory = async (categoryId) => {
  // 包装为数组调用多分类加载函数
  await loadCareersByCategories([categoryId]);
};

// 添加单独的检查职业是否收藏的方法
const checkIsFavorite = async (careerId) => {
  try {
    console.log(`检查职业ID ${careerId} 是否被收藏`);
    
    // 使用单独的API检查职业收藏状态
    const response = await request.get(`/api/v1/careers/${careerId}/is_favorite`);
    console.log(`职业ID ${careerId} 收藏状态检查结果:`, response);
    
    // 如果API返回收藏状态
    if (response && typeof response.is_favorite === 'boolean') {
      isFavorite.value = response.is_favorite;
      return response.is_favorite;
    }
    
    // 如果API没有直接返回状态，则通过收藏列表判断
    return isCareerInFavorites(careerId);
  } catch (error) {
    console.error(`检查职业收藏状态出错:`, error);
    // 出错时返回false，并尝试通过列表判断
    return isCareerInFavorites(careerId);
  }
};

// 修改获取职业详情的函数，在获取详情后检查收藏状态
const fetchCareerDetail = async (careerId) => {
  try {
    loadingDetail.value = true;
    console.log(`获取职业详情: ${careerId}`);
    
    const response = await request.get(`/api/v1/careers/${careerId}`);
    console.log(`获取职业详情成功: ${careerId}`);
    
    currentCareerDetail.value = response;
    
    // 获取详情后立即检查收藏状态
    await checkIsFavorite(careerId);
    
    loadingDetail.value = false;
  } catch (error) {
    console.error(`获取职业详情失败: ${error}`);
    loadingDetail.value = false;
    currentCareerDetail.value = null;
  }
};

// 修改toggleFavorite函数，确保同步收藏状态到列表
const toggleFavorite = async () => {
  if (!currentCareerDetail.value) {
    console.warn('没有当前选中的职业，无法操作收藏');
    return;
  }
  
  const careerId = currentCareerDetail.value.id;
  console.log(`切换收藏状态，当前状态：${isFavorite.value ? '已收藏' : '未收藏'}, 职业ID: ${careerId}`);
  
  try {
    if (isFavorite.value) {
      // 已收藏，执行取消收藏
      console.log(`准备取消收藏职业 ${careerId}`);
      await request.delete(`/api/v1/careers/${careerId}/favorite`);
      console.log(`成功取消收藏职业 ${careerId}`);
      
      // 更新状态
      isFavorite.value = false;
      
      // 从收藏列表中移除
      if (favoritedCareersIds.value.includes(String(careerId))) {
        favoritedCareersIds.value = favoritedCareersIds.value.filter(id => id !== String(careerId));
        console.log('已从收藏列表移除职业ID:', careerId);
      }
      
      alert('已取消收藏');
    } else {
      // 未收藏，执行添加收藏
      console.log(`准备添加收藏职业 ${careerId}`);
      await request.post(`/api/v1/careers/${careerId}/favorite`);
      console.log(`成功添加收藏职业 ${careerId}`);
      
      // 更新状态
      isFavorite.value = true;
      
      // 添加到收藏列表
      if (!favoritedCareersIds.value.includes(String(careerId))) {
        favoritedCareersIds.value.push(String(careerId));
        console.log('已添加职业ID到收藏列表:', careerId);
      }
      
      alert('已成功收藏');
    }
    
    // 强制更新视图
    nextTick(() => {
      console.log('收藏状态视图更新完成');
    });
  } catch (error) {
    console.error('收藏操作失败:', error);
    alert('操作失败，请稍后重试');
  }
};

// 翻页功能
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadCurrentCategoryData();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadCurrentCategoryData();
  }
};

// 加载当前选择的分类数据
const loadCurrentCategoryData = () => {
  if (selectedThirdLevel.value) {
    // 如果选择了三级分类，只加载该三级分类的数据
    loadCareersByCategories([selectedThirdLevel.value]);
  } else if (selectedSubcategory.value) {
    // 如果选择了二级分类，加载该二级分类及其所有三级分类的数据
    const subcategoryIds = getThirdLevelCategoryIds(selectedSubcategory.value);
    loadCareersByCategories(subcategoryIds);
  } else if (selectedCategory.value) {
    // 如果只选择了一级分类，加载该一级分类及其所有子分类的数据
    const categoryIds = getAllChildCategoryIds(selectedCategory.value);
    loadCareersByCategories(categoryIds);
  }
};

// 过滤分类 (搜索功能)
const filteredCategories = computed(() => {
  if (!searchText.value.trim()) {
    return categories.value;
  }
  
  const search = searchText.value.toLowerCase().trim();
  
  // 递归搜索分类树
  const filterCategories = (cats) => {
    return cats.filter(cat => {
      // 检查当前分类名称是否匹配
      const nameMatch = cat.name.toLowerCase().includes(search);
      
      // 递归检查子分类
      let childrenMatch = false;
      let filteredChildren = [];
      
      if (cat.children && cat.children.length > 0) {
        filteredChildren = filterCategories(cat.children);
        childrenMatch = filteredChildren.length > 0;
      }
      
      // 如果子分类匹配，替换为过滤后的子分类
      if (childrenMatch) {
        cat = {...cat, children: filteredChildren};
      }
      
      // 如果当前分类名称匹配或者子分类中有匹配，则包含该分类
      return nameMatch || childrenMatch;
    });
  };
  
  return filterCategories(categories.value);
});

// 计算属性 - 排序后的职业列表
const sortedCareers = computed(() => {
  let result = [...careers.value];
  
  // 根据排序方法排序
  if (sortMethod.value === 'salary') {
    result.sort((a, b) => {
      const aMax = a.salary?.max || 0;
      const bMax = b.salary?.max || 0;
      return bMax - aMax; // 按薪资高低降序排序
    });
  }
  
  return result;
});

// 格式化薪资显示
const formatSalary = (salary) => {
  // 调试输出
  console.log('原始薪资数据:', salary);
  
  // 防止undefined或null
  if (!salary) return '薪资面议';
  
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
    let min = null;
    let max = null;
    
    // 尝试解析min值
    if (salary.min !== undefined && salary.min !== null) {
      min = typeof salary.min === 'string' ? parseInt(salary.min.replace(/[^\d]/g, ''), 10) : parseInt(salary.min, 10);
      if (isNaN(min)) min = null;
    }
    
    // 尝试解析max值
    if (salary.max !== undefined && salary.max !== null) {
      max = typeof salary.max === 'string' ? parseInt(salary.max.replace(/[^\d]/g, ''), 10) : parseInt(salary.max, 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查其他可能的字段名称
    if (min === null && salary.minimum !== undefined) {
      min = typeof salary.minimum === 'string' ? parseInt(salary.minimum.replace(/[^\d]/g, ''), 10) : parseInt(salary.minimum, 10);
      if (isNaN(min)) min = null;
    }
    
    if (max === null && salary.maximum !== undefined) {
      max = typeof salary.maximum === 'string' ? parseInt(salary.maximum.replace(/[^\d]/g, ''), 10) : parseInt(salary.maximum, 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查salary_min和salary_max字段
    if (min === null && salary.salary_min !== undefined) {
      min = typeof salary.salary_min === 'string' ? parseInt(salary.salary_min.replace(/[^\d]/g, ''), 10) : parseInt(salary.salary_min, 10);
      if (isNaN(min)) min = null;
    }
    
    if (max === null && salary.salary_max !== undefined) {
      max = typeof salary.salary_max === 'string' ? parseInt(salary.salary_max.replace(/[^\d]/g, ''), 10) : parseInt(salary.salary_max, 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查salaryMin和salaryMax字段
    if (min === null && salary.salaryMin !== undefined) {
      min = typeof salary.salaryMin === 'string' ? parseInt(salary.salaryMin.replace(/[^\d]/g, ''), 10) : parseInt(salary.salaryMin, 10);
      if (isNaN(min)) min = null;
    }
    
    if (max === null && salary.salaryMax !== undefined) {
      max = typeof salary.salaryMax === 'string' ? parseInt(salary.salaryMax.replace(/[^\d]/g, ''), 10) : parseInt(salary.salaryMax, 10);
      if (isNaN(max)) max = null;
    }
    
    // 检查salary_range字段（字符串格式）
    if ((min === null || max === null) && salary.salary_range && typeof salary.salary_range === 'string') {
      return formatSalaryString(salary.salary_range);
    }
    
    // 检查amount字段
    if ((min === null && max === null) && salary.amount) {
      // 检查是否包含"万"字符
      const hasWan = typeof salary.amount === 'string' && salary.amount.includes('万');
      
      const val = typeof salary.amount === 'string' ? 
        parseFloat(salary.amount.replace(/[^\d\.]/g, '')) : 
        parseFloat(salary.amount);
        
      if (!isNaN(val)) {
        // 如果包含"万"，数值乘以10000
        min = hasWan ? val * 10000 : val;
      }
    }
    
    // 检查value字段
    if ((min === null && max === null) && salary.value) {
      // 检查是否包含"万"字符
      const hasWan = typeof salary.value === 'string' && salary.value.includes('万');
      
      const val = typeof salary.value === 'string' ? 
        parseFloat(salary.value.replace(/[^\d\.]/g, '')) : 
        parseFloat(salary.value);
        
      if (!isNaN(val)) {
        min = hasWan ? val * 10000 : val;
      }
    }
    
    // 处理薪资单位
    let isByMonth = true;
    if (salary.period === 'year' || salary.period === 'annual' || 
        salary.type === 'yearly' || salary.type === 'annual') {
      isByMonth = false;
    }
    
    // 如果min和max数值过大，可能是按年计算的薪资
    if (min && min > 100000) isByMonth = false;
    
    // 获取货币符号
    const currency = (salary.currency === 'CNY' || salary.currency === 'RMB' || !salary.currency) ? '¥' : '$';
    
    // 格式化薪资显示
    if (min && max) {
      if (isByMonth) {
        return `${(min/1000).toFixed(0)}K-${(max/1000).toFixed(0)}K/月`;
  } else {
        // 年薪除以12转为月薪
        return `${(min/12000).toFixed(0)}K-${(max/12000).toFixed(0)}K/月`;
      }
    } else if (min) {
      if (isByMonth) {
        return `${(min/1000).toFixed(0)}K+/月`;
      } else {
        return `${(min/12000).toFixed(0)}K+/月`;
      }
    } else if (max) {
      if (isByMonth) {
        return `${(max/1000).toFixed(0)}K以下/月`;
      } else {
        return `${(max/12000).toFixed(0)}K以下/月`;
      }
    }
    
    // 如果salary本身是字符串，则直接返回
    if (typeof salary.salary === 'string') {
      return formatSalaryString(salary.salary);
    }
    
    // 检查是否有文本描述
    if (typeof salary.description === 'string' && salary.description.trim()) {
      return formatSalaryString(salary.description);
    }
    
    return '薪资面议';
  }
  
  // 4. 如果是数字，格式化为k单位
  if (typeof salary === 'number') {
    console.log('数字格式薪资:', salary);
    // 如果数字较大，可能是年薪
    if (salary > 100000) {
      return `${(salary/12000).toFixed(0)}K/月`;
    } else {
      return `${(salary/1000).toFixed(0)}K/月`;
    }
  }
  
  // 其他情况
  return '薪资面议';
};

// 字符串格式薪资处理辅助函数
const formatSalaryString = (salaryStr) => {
  if (!salaryStr) return '薪资面议';
  
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
  
  // 特殊处理"1千-1万"等带单位的范围格式
  if (/\d+千.*\d+万/.test(cleanSalary) || /\d+k.*\d+万/.test(cleanSalary)) {
    // 提取数字部分
    const matches = cleanSalary.match(/(\d+)([千k]).*?(\d+)([万w])/i);
    if (matches) {
      const minVal = parseFloat(matches[1]);
      const minUnit = matches[2].toLowerCase();
      const maxVal = parseFloat(matches[3]);
      const maxUnit = matches[4].toLowerCase();
      
      // 统一转换为"X千-X万"格式
      return `${minVal}千-${maxVal}万`;
    }
  }
  
  // 检查是否包含"万"字符
  const hasWan = cleanSalary.includes('万');
  const hasThousand = cleanSalary.includes('千') || cleanSalary.toLowerCase().includes('k');
  const hasYear = cleanSalary.includes('年') || cleanSalary.includes('annual') || cleanSalary.includes('yearly');
  
  // 尝试解析带单位的字符串，如"10k-20k"或"¥10k-20k/月"
  const matches = cleanSalary.match(/(\d+\.?\d*)[kK千][-~～](\d+\.?\d*)[kK千]/i);
  if (matches) {
    const min = parseFloat(matches[1]);
    const max = parseFloat(matches[2]);
    return `${min}千-${max}千`;
  }
  
  // 尝试解析数字范围，如"10000-20000"或"1-1.5万"
  const rangeMatches = cleanSalary.match(/(\d+\.?\d*)[-~～](\d+\.?\d*)/);
  if (rangeMatches) {
    const min = parseFloat(rangeMatches[1]);
    const max = parseFloat(rangeMatches[2]);
    if (!isNaN(min) && !isNaN(max)) {
      // 根据单位和数值大小决定显示格式
      if (hasWan) {
        return hasYear ? `${min}-${max}万/年` : `${min}-${max}万/月`;
      } else if (hasThousand) {
        return `${min}-${max}千`;
      } else if (min > 10000 || max > 10000) {
        // 如果数字较大，可能是年薪，转换为万/年
        const isLikelyYear = min > 100000 || max > 100000;
        if (isLikelyYear || hasYear) {
          return `${(min/10000).toFixed(0)}-${(max/10000).toFixed(0)}万/年`;
  } else {
          return `${(min/10000).toFixed(1)}-${(max/10000).toFixed(1)}万/月`;
        }
      } else {
        return `${min}-${max}千`;
      }
    }
  }
  
  // 尝试解析单一数字
  const singleNumberMatch = cleanSalary.match(/(\d+\.?\d*)([kK千万w])?/i);
  if (singleNumberMatch) {
    let value = parseFloat(singleNumberMatch[1]);
    if (!isNaN(value)) {
      const unit = singleNumberMatch[2] ? singleNumberMatch[2].toLowerCase() : '';
      
      // 根据单位转换
      if (unit === 'k' || unit === '千') {
        return `${value}千`;
      } else if (unit === '万' || unit === 'w') {
        return hasYear ? `${value}万/年` : `${value}万/月`;
      } else if (value > 100000) {
        return `${(value/10000).toFixed(0)}万/年`;
      } else if (value > 10000) {
        return `${(value/10000).toFixed(1)}万/月`;
      } else {
        return `${value}元`;
      }
    }
  }
  
  // 如果没有匹配到特定格式，直接返回原字符串
  return cleanSalary;
};

// 辅助方法 - 获取职业标签
const getCareeerTags = (career) => {
  if (!career) return [];
  
  // 尝试各种可能的标签字段
  if (Array.isArray(career.tags) && career.tags.length > 0) {
    return career.tags.slice(0, 3);
  } 
  
  if (Array.isArray(career.skills) && career.skills.length > 0) {
    return career.skills.slice(0, 3);
  }
  
  if (typeof career.tags === 'string' && career.tags.trim()) {
    return [career.tags];
  }
  
  if (typeof career.skills === 'string' && career.skills.trim()) {
    return [career.skills];
  }
  
  return []; // 如果没有找到任何标签，返回空数组
};

// 方法 - 选择职业
const selectCareer = (careerId) => {
  selectedCareer.value = careerId;
  fetchCareerDetail(careerId);
};

// 页面加载时调用
onMounted(async () => {
  console.log('职业库页面加载');
  // 清除可能存在的缓存或模拟数据
  clearMockData();
  
  // 检查本地存储中的认证令牌
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.warn('未找到认证令牌，可能无法获取数据');
    error.value = '请先登录以访问完整功能';
  }
  
  try {
    // 先加载收藏列表，确保收藏状态先准备好
    await fetchFavoriteCareersIds();
    console.log('收藏列表加载完成，开始加载分类树');
    
    // 然后再加载职业分类树
    await fetchCategoryTree();
  } catch (err) {
    console.error('初始化加载失败:', err);
  }
});

// 清除可能存在的模拟数据或缓存数据
const clearMockData = () => {
  console.log('清除模拟数据和缓存...');
  // 重置所有状态
  careers.value = [];
  currentCareerDetail.value = null;
  isFavorite.value = false;
  totalCareers.value = 0;
  totalPages.value = 1;
  currentPage.value = 1;
  
  // 清除可能存在的相关缓存
  try {
    // 清除本地存储中可能存在的相关缓存
    const keysToRemove = [
      'mock_careers', 
      'cached_careers',
      'mockData',
      'career_test_data'
    ];
    
    keysToRemove.forEach(key => {
      if(localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`已删除本地存储键: ${key}`);
      }
    });
    
    console.log('模拟数据和缓存清除完成');
  } catch (err) {
    console.error('清除缓存时出错:', err);
  }
};

// 获取活动分类名称路径
const getActiveCategoryName = () => {
  // 查找所选分类的完整路径名称
  let result = '';
  
  // 查找一级分类
  const activeCategory = categories.value.find(cat => cat.id === selectedCategory.value);
  if (activeCategory) {
    result = activeCategory.name;
    
    // 查找二级分类
    if (selectedSubcategory.value) {
      const activeSubcategory = activeCategory.children?.find(sub => sub.id === selectedSubcategory.value);
      if (activeSubcategory) {
        result += ' > ' + activeSubcategory.name;
        
        // 查找三级分类
        if (selectedThirdLevel.value) {
          const activeThirdLevel = activeSubcategory.children?.find(third => third.id === selectedThirdLevel.value);
          if (activeThirdLevel) {
            result += ' > ' + activeThirdLevel.name;
          }
        }
      }
    }
  }
  
  return result || '全部职业';
};

// 获取技能文本
const getSkillsText = () => {
  if (!currentCareerDetail.value) return '暂无数据';
  
  // 优先使用required_skills字段
  if (Array.isArray(currentCareerDetail.value.required_skills)) {
    return currentCareerDetail.value.required_skills.length > 0 
      ? currentCareerDetail.value.required_skills.join('、') 
      : '无特定技能要求';
  }
  
  // 其次使用skill_tags字段
  if (Array.isArray(currentCareerDetail.value.skill_tags)) {
    return currentCareerDetail.value.skill_tags.length > 0 
      ? currentCareerDetail.value.skill_tags.join('、') 
      : '无特定技能要求';
  }
  
  // 再次处理可能的skills字段
  if (Array.isArray(currentCareerDetail.value.skills)) {
    return currentCareerDetail.value.skills.length > 0 
      ? currentCareerDetail.value.skills.join('、') 
      : '无特定技能要求';
  } else if (typeof currentCareerDetail.value.skills === 'string') {
    return currentCareerDetail.value.skills || '无特定技能要求';
  } 
  
  // 兼容其他可能的字段名
  const skills = currentCareerDetail.value.requiredSkills;
  if (skills) {
    return Array.isArray(skills) 
      ? (skills.length > 0 ? skills.join('、') : '无特定技能要求')
      : (skills || '无特定技能要求');
  }
  
  return '无特定技能要求';
};

// 用于解决可能的API路径问题的辅助函数
const ensureApiUrl = (url) => {
  // 如果已经包含完整的http路径，则直接返回
  if (url.startsWith('http')) {
    return url;
  }
  
  // 如果是相对路径且不以/api开头，添加前缀
  if (!url.startsWith('/api')) {
    return `/api${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  return url;
};

// 可用于测试的功能
const testApiConnection = async () => {
  try {
    console.log('测试API连接...');
    // 尝试使用request服务调用一个简单的API
    const response = await request.get('/api/v1/auth/me');
    console.log('API连接成功:', response);
    return true;
  } catch (error) {
    console.error('API连接测试失败:', error);
    return false;
  }
};

// 更高级的错误处理
const handleApiError = (error, fallbackData = null, errorMessage = '操作失败') => {
  console.error(errorMessage, error);
  
  // 检查错误类型
  if (error.response) {
    // 服务器响应了，但是状态码不在2xx范围内
    console.error('服务器响应错误:', {
      status: error.response.status,
      data: error.response.data
    });
    
    // 处理特定状态码
    if (error.response.status === 401) {
      error.value = '您的登录已过期，请重新登录';
      // 可以添加重定向到登录页的逻辑
    } else if (error.response.status === 403) {
      error.value = '您没有权限执行此操作';
    } else if (error.response.status === 404) {
      error.value = '请求的资源不存在';
    } else if (error.response.status >= 500) {
      error.value = '服务器错误，请稍后重试';
    } else {
      error.value = errorMessage;
    }
  } else if (error.request) {
    // 请求被发送，但没有收到响应
    console.error('未收到服务器响应');
    error.value = '网络连接问题，请检查您的网络连接';
  } else {
    // 请求设置时触发的错误
    console.error('请求配置错误:', error.message);
    error.value = '请求配置错误';
  }
  
  // 不再使用模拟数据作为回退，直接返回null或空数组
  return null;
};

// 检查是否有技能标签
const hasSkills = () => {
  if (!currentCareerDetail.value) return false;
  
  return (
    (Array.isArray(currentCareerDetail.value.required_skills) && currentCareerDetail.value.required_skills.length > 0) ||
    (Array.isArray(currentCareerDetail.value.skill_tags) && currentCareerDetail.value.skill_tags.length > 0) ||
    (Array.isArray(currentCareerDetail.value.skills) && currentCareerDetail.value.skills.length > 0) ||
    (typeof currentCareerDetail.value.skills === 'string' && currentCareerDetail.value.skills.trim() !== '')
  );
};

// 修改getBenefitsArray函数，优先使用required_skills作为福利来源
const getBenefitsArray = () => {
  if (!currentCareerDetail.value) return [];
  
  // 福利关键词列表，用于识别福利
  const benefitKeywords = ['五险', '一金', '年终奖', '带薪年假', '节日福利', '团队建设', '免费班车', 
                          '定期体检', '年终双薪', '通讯补贴', '餐补', '房补', '交通补贴', '零食下午茶', 
                          '弹性工作', '补充医疗', '股票期权', '项目奖金', '加班补助', '包吃', '生日福利',
                          '旅游', '福利', '补贴', '奖金', '社保', '公积金', '培训', '带薪'];
  
  // 检查一个数组是否包含福利项
  const isBenefitsArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    // 如果超过50%的项目包含福利关键词，则认为是福利数组
    const benefitItemCount = arr.filter(item => 
      benefitKeywords.some(keyword => typeof item === 'string' && item.includes(keyword))
    ).length;
    return benefitItemCount / arr.length >= 0.3; // 超过30%包含福利关键词
  };
  
  // 优先使用required_skills字段 - 如果它确实包含福利项
  if (Array.isArray(currentCareerDetail.value.required_skills) && 
      isBenefitsArray(currentCareerDetail.value.required_skills)) {
    return currentCareerDetail.value.required_skills;
  }
  
  // 其次使用benefits字段
  if (Array.isArray(currentCareerDetail.value.benefits) && currentCareerDetail.value.benefits.length > 0) {
    return currentCareerDetail.value.benefits;
  }
  
  // 再次使用welfare字段
  if (Array.isArray(currentCareerDetail.value.welfare) && currentCareerDetail.value.welfare.length > 0) {
    return currentCareerDetail.value.welfare;
  }
  
  // 处理字符串形式的福利
  if (typeof currentCareerDetail.value.benefits === 'string' && currentCareerDetail.value.benefits.trim() !== '') {
    return currentCareerDetail.value.benefits.split(/[,，、]/);
  }
  
  if (typeof currentCareerDetail.value.welfare === 'string' && currentCareerDetail.value.welfare.trim() !== '') {
    return currentCareerDetail.value.welfare.split(/[,，、]/);
  }
  
  // 如果没有找到福利数据，返回空数组
  return [];
};

// 修改hasBenefits函数，检查required_skills是否包含福利
const hasBenefits = () => {
  if (!currentCareerDetail.value) return false;
  
  // 福利关键词列表
  const benefitKeywords = ['五险', '一金', '年终奖', '带薪年假', '节日福利', '团队建设', '免费班车', 
                          '定期体检', '年终双薪', '通讯补贴', '餐补', '房补', '交通补贴', '零食下午茶', 
                          '弹性工作', '补充医疗', '股票期权', '项目奖金', '加班补助', '包吃', '生日福利',
                          '旅游', '福利', '补贴', '奖金', '社保', '公积金', '培训', '带薪'];
                          
  // 检查一个数组是否包含福利项
  const isBenefitsArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    // 如果超过30%的项目包含福利关键词，则认为是福利数组
    const benefitItemCount = arr.filter(item => 
      benefitKeywords.some(keyword => typeof item === 'string' && item.includes(keyword))
    ).length;
    return benefitItemCount / arr.length >= 0.3;
  };
  
  return (
    (Array.isArray(currentCareerDetail.value.required_skills) && 
      isBenefitsArray(currentCareerDetail.value.required_skills)) ||
    (Array.isArray(currentCareerDetail.value.benefits) && currentCareerDetail.value.benefits.length > 0) ||
    (Array.isArray(currentCareerDetail.value.welfare) && currentCareerDetail.value.welfare.length > 0) ||
    (typeof currentCareerDetail.value.benefits === 'string' && currentCareerDetail.value.benefits.trim() !== '') ||
    (typeof currentCareerDetail.value.welfare === 'string' && currentCareerDetail.value.welfare.trim() !== '')
  );
};

// 修改getSkillArray函数，确保它不会使用required_skills字段如果它包含福利
const getSkillArray = () => {
  if (!currentCareerDetail.value) return [];
  
  // 福利关键词列表，用于过滤掉被误认为是技能的福利词
  const benefitKeywords = ['五险', '一金', '年终奖', '带薪年假', '节日福利', '团队建设', '免费班车', 
                          '定期体检', '年终双薪', '通讯补贴', '餐补', '房补', '交通补贴', '零食下午茶', 
                          '弹性工作', '补充医疗', '股票期权', '项目奖金', '加班补助', '包吃', '生日福利',
                          '旅游', '福利', '补贴', '奖金', '社保', '公积金'];
  
  // 检查一个数组是否包含福利项
  const isBenefitsArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    // 如果超过30%的项目包含福利关键词，则认为是福利数组
    const benefitItemCount = arr.filter(item => 
      benefitKeywords.some(keyword => typeof item === 'string' && item.includes(keyword))
    ).length;
    return benefitItemCount / arr.length >= 0.3;
  };
  
  // 移除福利相关的标签
  const filterBenefits = (skills) => {
    if (!Array.isArray(skills)) return [];
    return skills.filter(skill => 
      !benefitKeywords.some(keyword => 
        typeof skill === 'string' && skill.includes(keyword)
      )
    );
  };
  
  // 检查required_skills是否是真正的技能
  if (Array.isArray(currentCareerDetail.value.required_skills) && 
      !isBenefitsArray(currentCareerDetail.value.required_skills)) {
    return filterBenefits(currentCareerDetail.value.required_skills);
  }
  
  // 检查skill_tags字段
  if (Array.isArray(currentCareerDetail.value.skill_tags) && currentCareerDetail.value.skill_tags.length > 0) {
    return filterBenefits(currentCareerDetail.value.skill_tags);
  }
  
  // 检查skills字段
  if (Array.isArray(currentCareerDetail.value.skills) && currentCareerDetail.value.skills.length > 0) {
    return filterBenefits(currentCareerDetail.value.skills);
  }
  
  // 处理字符串形式的skills
  if (typeof currentCareerDetail.value.skills === 'string' && currentCareerDetail.value.skills.trim() !== '') {
    const skillsArray = currentCareerDetail.value.skills.split(/[,，、]/);
    return filterBenefits(skillsArray);
  }
  
  // 尝试从keywords中提取技能
  if (Array.isArray(currentCareerDetail.value.keywords) && currentCareerDetail.value.keywords.length > 0) {
    return filterBenefits(currentCareerDetail.value.keywords);
  }
  
  return [];
};

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // 假设日期是ISO格式，处理标准日期格式和带有毫秒的ISO格式
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '未知日期';
    
    // 格式化为'YYYY-MM-DD'格式
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '未知日期';
  }
};

// 格式化描述文本，将纯文本转换为HTML结构以实现更好的排版
const formatDescription = (description) => {
  if (!description) return '';
  
  // 基础清理
  let text = description
    .replace(/\\n/g, '\n')         // 处理转义的\n为实际换行符
    .replace(/&nbsp;/g, ' ')       // 处理HTML特殊字符
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<br\s*\/?>/gi, '\n') // 处理HTML的<br>标签
    .trim();                       // 移除首尾空白

  // 将文本分割为段落
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim() !== '');
  
  // 处理每个段落并组装HTML
  const htmlParagraphs = paragraphs.map(paragraph => {
    // 将段落分割为行
    const lines = paragraph.split('\n').filter(line => line.trim() !== '');
    
    // 检查是否是列表段落
    const isList = lines.some(line => {
      return /^\d+[、.．:：]/.test(line.trim()) || // 数字序号
             /^[一二三四五六七八九十]+[、.．:：]/.test(line.trim()) || // 中文序号
             /^[a-zA-Z][、.．:：]/.test(line.trim()) || // 字母序号
             /^[•◦*\-#]/.test(line.trim()); // 项目符号
    });
    
    if (isList) {
      // 处理列表
      return processListParagraph(lines);
    } else {
      // 处理普通段落
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    }
  });
  
  return htmlParagraphs.join('');
};

// 处理列表段落
const processListParagraph = (lines) => {
  // 检测列表类型
  const listItems = lines.map(line => {
    line = line.trim();
    
    // 数字序号模式
    if (/^\d+[、.．:：]/.test(line)) {
      const match = line.match(/^(\d+)([、.．:：])\s*(.*)/);
      if (match) {
        return {
          prefix: match[1],
          separator: match[2],
          content: match[3],
          type: 'number'
        };
      }
    }
    
    // 中文序号模式
    if (/^[一二三四五六七八九十]+[、.．:：]/.test(line)) {
      const match = line.match(/^([一二三四五六七八九十]+)([、.．:：])\s*(.*)/);
      if (match) {
        return {
          prefix: match[1],
          separator: match[2],
          content: match[3],
          type: 'chinese'
        };
      }
    }
    
    // 字母序号模式
    if (/^[a-zA-Z][、.．:：]/.test(line)) {
      const match = line.match(/^([a-zA-Z])([、.．:：])\s*(.*)/);
      if (match) {
        return {
          prefix: match[1],
          separator: match[2],
          content: match[3],
          type: 'letter'
        };
      }
    }
    
    // 项目符号模式
    if (/^[•◦*\-#]/.test(line)) {
      const match = line.match(/^([•◦*\-#])\s*(.*)/);
      if (match) {
        return {
          prefix: match[1],
          content: match[2],
          type: 'bullet'
        };
      }
    }
    
    // 普通文本行
    return {
      content: line,
      type: 'text'
    };
  });
  
  // 生成HTML
  let html = '<ul class="career-list">';
  
  listItems.forEach(item => {
    if (item.type === 'text') {
      html += `<li class="list-text">${item.content}</li>`;
    } else if (item.type === 'number') {
      html += `<li class="list-number"><span class="list-marker">${item.prefix}${item.separator}</span> ${item.content}</li>`;
    } else if (item.type === 'chinese') {
      html += `<li class="list-chinese"><span class="list-marker">${item.prefix}${item.separator}</span> ${item.content}</li>`;
    } else if (item.type === 'letter') {
      html += `<li class="list-letter"><span class="list-marker">${item.prefix}${item.separator}</span> ${item.content}</li>`;
    } else if (item.type === 'bullet') {
      html += `<li class="list-bullet"><span class="list-marker">${item.prefix}</span> ${item.content}</li>`;
    }
  });
  
  html += '</ul>';
  return html;
};

// 检测指定元素是否包含标题格式
const containsTitle = (text) => {
  return /岗位职责|工作职责|任职要求|职位描述|岗位要求|福利待遇|薪资|待遇|公司介绍/.test(text);
};

// 格式化职责列表
const formatResponsibilities = (responsibilities) => {
  if (!responsibilities || !Array.isArray(responsibilities)) return [];
  
  return responsibilities.map(resp => {
    if (typeof resp === 'string') {
      return resp.replace(/\\n/g, '\n');
    }
    return resp;
  });
};

// 添加新的格式化函数，用于从职业对象中获取和格式化薪资
const formatSalaryFromCareer = (career) => {
  console.log('格式化职业薪资:', career.title, career.salary, career.salary_range);
  
  // 获取原始薪资字段
  let originalSalary = null;
  
  // 优先获取salary_range字段
  if (career.salary_range) {
    originalSalary = career.salary_range;
  } else if (career.salary) {
    originalSalary = career.salary;
  }
  
  // 如果是字符串格式，需要保持原样显示
  if (originalSalary && typeof originalSalary === 'string') {
    // 检查salary_range是否已经是格式化好的文本
    if (originalSalary.includes('万/年') || 
        originalSalary.includes('万/月') || 
        originalSalary.includes('千-') || 
        originalSalary.includes('千～') ||
        originalSalary.match(/\d+\s*[-~～]\s*\d+\s*万/)) {
      // 已格式化的文本，直接显示
      return originalSalary;
    }
  }
  
  // 对象格式则需要解析
  if (originalSalary && typeof originalSalary === 'object') {
    // 检查text属性
    if (originalSalary.text) {
      return originalSalary.text;
    }
    
    // 处理min/max格式
    let min = null;
    let max = null;
    let period = null;
    
    // 获取最小值
    if (originalSalary.min !== undefined) min = originalSalary.min;
    else if (originalSalary.salary_min !== undefined) min = originalSalary.salary_min;
    else if (originalSalary.minimum !== undefined) min = originalSalary.minimum;
    
    // 获取最大值
    if (originalSalary.max !== undefined) max = originalSalary.max;
    else if (originalSalary.salary_max !== undefined) max = originalSalary.salary_max;
    else if (originalSalary.maximum !== undefined) max = originalSalary.maximum;
    
    // 获取薪资周期
    if (originalSalary.period) period = originalSalary.period;
    else if (originalSalary.type) period = originalSalary.type;
    
    // 如果有周期信息且指明是年薪
    const isYearly = period === 'year' || period === 'annual' || period === 'yearly';
    
    // 格式化显示
    if (min !== null && max !== null) {
      // 根据数值判断是否年薪
      const likelyYearly = (min > 100000 || max > 100000) && !period;
      
      if (isYearly || likelyYearly) {
        // 是年薪，转换为万/年
        return `${(min/10000).toFixed(0)}-${(max/10000).toFixed(0)}万/年`;
      } else {
        // 是月薪，根据数值大小决定单位
        if (min >= 10000 || max >= 10000) {
          return `${(min/10000).toFixed(1)}-${(max/10000).toFixed(1)}万/月`;
        } else {
          return `${(min/1000).toFixed(0)}K-${(max/1000).toFixed(0)}K/月`;
        }
      }
    }
  }
  
  // 回退到原来的处理方式
  const result = formatSalary(career.salary_range || career.salary);
  
  // 确保显示一致性，转换可能的"K"格式
  if (result.includes('K-') || result.includes('K/')) {
    const numberMatch = result.match(/(\d+)K-(\d+)K/);
    if (numberMatch) {
      const min = parseInt(numberMatch[1]);
      const max = parseInt(numberMatch[2]);
      
      // 如果数值较大，可能是显示成K单位的万元
      if (min >= 100 || max >= 100) {
        return `${(min/10).toFixed(0)}-${(max/10).toFixed(0)}万/月`;
      }
    }
  }
  
  return result;
};

// 手动导入收藏相关API
const addFavoriteCareer = async (careerId) => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`添加收藏职业: ${id}`);
    const response = await request.post(`/api/v1/careers/${id}/favorite`);
    return response;
  } catch (error) {
    console.error('收藏职业失败:', error);
    throw error;
  }
};

const removeFavoriteCareer = async (careerId) => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`取消收藏职业: ${id}`);
    const response = await request.delete(`/api/v1/careers/${id}/favorite`);
    return response;
  } catch (error) {
    console.error('取消收藏职业失败:', error);
    throw error;
  }
};

const getFavoriteCareers = async () => {
  try {
    console.log('获取用户收藏的职业列表');
    
    // 使用正确的API路径
    const response = await request.get('/api/v1/careers/user/favorites');
    
    console.log('获取收藏职业列表响应:', response);
    
    // 处理不同格式的响应
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.items)) return response.items;
      if (Array.isArray(response.favorites)) return response.favorites;
      if (Array.isArray(response.careers)) return response.careers;
    }
    
    return [];
  } catch (error) {
    console.error('获取收藏职业失败:', error);
    
    // 如果是404错误，表示没有收藏，返回空数组
    if (error.response && error.response.status === 404) {
      console.log('用户没有收藏职业');
      return [];
    }
    
    throw error;
  }
};

// 检查职业是否在收藏列表中
const isCareerInFavorites = (careerId) => {
  if (!favoritesLoaded.value) {
    console.log(`收藏数据尚未加载完成，无法检查职业 ${careerId} 的收藏状态`);
    return false;
  }
  
  // 确保转换为字符串比较
  const strCareerId = String(careerId);
  const result = favoritedCareersIds.value.includes(strCareerId);
  console.log(`检查职业 ${strCareerId} 是否在收藏列表中:`, result, '收藏列表:', favoritedCareersIds.value);
  return result;
};

// 修改获取收藏职业ID列表函数
const fetchFavoriteCareersIds = async () => {
  try {
    favoritesLoaded.value = false; // 开始加载，设置为false
    console.log('开始获取收藏职业列表...');
    
    // 确保API路径正确
    const apiUrl = '/api/v1/careers/user/favorites';
    console.log('请求收藏列表URL:', apiUrl);
    
    const response = await request.get(apiUrl);
    console.log('获取收藏职业ID列表成功:', response);
    
    // 提取收藏职业的ID
    let favorites = [];
    
    if (response && Array.isArray(response)) {
      favorites = response;
    } else if (response?.careers && Array.isArray(response.careers)) {
      favorites = response.careers;
    } else if (response?.items && Array.isArray(response.items)) {
      favorites = response.items;
    } else if (response?.data && Array.isArray(response.data)) {
      favorites = response.data;
    } else {
      console.warn('API返回数据格式不符合预期:', response);
      favorites = [];
    }
    
    // 调试 - 打印原始数据的id属性
    if (favorites.length > 0) {
      console.log('第一个收藏职业数据示例:', favorites[0]);
      console.log('第一个收藏职业的ID:', favorites[0].id, '类型:', typeof favorites[0].id);
    }
    
    // 提取ID并保存到状态中，确保转为字符串
    favoritedCareersIds.value = favorites.map(fav => String(fav.id || fav.career_id));
    console.log('解析后的收藏职业ID列表:', favoritedCareersIds.value);
    
    // 数据加载完成
    favoritesLoaded.value = true;
    console.log('收藏数据加载完成');
    
    // 更新UI强制重新渲染
    nextTick(() => {
      console.log('收藏状态更新完成，触发重新渲染');
    });
  } catch (err) {
    console.error('获取收藏职业ID列表失败:', err);
    favoritedCareersIds.value = [];
    favoritesLoaded.value = true; // 即使出错也标记为加载完成
  }
};
</script>

<style>
@import '@/styles/career-nav-styles.css';

/* 全局布局样式 */
.career-library-container {
  display: flex;
  height: calc(100vh - 60px);
  padding: 20px;
  gap: 20px;
  background-color: #f5f7fa;
}

/* 左侧分类面板的尺寸 */
.category-panel {
  width: calc(50% / 3);
  min-width: 180px;
  flex: 0 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  overflow: hidden;
}

.category-search {
  padding: 12px 12px;
  border-bottom: 2px solid #f5f7fa;
  margin-bottom: 8px;
  background-color: #f9fafc;
}

.category-search input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.category-title {
  margin-bottom: 0px !important;
  font-weight: 600;
}

.folder-expanded {
  background-color: inherit !important;
}

.category-item {
  margin-bottom: 6px;
}

.category-item.first-level {
  margin-bottom: 12px;
  border-bottom: 1px solid #e3f2fd;
  padding-bottom: 8px;
}

.category-item.first-level:last-child {
  border-bottom: none;
}

.folder-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  color: #444;
}

.first-level > .folder-item {
  font-weight: 600;
  border-left: 3px solid #1e88e5;
  background-color: #e3f2fd;
  padding-left: 8px;
  letter-spacing: 0.5px;
  color: #1565c0;
  font-size: 14px;
  margin-bottom: 2px;
  border-radius: 0 4px 4px 0;
}

.first-level > .folder-item.active {
  border-left-color: #1565c0;
  background-color: #bbdefb;
  box-shadow: 0 1px 3px rgba(21, 101, 192, 0.3);
}

.first-level > .folder-item .folder-icon {
  color: #1976d2;
  font-size: 16px;
}

.folder-item:hover {
  background-color: #f0f2f5;
}

.folder-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  box-shadow: 0 1px 3px rgba(64, 158, 255, 0.2);
}

.folder-icon {
  margin-right: 8px;
  font-size: 14px;
  color: #909399;
  flex-shrink: 0;
}

.folder-item.active .folder-icon {
  color: #409eff;
}

.folder-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 5px;
}

.toggle-icon {
  margin-left: auto;
  transition: transform 0.3s;
  font-size: 12px;
  color: #aaa;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.folder-item.active .toggle-icon {
  color: #409eff;
}

.el-icon-arrow-down {
  transform: rotate(90deg);
}

.subcategories {
  padding-left: 16px;
  margin: 4px 0 6px 3px;
  position: relative;
  border-left: 1px dashed #bbdefb;
}

.subcategories:before,
.third-level:before {
  display: none;
}

.subcategory-item {
  margin-bottom: 4px;
}

.subcategory-item:before {
  display: none;
}

.third-level {
  padding-left: 14px;
  margin: 4px 0 6px 2px;
  position: relative;
  border-left: 1px dashed #c8e6c9;
}

.third-level-item {
  margin-bottom: 2px;
  position: relative;
}

.third-level-item:before {
  display: none;
}

.third-level .folder-item {
  padding: 5px 8px;
  font-size: 12px;
}

/* 中间职业列表面板样式 */
.career-list-panel {
  width: calc(50% * 2/3);
  min-width: 260px;
  flex: 1 0 auto;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
}

.career-list-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.category-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.category-navigation h3 {
  margin: 0;
  font-size: 17px;
  color: #303133;
  font-weight: 600;
}

.career-count {
  font-size: 13px;
  color: #909399;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.tab {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #606266;
}

.tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.filter-bar {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.filter-bar select {
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
}

.career-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.career-item {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f8f9fb;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.career-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.career-item.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.favorite-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #FFC107;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.favorite-icon svg {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.favorite-icon:hover {
  transform: scale(1.15);
  color: #FF9800;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.career-main-info {
  margin-top: 5px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.career-item h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

.career-salary {
  font-size: 14px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 5px;
}

.career-education {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.edu-badge, .experience-badge {
  padding: 1px 4px;
  background-color: #f4f4f5;
  color: #909399;
  font-size: 10px;
  border-radius: 2px;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  max-height: 36px;
  overflow: hidden;
  margin-top: auto;
}

.tag {
  padding: 1px 4px;
  background-color: #ecf5ff;
  color: #409eff;
  font-size: 10px;
  border-radius: 2px;
}

/* 右侧详情面板样式 */
.career-detail-panel {
  width: 50%;
  flex: 0 0 auto;
  min-width: 400px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  border-radius: 4px;
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.detail-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.favorite-btn, .share-btn {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.favorite-btn:hover, .share-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.favorite-btn.is-favorite {
  color: #f56c6c;
  border-color: #fbc4c4;
  background-color: #fef0f0;
}

.action-icon {
  margin-right: 5px;
}

.company-info-section {
  background-color: #f8f9fb;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.company-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.company-details {
  flex: 1;
}

.company-details h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.company-meta {
  display: flex;
  gap: 6px;
  margin-top: 5px;
}

.basic-info-section {
  background-color: #f8f9fb;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.basic-info-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
  color: #303133;
  position: relative;
  padding-left: 10px;
}

.basic-info-section h3:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #409eff;
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.info-label {
  color: #909399;
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-size: 13px;
  padding: 6px 10px;
  background-color: #f0f2f5;
  border-radius: 3px;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  min-height: 28px;
  line-height: 1.4;
}

.detail-section {
  margin-bottom: 15px;
}

.detail-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
  padding-left: 10px;
}

.detail-section h3:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #409eff;
  border-radius: 2px;
}

.detail-section p {
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
  margin: 0;
  padding-right: 10px;
  text-align: justify;
}

.pre-wrap {
  white-space: pre-wrap;
}

.skill-section {
  margin-bottom: 20px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.skill-tag {
  padding: 5px 10px;
  background-color: #f0f7ff;
  color: #409eff;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #d9ecff;
}

.responsibility-list {
  list-style: disc;
  padding-left: 20px;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  padding-right: 10px;
  margin-top: 5px;
}

.responsibility-list li {
  margin-bottom: 8px;
  text-align: justify;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #909399;
  padding: 20px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  padding: 15px;
  border-top: 1px solid #ebeef5;
}

.pagination button {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 13px;
}

.pagination button:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

.no-data {
  padding: 15px;
  text-align: center;
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #909399;
  text-align: center;
  padding: 20px;
}

.error-action {
  margin-top: 20px;
}

.error-action button {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.error-action button:hover {
  background-color: #66b1ff;
}

.category-tree {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 8px 8px;
}

/* 美化滚动条 */
.category-tree::-webkit-scrollbar {
  width: 6px;
}

.category-tree::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.category-tree::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

.category-tree::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.folder-item.selected,
.folder-item.active.selected {
  background-color: #e6f1ff;
  border-left-color: #409eff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* 高亮动画 */
@keyframes highlight {
  0% { background-color: rgba(64, 158, 255, 0.1); }
  50% { background-color: rgba(64, 158, 255, 0.2); }
  100% { background-color: rgba(64, 158, 255, 0.1); }
}

.folder-item.highlight {
  animation: highlight 1.5s ease-in-out;
}

/* 强化二级分类选中状态 */
.subcategory-item .folder-item.active {
  background-color: #e6f1ff;
  border-right: 3px solid #409eff;
  font-weight: 600;
}

/* 二级分类样式增强 */
.subcategory-item .folder-item {
  font-size: 13px;
  border-left: 2px solid transparent;
  background-color: #f5f5f5;
  margin-bottom: 2px;
  border-radius: 0 4px 4px 0;
  color: #424242;
}

.subcategory-item .folder-item.active {
  background-color: #e8f5e9;
  border-left-color: #43a047;
  color: #2e7d32;
}

.subcategory-item .folder-item .folder-icon {
  color: #43a047;
}

.subcategory-item .folder-item.active .folder-icon {
  color: #2e7d32;
}

/* 三级分类样式增强 */
.third-level-item .folder-item {
  font-size: 12px;
  border-left: 1px solid transparent;
  background-color: #fafafa;
  color: #616161;
  border-radius: 0 4px 4px 0;
  padding: 5px 8px;
}

.third-level-item .folder-item.active {
  background-color: #fff3e0;
  border-left-color: #ff9800;
  color: #e65100;
}

.third-level-item .folder-item .folder-icon {
  color: #ff9800;
  font-size: 12px;
}

.third-level-item .folder-item.active .folder-icon {
  color: #e65100;
}

/* 改进缩进和连接线样式 */
.subcategories {
  padding-left: 16px;
  margin: 4px 0 6px 3px;
  position: relative;
  border-left: 1px dashed #bbdefb;
}

.third-level {
  padding-left: 14px;
  margin: 4px 0 6px 2px;
  position: relative;
  border-left: 1px dashed #c8e6c9;
}

.subcategories:before,
.third-level:before {
  display: none;
}

.subcategory-item:before,
.third-level-item:before {
  display: none;
}

/* 分类展开/折叠状态更明显 */
.first-level > .folder-item.folder-expanded {
  background-color: #bbdefb !important;
  box-shadow: 0 1px 3px rgba(21, 101, 192, 0.2);
}

.subcategory-item .folder-item.folder-expanded {
  background-color: #e8f5e9 !important;
  box-shadow: 0 1px 2px rgba(46, 125, 50, 0.2);
}

.links-section {
  margin-bottom: 20px;
}

.links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.external-link {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f0f7ff;
  color: #1976d2;
  text-decoration: none;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #d9ecff;
  transition: all 0.2s;
}

.external-link:hover {
  background-color: #e3f2fd;
  color: #1565c0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.job-link {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-color: #c8e6c9;
}

.job-link:hover {
  background-color: #dcedc8;
  color: #2e7d32;
}

.company-link {
  background-color: #e3f2fd;
  color: #1565c0;
  border-color: #bbdefb;
}

.company-link:hover {
  background-color: #bbdefb;
  color: #0d47a1;
}

.link-icon {
  margin-right: 6px;
  font-style: normal;
}

.metadata-section {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px dashed #ebeef5;
}

.metadata-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.metadata-item {
  font-size: 12px;
  color: #909399;
}

.metadata-label {
  font-weight: 500;
}

.metadata-value {
  margin-left: 4px;
}

/* 福利显示部分样式 */
.benefits-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.benefit-tag {
  padding: 5px 10px;
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #e1f3d8;
}

/* 职业描述样式优化 */
.description-section {
  margin-bottom: 20px;
  background-color: #f9fafc;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.description-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.description-content p {
  margin: 0 0 15px 0;
  padding: 0;
  text-align: justify;
}

.career-list {
  margin: 0 0 15px 0;
  padding: 0 0 0 10px;
  list-style: none;
}

.career-list li {
  padding: 5px 0;
  position: relative;
  margin-bottom: 8px;
}

.list-marker {
  font-weight: 600;
  color: #409eff;
  margin-right: 4px;
  display: inline-block;
  min-width: 20px;
  text-align: left;
}

.list-bullet .list-marker {
  color: #67c23a;
}

.list-number {
  counter-increment: item;
  display: flex;
}

.list-chinese, .list-letter {
  display: flex;
}

.description-content .list-text {
  font-weight: 500;
  color: #303133;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}

/* 公司介绍部分样式 */
.company-section {
  margin-bottom: 20px;
  background-color: #fafcff;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  border-left: 3px solid #909399;
}

.company-section .list-marker {
  color: #909399;
}

.company-section .list-bullet .list-marker {
  color: #909399;
}

/* 添加公司名称样式 */
.career-company {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style> 