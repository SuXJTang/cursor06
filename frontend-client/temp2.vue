    } catch (conversionError) {
      console.error('ID转换失败:', conversionError);
      isFavorite.value = false;
    }
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    // 增加更详细的错误信息
    if (error.response) {
      console.error('错误响应数据:', error.response.data);
      console.error('错误状态码:', error.response.status);
    }
    isFavorite.value = false;
  }
};

// 已收藏职业ID列表 - 改用Set结构提高查询性能
const favoriteCareersIds = ref(new Set<string>());

// 获取用户收藏的职业ID列表 - 强化版
const fetchFavoriteCareersIds = async () => {
  try {
    console.log('开始获取收藏列表...');
    if (!authStore.isAuthenticated) {
      console.log('用户未登录，清空收藏列表');
      favoriteCareersIds.value.clear();
      return;
    }
    
    // 使用正确的API端点获取收藏列表
    const response = await request.get('/v1/careers/user/favorites', {
      baseURL: '/' // 覆盖默认baseURL
    });
    console.log('收藏列表API响应:', response);
    
    // 使用类型断言处理响应
    const respObj = response as Record<string, any>;
    
    // 检查careers字段是否存在
    if (respObj && respObj.careers && Array.isArray(respObj.careers)) {
      // 清空现有集合
      favoriteCareersIds.value.clear();
      
      // 添加所有ID，确保转为字符串
      respObj.careers.forEach((career: any) => {
        if (career && career.id) {
          favoriteCareersIds.value.add(String(career.id));
        }
      });
      
      console.log('收藏列表获取成功，数量:', favoriteCareersIds.value.size);
      console.log('收藏IDs:', Array.from(favoriteCareersIds.value));
      
      // 强制更新收藏状态
      if (selectedCareerId.value) {
        isFavorite.value = isCareerFavorited(selectedCareerId.value);
      }
    } else {
      console.warn('无效的收藏列表响应格式:', respObj);
      // 尝试其他可能的响应格式
      if (Array.isArray(respObj)) {
        // 如果直接返回数组
        favoriteCareersIds.value.clear();
        respObj.forEach((career: any) => {
          if (career && career.id) {
            favoriteCareersIds.value.add(String(career.id));
          }
        });
        console.log('从数组响应获取收藏，数量:', favoriteCareersIds.value.size);
      }
    }
  } catch (error) {
    console.error('获取收藏职业列表失败:', error);
    
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误响应:', error.response.data);
    }
    
    // 清空收藏列表
    favoriteCareersIds.value.clear();
    
    // 如果出现404错误，可能是API路径问题，尝试备用路径
    if (error.response && error.response.status === 404) {
      try {
        console.log('尝试备用API路径获取收藏列表');
        const backupResponse = await request.get('/v1/careers/favorites', {
          baseURL: '/' // 覆盖默认baseURL
        });
        
        // 使用类型断言处理响应
        const backupRespObj = backupResponse as Record<string, any>;
        
        if (backupRespObj && backupRespObj.careers && Array.isArray(backupRespObj.careers)) {
          // 清空现有集合
          favoriteCareersIds.value.clear();
          
          // 添加所有ID
          backupRespObj.careers.forEach((career: any) => {
            if (career && career.id) {
              favoriteCareersIds.value.add(String(career.id));
            }
          });
          
          console.log('备用路径获取收藏列表成功，数量:', favoriteCareersIds.value.size);
        }
      } catch (backupError) {
        console.error('备用路径获取收藏列表失败:', backupError);
      }
    }
  }
};

// 检查职业是否被收藏（使用Set提高性能）
const isCareerFavorited = (id: string | number): boolean => {
  // 确保ID是字符串类型，以支持UUID
  const careerId = String(id);
  
  // 检查该职业是否在收藏列表中
  return favoriteCareersIds.value.has(careerId);
};

// 添加或删除收藏
const toggleFavorite = async (career: Career) => {
  try {
    const careerId = String(career.id);
    const isFavorited = isCareerFavorited(careerId);
    
    console.log(`${isFavorited ? '取消收藏' : '添加收藏'} 职业ID: ${careerId}, 名称: ${career.name}`);
    
    if (isFavorited) {
      // 从收藏中移除
      await removeFavoriteCareer(careerId);
      ElMessage.success(`已取消收藏: ${career.name}`);
      
      // 更新收藏列表
      favoriteCareersIds.value.delete(careerId);
    } else {
      // 添加到收藏
      await addFavoriteCareer(careerId);
      ElMessage.success(`已添加收藏: ${career.name}`);
      
      // 更新收藏列表
      favoriteCareersIds.value.add(careerId);
    }
    
    // 刷新收藏列表
    fetchFavoriteCareers();
  } catch (error: any) {
    console.error('操作收藏失败:', error);
    ElMessage.error(`操作失败: ${error.message || '未知错误'}`);
  }
};

// 自动重新获取收藏状态的计时器
let refreshFavoritesInterval: any = null;

// 页面加载时初始化数据
onMounted(async () => {
  console.log('职业库组件已挂载');
  
  // 初始化收藏列表集合
  favoriteCareersIds.value = new Set();
  
  // 检查URL是否包含重定向参数
  const url = window.location.href;
  if (url.includes('/login') || url.includes('redirect=')) {
    console.log('检测到重定向，尝试登录后访问');
    // 等待登录状态更新
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 检查登录状态
  if (!authStore.isAuthenticated) {
    console.log('用户未登录，提示登录');
    ElMessage.warning('请先登录后查看职业库');
    
    // 如果已经在登录页就不再重定向
    if (!url.includes('/login')) {
      router.push('/login?redirect=/career-library');
      return;
    }
  }
  
  // 先加载示例数据供用户预览
  setTimeout(() => {
    if (isLoading.value && careers.value.length === 0) {
      loadDemoData();
    }
  }, 300);
  
  try {
    // 获取分类数据
    await fetchCategories();
    
    // 获取收藏职业列表
    await fetchFavoriteCareers();
    
    // 如果请求成功但没有数据，也显示示例数据
    if (careers.value.length === 0) {
      loadDemoData();
    }
    
    console.log('职业库初始化完成');
  } catch (error) {
    console.error('职业库初始化失败:', error);
    ElMessage.error('加载数据失败，显示示例数据');
    
    // 请求失败时显示示例数据
    loadDemoData();
  }
});

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (refreshFavoritesInterval) {
    clearInterval(refreshFavoritesInterval);
    refreshFavoritesInterval = null;
  }
});

// 添加更安全的ID转换函数
const safeParseInt = (value: any): number => {
  // 首先输出原始值用于调试
  console.log('尝试转换ID:', value, '类型:', typeof value);
  
  if (typeof value === 'number') {
    return value; // 已经是数字，直接返回
  }
  
  if (typeof value === 'string') {
    // 处理可能的字符串格式问题
    const cleanedValue = value.trim().replace(/[^0-9]/g, '');
    if (cleanedValue) {
      const num = parseInt(cleanedValue, 10);
      console.log('转换结果:', num);
      return num;
    }
  }
  
  // 默认返回一个安全值，或者抛出异常
  console.error('无法转换为有效整数:', value);
  throw new Error(`无法将 ${value} 转换为有效整数ID`);
};

// 失败时使用备用API调用方式
const tryFallbackFavorite = async (careerId: number, action: 'add' | 'delete') => {
  try {
    console.log(`尝试备用方法进行${action === 'add' ? '添加' : '删除'}收藏...`);
    
    // 使用旧的API路径和表单数据方式
    const url = action === 'add' 
      ? `/api/v1/careers/favorite/add` 
      : `/api/v1/careers/favorite/delete`;
    
    console.log(`备用API调用: ${url}, 参数:`, { career_id: careerId });
    
    const response = await request.post(url, { 
      career_id: careerId,
      // 如果是删除，添加_method参数
      ...(action === 'delete' ? { _method: 'DELETE' } : {})
    });
    
    console.log('备用API响应:', response);
    return true;
  } catch (fallbackError) {
    console.error('备用API调用也失败:', fallbackError);
    return false;
  }
};

// 适配函数：将组件使用的Career类型适配为Pinia store使用的Career类型
const adaptCareerForStore = (careers: Career[], categoryId: string): any[] => {
  return careers.map(career => ({
    id: career.id,
    categoryId: categoryId,
    careerName: career.name,
    stage: career.level,
    // 保留原始数据
    ...career
  }))
}

/**
 * 处理和标准化分类数据项
 * @param items 原始分类数据
 * @returns 标准化后的分类数据
 */
const processCategoryItems = (items: any[]): CategoryResponse[] => {
  return items.map(item => {
    // 标准化格式
    const category: CategoryResponse = {
      id: item.id,
      name: item.name || item.title || `分类${item.id}`,
      parent_id: item.parent_id || item.parentId || null,
      subcategories: []
    };
    
    // 处理子分类
    if (Array.isArray(item.subcategories)) {
      category.subcategories = processCategoryItems(item.subcategories);
    } else if (Array.isArray(item.children)) {
      category.subcategories = processCategoryItems(item.children);
    } else if (Array.isArray(item.sub_categories)) {
      category.subcategories = processCategoryItems(item.sub_categories);
    }
    
    return category;
  });
};

// 获取职业分类数据
const fetchCategories = async () => {
  try {
    console.log('开始获取职业分类数据');
    
    // 设置加载状态
    isLoading.value = true;
    
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
    
    // 使用正确的API获取分类数据
    const response = await request<any>({
      url: '/api/v1/careers/categories/tree',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });
    
    console.log('获取到分类数据:', response);
    
    // 更新原始数据（调试用）
    rawApiData.value = JSON.stringify(response, null, 2);
    
    // 解析响应数据
    let categoryItems: any[] = [];
    
    if (response) {
      if (Array.isArray(response)) {
        categoryItems = response;
      } else if (response.categories && Array.isArray(response.categories)) {
        categoryItems = response.categories;
      } else if (response.data && Array.isArray(response.data)) {
        categoryItems = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        categoryItems = response.items;
      } else if (response.results && Array.isArray(response.results)) {
        categoryItems = response.results;
      }
    }
    
    if (categoryItems.length > 0) {
      // 标准化分类数据结构
      categories.value = processCategoryItems(categoryItems);
      
      console.log(`成功加载 ${categories.value.length} 个顶级分类`);
      
      // 设置默认活动分类为第一个分类
      const firstCategory = categories.value[0];
      if (firstCategory) {
        activeCategory.value = String(firstCategory.id);
        console.log('设置默认活动分类:', activeCategory.value);
        
        // 获取该分类下的职业数据
        await fetchCareers(activeCategory.value);
      }
    } else {
      console.warn('未获取到分类数据或数据为空');
      
      // 创建示例分类数据
      categories.value = [
        { id: 1, name: '互联网/IT', subcategories: [
          { id: 101, name: '开发', subcategories: [] },
          { id: 102, name: '测试', subcategories: [] },
          { id: 103, name: '产品', subcategories: [] }
        ] },
        { id: 2, name: '金融', subcategories: [
          { id: 201, name: '银行', subcategories: [] },
          { id: 202, name: '证券', subcategories: [] }
        ] },
        { id: 3, name: '教育', subcategories: [] }
      ];
      
      activeCategory.value = '1';
      console.log('未找到分类数据，使用默认分类数据');
      
      // 获取默认分类的职业数据
      await fetchCareers(activeCategory.value);
    }
  } catch (error: any) {
    console.error('获取分类数据失败:', error);
    errorMessage.value = `获取分类数据失败: ${error.message || '未知错误'}`;
    ElMessage.error(errorMessage.value);
    
    // 创建示例分类数据，与上面的逻辑相同
    categories.value = [
      { id: 1, name: '互联网/IT', subcategories: [
        { id: 101, name: '开发', subcategories: [] },
        { id: 102, name: '测试', subcategories: [] },
        { id: 103, name: '产品', subcategories: [] }
      ] },
      { id: 2, name: '金融', subcategories: [
        { id: 201, name: '银行', subcategories: [] },
        { id: 202, name: '证券', subcategories: [] }
      ] },
      { id: 3, name: '教育', subcategories: [] }
    ];
    
    activeCategory.value = '1';
    console.log('加载分类失败，使用默认分类数据');
    
    await fetchCareers(activeCategory.value);
  } finally {
    isLoading.value = false;
  }
};

// 获取分类下的职业数据 (不包含额外处理逻辑)
const fetchCategoryCareers = (categoryId: string) => {
  console.log('获取分类下的职业:', categoryId);
  
  // 清空当前职业数据
  careers.value = [];
  selectedCareer.value = null;
  
  // 获取职业数据
  fetchCareers(categoryId);
};

// 生成默认职业发展路径
const getDefaultCareerPath = () => {
  return [
    { position: '初级岗位', description: '入门级职位，负责基础工作，积累经验' },
    { position: '中级岗位', description: '具备一定专业能力，可独立完成工作' },
    { position: '高级岗位', description: '具备深厚专业知识，可指导团队工作' },
    { position: '专家/管理岗', description: '行业专家或部门管理者，制定战略方向' }
  ];
};

// 获取收藏的职业列表
const fetchFavoriteCareers = async () => {
  try {
    console.log('获取收藏的职业列表');
    
    // 检查登录状态
    if (!authStore.isAuthenticated) {
      console.log('用户未登录，无法获取收藏列表');
      favoriteCareers.value = [];
      favoriteCareersIds.value.clear();
      return;
    }
    
    // 获取收藏职业列表
    const favorites = await getFavoriteCareers();
    console.log('获取到收藏职业:', favorites);
    
    // 更新收藏职业列表
    favoriteCareers.value = favorites;
    
    // 更新收藏ID集合，用于快速检索
    favoriteCareersIds.value.clear();
    favorites.forEach(career => {
      favoriteCareersIds.value.add(String(career.id));
    });
    
    console.log('收藏职业ID集合已更新，共', favoriteCareersIds.value.size, '个');
  } catch (error: any) {
    console.error('获取收藏职业失败:', error);
    ElMessage.error(`获取收藏列表失败: ${error.message || '未知错误'}`);
  }
};

// 获取当前选中分类的名称
const getCurrentCategoryName = (): string => {
  // 如果没有选中任何分类，返回默认文本
  if (!activeCategory.value) {
    return '所有职业';
  }
  
  // 在分类树中查找当前选中的分类
  const findCategoryName = (cats: CategoryResponse[], categoryId: string): string => {
    for (const cat of cats) {
      // 检查当前分类
      if (String(cat.id) === categoryId) {
        return cat.name;
      }
      
      // 检查子分类
      if (cat.subcategories && cat.subcategories.length > 0) {
        const name = findCategoryName(cat.subcategories, categoryId);
        if (name) {
          return name;
        }
      }
    }
    return '';
  };
  
  // 在所有分类中查找
  const name = findCategoryName(categories.value, activeCategory.value);
  return name || `分类 ${activeCategory.value}`;
};

// 调试：强制刷新
const debugForceRender = () => {
  console.log('强制刷新页面数据');
  
  // 清除缓存
  debugClearCache();
  
  // 重新获取分类数据
  fetchCategories();
  
  // 输出状态信息
  console.log('职业分类数:', categories.value.length);
  console.log('当前选中分类:', activeCategory.value);
};

// 调试：清除缓存
const debugClearCache = () => {
  // 清除与职业相关的所有缓存
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('careers_') || key.startsWith('categoryTree_'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // 清除store缓存
  careerStore.clearCache();
  
  ElMessage.success(`已清除${keysToRemove.length}项缓存数据`);
};

// 加载临时示例数据
const loadDemoData = () => {
  console.log('加载示例数据作为临时显示');
  
  // 创建示例分类数据
  if (categories.value.length === 0) {
    categories.value = [
      { id: 1, name: '互联网/IT', subcategories: [
        { id: 101, name: '软件开发', subcategories: [] },
        { id: 102, name: '测试/运维', subcategories: [] }
      ] },
      { id: 2, name: '金融', subcategories: [] },
      { id: 3, name: '教育', subcategories: [] }
    ];
    
    // 设置默认选中分类
    activeCategory.value = '1';
  }
  
  // 创建示例职业数据
  if (careers.value.length === 0) {
    careers.value = [
      createDefaultCareer('1', activeCategory.value, '软件工程师', '稳定发展期'),
      createDefaultCareer('2', activeCategory.value, '数据分析师', '快速发展期'),
      createDefaultCareer('3', activeCategory.value, '产品经理', '稳定发展期')
    ];
    
    // 选择第一个职业
    if (!selectedCareer.value && careers.value.length > 0) {
      selectedCareer.value = { ...careers.value[0] };
    }
  }
  
  ElMessage.info('加载示例数据供预览，实际数据加载中...');
};

// 手动导入收藏相关API
const addFavoriteCareer = async (careerId: string | number): Promise<any> => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`添加收藏职业: ${id}`);
    const response = await request.post(`/api/v1/careers/${id}/favorite`, {}, {
      baseURL: '/' // 覆盖默认baseURL
    });
    return response;
  } catch (error) {
    console.error('收藏职业失败:', error);
    throw error;
  }
};

const removeFavoriteCareer = async (careerId: string | number): Promise<any> => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`取消收藏职业: ${id}`);
    const response = await request.delete(`/api/v1/careers/${id}/favorite`, {
      baseURL: '/' // 覆盖默认baseURL
    });
    return response;
  } catch (error) {
    console.error('取消收藏职业失败:', error);
    throw error;
  }
};

