import request from './request'
import type { UserProfile, CreateUpdateProfileParams, CareerInterests, WorkStyle, PersonalityTraits, AvatarUpdateParams } from '@/types/profile'

// 基本API响应类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 使用Mock数据的标志
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取当前用户的资料
 * @returns 用户资料信息
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return mockUserProfile
  }
  
  // 实际后端暂未实现完整的用户详细资料API，使用用户基本信息API代替
  const response = await request.get<ApiResponse<UserProfile>>('/api/v1/users/me')
  return {
    ...response.data.data,
    // 添加用户详细资料的默认值，防止前端UI出错
    career_interests: {},
    work_style: {},
    personality_traits: {},
    learning_style: {},
    learning_ability: {},
    skills: [],
    interests: []
  }
}

/**
 * 创建用户资料
 * @param data 用户资料数据
 * @returns 创建后的用户资料
 */
export const createUserProfile = async (data: CreateUpdateProfileParams): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, ...data }
  }
  
  // 实际后端暂未实现，使用更新用户基本信息API代替
  const basicInfo = {
    username: data.full_name,
    phone: data.phone
  }
  const response = await request.patch<ApiResponse<UserProfile>>('/api/v1/users/me', basicInfo)
  return {
    ...response.data.data,
    ...data,
    // 添加用户详细资料的默认值
    career_interests: data.career_interests || {},
    work_style: data.work_style || {},
    personality_traits: data.personality_traits || {},
    learning_style: data.learning_style || {},
    learning_ability: data.learning_ability || {},
    skills: data.skills || [],
    interests: data.interests || []
  }
}

/**
 * 更新用户资料
 * @param data 更新的资料字段
 * @returns 更新后的用户资料
 */
export const updateUserProfile = async (data: CreateUpdateProfileParams): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, ...data }
  }
  
  // 实际后端暂未实现，使用更新用户基本信息API代替
  const basicInfo = {
    username: data.full_name,
    phone: data.phone
  }
  const response = await request.patch<ApiResponse<UserProfile>>('/api/v1/users/me', basicInfo)
  return {
    ...response.data.data,
    ...data
  }
}

/**
 * 更新用户头像URL（从用户上传接口获取URL后调用）
 * @param avatarUrl 头像URL
 * @returns 更新后的用户资料
 */
export const updateAvatarUrl = async (avatarUrl: string): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, avatar_url: avatarUrl }
  }
  
  // 使用authApi中的方法更新头像URL
  const response = await request.patch<ApiResponse<UserProfile>>('/api/v1/users/me/avatar-url', { avatar_url: avatarUrl })
  return {
    ...response.data.data,
    avatar_url: avatarUrl
  }
}

/**
 * 更新工作信息
 * @param workInfo 工作相关信息
 * @returns 更新后的用户资料
 */
export const updateWorkInfo = async (data: {
  work_years?: number;
  current_status?: string;
  skills?: string[] | string;
  skill_tags?: string[] | string;
  work_experience?: string;
  company?: string;
  position?: string;
  department?: string;
}): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, ...data }
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('更新工作信息（模拟）:', data)
  const currentProfile = await getUserProfile()
  return {
    ...currentProfile,
    ...data
  }
}

/**
 * 更新职业兴趣
 * @param data 职业兴趣数据
 * @returns 更新后的用户资料
 */
export const updateCareerInterests = async (data: {
  career_interests?: any;
  preferred_industries?: string[];
  preferred_positions?: string[];
  salary_expectation?: string;
  work_style?: any;
  growth_potential?: any;
}): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, ...data }
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('更新职业兴趣（模拟）:', data)
  const currentProfile = await getUserProfile()
  return {
    ...currentProfile,
    ...data
  }
}

/**
 * 更新个性特征
 * @param data 个性特征数据
 * @returns 更新后的用户资料
 */
export const updatePersonality = async (data: {
  personality_traits?: any;
  learning_style?: any;
  learning_ability?: any;
}): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, ...data }
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('更新个性特征（模拟）:', data)
  const currentProfile = await getUserProfile()
  return {
    ...currentProfile,
    ...data
  }
}

/**
 * 一次性更新完整用户资料
 * @param data 完整的用户资料数据
 * @returns 更新后的用户资料
 */
export const updateCompleteProfile = async (data: CreateUpdateProfileParams): Promise<UserProfile> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return { ...mockUserProfile, ...data }
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('更新完整资料（模拟）:', data)
  const currentProfile = await getUserProfile()
  return {
    ...currentProfile,
    ...data
  }
}

/**
 * 上传用户简历
 * @param file 简历文件
 * @returns 上传结果，包含文件ID和URL
 */
export const uploadResume = async (file: File): Promise<{file_id: string, file_url: string}> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return {
      file_id: `mock-${Date.now()}`,
      file_url: URL.createObjectURL(file)
    }
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('上传简历（模拟）:', file.name)
  return {
    file_id: `mock-${Date.now()}`,
    file_url: URL.createObjectURL(file)
  }
}

/**
 * 获取用户简历列表
 * @returns 简历列表
 */
export const getUserResumes = async (): Promise<Array<{
  id: string;
  name: string;
  type: string;
  url: string;
  is_default: boolean;
  created_at: string;
}>> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回模拟数据
    return mockResumes
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('获取简历列表（模拟）')
  return mockResumes
}

/**
 * 设置默认简历
 * @param resumeId 简历ID
 * @returns 操作结果
 */
export const setDefaultResume = async (resumeId: string): Promise<boolean> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回成功
    console.log('设置默认简历（模拟）:', resumeId)
    return true
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('设置默认简历（模拟）:', resumeId)
  return true
}

/**
 * 删除简历
 * @param resumeId 简历ID
 * @returns 操作结果
 */
export const deleteResume = async (resumeId: string): Promise<boolean> => {
  if (USE_MOCK) {
    // 如果启用Mock，返回成功
    console.log('删除简历（模拟）:', resumeId)
    return true
  }
  
  // 后端暂未实现，返回模拟数据
  console.log('删除简历（模拟）:', resumeId)
  return true
}

/**
 * 检查用户是否已创建资料
 * @returns 布尔值，表示资料是否存在
 */
export const checkProfileExists = async (): Promise<boolean> => {
  try {
    const userInfo = await getUserProfile()
    // 仅检查用户ID是否存在
    return !!userInfo.id
  } catch (error: any) {
    // 如果返回404，表示资料不存在
    if (error.response && error.response.status === 404) {
      return false
    }
    // 其他错误则继续抛出
    throw error
  }
}

// 模拟的用户资料数据
const mockUserProfile: UserProfile = {
  id: 1,
  user_id: 1,
  full_name: 'Admin User',
  gender: '男',
  date_of_birth: '1990-01-01',
  bio: '这是一个模拟的用户资料',
  phone: '13800138000',
  avatar_url: 'https://via.placeholder.com/150',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  location_city: '北京',
  location_province: '北京',
  education_level: '本科',
  work_years: 5,
  current_status: '在职',
  work_experience: '5年工作经验',
  company: '示例公司',
  position: '软件工程师',
  department: '研发部',
  skills: ['JavaScript', 'Python', 'React'],
  skill_tags: ['前端开发', '后端开发', 'DevOps'],
  interests: ['编程', '读书', '旅行'],
  career_interests: {
    arts: 3,
    science: 8,
    business: 6,
    technology: 9
  },
  preferred_industries: ['科技', '教育'],
  preferred_positions: ['前端开发', '全栈开发'],
  salary_expectation: '25000-30000',
  work_style: {
    office: 7,
    remote: 8,
    teamwork: 9,
    independent: 7
  },
  personality_traits: {
    openness: 8,
    conscientiousness: 7,
    extraversion: 6,
    agreeableness: 8,
    neuroticism: 4
  },
  learning_style: {
    visual: 8,
    reading: 7,
    auditory: 6,
    kinesthetic: 5
  },
  learning_ability: {
    quick_learner: true,
    problem_solving: 8,
    critical_thinking: 7,
    attention_to_detail: 8
  },
  growth_potential: {
    creativity: 8,
    leadership: 7,
    adaptability: 9,
    technical_expertise: 8
  }
}

// 模拟的简历列表
const mockResumes = [
  {
    id: 'mock-resume-1',
    name: '个人简历.pdf',
    type: 'pdf',
    url: 'https://via.placeholder.com/150',
    is_default: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-resume-2',
    name: '英文简历.pdf',
    type: 'pdf',
    url: 'https://via.placeholder.com/150',
    is_default: false,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
]

export default {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  updateAvatarUrl,
  updateWorkInfo,
  updateCareerInterests,
  updatePersonality,
  updateCompleteProfile,
  uploadResume,
  getUserResumes,
  setDefaultResume,
  deleteResume,
  checkProfileExists
} 