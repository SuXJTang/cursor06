<template>
  <div class="user-info-container">
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <h2>基本信息</h2>
          <el-button v-if="!isEditing" type="primary" @click="isEditing = true">
            编辑
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
            :disabled="!isEditing"
          >
            <img
              :src="userForm.avatar_url || defaultAvatar"
              alt="用户头像"
              class="avatar"
            />
          </el-upload>
        </el-form-item>
        
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" disabled />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        
        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="handleSubmit">
            保存
          </el-button>
          <el-button @click="cancelEdit">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <h2>修改密码</h2>
        </div>
      </template>
      
      <el-alert
        type="warning"
        title="功能暂未开放"
        description="密码修改功能暂未开放，请等待系统更新"
        show-icon
        :closable="false"
        style="margin-bottom: 20px;"
      />
      
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="current_password">
          <el-input 
            v-model="passwordForm.current_password" 
            type="password"
            show-password
            disabled
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="new_password">
          <el-input 
            v-model="passwordForm.new_password" 
            type="password"
            show-password
            disabled
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirm_password">
          <el-input 
            v-model="passwordForm.confirm_password" 
            type="password"
            show-password
            disabled
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" disabled>
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { extractData } from '@/utils/responseAdapter'
import request from '@/api/request'

// 表单引用
const userFormRef = ref()
const passwordFormRef = ref()

// 认证store
const userStore = useAuthStore()

// 是否正在编辑状态
const isEditing = ref(false)

// 用户表单数据
const userForm = reactive({
  username: '',
  email: '',
  phone: '',
  avatar_url: ''
})

// 密码表单数据
const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// 用户表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符之间', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

// 密码表单验证规则
const passwordRules = reactive({
  current_password: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在6到20个字符之间', trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在6到20个字符之间', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { 
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.new_password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
})

// 获取用户信息
const getUserInfo = async () => {
  console.log('调用了getUserInfo函数')
  try {
    console.log('准备发送请求，token状态:', localStorage.getItem('auth_token') ? '存在' : '不存在')
    const response = await authApi.getCurrentUser()
    console.log('获取到的用户数据:', response)
    
    // 使用适配器提取数据，无论是直接返回的对象还是标准格式
    const userData = extractData(response)

    if (userData) {
      userForm.username = userData.username || ''
      userForm.email = userData.email || ''
      userForm.phone = userData.phone || ''
      userForm.avatar_url = userData.avatar_url || ''
    } else {
      console.warn('API返回了空数据，尝试从auth store获取')
      // 如果API请求没有返回有效数据，尝试从auth store获取
      if (userStore.userInfo) {
        userForm.username = userStore.userInfo.username || ''
        userForm.email = userStore.userInfo.email || ''
        userForm.phone = userStore.userInfo.phone || ''
        userForm.avatar_url = userStore.userInfo.avatar_url || ''
        console.log('从auth store获取到用户数据')
      } else {
        console.error('auth store中也没有用户数据')
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
    
    // 出错时也尝试从auth store获取
    if (userStore.userInfo) {
      userForm.username = userStore.userInfo.username || ''
      userForm.email = userStore.userInfo.email || ''
      userForm.phone = userStore.userInfo.phone || ''
      userForm.avatar_url = userStore.userInfo.avatar_url || ''
      console.log('从auth store获取到用户数据')
    }
  }
}

// 提交用户信息
const handleSubmit = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
    
    // 更新用户信息
    await authApi.updateUserInfo({
      username: userForm.username,
      phone: userForm.phone
    })
    
    // 重新获取用户信息
    await getUserInfo()
    ElMessage.success('用户信息更新成功')
    isEditing.value = false
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新用户信息失败，请检查网络连接或联系管理员')
  }
}

// 取消编辑
const cancelEdit = async () => {
  // 重新获取用户信息，恢复原始数据
  await getUserInfo()
  isEditing.value = false
}

// 头像上传前验证
const beforeAvatarUpload = (file: File) => {
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

// 处理头像上传
const handleAvatarUpload = async (options: any) => {
  const { file } = options
  try {
    console.log('开始上传头像文件:', file.name)
    
    // 创建单独的FormData对象
    const formData = new FormData()
    formData.append('file', file)
    
    // 设置请求配置，包括超时时间
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000 // 增加超时时间到30秒
    }
    
    console.log('准备发送上传请求')
    
    // 直接使用请求库，绕过authApi
    const response = await request.post('/api/v1/users/me/avatar', formData, config)
    
    console.log('头像上传响应:', response)
    
    // 使用适配器提取数据
    const responseData = extractData(response)
    console.log('处理后的响应数据:', responseData)
    
    // 更新头像URL
    if (responseData && responseData.avatar_url) {
      // 处理头像URL
      let avatarUrl = responseData.avatar_url
      console.log('服务器返回的原始头像URL:', avatarUrl)
      
      // 处理不同格式的URL
      if (avatarUrl.startsWith('/static/')) {
        // 静态文件路径，添加域名前缀
        const baseUrl = location.origin
        avatarUrl = `${baseUrl}${avatarUrl}`
        console.log('添加了域名前缀的静态URL:', avatarUrl)
      } else if (avatarUrl.startsWith('/api/v1/users/avatars/')) {
        // 旧版API路径，保持不变
        console.log('使用旧版API路径:', avatarUrl)
      } else if (!avatarUrl.startsWith('/api/') && !avatarUrl.startsWith('http')) {
        // 其他相对路径，添加API前缀
        avatarUrl = `/api${avatarUrl}`
        console.log('添加了API前缀的URL:', avatarUrl)
      }
      
      console.log('最终处理后的头像URL:', avatarUrl)
      userForm.avatar_url = avatarUrl
      
      // 同时更新store中的头像信息
      if (userStore.userInfo) {
        userStore.userInfo.avatar_url = avatarUrl
        // 保存到本地存储
        userStore.saveUserToStorage()
        console.log('已更新store中的头像URL并保存到本地存储')
      }
      
      ElMessage.success('头像上传成功')
    } else {
      console.error('响应中没有avatar_url字段', responseData)
      ElMessage.error('头像上传失败：服务器返回数据格式不正确')
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    
    // 提供更详细的错误信息
    if (error.response) {
      console.error('错误状态码:', error.response.status)
      console.error('错误响应数据:', error.response.data)
      ElMessage.error(`上传头像失败: ${error.response.data?.detail || '服务器错误'}`)
    } else if (error.request) {
      console.error('未收到响应:', error.request)
      ElMessage.error('上传头像失败：服务器无响应，请检查网络连接')
    } else {
      ElMessage.error(`上传头像失败：${error.message || '未知错误'}`)
    }
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  console.log('UserInfo组件已挂载')
  console.log('authStore.userInfo:', userStore.userInfo)
  console.log('token状态:', localStorage.getItem('auth_token') ? '存在' : '不存在')
  
  // 立即调用一次获取用户信息
  getUserInfo()
  
  // 为了解决可能的timing问题，再延迟调用一次
  setTimeout(() => {
    console.log('延迟1秒后再次尝试获取用户信息')
    getUserInfo()
  }, 1000)
})
</script>

<style scoped>
.user-info-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.user-info-card, .password-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style> 