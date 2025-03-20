import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { mockLogin, mockRegister, mockGetCurrentUser, mockUpdateUserInfo, mockChangePassword } from './auth'
import { 
  mockGetUserProfile, 
  mockCreateUserProfile, 
  mockUpdateUserProfile, 
  mockUpdateAvatarUrl 
} from './profile'

// 直接在全局层面拦截所有axios请求
const mock = new MockAdapter(axios, { 
  delayResponse: 500, 
  onNoMatch: 'passthrough'
})

// 登录接口
mock.onPost(/.*\/api\/v1\/auth\/login/).reply((config) => {
  console.log('Mock拦截登录请求:', config.url, config.data, config.headers)
  try {
    // 处理FormData格式请求
    let username, password
    
    if (typeof config.data === 'string' && config.data.includes('username=')) {
      // URL编码的表单数据
      const params = new URLSearchParams(config.data)
      username = params.get('username')
      password = params.get('password')
    } else if (config.data instanceof FormData) {
      // FormData对象
      username = config.data.get('username')
      password = config.data.get('password')
    } else {
      // JSON格式
      try {
        const data = JSON.parse(config.data)
        username = data.username
        password = data.password
      } catch (e) {
        console.error('无法解析请求数据:', e)
        return [400, { message: '无效的请求格式' }]
      }
    }
    
    if (!username || !password) {
      return [400, { message: '用户名和密码不能为空' }]
    }
    
    const response = mockLogin({ username, password })
    console.log('Mock登录响应:', response)
    
    // 返回200状态码和完整响应对象
    return [200, response]
  } catch (error) {
    console.error('Mock登录处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 注册接口
mock.onPost(/.*\/api\/v1\/auth\/register/).reply((config) => {
  console.log('Mock拦截注册请求:', config.url, config.data)
  try {
    const data = JSON.parse(config.data)
    const response = mockRegister(data)
    console.log('Mock注册响应:', response)
    return [200, response]
  } catch (error) {
    console.error('Mock注册处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 获取当前用户信息
mock.onGet(/.*\/api\/v1\/auth\/me/).reply((config) => {
  console.log('Mock拦截获取用户信息请求:', config.url, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const response = mockGetCurrentUser(token)
    console.log('Mock用户信息响应:', response)
    return [200, response]
  } catch (error) {
    console.error('Mock获取用户信息处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 更新用户信息
mock.onPut(/.*\/api\/v1\/users\/me$/).reply((config) => {
  console.log('Mock拦截更新用户信息请求:', config.url, config.data, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const data = JSON.parse(config.data)
    const response = mockUpdateUserInfo(data, token)
    console.log('Mock更新用户信息响应:', response)
    
    if (response.code === 401) {
      return [401, response]
    }
    return [200, response]
  } catch (error) {
    console.error('Mock更新用户信息处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 修改密码
mock.onPut(/.*\/api\/v1\/users\/me\/password/).reply((config) => {
  console.log('Mock拦截修改密码请求:', config.url, config.data, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const data = JSON.parse(config.data)
    const response = mockChangePassword(data, token)
    console.log('Mock修改密码响应:', response)
    
    if (response.code === 401) {
      return [401, response]
    }
    if (response.code === 400) {
      return [400, response]
    }
    return [200, response]
  } catch (error) {
    console.error('Mock修改密码处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 头像上传接口
mock.onPost(/.*\/api\/v1\/users\/avatar/).reply((config) => {
  console.log('Mock拦截头像上传请求:', config.url, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    
    if (!token || !token.startsWith('mock-token-')) {
      return [401, { code: 401, message: '未授权访问' }]
    }
    
    // 模拟头像上传成功
    const timestamp = Date.now()
    const userId = 1
    const random = Math.floor(Math.random() * 1000)
    const avatarUrl = `/api/v1/users/avatars/${timestamp}_${userId}_${random}.jpg`
    
    return [200, {
      code: 200,
      message: '头像上传成功',
      data: { avatar_url: avatarUrl }
    }]
  } catch (error) {
    console.error('Mock头像上传处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 获取用户资料接口
mock.onGet(/.*\/api\/v1\/user-profiles\/me/).reply((config) => {
  console.log('Mock拦截获取用户资料请求:', config.url, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const response = mockGetUserProfile(token)
    console.log('Mock用户资料响应:', response)
    
    if (response.code === 401) {
      return [401, response]
    }
    return [200, response]
  } catch (error) {
    console.error('Mock获取用户资料处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 创建用户资料接口
mock.onPost(/.*\/api\/v1\/user-profiles\/me/).reply((config) => {
  console.log('Mock拦截创建用户资料请求:', config.url, config.data, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const data = JSON.parse(config.data)
    const response = mockCreateUserProfile(data, token)
    console.log('Mock创建用户资料响应:', response)
    
    if (response.code === 401) {
      return [401, response]
    }
    return [200, response]
  } catch (error) {
    console.error('Mock创建用户资料处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 更新用户资料接口
mock.onPut(/.*\/api\/v1\/user-profiles\/me$/).reply((config) => {
  console.log('Mock拦截更新用户资料请求:', config.url, config.data, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const data = JSON.parse(config.data)
    const response = mockUpdateUserProfile(data, token)
    console.log('Mock更新用户资料响应:', response)
    
    if (response.code === 401) {
      return [401, response]
    }
    return [200, response]
  } catch (error) {
    console.error('Mock更新用户资料处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

// 更新用户头像URL接口
mock.onPut(/.*\/api\/v1\/user-profiles\/me\/avatar/).reply((config) => {
  console.log('Mock拦截更新用户头像请求:', config.url, config.data, config.headers)
  try {
    const token = config.headers && config.headers['Authorization'] 
      ? config.headers['Authorization'].replace('Bearer ', '') 
      : ''
    const data = JSON.parse(config.data)
    const avatarUrl = data.avatar_url
    const response = mockUpdateAvatarUrl(avatarUrl, token)
    console.log('Mock更新用户头像响应:', response)
    
    if (response.code === 401) {
      return [401, response]
    }
    return [200, response]
  } catch (error) {
    console.error('Mock更新用户头像处理错误:', error)
    return [500, { message: '服务器内部错误' }]
  }
})

console.log('Mock拦截器已设置')

export default mock 