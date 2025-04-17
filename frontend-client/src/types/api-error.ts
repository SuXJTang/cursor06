/**
 * API错误类型定义
 */
export interface ApiError {
  response?: {
    status: number;
    data: any;
    headers: any;
  };
  message?: string;
}

/**
 * 类型断言辅助函数
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' && 
    error !== null && 
    ('response' in error || 'message' in error)
  );
} 