<template>
  <div class="loading-overlay" v-if="loading">
    <div class="loading-spinner">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoadingOverlay'
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loading } from '@element-plus/icons-vue';

// 组件属性
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner .el-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 12px;
}

.loading-spinner p {
  color: var(--el-text-color-primary);
  font-size: 16px;
  margin: 0;
}
</style> 