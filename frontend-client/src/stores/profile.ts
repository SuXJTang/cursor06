import { defineStore } from 'pinia'
import type { UserProfile } from '@/types/profile'
import { 
  getUserProfile as fetchProfileAPI, 
  createUserProfile as createProfileAPI, 
  updateUserProfile as updateProfileAPI,
  updateAvatarUrl as updateAvatarUrlAPI,
  updateWorkInfo as updateWorkInfoAPI,
  updateCareerInterests as updateCareerInterestsAPI,
  updatePersonality as updatePersonalityAPI,
  updateCompleteProfile as updateCompleteProfileAPI,
  uploadResume as uploadResumeAPI,
  getUserResumes as getUserResumesAPI,
  setDefaultResume as setDefaultResumeAPI,
  deleteResume as deleteResumeAPI,
  checkProfileExists as checkProfileExistsAPI
} from '@/api/profile'
import authApi from '@/api/auth'
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'

// API响应类型
interface ApiResponse<T> {
  data?: T
  code?: number
  message?: string
  [key: string]: any
}

export const useProfileStore = defineStore('profile', () => {
  // 状态
  const userProfile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const resumes = ref<Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    is_default: boolean;
    created_at: string;
    uploadTime?: string;
  }>>([])
  
  // 私有方法
  // 保存到本地存储
  const saveToLocalStorage = () => {
    if (userProfile.value) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile.value))
    }
  }
  
  // 从本地存储加载
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('userProfile')
      if (stored) {
        userProfile.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('从本地存储加载资料失败:', err)
    }
  }
  
  // 获取用户资料
  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetchProfileAPI()
      userProfile.value = response
      saveToLocalStorage()
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '获取用户资料失败'
      console.error('获取用户资料失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 检查用户资料是否存在
  const checkProfileExists = async (): Promise<boolean> => {
    try {
      return await checkProfileExistsAPI()
    } catch (err) {
      console.error('检查用户资料是否存在失败:', err)
      return false
    }
  }
  
  // 创建用户资料
  const createUserProfile = async (profileData: any): Promise<UserProfile | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await createProfileAPI(profileData)
      userProfile.value = response
      saveToLocalStorage()
      ElMessage.success('个人资料创建成功')
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '创建用户资料失败'
      console.error('创建用户资料失败:', err)
      ElMessage.error('创建资料失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 更新用户资料
  const updateUserProfile = async (profileData: any): Promise<UserProfile | null> => {
    if (!userProfile.value) return null
    loading.value = true
    error.value = null
    
    try {
      const response = await updateProfileAPI(profileData)
      userProfile.value = response
      saveToLocalStorage()
      ElMessage.success('个人资料更新成功')
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '更新用户资料失败'
      console.error('更新用户资料失败:', err)
      ElMessage.error('更新资料失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 更新工作信息
  const updateWorkInfo = async (workData: any): Promise<UserProfile | null> => {
    if (!userProfile.value) return null
    loading.value = true
    error.value = null
    
    try {
      const response = await updateWorkInfoAPI(workData)
      userProfile.value = response
      saveToLocalStorage()
      ElMessage.success('工作信息更新成功')
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '更新工作信息失败'
      console.error('更新工作信息失败:', err)
      ElMessage.error('更新工作信息失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 更新职业兴趣
  const updateCareerInterests = async (careerData: any): Promise<UserProfile | null> => {
    if (!userProfile.value) return null
    loading.value = true
    error.value = null
    
    try {
      const response = await updateCareerInterestsAPI(careerData)
      userProfile.value = response
      saveToLocalStorage()
      ElMessage.success('职业兴趣更新成功')
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '更新职业兴趣失败'
      console.error('更新职业兴趣失败:', err)
      ElMessage.error('更新职业兴趣失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 更新性格特征
  const updatePersonality = async (personalityData: any): Promise<UserProfile | null> => {
    if (!userProfile.value) return null
    loading.value = true
    error.value = null
    
    try {
      const response = await updatePersonalityAPI(personalityData)
      userProfile.value = response
      saveToLocalStorage()
      ElMessage.success('性格特征更新成功')
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '更新性格特征失败'
      console.error('更新性格特征失败:', err)
      ElMessage.error('更新性格特征失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 一次性更新完整资料
  const updateCompleteProfile = async (profileData: any): Promise<UserProfile | null> => {
    if (!userProfile.value) return null
    loading.value = true
    error.value = null
    
    try {
      const response = await updateCompleteProfileAPI(profileData)
      userProfile.value = response
      saveToLocalStorage()
      ElMessage.success('个人资料完整更新成功')
      return userProfile.value
    } catch (err: any) {
      error.value = err.message || '更新完整资料失败'
      console.error('更新完整资料失败:', err)
      ElMessage.error('更新完整资料失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 上传简历
  const uploadResume = async (file: File): Promise<{file_id: string, file_url: string} | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await uploadResumeAPI(file)
      // 更新简历列表
      await fetchUserResumes()
      return response
    } catch (err: any) {
      error.value = err.message || '上传简历失败'
      console.error('上传简历失败:', err)
      ElMessage.error('上传简历失败: ' + (err.message || '未知错误'))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 获取用户简历列表
  const fetchUserResumes = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getUserResumesAPI()
      resumes.value = response.map(resume => ({
        ...resume,
        uploadTime: new Date(resume.created_at).toLocaleString()
      }))
      return resumes.value
    } catch (err: any) {
      error.value = err.message || '获取简历列表失败'
      console.error('获取简历列表失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  // 设置默认简历
  const setDefaultResume = async (resumeId: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const success = await setDefaultResumeAPI(resumeId)
      if (success) {
        // 更新本地列表中的默认状态
        resumes.value.forEach(resume => {
          resume.is_default = resume.id === resumeId
        })
        ElMessage.success('默认简历设置成功')
      }
      return success
    } catch (err: any) {
      error.value = err.message || '设置默认简历失败'
      console.error('设置默认简历失败:', err)
      ElMessage.error('设置默认简历失败: ' + (err.message || '未知错误'))
      return false
    } finally {
      loading.value = false
    }
  }
  
  // 删除简历
  const deleteResume = async (resumeId: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const success = await deleteResumeAPI(resumeId)
      if (success) {
        // 从本地列表中移除
        const index = resumes.value.findIndex(resume => resume.id === resumeId)
        if (index !== -1) {
          resumes.value.splice(index, 1)
        }
        ElMessage.success('简历删除成功')
      }
      return success
    } catch (err: any) {
      error.value = err.message || '删除简历失败'
      console.error('删除简历失败:', err)
      ElMessage.error('删除简历失败: ' + (err.message || '未知错误'))
      return false
    } finally {
      loading.value = false
    }
  }
  
  // 计算属性
  const hasProfile = computed(() => userProfile.value !== null)
  const hasAvatar = computed(() => userProfile.value?.avatar_url !== undefined && userProfile.value?.avatar_url !== '')
  const profileCompletionPercentage = computed(() => {
    if (!userProfile.value) return 0
    
    // 计算填写完整度
    const profile = userProfile.value
    let completedFields = 0
    let totalFields = 0
    
    // 遍历属性并计算完成度
    for (const [key, value] of Object.entries(profile)) {
      // 排除id、user_id等系统字段
      if (['id', 'user_id', 'created_at', 'updated_at'].includes(key)) {
        continue
      }
      
      totalFields++
      if (value !== null && value !== undefined && value !== '') {
        completedFields++
      }
    }
    
    return Math.round((completedFields / totalFields) * 100)
  })
  
  // 方法
  const initUserProfile = async () => {
    if (initialized.value) return
    
    try {
      loading.value = true
      const exists = await checkProfileExists()
      if (exists) {
        await fetchUserProfile()
        // 同时获取简历列表
        await fetchUserResumes()
      }
      initialized.value = true
    } catch (err: any) {
      console.error('初始化用户资料失败:', err)
      error.value = err.message || '初始化失败'
    } finally {
      loading.value = false
    }
  }
  
  // 更新头像
  const updateAvatar = async (file: File) => {
    if (!userProfile.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // 1. 上传头像文件
      const uploadResponse = await authApi.uploadAvatar(file)
      const avatarUrl = uploadResponse?.data?.avatar_url || ''
      
      if (!avatarUrl) {
        throw new Error('头像URL获取失败')
      }
      
      // 2. 更新个人资料中的头像URL
      await updateAvatarUrlAPI(avatarUrl)
      
      // 3. 更新本地状态
      userProfile.value.avatar_url = avatarUrl
      saveToLocalStorage()
      
      ElMessage.success('头像更新成功')
      return avatarUrl
    } catch (err: any) {
      console.error('更新头像失败:', err)
      error.value = err.message || '头像更新失败'
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 初始化时加载本地数据
  loadFromLocalStorage()
  
  return {
    userProfile,
    loading,
    error,
    initialized,
    resumes,
    hasProfile,
    hasAvatar,
    profileCompletionPercentage,
    initUserProfile,
    updateAvatar,
    fetchUserProfile,
    checkProfileExists,
    createUserProfile,
    updateUserProfile,
    updateWorkInfo,
    updateCareerInterests,
    updatePersonality,
    updateCompleteProfile,
    uploadResume,
    fetchUserResumes,
    setDefaultResume,
    deleteResume,
    saveToLocalStorage,
    loadFromLocalStorage
  }
}) 