<template>
  <div class="interest-analysis">
    <div class="section-card">
      <h3>兴趣分析结果</h3>
      
      <div v-if="!analysisData">
        <p class="no-data">尚未进行兴趣分析</p>
        <button @click="$emit('startAnalysis')">开始分析</button>
      </div>
      
      <div v-else>
        <div class="summary-card">
          <h4>分析总结</h4>
          <p>{{ getInterestSummary }}</p>
        </div>
        
        <div class="interests-container">
          <div class="interests-section">
            <h4>兴趣云图</h4>
            <div class="interests-cloud">
              <div 
                v-for="(interest, index) in getCombinedInterests" 
                :key="index"
                class="interest-tag"
                :style="{
                  fontSize: `${Math.min(14 + interest.score/2, 24)}px`,
                  opacity: `${0.6 + interest.score/20}`
                }"
              >
                {{ interest.name }}
              </div>
            </div>
          </div>
          
          <div class="interests-section">
            <h4>兴趣分类</h4>
            <div class="categories-container">
              <div 
                v-for="(interests, category) in filteredCategories" 
                :key="category"
                class="category-box"
              >
                <h5>{{ category }}</h5>
                <div class="category-interests">
                  <div 
                    v-for="(interest, idx) in interests" 
                    :key="idx"
                    class="category-interest-item"
                  >
                    <span class="interest-name">{{ interest.name }}</span>
                    <div class="interest-score-bar">
                      <div 
                        class="score-fill"
                        :style="{width: `${interest.score * 10}%`}"
                      ></div>
                    </div>
                    <span class="interest-score">{{ interest.score }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="careers-section">
          <h4>匹配职业</h4>
          <div class="careers-grid">
            <div 
              v-for="(career, index) in getCareerMatches" 
              :key="index"
              class="career-card"
            >
              <div class="career-name">{{ career.career_name }}</div>
              <div class="career-match-score">
                匹配度: {{ career.match_score }}
                <div class="match-bar">
                  <div 
                    class="match-fill"
                    :style="{width: `${Math.min(career.match_score * 5, 100)}%`}"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="data-sources">
          <h4>数据来源</h4>
          <div class="sources-grid">
            <div class="source-card">
              <h5>用户声明兴趣</h5>
              <div class="source-interests">
                <span 
                  v-for="(interest, index) in getDeclaredInterests" 
                  :key="index"
                  class="source-interest"
                >
                  {{ interest }}
                </span>
              </div>
            </div>
            
            <div class="source-card">
              <h5>测评发现兴趣</h5>
              <div class="source-interests">
                <span 
                  v-for="(interest, index) in formatAssessmentInterests(analysisData.assessment_interests)" 
                  :key="index"
                  class="source-interest"
                >
                  {{ interest }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'InterestAnalysisResult'
});

const props = defineProps<{
  analysisData: any | null;
}>();

defineEmits<{
  (e: 'startAnalysis'): void;
}>();

// 格式化测评兴趣数据
const formatAssessmentInterests = (interests: any[]): string[] => {
  if (!interests || !Array.isArray(interests)) return [];
  
  return interests.map(item => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item.name) return item.name;
    return JSON.stringify(item);
  });
};

// 添加计算属性来过滤兴趣分类
const filteredCategories = computed(() => {
  if (!props.analysisData || !props.analysisData.categorized_interests) {
    return {};
  }
  
  // 过滤掉空分类
  const result = {};
  const categories = props.analysisData.categorized_interests;
  
  for (const [category, interests] of Object.entries(categories)) {
    if (Array.isArray(interests) && interests.length > 0) {
      result[category] = interests;
    }
  }
  
  return result;
});

// 添加更多防御性检查，确保安全访问数据
const getInterestSummary = computed(() => {
  if (!props.analysisData) return "暂无分析数据";
  return props.analysisData.summary || "未找到兴趣总结";
});

const getCombinedInterests = computed(() => {
  if (!props.analysisData || !props.analysisData.combined_interests) {
    return [];
  }
  return props.analysisData.combined_interests || [];
});

const getDeclaredInterests = computed(() => {
  if (!props.analysisData || !props.analysisData.declared_interests) {
    return [];
  }
  return props.analysisData.declared_interests || [];
});

const getCareerMatches = computed(() => {
  if (!props.analysisData || !props.analysisData.career_matches) {
    return [];
  }
  return props.analysisData.career_matches || [];
});
</script>

<style scoped>
.interest-analysis {
  width: 100%;
  padding: 20px 0;
}

.section-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.no-data {
  color: #999;
  text-align: center;
  margin: 20px 0;
}

.summary-card {
  background: #f5f9ff;
  border-left: 4px solid #4a90e2;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.interests-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.interests-cloud {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.interest-tag {
  margin: 5px;
  padding: 4px 8px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 4px;
  color: #333;
  display: inline-block;
  transition: all 0.2s;
}

.interest-tag:hover {
  background: rgba(74, 144, 226, 0.3);
  transform: scale(1.05);
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-box {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px;
}

.category-interests {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-interest-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.interest-name {
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.interest-score-bar {
  flex-grow: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(to right, #4a90e2, #63b3ed);
  border-radius: 4px;
}

.interest-score {
  width: 20px;
  text-align: right;
  font-weight: bold;
  color: #333;
}

.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.career-card {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 15px;
  transition: all 0.2s;
}

.career-card:hover {
  background: #eef7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.career-name {
  font-weight: bold;
  margin-bottom: 10px;
}

.career-match-score {
  font-size: 14px;
  color: #666;
}

.match-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-top: 5px;
  overflow: hidden;
}

.match-fill {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #8bc34a);
  border-radius: 3px;
}

.data-sources {
  margin-top: 20px;
}

.sources-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 10px;
}

.source-card {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
}

.source-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.source-interest {
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .interests-container {
    grid-template-columns: 1fr;
  }
  
  .sources-grid {
    grid-template-columns: 1fr;
  }
}
</style> 