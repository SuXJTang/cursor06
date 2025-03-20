<template>
  <div class="user-center-container">
    <el-row :gutter="20">
      <!-- 侧边导航菜单 -->
      <el-col :span="5">
        <el-card class="menu-card">
          <div class="user-info-brief">
            <template v-if="authStore.userInfo?.avatar_url">
              <el-avatar :size="64" :src="authStore.userInfo.avatar_url" />
            </template>
            <template v-else>
              <el-avatar :size="64" :style="defaultAvatarStyle">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
            </template>
            <div class="username">
              {{ authStore.userInfo?.username || '用户' }}
            </div>
          </div>
          
          <el-menu
            :default-active="activeMenu"
            class="user-center-menu"
            router
          >
            <el-menu-item index="/user-center/info">
              <el-icon><InfoFilled /></el-icon>
              <span>基本信息</span>
            </el-menu-item>
            <el-menu-item index="/user-center/profile">
              <el-icon><UserFilled /></el-icon>
              <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="/user-center/recommend">
              <el-icon><Star /></el-icon>
              <span>职业推荐</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      
      <!-- 内容区域 -->
      <el-col :span="19">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { InfoFilled, User, UserFilled, DataAnalysis, Star } from '@element-plus/icons-vue'

const route = useRoute()
const authStore = useAuthStore()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

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
</script>

<style scoped>
.user-center-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.menu-card {
  height: 100%;
}

.user-info-brief {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.username {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
}

.user-center-menu {
  border-right: none;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-menu-item .el-icon {
  margin-right: 8px;
}
</style> 