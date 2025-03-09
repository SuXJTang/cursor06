<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>关于我们</h3>
        <p>高校职业推荐系统致力于帮助大学生找到最适合的职业发展方向，通过科学的测评方法和数据分析，为您提供个性化的职业规划建议。</p>
      </div>
      
      <div class="footer-section">
        <h3>快速链接</h3>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/assessment">职业测评</router-link></li>
          <li><router-link to="/careers">职业库</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>联系方式</h3>
        <ul>
          <li>邮箱：contact@career-guide.com</li>
          <li>电话：400-123-4567</li>
          <li>地址：北京市海淀区中关村大街1号</li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>关注我们</h3>
        <div class="social-links">
          <a href="#" title="微信"><el-icon><ChatDotRound /></el-icon></a>
          <a href="#" title="微博"><el-icon><Connection /></el-icon></a>
          <a href="#" title="QQ"><el-icon><ChatRound /></el-icon></a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>&copy; {{ currentYear }} 高校职业推荐系统 版权所有</p>
        <p>
          <a href="#">隐私政策</a> | 
          <a href="#">使用条款</a> | 
          <a href="#">网站地图</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChatDotRound, Connection, ChatRound } from '@element-plus/icons-vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #f5f7fa;
  padding: 60px 0 0;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h3 {
  color: #303133;
  font-size: 1.2em;
  margin-bottom: 20px;
  font-weight: 600;
}

.footer-section p {
  color: #606266;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #606266;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #409EFF;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-links a {
  color: #606266;
  font-size: 24px;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #409EFF;
}

.footer-bottom {
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #e4e7ed;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 0.9em;
}

.footer-bottom-content a {
  color: #909399;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-bottom-content a:hover {
  color: #409EFF;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style> 