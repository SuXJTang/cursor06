<template>
  <div class="api-test-page">
    <h1>API测试页面</h1>
    
    <div class="test-section">
      <h2>测试职业分类API</h2>
      
      <div class="form-group">
        <label for="categoryId">分类ID:</label>
        <input 
          id="categoryId" 
          v-model="categoryId" 
          placeholder="输入分类ID" 
          class="input"
        />
      </div>
      
      <div class="form-group">
        <button @click="testAPI" :disabled="loading" class="button">
          {{ loading ? '请求中...' : '测试API' }}
        </button>
      </div>
      
      <div v-if="loading" class="loading">
        正在获取数据...
      </div>
      
      <div v-if="error" class="error-message">
        <h3>请求错误:</h3>
        <pre>{{ error }}</pre>
      </div>
      
      <div v-if="result" class="result">
        <h3>API结果:</h3>
        <div class="stats">
          <p>职业数量: {{ result.careers ? result.careers.length : 0 }}</p>
          <p>总数: {{ result.total || 0 }}</p>
          <p>页数: {{ result.pages || 1 }}</p>
        </div>
        
        <div v-if="result.careers && result.careers.length > 0" class="careers-list">
          <h4>职业列表 (前5个):</h4>
          <div 
            v-for="(career, index) in result.careers.slice(0, 5)" 
            :key="career.id" 
            class="career-item"
          >
            <div class="career-title">{{ index + 1 }}. {{ career.title }}</div>
            <div class="career-info">ID: {{ career.id }}</div>
          </div>
        </div>
        
        <div v-else class="empty-result">
          没有找到职业数据
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { request } from '@/api/request';

// 状态
const categoryId = ref('1860f037-330d-4019-8b3b-4ddd7bc62299'); // 默认使用测试ID
const result = ref(null);
const loading = ref(false);
const error = ref(null);

// 测试API
const testAPI = async () => {
  if (!categoryId.value) {
    error.value = '请输入分类ID';
    return;
  }
  
  loading.value = true;
  result.value = null;
  error.value = null;
  
  try {
    // 调用新的同步API
    const response = await request.get(`/api/v1/careers-sync/category/${categoryId.value}`, {
      params: {
        skip: 0,
        limit: 20
      }
    });
    
    result.value = response;
    console.log('API测试结果:', response);
  } catch (err) {
    console.error('API测试失败:', err);
    error.value = err.message || JSON.stringify(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.api-test-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  margin-bottom: 20px;
}

.test-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading {
  margin: 20px 0;
  color: #666;
}

.error-message {
  margin: 20px 0;
  padding: 15px;
  background-color: #ffebee;
  border-left: 5px solid #f44336;
  border-radius: 4px;
}

.result {
  margin: 20px 0;
}

.stats {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
}

.careers-list {
  margin-top: 15px;
}

.career-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.career-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.career-info {
  color: #666;
  font-size: 14px;
}

.empty-result {
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style> 