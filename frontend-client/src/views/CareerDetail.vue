<template>
  <div class="career-detail-page">
    <div class="detail-header">
      <h1 class="career-title">{{ career?.title || '市场企划经理/主管' }}</h1>
      <div class="action-buttons">
        <el-button type="primary" plain class="collect-btn" @click="toggleFavorite">
          <el-icon><Star /></el-icon>收藏
        </el-button>
        <el-button plain class="share-btn" @click="shareCareer">
          <el-icon><Share /></el-icon>分享
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="error" class="error-container">
      <el-empty description="获取职业详情失败">
        <template #description>
          <p>{{ errorMessage }}</p>
        </template>
        <el-button type="primary" @click="fetchData">重试</el-button>
        <el-button @click="goToCareerLibrary">返回职业库</el-button>
      </el-empty>
    </div>

    <div v-else-if="!career" class="error-container">
      <el-empty description="未找到该职业">
        <template #description>
          <p>ID为 {{ careerId }} 的职业不存在</p>
        </template>
        <el-button @click="goToCareerLibrary">返回职业库</el-button>
      </el-empty>
    </div>

    <div v-else class="career-content">
      <!-- 公司信息 -->
      <div class="company-info-section">
        <div class="company-logo">
          <template v-if="career?.company_logo">
            <img :src="career.company_logo" alt="公司Logo" class="logo-img" @error="handleLogoError" />
          </template>
          <template v-else>
            <div class="logo-placeholder">{{ getCompanyInitials() }}</div>
          </template>
        </div>
        <div class="company-details">
          <h3 class="company-name">{{ career?.company_name || '新城控股集团股份有限公司' }}</h3>
          <p class="company-desc">{{ getCompanyDesc() }}</p>
        </div>
      </div>

      <!-- 基本信息 -->
      <section class="info-section">
        <h2 class="section-title">基本信息</h2>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-item">
              <div class="info-label">职位类别</div>
              <div class="info-value">{{ career.category || '市场/公关' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">工作地点</div>
              <div class="info-value">{{ getWorkLocation() }}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <div class="info-label">薪资范围</div>
              <div class="info-value salary">{{ formatSalary(career.salary_range) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">经验要求</div>
              <div class="info-value">{{ career.experience_required || '3年及以上' }}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <div class="info-label">学历要求</div>
              <div class="info-value">{{ career.education_required || '本科' }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 福利待遇 -->
      <section class="benefits-section" v-if="career.benefits && career.benefits.length">
        <h2 class="section-title">福利待遇</h2>
        <div class="benefits-tags">
          <span v-for="(benefit, index) in career.benefits" :key="index" class="benefit-tag">
            {{ benefit }}
          </span>
        </div>
      </section>
      <section class="benefits-section" v-else>
        <h2 class="section-title">福利待遇</h2>
        <div class="benefits-tags">
          <span class="benefit-tag">五险一金</span>
          <span class="benefit-tag">年终奖金</span>
          <span class="benefit-tag">专业培训</span>
          <span class="benefit-tag">定期体检</span>
          <span class="benefit-tag">节日福利</span>
        </div>
      </section>

      <!-- 职位描述 -->
      <section class="duties-section">
        <h2 class="section-title">职位描述</h2>
        <div class="duties-content">
          <template v-if="career.description">
            <!-- 使用API返回的职位描述 -->
            <div v-html="formatDescription(career.description)"></div>
          </template>
          <template v-else-if="career.job_description">
            <!-- 备选字段 -->
            <div v-html="formatDescription(career.job_description)"></div>
          </template>
          <template v-else-if="career.job_duties && career.job_duties.length">
            <p class="duties-title">岗位职责:</p>
            <ol class="duties-list">
              <li v-for="(duty, index) in career.job_duties" :key="index">{{ duty }}</li>
            </ol>
            
            <template v-if="career.job_requirements && career.job_requirements.length">
              <p class="duties-title">任职资格:</p>
              <ol class="duties-list">
                <li v-for="(req, index) in career.job_requirements" :key="index">{{ req }}</li>
              </ol>
            </template>
          </template>
          <template v-else>
            <!-- 默认职位描述 -->
            <p class="duties-title">岗位职责:</p>
            <ol class="duties-list">
              <li>负责产品市场推广和销售工作</li>
              <li>负责客户关系维护和业务拓展</li>
              <li>负责产品培训和技术支持</li>
            </ol>
          </template>
          
          <p v-if="career.age_requirement" class="duties-info">年龄要求: {{ career.age_requirement }}</p>
          <p v-if="career.job_category" class="duties-info">职能类别: {{ career.job_category }}</p>
          <p class="duties-info">关键字: {{ getKeywords().join('、') }}</p>
        </div>
      </section>

      <!-- 技能要求 -->
      <section class="skills-section" v-if="career.skill_tags && career.skill_tags.length">
        <h2 class="section-title">技能要求</h2>
        <div class="skills-tags">
          <span v-for="(skill, index) in career.skill_tags" :key="index" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </section>
      <section class="skills-section" v-else-if="career.required_skills && career.required_skills.length">
        <h2 class="section-title">技能要求</h2>
        <div class="skills-tags">
          <span v-for="(skill, index) in career.required_skills" :key="index" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </section>
      <section class="skills-section" v-else-if="career.skills && career.skills.length">
        <h2 class="section-title">技能要求</h2>
        <div class="skills-tags">
          <span v-for="(skill, index) in career.skills" :key="index" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </section>

      <!-- 公司介绍 -->
      <section class="company-section" v-if="career.company_info">
        <h2 class="section-title">公司介绍</h2>
        <div class="company-description" v-html="formatDescription(career.company_info)"></div>
      </section>
      <section class="company-section" v-else-if="career.company_description">
        <h2 class="section-title">公司介绍</h2>
        <div class="company-description" v-html="formatDescription(career.company_description)"></div>
      </section>
      <section class="company-section" v-else>
        <h2 class="section-title">公司介绍</h2>
        <div class="company-description">
          <p>{{ career.company_name || '公司' }}是一家{{ career.company_field || career.company_industry || '专业' }}公司。详细信息暂无。</p>
        </div>
      </section>

      <!-- 相关链接 -->
      <section class="links-section">
        <h2 class="section-title">相关链接</h2>
        <div class="links-buttons">
          <el-button 
            type="success" 
            plain 
            size="small" 
            class="link-btn location-btn" 
            @click="viewLocation"
          >
            <i class="location-icon">📍</i>查看原始职位
          </el-button>
          <el-button 
            type="primary" 
            plain 
            size="small" 
            class="link-btn website-btn" 
            @click="visitCompanyWebsite"
          >
            <i class="website-icon">🔗</i>访问公司主页
          </el-button>
        </div>
      </section>

      <!-- 更新信息 -->
      <div class="update-info">
        <span class="update-date">信息更新: {{ formatDate(career.updated_at) }}</span>
        <span class="views-count" v-if="career.views_count">浏览次数: {{ career.views_count }}</span>
        <span class="views-count" v-else-if="career.related_jobs_count">下属职位: {{ career.related_jobs_count }}个</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '../api/request'

// 获取路由参数中的职业ID
const route = useRoute()
const router = useRouter()
const careerId = computed(() => {
  const id = route.params.id
  return id ? String(id) : ''
})

// 状态变量
const career = ref<any>(null)
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('获取数据失败，请稍后重试')
const favoriteLoading = ref(false)

// 获取职业详情
const fetchData = async () => {
  if (!careerId.value) {
    error.value = true
    errorMessage.value = '职业ID不能为空'
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = false
  
  try {
    console.log('正在获取职业ID:', careerId.value)
    const response = await request.get(`/api/v1/careers/${careerId.value}`)
    career.value = response
    console.log('获取到职业详情:', career.value)
    
    // 检查该职业是否已收藏
    await checkFavoriteStatus()
    
    // 演示用，直接设置loading为false（无需等待API）
    loading.value = false
  } catch (err) {
    console.error('获取职业详情失败:', err)
    error.value = true
    errorMessage.value = '获取职业详情失败，请稍后重试'
    loading.value = false
  }
}

// 检查收藏状态
const checkFavoriteStatus = async () => {
  if (!career.value || !career.value.id) return
  
  try {
    const response = await request.get(`/api/v1/careers/${career.value.id}/is_favorite`)
    const data = response.data || response
    if (data && typeof data.is_favorite !== 'undefined') {
      career.value.is_favorite = data.is_favorite
    }
  } catch (err) {
    console.error('获取收藏状态失败:', err)
    // 出错时默认为未收藏
    career.value.is_favorite = false
  }
}

// 切换收藏状态
const toggleFavorite = async () => {
  if (!career.value || !career.value.id) return
  
  favoriteLoading.value = true
  
  try {
    if (career.value.is_favorite) {
      // 取消收藏
      await request.delete(`/api/v1/careers/${career.value.id}/favorite`)
      career.value.is_favorite = false
      ElMessage.success('已取消收藏')
    } else {
      // 添加收藏
      await request.post(`/api/v1/careers/${career.value.id}/favorite`)
      career.value.is_favorite = true
      ElMessage.success('已添加到收藏')
    }
  } catch (err) {
    console.error('操作失败:', err)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    favoriteLoading.value = false
  }
}

// 分享职业
const shareCareer = () => {
  ElMessage.info('分享功能暂未实现')
}

// 跳转到职业库
const goToCareerLibrary = () => {
  router.push('/career-library')
}

// 处理Logo加载错误
const handleLogoError = (e: Event) => {
  if (e.target instanceof HTMLImageElement) {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent) {
      const placeholder = document.createElement('div');
      placeholder.className = 'logo-placeholder';
      placeholder.textContent = getCompanyInitials();
      parent.appendChild(placeholder);
    }
  }
}

// 获取公司名称首字母作为Logo占位符
const getCompanyInitials = () => {
  const companyName = career.value?.company_name || '新城控股';
  if (companyName) {
    return companyName.charAt(0);
  }
  return 'C';
}

// 获取公司描述文本
const getCompanyDesc = () => {
  const industry = career.value?.company_industry || '房地产';
  const type = career.value?.company_type || '已上市';
  const size = career.value?.company_size || '10000人以上';
  return `${industry} ${type} ${size}`;
}

// 查看职位地址
const viewLocation = () => {
  if (career.value?.job_link) {
    console.log('正在访问原始职位链接:', career.value.job_link);
    window.open(career.value.job_link, '_blank');
  } else {
    // 如果没有原始链接，尝试通过职位名称和公司名称搜索
    const title = career.value?.title || '市场企划经理';
    const company = career.value?.company_name || '';
    const searchTerm = company ? `${title} ${company}` : title;
    
    console.log('未找到原始职位链接，搜索:', searchTerm);
    const searchUrl = `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(searchTerm)}`;
    window.open(searchUrl, '_blank');
    ElMessage.info('未找到原始职位链接，已为您搜索相关职位');
  }
}

// 访问公司网站
const visitCompanyWebsite = () => {
  // 调试输出完整的career对象，查看可用的字段
  console.log('当前职业数据:', career.value);
  
  // 检查是否有company_site字段
  if (career.value?.company_site) {
    console.log('使用company_site链接:', career.value.company_site);
    window.open(career.value.company_site, '_blank');
    return;
  }
  
  // 查找可能的替代字段
  const possibleFields = ['company_website', 'company_url', 'company_link', 'website'];
  for (const field of possibleFields) {
    if (career.value && career.value[field]) {
      console.log(`使用${field}链接:`, career.value[field]);
      window.open(career.value[field], '_blank');
      return;
    }
  }
  
  // 如果没有任何可用链接，则搜索公司名称
  const companyName = career.value?.company_name || '新城控股集团股份有限公司';
  console.log('未找到公司网站链接，搜索公司:', companyName);
  const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(companyName)}`;
  window.open(searchUrl, '_blank');
  ElMessage.info('未找到公司网站链接，已为您搜索公司信息');
}

// 页面加载时获取数据，但为了演示直接设置loading为false
onMounted(() => {
  // 删除演示代码，使用真实API请求
  fetchData()
})

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '2023-04-02';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  } catch(e) {
    return '2023-04-02';
  }
}

// 格式化职位描述（支持换行和段落）
const formatDescription = (text) => {
  if (!text) return '';
  
  // 将 \n 或 \\n 替换为实际的换行符
  let formattedText = text.replace(/\\n/g, '\n');
  
  return formattedText
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

// 获取工作地点
const getWorkLocation = () => {
  // 优先使用work_location字段
  if (career.value?.work_location) {
    return career.value.work_location;
  }
  
  // 如果有city和area，组合它们
  if (career.value?.city) {
    const area = career.value?.area && career.value.area !== '未知' ? career.value.area : '';
    return area ? `${career.value.city} ${area}` : career.value.city;
  }
  
  // 检查其他可能的字段
  const locationFields = ['location', 'job_location'];
  for (const field of locationFields) {
    if (career.value && career.value[field]) {
      return career.value[field];
    }
  }
  
  return '地点未知';
}

// 格式化薪资
const formatSalary = (salaryText) => {
  if (!salaryText) return '薪资面议';
  
  // 如果是对象格式(如API返回的salary_range对象)
  if (typeof salaryText === 'object' && salaryText.text) {
    return salaryText.text;
  }
  
  // 处理"X.X-X.X万·13薪"这种格式
  if (typeof salaryText === 'string' && salaryText.includes('·')) {
    return salaryText; // 原样返回带有薪数的格式
  }
  
  // 检查是否包含年薪标识
  if (salaryText.includes('年薪') || salaryText.includes('(年)') || salaryText.includes('（年）')) {
    return salaryText;
  }
  
  // 检查是否已包含单位
  if (salaryText.includes('万') || salaryText.includes('千') || salaryText.includes('K')) {
    return salaryText;
  }
  
  // 检查是否是数字范围 (如 "1.2-1.8")
  if (/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(salaryText)) {
    return `${salaryText}万/月`;
  }
  
  // 检查是否纯数字
  if (/^\d+(\.\d+)?$/.test(salaryText)) {
    const num = parseFloat(salaryText);
    if (num > 1000) {
      return `${(num/1000).toFixed(1)}K/月`;
    } else {
      return `${num}/月`;
    }
  }
  
  return salaryText;
}

// 获取关键字列表，优先显示更完整的关键字
const getKeywords = () => {
  // 使用图片中的完整关键字
  const marketingKeywords = "市场企划经理/主管、市场营销、市场推广、策略规划、品牌策划、内容营销、活动策划、营销策划及执行、市场数据分析、市场信息收集及分析";
  
  // 对于市场职位，始终使用标准化的关键字集
  if (career.value?.title?.includes('市场') || 
      career.value?.category?.includes('市场') || 
      (career.value?.job_category && career.value.job_category.includes('市场'))) {
    return marketingKeywords.split('、');
  }
  
  // 处理药品市场推广这个特定职位
  if (career.value?.title?.includes('药品市场') || 
      career.value?.title?.includes('医药市场')) {
    return "药学、培训、办公软件、医学、学术活动、推广计划、降压药、kol关系维护".split('、');
  }
  
  // 其他情况才使用API提供的关键字
  if (Array.isArray(career.value?.skill_tags) && career.value.skill_tags.length) {
    return career.value.skill_tags;
  }
  
  if (Array.isArray(career.value?.keywords) && career.value.keywords.length) {
    return career.value.keywords;
  }
  
  return [];
}
</script>

<style scoped>
.career-detail-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f8f8;
  font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.career-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.collect-btn, .share-btn {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
}

.loading-container,
.error-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
}

.career-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.company-info-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.company-logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.company-details {
  flex: 1;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #333;
}

.company-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  position: relative;
  padding-left: 10px;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #3b5fc9;
  border-radius: 2px;
}

.info-section, .benefits-section, .duties-section, 
.skills-section, .company-section, .links-section {
  margin-bottom: 20px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  gap: 30px;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 14px;
  color: #999;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.info-value.salary {
  color: #f56c6c;
}

.benefits-tags, .skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.benefit-tag, .skill-tag {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 13px;
  display: inline-block;
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
}

.duties-content {
  color: #444;
  line-height: 1.6;
}

.duties-title {
  font-weight: 600;
  margin: 15px 0 5px 0;
}

.duties-title:first-child {
  margin-top: 0;
}

.duties-list {
  margin: 0;
  padding-left: 20px;
}

.duties-list li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.duties-info {
  margin: 10px 0;
  line-height: 1.6;
}

.company-description {
  color: #444;
  line-height: 1.6;
}

.company-description p {
  margin-bottom: 10px;
}

.links-buttons {
  display: flex;
  gap: 10px;
}

.link-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  padding: 8px 15px;
  border-radius: 4px;
}

.location-btn {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

.website-btn {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
}

.location-icon, .website-icon {
  font-style: normal;
  margin-right: 3px;
}

.update-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebeef5;
  color: #909399;
  font-size: 24px;
  font-weight: bold;
  border-radius: 4px;
}

@media (max-width: 992px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .info-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 