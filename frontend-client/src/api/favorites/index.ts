import request from '../request'

// 职业类型定义
export interface Career {
  id: number;
  title: string;
  category_id?: number;
  category1_id?: number;
  salary_min?: number;
  salary_max?: number;
  education_required?: string;
  experience_required?: string;
  skills?: string[];
  description?: string;
  career_prospect?: string;
  created_at?: string;
}

// API响应类型定义
interface ApiResponse<T = any> {
  data?: T;
  careers?: Career[];
  items?: Career[];
  favorites?: Career[];
  result?: T;
  results?: T;
  is_favorite?: boolean;
  [key: string]: any;
}

/**
 * 获取用户收藏的职业列表
 * @returns 收藏的职业列表
 */
export const getFavoriteCareers = async (): Promise<Career[]> => {
  try {
    // 尝试多个可能的API路径
    const possiblePaths = [
      '/api/v1/careers/favorites',
      '/api/v1/user/favorites/careers',
      '/api/v1/user/careers/favorites'
    ]
    
    let response: any = null
    let error = null
    
    // 依次尝试不同的API路径
    for (const path of possiblePaths) {
      try {
        console.log(`尝试获取收藏职业，路径: ${path}`)
        const result = await request.get(path)
        if (result) {
          console.log(`成功获取收藏职业列表，使用路径: ${path}`)
          response = result
          break
        }
      } catch (e) {
        error = e
        console.error(`路径 ${path} 请求失败:`, e)
      }
    }
    
    if (!response && error) {
      throw error
    }
    
    // 解析响应数据，处理各种可能的数据格式
    return parseResponseData(response)
  } catch (error) {
    console.error('获取收藏职业失败:', error)
    throw error
  }
}

/**
 * 收藏职业
 * @param careerId 职业ID（必须是数字类型）
 */
export const addFavoriteCareer = async (careerId: number): Promise<any> => {
  try {
    // 确保careerId是数字
    const id = parseInt(String(careerId), 10)
    if (isNaN(id)) {
      throw new Error('职业ID必须是有效的整数')
    }
    
    console.log(`添加收藏职业: ${id}`)
    const response = await request.post(`/api/v1/careers/${id}/favorite`)
    return response
  } catch (error) {
    console.error('收藏职业失败:', error)
    throw error
  }
}

/**
 * 取消收藏职业
 * @param careerId 职业ID（必须是数字类型）
 */
export const removeFavoriteCareer = async (careerId: number): Promise<any> => {
  try {
    // 确保careerId是数字
    const id = parseInt(String(careerId), 10)
    if (isNaN(id)) {
      throw new Error('职业ID必须是有效的整数')
    }
    
    console.log(`取消收藏职业: ${id}`)
    const response = await request.delete(`/api/v1/careers/${id}/favorite`)
    return response
  } catch (error) {
    console.error('取消收藏职业失败:', error)
    throw error
  }
}

/**
 * 检查职业是否已收藏
 * @param careerId 职业ID（必须是数字类型）
 * @returns 是否已收藏
 */
export const checkIsFavorite = async (careerId: number): Promise<boolean> => {
  try {
    // 确保careerId是数字
    const id = parseInt(String(careerId), 10)
    if (isNaN(id)) {
      throw new Error('职业ID必须是有效的整数')
    }
    
    console.log(`检查职业是否已收藏: ${id}`)
    const response: any = await request.get(`/api/v1/careers/${id}/is_favorite`)
    
    // 根据API返回格式解析结果
    if (typeof response === 'boolean') {
      return response
    } else if (response && typeof response === 'object') {
      return response.is_favorite === true || response.data === true || response.result === true
    }
    
    return false
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    return false
  }
}

/**
 * 解析API返回的各种可能的数据格式
 * @param response API响应数据
 * @returns 解析后的职业数组
 */
function parseResponseData(response: any): Career[] {
  if (!response) {
    console.log('响应数据为空')
    return []
  }
  
  console.log('解析响应数据类型:', typeof response)
  
  // 直接是数组的情况
  if (Array.isArray(response)) {
    console.log('响应数据是数组格式，长度:', response.length)
    return response as Career[]
  }
  
  // 检查常见的嵌套字段
  const possibleFields = ['data', 'careers', 'items', 'favorites', 'result', 'results']
  for (const field of possibleFields) {
    if (response[field]) {
      if (Array.isArray(response[field])) {
        console.log(`在字段 "${field}" 中找到数组，长度:`, response[field].length)
        return response[field] as Career[]
      } else if (typeof response[field] === 'object') {
        // 递归查找更深层次
        const deepResult = parseResponseData(response[field])
        if (deepResult.length > 0) {
          console.log(`在字段 "${field}" 的子对象中找到数据`)
          return deepResult
        }
      }
    }
  }
  
  // 如果是对象但不符合上述结构，检查是否是单个职业对象
  if (typeof response === 'object' && response.id) {
    console.log('响应数据似乎是单个职业对象')
    return [response as Career]
  }
  
  // 对象中可能包含职业ID作为键
  if (typeof response === 'object') {
    const entries = Object.entries(response)
    if (entries.length > 0) {
      // 检查值是否是职业对象
      const potentialCareers = entries
        .filter(([_, value]) => typeof value === 'object' && value !== null)
        .map(([_, value]) => value) as Career[]
      
      if (potentialCareers.length > 0 && potentialCareers[0].id) {
        console.log('从对象条目中提取了可能的职业数据, 数量:', potentialCareers.length)
        return potentialCareers
      }
    }
  }
  
  console.log('无法识别的数据格式，返回空数组')
  return []
} 