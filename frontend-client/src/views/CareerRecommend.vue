<template>
  <div class="career-recommend-container">
    <el-card class="recommend-card">
      <template #header>
        <div class="card-header">
          <h2>职业推荐</h2>
        </div>
      </template>
      
      <div class="recommend-content">
        <el-alert
          title="功能开发中"
          type="info"
          description="职业推荐功能正在开发中，敬请期待！"
          :closable="false"
          show-icon
        />
        
        <div class="feature-preview">
          <h3>即将推出的功能</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="feature-card">
                <template #header>
                  <div class="feature-header">
                    <el-icon><DataAnalysis /></el-icon>
                    <span>个性化职业匹配</span>
                  </div>
                </template>
                <div class="feature-description">
                  基于您的个人简历和职业测评结果，智能推荐最适合您的职业方向和具体岗位。
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="8">
              <el-card class="feature-card">
                <template #header>
                  <div class="feature-header">
                    <el-icon><TrendCharts /></el-icon>
                    <span>职业前景分析</span>
                  </div>
                </template>
                <div class="feature-description">
                  提供行业薪资水平、就业前景和发展趋势分析，帮助您做出明智的职业选择。
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="8">
              <el-card class="feature-card">
                <template #header>
                  <div class="feature-header">
                    <el-icon><Connection /></el-icon>
                    <span>能力提升指南</span>
                  </div>
                </template>
                <div class="feature-description">
                  根据目标职业要求，为您提供个性化的能力提升建议和学习资源推荐。
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { DataAnalysis, TrendCharts, Connection } from '@element-plus/icons-vue'
</script>

<style scoped>
.career-recommend-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.recommend-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommend-content {
  padding: 20px 0;
}

.feature-preview {
  margin-top: 30px;
}

.feature-preview h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #555;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.feature-card {
  height: 100%;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-header {
  display: flex;
  align-items: center;
}

.feature-header .el-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #409eff;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}
</style> 