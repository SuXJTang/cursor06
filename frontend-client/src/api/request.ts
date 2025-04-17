import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// 扩展Axios类型定义
declare module 'axios' {
  export interface AxiosRequestConfig {
    silent?: boolean;
    followRedirect?: boolean;
  }
  
  export interface InternalAxiosRequestConfig {
    isSilent?: boolean;
    followRedirect?: boolean;
  }
}

// Token存储键
const TOKEN_KEY = 'auth_token'

// 使用全局axios实例，这样可以被mock拦截
// 创建axios实例
export const request = axios.create({
  baseURL: '/api',  // 恢复为原始baseURL，不使用双重api路径
  timeout: 15000,   // 增加超时时间到15秒
  withCredentials: false,  // 禁用跨域凭证，因为后端使用通配符允许所有源
  maxRedirects: 0,  // 禁用自动重定向，我们将手动处理重定向
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 保存silent参数到config对象
    if (config.silent) {
      // config.isSilent = true  // 原本允许silent模式
      config.isSilent = false // 强制禁用silent模式，确保所有错误都显示
      console.log('请求原本为silent模式，但已禁用')
      // 删除自定义参数，避免axios警告
      delete config.silent
    }
    
    // 处理followRedirect参数
    if (config.followRedirect !== undefined) {
      config.maxRedirects = config.followRedirect ? 5 : 0
      // 删除自定义参数
      delete config.followRedirect
    }
    
    // 从localStorage获取token
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && token.trim() !== '') {
      // 使用Bearer格式，符合OAuth2标准
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('请求中添加token:', `Bearer ${token.substring(0, 10)}...${token.substring(token.length - 10)}`)
    } else {
      console.warn('请求未携带token，URL:', config.url)
    }
    
    // 详细记录请求信息
    console.log(`发送${config.method?.toUpperCase()}请求:`, {
      url: config.url,
      headers: {
        ...config.headers,
        'Authorization': config.headers?.['Authorization'] ? 
                        `Bearer ${config.headers['Authorization'].toString().substring(7, 17)}...` : 
                        '未设置'
      }, 
      data: config.data,
      params: config.params,
      isSilent: config.isSilent,
      maxRedirects: config.maxRedirects
    })
    
    return config
  },
  error => {
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 增加更多详细日志
    console.log('API请求成功:', response.config.url)
    console.log('响应状态码:', response.status)
    console.log('响应头:', response.headers)
    console.log('响应数据类型:', typeof response.data)
    
    if (response.config.url?.includes('/login')) {
      console.log('登录接口完整响应数据:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })
    }
    
    if (response.config.url?.includes('/register')) {
      console.log('注册接口响应完整数据:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      })
    }
    
    if (Array.isArray(response.data)) {
      console.log('响应是数组，长度:', response.data.length)
      if (response.data.length > 0) {
        console.log('第一个元素:', response.data[0])
      }
    } else if (response.data && typeof response.data === 'object') {
      console.log('响应对象的键:', Object.keys(response.data))
    }
    
    // 请求成功，直接返回response.data，简化后续处理
    // 注意：之前返回整个response导致在某些地方需要访问response.data
    return response.data
  },
  async error => {
    console.error('API请求错误，状态码:', error.response?.status, '请求URL:', error.config?.url)
    
    // 特别处理307重定向但仅针对职业库相关请求
    if (error.response && error.response.status === 307) {
      // 检查本地存储中是否有token(已登录)
      const token = localStorage.getItem('auth_token')
      // 检查是否是职业库相关的请求
      const isCareerRequest = error.config?.url?.includes('/careers') || 
                             error.config?.url?.includes('/career-categories')
      
      if (token && isCareerRequest) {
        console.log('检测到职业库相关的307重定向，用户已登录，返回空结果而非重定向')
        
        // 对于已登录用户的职业库请求，返回一个空数组而不是执行重定向
        // 这会中断重定向循环，前端会显示空数据或缓存数据
        return Promise.resolve({ data: [] })
      }
      
      // 对于非职业库请求或未登录状态，正常返回错误
      console.log('非职业库请求或未登录状态，正常返回307错误')
    }
    
    // 检查是否为静默请求，如果是则不显示错误消息
    const isSilent = error.config?.isSilent === true
    
    // 手动处理重定向
    if (error.response && (error.response.status === 301 || error.response.status === 302 || error.response.status === 307 || error.response.status === 308)) {
      const redirectUrl = error.response.headers['location']
      
      if (redirectUrl) {
        console.log('检测到重定向，目标URL:', redirectUrl)
        
        // 获取当前请求的配置
        const config = error.config
        
        // 保存原始请求信息
        const originalUrl = config.url
        
        // 从localStorage获取最新token
        const token = localStorage.getItem(TOKEN_KEY)
        
        // 创建新的请求配置，用于重定向
        const newConfig = {
          ...config,
          url: redirectUrl,
          baseURL: '', // 确保不重复添加baseURL
          headers: {
            ...config.headers,
            'Authorization': token ? `Bearer ${token}` : '',
          }
        }
        
        console.log('手动处理重定向，保留认证信息', {
          originalUrl,
          redirectUrl,
          method: newConfig.method
        })
        
        // 发送新请求
        return axios(newConfig)
          .then(response => {
            console.log('重定向请求成功:', response.status)
            return response.data
          })
          .catch(redirectError => {
            console.error('重定向请求失败:', redirectError)
            return Promise.reject(redirectError)
          })
      }
    }
    
    // 处理具体的HTTP错误
    if (error.response) {
      const status = error.response.status
      console.error('状态码:', status)
      console.error('响应数据:', error.response.data)
      
      switch (status) {
        case 400:
          // 处理请求参数错误
          if (!isSilent && error.response.data && error.response.data.detail) {
            // 显示具体的错误信息
            ElMessage.error(error.response.data.detail)
          } else if (!isSilent) {
            ElMessage.error('请求参数错误，请检查输入')
          }
          break
          
        case 401:
        case 403:
          // 处理未授权错误（无效令牌、令牌过期等）
          console.error(`认证失败: ${status}错误`)
          
          // 避免在登录页面重定向
          if (!window.location.pathname.includes('/login')) {
            // 获取当前路由，用于登录后跳回
            const currentPath = window.location.pathname + window.location.search
            
            // 检查是否有令牌
            const token = localStorage.getItem(TOKEN_KEY)
            if (token) {
              // 清除失效的令牌，但保留当前路径信息
              localStorage.removeItem(TOKEN_KEY)
              localStorage.setItem('auth_redirect', currentPath)
              
              if (!isSilent) {
                ElMessage.error('会话已过期，请重新登录')
                // 使用replace而不是push，避免浏览器返回时循环
                window.location.replace('/login?redirect=' + encodeURIComponent(currentPath))
              }
            } else if (!isSilent) {
              ElMessage.error('请先登录')
              // 使用replace而不是push，避免浏览器返回时循环
              window.location.replace('/login?redirect=' + encodeURIComponent(currentPath))
            }
          }
          break
          
        case 404:
          // 处理资源不存在错误
          if (!isSilent) ElMessage.error('请求的资源不存在')
          break
          
        case 422:
          // 处理数据验证错误
          if (!isSilent && error.response.data && error.response.data.detail) {
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
          } else if (!isSilent) {
            ElMessage.error('数据验证失败，请检查输入')
          }
          break
          
        case 500:
          // 处理服务器错误
          if (!isSilent) ElMessage.error('服务器错误，请稍后重试')
          break
          
        default:
          // 处理其他错误
          if (!isSilent) ElMessage.error(`请求失败: ${status}`)
      }
    } else if (error.request) {
      // 请求发出但没收到响应
      console.error('未收到响应:', error.request)
      if (!isSilent) ElMessage.error('服务器无响应，请检查网络连接')
    } else {
      // 设置请求时发生错误
      console.error('请求设置错误:', error.message)
      if (!isSilent) ElMessage.error('请求错误: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

export default request 