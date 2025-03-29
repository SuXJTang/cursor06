<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  code: ''
})

// 表单规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: false, message: '请输入验证码', trigger: 'blur' }
  ]
})

// 表单引用
const registerFormRef = ref<FormInstance>()

// 是否正在发送验证码
const isSendingCode = ref(false)
// 倒计时
const countdown = ref(0)

// 发送验证码
const sendVerificationCode = async () => {
  if (isSendingCode.value) return

  try {
    isSendingCode.value = true
    // TODO: 调用发送验证码接口
    ElMessage.success('验证码已发送到您的邮箱')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        isSendingCode.value = false
      }
    }, 1000)
  } catch (error) {
    isSendingCode.value = false
    ElMessage.error('验证码发送失败')
  }
}

// 注册处理
const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 验证邮箱格式
        if (!isValidEmail(registerForm.email)) {
          ElMessage.error('邮箱格式不正确')
          return
        }
        
        console.log('开始提交注册信息:', {
          username: registerForm.username,
          email: registerForm.email
        })
        
        // 禁用按钮，避免重复提交
        const submitButton = document.querySelector('.register-button') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = true;
        
        // 仅提交必要字段
        const success = await authStore.register({
          username: registerForm.username,
          password: registerForm.password,
          email: registerForm.email
        })
        
        console.log('注册结果:', success)
        
        if (success) {
          // 注册成功后显示成功消息
          ElMessage.success('注册成功，即将跳转到登录页面')
          // 延迟跳转到登录页
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        } else {
          // 注册失败，重新启用按钮
          if (submitButton) submitButton.disabled = false;
        }
      } catch (error) {
        console.error('注册过程中出错:', error)
        ElMessage.error('注册失败，请稍后重试')
        
        // 发生错误，重新启用按钮
        const submitButton = document.querySelector('.register-button') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = false;
      }
    } else {
      console.warn('表单验证未通过')
    }
  })
}

// 验证邮箱格式函数
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2 class="register-title">
          注册
        </h2>
      </template>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
          <div class="password-hint">密码至少8位，需包含字母和数字</div>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item label="验证码" prop="code">
          <el-input
            v-model="registerForm.code"
            placeholder="请输入验证码"
            maxlength="6"
          >
            <template #append>
              <el-button
                :disabled="isSendingCode"
                @click="sendVerificationCode"
              >
                {{ isSendingCode ? `${countdown}s后重试` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="register-button"
            @click="handleRegister(registerFormRef)"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="register-footer">
          <el-link type="primary" @click="goToLogin">
            已有账号？立即登录
          </el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 100%;
  max-width: 400px;
}

.register-title {
  text-align: center;
  color: #303133;
  margin: 0;
}

.register-button {
  width: 100%;
}

.register-footer {
  text-align: center;
  margin-top: 1rem;
}

.password-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append) .el-button {
  margin: 0;
  border: none;
  height: 100%;
}
</style> 