import request from './request'
import axios, { AxiosResponse } from 'axios'

// 职业推荐API接口

// 开始生成职业推荐
export function generateRecommendations(userId: string | number, forceNew: boolean = false) {
  console.log(`API调用: generateRecommendations(userId=${userId}, forceNew=${forceNew})`)
  return request.post('/api/v1/career-recommendations/generate', {
    user_id: userId,
    force_new: forceNew
  })
}

// 获取推荐进度（从数据库或Redis获取）
export function getRecommendationProgress(userId?: string | number) {
  console.log(`API调用: getRecommendationProgress(userId=${userId})`)
  return request.get('/api/v1/career-recommendations/progress', {
    params: userId ? { user_id: userId } : {}
  })
}

// 获取推荐状态 (新主要接口)
export function getRecommendationStatus(userId?: string | number, checkRedis: boolean = true) {
  console.log(`API调用: getRecommendationStatus(userId=${userId}, checkRedis=${checkRedis})`)
  return request.get('/api/v1/career-recommendations/status', {
    params: {
      user_id: userId,
      check_redis: checkRedis
    }
  })
}

// 同步推荐状态
export function syncRecommendationStatus(userId: string | number) {
  console.log(`API调用: syncRecommendationStatus(userId=${userId})`)
  return request.get(`/api/v1/career-recommendations/sync-status/${userId}`)
}

// 获取推荐结果
export function getRecommendations(userId?: string | number) {
  console.log(`API调用: getRecommendations(userId=${userId})`)
  return request.get('/api/v1/career-recommendations', {
    params: userId ? { user_id: userId } : {}
  })
}

// 获取候选职业
export function getRecommendationCandidates(userId?: string | number) {
  return request.get('/api/v1/career-recommendations/candidates', {
    params: userId ? { user_id: userId } : {}
  })
}

// 收藏/取消收藏职业
export function toggleFavoriteCareer(data: { 
  is_favorite: boolean,
  career_id?: string | number,
  user_id?: string | number
}) {
  return request.post('/api/v1/career-recommendations/favorite', data)
}

// 获取指定用户的推荐
export function getUserRecommendations(userId: string | number) {
  return request.get(`/api/v1/career-recommendations/user/${userId}`)
}

/**
 * 检查推荐数据准备状态
 * @param userId 用户ID
 */
export async function checkRecommendationData(userId?: string | number) {
  console.log('API调用: 检查推荐数据准备状态', userId);
  return await request({
    url: '/api/recommendation/check_data',
    method: 'get',
    params: { userId }
  });
}

/**
 * 获取测评数据
 * @param userId 用户ID
 */
export async function getAssessmentData(userId?: string | number) {
  console.log('API调用: 获取测评数据', userId);
  return await request({
    url: '/api/v1/assessments/user-data',
    method: 'get',
    params: { user_id: userId }
  });
}

/**
 * 获取原始推荐数据
 * @param userId 用户ID
 */
export async function getRawRecommendationData(userId?: string | number) {
  console.log('API调用: 获取原始推荐数据', userId);
  return await request({
    url: '/api/v1/career-recommendations/raw-data',
    method: 'get',
    params: { user_id: userId }
  });
}

/**
 * 检查简历数据是否存在
 * @param userId 用户ID
 */
export async function checkResumeData(userId?: string | number) {
  console.log('API调用: 检查简历数据是否存在', userId);
  try {
    // 尝试多个可能的API路径
    let response: any = null;
    try {
      response = await request.get('/api/v1/resume', {
        params: { user_id: userId }
      });
    } catch (e) {
      try {
        response = await request.get(`/api/v1/users/${userId}/resume`);
      } catch (e2) {
        response = await request.get('/api/v1/user-resume', {
          params: { user_id: userId }
        });
      }
    }
    
    // 检查并记录数据详情
    const data = response?.data;
    const hasData = data && typeof data === 'object' && Object.keys(data).length > 0;
    
    console.log('简历数据检查结果:', {
      exists: !!data,
      hasContent: hasData,
      dataKeys: data ? Object.keys(data) : []
    });
    
    return {
      data,
      exists: !!data,
      hasContent: hasData,
      status: hasData ? 'success' : 'empty'
    };
  } catch (error: any) {
    console.error('获取简历数据失败:', error);
    return {
      error: error.message || String(error),
      exists: false,
      hasContent: false,
      status: 'error'
    };
  }
}

/**
 * 获取用户详细资料
 * @param userId 用户ID
 */
export async function getUserProfile(userId?: string | number) {
  console.log('API调用: 获取用户详细资料', userId);
  try {
    // 尝试多个可能的API路径
    let response: any = null;
    try {
      response = await request.get('/api/v1/user-profile', {
        params: { user_id: userId }
      });
    } catch (e) {
      try {
        response = await request.get(`/api/v1/users/${userId}`);
      } catch (e2) {
        response = await request.get('/api/v1/users/profile', {
          params: { id: userId }
        });
      }
    }
    
    return {
      data: response?.data,
      exists: !!response?.data,
      status: 'success'
    };
  } catch (error: any) {
    console.error('获取用户详细资料失败:', error);
    return {
      error: error.message || String(error),
      exists: false,
      status: 'error'
    };
  }
}

/**
 * 查询用户资料（调试用）
 * @param userId 用户ID
 */
export const getUserProfileDebug = async (userId: string): Promise<any> => {
  console.log(`[调试] 获取用户资料: userId=${userId}`);
  try {
    const response: any = await axios.get(`/api/v1/debug/user-profile/${userId}`);
    console.log('[调试] 用户资料查询结果:', response.data);
    return response.data;
  } catch (error) {
    console.error('[调试] 获取用户资料失败:', error);
    return {
      success: false,
      message: `获取用户资料失败: ${error}`,
    };
  }
};

/**
 * 查询用户简历数据（调试用）
 * @param userId 用户ID
 */
export const getResumeDataDebug = async (userId: string): Promise<any> => {
  console.log(`[调试] 获取用户简历: userId=${userId}`);
  try {
    const response: any = await axios.get(`/api/v1/debug/resume-data/${userId}`);
    console.log('[调试] 用户简历查询结果:', response.data);
    return response.data;
  } catch (error) {
    console.error('[调试] 获取用户简历失败:', error);
    return {
      success: false,
      message: `获取用户简历失败: ${error}`,
    };
  }
};

/**
 * 注入用户资料数据（调试用）
 * @param userId 用户ID
 */
export const injectUserProfileDebug = async (userId: string): Promise<any> => {
  console.log(`[调试] 注入用户资料: userId=${userId}`);
  try {
    const response: any = await axios.post('/api/v1/debug/inject-user-profile', { user_id: userId });
    console.log('[调试] 用户资料注入结果:', response.data);
    return response.data;
  } catch (error) {
    console.error('[调试] 注入用户资料失败:', error);
    return {
      success: false,
      message: `注入用户资料失败: ${error}`,
    };
  }
};

/**
 * 注入简历数据（调试用）
 * @param userId 用户ID
 */
export const injectResumeDebug = async (userId: string): Promise<any> => {
  console.log(`[调试] 注入简历数据: userId=${userId}`);
  try {
    const response: any = await axios.post('/api/v1/debug/inject-resume', { user_id: userId });
    console.log('[调试] 简历数据注入结果:', response.data);
    return response.data;
  } catch (error) {
    console.error('[调试] 注入简历数据失败:', error);
    return {
      success: false,
      message: `注入简历数据失败: ${error}`,
    };
  }
};

/**
 * 进行用户兴趣分析（调试用）- 仅为保持API兼容性保留
 * @param userId 用户ID
 * @deprecated 此功能已被移除
 */
export const analyzeUserInterests = async (userId: string): Promise<any> => {
  console.log(`[已废弃] 兴趣分析功能已移除: userId=${userId}`);
  return {
    success: false,
    message: "兴趣分析功能已被移除",
    error: "DEPRECATED_FUNCTION"
  };
};

export default {
  generateRecommendations,
  getRecommendationProgress,
  getRecommendationStatus,
  syncRecommendationStatus,
  getRecommendations,
  getRecommendationCandidates,
  toggleFavoriteCareer,
  getUserRecommendations,
  checkRecommendationData,
  getAssessmentData,
  getRawRecommendationData,
  checkResumeData,
  getUserProfile,
  analyzeUserInterests
} 