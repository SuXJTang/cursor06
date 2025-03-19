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

        <!-- 个人资料信息 - 全新设计 -->
        <div class="profile-dashboard">
          <!-- 顶部编辑按钮区域 -->
          <div class="dashboard-header">
            <h2 class="dashboard-title">个人资料</h2>
            <el-button 
              :type="isEditingExtra ? 'success' : 'primary'" 
              @click="isEditingExtra ? handleExtraInfoSubmit() : isEditingExtra = true"
              class="edit-button"
            >
              {{ isEditingExtra ? '保存资料' : '编辑资料' }}
            </el-button>
          </div>
          
          <!-- 个人资料内容区 -->
          <div class="dashboard-content">
            <!-- 左侧栏 - 职业与技能 -->
            <div class="dashboard-column dashboard-column-left">
              <!-- 职业偏好卡片 -->
              <div class="profile-quick-card career-card">
                <div class="quick-card-header">
                  <i class="el-icon-suitcase"></i>
                  <span>职业偏好</span>
                </div>
                <div class="quick-card-content">
                  <div class="quick-form-row">
                    <div class="quick-form-item">
                      <span class="item-label">期望职位</span>
                      <el-select
                        v-model="extraInfoForm.expectedPositions"
                        placeholder="请选择" 
                        size="small"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in positionOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="quick-form-item">
                      <span class="item-label">期望行业</span>
                      <el-select
                        v-model="extraInfoForm.expectedIndustries"
                        placeholder="请选择" 
                        size="small"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in industryOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                  <div class="quick-form-row">
                    <div class="quick-form-item">
                      <span class="item-label">期望薪资</span>
                      <el-select
                        v-model="extraInfoForm.expectedSalary"
                        placeholder="请选择" 
                        size="small"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in salaryOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 工作经验卡片 -->
              <div class="profile-quick-card experience-card">
                <div class="quick-card-header">
                  <i class="el-icon-briefcase"></i>
                  <span>工作经验</span>
                </div>
                <div class="quick-card-content">
                  <div class="quick-form-row">
                    <div class="quick-form-item">
                      <span class="item-label">工作年限</span>
                      <el-input-number 
                        v-model="extraInfoForm.workYears" 
                        :min="0" 
                        :max="50" 
                        :step="1" 
                        size="small"
                        :disabled="!isEditingExtra"
                        controls-position="right"
                      />
                    </div>
                    <div class="quick-form-item">
                      <span class="item-label">当前状态</span>
                      <el-select 
                        v-model="extraInfoForm.currentStatus" 
                        placeholder="请选择" 
                        size="small"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in statusOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                  <div class="quick-form-item full-width">
                    <span class="item-label">工作经历描述</span>
                    <el-input 
                      v-model="extraInfoForm.workExperience" 
                      type="textarea" 
                      :rows="2"
                      placeholder="请简要描述您的工作经历" 
                      :disabled="!isEditingExtra"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 技能评估卡片 -->
              <div class="profile-quick-card skills-card">
                <div class="quick-card-header">
                  <i class="el-icon-trophy"></i>
                  <span>技能评估</span>
                  <el-button 
                    v-if="isEditingExtra" 
                    @click="showAddSkillDialog = true" 
                    type="primary" 
                    size="small" 
                    circle
                    class="add-btn"
                  >+</el-button>
                </div>
                <div class="quick-card-content">
                  <div class="skills-tag-container">
                    <div
                      v-for="skill in extraInfoForm.skills"
                      :key="skill.id"
                      class="skill-tag-item"
                    >
                      <div class="skill-tag-header">
                        <span>{{ skill.name }}</span>
                        <span class="skill-tag-level">{{ skill.level }}/5</span>
                        <i 
                          v-if="isEditingExtra" 
                          class="el-icon-close" 
                          @click="handleSkillClose(skill)"
                        ></i>
                      </div>
                      <el-progress 
                        :percentage="skill.level * 20" 
                        :color="getSkillColor(skill.level)"
                        :show-text="false"
                      />
                    </div>
                    <div 
                      v-if="extraInfoForm.skills.length === 0" 
                      class="no-skills-placeholder"
                    >
                      <p v-if="!isEditingExtra">暂无技能信息</p>
                      <el-button v-else type="dashed" @click="showAddSkillDialog = true">添加技能</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右侧栏 - 性格、学习和兴趣 -->
            <div class="dashboard-column dashboard-column-right">
              <!-- 性格与工作风格卡片 -->
              <div class="profile-quick-card personality-card">
                <div class="quick-card-header">
                  <i class="el-icon-user"></i>
                  <span>性格与工作风格</span>
                </div>
                <div class="quick-card-content">
                  <div class="quick-form-row">
                    <div class="quick-form-item">
                      <span class="item-label">MBTI类型</span>
                      <el-select
                        v-model="extraInfoForm.mbtiType"
                        placeholder="请选择"
                        size="small"
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
                    </div>
                  </div>
                  <div class="quick-form-item full-width">
                    <span class="item-label">工作风格</span>
                    <div class="tags-wrapper">
                      <el-select
                        v-model="extraInfoForm.workingStyle"
                        multiple
                        collapse-tags
                        placeholder="请选择" 
                        size="small"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in workingStyleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 学习风格卡片 -->
              <div class="profile-quick-card learning-card">
                <div class="quick-card-header">
                  <i class="el-icon-reading"></i>
                  <span>学习风格</span>
                </div>
                <div class="quick-card-content">
                  <div class="learning-styles-container">
                    <div 
                      v-for="(item, index) in learningStyleOptions" 
                      :key="index" 
                      class="learning-style-bar"
                    >
                      <div class="learning-bar-label">
                        <span>{{item.label}}</span>
                        <span>{{extraInfoForm.learningStyle[item.value]}}/5</span>
                      </div>
                      <div class="learning-bar-control">
                        <el-progress 
                          :percentage="extraInfoForm.learningStyle[item.value] * 20" 
                          :color="getLearningColor(extraInfoForm.learningStyle[item.value])"
                          :stroke-width="8"
                          :show-text="false"
                        />
                        <el-slider
                          v-if="isEditingExtra"
                          v-model="extraInfoForm.learningStyle[item.value]"
                          :min="1"
                          :max="5"
                          :show-tooltip="false"
                          @change="val => handleRateChange(val, 'learningStyle', item.value)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 兴趣爱好卡片 -->
              <div class="profile-quick-card interests-card">
                <div class="quick-card-header">
                  <i class="el-icon-star-off"></i>
                  <span>兴趣与职业方向</span>
                </div>
                <div class="quick-card-content">
                  <div class="quick-form-item full-width">
                    <span class="item-label">兴趣爱好</span>
                    <div class="tags-wrapper">
                      <el-select
                        v-model="extraInfoForm.interests"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择或输入" 
                        size="small"
                        :disabled="!isEditingExtra"
                      >
                        <el-option
                          v-for="item in interestOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                  <div class="interest-chart">
                    <span class="item-label">职业兴趣方向</span>
                    <div class="interest-radar-chart">
                      <div class="interest-radar-container">
                        <div 
                          v-for="(item, index) in careerInterestOptions" 
                          :key="index" 
                          class="interest-radar-item"
                          :style="{ 
                            '--radar-percent': extraInfoForm.careerInterests[item.value] * 20 + '%',
                            '--radar-color': getInterestColor(extraInfoForm.careerInterests[item.value])
                          }"
                        >
                          <div class="interest-radar-value">
                            <span>{{ item.label }}</span>
                            <span>{{ extraInfoForm.careerInterests[item.value] }}</span>
                          </div>
                          <div v-if="isEditingExtra" class="interest-radar-control">
                            <el-slider
                              v-model="extraInfoForm.careerInterests[item.value]"
                              :min="1"
                              :max="5"
                              :show-tooltip="false"
                              @change="val => handleRateChange(val, 'careerInterests', item.value)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="quick-form-item languages-item">
                <span class="item-label">语言能力</span>
                <div class="tags-wrapper">
                  <el-select
                    v-model="extraInfoForm.languages"
                    multiple
                    placeholder="请选择" 
                    size="small"
                    :disabled="!isEditingExtra"
                  >
                    <el-option
                      v-for="item in languageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
              
              <div class="quick-form-item skill-tags-item">
                <span class="item-label">技能标签</span>
                <div class="tags-wrapper">
                  <el-select
                    v-model="extraInfoForm.skillTags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入" 
                    size="small"
                    :disabled="!isEditingExtra"
                  >
                    <el-option
                      v-for="item in skillTagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 添加技能对话框 -->
    <el-dialog
      v-model="showAddSkillDialog"
      title="添加技能"
      width="400px"
      destroy-on-close
    >
      <el-form
        ref="skillFormRef"
        :model="skillForm"
        :rules="skillRules"
        label-width="80px"
        size="small"
      >
        <el-form-item label="技能名称" prop="name">
          <el-input v-model="skillForm.name" placeholder="请输入技能名称" />
        </el-form-item>
        
        <el-form-item label="技能等级" prop="level">
          <div class="skill-level-control">
            <el-slider
              v-model="skillForm.level"
              :min="1"
              :max="5"
              :show-tooltip="true"
              :format-tooltip="getSkillLevelText"
            />
          </div>
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
          <el-button size="small" @click="closeSkillDialog">取消</el-button>
          <el-button size="small" type="primary" @click="submitSkill">确定</el-button>
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

// 获取技能颜色
const getSkillColor = (level: number) => {
  const colors = ['#909399', '#67C23A', '#409EFF', '#E6A23C', '#F56C6C'];
  return colors[level - 1 < 0 ? 0 : level - 1];
}

// 获取学习风格颜色
const getLearningColor = (value: number) => {
  if (value <= 2) return '#909399';
  if (value <= 3) return '#67C23A';
  if (value <= 4) return '#409EFF';
  return '#F56C6C';
}

// 获取兴趣颜色
const getInterestColor = (value: number) => {
  if (value <= 2) return '#909399';
  if (value <= 3) return '#67C23A';
  if (value <= 4) return '#409EFF';
  return '#F56C6C';
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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.profile-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
}

.profile-dashboard {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #409EFF 0%, #64B5F6 100%);
  color: white;
}

.dashboard-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.edit-button {
  font-size: 14px;
  padding: 8px 12px;
}

.dashboard-content {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  gap: 15px;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dashboard-column-left {
  flex: 1;
  min-width: 300px;
}

.dashboard-column-right {
  flex: 1;
  min-width: 300px;
}

.profile-quick-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s;
}

.profile-quick-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-card-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.quick-card-header i {
  margin-right: 8px;
  font-size: 16px;
}

.quick-card-content {
  padding: 12px 15px;
}

.quick-form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.quick-form-item {
  flex: 1;
  min-width: 0;
  margin-bottom: 10px;
}

.full-width {
  width: 100%;
}

.item-label {
  display: block;
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
}

.skills-tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag-item {
  width: 100%;
  padding: 8px 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.skill-tag-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 13px;
}

.skill-tag-level {
  font-weight: 600;
  color: #409EFF;
}

.no-skills-placeholder {
  width: 100%;
  text-align: center;
  padding: 15px 0;
  color: #909399;
}

.learning-styles-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.learning-style-bar {
  width: 100%;
}

.learning-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 5px;
}

.learning-bar-control {
  width: 100%;
}

.interest-chart {
  margin-top: 10px;
}

.interest-radar-chart {
  margin-top: 10px;
}

.interest-radar-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.interest-radar-item {
  position: relative;
  height: 30px;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.interest-radar-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--radar-percent, 0%);
  background-color: var(--radar-color, #409EFF);
  opacity: 0.2;
}

.interest-radar-value {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  height: 100%;
  align-items: center;
  font-size: 13px;
}

.interest-radar-control {
  padding: 0 10px;
  margin-top: 5px;
}

.add-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 12px;
}

.career-card .quick-card-header {
  border-left: 3px solid #409EFF;
}

.experience-card .quick-card-header {
  border-left: 3px solid #67C23A;
}

.skills-card .quick-card-header {
  border-left: 3px solid #E6A23C;
}

.personality-card .quick-card-header {
  border-left: 3px solid #F56C6C;
}

.learning-card .quick-card-header {
  border-left: 3px solid #909399;
}

.interests-card .quick-card-header {
  border-left: 3px solid #9C27B0;
}

.languages-item,
.skill-tags-item {
  margin-top: 15px;
  background: white;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.tags-wrapper {
  width: 100%;
}

.skill-level-control {
  width: 100%;
  padding: 5px 0;
}

@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .quick-form-row {
    flex-direction: column;
  }
}
</style> 