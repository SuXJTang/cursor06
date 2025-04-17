
const getFavoriteCareers = async (): Promise<any[]> => {
  try {
    console.log('获取用户收藏的职业列表');
    
    // 使用正确的API路径
    const response = await request.get('/api/v1/careers/user/favorites', {
      baseURL: '/' // 覆盖默认baseURL
    });
    
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
  } catch (error: any) {
    console.error('获取收藏职业失败:', error);
    
    // 如果是404错误，表示没有收藏，返回空数组
    if (error.response && error.response.status === 404) {
      console.log('用户没有收藏职业');
      return [];
    }
    
    throw error;
  }
};

// 调试：快速登录测试用户
const debugQuickLogin = async () => {
  try {
    console.log('尝试快速登录测试用户');
    
    // 测试用户登录信息
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    
    // 发送登录请求
    const response = await request.post('/api/v1/auth/login', loginData, {
      baseURL: '/'
    });
    
    console.log('登录响应:', response);
    
    // 检查是否有token
    if (response && response.token) {
      // 存储token
      localStorage.setItem('auth_token', response.token);
      
      // 更新认证状态
      authStore.setAuthenticated(true);
      
      // 重新加载数据
      ElMessage.success('登录成功，开始加载数据');
      setTimeout(() => refreshData(), 500);
    } else {
      ElMessage.error('登录失败：无效的响应格式');
    }
  } catch (error) {
    console.error('快速登录失败:', error);
    ElMessage.error('登录失败，请手动登录');
  }
};
</script>

<style scoped lang="scss">
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
  width: 100%;
  border-right: none;
  
  .el-sub-menu {
    // 确保子菜单能够显示完整
    width: 100%;
    
    &.is-active {
      .submenu-title {
        color: var(--el-color-primary);
        font-weight: bold;
      }
    }
    
    .el-sub-menu__title {
      height: auto;
      padding: 12px 20px;
    }
  }
  
  .el-menu-item {
    height: auto;
    padding: 10px 20px 10px 48px;
    line-height: 1.5;
    
    &.is-active {
      background-color: var(--el-color-primary-light-9);
    }
  }
  
  // 增加缩进效果
  .el-sub-menu .el-sub-menu .el-menu-item {
    padding-left: 65px;
  }
  
  // 分类指示器样式
  .category-indicator {
    width: 3px;
    height: 16px;
    position: absolute;
    left: 0;
    border-radius: 0 2px 2px 0;
    transition: all 0.3s;
    
    &.active-indicator {
      background-color: var(--el-color-primary);
    }
  }
  
  // 提高子菜单标题的可点击性
  .submenu-title {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    
    .el-icon {
      margin-right: 5px;
    }
  }
}

// 响应式优化
@media (max-width: 1200px) {
  .category-menu {
    .el-menu-item, .el-sub-menu__title {
      padding: 8px 15px;
      font-size: 13px;
    }
  }
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
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  cursor: pointer;
  font-size: 22px;
  transition: all 0.2s ease;
}

.favorite-icon:hover {
  transform: scale(1.2);
}

.career-item:hover,
.career-item.active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary);
}

.career-item-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
  padding-right: 30px; /* 为收藏图标留出空间 */
}

.career-item-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--el-color-primary);
}

.career-level {
  margin-bottom: 8px;
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

/* 为菜单添加垂直连接线 */
.category-menu {
  position: relative;
}

/* 为子菜单添加垂直连接线 */
:deep(.el-sub-menu.is-opened) {
  position: relative;
}

:deep(.el-sub-menu.is-opened::before) {
  display: none;
}

:deep(.el-menu--inline .el-menu-item::before) {
  display: none;
}

:deep(.el-menu-item.is-active::after), 
:deep(.el-sub-menu.is-active > .el-sub-menu__title::after) {
  display: none;
}

/* 重置菜单项的样式为默认样式 */
:deep(.el-menu-item.is-active) {
  background-color: transparent;
  color: var(--el-color-primary);
  font-weight: bold;
  border-left: none;
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  background-color: transparent;
  color: var(--el-color-primary);
  font-weight: bold;
  border-left: none;
}

:deep(.el-sub-menu.is-opened.is-active > .el-sub-menu__title) {
  background-color: transparent;
  border-left: none;
}

/* 蓝色点样式优化 */
.category-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: transparent;
  transition: all 0.3s ease;
}

.active-indicator {
  background-color: var(--el-color-primary);
  box-shadow: 0 0 4px var(--el-color-primary);
}

/* 子菜单样式简化 */
:deep(.el-menu--inline) {
  background-color: #f5f7fa;  /* 灰色背景 */
  margin-left: 20px;
  padding-left: 0;
  border-radius: 4px;
}

/* 基本菜单项布局 */
:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s ease;  /* 加长过渡时间使动画更丝滑 */
}

/* 基本图标样式 */
:deep(.el-icon) {
  margin-right: 6px;
  font-size: 16px;
}

/* 菜单悬停效果 */
:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background-color: var(--el-color-primary-light-9);
}

/* 保持菜单风格一致 */
:deep(.category-menu) {
  border-right: none;
}

/* 一级菜单展开时的背景 */
:deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  transition: all 0.3s ease;
}

/* 菜单展开/折叠的丝滑过渡 */
:deep(.el-menu-item), 
:deep(.el-sub-menu__title), 
:deep(.el-sub-menu__icon-arrow) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 选中状态的文本过渡效果 */
:deep(.el-menu-item.is-active), 
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--el-color-primary);
  font-weight: bold;
  transition: all 0.3s ease;
}

/* 子菜单展开箭头动画 */
:deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  transform: rotateZ(180deg);
}

/* 一级菜单展开时的背景效果 */
:deep(.el-sub-menu.is-opened:not(.is-nested)) {
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 4px;
}

/* 选中的子菜单项背景 */
:deep(.el-menu--inline .el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
}

/* 蓝色点样式增强 */
.category-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: transparent;
  transition: all 0.3s ease;
}

.active-indicator {
  background-color: var(--el-color-primary);
  box-shadow: 0 0 6px var(--el-color-primary);
}

.company-logo {
  max-width: 40px;
  max-height: 40px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 5px;
}

.company-name {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.company-info {
  margin-top: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.company-info h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #505050;
}

.company-link {
  margin-top: 10px;
}

.company-link a {
  color: #409eff;
  text-decoration: none;
}

/* 分页控件样式 */
.pagination-container {
  display: flex;
  justify-content: center;
}
</style> 