<template>
  <div class="avatar-upload">
    <div class="avatar-preview" @click="triggerFileInput">
      <el-avatar 
        :size="size" 
        :src="previewUrl || defaultAvatar" 
        :style="{ backgroundColor: avatarColor }"
      >
        <el-icon v-if="!previewUrl && !currentAvatar">
          <UserFilled />
        </el-icon>
      </el-avatar>
      <div class="hover-mask">
        <el-icon><Upload /></el-icon>
        <span>更换头像</span>
      </div>
    </div>
    
    <!-- 隐藏的文件输入框 -->
    <input
      type="file"
      accept="image/*"
      @change="handleFileChange"
      style="display: none"
      ref="fileInput"
    />
    
    <!-- 上传进度 -->
    <el-progress 
      v-if="uploading" 
      :percentage="uploadProgress" 
      :status="uploadProgress === 100 ? 'success' : ''"
      :stroke-width="6"
      class="upload-progress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, Upload } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  currentAvatar: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 100
  },
  username: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:avatar', value: string): void
  (e: 'upload-success', value: string): void
  (e: 'upload-error', error: Error): void
}>()

// 存储
const authStore = useAuthStore()

// 引用
const fileInput = ref<HTMLInputElement | null>(null)

// 状态
const previewUrl = ref<string>('')
const uploading = ref<boolean>(false)
const uploadProgress = ref<number>(0)
const error = ref<boolean>(false)

// 颜色生成
const avatarColor = computed(() => {
  // 预定义的一组美观颜色
  const colors = [
    '#409EFF', // 蓝色（主题色）
    '#67C23A', // 绿色（成功色）
    '#E6A23C', // 黄色（警告色）
    '#F56C6C', // 红色（危险色）
    '#909399', // 灰色（信息色）
    '#8e44ad', // 紫色
    '#16a085', // 青绿色
    '#d35400', // 橙色
    '#2c3e50', // 深蓝灰色
    '#27ae60'  // 翠绿色
  ]
  
  // 如果没有用户名，返回主题色
  if (!props.username) return colors[0]
  
  // 根据用户名生成一个索引
  let sum = 0
  for (let i = 0; i < props.username.length; i++) {
    sum += props.username.charCodeAt(i)
  }
  return colors[sum % colors.length]
})

// 默认头像
const defaultAvatar = ref('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

// 触发文件选择
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件选择
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target || !target.files || target.files.length === 0) return
  
  const file = target.files[0]

  // 验证文件格式
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('只支持 jpg、jpeg 和 png 格式的图片')
    return
  }
  
  // 验证文件大小 (2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }
  
  // 创建预览URL
  previewUrl.value = URL.createObjectURL(file)
  
  // 重置文件输入，以便于重新选择相同文件
  target.value = ''
  
  // 开始上传
  uploadAvatar(file)
}

// 头像上传前验证
const beforeUpload = (file: File): boolean => {
  const isImage = /^image\//.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过2MB!')
    return false
  }
  return true
}

// 上传头像
const uploadAvatar = async (file: File) => {
  if (!beforeUpload(file)) return

  uploading.value = true
  error.value = false

  try {
    // 调用store中的上传头像方法
    const avatarUrl = await authStore.uploadAvatar(file)
    
    if (avatarUrl) {
      // 处理返回的头像URL
      previewUrl.value = avatarUrl
      error.value = false
      
      // 向父组件发送事件
      emit('update:avatar', avatarUrl)
      emit('upload-success', avatarUrl)
    } else {
      error.value = true
      emit('upload-error', new Error('上传失败，未获取到头像URL'))
    }
  } catch (err) {
    error.value = true
    console.error('上传头像失败:', err)
    emit('upload-error', err)
  } finally {
    uploading.value = false
  }
}

// 监听头像变化
watch(() => props.currentAvatar, (newValue) => {
  if (newValue && !previewUrl.value) {
    previewUrl.value = newValue
  }
}, { immediate: true })
</script>

<style scoped>
.avatar-upload {
  position: relative;
  display: inline-block;
}

.avatar-preview {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.hover-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.hover-mask .el-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.avatar-preview:hover .hover-mask {
  opacity: 1;
}

.upload-progress {
  margin-top: 10px;
}
</style> 