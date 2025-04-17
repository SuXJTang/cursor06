<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import Footer from '@/components/Footer.vue'
import { ArrowRight, Edit, DataLine, User, Promotion } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 功能卡片数据
const features = [
  {
    title: '兴趣探索',
    description: '通过科学的测评方法，发现你的职业兴趣所在',
    icon: 'Compass',
    route: '/assessment',
    requiresAuth: true
  },
  {
    title: '能力评估',
    description: '全方位评估个人能力特征，找到最适合的发展方向',
    icon: 'TrendCharts',
    route: '/assessment',
    requiresAuth: true
  },
  {
    title: '个性分析',
    description: '深入分析性格特征，匹配最适合的职业环境',
    icon: 'Connection',
    route: '/assessment',
    requiresAuth: true
  },
  {
    title: '职业推荐',
    description: '基于测评结果，智能推荐最适合的职业发展路径',
    icon: 'Guide',
    route: '/careers',
    requiresAuth: true
  }
]

// 统计数据
const stats = ref([
  { label: '职业数据库', value: '2,000+' },
  { label: '测评维度', value: '16+' },
  { label: '匹配算法准确率', value: '95%' },
  { label: '用户满意度', value: '98%' }
])

// 跳转到功能页面
const navigateTo = (feature: typeof features[0]) => {
  if (feature.requiresAuth && !userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录后使用该功能',
      type: 'warning'
    })
    userStore.setRedirectPath(feature.route)
    router.push('/login')
    return
  }
  router.push(feature.route)
}

// 开始测评按钮点击
const startAssessment = () => {
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录后开始测评',
      type: 'warning'
    })
    userStore.setRedirectPath('/assessment')
    router.push('/login')
    return
  }
  router.push('/assessment')
}
</script>

<template>
  <div class="home-container">
    <!-- Banner区域 -->
    <div class="banner-section">
      <div class="banner-content">
        <h1>探索你的职业理想</h1>
        <p>基于科学的测评体系，为你找到最适合的职业发展方向</p>
        <el-button type="primary" size="large" @click="startAssessment">
          开始职业测评
          <el-icon class="el-icon--right">
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 服务介绍区域 -->
    <div class="services-section">
      <h2 class="section-title">
        我们的服务
      </h2>
      <div class="service-cards">
        <div class="service-card">
          <el-icon class="service-icon">
            <Edit />
          </el-icon>
          <h3>兴趣探索</h3>
          <p>通过科学的测评方法，发现你的职业兴趣倾向</p>
        </div>
        <div class="service-card">
          <el-icon class="service-icon">
            <DataLine />
          </el-icon>
          <h3>能力评估</h3>
          <p>全方位评估个人能力特征，找到最适合的发展方向</p>
        </div>
        <div class="service-card">
          <el-icon class="service-icon">
            <User />
          </el-icon>
          <h3>个性分析</h3>
          <p>深入分析性格特征，匹配适合的职业环境</p>
        </div>
        <div class="service-card">
          <el-icon class="service-icon">
            <Promotion />
          </el-icon>
          <h3>职业推荐</h3>
          <p>基于测评结果，智能推荐适合的职业发展路径</p>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <section class="stats">
      <div class="section-content">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-value">
              {{ stat.value }}
            </div>
            <div class="stat-label">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.banner-section {
  position: relative;
  height: 500px;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  overflow: hidden;
}

.banner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/path/to/pattern.png') repeat;
  opacity: 0.1;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
}

.banner-content h1 {
  font-size: 48px;
  font-weight: 600;
  margin: 0 0 20px;
  letter-spacing: 2px;
}

.banner-content p {
  font-size: 20px;
  margin: 0 0 40px;
  opacity: 0.9;
}

.services-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 36px;
  color: #303133;
  margin-bottom: 60px;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 0 auto;
}

.service-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.service-icon {
  font-size: 40px;
  color: #1890ff;
  margin-bottom: 20px;
}

.service-card h3 {
  font-size: 20px;
  color: #303133;
  margin: 0 0 15px;
}

.service-card p {
  color: #606266;
  margin: 0;
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .banner-content h1 {
    font-size: 36px;
  }

  .banner-content p {
    font-size: 18px;
  }

  .services-section {
    padding: 60px 20px;
  }

  .section-title {
    font-size: 30px;
    margin-bottom: 40px;
  }
}

.stats {
  background-color: #f5f7fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 10px;
}

.stat-label {
  color: #606266;
  font-size: 1.1em;
}
</style> 