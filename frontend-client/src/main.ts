import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import App from './App.vue'

// 全局样式导入
import './styles/main.css'

// 全局组件和插件导入
import ElementPlus from 'element-plus'
// 这行注释告诉TypeScript忽略下面一行的类型错误
// @ts-ignore
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 保存路由实例到全局变量
if (typeof window !== 'undefined') {
  window.__vueRouter = router;
}

const app = createApp(App)

// 创建Pinia实例并启用持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 导入认证存储
const { useAuthStore } = await import('./stores/auth')
const { useProfileStore } = await import('./stores/profile')

// 使用ElementPlus
app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000
})

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 先验证token，再挂载应用
console.log('应用启动，检查认证状态...')
try {
  // 初始化认证状态
  const authStore = useAuthStore(pinia)
  const profileStore = useProfileStore(pinia)
  
  // 如果有token，尝试获取用户信息
  if (authStore.token) {
    await authStore.getUserInfo()
    
    // 如果认证成功，初始化用户资料
    if (authStore.isAuthenticated) {
      try {
        // 加载本地存储的资料
        profileStore.loadFromLocalStorage()
        // 初始化用户资料（如果本地没有会从API获取）
        await profileStore.initUserProfile()
      } catch (error) {
        console.error('初始化用户资料失败:', error)
      }
    }
  }
} catch (err) {
  console.error('Token验证失败:', err)
  // 验证失败时清除token
  const authStore = useAuthStore(pinia)
  authStore.logout()
} finally {
  // 设置路由
  app.use(router)
  
  // 挂载应用
  app.mount('#app')
  console.log('应用挂载完成')
}

// 类型声明
declare global {
  interface Window {
    __vueRouter: typeof router;
    appNavigation: {
      goToCareerLibrary: () => void;
      reloadCurrentPage: () => void;
    };
  }
}
