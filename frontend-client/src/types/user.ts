// 用户角色类型
export type UserRole = 'admin' | 'user'

// 用户状态类型
export type UserStatus = 'active' | 'inactive' | 'banned'

// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// 登录响应数据
export interface LoginResult {
  token: string
  user: UserInfo
}

// 注册请求参数
export interface RegisterParams {
  username: string
  password: string
  email: string
  code: string // 验证码
}

// 注册响应数据
export interface RegisterResult {
  id: number
  username: string
}

// 用户状态
export interface UserState {
  token: string
  userInfo: UserInfo | null
  permissions: string[]
} 