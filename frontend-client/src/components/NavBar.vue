<template>
  <div class="nav-container">
    <div class="nav-content">
      <!-- Logo 区域 -->
      <router-link to="/" class="nav-logo">
        <el-icon :size="32" class="logo-icon"><School /></el-icon>
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
        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-avatar 
              :size="32" 
              :src="userStore.userInfo?.avatar || defaultAvatarUrl" 
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { School } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 导航菜单项
const menuItems = [
  { name: '首页', path: '/' },
  { name: '职业测评', path: '/assessment' },
  { name: '职业库', path: '/career-library' },
  { name: '职业热力图', path: '/career-heat' }
]

// 默认头像
const defaultAvatarUrl = '/default-avatar.png'

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
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