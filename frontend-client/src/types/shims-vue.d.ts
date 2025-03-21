// 声明vue文件模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明vue-cropper模块
declare module 'vue-cropper' {
  import { App, Plugin } from 'vue'
  
  export const VueCropper: any
  
  const _default: {
    install: (app: App) => void
  } & Plugin
  
  export default _default
}

// 扩展ImportMeta接口
interface ImportMeta {
  env: Record<string, string>
}

declare module '@element-plus/icons-vue' {
  import type { Component } from 'vue'
  export const Plus: Component
  export const UserFilled: Component
  export const InfoFilled: Component
  export const User: Component
  export const DataAnalysis: Component
  export const School: Component
  // 添加其他可能需要的图标
}

declare module 'element-plus' {
  export const ElMessage: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
} 