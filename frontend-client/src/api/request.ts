import axios from 'axios'
import { ElMessage } from 'element-plus'

// Token存储键
const TOKEN_KEY = 'auth_token'

// 使用全局axios实例，这样可以被mock拦截
// 创建axios实例
export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && token.trim() !== '') {
      // 使用Bearer格式，符合OAuth2标准
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('请求中添加token:', `Bearer ${token}`)
    }
    console.log('请求配置:', config.url, config.method, config.data)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('API请求成功:', response.config.url, response.data)
    
    // 直接返回响应数据，不做格式检查
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    
    // 处理具体的HTTP错误
    if (error.response) {
      const status = error.response.status
      console.error('状态码:', status)
      console.error('响应数据:', error.response.data)
      
      switch (status) {
        case 400:
          // 处理请求参数错误
          if (error.response.data && error.response.data.detail) {
            // 显示具体的错误信息
            ElMessage.error(error.response.data.detail)
          } else {
            ElMessage.error('请求参数错误，请检查输入')
          }
          break
          
        case 401:
          // 处理未授权错误（无效令牌、令牌过期等）
          console.error('认证失败: 401错误')
          
          // 避免在登录页面重定向
          if (!window.location.pathname.includes('/login')) {
            // 检查是否有令牌
            const token = localStorage.getItem(TOKEN_KEY)
            if (token) {
              // 清除失效的令牌
              localStorage.removeItem(TOKEN_KEY)
              ElMessage.error('会话已过期，请重新登录')
              // 重定向到登录页
              window.location.href = '/login'
            } else {
              ElMessage.error('请先登录')
            }
          }
          break
          
        case 403:
          // 处理禁止访问错误
          ElMessage.error('您没有权限执行此操作')
          break
          
        case 404:
          // 处理资源不存在错误
          ElMessage.error('请求的资源不存在')
          break
          
        case 422:
          // 处理数据验证错误
          if (error.response.data && error.response.data.detail) {
            // 尝试解析并显示详细的验证错误
            const detail = error.response.data.detail
            if (Array.isArray(detail)) {
              // FastAPI验证错误通常是数组格式
              const messages = detail.map(item => {
                if (item.loc && item.msg) {
                  return `${item.loc[item.loc.length - 1]}: ${item.msg}`
                }
                return item.msg || '参数验证错误'
              })
              ElMessage.error(messages.join('; '))
            } else {
              ElMessage.error(error.response.data.detail)
            }
          } else {
            ElMessage.error('数据验证失败，请检查输入')
          }
          break
          
        case 500:
          // 处理服务器错误
          ElMessage.error('服务器错误，请稍后重试')
          break
          
        default:
          // 处理其他错误
          ElMessage.error(`请求失败: ${status}`)
      }
    } else if (error.request) {
      // 请求发出但没收到响应
      console.error('未收到响应:', error.request)
      ElMessage.error('服务器无响应，请检查网络连接')
    } else {
      // 设置请求时发生错误
      console.error('请求设置错误:', error.message)
      ElMessage.error('请求错误: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

export default request 