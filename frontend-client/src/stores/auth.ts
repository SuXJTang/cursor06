import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import router from '@/router'
import { authApi } from '@/api/auth'

// Token存储键
const TOKEN_KEY = 'auth_token'
// 用户信息存储键
const USER_INFO_KEY = 'user_info'
// Token过期前提醒时间（毫秒），这里设置为1小时
const TOKEN_EXPIRY_WARNING = 60 * 60 * 1000

// 定义基本用户信息类型
interface UserInfo {
  id: string | number
  username: string
  email: string
  role: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// 登录参数
interface LoginParams {
  email: string
  password: string
  remember?: boolean
}

// 注册参数
interface RegisterParams {
  username: string
  email: string
  password: string
  confirm_password?: string
}

// API响应类型
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 尝试从本地存储加载用户信息
  const storedUser = localStorage.getItem(USER_INFO_KEY)
  if (storedUser) {
    try {
      userInfo.value = JSON.parse(storedUser)
    } catch (err) {
      console.error('解析存储的用户信息失败', err)
      localStorage.removeItem(USER_INFO_KEY)
    }
  }
  
  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!userInfo.value)
  
  // 保存用户信息到本地存储
  const saveUserToStorage = () => {
    if (userInfo.value) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo.value))
    }
  }
  
  // 设置Token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
    
    // 设置请求默认Authorization头
    request.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }
  
  // 注销
  const logout = () => {
    // 清除状态
    token.value = null
    userInfo.value = null
    
    // 清除本地存储
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
    
    // 清除请求默认头
    delete request.defaults.headers.common['Authorization']
    
    // 跳转到登录页
    router.push('/login')
  }
  
  // 登录
  const login = async (params: LoginParams): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      // 使用authApi处理登录请求
      const response = await authApi.login({
        email: params.email,
        password: params.password
      })
      
      console.log('authStore收到登录响应:', response)
      
      // 检查是否有access_token
      if (response && response.access_token) {
        console.log('成功提取到token:', response.access_token)
        setToken(response.access_token)
        
        // 获取用户信息
        await getUserInfo()
        
        ElMessage.success('登录成功')
        return true
      } else {
        console.error('未找到有效token，响应数据:', response)
        error.value = '登录失败：无法获取访问令牌'
        ElMessage.error(error.value)
        return false
      }
    } catch (err: any) {
      console.error('登录过程发生错误:', err)
      
      // 尝试从错误对象中提取更详细的错误信息
      let errorMessage = '登录失败'
      
      if (err.response) {
        console.error('错误响应状态:', err.response.status)
        console.error('错误响应数据:', err.response.data)
        
        // 尝试提取详细错误信息
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data
          } else if (err.response.data.detail) {
            errorMessage = err.response.data.detail
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message
          } else if (err.response.data.error_description) {
            errorMessage = err.response.data.error_description
          }
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      error.value = errorMessage
      ElMessage.error(errorMessage)
      return false
    } finally {
      loading.value = false
    }
  }
  
  // 注册
  const register = async (params: RegisterParams): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      // 使用正确的注册API路径
      const response = await request.post('/api/v1/auth/register', params)
      
      // 检查响应，注册成功返回用户信息
      if (response) {
        ElMessage.success('注册成功，请登录')
        return true
      } else {
        error.value = '注册失败：响应格式不正确'
        ElMessage.error(error.value)
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.response?.data?.message || '注册请求失败'
      console.error('注册失败:', err)
      ElMessage.error(error.value || '注册失败')
      return false
    } finally {
      loading.value = false
    }
  }
  
  // 获取用户信息
  const getUserInfo = async (): Promise<UserInfo | null> => {
    if (!token.value) return null
    
    loading.value = true
    error.value = null
    
    try {
      // 使用正确的用户信息API路径
      const response = await request.get('/api/v1/auth/me')
      
      // 用户信息直接返回在响应中
      if (response) {
        userInfo.value = response
        saveUserToStorage()
        return userInfo.value
      } else {
        error.value = '获取用户信息失败：响应格式不正确'
        return null
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token无效，注销
        logout()
      }
      error.value = err.response?.data?.detail || err.response?.data?.message || '获取用户信息请求失败'
      console.error('获取用户信息失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 上传头像
  const uploadAvatar = async (file: File): Promise<string | null> => {
    // 验证文件格式
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      ElMessage.error('只支持 jpg、jpeg 和 png 格式的图片')
      return null
    }
    
    // 验证文件大小 (2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      ElMessage.error('图片大小不能超过 2MB')
      return null
    }
    
    // 创建表单数据
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // 创建带有上传进度的请求
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`上传进度: ${percentCompleted}%`)
        }
      }
      
      const response = await request.post<ApiResponse<{avatar_url: string}>>('/api/v1/auth/me/avatar', formData, config)
      
      if (response.data.code === 200 && response.data.data.avatar_url) {
        // 更新本地存储的用户信息
        if (userInfo.value) {
          userInfo.value.avatar_url = response.data.data.avatar_url
          saveUserToStorage()
        }
        
        ElMessage.success('头像上传成功')
        return response.data.data.avatar_url
      }
      
      return null
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '头像上传失败'
      ElMessage.error(errorMessage)
      console.error('头像上传失败:', error)
      return null
    }
  }
  
  return {
    token,
    userInfo,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    getUserInfo,
    uploadAvatar
  }
}) 