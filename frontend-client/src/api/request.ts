import axios from 'axios'
import { ElMessage } from 'element-plus'

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
    const token = localStorage.getItem('token')
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
    
    // 处理FastAPI OAuth2标准响应格式
    if (response.data && response.data.access_token) {
      return response.data
    }
    
    // 处理Mock响应格式
    if (response.data && typeof response.data.code !== 'undefined') {
      if (response.data.code === 200) {
        return response.data
      } else {
        // 如果有错误代码，拒绝Promise
        return Promise.reject({
          response: {
            data: response.data,
            status: response.data.code
          }
        })
      }
    }
    
    // 否则直接返回响应数据
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    if (error.response) {
      console.error('状态码:', error.response.status)
      console.error('响应数据:', error.response.data)
      console.error('请求配置:', error.config)
      
      // 处理授权错误
      if (error.response.status === 401) {
        console.error('认证失败: 401错误')
        // 清除失效token
        localStorage.removeItem('token')
        ElMessage.error('用户未登录或会话已过期，请重新登录')
        // 强制跳转到登录页面
        window.location.href = '/login'
        return Promise.reject(error)
      }
    } else if (error.request) {
      console.error('未收到响应:', error.request)
      ElMessage.error('服务器无响应')
    } else {
      console.error('请求设置错误:', error.message)
      ElMessage.error('请求错误')
    }
    
    return Promise.reject(error)
  }
)

export default request 