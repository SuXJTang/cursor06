import request from '@/utils/request';

/**
 * 获取职业列表
 * @param {Object} params - 查询参数
 * @param {number} [params.skip=0] - 跳过的数量
 * @param {number} [params.limit=10] - 获取的数量
 * @returns {Promise} - 返回职业列表结果
 */
export function fetchCareers(params = {}) {
  return request({
    url: '/api/v1/careers',
    method: 'get',
    params
  });
}

/**
 * 获取职业分类树形结构
 * @returns {Promise} - 返回职业分类树
 */
export function fetchCategoryTree() {
  return request({
    url: '/api/v1/career-categories/tree',
    method: 'get'
  });
}

/**
 * 获取职业详情
 * @param {string} id - 职业ID
 * @returns {Promise} - 返回职业详情
 */
export function fetchCareerDetail(id) {
  return request({
    url: `/api/v1/careers/${id}`,
    method: 'get'
  });
}

/**
 * 获取特定分类下的职业
 * @param {string} categoryId - 分类ID
 * @param {Object} params - 分页参数
 * @returns {Promise} - 返回分类下的职业
 */
export function fetchCareersByCategory(categoryId, params = {}) {
  return request({
    url: `/api/v1/careers-sync/category/${categoryId}`,
    method: 'get',
    params
  });
}

/**
 * 收藏职业
 * @param {string} careerId - 职业ID
 * @returns {Promise} - 返回收藏结果
 */
export function addFavorite(careerId) {
  return request({
    url: `/api/v1/careers/${careerId}/favorite`,
    method: 'post'
  });
}

/**
 * 取消收藏职业
 * @param {string} careerId - 职业ID
 * @returns {Promise} - 返回取消收藏结果
 */
export function removeFavorite(careerId) {
  return request({
    url: `/api/v1/careers/${careerId}/favorite`,
    method: 'delete'
  });
}

/**
 * 获取用户收藏的职业
 * @returns {Promise} - 返回收藏的职业列表
 */
export function fetchFavorites() {
  return request({
    url: '/api/v1/careers/user/favorites',
    method: 'get'
  });
}

/**
 * 搜索职业
 * @param {string} keyword - 搜索关键词
 * @param {Object} params - 分页参数
 * @returns {Promise} - 返回搜索结果
 */
export function searchCareers(keyword, params = {}) {
  return request({
    url: `/api/v1/careers/search/${keyword}`,
    method: 'get',
    params
  });
}

/**
 * 按技能搜索职业
 * @param {Array} skills - 技能列表
 * @param {Object} params - 分页参数
 * @returns {Promise} - 返回搜索结果
 */
export function searchCareersBySkills(skills, params = {}) {
  return request({
    url: '/api/v1/careers/skills/',
    method: 'get',
    params: {
      ...params,
      skills
    }
  });
} 