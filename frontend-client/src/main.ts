import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// 判断是否启用Mock
const enableMock = import.meta.env.VITE_USE_MOCK === 'true'

// 创建初始化函数
async function bootstrap() {
  // 如果启用Mock，先加载Mock服务
  if (enableMock) {
    console.log('启用Mock服务')
    try {
      await import('./mock/index')
      console.log('Mock服务加载成功')
    } catch (err) {
      console.error('Mock服务加载失败:', err)
    }
  }
  
  // 创建Vue应用实例
  const app = createApp(App)
  
  // 创建Pinia实例
  const pinia = createPinia()
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
}

// 启动应用
bootstrap().catch(err => {
  console.error('应用启动失败:', err)
})
