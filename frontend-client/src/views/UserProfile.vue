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

        <!-- 附加信息卡片 -->
        <el-card class="profile-card card-with-sections">
          <template #header>
            <div class="card-header">
              <h2>附加资料</h2>
              <el-button type="primary" @click="isEditingExtra = true" v-if="!isEditingExtra">
                编辑
              </el-button>
            </div>
          </template>
          <el-form label-position="top" class="extra-info-form">
            <!-- 职业偏好部分 -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon"><i class="el-icon-suitcase"></i></div>
              <h3>职业偏好</h3>
              </div>
              <div class="section-content">
                <el-row :gutter="20">
                  <el-col :span="12">
              <el-form-item label="期望职位">
                <el-select
                  v-model="extraInfoForm.expectedPositions"
                  multiple
                        placeholder="请选择期望职位" 
                        style="width: 100%"
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
                  <el-col :span="12">
              <el-form-item label="期望行业">
                <el-select
                  v-model="extraInfoForm.expectedIndustries"
                  multiple
                        placeholder="请选择期望行业" 
                        style="width: 100%"
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
                    style="width: 100%"
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
            
            <!-- 工作经验部分 -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon"><i class="el-icon-briefcase"></i></div>
                <h3>工作经验</h3>
              </div>
              <div class="section-content">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="工作年限">
                      <el-input-number 
                        v-model="extraInfoForm.workYears" 
                        :min="0" 
                        :max="50" 
                        :step="1" 
                        :disabled="!isEditingExtra"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="当前状态">
                      <el-select 
                        v-model="extraInfoForm.currentStatus" 
                        placeholder="请选择当前工作状态" 
                        style="width: 100%"
                        :disabled="!isEditingExtra"
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
                <el-form-item label="工作经验详情">
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
            
            <!-- 技能评估部分 -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon"><i class="el-icon-trophy"></i></div>
              <h3>技能评估</h3>
              </div>
              <div class="section-content">
              <el-form-item label="专业技能">
                  <div class="skills-container">
                <el-tag
                  v-for="skill in extraInfoForm.skills"
                  :key="skill.id"
                  closable
                  :disable-transitions="false"
                  @close="handleSkillClose(skill)"
                      :class="`skill-tag skill-level-${skill.level}`"
                      :disable-closing="!isEditingExtra"
                >
                      {{ skill.name }} ({{ skill.level }}/5)
                </el-tag>
                    <el-button class="button-new-skill" size="small" @click="showAddSkillDialog = true" v-if="isEditingExtra">
                  + 添加技能
                </el-button>
                  </div>
              </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="12">
              <el-form-item label="语言能力">
                <el-select
                  v-model="extraInfoForm.languages"
                  multiple
                        placeholder="请选择掌握的语言" 
                        style="width: 100%"
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
                  <el-col :span="12">
                    <el-form-item label="技能标签">
                      <el-select
                        v-model="extraInfoForm.skillTags"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择或输入技能标签"
                        style="width: 100%"
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
            
            <!-- 性格与工作风格部分 -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon"><i class="el-icon-user"></i></div>
              <h3>性格与工作风格</h3>
              </div>
              <div class="section-content">
                <el-row :gutter="20">
                  <el-col :span="12">
              <el-form-item label="MBTI类型">
                <el-select
                  v-model="extraInfoForm.mbtiType"
                  placeholder="请选择您的MBTI类型"
                        style="width: 100%"
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
                  <el-col :span="12">
              <el-form-item label="工作风格">
                <el-select
                  v-model="extraInfoForm.workingStyle"
                  multiple
                        collapse-tags
                        placeholder="请选择您的工作风格" 
                        style="width: 100%"
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

            <!-- 学习风格部分 -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon"><i class="el-icon-reading"></i></div>
                <h3>学习风格</h3>
              </div>
              <div class="section-content">
                <div class="rating-container">
                  <div v-for="(item, index) in learningStyleOptions" :key="index" class="rating-item">
                    <div class="rating-label">{{item.label}}</div>
                    <div class="rating-value">
                      <div class="rating-stars">
                        <el-rate
                          v-model="extraInfoForm.learningStyle[item.value]"
                          :max="5"
                          :disabled="!isEditingExtra"
                          :colors="rateColors"
                          show-score
                          :score-template="`{value}`"
                          @change="handleRateChange($event, 'learningStyle', item.value)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 兴趣爱好部分 -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon"><i class="el-icon-star-off"></i></div>
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
                    style="width: 100%"
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
                
                <div class="rating-container">
                  <h4 class="slider-group-title">职业兴趣方向</h4>
                  <div v-for="(item, index) in careerInterestOptions" :key="index" class="rating-item">
                    <div class="rating-label">{{item.label}}</div>
                    <div class="rating-value">
                      <div class="rating-stars">
                        <el-rate
                          v-model="extraInfoForm.careerInterests[item.value]"
                          :max="5"
                          :disabled="!isEditingExtra"
                          :colors="rateColors"
                          show-score
                          :score-template="`{value}`"
                          @change="handleRateChange($event, 'careerInterests', item.value)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
                <el-button type="primary" @click="handleExtraInfoSubmit" :disabled="!isEditingExtra">
                  保存
                </el-button>
                <el-button @click="cancelEditExtra" v-if="isEditingExtra">
                  取消
                </el-button>
          </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 添加技能对话框 -->
    <el-dialog
      v-model="showAddSkillDialog"
      title="添加技能"
      width="500px"
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
          <el-rate v-model="skillForm.level" :max="5" />
        </el-form-item>
        
        <el-form-item label="技能类别" prop="categoryId">
          <el-select v-model="skillForm.categoryId" placeholder="请选择技能类别">
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
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

.form-section {
  margin-bottom: 35px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e6f0ff;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background-color: #f0f8ff;
  border-bottom: 2px solid #e6f0ff;
}

.section-icon {
  margin-right: 15px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #409eff;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.5px;
}

.section-content {
  padding: 30px;
  background-color: #fff;
}

/* 表单元素美化 */
:deep(.el-form-item__label) {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s;
  padding: 12px 15px;
  background-color: #f9fbff;
  border: 1px solid #e6f0ff;
}

:deep(.el-input__inner) {
  font-size: 16px;
  color: #333;
  height: 48px;
}

:deep(.el-textarea__inner) {
  font-size: 16px;
  padding: 12px 15px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 3px 12px rgba(64, 158, 255, 0.15) !important;
  border-color: #a0cfff;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px #409eff inset, 0 5px 15px rgba(64, 158, 255, 0.2) !important;
  border-color: #409eff;
  background-color: #ffffff;
}

:deep(.el-select__tags) {
  flex-wrap: wrap;
  margin: 3px 0;
}

:deep(.el-tag) {
  margin: 2px 4px;
  font-size: 14px;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
}

:deep(.el-select-dropdown__item) {
  font-size: 16px;
  padding: 12px 20px;
  border-radius: 6px;
  margin: 4px 8px;
}

:deep(.el-select-dropdown__item.selected) {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 600;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 18px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 20px;
  background-color: #ecf5ff;
  color: #409eff;
  border: none;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  margin: 5px 8px 5px 0;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.skill-level-1 { 
  background: #f0f9eb;
  color: #67c23a; 
}

.skill-level-2 { 
  background: #f3f4f6; 
  color: #606266; 
}

.skill-level-3 { 
  background: #ecf5ff; 
  color: #409eff; 
}

.skill-level-4 { 
  background: #fdf6ec; 
  color: #e6a23c; 
}

.skill-level-5 { 
  background: #fef0f0; 
  color: #f56c6c; 
}

.button-new-skill {
  height: 40px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #409eff;
  border: none;
  border-radius: 20px;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
}

.button-new-skill:hover {
  background: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(64, 158, 255, 0.4);
}

.form-actions {
  margin-top: 40px;
  padding: 25px 30px;
  text-align: center;
  border-top: 2px solid #ebeef5;
  background-color: #f0f8ff;
}

:deep(.el-button) {
  height: 48px;
  padding: 0 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
}

:deep(.el-button--primary) {
  background: #409eff;
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

:deep(.el-button--primary:hover) {
  background: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

:deep(.el-button--danger) {
  background: #f56c6c;
  border: none;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

:deep(.el-button--danger:hover) {
  background: #f78989;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
}

:deep(.el-button--success) {
  background: #67c23a;
  border: none;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

:deep(.el-button--success:hover) {
  background: #85ce61;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}

.rating-container {
  padding: 10px 0;
}

.rating-item {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding: 16px 25px;
  border-radius: 12px;
  background-color: #f9fbff;
  transition: all 0.3s;
  border: 1px solid #e6f0ff;
}

.rating-item:hover {
  background-color: #f0f8ff;
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.12);
  transform: translateY(-2px);
}

.rating-label {
  width: 140px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  flex-shrink: 0;
}

.rating-value {
  flex: 1;
  display: flex;
  align-items: center;
}

.rating-stars {
  flex: 1;
}

:deep(.el-rate) {
  height: 30px;
  line-height: 30px;
}

:deep(.el-rate__icon) {
  font-size: 28px;
  margin-right: 8px;
}

:deep(.el-rate__decimal) {
  top: 0;
}

:deep(.el-rate__text) {
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
  margin-left: 12px;
}

/* 自定义评分颜色 */
:deep(.el-rate__item:nth-child(1) .el-rate__icon.el-rate__icon--full) {
  color: #F0F9EB;
}

:deep(.el-rate__item:nth-child(2) .el-rate__icon.el-rate__icon--full) {
  color: #ECEEFD;
}

:deep(.el-rate__item:nth-child(3) .el-rate__icon.el-rate__icon--full) {
  color: #ECF5FF;
}

:deep(.el-rate__item:nth-child(4) .el-rate__icon.el-rate__icon--full) {
  color: #FDF6EC;
}

:deep(.el-rate__item:nth-child(5) .el-rate__icon.el-rate__icon--full) {
  color: #FEF0F0;
}

@media screen and (max-width: 768px) {
  .rating-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
  
  .rating-label {
    width: 100%;
    margin-bottom: 15px;
  }
  
  :deep(.el-rate__icon) {
    font-size: 24px;
    margin-right: 6px;
  }
}

.resume-list {
  margin-top: 30px;
}

.resume-list h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1a1a1a;
}

.resume-actions {
  display: flex;
  gap: 10px;
}

.resume-action-btn {
  font-size: 15px;
  font-weight: 600;
  height: 36px;
  min-width: 80px;
  border-radius: 8px;
  padding: 0 15px;
}

:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-border: none;
  --el-table-header-bg-color: #f0f8ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table__cell) {
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table td.el-table__cell) {
  border-right: none;
}

:deep(.el-table td.el-table__cell::before) {
  display: none;
}

:deep(.el-table th.el-table__cell::before) {
  display: none;
}

:deep(.el-table__header th) {
  background-color: #f0f8ff;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 700;
  height: 60px;
  border-right: none;
}

:deep(.el-table__row) {
  height: 70px;
  transition: all 0.3s;
}

:deep(.el-table__row:hover) {
  background-color: #f6faff;
}

.upload-time {
  font-size: 15px;
  color: #606266;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

/* 恢复简历替换区域样式 */
.resume-replace {
  margin: 24px 0;
  border: 2px dashed #d9ecff;
  border-radius: 12px;
  padding: 24px;
  background-color: #f8faff;
  transition: all 0.3s;
}

.resume-replace:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.replace-btn-container {
  margin-top: 20px;
  text-align: center;
}

/* 恢复简历相关区域样式 */
.resume-upload {
  margin-bottom: 20px;
}

.url-import {
  margin: 20px 0;
}

.url-tip {
  margin-top: 10px;
  font-size: 14px;
  color: #909399;
}
</style> 