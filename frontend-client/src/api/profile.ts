import request from './request'
import type { UserProfile, CreateUpdateProfileParams, CareerInterests, WorkStyle, PersonalityTraits, AvatarUpdateParams } from '@/types/profile'
import { extractData } from '@/utils/responseAdapter'
import axios from 'axios'

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
  const response = await request.get<ApiResponse<UserProfile>>('/api/v1/auth/me')
  // 使用适配器提取数据
  const userData = extractData(response)
  
  return {
    ...userData,
    // 添加用户详细资料的默认值，防止前端UI出错
    career_interests: userData.career_interests || {},
    work_style: userData.work_style || {},
    personality_traits: userData.personality_traits || {},
    learning_style: userData.learning_style || {},
    learning_ability: userData.learning_ability || {},
    skills: userData.skills || [],
    interests: userData.interests || []
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
  const response = await request.patch<ApiResponse<UserProfile>>('/api/v1/auth/me', basicInfo)
  // 使用适配器提取数据
  const userData = extractData(response)
  
  return {
    ...userData,
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
  const response = await request.patch<ApiResponse<UserProfile>>('/api/v1/auth/me', basicInfo)
  // 使用适配器提取数据
  const userData = extractData(response)
  
  return {
    ...userData,
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
  const response = await request.patch<ApiResponse<UserProfile>>('/api/v1/auth/me/avatar-url', { avatar_url: avatarUrl })
  // 使用适配器提取数据
  const userData = extractData(response)
  
  return {
    ...userData,
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
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await request.post('/api/v1/resume-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const data = extractData(response);
    return {
      file_id: data.filename,
      file_url: data.file_url
    }
  } catch (error: any) {
    console.error('上传简历失败:', error);
    // 后端暂未正确实现或出错，返回模拟数据
    console.log('上传简历（模拟）:', file.name);
    return {
      file_id: `mock-${Date.now()}`,
      file_url: URL.createObjectURL(file)
    }
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
  
  try {
    // 首先尝试获取文件列表
    const fileListResponse = await request.get('/api/v1/resume-files/', {
      silent: true // 静默模式，不显示错误提示
    });
    const files = extractData(fileListResponse);
    
    if (Array.isArray(files) && files.length > 0) {
      console.log('从API获取到简历文件列表:', files);
      
      // 获取用户的简历信息
      const resume = await getUserResumeInfo();
      const resumeId = resume ? String(resume.id) : '0';
      
      // 转换为前端需要的格式
      return files.map(file => ({
        id: resumeId, // 使用简历ID
        name: file.filename,
        type: file.filename.split('.').pop() || '',
        url: file.file_url,
        is_default: true, // 默认为true，因为一个用户只有一份简历
        created_at: resume?.created_at || new Date().toISOString()
      }));
    }
    
    // 如果文件列表为空，检查用户是否有简历记录
    const resume = await getUserResumeInfo();
    if (resume && resume.file_url) {
      // 手动构建一条记录
      const filename = resume.file_url.split('/').pop() || 'resume.pdf';
      const originalFilename = filename.split('_').slice(2).join('_');
      
      return [{
        id: String(resume.id),
        name: originalFilename,
        type: originalFilename.split('.').pop() || '',
        url: resume.file_url,
        is_default: true,
        created_at: resume.created_at || new Date().toISOString()
      }];
    }
    
    // 如果没有简历或URL，返回空列表
    return [];
  } catch (error) {
    console.error('获取简历列表失败:', error);
    return [];
  }
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
 * 删除简历文件
 * @param filename 文件名
 * @returns 删除结果
 */
export async function deleteResume(filename: string): Promise<any> {
  console.log('调用删除简历API, 参数:', filename);
  
  try {
    // 处理可能的URL格式
    if (filename.includes('http')) {
      // 如果传入的是完整URL，提取文件名
      const urlParts = filename.split('/');
      filename = urlParts[urlParts.length - 1];
      console.log('从URL提取的文件名:', filename);
    }
    
    // 确保文件名不为空
    if (!filename || filename.trim() === '') {
      throw new Error('文件名不能为空');
    }
    
    const encodedFilename = encodeURIComponent(filename);
    console.log('实际发送的删除请求路径:', `/api/v1/resume-files/${encodedFilename}`);
    
    // 使用原生fetch API作为备选方案，避免可能的拦截器问题
    const response = await fetch(`/api/v1/resume-files/${encodedFilename}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`删除失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('删除简历API响应:', data);
    return data;
  } catch (error: any) {
    console.error('删除简历文件失败:', error);
    throw error;
  }
}

/**
 * 检查用户是否已创建资料
 * @returns 布尔值，表示资料是否存在
 */
export const checkProfileExists = async (): Promise<boolean> => {
  try {
    const userInfo = await getUserProfile()
    // 仅检查用户ID是否存在
    return !!userInfo && !!userInfo.id
  } catch (error: any) {
    // 如果返回404，表示资料不存在
    if (error.response && error.response.status === 404) {
      return false
    }
    // 其他错误则继续抛出
    throw error
  }
}

/**
 * 获取当前用户的简历信息
 * @returns 用户简历信息
 */
export const getUserResumeInfo = async () => {
  try {
    const response = await request.get('/api/v1/resumes/me', {
      silent: true // 静默模式，不显示错误提示
    });
    return extractData(response);
  } catch (error: any) {
    // 如果是404错误，说明用户还没有创建简历
    if (error.response?.status === 404) {
      return null;
    }
    console.error('获取简历信息失败:', error);
    return null;
  }
}

/**
 * 更新简历文件URL
 * @param resumeId 简历ID
 * @param fileUrl 文件URL
 * @returns 更新后的简历信息
 */
export const updateResumeFileUrl = async (resumeId: number, fileUrl: string) => {
  const response = await request.put(`/api/v1/resumes/me/${resumeId}/file`, {
    file_url: fileUrl
  });
  return extractData(response);
}

/**
 * 强制删除简历记录
 * 当其他方法失败时的后备方案，直接删除数据库记录
 * @param resumeId 简历ID
 * @returns 删除结果
 */
export async function forceDeleteResumeRecord(resumeId: string): Promise<any> {
  console.log('强制删除简历记录:', resumeId);
  
  try {
    // 直接调用后端API删除记录
    const response = await request({
      url: `/api/v1/resumes/${resumeId}/force-delete`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('强制删除响应:', response);
    return response;
  } catch (error: any) {
    console.error('强制删除简历记录失败:', error);
    
    // 详细记录错误信息
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
    }
    
    throw error;
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
  checkProfileExists,
  getUserResumeInfo,
  updateResumeFileUrl,
  forceDeleteResumeRecord
} 