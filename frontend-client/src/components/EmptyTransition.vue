<template>
  <div class="empty-transition">
    <!-- 此组件不显示任何内容，仅作为路由重定向前的过渡组件 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// 组件挂载时触发事件
onMounted(() => {
  console.log('空白过渡组件已加载');
});
</script>

<style scoped>
.empty-transition {
  display: none;
}
</style> 