// 用户角色类型
export type UserRole = 'admin' | 'user'

// 用户状态类型
export type UserStatus = 'active' | 'inactive' | 'banned'

// 用户基本信息类型
export interface UserInfo {
  name: string
  gender: string
  phone: string
  email: string
  avatar: string
}

// 工作状态选项类型
export interface StatusOption {
  value: string
  label: string
}

// 职业偏好类型
export interface CareerPreference {
  expectedPosition: string
  expectedIndustry: string
  expectedSalary: string
  workCity: string
}

// 工作经验类型
export interface WorkExperience {
  workYears: number
  currentStatus: string
  description: string
}

// 技能信息类型
export interface Skill {
  id: number
  name: string
  rating: number
}

// 技能分类类型
export interface SkillCategory {
  name: string
  skills: Skill[]
}

// 上传响应类型
export interface UploadResponse {
  code: number
  data: {
    url: string
  }
  message?: string
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