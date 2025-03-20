import type { UserProfile } from '@/types/profile'

// 模拟个人资料数据
let mockUserProfile: UserProfile = {
  id: 1,
  user_id: 1,
  full_name: '测试用户',
  gender: '男',
  date_of_birth: '1995-01-01',
  bio: '这是一个模拟的个人简介',
  phone: '13800138000',
  avatar_url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  location_city: '北京',
  location_province: '北京',
  education_level: '本科',
  education_background: '计算机科学与技术',
  major: '计算机科学',
  work_years: 3,
  current_status: '在职',
  skills: ['JavaScript', 'Vue', 'React', 'Node.js'],
  skill_tags: ['前端开发', '全栈开发'],
  interests: ['编程', '阅读', '游戏'],
  career_interests: {
    arts: 60,
    science: 85,
    business: 70,
    technology: 90
  },
  work_style: {
    office: 70,
    remote: 80,
    teamwork: 85,
    independent: 75
  },
  growth_potential: {
    creativity: 80,
    leadership: 70,
    adaptability: 85,
    technical_expertise: 90
  },
  personality_traits: {
    openness: 80,
    conscientiousness: 75,
    extraversion: 65,
    agreeableness: 70,
    neuroticism: 40
  },
  learning_style: {
    visual: 85,
    reading: 80,
    auditory: 70,
    kinesthetic: 65
  },
  learning_ability: {
    quick_learner: true,
    problem_solving: 85,
    critical_thinking: 80,
    attention_to_detail: 75
  },
  recommended_paths: [
    { path: '软件开发工程师' },
    { path: '前端开发工程师' },
    { path: '全栈开发工程师' }
  ],
  ai_analysis: {
    score: 85,
    summary: '该用户在技术领域展现出较高的潜力和兴趣，特别适合软件开发相关职业。'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// 检查用户是否有资料
export function mockCheckProfileExists(token: string): boolean {
  // 如果有效token，假设资料存在
  return !!token && token.startsWith('mock-token-')
}

// 获取用户资料
export function mockGetUserProfile(token: string): any {
  if (!token || !token.startsWith('mock-token-')) {
    return { code: 401, message: '未授权访问' }
  }
  
  return {
    code: 200,
    message: '获取资料成功',
    data: mockUserProfile
  }
}

// 创建用户资料
export function mockCreateUserProfile(data: any, token: string): any {
  if (!token || !token.startsWith('mock-token-')) {
    return { code: 401, message: '未授权访问' }
  }
  
  // 合并数据
  mockUserProfile = {
    ...mockUserProfile,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  return {
    code: 200,
    message: '创建资料成功',
    data: mockUserProfile
  }
}

// 更新用户资料
export function mockUpdateUserProfile(data: any, token: string): any {
  if (!token || !token.startsWith('mock-token-')) {
    return { code: 401, message: '未授权访问' }
  }
  
  // 合并数据
  mockUserProfile = {
    ...mockUserProfile,
    ...data,
    updated_at: new Date().toISOString()
  }
  
  return {
    code: 200,
    message: '更新资料成功',
    data: mockUserProfile
  }
}

// 更新头像URL
export function mockUpdateAvatarUrl(avatarUrl: string, token: string): any {
  if (!token || !token.startsWith('mock-token-')) {
    return { code: 401, message: '未授权访问' }
  }
  
  mockUserProfile.avatar_url = avatarUrl
  mockUserProfile.updated_at = new Date().toISOString()
  
  return {
    code: 200,
    message: '头像更新成功',
    data: mockUserProfile
  }
}

export default {
  mockGetUserProfile,
  mockCreateUserProfile,
  mockUpdateUserProfile,
  mockUpdateAvatarUrl,
  mockCheckProfileExists
} 