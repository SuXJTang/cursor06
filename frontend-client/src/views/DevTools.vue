<template>
  <div class="dev-tools">
    <h1>开发工具</h1>
    <div class="tool-container">
      <DevProgressMonitor />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 异步加载组件以避免在生产环境中包含它
const DevProgressMonitor = defineAsyncComponent(() =>
  import('../components/DevProgressMonitor.vue')
)
</script>

<style scoped lang="scss">
.dev-tools {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    margin-bottom: 20px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .tool-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}
</style> 