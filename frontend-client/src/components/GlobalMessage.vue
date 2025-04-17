<template>
  <div class="global-message-container">
    <transition-group name="message-fade">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="global-message"
        :class="[`message-${msg.type}`]"
      >
        <div class="message-content">
          <i class="message-icon" :class="getIconClass(msg.type)"></i>
          <span>{{ msg.content }}</span>
        </div>
        <div class="message-close" @click="removeMessage(msg.id)">×</div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlobalMessage'
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Message {
  id: number;
  content: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration: number;
}

const messages = ref<Message[]>([]);
let messageId = 0;

// 获取消息类型对应的图标类名
const getIconClass = (type: string): string => {
  switch (type) {
    case 'success': return 'icon-success';
    case 'warning': return 'icon-warning';
    case 'error': return 'icon-error';
    case 'info': 
    default: return 'icon-info';
  }
};

// 添加消息
const addMessage = (content: string, type: 'success' | 'warning' | 'error' | 'info' = 'info', duration = 3000) => {
  const id = messageId++;
  messages.value.push({ id, content, type, duration });
  
  if (duration > 0) {
    setTimeout(() => {
      removeMessage(id);
    }, duration);
  }
  
  return id;
};

// 移除消息
const removeMessage = (id: number) => {
  const index = messages.value.findIndex(msg => msg.id === id);
  if (index !== -1) {
    messages.value.splice(index, 1);
  }
};

// 导出全局方法
defineExpose({
  addMessage,
  removeMessage
});

// 设置全局消息方法
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.$message = {
      success: (content: string, duration = 3000) => addMessage(content, 'success', duration),
      warning: (content: string, duration = 3000) => addMessage(content, 'warning', duration),
      error: (content: string, duration = 3000) => addMessage(content, 'error', duration),
      info: (content: string, duration = 3000) => addMessage(content, 'info', duration)
    };
  }
});

// 为window添加$message类型声明
declare global {
  interface Window {
    $message?: {
      success: (content: string, duration?: number) => number;
      warning: (content: string, duration?: number) => number;
      error: (content: string, duration?: number) => number;
      info: (content: string, duration?: number) => number;
    };
  }
}
</script>

<style scoped>
.global-message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  width: 100%;
  max-width: 500px;
}

.global-message {
  margin-bottom: 10px;
  padding: 10px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  pointer-events: auto;
  transition: all 0.3s;
  background-color: #fff;
}

.message-content {
  display: flex;
  align-items: center;
}

.message-icon {
  margin-right: 8px;
  font-size: 16px;
}

.message-close {
  margin-left: 16px;
  cursor: pointer;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.message-close:hover {
  color: rgba(0, 0, 0, 0.65);
}

.message-success {
  border-left: 4px solid #52c41a;
}

.message-warning {
  border-left: 4px solid #faad14;
}

.message-error {
  border-left: 4px solid #ff4d4f;
}

.message-info {
  border-left: 4px solid #1890ff;
}

.icon-success::before {
  content: "✓";
  color: #52c41a;
}

.icon-warning::before {
  content: "⚠";
  color: #faad14;
}

.icon-error::before {
  content: "✕";
  color: #ff4d4f;
}

.icon-info::before {
  content: "ℹ";
  color: #1890ff;
}

/* 过渡动画效果 */
.message-fade-enter-active, 
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style> 