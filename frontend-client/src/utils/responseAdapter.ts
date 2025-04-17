/**
 * 响应适配器 - 用于转换后端API响应格式为前端期望的格式
 */

/**
 * 标准响应格式
 */
export interface StandardResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 将任意响应格式转换为标准的 { code, message, data } 格式
 * @param response 原始响应
 * @returns 标准格式的响应
 */
export function adaptResponse<T = any>(response: any): StandardResponse<T> {
  // 如果响应已经是标准格式，直接返回
  if (response && typeof response === 'object' && 'code' in response && 'data' in response) {
    return response as StandardResponse<T>;
  }
  
  // 如果响应是直接返回的数据对象，包装成标准格式
  return {
    code: 200,
    message: 'success',
    data: response as T
  };
}

/**
 * 从API响应中提取数据部分
 * 无论响应是标准格式还是直接返回的数据对象，都能正确提取数据
 * @param response 原始响应
 * @returns 数据部分
 */
export function extractData<T = any>(response: any): T {
  if (!response) return null as unknown as T;
  
  // 如果响应有data字段，返回data
  if (typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }
  
  // 否则将整个响应作为数据返回
  return response as T;
}

/**
 * 提取状态码
 * @param response 原始响应
 * @returns 状态码
 */
export function extractStatusCode(response: any): number {
  if (!response) return 500;
  
  if (typeof response === 'object' && 'code' in response) {
    return response.code;
  }
  
  return 200; // 默认成功
}

/**
 * 提取错误信息
 * @param response 原始响应或错误对象
 * @returns 错误信息
 */
export function extractErrorMessage(error: any): string {
  if (!error) return '未知错误';
  
  // 如果是标准错误响应
  if (typeof error === 'object') {
    if (error.message) return error.message;
    if (error.detail) return error.detail;
    if (error.data && error.data.message) return error.data.message;
    if (error.response && error.response.data) {
      const { data } = error.response;
      if (typeof data === 'string') return data;
      if (data.detail) return data.detail;
      if (data.message) return data.message;
    }
  }
  
  return String(error);
} 