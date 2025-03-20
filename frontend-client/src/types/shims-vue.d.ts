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

declare module 'vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  
  export const ref: any
  export const reactive: any
  export const computed: any
  export const watch: any
  export const onMounted: any
  export const onUnmounted: any
  export const defineComponent: any
  export const defineProps: any
  export const defineEmits: any
  export const toRefs: any
  export const toRef: any
  export const provide: any
  export const inject: any
  export const nextTick: any
  export type Component = any
  
  export default component
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