// 用户资料相关类型定义

/**
 * 用户资料接口
 */
export interface UserProfile {
  id?: number;
  user_id?: number;
  full_name?: string;
  gender?: string;
  date_of_birth?: string;
  bio?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  
  // 地理位置字段
  location_city?: string;
  location_province?: string;
  address?: string;
  
  // 教育背景字段
  education_level?: string;
  education_background?: string;
  major?: string;
  
  // 工作信息字段
  work_years?: number;
  experience_years?: number;
  current_status?: string;
  work_experience?: string;
  company?: string;
  position?: string;
  department?: string;
  
  // 技能与兴趣字段
  skills?: string[] | string;
  skill_tags?: string[] | string;
  interests?: string[] | string;
  
  // 职业发展字段
  career_interests?: CareerInterests | {
    arts?: number;
    science?: number;
    business?: number;
    technology?: number;
    [key: string]: any;
  } | string;
  preferred_industries?: string[];
  preferred_positions?: string[];
  salary_expectation?: string;
  work_style?: WorkStyle | {
    office?: number;
    remote?: number;
    teamwork?: number;
    independent?: number;
    [key: string]: any;
  } | string;
  growth_potential?: {
    creativity?: number;
    leadership?: number;
    adaptability?: number;
    technical_expertise?: number;
    [key: string]: any;
  };
  
  // 个人特质字段
  personality_traits?: PersonalityTraits | string;
  learning_style?: {
    visual?: number;
    reading?: number;
    auditory?: number;
    kinesthetic?: number;
    [key: string]: any;
  };
  learning_ability?: {
    quick_learner?: boolean;
    problem_solving?: number;
    critical_thinking?: number;
    attention_to_detail?: number;
    [key: string]: any;
  };
  
  // 其他重要字段
  recommended_paths?: Array<{path: string}>;
  ai_analysis?: {
    score?: number;
    summary?: string;
    [key: string]: any;
  };
  resume_url?: string;
  
  [key: string]: any;
}

/**
 * 性格特质接口
 */
export interface PersonalityTraits {
  openness?: number;           // 开放性
  conscientiousness?: number;  // 尽责性
  extraversion?: number;       // 外向性
  agreeableness?: number;      // 宜人性
  neuroticism?: number;        // 神经质
  analytical?: number;         // 分析能力
  creative?: number;           // 创造力
  practical?: number;          // 实用性
  leadership?: number;         // 领导力
  teamwork?: number;           // 团队合作
  independence?: number;       // 独立性
  detail_oriented?: number;    // 注重细节
  stress_tolerance?: number;   // 抗压能力
  adaptability?: number;       // 适应能力
  
  [key: string]: any;
}

/**
 * 职业兴趣接口
 */
export interface CareerInterests {
  preferred_industries?: string[]; // 偏好行业
  preferred_positions?: string[];  // 偏好职位
  salary_expectation?: string;     // 薪资期望
  work_environment?: string;       // 工作环境偏好
  company_size?: string;           // 公司规模偏好
  work_life_balance?: number;      // 工作生活平衡重要性(1-10)
  career_progression?: number;     // 职业发展重要性(1-10)
  job_stability?: number;          // 工作稳定性重要性(1-10)
  remote_work?: boolean;           // 是否偏好远程工作
  
  // API文档中的字段
  arts?: number;
  science?: number;
  business?: number;
  technology?: number;
  
  [key: string]: any;
}

/**
 * 工作风格接口
 */
export interface WorkStyle {
  preferred_work_pace?: string;    // 偏好工作节奏
  communication_style?: string;    // 沟通风格
  decision_making?: string;        // 决策风格
  problem_solving?: string;        // 解决问题方式
  conflict_resolution?: string;    // 冲突解决方式
  team_role?: string;              // 团队中常见角色
  management_preference?: string;  // 管理偏好
  work_environment?: string;       // 工作环境偏好
  
  // API文档中的字段
  office?: number;
  remote?: number;
  teamwork?: number;
  independent?: number;
  
  [key: string]: any;
}

/**
 * 学习风格接口
 */
export interface LearningStyle {
  visual_learning?: number;        // 视觉学习倾向(1-10)
  auditory_learning?: number;      // 听觉学习倾向(1-10)
  kinesthetic_learning?: number;   // 动觉学习倾向(1-10)
  reading_writing?: number;        // 读写学习倾向(1-10)
  social_learning?: number;        // 社交学习倾向(1-10)
  solitary_learning?: number;      // 独立学习倾向(1-10)
  structured_learning?: number;    // 结构化学习倾向(1-10)
  
  // API文档中的字段
  visual?: number;
  reading?: number;
  auditory?: number;
  kinesthetic?: number;
  
  [key: string]: any;
}

/**
 * 学习能力接口
 */
export interface LearningAbility {
  quick_learner?: boolean;
  problem_solving?: number;
  critical_thinking?: number;
  attention_to_detail?: number;
  
  [key: string]: any;
}

/**
 * 成长潜力接口
 */
export interface GrowthPotential {
  creativity?: number;
  leadership?: number;
  adaptability?: number;
  technical_expertise?: number;
  
  [key: string]: any;
}

/**
 * 创建/更新资料参数类型
 */
export type CreateUpdateProfileParams = Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

// 更新头像参数
export interface AvatarUpdateParams {
  avatar: File;
} 