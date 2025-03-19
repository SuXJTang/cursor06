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
      </el-col>
    </el-row>

    <!-- 附加资料区域 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <h2>附加资料</h2>
            </div>
          </template>
          
          <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px 0;">
            <el-empty description="附加资料功能开发中，敬请期待..." />
            <el-alert
              title="该功能将允许您上传项目文档、获奖证书等辅助材料，丰富您的个人档案"
              type="info"
              :closable="false"
              show-icon
            />
              </div>
        </el-card>
      </el-col>
    </el-row>
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
const activeUploadTab = ref('local')
const resumeUrl = ref('')
const resumeList = ref<any[]>([])
const hiddenFileInput = ref<HTMLInputElement | null>(null)
const uploadLoading = ref(false)

// 获取用户简历列表
const getUserResumes = async () => {
  try {
    const resumes = await getUserResumesAPI()
    console.log('获取到的简历列表:', resumes)
    if (resumes && Array.isArray(resumes)) {
      resumeList.value = resumes.map(item => ({
        ...item,
        uploadTime: item.created_at,
        type: item.name.split('.').pop() || 'unknown'
      }))
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    ElMessage.error('获取简历列表失败')
  }
}

// 上传前验证
const beforeResumeUpload = (file: File) => {
  const isValidType = /\.(pdf|doc|docx)$/i.test(file.name)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('简历必须是PDF或Word文档!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('简历不能超过10MB!')
    return false
  }
  return true
}

// 处理上传请求
const handleUploadRequest = async (options: any) => {
  try {
    uploadLoading.value = true
  const { file } = options
    
    // 直接使用文件进行上传，而不是FormData
    const result = await uploadResumeAPI(file)
    
    ElMessage.success('简历上传成功')
    await getUserResumes() // 刷新简历列表
  } catch (error) {
    console.error('简历上传失败:', error)
    ElMessage.error('简历上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

// 预览简历
const previewResume = (resume: any) => {
  window.open(resume.url, '_blank')
}

// 删除简历
const removeResume = async (resume: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这份简历吗？此操作不可逆', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      type: 'warning'
    })
    
    await forceDeleteRecordAPI(resume.id)
          ElMessage.success('简历已删除')
    await getUserResumes() // 刷新简历列表
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除简历失败:', error)
      ElMessage.error('删除简历失败')
    }
  }
}

// 处理替换简历按钮点击
const handleReplaceClick = () => {
  hiddenFileInput.value?.click()
}

// 处理文件输入变化
const handleFileInputChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    
    // 验证文件
    if (beforeResumeUpload(file)) {
      const options = {
        file,
        filename: file.name
      }
      await handleUploadRequest(options)
    }
    
    // 重置文件输入
    input.value = ''
  }
}

// 从URL导入简历
const importFromUrl = async () => {
  if (!resumeUrl.value) {
    ElMessage.warning('请输入简历URL')
    return
  }
  
  try {
    uploadLoading.value = true
    
    // 检查用户是否已有简历信息
    const userResume = await getUserResumeInfoAPI()
    
    // 更新简历URL，提供正确的参数
    if (userResume && userResume.id) {
      await updateResumeFileUrlAPI(userResume.id, resumeUrl.value)
    } else {
      // 如果没有现有简历，给出提示
      ElMessage.warning('请先上传一份简历文件，然后再更新URL')
      return
    }
    
    ElMessage.success('简历URL导入成功')
    await getUserResumes() // 刷新简历列表
    resumeUrl.value = '' // 重置输入
  } catch (error) {
    console.error('从URL导入简历失败:', error)
    ElMessage.error('从URL导入简历失败，请检查URL是否有效')
  } finally {
    uploadLoading.value = false
  }
}

// 从LinkedIn导入简历
const importFromLinkedIn = () => {
  ElMessage.info('LinkedIn导入功能即将上线，敬请期待')
}

// 启动在线编辑
const startOnlineEdit = () => {
  router.push('/resume-editor')
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 初始化
onMounted(async () => {
  await getUserResumes()
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.resume-uploader {
    width: 100%;
}

.resume-list {
  margin-top: 20px;
}

.resume-list h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #606266;
}

.resume-actions {
  display: flex;
  gap: 10px;
}

.resume-replace {
  margin-top: 20px;
}

.replace-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.url-import {
  padding: 20px 0;
}

.url-tip {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.upload-time {
  color: #606266;
}

.resume-action-btn {
  flex: 1;
}
</style> 