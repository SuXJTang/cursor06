<template>
  <div class="profile-container">
    <el-row>
      <el-col :span="24">
        <!-- 简历上传卡片 -->
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <h2>个人简历</h2>
              <div class="upload-actions">
                <el-button type="primary" @click="startOnlineEdit">在线编辑</el-button>
                <el-button type="success" @click="importFromLinkedIn">从LinkedIn导入</el-button>
              </div>
            </div>
          </template>

          <div class="resume-upload">
            <el-tabs v-model="activeUploadTab">
              <el-tab-pane label="本地上传" name="local">
                <el-upload
                  v-if="!resumeList.length"
                  class="resume-uploader"
                  :before-upload="beforeResumeUpload"
                  :http-request="handleUploadRequest"
                  :show-file-list="false"
                  :limit="1"
                  accept=".pdf,.doc,.docx"
                  drag
                >
                  <el-icon class="el-icon--upload"><Upload /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处或 <em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持PDF、Word格式，单个文件不超过10MB
                    </div>
                  </template>
                </el-upload>
                
                <div v-else class="resume-replace">
                  <el-alert
                    title="一个用户只能关联一份简历文件，上传新简历将替换旧简历"
                    type="warning"
                    :closable="false"
                  />
                  <div class="replace-btn-container">
                    <el-button type="primary" @click="handleReplaceClick">
                      更换简历文件
                    </el-button>
                  </div>
                  <input
                    ref="hiddenFileInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style="display: none"
                    @change="handleFileInputChange"
                  />
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="URL导入" name="url">
                <div class="url-import">
                  <el-input
                    v-model="resumeUrl"
                    placeholder="请输入简历URL地址"
                    clearable
                  >
                    <template #append>
                      <el-button @click="importFromUrl">导入</el-button>
                    </template>
                  </el-input>
                  <div class="url-tip">支持主流求职网站的简历链接</div>
                </div>
              </el-tab-pane>
            </el-tabs>

            <div v-if="resumeList.length > 0" class="resume-list">
              <h3>当前简历：</h3>
              <el-table 
                :data="resumeList" 
                style="width: 100%" 
                :border="false"
                :cell-style="{padding: '16px 0'}"
              >
                <el-table-column prop="name" label="文件名" min-width="200" />
                <el-table-column label="类型" width="100" align="center">
                  <template #default="scope">
                    <el-tag size="large" :type="scope.row.type === 'pdf' ? 'danger' : 'primary'" effect="plain" style="font-size: 16px; padding: 6px 12px;">
                      {{ scope.row.type.toUpperCase() }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="上传时间" width="180" align="center">
                  <template #default="scope">
                    <span class="upload-time">{{ formatDate(scope.row.uploadTime) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="scope">
                    <div class="resume-actions">
                      <el-button 
                        type="primary" 
                        size="large" 
                        @click="previewResume(scope.row)"
                        class="resume-action-btn"
                      >
                      预览
                    </el-button>
                      <el-button 
                        type="danger" 
                        size="large" 
                        @click="removeResume(scope.row)"
                        class="resume-action-btn"
                      >
                      删除
                    </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>

        <!-- 个人资料信息卡片 - 重新设计 -->
        <el-card class="profile-card profile-info-card">
          <template #header>
            <div class="card-header">
              <h2>个人资料</h2>
              <el-button 
                :type="isEditingExtra ? 'success' : 'primary'" 
                @click="isEditingExtra ? handleExtraInfoSubmit() : isEditingExtra = true" 
                :icon="isEditingExtra ? 'Check' : 'Edit'"
              >
                {{ isEditingExtra ? '保存' : '编辑' }}
              </el-button>
            </div>
          </template>
          
          <el-form label-position="top" class="profile-form">
            <!-- 职业偏好部分 - 重新设计 -->
            <div class="profile-section career-section">
              <div class="section-header">
                <el-icon class="section-icon"><Suitcase /></el-icon>
                <h3>职业偏好</h3>
              </div>
              <div class="section-content">
                <el-row :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item label="期望职位">
                      <el-select
                        v-model="extraInfoForm.expectedPositions"
                        placeholder="请选择期望职位" 
                        class="full-width-select"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in positionOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item label="期望行业">
                      <el-select
                        v-model="extraInfoForm.expectedIndustries"
                        placeholder="请选择期望行业" 
                        class="full-width-select"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in industryOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-form-item label="期望薪资">
                  <el-select
                    v-model="extraInfoForm.expectedSalary"
                    placeholder="请选择期望薪资范围"
                    class="salary-select"
                    :disabled="!isEditingExtra"
                  >
                    <el-option
                      v-for="item in salaryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            
            <!-- 工作经验部分 - 重新设计 -->
            <div class="profile-section experience-section">
              <div class="section-header">
                <el-icon class="section-icon"><Briefcase /></el-icon>
                <h3>工作经验</h3>
              </div>
              <div class="section-content">
                <el-row :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item label="工作年限">
                      <el-input-number 
                        v-model="extraInfoForm.workYears" 
                        :min="0" 
                        :max="50" 
                        :step="1" 
                        :disabled="!isEditingExtra"
                        controls-position="right"
                        class="year-input"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item label="当前状态">
                      <el-select 
                        v-model="extraInfoForm.currentStatus" 
                        placeholder="请选择当前工作状态" 
                        :disabled="!isEditingExtra"
                        class="full-width-select"
                      >
                        <el-option
                          v-for="item in statusOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="工作经历描述">
                  <el-input 
                    v-model="extraInfoForm.workExperience" 
                    type="textarea" 
                    :rows="4"
                    placeholder="请简要描述您的工作经历，包括公司、职位和主要职责等" 
                    :disabled="!isEditingExtra"
                  />
                </el-form-item>
              </div>
            </div>
            
            <!-- 技能评估部分 - 重新设计 -->
            <div class="profile-section skills-section">
              <div class="section-header">
                <el-icon class="section-icon"><Trophy /></el-icon>
                <h3>技能评估</h3>
                <el-button 
                  v-if="isEditingExtra" 
                  @click="showAddSkillDialog = true" 
                  type="primary" 
                  size="small" 
                  text
                  class="add-skill-btn"
                >
                  添加技能
                </el-button>
              </div>
              <div class="section-content">
                <div class="skills-grid">
                  <div
                    v-for="skill in extraInfoForm.skills"
                    :key="skill.id"
                    class="skill-card"
                  >
                    <div class="skill-header">
                      <span class="skill-name">{{ skill.name }}</span>
                      <el-button 
                        v-if="isEditingExtra" 
                        @click="handleSkillClose(skill)" 
                        type="danger" 
                        size="small" 
                        text
                        class="remove-skill-btn"
                      >
                        删除
                      </el-button>
                    </div>
                    <el-rate
                      v-model="skill.level"
                      :max="5"
                      :disabled="!isEditingExtra"
                      :colors="rateColors"
                      show-score
                    />
                  </div>
                  <div 
                    v-if="isEditingExtra && extraInfoForm.skills.length === 0" 
                    class="no-skills-placeholder"
                  >
                    <el-empty description="暂无技能信息">
                      <el-button type="primary" @click="showAddSkillDialog = true">添加技能</el-button>
                    </el-empty>
                  </div>
                </div>

                <el-row :gutter="20" class="mt-20">
                  <el-col :sm="24" :md="12">
                    <el-form-item label="语言能力">
                      <el-select
                        v-model="extraInfoForm.languages"
                        multiple
                        placeholder="请选择掌握的语言"
                        class="full-width-select"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in languageOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item label="技能标签">
                      <el-select
                        v-model="extraInfoForm.skillTags"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择或输入技能标签"
                        class="full-width-select"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in skillTagOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            
            <!-- 性格与工作风格部分 - 重新设计 -->
            <div class="profile-section personality-section">
              <div class="section-header">
                <el-icon class="section-icon"><User /></el-icon>
                <h3>性格与工作风格</h3>
              </div>
              <div class="section-content">
                <el-row :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item label="MBTI类型">
                      <el-select
                        v-model="extraInfoForm.mbtiType"
                        placeholder="请选择您的MBTI类型"
                        class="full-width-select"
                        :disabled="!isEditingExtra"
                      >
                        <el-option-group
                          v-for="group in mbtiOptions"
                          :key="group.label"
                          :label="group.label"
                        >
                          <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="`${item.label} (${item.description})`"
                            :value="item.value"
                          />
                        </el-option-group>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item label="工作风格">
                      <el-select
                        v-model="extraInfoForm.workingStyle"
                        multiple
                        collapse-tags
                        placeholder="请选择您的工作风格" 
                        class="full-width-select"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in workingStyleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>

            <!-- 学习风格部分 - 重新设计 -->
            <div class="profile-section learning-section">
              <div class="section-header">
                <el-icon class="section-icon"><Reading /></el-icon>
                <h3>学习风格</h3>
              </div>
              <div class="section-content">
                <div class="learning-styles-chart">
                  <div class="learning-styles-grid">
                    <div v-for="(item, index) in learningStyleOptions" :key="index" class="learning-style-item">
                      <div class="learning-style-info">
                        <div class="learning-style-label">{{item.label}}</div>
                        <div class="learning-style-value">{{extraInfoForm.learningStyle[item.value]}}/5</div>
                      </div>
                      <el-progress 
                        :percentage="extraInfoForm.learningStyle[item.value] * 20" 
                        :color="getProgressColor(extraInfoForm.learningStyle[item.value])"
                        :show-text="false"
                        :stroke-width="12"
                        class="learning-style-progress"
                      />
                      <div class="learning-style-rating">
                        <el-rate
                          v-model="extraInfoForm.learningStyle[item.value]"
                          :max="5"
                          :disabled="!isEditingExtra"
                          :colors="rateColors"
                          @change="handleRateChange($event, 'learningStyle', item.value)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 兴趣爱好部分 - 重新设计 -->
            <div class="profile-section interests-section">
              <div class="section-header">
                <el-icon class="section-icon"><Star /></el-icon>
                <h3>兴趣与职业方向</h3>
              </div>
              <div class="section-content">
                <el-form-item label="兴趣爱好">
                  <el-select
                    v-model="extraInfoForm.interests"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入您的兴趣爱好"
                    class="full-width-select"
                    :disabled="!isEditingExtra"
                  >
                    <el-option
                      v-for="item in interestOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                
                <div class="interest-chart">
                  <h4 class="interest-chart-title">职业兴趣方向</h4>
                  <div class="interest-chart-grid">
                    <div v-for="(item, index) in careerInterestOptions" :key="index" class="interest-chart-item">
                      <div class="interest-info">
                        <div class="interest-label">{{item.label}}</div>
                        <div class="interest-value">{{extraInfoForm.careerInterests[item.value]}}/5</div>
                      </div>
                      <el-progress 
                        :percentage="extraInfoForm.careerInterests[item.value] * 20" 
                        :color="getProgressColor(extraInfoForm.careerInterests[item.value])"
                        :show-text="false"
                        :stroke-width="12"
                        class="interest-progress"
                      />
                      <div class="interest-rating">
                        <el-rate
                          v-model="extraInfoForm.careerInterests[item.value]"
                          :max="5"
                          :disabled="!isEditingExtra"
                          :colors="rateColors"
                          @change="handleRateChange($event, 'careerInterests', item.value)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-actions" v-if="isEditingExtra">
              <el-button type="success" @click="handleExtraInfoSubmit" :icon="Check">
                保存
              </el-button>
              <el-button @click="cancelEditExtra" :icon="Close">
                取消
              </el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 添加技能对话框 - 重新设计 -->
    <el-dialog
      v-model="showAddSkillDialog"
      title="添加技能"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="skillFormRef"
        :model="skillForm"
        :rules="skillRules"
        label-width="100px"
      >
        <el-form-item label="技能名称" prop="name">
          <el-input v-model="skillForm.name" placeholder="请输入技能名称" />
        </el-form-item>
        
        <el-form-item label="技能等级" prop="level">
          <div class="skill-level-selector">
            <el-rate v-model="skillForm.level" :max="5" :colors="rateColors" />
            <span class="skill-level-text">{{ getSkillLevelText(skillForm.level) }}</span>
          </div>
        </el-form-item>
        
        <el-form-item label="技能类别" prop="categoryId">
          <el-select v-model="skillForm.categoryId" placeholder="请选择技能类别" class="full-width-select">
            <el-option
              v-for="item in skillCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeSkillDialog">取消</el-button>
          <el-button type="primary" @click="submitSkill">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Suitcase, Briefcase, Trophy, User, Reading, Star, Check, Close } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profile'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  uploadResume as uploadResumeAPI, 
  getUserResumes as getUserResumesAPI,
  forceDeleteResumeRecord as forceDeleteRecordAPI,
  getUserResumeInfo as getUserResumeInfoAPI,
  updateResumeFileUrl as updateResumeFileUrlAPI,
  setDefaultResume as setDefaultResumeAPI
} from '../api/profile'

const router = useRouter()
const profileStore = useProfileStore()

// 简历上传相关
const activeUploadTab = ref('local')
const resumeUrl = ref('')
const resumeList = ref<Array<{
  id: string;
  name: string;
  type: string;
  url: string;
  is_default: boolean;
  created_at?: string;
  uploadTime?: string;
}>>([])

// 获取用户简历列表
const fetchUserResumes = async () => {
  try {
    const resumes = await getUserResumesAPI()
    resumeList.value = resumes.map(resume => ({
      ...resume,
      uploadTime: new Date(resume.created_at).toLocaleString()
    }))
  } catch (error) {
    console.error('获取简历列表失败:', error)
    // 不显示错误提示，因为可能是正常情况下的404
    resumeList.value = []
  }
}

const beforeResumeUpload = (file: File) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('只能上传PDF或Word格式的文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

// 处理上传请求
const handleUploadRequest = (options: any) => {
  const { file } = options
  handleResumeUpload(file)
}

// 处理简历上传
const handleResumeUpload = async (file: File) => {
  try {
    // 先检查用户是否有简历
    const userResume = await getUserResumeInfoAPI();
    
    // 上传文件
    const { file_id, file_url } = await uploadResumeAPI(file);
    console.log('上传文件返回结果:', { file_id, file_url });
    
    // 如果用户已有简历，尝试更新简历文件URL
    if (userResume && userResume.id) {
      try {
        await updateResumeFileUrlAPI(userResume.id, file_url);
        console.log('简历文件URL更新成功');
      } catch (updateError) {
        console.error('更新简历文件URL失败:', updateError);
      }
    }
    
    // 清空当前简历列表，重新获取
    resumeList.value = [];
    await fetchUserResumes();
    
    ElMessage.success('简历上传成功');
  } catch (error: any) {
    console.error('简历上传失败:', error);
    console.error('错误详情:', error.response?.data);
    ElMessage.error('简历上传失败，请重试');
  }
}

// 删除简历
const removeResume = async (resume: any) => {
  try {
    await ElMessageBox.confirm(
      '删除简历后，将会完全删除所有简历数据和元数据，此操作不可恢复，是否继续？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    ElMessage.info('正在删除，请稍候...')
    
    // 清空本地列表，提前反馈给用户
    resumeList.value = []
    
    // 使用文件名提取和删除
    if (resume.url) {
      const urlParts = resume.url.split('/')
      const filename = urlParts[urlParts.length - 1]
      console.log('尝试删除文件:', filename, '完整URL:', resume.url)
      
      try {
        // 请求删除文件API
        const response = await fetch(`/api/v1/resume-files/${encodeURIComponent(filename)}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        })
        
        if (response.ok) {
          console.log('删除成功')
          ElMessage.success('简历已删除')
        } else {
          // 如果删除失败尝试使用ID删除
          if (resume.id) {
            console.log('常规删除失败，尝试使用ID强制删除:', resume.id)
            await forceDeleteRecordAPI(String(resume.id))
            ElMessage.success('简历已强制删除')
          } else {
            throw new Error('删除失败')
          }
    }
  } catch (error) {
    console.error('删除简历失败:', error)
        ElMessage.error('删除失败，请刷新页面后重试')
      }
    } else if (resume.id) {
      // 如果没有URL但有ID，直接使用ID删除
      try {
        await forceDeleteRecordAPI(String(resume.id))
        console.log('使用ID删除成功')
        ElMessage.success('简历已删除')
      } catch (error) {
        console.error('使用ID删除失败:', error)
        ElMessage.error('删除失败，请刷新页面后重试')
      }
    } else {
      ElMessage.error('无法删除：缺少文件信息')
    }
    
    // 无论成功失败，1秒后刷新列表
    setTimeout(async () => {
      await fetchUserResumes()
      console.log('刷新简历列表完成')
    }, 1000)
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除简历确认对话框出错:', error)
    }
  }
}

const previewResume = (resume: any) => {
  window.open(resume.url, '_blank')
}

const setDefaultResume = async (resume: any) => {
  try {
    await setDefaultResumeAPI(resume.id)
    resumeList.value.forEach((item: any) => {
      item.is_default = item.id === resume.id
    })
    ElMessage.success('默认简历设置成功')
  } catch (error) {
    console.error('设置默认简历失败:', error)
    ElMessage.error('设置默认简历失败，请重试')
  }
}

const startOnlineEdit = () => {
  router.push('/resume/edit')
}

const importFromLinkedIn = () => {
  ElMessage.info('LinkedIn导入功能即将上线')
}

const importFromUrl = () => {
  if (!resumeUrl.value) {
    ElMessage.warning('请输入简历URL')
    return
  }
  ElMessage.info('URL导入功能即将上线')
  resumeUrl.value = ''
}

// 附加信息相关
const isEditingExtra = ref(false)
const extraInfoFormRef = ref<FormInstance>()

// 附加信息表单
const extraInfoForm = reactive({
  expectedPositions: [] as string[],
  expectedIndustries: [] as string[],
  expectedSalary: '',
  workYears: 0,
  experienceYears: 0,
  currentStatus: '',
  workExperience: '',
  skills: [] as any[],
  skillTags: [] as string[],
  interests: [] as string[],
  languages: [] as string[],
  mbtiType: '',
  workingStyle: [] as string[],
  careerInterests: {
    arts: 5,
    science: 5,
    business: 5,
    technology: 5
  },
  learningStyle: {
    visual: 5,
    reading: 5,
    auditory: 5,
    kinesthetic: 5
  }
})

// 选项数据
const positionOptions = [
  { value: 'software_engineer', label: '软件工程师' },
  { value: 'frontend_developer', label: '前端开发工程师' },
  { value: 'backend_developer', label: '后端开发工程师' },
  { value: 'data_analyst', label: '数据分析师' },
  { value: 'product_manager', label: '产品经理' }
]

const industryOptions = [
  { value: 'tech', label: '科技' },
  { value: 'finance', label: '金融' },
  { value: 'healthcare', label: '医疗健康' },
  { value: 'education', label: '教育' },
  { value: 'ecommerce', label: '电子商务' }
]

const salaryOptions = [
  { value: '0-5000', label: '5千以下' },
  { value: '5000-10000', label: '5千-1万' },
  { value: '10000-15000', label: '1万-1.5万' },
  { value: '15000-20000', label: '1.5万-2万' },
  { value: '20000-30000', label: '2万-3万' },
  { value: '30000+', label: '3万以上' }
]

const languageOptions = [
  { value: 'chinese', label: '中文' },
  { value: 'english', label: '英语' },
  { value: 'japanese', label: '日语' },
  { value: 'french', label: '法语' },
  { value: 'german', label: '德语' }
]

// MBTI选项
const mbtiOptions = [
  {
    label: '外向-内向',
    options: [
      { label: 'ENFJ', value: 'ENFJ', description: '教导者型' },
      { label: 'ENFP', value: 'ENFP', description: '激发者型' },
      { label: 'ENTJ', value: 'ENTJ', description: '统帅型' },
      { label: 'ENTP', value: 'ENTP', description: '发明家型' },
      { label: 'ESFJ', value: 'ESFJ', description: '照顾者型' },
      { label: 'ESFP', value: 'ESFP', description: '表演者型' },
      { label: 'ESTJ', value: 'ESTJ', description: '管理者型' },
      { label: 'ESTP', value: 'ESTP', description: '促进者型' }
    ]
  },
  {
    label: '感知-直觉',
    options: [
      { label: 'INFJ', value: 'INFJ', description: '咨询师型' },
      { label: 'INFP', value: 'INFP', description: '治愈者型' },
      { label: 'INTJ', value: 'INTJ', description: '建筑师型' },
      { label: 'INTP', value: 'INTP', description: '逻辑学家型' },
      { label: 'ISFJ', value: 'ISFJ', description: '守卫者型' },
      { label: 'ISFP', value: 'ISFP', description: '冒险家型' },
      { label: 'ISTJ', value: 'ISTJ', description: '检查者型' },
      { label: 'ISTP', value: 'ISTP', description: '手艺人型' }
    ]
  }
]

// 工作风格选项
const workingStyleOptions = [
  { label: '独立思考', value: 'independent_thinking' },
  { label: '团队协作', value: 'team_collaboration' },
  { label: '创新驱动', value: 'innovation_driven' },
  { label: '目标导向', value: 'goal_oriented' },
  { label: '细节关注', value: 'detail_oriented' },
  { label: '逻辑分析', value: 'analytical_thinking' },
  { label: '高效执行', value: 'efficient_execution' },
  { label: '跨部门协作', value: 'cross_functional' },
  { label: '远程工作', value: 'remote_work' },
  { label: '办公室工作', value: 'office_work' },
  { label: '灵活工作制', value: 'flexible_hours' },
  { label: '结构化工作', value: 'structured_work' }
]

// 学习风格选项
const learningStyleOptions = [
  { value: 'visual', label: '视觉学习' },
  { value: 'reading', label: '读写学习' },
  { value: 'auditory', label: '听觉学习' },
  { value: 'kinesthetic', label: '动手实践' }
]

// 职业兴趣选项
const careerInterestOptions = [
  { value: 'arts', label: '艺术创作' },
  { value: 'science', label: '科学研究' },
  { value: 'business', label: '商业管理' },
  { value: 'technology', label: '技术开发' }
]

// 兴趣爱好选项
const interestOptions = [
  { value: 'reading', label: '阅读' },
  { value: 'music', label: '音乐' },
  { value: 'sports', label: '运动' },
  { value: 'travel', label: '旅行' },
  { value: 'cooking', label: '烹饪' },
  { value: 'photography', label: '摄影' },
  { value: 'painting', label: '绘画' },
  { value: 'gaming', label: '游戏' },
  { value: 'programming', label: '编程' }
]

// 技能标签选项
const skillTagOptions = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'mobile', label: '移动开发' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: '设计' },
  { value: 'ai', label: '人工智能' },
  { value: 'data', label: '数据分析' },
  { value: 'project', label: '项目管理' }
]

// 技能相关
const showAddSkillDialog = ref(false)
const skillFormRef = ref<FormInstance>()
const skillForm = reactive({
  name: '',
  level: 3,
  categoryId: ''
})

const skillRules = {
  name: [
    { required: true, message: '请输入技能名称', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择技能类别', trigger: 'change' }
  ]
}

const skillCategoryOptions = [
  { value: 'programming', label: '编程语言' },
  { value: 'framework', label: '框架工具' },
  { value: 'database', label: '数据库' },
  { value: 'design', label: '设计' },
  { value: 'soft_skills', label: '软技能' }
]

const handleSkillClose = (skill: any) => {
  const index = extraInfoForm.skills.findIndex(item => item.id === skill.id)
  if (index !== -1) {
    extraInfoForm.skills.splice(index, 1)
  }
}

const closeSkillDialog = () => {
  showAddSkillDialog.value = false
  skillForm.name = ''
  skillForm.level = 3
  skillForm.categoryId = ''
}

const submitSkill = async () => {
  if (!skillFormRef.value) return

  try {
    await skillFormRef.value.validate()
    
    // 创建新技能
    const newSkill = {
      id: Date.now().toString(),
      name: skillForm.name,
      level: skillForm.level,
      categoryId: skillForm.categoryId
    }
    
    extraInfoForm.skills.push(newSkill)
    ElMessage.success('技能添加成功')
    closeSkillDialog()
  } catch (error) {
    console.error('添加技能失败:', error)
  }
}

const handleExtraInfoSubmit = async () => {
  try {
    // 保存更多信息到服务器
    isEditingExtra.value = false
    const personalityTraits: Record<string, any> = {}
    // 根据MBTI类型和工作风格设置性格特质值
    if (extraInfoForm.mbtiType) {
      personalityTraits.mbtiType = extraInfoForm.mbtiType
      
      // 根据MBTI类型推断一些基本特质
      if (extraInfoForm.mbtiType.includes('E')) {
        personalityTraits.extraversion = 8
      } else if (extraInfoForm.mbtiType.includes('I')) {
        personalityTraits.extraversion = 3
        personalityTraits.independence = 8
      }
      
      if (extraInfoForm.mbtiType.includes('N')) {
        personalityTraits.openness = 8
        personalityTraits.creative = 7
      } else if (extraInfoForm.mbtiType.includes('S')) {
        personalityTraits.practical = 8
        personalityTraits.detail_oriented = 7
      }
      
      if (extraInfoForm.mbtiType.includes('T')) {
        personalityTraits.analytical = 8
      } else if (extraInfoForm.mbtiType.includes('F')) {
        personalityTraits.agreeableness = 8
      }
      
      if (extraInfoForm.mbtiType.includes('J')) {
        personalityTraits.conscientiousness = 8
      } else if (extraInfoForm.mbtiType.includes('P')) {
        personalityTraits.adaptability = 8
      }
    }
    
    // 工作风格设置
    const workStyle: Record<string, any> = {}
    extraInfoForm.workingStyle.forEach(style => {
      switch (style) {
        case 'independent_thinking':
          workStyle.independent = 8
          break
        case 'team_collaboration':
          workStyle.teamwork = 8
          break
        case 'remote_work':
          workStyle.remote = 8
          break
        case 'office_work':
          workStyle.office = 8
          break
        default:
          workStyle[style] = 7
      }
    })
    
    // 保存到服务器
    await profileStore.updateCareerInterests({
      preferred_positions: extraInfoForm.expectedPositions,
      preferred_industries: extraInfoForm.expectedIndustries,
      salary_expectation: extraInfoForm.expectedSalary,
      work_style: workStyle,
      career_interests: extraInfoForm.careerInterests
    })
    
    // 保存工作经验相关信息
    await profileStore.updateWorkInfo({
      work_years: extraInfoForm.workYears,
      experience_years: extraInfoForm.workYears, // 同步两个字段
      current_status: extraInfoForm.currentStatus,
      work_experience: extraInfoForm.workExperience,
      skills: extraInfoForm.skills.map(s => s.name),
      skill_tags: extraInfoForm.skillTags,
      interests: extraInfoForm.interests
    })
    
    // 保存性格特质
    await profileStore.updatePersonality({
      personality_traits: personalityTraits,
      learning_style: extraInfoForm.learningStyle
    })
    
    ElMessage.success('附加资料已保存')
  } catch (error) {
    console.error('保存附加资料失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

const cancelEditExtra = () => {
  isEditingExtra.value = false
  // 重新加载原始数据
  if (profileStore.hasProfile) {
    const profile = profileStore.userProfile
    extraInfoForm.expectedPositions = profile.preferred_positions || []
    extraInfoForm.expectedIndustries = profile.preferred_industries || []
    extraInfoForm.expectedSalary = profile.salary_expectation || ''
    extraInfoForm.workYears = profile.work_years || 0
    extraInfoForm.currentStatus = profile.current_status || ''
    extraInfoForm.workExperience = profile.work_experience || ''
    
    // 加载职业兴趣方向
    if (profile.career_interests) {
      try {
        const careerInterests = typeof profile.career_interests === 'string' 
          ? JSON.parse(profile.career_interests) 
          : profile.career_interests
        extraInfoForm.careerInterests = {
          arts: careerInterests.arts || 5,
          science: careerInterests.science || 5,
          business: careerInterests.business || 5,
          technology: careerInterests.technology || 5
        }
      } catch (e) {
        console.error('解析职业兴趣数据失败:', e)
      }
    }
    
    // 加载学习风格
    if (profile.learning_style) {
      try {
        const learningStyle = typeof profile.learning_style === 'string' 
          ? JSON.parse(profile.learning_style) 
          : profile.learning_style
        extraInfoForm.learningStyle = {
          visual: learningStyle.visual || 5,
          reading: learningStyle.reading || 5,
          auditory: learningStyle.auditory || 5,
          kinesthetic: learningStyle.kinesthetic || 5
        }
      } catch (e) {
        console.error('解析学习风格数据失败:', e)
      }
    }
    
    // 工作风格
    extraInfoForm.workingStyle = []
    const workStyle = typeof profile.work_style === 'string' 
      ? JSON.parse(profile.work_style) 
      : profile.work_style || {}
      
    // 根据工作风格数据设置选项
    if (workStyle.teamwork > 6) extraInfoForm.workingStyle.push('team_collaboration')
    if (workStyle.independent > 6) extraInfoForm.workingStyle.push('independent_thinking')
    if (workStyle.remote > 6) extraInfoForm.workingStyle.push('remote_work')
    if (workStyle.office > 6) extraInfoForm.workingStyle.push('office_work')
    
    // 性格特质
    const personalityTraits = typeof profile.personality_traits === 'string'
      ? JSON.parse(profile.personality_traits)
      : profile.personality_traits || {}
      
    extraInfoForm.mbtiType = personalityTraits.mbtiType || ''
    
    // 根据性格特质添加工作风格
    if (personalityTraits.conscientiousness > 7) extraInfoForm.workingStyle.push('detail_oriented')
    if (personalityTraits.openness > 7) extraInfoForm.workingStyle.push('innovation_driven')
    if (personalityTraits.analytical > 7) extraInfoForm.workingStyle.push('analytical_thinking')
  }
}

// 更换简历处理
const hiddenFileInput = ref<HTMLInputElement | null>(null)

const handleReplaceClick = () => {
  if (hiddenFileInput.value) {
    hiddenFileInput.value.click()
  }
}

const handleFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (beforeResumeUpload(file)) {
      handleResumeUpload(file)
    }
    // 重置input，允许选择相同文件
    target.value = ''
  }
}

const statusOptions = [
  { value: 'employed', label: '在职' },
  { value: 'unemployed', label: '待业' },
  { value: 'looking', label: '在职找工作' },
  { value: 'student', label: '学生' },
  { value: 'intern', label: '实习' },
  { value: 'freelancer', label: '自由职业' }
]

// 星级评定颜色
const rateColors = ['#DCDFE6', '#F0F9EB', '#ECEEFD', '#FDF6EC', '#FEF0F0']

// 处理星级评分变化
const handleRateChange = (value: number, type: 'learningStyle' | 'careerInterests', key: string) => {
  // 将5分制换算为10分制
  const normalizedValue = value * 2
  if (type === 'learningStyle') {
    extraInfoForm.learningStyle[key] = normalizedValue
  } else {
    extraInfoForm.careerInterests[key] = normalizedValue
  }
}

// 格式化日期显示
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (e) {
    return dateStr;
  }
}

// 获取技能等级文本描述
const getSkillLevelText = (level: number) => {
  switch (level) {
    case 1: return '入门级';
    case 2: return '基础级';
    case 3: return '中级';
    case 4: return '高级';
    case 5: return '专家级';
    default: return '';
  }
}

// 获取进度条颜色
const getProgressColor = (value: number) => {
  if (value <= 2) return rateColors[0];
  if (value <= 4) return rateColors[1];
  return rateColors[2];
}

// 初始化
onMounted(async () => {
  await profileStore.initUserProfile()
  fetchUserResumes()
  
  if (profileStore.hasProfile) {
    const profile = profileStore.userProfile
    extraInfoForm.expectedPositions = profile.preferred_positions || []
    extraInfoForm.expectedIndustries = profile.preferred_industries || []
    extraInfoForm.expectedSalary = profile.salary_expectation || ''
    extraInfoForm.workYears = profile.work_years || 0
    extraInfoForm.currentStatus = profile.current_status || ''
    extraInfoForm.workExperience = profile.work_experience || ''
    
    // 加载技能标签和兴趣爱好
    extraInfoForm.skillTags = Array.isArray(profile.skill_tags) ? profile.skill_tags : 
                            (typeof profile.skill_tags === 'string' ? JSON.parse(profile.skill_tags) : [])
    extraInfoForm.interests = Array.isArray(profile.interests) ? profile.interests : 
                            (typeof profile.interests === 'string' ? JSON.parse(profile.interests) : [])
    
    // 加载职业兴趣方向
    if (profile.career_interests) {
      try {
        const careerInterests = typeof profile.career_interests === 'string' 
          ? JSON.parse(profile.career_interests) 
          : profile.career_interests
        extraInfoForm.careerInterests = {
          arts: careerInterests.arts || 5,
          science: careerInterests.science || 5,
          business: careerInterests.business || 5,
          technology: careerInterests.technology || 5
        }
      } catch (e) {
        console.error('解析职业兴趣数据失败:', e)
      }
    }
    
    // 加载学习风格
    if (profile.learning_style) {
      try {
        const learningStyle = typeof profile.learning_style === 'string' 
          ? JSON.parse(profile.learning_style) 
          : profile.learning_style
        extraInfoForm.learningStyle = {
          visual: learningStyle.visual || 5,
          reading: learningStyle.reading || 5,
          auditory: learningStyle.auditory || 5,
          kinesthetic: learningStyle.kinesthetic || 5
        }
      } catch (e) {
        console.error('解析学习风格数据失败:', e)
      }
    }
    
    // 工作风格
    extraInfoForm.workingStyle = []
    const workStyle = typeof profile.work_style === 'string' 
      ? JSON.parse(profile.work_style) 
      : profile.work_style || {}
      
    // 根据工作风格数据设置选项
    if (workStyle.teamwork > 6) extraInfoForm.workingStyle.push('team_collaboration')
    if (workStyle.independent > 6) extraInfoForm.workingStyle.push('independent_thinking')
    if (workStyle.remote > 6) extraInfoForm.workingStyle.push('remote_work')
    if (workStyle.office > 6) extraInfoForm.workingStyle.push('office_work')
    
    // 性格特质
    const personalityTraits = typeof profile.personality_traits === 'string'
      ? JSON.parse(profile.personality_traits)
      : profile.personality_traits || {}
      
    extraInfoForm.mbtiType = personalityTraits.mbtiType || ''
    
    // 根据性格特质添加工作风格
    if (personalityTraits.conscientiousness > 7) extraInfoForm.workingStyle.push('detail_oriented')
    if (personalityTraits.openness > 7) extraInfoForm.workingStyle.push('innovation_driven')
    if (personalityTraits.analytical > 7) extraInfoForm.workingStyle.push('analytical_thinking')
  }
  
  // 转换10分制到5分制显示
  Object.keys(extraInfoForm.learningStyle).forEach(key => {
    // 将10分制数据临时转换为5分制显示
    extraInfoForm.learningStyle[key] = Math.round(extraInfoForm.learningStyle[key] / 2)
  })
  
  Object.keys(extraInfoForm.careerInterests).forEach(key => {
    // 将10分制数据临时转换为5分制显示
    extraInfoForm.careerInterests[key] = Math.round(extraInfoForm.careerInterests[key] / 2)
  })
})
</script>

<style scoped>
.profile-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  min-height: calc(100vh - 60px);
}

.profile-card {
  margin-bottom: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  background: #ffffff;
}

.profile-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 2px solid #ebeef5;
  background: #f0f8ff;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  position: relative;
  padding-left: 18px;
}

.card-header h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 24px;
  background-color: #409eff;
  border-radius: 3px;
}

.profile-info-card {
  background-color: #fff;
}

.profile-form {
  padding: 10px;
}

.profile-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9fafc;
  border-radius: 8px;
  transition: all 0.3s;
}

.profile-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.section-icon {
  font-size: 22px;
  margin-right: 10px;
  color: var(--el-color-primary);
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.add-skill-btn {
  position: absolute;
  right: 0;
  top: 0;
}

.section-content {
  padding: 10px 0;
}

.full-width-select {
  width: 100%;
}

.mt-20 {
  margin-top: 20px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.skill-card {
  padding: 15px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.skill-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.skill-name {
  font-weight: 600;
  color: #303133;
}

.no-skills-placeholder {
  grid-column: 1 / -1;
  padding: 30px;
  text-align: center;
}

.learning-styles-grid,
.interest-chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.learning-style-item,
.interest-chart-item {
  background-color: #fff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.learning-style-info,
.interest-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.learning-style-label,
.interest-label {
  font-weight: 600;
  color: #303133;
}

.learning-style-value,
.interest-value {
  font-weight: 600;
  color: var(--el-color-primary);
}

.learning-style-progress,
.interest-progress {
  margin-bottom: 10px;
}

.learning-style-rating,
.interest-rating {
  display: flex;
  justify-content: flex-start;
}

.interest-chart-title {
  font-size: 16px;
  margin: 20px 0 10px;
  color: #606266;
}

.skill-level-selector {
  display: flex;
  align-items: center;
}

.skill-level-text {
  margin-left: 15px;
  color: #909399;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-section {
    padding: 15px;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .learning-styles-grid,
  .interest-chart-grid {
    grid-template-columns: 1fr;
  }
}
</style> 