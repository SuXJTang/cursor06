import { defineStore } from 'pinia'
import type { UserRole, UserStatus } from '@/types/user'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 用户信息接口
interface UserInfo {
  id: number
  username: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 登录参数接口
interface LoginParams {
  username: string
  password: string
}

// 注册参数接口
interface RegisterParams {
  username: string
  password: string
  email: string
  code: string
}

// API 响应接口
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 登录结果接口
interface LoginResult {
  token: string
  user: UserInfo
}

// 用户状态接口
interface UserState {
  token: string
  userInfo: UserInfo | null
  permissions: string[]
  redirectPath: string
}

// 更新用户信息参数接口
interface UpdateUserParams {
  username?: string
  email?: string
  avatar?: string
}

// 修改密码参数接口
interface UpdatePasswordParams {
  currentPassword: string
  newPassword: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    permissions: [],
    redirectPath: '/'
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.userInfo?.role === 'admin'
  },

  actions: {
    // 设置 token
    setToken(token: string): void {
      this.token = token
      localStorage.setItem('token', token)
    },

    // 清除 token
    clearToken(): void {
      this.token = ''
      localStorage.removeItem('token')
    },

    // 设置用户信息
    setUserInfo(user: UserInfo): void {
      this.userInfo = user
    },

    // 设置权限
    setPermissions(permissions: string[]): void {
      this.permissions = permissions
    },

    // 设置重定向路径
    setRedirectPath(path: string): void {
      this.redirectPath = path
    },

    // 获取重定向路径并重置
    getAndResetRedirectPath(): string {
      const path = this.redirectPath
      this.redirectPath = '/'
      return path
    },

    // 清除用户信息
    clearUserInfo(): void {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      this.redirectPath = '/'
      localStorage.removeItem('token')
    },

    // 登录
    async login(params: LoginParams): Promise<boolean> {
      try {
        console.log('User store login:', params);
        // 检查测试账号
        const isTestAccount = params.username === 'admin' && params.password === 'admin123';
        
        if (!isTestAccount) {
          ElMessage.error('用户名或密码错误')
          return false
        }

        // 模拟登录成功的响应
        const mockResponse = {
          code: 200,
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@example.com',
              role: 'admin' as UserRole,
              status: 'active' as UserStatus,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          },
          message: '登录成功'
        }

        // 使用模拟数据
        const { data } = mockResponse
        if (data.token) {
          this.setToken(data.token)
          this.setUserInfo(data.user)
          ElMessage.success('登录成功')
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error);
        ElMessage.error('登录失败，请稍后重试')
        return false
      }
    },

    // 注册
    async register(params: RegisterParams): Promise<boolean> {
      try {
        const response = await axios.post<ApiResponse<void>>('/api/auth/register', params)
        const { data } = response
        if (data.code === 200) {
          ElMessage.success('注册成功')
          return true
        } else {
          ElMessage.error(data.message || '注册失败')
          return false
        }
      } catch (error) {
        ElMessage.error('注册失败，请稍后重试')
        return false
      }
    },

    // 获取用户信息
    async getUserInfo(): Promise<boolean> {
      try {
        // 开发模式下，直接返回模拟数据
        const mockResponse = {
          code: 200,
          data: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin' as UserRole,
            status: 'active' as UserStatus,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          message: '获取成功'
        }

        const { data } = mockResponse
        this.setUserInfo(data)
        return true
      } catch (error) {
        ElMessage.error('获取用户信息失败，请稍后重试')
        return false
      }
    },

    // 退出登录
    async logout(): Promise<void> {
      try {
        // 开发模式下直接清除用户信息
        this.clearUserInfo()
        ElMessage.success('退出登录成功')
      } catch (error) {
        ElMessage.error('退出登录失败，请稍后重试')
      }
    },

    // 更新用户信息
    async updateUserInfo(params: UpdateUserParams): Promise<boolean> {
      try {
        const response = await axios.put<ApiResponse<UserInfo>>('/api/user/info', params)
        const { data } = response
        if (data.code === 200) {
          this.setUserInfo(data.data)
          ElMessage.success('个人信息更新成功')
          return true
        } else {
          ElMessage.error(data.message || '更新用户信息失败')
          return false
        }
      } catch (error) {
        ElMessage.error('更新用户信息失败，请稍后重试')
        return false
      }
    },

    // 修改密码
    async updatePassword(params: UpdatePasswordParams): Promise<boolean> {
      try {
        const response = await axios.put<ApiResponse<void>>('/api/user/password', params)
        const { data } = response
        if (data.code === 200) {
          ElMessage.success('密码修改成功')
          return true
        } else {
          ElMessage.error(data.message || '修改密码失败')
          return false
        }
      } catch (error) {
        ElMessage.error('修改密码失败，请稍后重试')
        return false
      }
    }
  }
}) 