import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getRecommendations } from '@/api/career_old'

// 推荐职业的接口定义
export interface RecommendedCareer {
  id: string | number
  title: string
  matchDegree: number
  skills?: string[]
  salary?: {
    min?: number
    max?: number
  }
  description?: string
  education_required?: string
  experience_required?: string
  future_prospect?: string
}

// 测评结果接口
export interface AssessmentResult {
  id?: string
  userId?: string
  timestamp?: string
  summary?: {
    score?: number
    careerDirection?: string
    matchDegree?: string
    characteristics?: string[]
  }
  dimensions?: {
    interest?: any
    ability?: any
    personality?: any
  }
  recommendedCareers?: RecommendedCareer[]
}

export const useRecommendationStore = defineStore('recommendation', () => {
  // 状态
  const loading = ref(false)
  const error = ref<string | null>(null)
  const assessmentResults = ref<AssessmentResult[]>([])
  const currentAssessmentResult = ref<AssessmentResult | null>(null)
  const recommendedCareers = ref<RecommendedCareer[]>([])
  
  // 计算属性
  const hasAssessmentResults = computed(() => {
    return assessmentResults.value.length > 0
  })
  
  const latestAssessmentResult = computed(() => {
    if (assessmentResults.value.length === 0) return null
    
    // 按时间戳排序，获取最新的测评结果
    return [...assessmentResults.value].sort((a, b) => {
      const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0
      const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0
      return timestampB - timestampA
    })[0]
  })
  
  // 本地存储操作
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('assessment_results', JSON.stringify(assessmentResults.value))
      localStorage.setItem('current_assessment', currentAssessmentResult.value ? JSON.stringify(currentAssessmentResult.value) : '')
      localStorage.setItem('recommended_careers', JSON.stringify(recommendedCareers.value))
    } catch (err) {
      console.error('保存推荐数据到本地存储失败:', err)
    }
  }
  
  const loadFromLocalStorage = () => {
    try {
      const savedResults = localStorage.getItem('assessment_results')
      const currentResult = localStorage.getItem('current_assessment')
      const savedCareers = localStorage.getItem('recommended_careers')
      
      if (savedResults) {
        assessmentResults.value = JSON.parse(savedResults)
      }
      
      if (currentResult) {
        currentAssessmentResult.value = JSON.parse(currentResult)
      }
      
      if (savedCareers) {
        recommendedCareers.value = JSON.parse(savedCareers)
      }
    } catch (err) {
      console.error('从本地存储加载推荐数据失败:', err)
    }
  }
  
  // 方法
  
  // 保存测评结果
  const saveAssessmentResult = (result: AssessmentResult) => {
    // 添加时间戳
    if (!result.timestamp) {
      result.timestamp = new Date().toISOString()
    }
    
    // 检查是否已存在相同ID的结果
    const existingIndex = assessmentResults.value.findIndex(r => r.id === result.id)
    
    if (existingIndex >= 0) {
      // 更新已有结果
      assessmentResults.value[existingIndex] = result
    } else {
      // 添加新结果
      assessmentResults.value.push(result)
    }
    
    // 设置当前结果
    currentAssessmentResult.value = result
    
    // 如果结果包含推荐职业，也更新推荐职业列表
    if (result.recommendedCareers && result.recommendedCareers.length > 0) {
      recommendedCareers.value = result.recommendedCareers
    }
    
    // 保存到本地存储
    saveToLocalStorage()
    
    return result
  }
  
  // 获取推荐职业
  const getRecommendedCareers = () => {
    if (recommendedCareers.value.length > 0) {
      return recommendedCareers.value
    }
    
    // 如果当前没有推荐职业，但有测评结果，尝试从最新测评结果获取
    if (latestAssessmentResult.value?.recommendedCareers) {
      recommendedCareers.value = latestAssessmentResult.value.recommendedCareers
      saveToLocalStorage()
      return recommendedCareers.value
    }
    
    return []
  }
  
  // 清除所有数据
  const clearAllData = () => {
    assessmentResults.value = []
    currentAssessmentResult.value = null
    recommendedCareers.value = []
    saveToLocalStorage()
  }
  
  // 初始化
  loadFromLocalStorage()
  
  // 如果没有测评结果，添加测试数据
  if (assessmentResults.value.length === 0) {
    // 添加测试数据
    const testData: AssessmentResult[] = [
      {
        id: 'test-assessment-1',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
        summary: {
          score: 92,
          careerDirection: '软件开发工程师',
          matchDegree: '92%',
          characteristics: ['逻辑思维强', '善于解决问题', '持续学习能力强']
        },
        dimensions: {
          interest: {
            score: 90,
            highlights: ['编程开发', '技术研究', '系统设计']
          },
          ability: {
            score: 88,
            strengths: ['编程语言', '算法设计', '系统架构']
          },
          personality: {
            score: 85,
            traits: ['专注', '理性思考', '持续探索']
          }
        },
        recommendedCareers: [
          {
            id: 101,
            title: '软件开发工程师',
            matchDegree: 92,
            skills: ['Java', 'Python', '算法', '数据结构', '系统设计'],
            description: '负责软件产品的设计、开发、测试和维护工作，确保软件产品的质量和性能。',
            education_required: '本科及以上',
            experience_required: '3-5年',
            future_prospect: '发展前景广阔',
            salary: {
              min: 15000,
              max: 30000
            }
          },
          {
            id: 102,
            title: '全栈工程师',
            matchDegree: 85,
            skills: ['前端开发', '后端开发', '数据库', 'DevOps', '系统架构'],
            description: '同时负责网站或应用的前端和后端开发，具备全面的技术栈知识。',
            education_required: '本科及以上',
            experience_required: '3-5年',
            future_prospect: '需求稳定增长'
          },
          {
            id: 103,
            title: '算法工程师',
            matchDegree: 80,
            skills: ['算法设计', '机器学习', '数据挖掘', '数学建模'],
            description: '设计和优化算法，解决复杂的计算问题，提高系统性能和效率。',
            education_required: '硕士及以上',
            experience_required: '2-4年',
            future_prospect: '高速成长'
          }
        ]
      },
      {
        id: 'test-assessment-2',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14天前
        summary: {
          score: 88,
          careerDirection: '数据分析师',
          matchDegree: '88%',
          characteristics: ['数据敏感', '分析思维强', '细致严谨']
        },
        dimensions: {
          interest: {
            score: 90,
            highlights: ['数据分析', '统计研究', '可视化呈现']
          },
          ability: {
            score: 85,
            strengths: ['数据处理', '统计分析', '报告撰写']
          },
          personality: {
            score: 82,
            traits: ['条理性强', '注重细节', '善于沟通']
          }
        },
        recommendedCareers: [
          {
            id: 201,
            title: '数据分析师',
            matchDegree: 88,
            skills: ['SQL', 'Excel', 'Python', '数据可视化', '统计分析'],
            description: '通过收集、处理和分析数据，为业务决策提供数据支持和洞察。',
            education_required: '本科及以上',
            experience_required: '2-4年',
            future_prospect: '需求旺盛',
            salary: {
              min: 12000,
              max: 25000
            }
          },
          {
            id: 202,
            title: '商业智能分析师',
            matchDegree: 82,
            skills: ['BI工具', '数据仓库', 'SQL', '数据建模', '报表开发'],
            description: '设计和开发商业智能解决方案，帮助企业理解和利用数据进行决策。',
            education_required: '本科及以上',
            experience_required: '2-5年',
            future_prospect: '稳步增长'
          },
          {
            id: 203,
            title: '市场研究分析师',
            matchDegree: 76,
            skills: ['市场调研', '数据分析', '报告撰写', '消费者洞察'],
            description: '通过市场研究和数据分析，为企业的市场策略和产品开发提供建议。',
            education_required: '本科及以上',
            experience_required: '1-3年',
            future_prospect: '需求稳定'
          }
        ]
      },
      {
        id: 'test-assessment-3',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天前
        summary: {
          score: 85,
          careerDirection: '产品经理',
          matchDegree: '85%',
          characteristics: ['创新思维', '沟通协调能力强', '用户导向']
        },
        dimensions: {
          interest: {
            score: 86,
            highlights: ['产品设计', '用户体验', '市场分析']
          },
          ability: {
            score: 84,
            strengths: ['需求分析', '产品规划', '团队协作']
          },
          personality: {
            score: 85,
            traits: ['责任心强', '善于思考', '有同理心']
          }
        },
        recommendedCareers: [
          {
            id: 301,
            title: '产品经理',
            matchDegree: 85,
            skills: ['需求分析', '产品规划', '用户研究', '项目管理', '沟通协调'],
            description: '负责产品的规划、设计、研发和运营全生命周期管理，确保产品满足用户需求并实现商业目标。',
            education_required: '本科及以上',
            experience_required: '3-5年',
            future_prospect: '前景广阔',
            salary: {
              min: 15000,
              max: 35000
            }
          },
          {
            id: 302,
            title: 'UX设计师',
            matchDegree: 78,
            skills: ['用户研究', '交互设计', '原型设计', '用户测试'],
            description: '关注用户体验设计，通过研究用户需求和行为，创造易用、有吸引力的产品界面。',
            education_required: '本科及以上',
            experience_required: '2-4年',
            future_prospect: '发展迅速'
          },
          {
            id: 303,
            title: '项目经理',
            matchDegree: 75,
            skills: ['项目规划', '团队管理', '风险控制', '沟通协调'],
            description: '负责项目的规划、执行和控制，确保项目按时、按质、按预算完成。',
            education_required: '本科及以上',
            experience_required: '3-6年',
            future_prospect: '需求稳定'
          }
        ]
      },
      {
        id: 'test-assessment-4',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
        summary: {
          score: 94,
          careerDirection: '前端开发工程师',
          matchDegree: '94%',
          characteristics: ['视觉设计能力强', '用户体验敏感', '代码精益求精']
        },
        dimensions: {
          interest: {
            score: 95,
            highlights: ['UI/UX设计', '前端交互', '现代前端框架']
          },
          ability: {
            score: 92,
            strengths: ['HTML/CSS', 'JavaScript', '响应式设计', '前端框架']
          },
          personality: {
            score: 90,
            traits: ['创造性思维', '注重细节', '持续学习']
          }
        },
        recommendedCareers: [
          {
            id: 401,
            title: '前端开发工程师',
            matchDegree: 94,
            skills: ['HTML5', 'CSS3', 'JavaScript', 'Vue', 'React', '响应式设计'],
            description: '负责网站和应用程序的用户界面开发，确保良好的用户体验和视觉呈现。',
            education_required: '本科及以上',
            experience_required: '2-4年',
            future_prospect: '需求旺盛',
            salary: {
              min: 14000,
              max: 28000
            }
          },
          {
            id: 402,
            title: 'UI/UX设计师',
            matchDegree: 86,
            skills: ['UI设计', '交互设计', 'Figma', 'Adobe XD', '用户研究'],
            description: '设计用户界面和交互体验，创造直观、美观且易用的数字产品。',
            education_required: '本科及以上',
            experience_required: '2-4年',
            future_prospect: '发展迅速'
          },
          {
            id: 403,
            title: '移动端开发工程师',
            matchDegree: 82,
            skills: ['React Native', 'Flutter', 'iOS', 'Android', '移动UI设计'],
            description: '开发高性能、响应迅速的移动应用程序，为用户提供卓越的移动体验。',
            education_required: '本科及以上',
            experience_required: '2-5年',
            future_prospect: '需求稳定增长'
          }
        ]
      },
      {
        id: 'test-assessment-5',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
        summary: {
          score: 90,
          careerDirection: '系统架构师',
          matchDegree: '90%',
          characteristics: ['系统思维强', '技术视野广', '解决复杂问题能力突出']
        },
        dimensions: {
          interest: {
            score: 92,
            highlights: ['系统设计', '技术架构', '解决方案设计']
          },
          ability: {
            score: 90,
            strengths: ['系统架构', '技术选型', '性能优化', '分布式系统']
          },
          personality: {
            score: 88,
            traits: ['思维严谨', '善于规划', '全局视角']
          }
        },
        recommendedCareers: [
          {
            id: 501,
            title: '系统架构师',
            matchDegree: 90,
            skills: ['系统设计', '分布式系统', '云计算', '性能调优', '技术选型'],
            description: '设计和规划企业级系统架构，确保系统的可扩展性、可靠性和高性能。',
            education_required: '本科及以上',
            experience_required: '5-8年',
            future_prospect: '高端人才需求大',
            salary: {
              min: 25000,
              max: 50000
            }
          },
          {
            id: 502,
            title: '技术经理',
            matchDegree: 85,
            skills: ['团队管理', '技术规划', '项目管理', '技术决策'],
            description: '领导技术团队，制定技术战略和路线图，确保技术目标与业务目标一致。',
            education_required: '本科及以上',
            experience_required: '5-10年',
            future_prospect: '发展空间大'
          },
          {
            id: 503,
            title: 'DevOps工程师',
            matchDegree: 78,
            skills: ['CI/CD', '自动化部署', '容器技术', '监控系统', '云平台'],
            description: '负责构建和维护自动化的开发和部署流程，提高开发效率和系统稳定性。',
            education_required: '本科及以上',
            experience_required: '3-6年',
            future_prospect: '需求增长迅速'
          }
        ]
      },
      {
        id: 'test-assessment-6',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
        summary: {
          score: 91,
          careerDirection: '人工智能工程师',
          matchDegree: '91%',
          characteristics: ['数学能力强', '算法思维出色', '创新求知欲强']
        },
        dimensions: {
          interest: {
            score: 93,
            highlights: ['机器学习', '深度学习', '自然语言处理']
          },
          ability: {
            score: 89,
            strengths: ['算法实现', '模型训练', '数据预处理', 'Python编程']
          },
          personality: {
            score: 86,
            traits: ['研究导向', '耐心细致', '持续学习']
          }
        },
        recommendedCareers: [
          {
            id: 601,
            title: '人工智能工程师',
            matchDegree: 91,
            skills: ['机器学习', '深度学习', 'Python', 'TensorFlow', 'PyTorch', '数据挖掘'],
            description: '设计和实现人工智能算法和模型，解决复杂的业务问题和技术挑战。',
            education_required: '硕士及以上',
            experience_required: '2-5年',
            future_prospect: '发展前景广阔',
            salary: {
              min: 20000,
              max: 45000
            }
          },
          {
            id: 602,
            title: '机器学习工程师',
            matchDegree: 87,
            skills: ['机器学习算法', '特征工程', 'Python', '模型部署', '数据分析'],
            description: '开发和优化机器学习模型，将算法应用于实际业务场景中。',
            education_required: '硕士及以上',
            experience_required: '2-4年',
            future_prospect: '快速增长'
          },
          {
            id: 603,
            title: '自然语言处理工程师',
            matchDegree: 83,
            skills: ['NLP', '文本分析', '语义理解', '深度学习', 'BERT/GPT模型'],
            description: '专注于自然语言处理技术的研发和应用，实现机器对人类语言的理解和生成。',
            education_required: '硕士及以上',
            experience_required: '2-5年',
            future_prospect: '前景广阔'
          }
        ]
      }
    ]
    
    // 将测试数据添加到store中
    testData.forEach(result => {
      assessmentResults.value.push(result)
    })
    
    // 设置当前结果为最新的测试数据
    currentAssessmentResult.value = testData[0]
    
    // 设置推荐职业列表
    if (currentAssessmentResult.value.recommendedCareers) {
      recommendedCareers.value = currentAssessmentResult.value.recommendedCareers
    }
    
    // 保存到本地存储
    saveToLocalStorage()
    
    console.log('已加载测试数据:', assessmentResults.value.length, '条')
  }
  
  // 从API获取推荐结果并保存
  const fetchRecommendationsFromApi = async (userId?: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      // 获取推荐结果
      const result = await getRecommendations(userId)
      
      // 从不同类型的响应中安全地提取值
      const getValueSafely = (obj: any, path: string, defaultValue: any = null) => {
        const props = path.split('.')
        let value = obj
        for (const prop of props) {
          value = value && typeof value === 'object' ? value[prop] : undefined
          if (value === undefined) return defaultValue
        }
        return value
      }
      
      // 提取状态信息
      const status = getValueSafely(result, 'status', 'unknown')
      
      if (status === 'error') {
        error.value = getValueSafely(result, 'message', '获取推荐失败')
        return null
      }
      
      // 提取推荐列表
      const recommendations = getValueSafely(result, 'recommendations', [])
      if (recommendations && recommendations.length > 0) {
        // 转换为AssessmentResult格式
        const assessment: AssessmentResult = {
          id: getValueSafely(result, 'session_id', `session-${Date.now()}`),
          userId: userId ? String(userId) : undefined,
          timestamp: getValueSafely(result, 'timestamp', new Date().toISOString()),
          summary: {
            score: getValueSafely(result, 'total_match', 85),
            careerDirection: getValueSafely(recommendations, '0.title', ''),
            matchDegree: `${getValueSafely(recommendations, '0.match_degree', 85)}%`,
            characteristics: getValueSafely(result, 'user_traits', [])
          },
          dimensions: {
            interest: getValueSafely(result, 'assessment_scores.interest', {}),
            ability: getValueSafely(result, 'assessment_scores.ability', {}),
            personality: getValueSafely(result, 'assessment_scores.personality', {})
          },
          recommendedCareers: recommendations.map((career: any) => ({
            id: getValueSafely(career, 'id', 0),
            title: getValueSafely(career, 'title', '未知职业'),
            matchDegree: getValueSafely(career, 'match_degree', getValueSafely(career, 'matchDegree', 0)),
            skills: getValueSafely(career, 'required_skills', getValueSafely(career, 'skills', [])),
            description: getValueSafely(career, 'description', ''),
            education_required: getValueSafely(career, 'education_required', ''),
            experience_required: getValueSafely(career, 'experience_required', ''),
            future_prospect: getValueSafely(career, 'job_prospects', ''),
            salary: {
              min: getValueSafely(career, 'salary_min', 0),
              max: getValueSafely(career, 'salary_max', 0)
            }
          }))
        }
        
        // 保存测评结果
        saveAssessmentResult(assessment)
        
        // 返回处理后的结果
        return assessment
      } else if (status === 'processing' || status === 'waiting') {
        // 推荐生成中
        return {
          status: 'processing',
          progress: getValueSafely(result, 'progress', 0),
          message: getValueSafely(result, 'message', '推荐生成中...')
        }
      }
      
      return null
    } catch (err: any) {
      console.error('获取推荐失败:', err)
      error.value = err.message || '获取推荐失败，请稍后重试'
      return null
    } finally {
      loading.value = false
    }
  }
  
  return {
    // 状态
    loading,
    error,
    assessmentResults,
    currentAssessmentResult,
    recommendedCareers,
    
    // 计算属性
    hasAssessmentResults,
    latestAssessmentResult,
    
    // 方法
    saveAssessmentResult,
    getRecommendedCareers,
    clearAllData,
    fetchRecommendationsFromApi
  }
}) 