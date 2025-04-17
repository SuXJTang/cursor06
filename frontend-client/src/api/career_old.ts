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
  .then(response => {
    console.log('生成推荐成功:', response)
    return response
  })
  .catch(error => {
    console.error('生成推荐失败:', error)
    throw error
  })
}

// 获取推荐进度（从数据库或Redis获取）
export function getRecommendationProgress(userId?: string | number) {
  console.log(`API调用: getRecommendationProgress(userId=${userId})`)
  return request.get('/api/v1/career-recommendations/progress', {
    params: userId ? { user_id: userId } : {}
  })
  .then(response => {
    console.log('获取推荐进度成功:', response)
    return response
  })
  .catch(error => {
    console.error('获取推荐进度失败:', error)
    throw error
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
  .then(response => {
    console.log('获取推荐结果成功:', response)
    return response
  })
  .catch(error => {
    console.error('获取推荐结果失败:', error)
    // 提供友好的错误信息
    return {
      status: 'error',
      message: '获取推荐结果失败，请稍后重试',
      error: error.message || '未知错误',
      recommendations: [],
      candidates: []
    }
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
        response = await request.get(`/api/v1/users/${userId}/profile`);
      } catch (e2) {
        response = await request.get('/api/v1/user-info', {
          params: { user_id: userId }
        });
      }
    }
    
    // 检查并记录数据详情
    const data = response?.data;
    const hasData = data && typeof data === 'object' && Object.keys(data).length > 0;
    
    console.log('用户资料检查结果:', {
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
    console.error('获取用户资料失败:', error);
    return {
      error: error.message || String(error),
      exists: false,
      hasContent: false,
      status: 'error'
    };
  }
}