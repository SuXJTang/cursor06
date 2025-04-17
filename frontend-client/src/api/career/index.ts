import { request } from '../request';
import type { Career, PaginationParams, PaginatedResult, ApiPaginationParams } from '@/types/career';

// 定义统一的API路径前缀
const API_PREFIX = '/api/v1';

/**
 * 将前端分页参数转换为API需要的skip/limit格式
 */
export function convertToApiParams(params: PaginationParams): ApiPaginationParams {
  return {
    skip: (params.page - 1) * params.pageSize,
    limit: params.pageSize
  };
}

/**
 * 标准化API响应，统一返回格式
 */
export function normalizeResponse<T>(response: any, params: PaginationParams): PaginatedResult<T> {
  // 提取数据项
  let items: T[] = [];
  
  if (response?.items && Array.isArray(response.items)) {
    items = response.items;
  } else if (response?.data && Array.isArray(response.data)) {
    items = response.data;
  } else if (response?.careers && Array.isArray(response.careers)) {
    items = response.careers;
  } else if (response?.results && Array.isArray(response.results)) {
    items = response.results;
  } else if (Array.isArray(response)) {
    items = response;
  }
  
  // 提取总数
  const total = response?.total || response?.count || items.length;
  
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    hasMore: (params.page * params.pageSize) < total
  };
}

/**
 * 获取职业详情
 * @param careerId 职业ID
 * @returns 职业详情
 */
export const fetchCareerDetail = async (careerId: string | number): Promise<Career | null> => {
  try {
    console.log(`获取职业详情: ${careerId}`);
    
    // 确保careerId是字符串
    const id = String(careerId);
    
    // 使用统一的API路径前缀
    const response = await request.get(`${API_PREFIX}/careers/${id}`);
    
    console.log('获取职业详情响应:', response);
    
    // 解析响应数据
    if (response) {
      // 确保返回对象符合Career类型
      return response as unknown as Career;
    }
    
    return null;
  } catch (error) {
    console.error('获取职业详情失败:', error);
    return null;
  }
};

/**
 * 获取职业列表
 * @param options 查询选项，包含分页参数和排序
 * @returns 职业列表和分页信息
 */
export const getCareers = async (options: {
  page?: number;
  pageSize?: number;
  sortBy?: string;
} = {}): Promise<PaginatedResult<Career>> => {
  const params: PaginationParams = {
    page: options.page || 1,
    pageSize: options.pageSize || 20
  };
  
  try {
    console.log('获取职业列表:', params);
    
    const apiParams: Record<string, any> = {
      ...convertToApiParams(params)
    };
    
    // 添加排序参数
    if (options.sortBy) {
      apiParams.sort = options.sortBy;
    }
    
    const response = await request.get(`${API_PREFIX}/careers/`, { 
      params: apiParams 
    });
    
    console.log('获取职业列表响应:', response);
    
    return normalizeResponse<Career>(response, params);
  } catch (error) {
    console.error('获取职业列表失败:', error);
    // 返回默认空结果
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: false
    };
  }
};

/**
 * 获取分类下的职业
 * @param options 查询选项，包含分类ID、分页和是否包含子分类
 * @returns 分类下的职业列表和分页信息
 */
export const getCategoryCareers = async (options: {
  categoryId: string | number;
  page?: number;
  pageSize?: number;
  includeSubcategories?: boolean;
  sortBy?: string;
}): Promise<PaginatedResult<Career>> => {
  const params: PaginationParams = {
    page: options.page || 1,
    pageSize: options.pageSize || 20
  };
  
  try {
    console.log(`获取分类(${options.categoryId})下的职业:`, params);
    
    const apiParams: Record<string, any> = {
      ...convertToApiParams(params),
      include_subcategories: options.includeSubcategories ? 1 : 0
    };
    
    // 添加排序参数
    if (options.sortBy) {
      apiParams.sort = options.sortBy;
    }
    
    // 使用新的同步API路由
    const response = await request.get(`${API_PREFIX}/careers-sync/category/${options.categoryId}`, { 
      params: apiParams 
    });
    
    console.log(`获取分类(${options.categoryId})下的职业响应:`, response);
    
    return normalizeResponse<Career>(response, params);
  } catch (error) {
    console.error(`获取分类(${options.categoryId})下的职业失败:`, error);
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: false
    };
  }
};

/**
 * 搜索职业
 * @param options 搜索选项，包含查询内容和分页
 * @returns 搜索结果和分页信息
 */
export const searchCareers = async (options: {
  query: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
}): Promise<PaginatedResult<Career>> => {
  const params: PaginationParams = {
    page: options.page || 1,
    pageSize: options.pageSize || 20
  };
  
  try {
    console.log(`搜索职业(${options.query}):`, params);
    
    const apiParams: Record<string, any> = {
      ...convertToApiParams(params),
      keyword: options.query,
      q: options.query // 支持多种查询参数名
    };
    
    // 添加排序参数
    if (options.sortBy) {
      apiParams.sort = options.sortBy;
    }
    
    const response = await request.get(`${API_PREFIX}/careers/search/`, { 
      params: apiParams 
    });
    
    console.log(`搜索职业(${options.query})响应:`, response);
    
    return normalizeResponse<Career>(response, params);
  } catch (error) {
    console.error(`搜索职业(${options.query})失败:`, error);
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: false
    };
  }
};

/**
 * 根据技能获取职业
 * @param options 技能查询选项，包含技能列表和分页
 * @returns 相关职业列表和分页信息
 */
export const getCareersBySkills = async (options: {
  skills: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
}): Promise<PaginatedResult<Career>> => {
  const params: PaginationParams = {
    page: options.page || 1,
    pageSize: options.pageSize || 20
  };
  
  try {
    console.log(`根据技能获取职业:`, options.skills, params);
    
    const apiParams: Record<string, any> = {
      ...convertToApiParams(params),
      skills: options.skills.join(',')
    };
    
    // 添加排序参数
    if (options.sortBy) {
      apiParams.sort = options.sortBy;
    }
    
    const response = await request.get(`${API_PREFIX}/careers/skills/`, { 
      params: apiParams 
    });
    
    console.log(`根据技能获取职业响应:`, response);
    
    return normalizeResponse<Career>(response, params);
  } catch (error) {
    console.error(`根据技能获取职业失败:`, error);
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: false
    };
  }
};

/**
 * 获取推荐职业
 * @param userId 用户ID，可选
 * @returns 推荐职业列表
 */
export const fetchRecommendations = async (userId?: string | number): Promise<any> => {
  try {
    console.log('获取推荐职业');
    
    const params: Record<string, any> = {};
    if (userId) {
      params.user_id = userId;
    }
    
    const response = await request.get(`${API_PREFIX}/careers/recommendations`, { 
      params 
    });
    
    console.log('获取推荐职业响应:', response);
    
    // 为保持兼容性，返回原始响应
    return response || {
      status: 'success',
      message: '',
      recommendations: [],
      candidates: [],
      session_id: '',
      timestamp: new Date().toISOString(),
      total_match: 0,
      user_traits: []
    };
  } catch (error) {
    console.error('获取推荐职业失败:', error);
    return {
      status: 'error',
      message: '获取推荐结果失败，请稍后重试',
      error: error instanceof Error ? error.message : '未知错误',
      recommendations: [],
      candidates: []
    };
  }
}; 