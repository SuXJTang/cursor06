import request from '@/utils/request';

/**
 * 获取所有根级职业分类
 * @returns {Promise} 职业分类列表
 */
export function getRootCategories() {
  return request({
    url: '/api/v1/career-categories/roots',
    method: 'get'
  });
}

/**
 * 获取指定ID的分类及其子分类（树形结构）
 * @param {string|number} id 分类ID
 * @returns {Promise} 分类树结构
 */
export function getCategoryTreeById(id) {
  return request({
    url: `/api/v1/career-categories/${id}/tree`,
    method: 'get'
  });
}

/**
 * 获取完整的分类树结构
 * @returns {Promise} 完整分类树
 */
export function getCategoryTree() {
  return request({
    url: '/api/v1/career-categories/tree',
    method: 'get'
  });
}

/**
 * 获取特定分类下的职业
 * @param {string|number} categoryId 分类ID
 * @param {Object} params 分页参数
 * @param {boolean} [includeSubcategories=false] 是否包含子分类的职业
 * @returns {Promise} 分类下的职业
 */
export function getCategoryCareers(categoryId, params = {}, includeSubcategories = false) {
  return request({
    url: `/api/v1/career-categories/${categoryId}/careers`,
    method: 'get',
    params: {
      ...params,
      include_subcategories: includeSubcategories
    }
  });
} 