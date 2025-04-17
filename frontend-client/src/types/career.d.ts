declare module '../api/career' {
  export function generateRecommendations(userId: string | number, forceNew?: boolean): Promise<any>;
  export function getRecommendationProgress(userId?: string | number): Promise<any>;
  export function getRecommendationStatus(userId?: string | number, checkRedis?: boolean): Promise<any>;
  export function syncRecommendationStatus(userId: string | number): Promise<any>;
  export function getRecommendations(userId?: string | number): Promise<any>;
  export function getRecommendationCandidates(userId?: string | number): Promise<any>;
  export function toggleFavoriteCareer(data: { is_favorite: boolean, career_id?: string | number, user_id?: string | number }): Promise<any>;
  export function getUserRecommendations(userId: string | number): Promise<any>;
  export function checkRecommendationData(userId?: string | number): Promise<any>;
  export function getAssessmentData(userId?: string | number): Promise<any>;
  export function getRawRecommendationData(userId?: string | number): Promise<any>;
  export function checkResumeData(userId?: string | number): Promise<any>;
  export function getUserProfile(userId?: string | number): Promise<any>;
  export function getUserProfileDebug(userId: string): Promise<any>;
  export function getResumeDataDebug(userId: string): Promise<any>;
  export function injectUserProfileDebug(userId: string): Promise<any>;
  export function injectResumeDebug(userId: string): Promise<any>;
  export function getCareerDetail(careerId: string | number): Promise<Career | null>;
}

declare module '../api/career/index' {
  export function fetchCareerDetail(careerId: string | number): Promise<Career | null>;
  export function fetchRecommendations(userId?: string | number): Promise<any>;
  export function convertToApiParams(params: PaginationParams): ApiPaginationParams;
  export function normalizeResponse<T>(response: any, params: PaginationParams): PaginatedResult<T>;
  export function getCareers(options?: { page?: number, pageSize?: number, sortBy?: string }): Promise<PaginatedResult<Career>>;
  export function getCategoryCareers(options: { categoryId: string | number, page?: number, pageSize?: number, includeSubcategories?: boolean, sortBy?: string }): Promise<PaginatedResult<Career>>;
  export function searchCareers(options: { query: string, page?: number, pageSize?: number, sortBy?: string }): Promise<PaginatedResult<Career>>;
  export function getCareersBySkills(options: { skills: string[], page?: number, pageSize?: number, sortBy?: string }): Promise<PaginatedResult<Career>>;
}

declare module '../api/career/api' {
  export function convertToApiParams(params: PaginationParams): ApiPaginationParams;
  export function normalizeResponse<T>(response: any, params: PaginationParams): PaginatedResult<T>;
  export function getCareerDetailNew(careerId: string | number): Promise<Career | null>;
  export function getRecommendationsNew(userId?: string | number): Promise<any>;
}

declare module '../api/career_old' {
  export function getRecommendationProgress(userId?: string | number): Promise<any>;
  export function getRecommendations(userId?: string | number): Promise<any>;
  export function syncRecommendationStatus(userId: string | number): Promise<any>;
  export function getRecommendationCandidates(userId?: string | number): Promise<any>;
  export function toggleFavoriteCareer(data: { is_favorite: boolean, career_id?: string | number, user_id?: string | number }): Promise<any>;
  export function getUserRecommendations(userId: string | number): Promise<any>;
  export function checkRecommendationData(userId?: string | number): Promise<any>;
  export function getAssessmentData(userId?: string | number): Promise<any>;
  export function getRawRecommendationData(userId?: string | number): Promise<any>;
  export function checkResumeData(userId?: string | number): Promise<any>;
  export function getUserProfile(userId?: string | number): Promise<any>;
}

declare module '../stores/user' {
  export function useCurrentUser(): {
    user: {
      id?: string;
      username?: string;
      email?: string;
      [key: string]: any;
    } | null;
    [key: string]: any;
  };
}

// 职业类型定义
export interface Career {
  id: string | number;
  name: string;
  description?: string;
  category_id?: string | number;
  category_name?: string;
  salary_range?: string;
  avg_salary?: number;
  min_salary?: number;
  max_salary?: number;
  hot_index?: number;
  growth_index?: number;
  education_requirements?: string;
  skills_required?: string[];
  career_path?: string;
  job_description?: string;
  job_responsibilities?: string[];
  industry?: string;
  employment_prospects?: string;
  is_favorite?: boolean;
  [key: string]: any;
}

// 分页参数接口
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// API分页参数接口
export interface ApiPaginationParams {
  skip: number;
  limit: number;
}

// 分页结果接口
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
} 