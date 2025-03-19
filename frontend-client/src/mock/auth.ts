// 模拟认证服务响应
import { LoginParams, RegisterParams } from '@/api/auth'

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',  // 修改为与登录时使用的用户名一致
    password: 'admin123',
    email: 'admin@example.com',  // 用于登录的实际用户名
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

// 模拟验证用户登录
export function mockLogin(params: LoginParams) {
  const { username, password } = params
  // 允许使用email或username登录
  const user = users.find(u => (u.email === username || u.username === username) && u.password === password)
  
  if (user) {
    const { password, ...userInfo } = user
    // 返回格式与后端API保持一致 - FastAPI OAuth2格式
    return {
      access_token: `mock-token-${Date.now()}`,
      token_type: 'bearer',
      // 额外添加code和用户信息，用于向下兼容
      code: 200,
      data: {
        user: userInfo
      },
      message: '登录成功'
    }
  } else {
    return {
      code: 401,
      data: null,
      message: '用户名或密码错误'
    }
  }
}

// 模拟用户注册
export function mockRegister(params: RegisterParams) {
  const { username, email } = params
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    return {
      code: 400,
      data: null,
      message: '用户名已存在'
    }
  }
  
  // 检查邮箱是否已存在
  if (email && users.some(u => u.email === email)) {
    return {
      code: 400,
      data: null,
      message: '邮箱已被注册'
    }
  }
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    password: params.password,
    email: params.email || '',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  users.push(newUser)
  
  return {
    code: 200,
    data: null,
    message: '注册成功'
  }
}

// 模拟获取当前用户信息
export function mockGetCurrentUser(token: string) {
  if (!token || !token.startsWith('mock-token-')) {
    return {
      code: 401,
      data: null,
      message: '未授权'
    }
  }
  
  // 返回第一个用户作为当前用户（简化处理）
  const { password, ...userInfo } = users[0]
  
  return {
    code: 200,
    data: userInfo,
    message: '获取成功'
  }
}

// 模拟更新用户信息
export function mockUpdateUserInfo(data: any, token: string) {
  if (!token || !token.startsWith('mock-token-')) {
    return { code: 401, message: '未授权访问' }
  }
  
  // 从token获取用户信息
  let userInfo = {
    id: 1,
    username: '用户' + token.split('-')[2],
    email: `user${token.split('-')[2]}@example.com`,
    phone: data.phone || '',
    avatar_url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    is_active: true,
    is_verified: true
  }
  
  // 合并新数据
  userInfo = { ...userInfo, ...data }
  
  return {
    code: 200,
    message: '用户信息更新成功',
    data: userInfo
  }
}

// 模拟修改密码
export function mockChangePassword(data: any, token: string) {
  if (!token || !token.startsWith('mock-token-')) {
    return { code: 401, message: '未授权访问' }
  }
  
  // 验证当前密码（模拟环境下，任何非空密码都视为有效）
  if (!data.current_password) {
    return { code: 400, message: '当前密码不正确' }
  }
  
  // 验证新密码
  if (!data.new_password || data.new_password.length < 6) {
    return { code: 400, message: '新密码太短，至少需要6个字符' }
  }
  
  return {
    code: 200,
    message: '密码修改成功，请重新登录'
  }
}

// 确保文件被视为模块
export default { mockLogin, mockRegister, mockGetCurrentUser, mockUpdateUserInfo, mockChangePassword } 