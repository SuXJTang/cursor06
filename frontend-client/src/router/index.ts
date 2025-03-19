import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

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
      path: '/user-center',
      name: 'UserCenter',
      component: () => import('@/views/UserCenter.vue'),
      meta: {
        requiresAuth: true,
        title: '个人中心'
      },
      redirect: '/user-center/info',
      children: [
        {
          path: 'info',
          name: 'UserInfo',
          component: () => import('@/views/UserInfo.vue'),
          meta: {
            requiresAuth: true,
            title: '基本信息 - 个人中心'
          }
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: () => import('@/views/UserProfile.vue'),
          meta: {
            requiresAuth: true,
            title: '个人资料 - 个人中心'
          }
        },
        {
          path: 'recommend',
          name: 'CareerRecommend',
          component: () => import('@/views/CareerRecommend.vue'),
          meta: {
            requiresAuth: true,
            title: '职业推荐 - 个人中心'
          }
        }
      ]
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
  
  // 如果有token但未登录，先验证token
  if (authStore.token && !authStore.isAuthenticated) {
    console.log('有令牌但未验证，尝试验证...')
    try {
      await authStore.getUserInfo()
      // 验证成功后，继续当前导航
      if (authStore.isAuthenticated) {
        console.log('令牌验证成功，继续导航')
        // 如果是游客页面且已登录，重定向到首页
        if (to.meta.guest && authStore.isAuthenticated) {
          return next('/')
        }
        return next()
      }
    } catch (error) {
      console.error('令牌验证失败:', error)
      // 验证失败时清除认证状态
      authStore.logout()
    }
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('需要认证但未登录，重定向到登录页')
    // 保存尝试访问的页面，登录后可以重定向回来
    const redirectPath = to.fullPath !== '/login' ? to.fullPath : '/'
    next({ path: '/login', query: { redirect: redirectPath } })
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