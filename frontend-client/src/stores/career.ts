import { defineStore } from 'pinia'

// 定义职业数据类型
interface Career {
  id: string | number
  categoryId: string
  careerName: string
  stage?: string
  [key: string]: any // 允许任何其他属性
}

interface CacheState {
  careersByCategory: Record<string, Career[]>
  lastFetchTime: Record<string, number>
  cacheTTL: number // 缓存生存时间（毫秒）
}

export const useCareerStore = defineStore({
  id: 'career',
  state: (): CacheState => ({
    careersByCategory: {}, // 按类别存储职业数据
    lastFetchTime: {}, // 记录每个类别最后获取数据的时间
    cacheTTL: 30 * 60 * 1000 // 默认缓存30分钟
  }),
  
  getters: {
    // 检查特定类别的缓存是否有效
    isCacheValid: (state) => (categoryId: string): boolean => {
      const lastFetch = state.lastFetchTime[categoryId]
      if (!lastFetch) return false
      
      const now = Date.now()
      return now - lastFetch < state.cacheTTL
    }
  },
  
  actions: {
    // 更新职业数据
    updateCareers(categoryId: string, careers: Career[]) {
      this.careersByCategory[categoryId] = [...careers]
      this.lastFetchTime[categoryId] = Date.now()
      
      console.log(`[Career Store] 更新了类别 ${categoryId} 的职业数据，共 ${careers.length} 条`)
    },
    
    // 获取职业数据，如果缓存有效则返回缓存数据，否则返回null
    getCareers(categoryId: string): Career[] | null {
      // 特殊类别处理：软件工程师分类(ID 33)总是从服务器获取
      if (categoryId === '33') {
        return null
      }
      
      if (!this.isCacheValid(categoryId)) {
        console.log(`[Career Store] 类别 ${categoryId} 的缓存已过期或不存在`)
        return null
      }
      
      const careers = this.careersByCategory[categoryId]
      if (!careers || careers.length === 0) {
        console.log(`[Career Store] 类别 ${categoryId} 没有缓存数据`)
        return null
      }
      
      console.log(`[Career Store] 从缓存返回类别 ${categoryId} 的职业数据，共 ${careers.length} 条`)
      return careers
    },
    
    // 清除所有缓存
    clearCache() {
      console.log('[Career Store] 清除所有职业数据缓存')
      this.careersByCategory = {}
      this.lastFetchTime = {}
    },
    
    // 清除特定类别的缓存
    clearCategoryCache(categoryId: string) {
      console.log(`[Career Store] 清除类别 ${categoryId} 的职业数据缓存`)
      if (this.careersByCategory[categoryId]) {
        delete this.careersByCategory[categoryId]
        delete this.lastFetchTime[categoryId]
      }
    },
    
    // 设置缓存TTL（毫秒）
    setCacheTTL(ttl: number) {
      if (ttl > 0) {
        this.cacheTTL = ttl
        console.log(`[Career Store] 设置缓存TTL为 ${ttl} 毫秒`)
      }
    }
  },
  
  persist: {
    key: 'career-store',
    storage: localStorage
  }
}) 