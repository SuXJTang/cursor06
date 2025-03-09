# 智能招聘系统用户端接口文档

## 一、认证相关接口

### 1.1 用户登录
- **接口路径**：`/auth/login`
- **请求方式**：POST
- **请求格式**：表单数据（application/x-www-form-urlencoded）
- **请求参数**：
  ```
  username: 用户名
  password: 密码
  ```
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

### 1.2 刷新令牌
- **接口路径**：`/auth/refresh`
- **请求方式**：POST
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

### 1.3 获取当前用户信息
- **接口路径**：`/auth/me`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": true,
    "created_at": "2025-02-25T11:00:38",
    "updated_at": "2025-02-26T00:06:32"
  }
  ```

## 二、用户相关接口

### 2.1 获取用户信息
- **接口路径**：`/users/{user_id}`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": true,
    "created_at": "2025-02-25T11:00:38",
    "updated_at": "2025-02-26T00:06:32"
  }
  ```

## 三、简历相关接口

### 3.1 创建简历
- **接口路径**：`/resumes/`
- **请求方式**：POST
- **请求头**：`Authorization: Bearer {access_token}`
- **请求格式**：JSON
- **请求参数**：
  ```json
  {
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "title": "我的简历",
    "status": 1,
    "is_public": true
  }
  ```
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "title": "我的简历",
    "status": 1,
    "is_public": true,
    "id": "fee66180-edf5-41ee-a041-21e61a05c87a",
    "created_at": "2025-02-26T02:39:50",
    "updated_at": "2025-02-26T02:39:50"
  }
  ```

### 3.2 获取用户简历列表
- **接口路径**：`/resumes/user/{user_id}`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  [
    {
      "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
      "title": "我的简历",
      "status": 1,
      "is_public": true,
      "id": "84bfd2f7-855b-4d1f-b00b-6ea5617cd517",
      "created_at": "2025-02-26T00:28:07",
      "updated_at": "2025-02-26T00:28:07"
    }
  ]
  ```

### 3.3 获取简历详情
- **接口路径**：`/resumes/{resume_id}`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "title": "Updated Resume",
    "status": 1,
    "is_public": true,
    "id": "fee66180-edf5-41ee-a041-21e61a05c87a",
    "created_at": "2025-02-26T02:39:50",
    "updated_at": "2025-02-26T02:40:29"
  }
  ```

### 3.4 更新简历
- **接口路径**：`/resumes/{resume_id}`
- **请求方式**：PUT
- **请求头**：`Authorization: Bearer {access_token}`
- **请求格式**：JSON
- **请求参数**：
  ```json
  {
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "title": "Updated Resume",
    "status": 1,
    "is_public": true
  }
  ```
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "title": "Updated Resume",
    "status": 1,
    "is_public": true,
    "id": "fee66180-edf5-41ee-a041-21e61a05c87a",
    "created_at": "2025-02-26T02:39:50",
    "updated_at": "2025-02-26T02:40:29"
  }
  ```

## 四、职位相关接口

### 4.1 获取职位列表
- **接口路径**：`/jobs/jobs`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  [
    {
      "title": "软件工程师",
      "description": "负责系统开发",
      "industry": "IT",
      "education_requirement": "本科",
      "experience_requirement": "3年",
      "salary_min": 10000,
      "salary_max": 20000,
      "id": "1ed77d05-2f34-432d-9755-8e9066f933f2",
      "status": 1,
      "created_at": "2025-02-26T00:29:05",
      "updated_at": "2025-02-26T00:29:05"
    }
  ]
  ```

### 4.2 申请职位
- **接口路径**：`/jobs/jobs/apply/{job_id}`
- **请求方式**：POST
- **请求头**：`Authorization: Bearer {access_token}`
- **请求格式**：JSON
- **请求参数**：
  ```json
  {
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "cover_letter": "I am interested in this position"
  }
  ```
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "id": "1da16c96-7ec0-404b-a247-3579d6e30517",
    "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
    "job_id": "683b37f6-fa9c-4330-9835-bfcdcc33160b",
    "cover_letter": "I am interested in this position",
    "created_at": "2025-02-26T02:41:19",
    "updated_at": "2025-02-26T02:41:19"
  }
  ```

### 4.3 获取用户申请列表
- **接口路径**：`/jobs/jobs/applications/{user_id}`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  [
    {
      "id": "1da16c96-7ec0-404b-a247-3579d6e30517",
      "user_id": "e828f38c-891e-4e0d-9cce-063a2fec949a",
      "job_id": "683b37f6-fa9c-4330-9835-bfcdcc33160b",
      "cover_letter": "I am interested in this position",
      "created_at": "2025-02-26T02:41:19",
      "updated_at": "2025-02-26T02:41:19"
    }
  ]
  ```

## 五、评估相关接口

### 5.1 获取评估问题列表
- **接口路径**：`/assessments/questions`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  [
    {
      "question": "什么是面向对象编程的核心概念？",
      "options": "封装、继承、多态|变量、函数、类|HTML、CSS、JavaScript|数据库、服务器、客户端",
      "type": "single",
      "id": "f9c95515-a1f8-4cec-b60c-d61b7b41786c"
    }
  ]
  ```

### 5.2 获取评估问题详情
- **接口路径**：`/assessments/questions/{question_id}`
- **请求方式**：GET
- **请求头**：`Authorization: Bearer {access_token}`
- **响应格式**：JSON
- **响应示例**：
  ```json
  {
    "question": "什么是面向对象编程的核心概念？",
    "options": "封装、继承、多态|变量、函数、类|HTML、CSS、JavaScript|数据库、服务器、客户端",
    "type": "single",
    "id": "f9c95515-a1f8-4cec-b60c-d61b7b41786c"
  }
  ```

## 六、接口使用说明

### 1. 认证流程
1. 用户通过`/auth/login`接口进行登录，获取`access_token`和`refresh_token`
2. 在后续请求中，将`access_token`添加到请求头中：`Authorization: Bearer {access_token}`
3. 当`access_token`过期时，使用`/auth/refresh`接口刷新令牌

### 2. 错误处理
- 401 Unauthorized：未认证或认证失败
- 403 Forbidden：无权限访问
- 404 Not Found：资源不存在
- 422 Unprocessable Entity：请求参数错误
- 500 Internal Server Error：服务器内部错误

### 3. 数据模型说明

#### 3.1 用户模型
```json
{
  "id": "字符串，UUID格式",
  "username": "字符串，用户名",
  "email": "字符串，邮箱",
  "role": "字符串，角色（admin/user/recruiter）",
  "status": "布尔值，是否激活",
  "created_at": "字符串，创建时间",
  "updated_at": "字符串，更新时间"
}
```

#### 3.2 简历模型
```json
{
  "id": "字符串，UUID格式",
  "user_id": "字符串，用户ID",
  "title": "字符串，简历标题",
  "status": "整数，状态（1为正常）",
  "is_public": "布尔值，是否公开",
  "created_at": "字符串，创建时间",
  "updated_at": "字符串，更新时间"
}
```

#### 3.3 职位模型
```json
{
  "id": "字符串，UUID格式",
  "title": "字符串，职位标题",
  "description": "字符串，职位描述",
  "industry": "字符串，行业",
  "education_requirement": "字符串，学历要求",
  "experience_requirement": "字符串，经验要求",
  "salary_min": "整数，最低薪资",
  "salary_max": "整数，最高薪资",
  "status": "整数，状态（1为正常）",
  "created_at": "字符串，创建时间",
  "updated_at": "字符串，更新时间"
}
```

#### 3.4 评估问题模型
```json
{
  "id": "字符串，UUID格式",
  "question": "字符串，问题内容",
  "options": "字符串，选项（以|分隔）",
  "type": "字符串，问题类型（single/multiple）",
  "created_at": "字符串，创建时间",
  "updated_at": "字符串，更新时间"
}
``` 