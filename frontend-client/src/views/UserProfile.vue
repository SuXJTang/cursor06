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
                  class="resume-uploader"
                  :before-upload="beforeResumeUpload"
                  :http-request="handleUploadRequest"
                  :show-file-list="true"
                  :limit="5"
                  accept=".pdf,.doc,.docx"
                  drag
                >
                  <el-icon class="el-icon--upload"><Upload /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处或 <em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持PDF、Word格式，单个文件不超过10MB，最多上传5份简历
                    </div>
                  </template>
                </el-upload>
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
              <h3>已上传简历：</h3>
              <el-table :data="resumeList" style="width: 100%">
                <el-table-column prop="name" label="文件名" />
                <el-table-column prop="type" label="类型" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.type === 'pdf' ? 'danger' : 'primary'">
                      {{ scope.row.type.toUpperCase() }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" width="180" />
                <el-table-column label="默认" width="100">
                  <template #default="scope">
                    <el-tag v-if="scope.row.is_default" type="success">默认</el-tag>
                    <el-tag v-else type="info">非默认</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                  <template #default="scope">
                    <el-button type="primary" link @click="previewResume(scope.row)">
                      预览
                    </el-button>
                    <el-button v-if="!scope.row.is_default" type="success" link @click="setDefaultResume(scope.row)">
                      设为默认
                    </el-button>
                    <el-button type="danger" link @click="removeResume(scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>

        <!-- 附加信息卡片 -->
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <h2>附加资料</h2>
              <el-button type="primary" @click="isEditingExtra = !isEditingExtra">
                {{ isEditingExtra ? '保存' : '编辑' }}
              </el-button>
            </div>
          </template>

          <div class="extra-info-content">
            <el-form
              ref="extraInfoFormRef"
              :model="extraInfoForm"
              :disabled="!isEditingExtra"
              label-width="120px"
            >
              <h3>职业偏好</h3>
              <el-form-item label="期望职位">
                <el-select
                  v-model="extraInfoForm.expectedPositions"
                  placeholder="请选择期望职位"
                  multiple
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="item in positionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="期望行业">
                <el-select
                  v-model="extraInfoForm.expectedIndustries"
                  placeholder="请选择期望行业"
                  multiple
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="item in industryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="期望薪资">
                <el-select
                  v-model="extraInfoForm.expectedSalary"
                  placeholder="请选择期望薪资范围"
                >
                  <el-option
                    v-for="item in salaryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <h3>技能评估</h3>
              <el-form-item label="专业技能">
                <el-tag
                  v-for="skill in extraInfoForm.skills"
                  :key="skill.id"
                  class="skill-tag"
                  closable
                  :disable-transitions="false"
                  @close="handleSkillClose(skill)"
                >
                  {{ skill.name }}
                </el-tag>
                <el-button
                  v-if="isEditingExtra"
                  class="add-button"
                  size="small"
                  @click="showAddSkillDialog = true"
                >
                  + 添加技能
                </el-button>
              </el-form-item>
              
              <el-form-item label="语言能力">
                <el-select
                  v-model="extraInfoForm.languages"
                  placeholder="请选择掌握的语言"
                  multiple
                >
                  <el-option
                    v-for="item in languageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <h3>性格与工作风格</h3>
              <el-form-item label="MBTI类型">
                <el-select
                  v-model="extraInfoForm.mbtiType"
                  placeholder="请选择您的MBTI类型"
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
              
              <el-form-item label="工作风格">
                <el-select
                  v-model="extraInfoForm.workingStyle"
                  placeholder="请选择您的工作风格"
                  multiple
                >
                  <el-option
                    v-for="item in workingStyleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="handleExtraInfoSubmit" :disabled="!isEditingExtra">
                  保存
                </el-button>
                <el-button @click="cancelEditExtra" v-if="isEditingExtra">
                  取消
                </el-button>
              </el-form-item>
            </el-form>
          </div>
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
import { useProfileStore } from '@/stores/profile'
import type { FormInstance, FormRules } from 'element-plus'
import { uploadResume, getUserResumes, setDefaultResume as setDefaultResumeAPI, deleteResume as deleteResumeAPI } from '@/api/profile'

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
    const resumes = await getUserResumes()
    resumeList.value = resumes.map(resume => ({
      ...resume,
      uploadTime: new Date(resume.created_at).toLocaleString()
    }))
  } catch (error) {
    console.error('获取简历列表失败:', error)
    ElMessage.error('获取简历列表失败')
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
    const { file_id, file_url } = await uploadResume(file)
    
    resumeList.value.push({
      id: file_id,
      name: file.name,
      type: file.name.split('.').pop() || '',
      url: file_url,
      is_default: resumeList.value.length === 0,
      uploadTime: new Date().toLocaleString()
    })
    
    ElMessage.success('简历上传成功')
  } catch (error) {
    console.error('简历上传失败:', error)
    ElMessage.error('简历上传失败，请重试')
  }
}

const removeResume = async (resume: any) => {
  try {
    await deleteResumeAPI(resume.id)
    const index = resumeList.value.findIndex((item: any) => item.id === resume.id)
    if (index !== -1) {
      resumeList.value.splice(index, 1)
      ElMessage.success('简历删除成功')
    }
  } catch (error) {
    console.error('删除简历失败:', error)
    ElMessage.error('删除简历失败，请重试')
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
  skills: [] as Array<{id: string, name: string, level: number, categoryId: string}>,
  languages: [] as string[],
  mbtiType: '',
  workingStyle: [] as string[]
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
      { label: 'ENTP', value: 'ENTP', description: '发明家型' }
    ]
  },
  {
    label: '感知-直觉',
    options: [
      { label: 'INFJ', value: 'INFJ', description: '咨询师型' },
      { label: 'INFP', value: 'INFP', description: '治愈者型' },
      { label: 'INTJ', value: 'INTJ', description: '建筑师型' },
      { label: 'INTP', value: 'INTP', description: '逻辑学家型' }
    ]
  }
]

// 工作风格选项
const workingStyleOptions = [
  { label: '独立思考', value: 'independent_thinking' },
  { label: '团队协作', value: 'team_collaboration' },
  { label: '创新驱动', value: 'innovation_driven' },
  { label: '目标导向', value: 'goal_oriented' },
  { label: '细节关注', value: 'detail_oriented' }
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
    // 保存到服务器
    if (!extraInfoFormRef.value) return;

    // 首先保存职业兴趣相关信息
    await profileStore.updateCareerInterests({
      preferred_industries: extraInfoForm.expectedIndustries,
      preferred_positions: extraInfoForm.expectedPositions,
      salary_expectation: extraInfoForm.expectedSalary,
      work_style: {
        teamwork: extraInfoForm.workingStyle.includes('team_collaboration') ? 5 : 2,
        independent: extraInfoForm.workingStyle.includes('independent_thinking') ? 5 : 2,
        office: 3, // 默认值
        remote: 3, // 默认值
      }
    });

    // 然后保存性格特征相关信息
    await profileStore.updatePersonality({
      personality_traits: {
        openness: 5, // 示例值，实际应从表单中获取
        conscientiousness: extraInfoForm.workingStyle.includes('detail_oriented') ? 5 : 3,
        extraversion: 3, // 默认值
        agreeableness: 3, // 默认值
        neuroticism: 3, // 默认值
      },
      learning_style: {
        visual: 4, // 示例值
        reading: 4, // 示例值
        auditory: 3, // 示例值
        kinesthetic: 3, // 示例值
      }
    });

    isEditingExtra.value = false;
  } catch (error) {
    console.error('保存附加信息失败:', error);
    ElMessage.error('保存失败，请重试');
  }
};

const cancelEditExtra = async () => {
  isEditingExtra.value = false;
  
  // 重新从store加载数据
  const profile = profileStore.userProfile;
  if (profile) {
    // 重置职业兴趣相关信息
    extraInfoForm.expectedPositions = profile.preferred_positions || [];
    extraInfoForm.expectedIndustries = profile.preferred_industries || [];
    extraInfoForm.expectedSalary = profile.salary_expectation || '';
    
    // 重置性格和工作风格相关信息
    const workStyle = profile.work_style || {};
    extraInfoForm.workingStyle = [];
    
    // 根据工作风格重新设置工作风格选项
    if (typeof workStyle === 'object') {
      if (workStyle.teamwork && workStyle.teamwork > 3) {
        extraInfoForm.workingStyle.push('team_collaboration');
      }
      if (workStyle.independent && workStyle.independent > 3) {
        extraInfoForm.workingStyle.push('independent_thinking');
      }
    }
    
    // 重置其他信息
    ElMessage.info('表单已重置');
  }
};

// 初始化
onMounted(async () => {
  // 初始化用户资料
  await profileStore.initUserProfile();
  
  // 获取用户简历
  await fetchUserResumes();
  
  // 如果有个人资料，加载到表单中
  if (profileStore.hasProfile) {
    const profile = profileStore.userProfile;
    if (profile) {
      // 加载职业兴趣相关信息
      extraInfoForm.expectedPositions = profile.preferred_positions || [];
      extraInfoForm.expectedIndustries = profile.preferred_industries || [];
      extraInfoForm.expectedSalary = profile.salary_expectation || '';
      
      // 加载工作风格
      extraInfoForm.workingStyle = [];
      const workStyle = profile.work_style || {};
      
      // 根据工作风格设置工作风格选项
      if (typeof workStyle === 'object') {
        if (workStyle.teamwork && workStyle.teamwork > 3) {
          extraInfoForm.workingStyle.push('team_collaboration');
        }
        if (workStyle.independent && workStyle.independent > 3) {
          extraInfoForm.workingStyle.push('independent_thinking');
        }
        // 可以根据其他指标添加更多工作风格
      }
      
      // 加载性格特质
      const personality = profile.personality_traits || {};
      if (typeof personality === 'object') {
        if (personality.conscientiousness && personality.conscientiousness > 4) {
          extraInfoForm.workingStyle.push('detail_oriented');
        }
        if (personality.openness && personality.openness > 4) {
          extraInfoForm.workingStyle.push('innovation_driven');
        }
      }
    }
  }
});
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resume-upload {
  margin-bottom: 20px;
}

.url-import {
  margin: 20px 0;
}

.url-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.resume-list {
  margin-top: 20px;
}

.skill-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.add-button {
  height: 32px;
  line-height: 30px;
  padding: 0 12px;
  font-size: 12px;
}

.extra-info-content {
  padding: 10px;
}

h3 {
  margin: 20px 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style> 