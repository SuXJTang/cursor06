/// <reference types="vite/client" />

// 环境变量接口
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_USE_MOCK: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 声明Vue模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明项目中的模块
declare module '@/stores/auth' {
  import { defineStore } from 'pinia'
  import type { UserInfo, LoginParams, RegisterParams } from '@/api/auth'
  
  export const useAuthStore: ReturnType<typeof defineStore>
  export interface AuthState {
    token: string
    userInfo: UserInfo | null
    loading: boolean
    tokenValidated: boolean
    loginTime: number
  }
  
  export default useAuthStore
}

declare module '@/stores/user' {
  import { defineStore } from 'pinia'
  export const useUserStore: ReturnType<typeof defineStore>
  export default useUserStore
}

declare module '@/stores/profile' {
  import { defineStore } from 'pinia'
  export const useProfileStore: ReturnType<typeof defineStore>
  export default useProfileStore
} 