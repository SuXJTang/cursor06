import request from '@/utils/request';

/**
 * 检查职业是否被当前用户收藏
 * @param {string|number} careerId 职业ID
 * @returns {Promise} 检查结果
 */
export function checkIsFavorite(careerId) {
  return request({
    url: `/api/v1/careers/${careerId}/is_favorite`,
    method: 'get'
  });
}

/**
 * 获取用户收藏的所有职业
 * @returns {Promise} 收藏的职业列表
 */
export function getUserFavorites() {
  return request({
    url: '/api/v1/careers/user/favorites',
    method: 'get'
  });
}

/**
 * 收藏职业
 * @param {string|number} careerId 职业ID
 * @returns {Promise} 操作结果
 */
export function addFavorite(careerId) {
  return request({
    url: `/api/v1/careers/${careerId}/favorite`,
    method: 'post'
  });
}

/**
 * 取消收藏职业
 * @param {string|number} careerId 职业ID
 * @returns {Promise} 操作结果
 */
export function removeFavorite(careerId) {
  return request({
    url: `/api/v1/careers/${careerId}/favorite`,
    method: 'delete'
  });
} 