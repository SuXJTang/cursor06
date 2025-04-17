<template>
  <div class="career-list-view">
    <el-row class="career-header">
      <el-col :span="24">
        <h1 class="page-title">职业库</h1>
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索职业"
            clearable
            @input="onSearchInput"
            @clear="onSearchClear"
          >
            <template #prefix>
              <el-icon><ElementIcons.Search /></el-icon>
            </template>
          </el-input>
        </div>
      </el-col>
    </el-row>

    <el-row class="career-container">
      <!-- 左侧：分类过滤器 -->
      <el-col :span="4" class="category-filter">
        <div class="filter-header">
          <h3>职业分类</h3>
        </div>
        <el-tree
          ref="categoryTree"
          :data="categories"
          :props="{ label: 'name', children: 'children' }"
          @node-click="onCategorySelect"
          node-key="id"
          highlight-current
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span class="count" v-if="data.count !== undefined">({{ data.count }})</span>
            </div>
          </template>
        </el-tree>
      </el-col>

      <!-- 中间：职业列表 -->
      <el-col :span="8" class="career-list">
        <div class="filter-bar">
          <div class="selected-filters">
            <el-tag 
              v-if="selectedCategory" 
              closable 
              @close="clearCategoryFilter"
              effect="plain"
            >
              分类: {{ selectedCategory.name }}
            </el-tag>
            <el-tag 
              v-if="searchQuery" 
              closable
              @close="clearSearchFilter"
              effect="plain"
            >
              搜索: {{ searchQuery }}
            </el-tag>
          </div>
          <div class="sort-filter">
            <el-select v-model="sortOption" placeholder="排序方式" @change="onSortChange">
              <el-option label="默认排序" value="default" />
              <el-option label="薪资高到低" value="salary_desc" />
              <el-option label="薪资低到高" value="salary_asc" />
              <el-option label="名称（A-Z）" value="name_asc" />
              <el-option label="名称（Z-A）" value="name_desc" />
            </el-select>
          </div>
        </div>

        <!-- 职业列表 -->
        <div class="career-list-content">
          <!-- 加载状态 -->
          <div v-if="loading && !careers.length" class="career-loading-state">
            <el-skeleton :rows="5" animated />
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="career-error-state">
            <el-empty :description="error">
              <el-button type="primary" @click="loadCareers">重试</el-button>
            </el-empty>
          </div>
          
          <!-- 空数据状态 -->
          <div v-else-if="!careers.length" class="career-empty-state">
            <el-empty description="没有找到职业数据"></el-empty>
          </div>
          
          <!-- 职业列表 -->
          <template v-else>
            <el-card 
              v-for="career in careers" 
              :key="career.id" 
              class="career-item-card"
              :class="{ 'is-selected': selectedCareerId === career.id }"
              @click="onSelectCareer(career)"
            >
              <div class="career-title">{{ career.title || career.name }}</div>
              <div class="career-info">
                <div class="salary" v-if="career.salary_range">
                  <el-icon><ElementIcons.Money /></el-icon>
                  <span>{{ career.salary_range }}</span>
                </div>
                <div class="education" v-if="career.education_required || career.education_requirements">
                  <el-icon><ElementIcons.School /></el-icon>
                  <span>{{ career.education_required || career.education_requirements }}</span>
                </div>
              </div>
            </el-card>
            
            <!-- 加载更多 -->
            <div v-if="loading" class="career-loading-more">
              <el-icon class="loading-icon"><ElementIcons.Loading /></el-icon>
              <span>加载更多...</span>
            </div>
            
            <!-- 全部加载完成 -->
            <div v-if="!hasMore && careers.length" class="career-loaded-all">
              <span>没有更多数据了</span>
            </div>
          </template>
        </div>
      </el-col>

      <!-- 右侧：职业详情 -->
      <el-col :span="12" class="career-detail-panel">
        <template v-if="selectedCareer">
          <CareerDetail 
            :career="selectedCareer"
            @toggle-favorite="onToggleFavorite"
          />
        </template>
        <template v-else>
          <div class="no-career-selected">
            <el-empty description="请选择一个职业查看详情"></el-empty>
          </div>
        </template>
      </el-col>
    </el-row>

    <!-- 返回顶部按钮 -->
    <el-backtop target=".career-list-content" :right="20" :bottom="20" />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch, defineComponent } from 'vue';
import * as ElementIcons from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import CareerDetail from '../../components/career/CareerDetail.vue';
import type { Career, CareerCategory, PaginationParams } from '../../types/career';

// API导入路径修正
import { getFavoriteCareers, addFavoriteCareer, removeFavoriteCareer } from '../../api/favorites/index';
import { getCareers, searchCareers, fetchCareerDetail } from '../../api/career/index';
import { getRootCategories, getCategoryTree } from '../../api/career/categories';

export default defineComponent({
  name: 'CareerListView',
  components: {
    CareerDetail
  },
  setup() {
    // 分页状态
    const pagination = ref<PaginationParams>({
      page: 1,
      pageSize: 20
    });
    
    // 数据加载状态
    const loading = ref(false);
    const error = ref('');
    const careers = ref<Career[]>([]);
    const totalCareers = ref(0);
    const hasMore = ref(true);
    
    // 过滤与排序状态
    const searchQuery = ref('');
    const sortOption = ref('default');
    const categories = ref<CareerCategory[]>([]);
    const selectedCategory = ref<CareerCategory | null>(null);
    const defaultExpandedKeys = ref<(string | number)[]>([]);
    
    // 选中职业状态
    const selectedCareerId = ref<string | number | null>(null);
    const selectedCareer = ref<Career | null>(null);
    
    // 节流搜索输入
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const onSearchInput = () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      searchTimeout = setTimeout(() => {
        resetPagination();
        loadCareers();
      }, 500);
    };
    
    const onSearchClear = () => {
      searchQuery.value = '';
      resetPagination();
      loadCareers();
    };
    
    // 清除筛选
    const clearCategoryFilter = () => {
      selectedCategory.value = null;
      resetPagination();
      loadCareers();
    };
    
    const clearSearchFilter = () => {
      searchQuery.value = '';
      resetPagination();
      loadCareers();
    };
    
    // 排序变更
    const onSortChange = () => {
      resetPagination();
      loadCareers();
    };
    
    // 重置分页
    const resetPagination = () => {
      pagination.value.page = 1;
      careers.value = [];
      hasMore.value = true;
    };
    
    // 加载职业分类
    const loadCategories = async () => {
      try {
        // 直接获取根分类，并请求包含子分类
        const result = await getRootCategories();
        console.log('分类数据:', result);
        
        if (result && Array.isArray(result)) {
          categories.value = result;
          // 展开第一级分类
          if (categories.value.length > 0) {
            defaultExpandedKeys.value = categories.value.map(cat => cat.id);
          }
        }
      } catch (err) {
        console.error('加载职业分类失败:', err);
        ElMessage.error('加载职业分类失败，请刷新页面重试');
      }
    };
    
    // 选择分类
    const onCategorySelect = (category: CareerCategory) => {
      selectedCategory.value = category;
      resetPagination();
      loadCareers();
    };
    
    // 加载职业列表
    const loadCareers = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        let response;
        
        if (searchQuery.value) {
          // 搜索职业
          response = await searchCareers({
            query: searchQuery.value,
            page: pagination.value.page,
            pageSize: pagination.value.pageSize
          });
        } else if (selectedCategory.value) {
          // 获取所有职业然后在前端进行过滤
          response = await getCareers({
            page: pagination.value.page,
            pageSize: pagination.value.pageSize
          });
          
          // 如果成功获取职业数据，进行分类过滤
          if (response && response.items) {
            // 在前端进行分类过滤
            const filteredCareers = filterCareersByCategory(
              response.items, 
              String(selectedCategory.value.id),
              selectedCategory.value.level || 1
            );
            
            // 更新响应数据
            response = {
              ...response,
              items: filteredCareers,
              total: filteredCareers.length,
              hasMore: false // 前端过滤后就没有更多数据了
            };
          }
        } else {
          // 未选择分类时，获取所有职业
          response = await getCareers({
            page: pagination.value.page,
            pageSize: pagination.value.pageSize
          });
        }
        
        // 处理响应数据
        if (response && Array.isArray(response)) {
          // 如果是第一页，替换数据；否则，追加数据
          if (pagination.value.page === 1) {
            careers.value = response;
          } else {
            careers.value = [...careers.value, ...response];
          }
          
          // 更新是否有更多数据
          hasMore.value = response.length === pagination.value.pageSize;
        } else if (response && (response.items || response.data)) {
          // 处理包含分页信息的响应
          const newCareers = response.items || response.data || [];
          
          // 如果是第一页，替换数据；否则，追加数据
          if (pagination.value.page === 1) {
            careers.value = newCareers;
          } else {
            careers.value = [...careers.value, ...newCareers];
          }
          
          // 更新总数和是否有更多数据
          totalCareers.value = response.total || 0;
          hasMore.value = response.hasMore || (careers.value.length < totalCareers.value);
        } else {
          // 未登录或其他错误情况，显示空数据而不是错误
          if (pagination.value.page === 1) {
            careers.value = [];
          }
          hasMore.value = false;
          
          // 根据响应状态设置提示信息
          if (response && response.status === 401) {
            error.value = '您需要登录才能查看职业信息';
          } else if (!response) {
            error.value = '暂无职业数据';
          }
        }
        
        // 自动选择第一个职业
        if (careers.value.length > 0 && !selectedCareer.value) {
          onSelectCareer(careers.value[0]);
        }
      } catch (err) {
        console.error('加载职业列表失败:', err);
        // 检查错误类型并设置友好的错误信息
        if (err.response && err.response.status === 401) {
          error.value = '您需要登录才能查看职业信息，请先登录';
        } else {
          error.value = '加载职业列表失败，请稍后重试';
        }
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    };
    
    // 辅助函数：按分类ID过滤职业
    const filterCareersByCategory = (careers: Career[], categoryId: string, level: number) => {
      if (!categoryId || !careers || !Array.isArray(careers)) {
        return careers;
      }
      
      // 根据分类层级决定过滤逻辑
      if (level === 1) {
        // 一级分类：直接匹配或检查父分类ID
        return careers.filter(career => {
          return career.category_id === categoryId;
        });
      } else if (level === 2) {
        // 二级分类：直接匹配
        return careers.filter(career => career.category_id === categoryId);
      } else {
        // 三级分类：直接匹配
        return careers.filter(career => career.category_id === categoryId);
      }
    };
    
    // 加载更多职业
    const loadMoreCareers = () => {
      if (loading.value || !hasMore.value) return;
      pagination.value.page += 1;
      loadCareers();
    };
    
    // 更新收藏状态
    const updateFavoritesStatus = async () => {
      if (careers.value.length === 0) return;
      
      // 为每个职业设置一个默认的收藏状态(未登录时)
      careers.value.forEach(career => {
        if (career.is_favorite === undefined) {
          career.is_favorite = false;
        }
      });
      
      // 如果已登录，尝试获取真实收藏状态
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // 获取用户收藏的所有职业
          const favorites = await getFavoriteCareers();
          if (favorites && Array.isArray(favorites)) {
            // 获取所有收藏的职业ID
            const favoriteIds = favorites.map(fav => fav.id);
            
            // 更新本地职业的收藏状态
            careers.value.forEach(career => {
              career.is_favorite = favoriteIds.includes(career.id);
            });
          }
        } catch (err) {
          console.error('获取收藏状态失败:', err);
        }
      }
    };
    
    // 选择职业
    const onSelectCareer = async (career: Career) => {
      selectedCareerId.value = career.id;
      selectedCareer.value = career;
      
      // 获取详细信息
      try {
        // 如果已经登录，尝试获取完整详情
        const token = localStorage.getItem('auth_token');
        if (token) {
          const detail = await fetchCareerDetail(career.id);
          if (detail) {
            // 合并已有数据和详细数据
            selectedCareer.value = { ...career, ...detail };
          }
        }
      } catch (err) {
        console.error('获取职业详情失败:', err);
        ElMessage.error('获取职业详情失败，显示基本信息');
      }
    };
    
    // 切换收藏状态
    const onToggleFavorite = async (career: Career) => {
      try {
        if (career.is_favorite) {
          // 取消收藏
          await removeFavoriteCareer(career.id);
        } else {
          // 添加收藏
          await addFavoriteCareer(career.id);
        }
        
        // 更新本地收藏状态
        career.is_favorite = !career.is_favorite;
        
        // 如果当前选中的职业是被切换的职业，同步更新其收藏状态
        if (selectedCareer.value && selectedCareer.value.id === career.id) {
          selectedCareer.value.is_favorite = career.is_favorite;
        }
      } catch (error) {
        console.error('切换收藏状态失败:', error);
        ElMessage.error('操作失败，请稍后重试');
      }
    };
    
    // 组件挂载
    onMounted(async () => {
      await loadCategories();
      await loadCareers();
    });
    
    // 实现无限滚动
    // 监听滚动事件，当滚动到底部时加载更多数据
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
        loadMoreCareers();
      }
    };
    
    // 组件挂载后添加滚动监听
    onMounted(() => {
      const careerListContent = document.querySelector('.career-list-content');
      if (careerListContent) {
        careerListContent.addEventListener('scroll', handleScroll);
      }
    });
    
    return {
      // 状态
      pagination,
      loading,
      error,
      careers,
      totalCareers,
      hasMore,
      searchQuery,
      sortOption,
      categories,
      selectedCategory,
      defaultExpandedKeys,
      selectedCareerId,
      selectedCareer,
      
      // 方法
      onSearchInput,
      onSearchClear,
      clearCategoryFilter,
      clearSearchFilter,
      onSortChange,
      loadCategories,
      onCategorySelect,
      loadCareers,
      loadMoreCareers,
      onSelectCareer,
      onToggleFavorite,
      
      // 图标
      ElementIcons
    };
  }
});
</script>

<style scoped>
.career-list-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.career-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 500;
}

.search-bar {
  max-width: 400px;
}

.career-container {
  flex: 1;
  min-height: 0;
  height: calc(100% - 100px);
  overflow: hidden;
}

/* 左侧分类 */
.category-filter {
  padding: 16px;
  border-right: 1px solid #e4e7ed;
  height: 100%;
  overflow-y: auto;
}

.filter-header {
  margin-bottom: 16px;
}

.filter-header h3 {
  margin: 0;
  font-size: 16px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.count {
  color: #909399;
  font-size: 12px;
}

/* 中间职业列表 */
.career-list {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e7ed;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.selected-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-filter {
  width: 180px;
}

.career-list-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.career-item-card {
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.career-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.career-item-card.is-selected {
  border-left: 4px solid #409EFF;
}

.career-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.career-info {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #606266;
}

.salary, .education {
  display: flex;
  align-items: center;
  gap: 4px;
}

.career-loading-more, .career-loaded-all {
  text-align: center;
  padding: 12px 0;
  color: #909399;
}

.loading-icon {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 右侧详情 */
.career-detail-panel {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.no-career-selected {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 