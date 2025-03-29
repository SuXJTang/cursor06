import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserInfo from '@/views/UserInfo.vue'
import UserProfile from '@/views/UserProfile.vue'
import UserCenter from '@/views/UserCenter.vue'
import NotFound from '@/views/NotFound.vue'
import Assessment from '@/views/Assessment.vue'
import CareerLibrary from '@/views/CareerLibrary.vue'
import Careers from '@/views/Careers.vue'
import CareerHeat from '@/views/CareerHeat.vue'
import CareerRecommend from '@/views/CareerRecommend.vue'
import FavoriteCareers from '@/views/FavoriteCareers.vue'
import Result from '@/views/Result.vue'
import Feedback from '@/views/Feedback.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/user-info',
    name: 'userInfo',
    component: UserInfo,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-profile',
    name: 'userProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-center',
    name: 'userCenter',
    component: UserCenter,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'userCenterInfo' }
      },
      {
        path: 'info',
        name: 'userCenterInfo',
        component: UserInfo,
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: UserProfile,
        meta: { requiresAuth: true }
      },
      {
        path: 'recommend',
        name: 'userRecommend',
        component: CareerRecommend,
        meta: { requiresAuth: true }
      },
      {
        path: 'favorites',
        name: 'userFavorites',
        component: FavoriteCareers,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/assessment',
    name: 'assessment',
    component: Assessment,
    meta: { requiresAuth: true }
  },
  {
    path: '/careers',
    name: 'careers',
    component: Careers,
    meta: { requiresAuth: true }
  },
  {
    path: '/career-library',
    name: 'careerLibrary',
    component: CareerLibrary,
    meta: { requiresAuth: true }
  },
  {
    path: '/career-heat',
    name: 'careerHeat',
    component: CareerHeat,
    meta: { requiresAuth: true }
  },
  {
    path: '/career-recommend',
    name: 'careerRecommend',
    component: CareerRecommend,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorite-careers',
    name: 'favoriteCareers',
    component: FavoriteCareers,
    meta: { requiresAuth: true }
  },
  {
    path: '/result',
    name: 'result',
    component: Result,
    meta: { requiresAuth: true }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: Feedback,
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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
      console.log('令牌验证结果:', authStore.isAuthenticated)
      if (authStore.isAuthenticated) {
        console.log('令牌验证成功，继续导航')
        // 如果是游客页面且已登录，重定向到首页
        if (to.meta.guest && authStore.isAuthenticated) {
          console.log('已登录用户访问游客页面，重定向到首页')
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