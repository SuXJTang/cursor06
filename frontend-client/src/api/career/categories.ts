import { request } from '../request';
import { PaginationParams, convertToApiParams } from './index';

// 定义统一的API路径前缀
const API_PREFIX = '/api/v1';

/**
 * 获取所有职业分类
 * @param params 分页参数
 * @param includeChildren 是否包含子分类
 * @returns 所有职业分类
 */
export const getCategories = async (
  params: PaginationParams = { page: 1, pageSize: 50 },
  includeChildren: boolean = false
) => {
  try {
    console.log('获取所有职业分类:', { params, includeChildren });
    
    const apiParams = {
      ...convertToApiParams(params),
      include_children: includeChildren
    };
    
    const response = await request.get(`${API_PREFIX}/career-categories/`, { 
      params: apiParams 
    });
    
    console.log('获取所有职业分类响应:', response);
    
    return response;
  } catch (error) {
    console.error('获取所有职业分类失败:', error);
    return {
      items: [],
      total: 0
    };
  }
};

/**
 * 获取根职业分类
 * @param params 分页参数
 * @param includeChildren 是否包含子分类
 * @param includeAllChildren 是否包含所有层级的子分类
 * @returns 根职业分类列表
 */
export const getRootCategories = async (
  params: PaginationParams = { page: 1, pageSize: 50 },
  includeChildren: boolean = false,
  includeAllChildren: boolean = false
) => {
  try {
    console.log('获取根职业分类:', { params, includeChildren, includeAllChildren });
    
    const apiParams = {
      ...convertToApiParams(params),
      include_children: includeChildren,
      include_all_children: includeAllChildren
    };
    
    const response = await request.get(`${API_PREFIX}/career-categories/roots`, { 
      params: apiParams 
    });
    
    console.log('获取根职业分类响应:', response);
    
    return response;
  } catch (error) {
    console.error('获取根职业分类失败:', error);
    return {
      items: [],
      total: 0
    };
  }
};

/**
 * 获取完整分类树
 * @returns 完整分类树
 */
export const getCategoryTree = async () => {
  try {
    console.log('获取完整分类树');
    
    const response = await request.get(`${API_PREFIX}/career-categories/complete-tree`);
    
    console.log('获取完整分类树响应:', response);
    
    return response;
  } catch (error) {
    console.error('获取完整分类树失败:', error);
    return [];
  }
};

/**
 * 获取指定分类的详情
 * @param categoryId 分类ID
 * @returns 分类详情
 */
export const getCategoryById = async (categoryId: string | number) => {
  try {
    console.log(`获取分类详情: ${categoryId}`);
    
    // 确保categoryId是字符串
    const id = String(categoryId);
    
    const response = await request.get(`${API_PREFIX}/career-categories/${id}`);
    
    console.log(`获取分类详情响应:`, response);
    
    return response;
  } catch (error) {
    console.error(`获取分类详情失败: ${categoryId}`, error);
    return null;
  }
};

/**
 * 获取分类的子分类
 * @param categoryId 分类ID
 * @param params 分页参数
 * @param includeChildren 是否包含子子分类
 * @returns 子分类列表
 */
export const getSubcategories = async (
  categoryId: string | number,
  params: PaginationParams = { page: 1, pageSize: 50 },
  includeChildren: boolean = false
) => {
  try {
    console.log(`获取子分类: ${categoryId}`, { params, includeChildren });
    
    // 确保categoryId是字符串
    const id = String(categoryId);
    
    const apiParams = {
      ...convertToApiParams(params),
      include_children: includeChildren
    };
    
    const response = await request.get(`${API_PREFIX}/career-categories/${id}/subcategories`, { 
      params: apiParams 
    });
    
    console.log(`获取子分类响应:`, response);
    
    return response;
  } catch (error) {
    console.error(`获取子分类失败: ${categoryId}`, error);
    return {
      items: [],
      total: 0
    };
  }
};

/**
 * 获取分类下的所有职业
 * @param categoryId 分类ID
 * @param params 分页参数
 * @param includeSubcategories 是否包含子分类下的职业
 * @returns 分类下的职业列表
 */
export const getCategoryCareers = async (
  categoryId: string | number,
  params: PaginationParams = { page: 1, pageSize: 20 },
  includeSubcategories: boolean = true
) => {
  try {
    console.log(`获取分类下的职业: ${categoryId}`, { params, includeSubcategories });
    
    // 确保categoryId是字符串
    const id = String(categoryId);
    
    const apiParams = {
      ...convertToApiParams(params),
      include_subcategories: includeSubcategories
    };
    
    const response = await request.get(`${API_PREFIX}/career-categories/${id}/careers`, { 
      params: apiParams 
    });
    
    console.log(`获取分类下的职业响应:`, response);
    
    return response;
  } catch (error) {
    console.error(`获取分类下的职业失败: ${categoryId}`, error);
    return {
      careers: [],
      total: 0
    };
  }
};

/**
 * 获取指定分类的分类树
 * @param categoryId 分类ID
 * @returns 分类树
 */
export const getCategoryTreeById = async (categoryId: string | number) => {
  try {
    console.log(`获取分类树: ${categoryId}`);
    
    // 确保categoryId是字符串
    const id = String(categoryId);
    
    const response = await request.get(`${API_PREFIX}/career-categories/${id}/tree`);
    
    console.log(`获取分类树响应:`, response);
    
    return response;
  } catch (error) {
    console.error(`获取分类树失败: ${categoryId}`, error);
    return null;
  }
};

/**
 * 获取所有根分类及其职业
 * @param params 分页参数
 * @returns 根分类及其职业
 */
export const getAllRootCategoriesCareers = async (params: PaginationParams = { page: 1, pageSize: 20 }) => {
  try {
    console.log('获取所有根分类及其职业:', params);
    
    const apiParams = convertToApiParams(params);
    
    const response = await request.get(`${API_PREFIX}/career-categories/roots/careers`, { 
      params: apiParams 
    });
    
    console.log('获取所有根分类及其职业响应:', response);
    
    return response;
  } catch (error) {
    console.error('获取所有根分类及其职业失败:', error);
    return {
      categories: [],
      total: 0
    };
  }
}; 