import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: {
        title: '注册 - 高校职业推荐系统',
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
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title as string || '高校职业推荐系统'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 保存用户想要访问的页面
    userStore.setRedirectPath(to.fullPath)
    next('/login')
  } 
  // 检查是否是仅限游客的页面（如登录、注册）
  else if (to.meta.guest && userStore.isLoggedIn) {
    next('/')
  }
  else {
    next()
  }
})

export default router 