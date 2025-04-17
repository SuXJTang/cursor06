// 前面部分不变，从收藏相关API函数开始修改：

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

// 确保与前面的checkIsFavorite函数定义不冲突

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