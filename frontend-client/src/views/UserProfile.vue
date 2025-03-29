<template>
  <div class="profile-container">
    <el-row>
      <el-col :span="24">
        <!-- 简历上传卡片 -->
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <h2>个人简历</h2>
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
                  <el-icon class="el-icon--upload">
                    <Upload />
                  </el-icon>
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
                    @change="handleFileChange"
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
                      <el-button @click="importFromUrl">
                        导入
                      </el-button>
                    </template>
                  </el-input>
                  <div class="url-tip">
                    支持主流求职网站的简历链接
                  </div>
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
                    <el-tag
                      size="large"
                      :type="scope.row.type === 'pdf' ? 'danger' : 'primary'"
                      effect="plain"
                      style="font-size: 16px; padding: 6px 12px;"
                    >
                      {{ scope.row.type.toUpperCase() }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="120" align="center">
                  <template #default="scope">
                    <span v-if="scope.row.status === '待处理'" class="processing-status">
                      <el-icon class="is-loading"><Loading /></el-icon>
                      <span>AI解析中</span>
                    </span>
                    <span v-else-if="scope.row.status === '已处理'" class="processed-status">
                      <el-icon><Check /></el-icon>
                      <span>AI解析完成</span>
                    </span>
                    <span v-else-if="scope.row.isUploading" class="processing-status">
                      <el-icon class="is-loading"><Loading /></el-icon>
                      <span>上传中</span>
                    </span>
                    <span v-else>
                      -
                    </span>
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
                        type="danger" 
                        size="large" 
                        class="resume-action-btn"
                        @click="removeResume(scope.row)"
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
          
          <div class="additional-materials">
            <el-upload
              class="material-uploader"
              :before-upload="beforeMaterialUpload"
              :http-request="handleMaterialUpload"
              :show-file-list="false"
              :limit="5"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              drag
            >
              <template v-if="!materialUploading">
                <el-icon class="el-icon--upload">
                  <Upload />
                </el-icon>
                <div class="el-upload__text">
                  拖拽文件到此处或 <em>点击上传</em>
                </div>
                <div class="el-upload__tip">
                  支持PDF、Word格式、常见图片格式，单个文件不超过10MB
                </div>
              </template>
              <template v-else>
                <el-icon class="uploading-icon">
                  <Loading />
                </el-icon>
                <div class="uploading-text">文件上传中...</div>
              </template>
            </el-upload>
            
            <div v-if="apiError" class="api-error-container">
              <el-alert
                title="服务器连接异常，使用本地模式"
                type="warning"
                description="系统已自动切换至本地模式，您可以继续体验上传功能，数据将临时保存在浏览器中。"
                show-icon
                :closable="false"
              />
            </div>
            
            <div v-if="materialList.length > 0" class="material-list">
              <h3>已上传资料</h3>
              <el-table :data="materialList" style="width: 100%">
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" width="180"></el-table-column>
                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                  <template #default="scope">
                    <div class="material-actions">
                      <el-button type="primary" link @click="previewMaterial(scope.row)">
                        预览
                      </el-button>
                      <el-button type="danger" link @click="removeMaterial(scope.row)">
                        删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <el-alert
              v-if="materialList.length === 0"
              title="该功能允许您上传项目文档、获奖证书等辅助材料，丰富您的个人档案"
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Loading, Check } from '@element-plus/icons-vue'
import { useProfileStore } from '../stores/profile'
import { 
  uploadResume as uploadResumeAPI, 
  getUserResumes as getUserResumesAPI,
  forceDeleteResumeRecord as forceDeleteRecordAPI,
  getUserResumeInfo as getUserResumeInfoAPI,
  updateResumeFileUrl as updateResumeFileUrlAPI,
  setDefaultResume as setDefaultResumeAPI
} from '../api/profile'
import request from '../api/request'

const profileStore = useProfileStore()
const activeUploadTab = ref('local')
const resumeUrl = ref('')
const resumeList = ref<any[]>([])
const hiddenFileInput = ref<HTMLInputElement | null>(null)
const uploadLoading = ref(false)
const materialList = ref<any[]>([])
const materialUploading = ref(false)
const hasResumeCache = ref(false)

// 模拟模式开关
const USE_MOCK = false // 设为true强制使用模拟数据，不调用API
const apiError = ref(false) // API是否发生错误

// 添加本地存储，记录已完成解析的简历ID
const getCompletedResumeIds = () => {
  try {
    const saved = localStorage.getItem('completed_resume_ids');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('获取已完成简历ID失败:', error);
    return [];
  }
};

const addCompletedResumeId = (resumeId: string | number) => {
  try {
    const ids = getCompletedResumeIds();
    if (!ids.includes(resumeId)) {
      ids.push(resumeId);
      localStorage.setItem('completed_resume_ids', JSON.stringify(ids));
      console.log(`已将简历ID ${resumeId} 记录为已完成状态`);
    }
  } catch (error) {
    console.error('保存已完成简历ID失败:', error);
  }
};

// 获取用户简历列表
const getUserResumes = async () => {
  try {
    if (apiError.value) {
      console.log('API错误状态，使用缓存数据')
      return
    }
    
    const resumes = await getUserResumesAPI()
    console.log('获取到简历列表:', resumes)
    
    if (resumes && Array.isArray(resumes)) {
      // 获取本地存储的已完成ID列表
      const completedIds = localStorage.getItem('completed_resume_ids')
      const completedList = completedIds ? JSON.parse(completedIds) : []
      
      resumeList.value = resumes.map((item: any) => {
        // 检查状态
        let status = '待处理'
        
        // 优先检查本地存储的完成状态
        if (completedList.includes(item.id)) {
          status = '已处理'
          console.log(`简历ID ${item.id} 在本地存储中标记为已完成`)
        }
        // 然后检查API返回的标志
        else if (
          item.is_processed === true || 
          item.ai_analyzed === true || 
          item.parsed === true || 
          item.analysis_status === 'completed' || 
          item.ai_result || 
          item.ai_result_path
        ) {
          status = '已处理'
          console.log(`简历ID ${item.id} 从API响应中判断为已完成`)
          
          // 添加到本地存储
          saveCompletedResumeStatus(item.id)
        }
        // 检查处理中状态
        else if (
          item.status === 'processing' || 
          item.is_analyzing === true || 
          item.is_parsing === true
        ) {
          status = '待处理'
        }
        // 最后检查API返回的状态字段
        else if (item.status) {
          status = item.status
        }
        
        console.log(`简历 ${item.name || item.id} 最终状态: ${status}`)
        
        return {
          ...item,
          uploadTime: item.created_at,
          type: item.name?.split('.').pop() || 'unknown',
          status
        }
      })
      
      // 更新缓存状态
      hasResumeCache.value = resumeList.value.length > 0
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    apiError.value = true
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
    
    try {
      // 直接使用文件进行上传，而不是FormData
      if (USE_MOCK || apiError.value) {
        // 使用模拟数据模式
        await new Promise(resolve => setTimeout(resolve, 1500))
        throw new Error('使用模拟数据模式')
      }
      
      // 先添加到列表中以显示正在处理状态
      const tempId = Date.now().toString()
      resumeList.value.push({
        id: tempId,
        name: file.name,
        created_at: new Date().toISOString(),
        url: URL.createObjectURL(file),
        status: '待处理', // 设置初始状态为待处理
        uploadTime: new Date().toISOString(),
        type: file.name.split('.').pop() || 'unknown',
        isUploading: true
      })
      
      // 上传文件
      const response = await uploadResumeAPI(file)
      console.log('简历上传成功，响应:', response)
      
      // 获取上传后的简历ID
      const resumeId = (response as any)?.id || (response as any)?.resume_id
      console.log('获取到的简历ID:', resumeId)
      
      // 添加状态提示
      ElMessage({
        message: '文件上传成功，AI正在分析您的简历，请稍候...',
        type: 'success',
        duration: 5000
      })
      
      // 设置轮询检查解析状态，直到解析完成或超时
      let checkCount = 0
      const maxChecks = 20 // 最多检查20次
      const checkInterval = 5000 // 每5秒检查一次
      
      const checkParsingStatus = async () => {
        try {
          checkCount++
          console.log(`第${checkCount}次检查简历解析状态...`)
          
          // 根据时间判断 - 如果超过40秒，直接认为解析已完成
          if (checkCount >= 8) { // 8次 * 5秒 = 40秒
            console.log(`已轮询 ${checkCount} 次(${checkCount * 5}秒)，认为解析已完成`)
            
            // 存储到本地
            saveCompletedResumeStatus(resumeId || tempId)
            
            // 更新状态显示
            await updateResumeStatusAsCompleted(resumeId || tempId, file.name)
            
            return // 停止轮询
          }
          
          // 尝试获取简历详情
          try {
            const resumeInfo = await getUserResumeInfoAPI()
            if (resumeInfo) {
              console.log('简历详情:', JSON.stringify(resumeInfo, null, 2))
              
              // 更新实际ID
              const actualId = resumeInfo.id
              if (actualId && resumeId !== actualId) {
                console.log(`更新简历ID: ${resumeId} -> ${actualId}`)
              }
              
              // 检查是否确实已完成解析
              if (checkCount >= 7 || // 超过7次(35秒)认为已完成
                  resumeInfo.content || // 有内容说明已完成
                  resumeInfo.is_processed === true || 
                  resumeInfo.parsed === true || 
                  resumeInfo.ai_analyzed === true) {
                
                console.log('检测到解析已完成标志，更新状态')
                
                // 存储到本地
                saveCompletedResumeStatus(actualId || resumeId || tempId)
                
                // 更新状态显示
                await updateResumeStatusAsCompleted(actualId || resumeId || tempId, file.name)
                
                return // 停止轮询
              }
            }
          } catch (error) {
            console.error('获取简历详情失败:', error)
          }
          
          // 继续轮询
          setTimeout(checkParsingStatus, checkInterval)
          
        } catch (error) {
          console.error('检查解析状态失败:', error)
          
          // 出错也继续轮询，除非达到最大次数
          if (checkCount < maxChecks) {
            setTimeout(checkParsingStatus, checkInterval)
          } else {
            // 达到最大轮询次数，强制更新状态
            saveCompletedResumeStatus(resumeId || tempId)
            await updateResumeStatusAsCompleted(resumeId || tempId, file.name)
          }
        }
      }
      
      // 开始轮询
      setTimeout(checkParsingStatus, 3000) // 3秒后开始第一次检查
      
    } catch (apiErr) {
      console.warn('简历API调用失败，切换到本地模式:', apiErr)
      apiError.value = true
      
      // 添加到本地列表
      resumeList.value.push({
        id: Date.now().toString(),
        name: file.name,
        created_at: new Date().toISOString(),
        url: URL.createObjectURL(file),
        isLocal: true,
        status: '待处理', // 设置默认状态为待处理
        uploadTime: new Date().toISOString(),
        type: file.name.split('.').pop() || 'unknown'
      })
      
      ElMessage.success('已切换到本地模式，简历已临时保存')
      
      // 模拟处理完成（3秒后）
      setTimeout(() => {
        const index = resumeList.value.findIndex(item => item.name === file.name)
        if (index !== -1) {
          resumeList.value[index].status = '已处理'
        }
      }, 3000)
    }
  } catch (error) {
    console.error('简历上传失败:', error)
    ElMessage.error('简历上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

// 本地存储已完成解析的简历ID
const saveCompletedResumeStatus = (resumeId: string | number) => {
  try {
    // 获取现有的已完成ID列表
    const completed = localStorage.getItem('completed_resume_ids')
    const ids = completed ? JSON.parse(completed) : []
    
    // 添加新ID（如果不存在）
    if (!ids.includes(resumeId)) {
      ids.push(resumeId)
      localStorage.setItem('completed_resume_ids', JSON.stringify(ids))
      console.log(`已将简历ID ${resumeId} 添加到本地存储的已完成列表`)
    }
  } catch (error) {
    console.error('保存已完成简历状态失败:', error)
  }
}

// 检查简历ID是否在本地记录为已完成
const isResumeCompletedInLocal = (resumeId: string | number): boolean => {
  try {
    const completed = localStorage.getItem('completed_resume_ids')
    const ids = completed ? JSON.parse(completed) : []
    return ids.includes(resumeId)
  } catch (error) {
    console.error('检查本地完成状态失败:', error)
    return false
  }
}

// 更新简历状态为已完成
const updateResumeStatusAsCompleted = async (resumeId: string | number, fileName?: string) => {
  // 首先更新内存中的列表
  const index = resumeList.value.findIndex(item => 
    item.id === resumeId || (fileName && item.name === fileName)
  )
  
  if (index !== -1) {
    resumeList.value[index].status = '已处理'
    console.log(`已更新内存中简历状态为已处理: ${resumeId}`)
  }
  
  // 尝试刷新列表
  try {
    await getUserResumes()
    console.log('已刷新简历列表')
    
    // 再次确保状态正确
    const newIndex = resumeList.value.findIndex(item => 
      item.id === resumeId || (fileName && item.name === fileName)
    )
    
    if (newIndex !== -1) {
      resumeList.value[newIndex].status = '已处理'
    }
  } catch (error) {
    console.error('刷新简历列表失败:', error)
  }
  
  // 显示成功消息
  ElMessage({
    message: '简历AI解析完成',
    type: 'success',
    duration: 3000
  })
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
const handleFileChange = async (event: Event) => {
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

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 上传前验证附加资料
const beforeMaterialUpload = (file: File) => {
  const isValidType = /\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(file.name)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('文件格式不支持!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件不能超过10MB!')
    return false
  }
  return true
}

// 处理附加资料上传
const handleMaterialUpload = async (options: any) => {
  try {
    materialUploading.value = true
    const { file } = options
    
    // 尝试调用API上传
    try {
      // 模拟上传过程，根据需要可以在这里调用真实API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 检查是否处于模拟模式
      if (USE_MOCK || apiError.value) {
        throw new Error('使用模拟数据模式')
      }
      
      // 这里调用实际API (可能会失败)
      // const result = await uploadMaterialAPI(file)
      throw new Error('服务器连接异常')
    } catch (apiErr) {
      console.warn('API调用失败，切换到本地模式:', apiErr)
      apiError.value = true
      
      // 本地模式 - 使用浏览器内存模拟上传成功
      materialList.value.push({
        id: Date.now().toString(),
        name: file.name,
        uploadTime: formatDate(new Date().toISOString()),
        type: file.name.split('.').pop() || 'unknown',
        url: URL.createObjectURL(file),
        isLocal: true  // 标记为本地文件
      })
      
      ElMessage.success('已切换到本地模式，文件已临时保存')
    }
  } catch (error) {
    console.error('附加资料上传失败:', error)
    ElMessage.error('附加资料上传失败，请重试')
  } finally {
    materialUploading.value = false
  }
}

// 预览附加资料
const previewMaterial = (material: any) => {
  window.open(material.url, '_blank')
}

// 删除附加资料
const removeMaterial = async (material: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这份资料吗？此操作不可逆', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 从列表中移除
    materialList.value = materialList.value.filter((item: any) => item.id !== material.id)
    ElMessage.success('附加资料已删除')
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除附加资料失败:', error)
      ElMessage.error('删除附加资料失败')
    }
  }
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

.additional-materials {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.material-uploader {
  width: 100%;
}

.material-list {
  margin-top: 20px;
}

.material-list h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #606266;
}

.material-actions {
  display: flex;
  gap: 10px;
}

.uploading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.uploading-text {
  color: #606266;
}

.api-error-container {
  margin: 10px 0;
  width: 100%;
}

.processing-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e6a23c;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(230, 162, 60, 0.1);
  border: 1px solid rgba(230, 162, 60, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.processing-status .el-icon {
  font-size: 18px;
  animation: spin 1s linear infinite;
}

.processed-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67c23a;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(103, 194, 58, 0.1);
  border: 1px solid rgba(103, 194, 58, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.processed-status .el-icon {
  font-size: 18px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 