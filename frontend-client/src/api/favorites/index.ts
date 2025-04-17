import { request } from '../request';
import type { Career } from '@/types/career.d';

// 定义统一的API路径前缀
const API_PREFIX = '/api/v1';

/**
 * 获取用户收藏的职业列表
 * @returns 收藏的职业列表
 */
export const getFavoriteCareers = async (): Promise<Career[]> => {
  try {
    console.log('获取用户收藏的职业列表');
    
    // 使用统一API路径
    const response = await request.get(`${API_PREFIX}/careers/user/favorites`);
    
    console.log('获取收藏职业列表响应:', response);
    
    // 解析响应数据，处理各种可能的数据格式
    return parseResponseData(response);
  } catch (error: any) {
    console.error('获取收藏职业失败:', error);
    
    // 如果是404错误，表示没有收藏，返回空数组
    if (error.response && error.response.status === 404) {
      console.log('用户没有收藏职业');
      return [];
    }
    
    return []; // 出错时返回空数组而非抛出错误
  }
};

/**
 * 收藏职业
 * @param careerId 职业ID
 */
export const addFavoriteCareer = async (careerId: string | number): Promise<any> => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`添加收藏职业: ${id}`);
    const response = await request.post(`${API_PREFIX}/careers/${id}/favorite`, {});
    return response;
  } catch (error) {
    console.error('收藏职业失败:', error);
    return { success: false, message: '收藏职业失败' };
  }
};

/**
 * 取消收藏职业
 * @param careerId 职业ID
 */
export const removeFavoriteCareer = async (careerId: string | number): Promise<any> => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`取消收藏职业: ${id}`);
    const response = await request.delete(`${API_PREFIX}/careers/${id}/favorite`);
    return response;
  } catch (error) {
    console.error('取消收藏职业失败:', error);
    return { success: false, message: '取消收藏职业失败' };
  }
};

/**
 * 检查职业是否已收藏
 * @param careerId 职业ID
 * @returns 是否已收藏
 */
export const checkIsFavorite = async (careerId: string | number): Promise<boolean> => {
  try {
    // 确保careerId是字符串
    const id = String(careerId);
    
    console.log(`检查职业是否已收藏: ${id}`);
    const response: any = await request.get(`${API_PREFIX}/careers/${id}/is_favorite`);
    
    // 根据API返回格式解析结果
    if (typeof response === 'boolean') {
      return response;
    } else if (response && typeof response === 'object') {
      return response.is_favorite === true || response.data === true || response.result === true;
    }
    
    return false;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
};

/**
 * 解析API返回的各种可能的数据格式
 * @param response API响应数据
 * @returns 解析后的职业数组
 */
export const parseResponseData = (response: any): Career[] => {
  if (!response) return [];
  
  // 如果response是数组，直接使用
  if (Array.isArray(response)) {
    return response.map(item => ({
      id: item.id || item.career_id,
      name: item.name || item.title || `职业${item.id}`,
      title: item.title || item.name || `职业${item.id}`, // 同时支持name和title
      category_id: item.category_id,
      category_name: item.category || item.category_name,
      avg_salary: item.avg_salary,
      min_salary: item.min_salary,
      max_salary: item.max_salary,
      salary_range: item.salary || item.salary_range || '',
      education_requirements: item.education || item.education_required || item.education_requirements || '',
      experience_required: item.experience || item.experience_required || '',
      skills_required: Array.isArray(item.skills_required) ? item.skills_required : 
                      (item.skills ? [item.skills] : []),
      required_skills: Array.isArray(item.required_skills) ? item.required_skills : 
                      (Array.isArray(item.skills_required) ? item.skills_required : 
                      (item.skills ? [item.skills] : [])),
      description: item.description || '',
      job_responsibilities: Array.isArray(item.job_responsibilities) ? item.job_responsibilities :
                           (Array.isArray(item.responsibilities) ? item.responsibilities : 
                           [item.responsibilities || item.job_responsibilities || '']),
      hot_index: item.hot_index || 0,
      growth_index: item.growth_index || 0,
      is_favorite: item.is_favorite || false
    } as Career));
  }
  
  // 如果response包含data字段且为数组
  if (response.data && Array.isArray(response.data)) {
    return parseResponseData(response.data);
  }
  
  // 如果response包含items字段且为数组
  if (response.items && Array.isArray(response.items)) {
    return parseResponseData(response.items);
  }
  
  // 如果response包含careers字段且为数组
  if (response.careers && Array.isArray(response.careers)) {
    return parseResponseData(response.careers);
  }
  
  // 如果response包含results字段且为数组
  if (response.results && Array.isArray(response.results)) {
    return parseResponseData(response.results);
  }
  
  // 如果response包含favorites字段且为数组
  if (response.favorites && Array.isArray(response.favorites)) {
    return parseResponseData(response.favorites);
  }
  
  // 如果未找到有效数据
  return [];
}; 