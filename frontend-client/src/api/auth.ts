import { ElMessage } from 'element-plus'
import request from './request'

// 定义接口类型
export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email?: string
}

export interface UserInfo {
  id: number
  username: string
  email?: string
  role?: string
  status?: string
  avatar_url?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

// FastAPI OAuth2标准响应
export interface OAuth2Response {
  access_token: string
  token_type: string
}

// Mock响应格式
export interface MockResponse {
  code: number
  data: any
  message: string
}

// 通用响应接口
export interface ApiResponse<T> {
  code?: number
  data?: T
  message?: string
  access_token?: string
  token_type?: string
  [key: string]: any
}

// 认证服务
export const authApi = {
  // 用户注册
  register(data: RegisterParams): Promise<ApiResponse<null>> {
    console.log('注册请求数据:', data)
    return request.post('/api/v1/auth/register', data)
  },
  
  // 用户登录
  login(data: LoginParams): Promise<ApiResponse<any>> {
    console.log('登录请求数据:', data)
    
    // 为了支持FastAPI的OAuth2PasswordRequestForm格式，使用表单数据
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('password', data.password)
    
    return request.post('/api/v1/auth/login', formData)
  },
  
  // 获取当前用户信息
  getCurrentUser(): Promise<ApiResponse<UserInfo>> {
    return request.get('/api/v1/auth/me')
  },
  
  // 退出登录
  logout() {
    localStorage.removeItem('token')
  }
}

export default authApi 