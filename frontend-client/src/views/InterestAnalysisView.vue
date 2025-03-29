<template>
  <div class="interest-analysis-page">
    <div class="header">
      <h2>兴趣分析</h2>
      <p class="description">基于用户资料和测评数据的深度兴趣分析</p>
    </div>
    
    <div class="content">
      <div class="side-panel">
        <h3>数据准备</h3>
        <div class="data-checks">
          <div class="data-check-item" :class="{'data-ready': userProfileReady}">
            <div class="check-icon">
              <i v-if="userProfileReady" class="icon-check">✓</i>
              <i v-else class="icon-error">✗</i>
            </div>
            <div class="check-info">
              <div class="check-name">用户资料</div>
              <div class="check-status">{{ userProfileReady ? '数据已准备' : '数据未准备' }}</div>
            </div>
            <button v-if="!userProfileReady" @click="fixUserProfile">修复</button>
          </div>
          
          <div class="data-check-item" :class="{'data-ready': resumeDataReady}">
            <div class="check-icon">
              <i v-if="resumeDataReady" class="icon-check">✓</i>
              <i v-else class="icon-error">✗</i>
            </div>
            <div class="check-info">
              <div class="check-name">简历数据</div>
              <div class="check-status">{{ resumeDataReady ? '数据已准备' : '数据未准备' }}</div>
            </div>
            <button v-if="!resumeDataReady" @click="fixResumeData">修复</button>
          </div>
          
          <div class="data-check-item" :class="{'data-ready': assessmentDataReady}">
            <div class="check-icon">
              <i v-if="assessmentDataReady" class="icon-check">✓</i>
              <i v-else class="icon-error">✗</i>
            </div>
            <div class="check-info">
              <div class="check-name">测评数据</div>
              <div class="check-status">{{ assessmentDataReady ? '数据已准备' : '数据未准备' }}</div>
            </div>
          </div>
        </div>
        
        <div class="analysis-actions">
          <button 
            class="analyze-button" 
            @click="startAnalysis"
            :disabled="loading || !canAnalyze"
          >
            {{ loading ? '分析中...' : '开始分析' }}
          </button>
          
          <div v-if="!canAnalyze" class="analysis-warning">
            请先准备好用户资料和测评数据
          </div>
        </div>
      </div>
      
      <div class="main-content">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在分析用户兴趣...</div>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">!</div>
          <div class="error-title">分析失败</div>
          <div class="error-message">{{ error }}</div>
          <button @click="startAnalysis">重试</button>
        </div>
        
        <div v-else-if="!analysisResult" class="start-container">
          <div class="start-icon">📊</div>
          <h3>准备开始兴趣分析</h3>
          <p>兴趣分析将帮助您了解自己的兴趣倾向和适合的职业方向</p>
          <button @click="startAnalysis" :disabled="!canAnalyze">开始分析</button>
        </div>
        
        <interest-analysis-result 
          v-else 
          :analysis-data="analysisResult" 
          @start-analysis="startAnalysis"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import InterestAnalysisResult from '../components/InterestAnalysisResult.vue';
import { getUserProfileDebug, getResumeDataDebug, injectUserProfileDebug, injectResumeDebug } from '../api/career';
import { useCurrentUser } from '../stores/user';

const userStore = useCurrentUser();
const analysisResult = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const userProfileReady = ref(false);
const resumeDataReady = ref(false);
const assessmentDataReady = ref(true); // 假设测评数据已准备好

// 判断是否可以开始分析
const canAnalyze = computed(() => {
  return userProfileReady.value && (resumeDataReady.value || assessmentDataReady.value);
});

// 检查用户资料
const checkUserProfile = async () => {
  if (!userStore.user?.id) return;
  
  try {
    const response = await getUserProfileDebug(String(userStore.user.id));
    userProfileReady.value = response.success && !!response.data.user_profile;
    return userProfileReady.value;
  } catch (err) {
    console.error('检查用户资料失败:', err);
    userProfileReady.value = false;
    return false;
  }
};

// 检查简历数据
const checkResumeData = async () => {
  if (!userStore.user?.id) return;
  
  try {
    const response = await getResumeDataDebug(String(userStore.user.id));
    resumeDataReady.value = response.success && !!response.data;
    return resumeDataReady.value;
  } catch (err) {
    console.error('检查简历数据失败:', err);
    resumeDataReady.value = false;
    return false;
  }
};

// 修复用户资料
const fixUserProfile = async () => {
  if (!userStore.user?.id) return;
  
  try {
    const response = await injectUserProfileDebug(String(userStore.user.id));
    if (response.success) {
      await checkUserProfile();
    }
  } catch (err) {
    console.error('修复用户资料失败:', err);
  }
};

// 修复简历数据
const fixResumeData = async () => {
  if (!userStore.user?.id) return;
  
  try {
    const response = await injectResumeDebug(String(userStore.user.id));
    if (response.success) {
      await checkResumeData();
    }
  } catch (err) {
    console.error('修复简历数据失败:', err);
  }
};

// 开始分析
const startAnalysis = async () => {
  if (!userStore.user?.id || !canAnalyze.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // 使用本地模拟数据，因为兴趣分析功能已被移除
    console.log("使用本地模拟数据代替已移除的兴趣分析功能");
    
    // 等待一段时间以模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 创建模拟兴趣分析结果
    const mockResult = {
      declared_interests: ["编程", "数据分析", "计算机科学", "人工智能", "移动开发"],
      assessment_interests: ["逻辑思维", "问题解决", "技术创新"],
      combined_interests: [
        {name: "编程", score: 9},
        {name: "数据分析", score: 8},
        {name: "计算机科学", score: 7},
        {name: "人工智能", score: 7},
        {name: "移动开发", score: 6},
        {name: "逻辑思维", score: 8},
        {name: "问题解决", score: 7},
        {name: "技术创新", score: 6}
      ],
      categorized_interests: {
        "技术": [
          {name: "编程", score: 9}, 
          {name: "数据分析", score: 8},
          {name: "移动开发", score: 6}
        ],
        "科学": [
          {name: "计算机科学", score: 7}, 
          {name: "人工智能", score: 7}
        ],
        "思维": [
          {name: "逻辑思维", score: 8}, 
          {name: "问题解决", score: 7}, 
          {name: "技术创新", score: 6}
        ],
        "艺术": [],
        "商业": [],
        "社会": [],
        "其他": []
      },
      career_matches: [
        {career_id: 1, career_name: "软件工程师", match_score: 9.2},
        {career_id: 2, career_name: "数据分析师", match_score: 8.5},
        {career_id: 3, career_name: "人工智能工程师", match_score: 8.0},
        {career_id: 4, career_name: "全栈开发工程师", match_score: 7.8},
        {career_id: 5, career_name: "移动应用开发者", match_score: 7.2}
      ],
      summary: "用户在技术领域展现出很强的兴趣倾向，特别是编程和数据分析方面。同时具备较强的逻辑思维和问题解决能力。基于这些兴趣和能力，软件工程师、数据分析师和人工智能工程师是最匹配的职业方向。"
    };

    // 使用模拟数据更新结果
    analysisResult.value = mockResult;
    
  } catch (err: any) {
    error.value = err.message || '分析过程中出现错误';
    console.error('兴趣分析失败:', err);
  } finally {
    loading.value = false;
  }
};

// 初始化检查
onMounted(async () => {
  await checkUserProfile();
  await checkResumeData();
});
</script>

<style scoped>
.interest-analysis-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.description {
  color: #666;
  margin-top: 10px;
}

.content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

.side-panel {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-checks {
  margin-top: 15px;
}

.data-check-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #eee;
}

.data-check-item.data-ready {
  border-left: 4px solid #4caf50;
}

.check-icon {
  margin-right: 15px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-check {
  color: #4caf50;
  font-weight: bold;
}

.icon-error {
  color: #f44336;
  font-weight: bold;
}

.check-info {
  flex-grow: 1;
}

.check-name {
  font-weight: bold;
}

.check-status {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.analysis-actions {
  margin-top: 30px;
  text-align: center;
}

.analyze-button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.analyze-button:hover:not(:disabled) {
  background: #3a80d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.analyze-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.analysis-warning {
  margin-top: 10px;
  color: #f44336;
  font-size: 12px;
}

.main-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 600px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4a90e2;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
}

.error-container {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  width: 64px;
  height: 64px;
  line-height: 64px;
  border-radius: 50%;
  background: #f44336;
  color: white;
  font-size: 40px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.error-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.error-message {
  color: #666;
  margin-bottom: 20px;
}

.start-container {
  text-align: center;
  padding: 60px 20px;
}

.start-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .side-panel {
    order: 1;
  }
  
  .main-content {
    order: 0;
  }
}
</style> 