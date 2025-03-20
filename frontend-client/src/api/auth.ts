import { ElMessage } from 'element-plus'
import request from './request'
import { extractData, extractErrorMessage } from '@/utils/responseAdapter'

// 定义接口类型
export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
  phone?: string
}

export interface UserInfo {
  id: number
  username: string
  email?: string
  phone?: string
  avatar_url?: string
  is_active?: boolean
  is_superuser?: boolean
  is_verified?: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

// OAuth2标准响应
export interface OAuth2Response {
  access_token?: string
  token_type?: string
  token?: string
  data?: any
  [key: string]: any
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
  register(data: RegisterParams): Promise<ApiResponse<UserInfo>> {
    console.log('注册请求数据:', data)
    return request.post('/api/v1/auth/register', data)
  },
  
  // 用户登录
  async login(data: LoginParams): Promise<OAuth2Response> {
    console.log('登录请求数据:', data)
    
    // 使用URLSearchParams来创建application/x-www-form-urlencoded格式的数据
    const params = new URLSearchParams()
    params.append('username', data.email) // 后端OAuth2PasswordRequestForm要求用username字段
    params.append('password', data.password)
    
    // 不需要添加这些额外字段，FastAPI的OAuth2实现会自动处理
    // params.append('grant_type', 'password')
    // params.append('scope', '')
    // params.append('client_id', '')
    // params.append('client_secret', '')
    
    // 使用正确的API路径，包含/v1前缀
    console.log('发送登录请求:',{
      url: '/api/v1/auth/login',
      body: params.toString()
    })
    
    try {
      // 确保设置正确的Content-Type请求头
      const response = await request.post('/api/v1/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      console.log('登录响应原始数据:', response)
      
      // 直接返回响应数据，登录响应格式是OAuth2标准格式，不需要额外处理
      return response
    } catch (error: any) {
      console.error('登录请求错误详情:', error)
      if (error.response) {
        console.error('错误状态码:', error.response.status)
        console.error('错误响应数据:', error.response.data)
      }
      throw error
    }
  },
  
  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<UserInfo>> {
    // 使用后端实际提供的用户信息API路径
    const response = await request.get('/api/v1/auth/me')
    // 使用适配器处理响应
    return {
      code: response.status,
      data: response.data,
      message: response.statusText
    }
  },
  
  // 上传头像
  uploadAvatar(file: File): Promise<ApiResponse<{avatar_url: string}>> {
    // 验证文件格式
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return Promise.reject(new Error('只支持 jpg、jpeg 和 png 格式的图片'));
    }
    
    // 验证文件大小 (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return Promise.reject(new Error('图片大小不能超过 2MB'));
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // 使用正确的API路径和方法
    return request.post('/api/v1/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // 添加上传进度处理
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log('上传进度:', percentCompleted, '%');
        // 这里可以触发一个进度更新事件，在UI中展示进度
      }
    });
  },
  
  // 更新用户信息
  updateUserInfo(data: {
    username?: string;
    phone?: string;
    [key: string]: any;
  }): Promise<ApiResponse<UserInfo>> {
    // 修改为PATCH方法更新用户信息
    return request.patch('/api/v1/users/me', data);
  },
  
  // 修改密码
  changePassword(data: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<any>> {
    // 使用正确的API路径
    return request.put('/api/v1/users/me/password', data);
  },
  
  // 更新头像URL
  updateAvatarUrl(avatarUrl: string): Promise<ApiResponse<any>> {
    // 使用PATCH方法更新头像URL
    return request.patch('/api/v1/users/me/avatar-url', { avatar_url: avatarUrl });
  },
  
  // 退出登录
  logout() {
    localStorage.removeItem('auth_token')
  }
}

export default authApi 