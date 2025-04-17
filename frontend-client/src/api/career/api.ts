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
 * 获取职业详情（新版本）
 * @param careerId 职业ID
 * @returns 职业详情
 */
export const getCareerDetailNew = async (careerId: string | number): Promise<Career | null> => {
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
 * 获取推荐职业（新版本）
 * @param userId 用户ID，可选
 * @returns 推荐职业列表
 */
export const getRecommendationsNew = async (userId?: string | number): Promise<any> => {
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