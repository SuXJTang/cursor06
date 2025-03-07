# 前端架构文档

## 系统架构图

```mermaid
graph TD
    A[浏览器] --> B[Vue3前端应用]
    B --> C[Vue Router]
    B --> D[Pinia状态管理]
    B --> E[Element Plus/Vant UI组件]
    B --> F[Axios请求]
    
    F --> G[后端服务]
    D --> E
    C --> E
```

## 页面结构

```mermaid
graph LR
    A[Vue3应用]
    A --> B[公共页面]
    A --> C[认证页面]
    A --> D[用户页面]
    
    B --> B1[首页]
    B --> B2[关于]
    B --> B3[帮助]
    
    C --> C1[登录]
    C --> C2[注册]
    C --> C3[找回密码]
    
    D --> D1[个人中心]
    D --> D2[简历管理]
    D --> D3[职位管理]
    D --> D4[评估中心]
```

## 组件结构

### 1. 认证相关组件

```mermaid
graph TD
    A[认证模块]
    A --> B[登录表单]
    A --> C[注册表单]
    A --> D[密码重置]
    
    B --> B1[用户名输入]
    B --> B2[密码输入]
    B --> B3[记住登录]
    
    C --> C1[用户信息]
    C --> C2[邮箱验证]
    C --> C3[密码设置]
```

### 2. 简历相关组件

```mermaid
graph TD
    A[简历模块]
    A --> B[简历列表]
    A --> C[简历编辑]
    A --> D[简历预览]
    
    B --> B1[列表项]
    B --> B2[筛选器]
    B --> B3[分页器]
    
    C --> C1[基本信息]
    C --> C2[教育经历]
    C --> C3[工作经历]
    C --> C4[技能特长]
```

### 3. 职位相关组件

```mermaid
graph TD
    A[职位模块]
    A --> B[职位列表]
    A --> C[职位详情]
    A --> D[申请记录]
    
    B --> B1[搜索栏]
    B --> B2[筛选面板]
    B --> B3[排序选项]
    
    C --> C1[职位信息]
    C --> C2[公司信息]
    C --> C3[申请按钮]
```

### 4. 评估相关组件

```mermaid
graph TD
    A[评估模块]
    A --> B[技能测评]
    A --> C[评估历史]
    A --> D[能力分析]
    
    B --> B1[试题展示]
    B --> B2[计时器]
    B --> B3[提交按钮]
    
    C --> C1[评估记录]
    C --> C2[成绩趋势]
```

## 状态管理

```mermaid
graph LR
    A[全局状态] --> B[用户状态]
    A --> C[应用状态]
    A --> D[UI状态]
    
    B --> B1[登录信息]
    B --> B2[用户资料]
    
    C --> C1[简历数据]
    C --> C2[职位数据]
    C --> C3[评估数据]
    
    D --> D1[主题设置]
    D --> D2[布局配置]
```

## API调用封装

### 1. 认证API
```typescript
interface AuthAPI {
  login(username: string, password: string): Promise<LoginResponse>;
  register(userData: UserRegisterData): Promise<RegisterResponse>;
  resetPassword(email: string): Promise<ResetResponse>;
  refreshToken(): Promise<TokenResponse>;
  logout(): Promise<void>;
}
```

### 2. 简历API
```typescript
interface ResumeAPI {
  uploadResume(file: File, metadata: ResumeMetadata): Promise<UploadResponse>;
  getResumeList(params: ListParams): Promise<ResumeListResponse>;
  getResumeDetail(id: string): Promise<ResumeDetailResponse>;
  parseResume(id: string): Promise<ParseResponse>;
  deleteResume(id: string): Promise<DeleteResponse>;
}
```

### 3. 职位API
```typescript
interface JobAPI {
  getJobList(params: JobListParams): Promise<JobListResponse>;
  getJobDetail(id: string): Promise<JobDetailResponse>;
  applyJob(jobId: string, resumeId: string): Promise<ApplyResponse>;
  favoriteJob(jobId: string): Promise<FavoriteResponse>;
  matchJobs(criteria: MatchCriteria): Promise<MatchResponse>;
}
```

### 4. 评估API
```typescript
interface AssessmentAPI {
  startAssessment(type: string): Promise<AssessmentResponse>;
  submitAnswers(id: string, answers: Answer[]): Promise<SubmitResponse>;
  getHistory(params: HistoryParams): Promise<HistoryResponse>;
  getReport(id: string): Promise<ReportResponse>;
}
```

## 路由配置

```typescript
// Vue Router 配置
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      { path: '', component: () => import('@/views/Home.vue') },
      { path: 'about', component: () => import('@/views/About.vue') },
      { path: 'help', component: () => import('@/views/Help.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/auth.vue'),
    children: [
      { path: 'login', component: () => import('@/views/auth/Login.vue') },
      { path: 'register', component: () => import('@/views/auth/Register.vue') },
      { path: 'reset-password', component: () => import('@/views/auth/ResetPassword.vue') }
    ]
  },
  {
    path: '/user',
    component: () => import('@/layouts/user.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', component: () => import('@/views/user/Profile.vue') },
      { path: 'resumes', component: () => import('@/views/user/ResumeManagement.vue') },
      { path: 'jobs', component: () => import('@/views/user/JobManagement.vue') },
      { path: 'assessments', component: () => import('@/views/user/AssessmentCenter.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

## 数据流

```mermaid
sequenceDiagram
    participant U as 用户界面
    participant S as 状态管理
    participant A as API封装
    participant B as 后端服务
    
    U->>S: 触发动作
    S->>A: 调用API
    A->>B: 发送请求
    B-->>A: 返回数据
    A-->>S: 更新状态
    S-->>U: 更新视图
```

## UI组件库使用

### Element Plus/Vant 基础组件
- ElButton/VanButton（按钮）
- ElInput/VanField（输入框）
- ElSelect/VanPicker（选择器）
- ElTable/VanList（表格/列表）
- ElForm/VanForm（表单）
- ElDialog/VanDialog（弹窗）

### 业务组件
- ResumeCard（简历卡片）
- JobItem（职位项）
- AssessmentPanel（评估面板）
- UserAvatar（用户头像）
- SearchFilter（搜索筛选）

## 开发规范

### 1. 命名规范
- 组件名：PascalCase
- 方法名：camelCase
- 常量：UPPER_SNAKE_CASE
- 变量：camelCase

### 2. 文件结构
```
frontend/
├── src/
│   ├── components/    # 通用组件
│   ├── views/         # 页面组件
│   ├── api/          # API封装
│   ├── store/        # 状态管理
│   ├── router/       # 路由配置
│   ├── utils/        # 工具函数
│   └── assets/       # 静态资源
├── tests/            # 测试文件
└── public/           # 公共资源
```

### 3. 代码风格
- 使用TypeScript
- 使用ESLint
- 使用Prettier
- 遵循Vue3风格指南

## 性能优化

```mermaid
graph TD
    A[性能优化] --> B[代码分割]
    A --> C[懒加载]
    A --> D[缓存策略]
    
    B --> B1[路由分割]
    B --> B2[组件分割]
    
    C --> C1[图片懒加载]
    C --> C2[组件懒加载]
    
    D --> D1[API缓存]
    D --> D2[状态缓存]
```

## 错误处理

```mermaid
graph TD
    A[错误处理] --> B[网络错误]
    A --> C[业务错误]
    A --> D[UI异常]
    
    B --> B1[重试机制]
    B --> B2[错误提示]
    
    C --> C1[错误码处理]
    C --> C2[友好提示]
    
    D --> D1[降级展示]
    D --> D2[异常恢复]
``` 