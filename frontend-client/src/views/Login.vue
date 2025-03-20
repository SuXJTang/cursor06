<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 获取重定向URL
const redirectUrl = computed(() => {
  return route.query.redirect as string || '/'
})

// 是否为登录模式（否则为注册模式）
const isLogin = ref(true)

// 表单数据
const form = reactive({
  username: '',
  password: '',
  email: '',
  confirmPassword: '',
  phone: '' // 可选字段，用于注册
})

// 验证规则
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 8) {
    callback(new Error('密码长度不能少于8个字符'))
  } else {
    if (form.confirmPassword !== '') {
      if (!formRef.value) return
      formRef.value.validateField('confirmPassword', () => null)
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    // 手机号是可选的
    callback()
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入有效的11位手机号码'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度在4到20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 32, message: '密码长度在8到32个字符之间', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ]
})

// 切换登录/注册模式
const switchMode = () => {
  isLogin.value = !isLogin.value
  form.password = ''
  form.confirmPassword = ''
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true
        
        if (isLogin.value) {
          // 登录
          console.log('尝试登录:', {
            username: form.username,
            password: '***'
          })
          
          try {
            // 登录前清除之前的错误
            ElMessage.closeAll()
            
            const success = await authStore.login({
              email: form.username, // 使用username字段作为邮箱
              password: form.password
            })
            
            if (success) {
              router.push(redirectUrl.value)
            } else {
              console.error('登录失败，但没有捕获到异常')
              ElMessage.error('登录失败，请检查用户名和密码')
            }
          } catch (error: any) {
            console.error('登录异常:', error)
            ElMessage.error(`登录失败: ${error.message || '未知错误'}`)
          } finally {
            loading.value = false
          }
        } else {
          // 注册
          if (form.password !== form.confirmPassword) {
            ElMessage.error('两次输入密码不一致')
            loading.value = false
            return
          }
          
          console.log('尝试注册:', {
            username: form.username,
            email: form.email,
            password: '***'
          })
          
          try {
            const result = await authStore.register({
              username: form.username,
              password: form.password,
              email: form.email
            })
            
            if (result) {
              // 注册成功，切换到登录模式
              isLogin.value = true
              form.password = ''
              form.confirmPassword = ''
            }
          } finally {
            loading.value = false
          }
        }
      } else {
        console.warn('表单验证失败')
        return false
      }
    })
  } catch (error) {
    console.error('表单提交错误:', error)
    ElMessage.error('操作失败，请稍后重试')
    loading.value = false
  }
}

// 如果已经登录，直接重定向到目标页面
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push(redirectUrl.value)
  }
})
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>{{ isLogin ? '用户登录' : '用户注册' }}</h2>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名或邮箱" />
        </el-form-item>
        
        <el-form-item v-if="!isLogin" label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item v-if="!isLogin" label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号(可选)" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForm"
          >
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
          <el-button @click="switchMode">
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </el-button>
        </el-form-item>
        
        <el-alert
          v-if="isLogin"
          type="info"
          :closable="false"
          title="测试账号信息"
          description="用户名: admin@example.com，密码: admin123"
        />
        
        <el-alert
          v-if="authStore.error"
          type="error"
          :closable="true"
          :title="authStore.error"
          style="margin-top: 10px;"
        />
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}
</style> 