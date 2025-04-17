<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import NavBar from './components/NavBar.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import DebugPanel from './components/DebugPanel.vue';
import GlobalMessage from './components/GlobalMessage.vue';

// 声明全局加载标记
declare global {
  interface Window {
    __ROUTE_LOADING__: boolean;
  }
}

// 加载状态控制
const isLoading = ref(true);

// 调试面板控制 - 可根据环境变量或快捷键控制显示
const showDebugPanel = ref(import.meta.env.DEV || false);

// 监听全局加载状态
const checkGlobalLoadingState = () => {
  if (typeof window !== 'undefined' && window.__ROUTE_LOADING__ !== undefined) {
    isLoading.value = window.__ROUTE_LOADING__;
  }
};

// 清理函数参考
let keyDownHandler: ((e: KeyboardEvent) => void) | null = null;
let intervalId: number | null = null;

// 添加快捷键控制调试面板
onMounted(() => {
  // 初始加载完成后，隐藏加载状态
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
  
  // 监听全局加载状态
  intervalId = window.setInterval(checkGlobalLoadingState, 100);
  
  // Alt+D 快捷键切换调试面板
  keyDownHandler = (e: KeyboardEvent) => {
    if (e.altKey && e.key === 'd') {
      showDebugPanel.value = !showDebugPanel.value;
      console.log('调试面板:', showDebugPanel.value ? '已显示' : '已隐藏');
    }
  };
  
  window.addEventListener('keydown', keyDownHandler);
});

// 组件卸载时清理
onBeforeUnmount(() => {
  if (keyDownHandler) {
    window.removeEventListener('keydown', keyDownHandler);
  }
  
  if (intervalId !== null) {
    window.clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="app">
    <!-- 全局提示 -->
    <global-message />

    <!-- 调试面板 - 始终存在，默认折叠 -->
    <DebugPanel />

    <!-- Loading遮罩 -->
    <LoadingOverlay :loading="isLoading" />
    
    <NavBar />
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  padding-top: 60px; /* 导航栏的高度 */
  min-height: calc(100vh - 60px);
}

/* 淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
