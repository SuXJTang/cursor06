<template>
  <div class="progress-bar">
    <div class="progress-info" v-if="showInfo">
      <span class="progress-text">{{ text }}</span>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>
    <el-progress 
      :percentage="percentage"
      :status="status"
      :stroke-width="strokeWidth"
      :show-text="false"
      :color="color"
    />
    <div class="progress-message" v-if="message">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

// 定义props
const props = defineProps({
  percentage: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100
  },
  status: {
    type: String as PropType<'success' | 'exception' | 'warning' | ''>,
    default: ''
  },
  strokeWidth: {
    type: Number,
    default: 6
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  color: {
    type: [String, Array, Function] as PropType<string | string[] | ((percentage: number) => string)>,
    default: ''
  }
})

// 计算属性
const normalizedPercentage = computed(() => {
  return Math.min(100, Math.max(0, props.percentage))
})
</script>

<style scoped lang="scss">
.progress-bar {
  width: 100%;
  padding: 8px;

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #606266;

    .progress-percentage {
      font-weight: 500;
    }
  }

  .progress-message {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    text-align: center;
  }
}
</style> 