export interface Career {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  salary_range?: string;
  median_salary?: number;
  education_required?: string;
  education_requirements?: string;
  experience_required?: string;
  job_outlook?: string;
  skills_required?: string[];
  required_skills?: string[];
  related_careers?: string[];
  growth_potential?: string;
  category_id?: string;
  category_name?: string;
  categories?: CareerCategory[];
  is_favorite?: boolean;
  image_url?: string;
  industries?: string[];
  work_environment?: string;
  job_duties?: string[];
  career_path?: string;
}

export interface CareerCategory {
  id: string | number;
  name: string;
  description?: string;
  parent_id?: string | number | null;
  children?: CareerCategory[];
  level?: number;
  count?: number;
  order?: number;
  image_url?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 前端分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// API分页参数
export interface ApiPaginationParams {
  skip: number;
  limit: number;
}

// 转换函数：将前端分页参数转换为API分页参数
export function convertToApiParams(params: PaginationParams): ApiPaginationParams {
  return {
    skip: (params.page - 1) * params.pageSize,
    limit: params.pageSize
  };
}

// 转换函数：将API结果转换为前端分页结果
export function convertToPaginatedResult<T>(
  items: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    hasMore: (params.page * params.pageSize) < total
  };
} 