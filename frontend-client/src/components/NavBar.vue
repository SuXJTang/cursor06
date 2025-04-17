<template>
  <div class="nav-container">
    <div class="nav-content">
      <!-- Logo 区域 -->
      <router-link to="/" class="nav-logo">
        <el-icon :size="32" class="logo-icon">
          <School />
        </el-icon>
        <span class="logo-text">高校职业推荐系统</span>
      </router-link>

      <!-- 导航菜单 -->
      <div class="nav-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- 用户区域 -->
      <div class="nav-user">
        <template v-if="authStore.isAuthenticated">
          <el-dropdown trigger="click" @command="handleCommand">
            <template v-if="showDefaultAvatar">
              <el-avatar :size="32" :style="defaultAvatarStyle">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
            </template>
            <template v-else>
              <el-avatar :size="32" :src="authStore.userInfo?.avatar_url" />
            </template>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="userCenter">
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleLogin">
            登录
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { School, UserFilled } from '@element-plus/icons-vue'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 导航菜单项
const menuItems = [
  { name: '首页', path: '/' },
  { name: '职业测评', path: '/assessment' },
  { name: '职业库', path: '/career-library' },
  { name: '职业热力图', path: '/career-heat' }
]

// 根据用户名生成颜色
const getRandomColor = (username: string) => {
  // 预定义的一组美观颜色
  const colors = [
    '#409EFF', // 蓝色（主题色）
    '#67C23A', // 绿色（成功色）
    '#E6A23C', // 黄色（警告色）
    '#F56C6C', // 红色（危险色）
    '#909399', // 灰色（信息色）
    '#8e44ad', // 紫色
    '#16a085', // 青绿色
    '#d35400', // 橙色
    '#2c3e50', // 深蓝灰色
    '#27ae60'  // 翠绿色
  ]
  
  // 如果没有用户名，返回主题色
  if (!username) return colors[0]
  
  // 根据用户名生成一个索引
  let sum = 0
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i)
  }
  return colors[sum % colors.length]
}

// 计算得到的默认头像样式
const defaultAvatarStyle = computed(() => {
  const color = getRandomColor(authStore.userInfo?.username || '')
  return {
    backgroundColor: color,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

// 是否显示默认头像
const showDefaultAvatar = computed(() => {
  return !authStore.userInfo?.avatar_url || authStore.userInfo.avatar_url === ''
})

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'userCenter':
      router.push('/user-center')
      break
    case 'logout':
      authStore.logout()
      router.push('/')
      break
  }
}

// 处理登录按钮点击
const handleLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.nav-content {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
}

.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #303133;
  padding-left: 24px;
}

.logo-icon {
  color: #409EFF;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.menu-item {
  text-decoration: none;
  color: #606266;
  font-size: 15px;
  padding: 0 4px;
  line-height: 60px;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.menu-item:hover {
  color: #409EFF;
}

.menu-item.active {
  color: #409EFF;
  border-bottom-color: #409EFF;
}

.nav-user {
  padding-right: 24px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 16px;
  }

  .logo-text {
    display: none;
  }

  .nav-menu {
    gap: 16px;
  }

  .menu-item {
    font-size: 14px;
    padding: 0;
  }
}
</style> 