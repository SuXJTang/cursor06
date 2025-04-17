import type { Career } from './career';

// 测评结果用户特征
export interface UserTrait {
  name: string;
  score: number;
  explanation?: string;
  [key: string]: any;
}

// 推荐的职业
export interface RecommendedCareer {
  id: string | number;
  title: string; // 职业名称
  matchDegree: number; // 匹配度
  description?: string; // 职业描述
  skills: string[]; // 所需技能
  education?: string; // 教育要求
  salary?: string; // 薪资范围
  salaryMin?: number; // 最低薪资
  salaryMax?: number; // 最高薪资
  salaryAvg?: number; // 平均薪资
  outlook?: string; // 就业前景
  growthRate?: number; // 增长率
  [key: string]: any;
}

// 测评结果
export interface AssessmentResult {
  id: string; // 结果ID
  userId?: string | number; // 用户ID
  timestamp: string; // 时间戳
  userTraits: UserTrait[]; // 用户特征
  assessmentScores?: Record<string, number>; // 测评得分
  recommendedCareers: RecommendedCareer[]; // 推荐职业
  summary?: {
    careerDirection?: string; // 职业方向
    strengths?: string[]; // 优势
    improvements?: string[]; // 需要提升的地方
    [key: string]: any;
  };
  [key: string]: any;
}

// 声明recommendation store模块
declare module '../stores/recommendation' {
  export interface RecommendationState {
    assessmentResults: AssessmentResult[];
    currentAssessmentId: string | null;
    loadingRecommendation: boolean;
    hasError: boolean;
    errorMessage: string;
  }

  export function useRecommendationStore(): {
    // 状态
    assessmentResults: AssessmentResult[];
    hasAssessmentResults: boolean;
    latestAssessmentResult: AssessmentResult | null;
    currentAssessmentId: string | null;
    loadingRecommendation: boolean;
    hasError: boolean;
    errorMessage: string;
    
    // Getters
    getAssessmentById: (id: string) => AssessmentResult | undefined;
    
    // Actions
    saveAssessmentResult: (result: AssessmentResult) => void;
    getRecommendedCareers: (assessmentId?: string) => RecommendedCareer[];
    fetchRecommendationsFromApi: (userId?: string | number) => Promise<AssessmentResult | null>;
    loadFromLocalStorage: () => void;
    saveToLocalStorage: () => void;
    clearAllData: () => void;
  };
} 