<template>
  <div class="career-detail">
    <div class="career-detail-header">
      <el-button icon="Back" circle plain @click="onClose" class="close-btn" />
      <h2 class="career-title">{{ career.title || career.name }}</h2>
      
      <div class="career-actions">
        <el-button
          type="primary"
          :icon="career.is_favorite ? 'Star' : 'StarFilled'"
          @click="onToggleFavorite"
          :class="{ 'is-favorite': career.is_favorite }"
        >
          {{ career.is_favorite ? '取消收藏' : '收藏' }}
        </el-button>
      </div>
    </div>
    
    <el-scrollbar class="career-detail-content">
      <!-- 基本信息 -->
      <section class="detail-section">
        <div class="career-primary-info">
          <div class="info-item salary" v-if="career.salary_range || career.median_salary">
            <h4>薪资范围</h4>
            <div class="info-value">
              {{ career.salary_range || formatSalary(career.median_salary) }}
            </div>
          </div>
          
          <div class="info-item education" v-if="career.education_required || career.education_requirements">
            <h4>教育要求</h4>
            <div class="info-value">
              {{ career.education_required || career.education_requirements }}
            </div>
          </div>
          
          <div class="info-item experience" v-if="career.experience_required">
            <h4>经验要求</h4>
            <div class="info-value">
              {{ career.experience_required }}
            </div>
          </div>
          
          <div class="info-item outlook" v-if="career.job_outlook">
            <h4>就业前景</h4>
            <div class="info-value">
              {{ career.job_outlook }}
            </div>
          </div>
        </div>
      </section>
      
      <!-- 职业描述 -->
      <section class="detail-section" v-if="career.description || career.summary">
        <h3 class="section-title">职业描述</h3>
        <div class="section-content description">
          {{ career.description || career.summary }}
        </div>
      </section>
      
      <!-- 工作职责 -->
      <section class="detail-section" v-if="hasJobDuties">
        <h3 class="section-title">工作职责</h3>
        <div class="section-content duties">
          <el-collapse>
            <el-collapse-item 
              v-for="(duty, index) in getJobDuties" 
              :key="index" 
              :title="getShortDuty(duty)"
            >
              {{ duty }}
            </el-collapse-item>
          </el-collapse>
        </div>
      </section>
      
      <!-- 技能要求 -->
      <section class="detail-section" v-if="hasSkills">
        <h3 class="section-title">技能要求</h3>
        <div class="section-content skills">
          <el-tag
            v-for="(skill, index) in getSkills"
            :key="index"
            class="skill-tag"
            effect="plain"
          >
            {{ skill }}
          </el-tag>
        </div>
      </section>
      
      <!-- 工作环境 -->
      <section class="detail-section" v-if="career.work_environment">
        <h3 class="section-title">工作环境</h3>
        <div class="section-content environment">
          {{ career.work_environment }}
        </div>
      </section>
      
      <!-- 职业发展 -->
      <section class="detail-section" v-if="career.career_path || career.growth_potential">
        <h3 class="section-title">职业发展</h3>
        <div class="section-content career-path">
          <div v-if="career.career_path">{{ career.career_path }}</div>
          <div v-if="career.growth_potential">
            <h4>成长潜力</h4>
            {{ career.growth_potential }}
          </div>
        </div>
      </section>
      
      <!-- 相关职业 -->
      <section class="detail-section" v-if="hasRelatedCareers">
        <h3 class="section-title">相关职业</h3>
        <div class="section-content related-careers">
          <el-tag
            v-for="(relatedCareer, index) in getRelatedCareers"
            :key="index"
            class="related-career-tag"
            @click="onRelatedCareerClick(relatedCareer)"
            effect="light"
          >
            {{ relatedCareer }}
          </el-tag>
        </div>
      </section>
      
      <!-- 所属行业 -->
      <section class="detail-section" v-if="hasIndustries">
        <h3 class="section-title">所属行业</h3>
        <div class="section-content industries">
          <el-tag
            v-for="(industry, index) in getIndustries"
            :key="index"
            class="industry-tag"
            effect="plain"
            type="info"
          >
            {{ industry }}
          </el-tag>
        </div>
      </section>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import type { Career } from '../../types/career';

export default defineComponent({
  name: 'CareerDetail',
  props: {
    career: {
      type: Object as () => Career,
      required: true
    }
  },
  emits: ['close', 'toggle-favorite'],
  setup(props, { emit }) {
    // 关闭详情
    const onClose = () => {
      emit('close');
    };

    // 切换收藏状态
    const onToggleFavorite = () => {
      emit('toggle-favorite', props.career);
    };

    // 点击相关职业
    const onRelatedCareerClick = (careerName: string) => {
      // TODO: 实现相关职业的跳转或加载
      ElMessage.info(`查看相关职业: ${careerName}`);
    };

    // 格式化薪资
    const formatSalary = (salary?: number): string => {
      if (!salary) return '未知';
      
      // 简单的格式化，根据实际需求调整
      if (salary >= 10000) {
        return `¥${(salary / 10000).toFixed(1)}万`;
      }
      
      return `¥${salary}`;
    };

    // 计算属性：技能
    const hasSkills = computed(() => {
      return (
        (Array.isArray(props.career.skills_required) && props.career.skills_required.length > 0) ||
        (Array.isArray(props.career.required_skills) && props.career.required_skills.length > 0)
      );
    });

    const getSkills = computed(() => {
      if (Array.isArray(props.career.skills_required) && props.career.skills_required.length > 0) {
        return props.career.skills_required;
      }
      
      if (Array.isArray(props.career.required_skills) && props.career.required_skills.length > 0) {
        return props.career.required_skills;
      }
      
      return [];
    });

    // 计算属性：职业职责
    const hasJobDuties = computed(() => {
      return (
        (Array.isArray(props.career.job_duties) && props.career.job_duties.length > 0)
      );
    });

    const getJobDuties = computed(() => {
      if (Array.isArray(props.career.job_duties) && props.career.job_duties.length > 0) {
        return props.career.job_duties;
      }
      
      return [];
    });

    // 计算属性：相关职业
    const hasRelatedCareers = computed(() => {
      return (
        (Array.isArray(props.career.related_careers) && props.career.related_careers.length > 0)
      );
    });

    const getRelatedCareers = computed(() => {
      if (Array.isArray(props.career.related_careers) && props.career.related_careers.length > 0) {
        return props.career.related_careers;
      }
      
      return [];
    });

    // 计算属性：所属行业
    const hasIndustries = computed(() => {
      return (
        (Array.isArray(props.career.industries) && props.career.industries.length > 0)
      );
    });

    const getIndustries = computed(() => {
      if (Array.isArray(props.career.industries) && props.career.industries.length > 0) {
        return props.career.industries;
      }
      
      return [];
    });

    // 截断长文本
    const getShortDuty = (duty: string): string => {
      const maxLength = 30;
      if (duty.length <= maxLength) {
        return duty;
      }
      
      return `${duty.substring(0, maxLength)}...`;
    };

    return {
      onClose,
      onToggleFavorite,
      onRelatedCareerClick,
      formatSalary,
      hasSkills,
      getSkills,
      hasJobDuties,
      getJobDuties,
      hasRelatedCareers, 
      getRelatedCareers,
      hasIndustries,
      getIndustries,
      getShortDuty
    };
  }
});
</script>

<style scoped>
.career-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.career-detail-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  position: relative;
}

.close-btn {
  position: absolute;
  left: 20px;
  top: 20px;
}

.career-title {
  margin: 0;
  text-align: center;
  padding: 0 50px;
  font-size: 24px;
  line-height: 1.4;
}

.career-actions {
  position: absolute;
  right: 20px;
  top: 20px;
}

.is-favorite {
  background-color: #fef0f0;
  border-color: #fbc4c4;
  color: #f56c6c;
}

.career-detail-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  position: relative;
  padding-left: 12px;
  color: #303133;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
}

.section-content {
  color: #606266;
  line-height: 1.6;
}

.career-primary-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
}

.info-item h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #909399;
}

.info-value {
  font-weight: 500;
  color: #303133;
}

.skills, .related-careers, .industries {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag, .related-career-tag, .industry-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.related-career-tag {
  cursor: pointer;
}

.related-career-tag:hover {
  color: var(--el-color-primary);
}

.description, .environment, .career-path {
  white-space: pre-line;
}
</style> 