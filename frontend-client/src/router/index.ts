import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: '首页 - 高校职业推荐系统',
        requiresAuth: false // 首页不需要登录
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录 - 高校职业推荐系统',
        guest: true
      }
    },
    {
      path: '/assessment',
      name: 'Assessment',
      component: () => import('@/views/Assessment.vue'),
      meta: {
        title: '职业测评 - 高校职业推荐系统',
        requiresAuth: true
      }
    },
    {
      path: '/careers',
      name: 'Careers',
      component: () => import('@/views/Careers.vue'),
      meta: {
        title: '职业库 - 高校职业推荐系统',
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: {
        requiresAuth: true,
        title: '个人中心'
      }
    },
    {
      path: '/career-library',
      name: 'CareerLibrary',
      component: () => import('@/views/CareerLibrary.vue'),
      meta: {
        title: '职业库',
        requiresAuth: true
      }
    },
    {
      path: '/career-heat',
      name: 'CareerHeat',
      component: () => import('@/views/CareerHeat.vue'),
      meta: {
        title: '职业热力',
        requiresAuth: true
      }
    },
    {
      path: '/result',
      name: 'Result',
      component: () => import('@/views/Result.vue'),
      meta: {
        title: '测评结果 - 高校职业推荐系统',
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: '404 - 页面未找到'
      }
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = to.meta.title as string || '高校职业推荐系统'
  
  console.log('路由守卫检查:', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token
  })
  
  // 如果有token但未验证，先验证token
  if (authStore.token && !authStore.tokenValidated) {
    console.log('有token但未验证，尝试验证...')
    try {
      await authStore.fetchUserInfo()
    } catch (error) {
      console.error('Token验证失败:', error)
      // 验证失败时清除认证状态
      authStore.clearAuth()
    }
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('需要认证但未登录，重定向到登录页')
    next('/login')
  } 
  // 检查是否是仅限游客的页面（如登录）
  else if (to.meta.guest && authStore.isAuthenticated) {
    console.log('已登录用户尝试访问游客页面，重定向到首页')
    next('/')
  }
  else {
    next()
  }
})

export default router 