<script setup lang="ts">
// 默认布局组件
</script>

<template>
  <div class="layout-default">
    <el-container>
      <el-header>
        <h1>高校职业推荐系统</h1>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <p>&copy; 2024 高校职业推荐系统</p>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.layout-default {
  min-height: 100vh;
}

.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
  text-align: center;
}

.el-footer {
  background-color: #f5f7fa;
  color: #909399;
  text-align: center;
  line-height: 60px;
}

.el-main {
  padding: 20px;
  background-color: #ffffff;
}
</style> 