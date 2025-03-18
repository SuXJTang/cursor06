import { defineStore } from 'pinia'
import authApi, { UserInfo, LoginParams, RegisterParams } from '@/api/auth'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
    loading: false,
    tokenValidated: false
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return !!this.token && this.tokenValidated
    }
  },
  
  actions: {
    // 用户注册
    async register(params: RegisterParams) {
      this.loading = true
      try {
        const res = await authApi.register(params)
        ElMessage.success('注册成功')
        return res
      } catch (error) {
        console.error('注册失败:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 用户登录
    async login(params: LoginParams) {
      this.loading = true
      try {
        const res = await authApi.login(params)
        console.log('登录响应:', res)
        
        // 确定token值
        let token = ''
        
        // 处理OAuth2格式响应（后端标准格式）
        if (res.access_token) {
          token = res.access_token
        } 
        // 处理mock响应
        else if (res.data && res.data.token) {
          token = res.data.token
        }
        
        // 如果获取到token
        if (token) {
          this.setToken(token)
          
          // 尝试获取用户信息
          await this.fetchUserInfo()
          
          ElMessage.success('登录成功')
          router.push('/')
          return true
        } else {
          ElMessage.error('登录失败: token获取失败')
          return false
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查用户名和密码')
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 设置token并存储
    setToken(token: string) {
      if (token && token.trim() !== '') {
        this.token = token
        localStorage.setItem('token', token)
        this.tokenValidated = true
        console.log('Token已设置:', token)
      } else {
        console.error('尝试设置空token')
        this.clearAuth()
      }
    },
    
    // 清除认证状态
    clearAuth() {
      this.token = ''
      this.userInfo = null
      this.tokenValidated = false
      localStorage.removeItem('token')
      console.log('认证状态已清除')
    },
    
    // 获取当前用户信息
    async fetchUserInfo() {
      if (!this.token) {
        console.log('无token，不获取用户信息')
        return null
      }
      
      this.loading = true
      try {
        const res = await authApi.getCurrentUser()
        console.log('获取用户信息响应:', res)
        
        // 处理不同响应格式
        if (res.data) {
          // 后端标准响应
          this.userInfo = res.data
        } else {
          // 兼容处理，以防直接返回用户对象
          const requiredFields = ['id', 'username']
          const hasAllFields = requiredFields.every(field => field in res)
          if (hasAllFields) {
            this.userInfo = res as unknown as UserInfo
          }
        }
        
        // 成功获取用户信息，标记token为有效
        this.tokenValidated = true
        return this.userInfo
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果获取用户信息失败，清除认证状态
        this.clearAuth()
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 退出登录
    logout() {
      this.clearAuth()
      router.push('/login')
      ElMessage.success('已退出登录')
    },
    
    // 检查并恢复认证状态
    async checkAuth() {
      console.log('检查认证状态, token存在:', !!this.token)
      if (this.token && !this.tokenValidated) {
        console.log('有token但未验证，尝试验证...')
        await this.fetchUserInfo()
      }
    }
  }
})

export default useAuthStore 