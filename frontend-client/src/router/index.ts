// 添加全局类型声明
declare global {
  interface Window {
    __ROUTE_LOADING__?: boolean;
  }
}

import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
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
import ApiTestPage from '@/views/ApiTestPage.vue'
import EmptyTransition from '@/components/EmptyTransition.vue'
import { defineAsyncComponent } from 'vue'

// 异步加载职业详情页
const CareerDetail = defineAsyncComponent(() => import('@/views/CareerDetail.vue'))
// 异步加载开发工具页
const DevTools = defineAsyncComponent(() => import('@/views/DevTools.vue'))

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
    path: '/career',
    name: 'careerRedirect',
    component: EmptyTransition,
    beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      // 直接跳转到登录页面，并带上重定向参数
      next({ 
        path: '/login', 
        query: { redirect: '/career-library' },
        replace: true // 使用replace模式避免历史记录
      });
    }
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
    meta: { 
      requiresAuth: true,
      title: '职业库 - 高校职业推荐系统'
    }
  },
  {
    path: '/career-library/list',
    name: 'careerList',
    redirect: { name: 'careerLibrary' }
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
    path: '/career/:id',
    name: 'careerDetail',
    component: CareerDetail,
    meta: { 
      requiresAuth: true,
      title: '职业详情 - 高校职业推荐系统'
    }
  },
  {
    path: '/api-test',
    name: 'apiTest',
    component: ApiTestPage,
    meta: { 
      requiresAuth: true,
      title: 'API测试 - 高校职业推荐系统'
    }
  },
  {
    path: '/dev-tools',
    name: 'devTools',
    component: DevTools,
    meta: { 
      title: '开发工具 - 高校职业推荐系统',
      // 只在开发环境下启用这个路由
      beforeEnter: (_to, _from, next) => {
        if (import.meta.env.DEV) {
          next()
        } else {
          next('/not-found')
        }
      }
    }
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

// 优化路由守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 全局加载状态控制 - 先设置为true，避免闪烁
  if (typeof window !== 'undefined') {
    // 设置一个全局加载标记，App组件会读取这个标记
    window.__ROUTE_LOADING__ = true;
    document.body.classList.add('route-loading');
  }
  
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = to.meta.title as string || '高校职业推荐系统'
  
  console.log('路由守卫检查:', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token
  })
  
  // 快速检查 - 如果访问需要认证的页面且未登录，立即重定向到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('需要认证但未登录，重定向到登录页')
    // 保存尝试访问的页面，登录后可以重定向回来
    const redirectPath = to.fullPath !== '/login' ? to.fullPath : '/'
    // 返回前先清理加载状态标记
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__ROUTE_LOADING__ = false;
        document.body.classList.remove('route-loading');
      }
    }, 200); // 增加延迟确保加载状态可见
    return next({ 
      path: '/login', 
      query: { redirect: redirectPath },
      replace: true // 使用replace避免导航历史堆积
    })
  } 
  
  // 检查是否是仅限游客的页面（如登录）
  if (to.meta.guest && authStore.isAuthenticated) {
    console.log('已登录用户尝试访问游客页面，重定向到首页')
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__ROUTE_LOADING__ = false;
        document.body.classList.remove('route-loading');
      }
    }, 100);
    return next('/')
  }
  
  // 如果有token但未登录，异步验证token
  if (authStore.token && !authStore.isAuthenticated) {
    console.log('有令牌但未验证，尝试验证...')
    try {
      await authStore.getUserInfo()
      console.log('令牌验证结果:', authStore.isAuthenticated)
      
      // 验证成功后，检查当前路由要求
      if (authStore.isAuthenticated) {
        console.log('令牌验证成功，继续导航')
        // 如果是游客页面且已登录，重定向到首页
        if (to.meta.guest) {
          console.log('已登录用户访问游客页面，重定向到首页')
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.__ROUTE_LOADING__ = false;
              document.body.classList.remove('route-loading');
            }
          }, 100);
          return next('/')
        }
      }
    } catch (error) {
      console.error('令牌验证失败:', error)
      // 验证失败时清除认证状态
      authStore.logout()
      
      // 如果目标路由需要认证，则重定向到登录页
      if (to.meta.requiresAuth) {
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.__ROUTE_LOADING__ = false;
            document.body.classList.remove('route-loading');
          }
        }, 100);
        return next({ 
          path: '/login', 
          query: { redirect: to.fullPath } 
        })
      }
    }
  }
  
  // 导航完成后清理加载状态
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.__ROUTE_LOADING__ = false;
      document.body.classList.remove('route-loading');
    }
  }, 100);
  
  // 正常导航
  next()
})

export default router 