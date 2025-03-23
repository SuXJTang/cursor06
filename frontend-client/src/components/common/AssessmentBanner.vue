<template>
  <div class="assessment-banner">
    <div class="banner-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
    <div class="banner-content">
      <h1>职业能力测评</h1>
      <p>通过科学的评测方式，帮助您了解自己的职业倾向与就业方向</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AssessmentBanner'
})
</script>

<style scoped>
.assessment-banner {
  position: relative;
  background: linear-gradient(135deg, #409eff, #67c23a);
  padding: 40px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.banner-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  left: 10%;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 20px;
  left: 30%;
  background: rgba(255, 255, 255, 0.15);
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.banner-content h1 {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 600;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}
</style> 