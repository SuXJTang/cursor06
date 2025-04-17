declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  import { RouteRecordRaw } from 'vue-router'
  interface Router {
    push: (location: RouteLocationRaw) => Promise<NavigationFailure | void | undefined>
  }
}

declare module 'element-plus' {
  import { ElMessage } from 'element-plus'
  export { ElMessage }
}

declare module '@element-plus/icons-vue' {
  import { Component } from 'vue'
  const Search: Component
  const Folder: Component
  const Document: Component
  const Tools: Component
  const WarningFilled: Component
  const Promotion: Component
  const Odometer: Component
  const Calendar: Component
  export { Search, Folder, Document, Tools, WarningFilled, Promotion, Odometer, Calendar }
} 