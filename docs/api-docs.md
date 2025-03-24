# API接口文档

## 基本信息

- 标题: job_platform
- 版本: 0.1.0

## 用户

### GET /api/v1/users/test

**摘要**: Test Users Endpoint

**描述**: 测试用户路由是否正常工作

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

### POST /api/v1/users/me/avatar

**摘要**: Upload Avatar

**描述**: 上传用户头像

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_upload_avatar_api_v1_users_me_avatar_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PATCH /api/v1/users/me/avatar-url

**摘要**: Update Avatar Url

**描述**: 直接更新用户头像URL

**请求体**:

- Content-Type: application/json
- Schema: UserAvatarUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/users/avatars/{filename}

**摘要**: Get Avatar

**描述**: 获取用户头像

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| filename | path | string | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### PATCH /api/v1/users/me

**摘要**: Update User Info

**描述**: 更新当前用户信息

**请求体**:

- Content-Type: application/json
- Schema: UserUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 认证

### POST /api/v1/auth/register

**摘要**: Register

**描述**: 用户注册

**请求体**:

- Content-Type: application/json
- Schema: UserCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### POST /api/v1/auth/login

**摘要**: Login Access Token

**描述**: OAuth2 登录验证

**请求体**:

- Content-Type: application/x-www-form-urlencoded
- Schema: Body_login_access_token_api_v1_auth_login_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### GET /api/v1/auth/me

**摘要**: Get Current User

**描述**: 获取当前登录用户信息

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/login/register

**摘要**: Register

**描述**: 用户注册

**请求体**:

- Content-Type: application/json
- Schema: UserCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### POST /api/v1/login/login

**摘要**: Login Access Token

**描述**: OAuth2 登录验证

**请求体**:

- Content-Type: application/x-www-form-urlencoded
- Schema: Body_login_access_token_api_v1_login_login_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### GET /api/v1/login/me

**摘要**: Get Current User

**描述**: 获取当前登录用户信息

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

## 用户资料

### GET /api/v1/user-profiles/me

**摘要**: Get My Profile

**描述**: 获取当前用户的个人资料

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/user-profiles/me

**摘要**: Update My Profile

**描述**: 更新当前用户的个人资料

**请求体**:

- Content-Type: application/json
- Schema: UserProfileUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/user-profiles/me

**摘要**: Create My Profile

**描述**: 创建当前用户的个人资料

**请求体**:

- Content-Type: application/json
- Schema: UserProfileCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/user-profiles/me/avatar

**摘要**: Update My Avatar

**描述**: 更新当前用户的头像

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| avatar_url | query | string | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/user-profiles/me/work-info

**摘要**: Update My Work Info

**描述**: 更新当前用户的工作信息

**请求体**:

- Content-Type: application/json
- Schema: UserProfileWorkInfoUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/user-profiles/me/career-interests

**摘要**: Update My Career Interests

**描述**: 更新当前用户的职业兴趣与工作风格

**请求体**:

- Content-Type: application/json
- Schema: UserProfileCareerUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/user-profiles/me/personality

**摘要**: Update My Personality

**描述**: 更新当前用户的性格特征

**请求体**:

- Content-Type: application/json
- Schema: UserProfilePersonalityUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/user-profiles/me/complete-profile

**摘要**: Update Complete Profile

**描述**: 一次性更新用户的完整个人资料（包括所有JSON字段）

**请求体**:

- Content-Type: application/json
- Schema: UserProfileUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 简历

### GET /api/v1/resumes/me

**摘要**: Read My Resume

**描述**: 获取当前用户的简历（如果存在）

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/resumes/me

**摘要**: Update My Resume

**描述**: 更新当前用户的简历

**请求体**:

- Content-Type: application/json
- Schema: ResumeUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/resumes/me

**摘要**: Create Resume

**描述**: 创建或更新用户的简历（一用户一简历）

**请求体**:

- Content-Type: application/json
- Schema: ResumeCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/resumes/{resume_id}

**摘要**: Read Resume

**描述**: 获取指定简历

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| resume_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/resumes/me/{resume_id}/status

**摘要**: Update Resume Status

**描述**: 更新简历状态

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| resume_id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: ResumeStatusUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/resumes/me/{resume_id}/file

**摘要**: Update Resume File

**描述**: 更新简历文件

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| resume_id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: ResumeFileUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/resumes/me/{resume_id}

**摘要**: Delete Resume

**描述**: 删除简历

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| resume_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 204 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/resumes/

**摘要**: List Resumes

**描述**: 列出所有简历（仅限已验证用户）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/resumes/upload

**摘要**: Upload Resume File

**描述**: 上传简历文件

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_upload_resume_file_api_v1_resumes_upload_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/resumes/download/{filename}

**摘要**: Download Resume File

**描述**: 下载简历文件

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| filename | path | string | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/resumes/{resume_id}/force-delete

**摘要**: Force Delete Resume

**描述**: 强制删除简历记录，仅删除数据库记录，不删除物理文件

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| resume_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/resumes/delete/{filename}

**摘要**: Delete Resume By Filename

**描述**: 通过文件名删除简历
前端可以直接传入文件名而不是通过resume-files接口

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| filename | path | string | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 工作分类

### GET /api/v1/job-categories/

**摘要**: Read Job Categories

**描述**: 获取职位分类列表。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| parent_id | query | integer | 否 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/job-categories/

**摘要**: Create Job Category

**描述**: 创建新的职位分类。

**请求体**:

- Content-Type: application/json
- Schema: JobCategoryCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-categories/tree

**摘要**: Read Job Category Tree

**描述**: 获取职位分类树。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| root_id | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-categories/{id}

**摘要**: Read Job Category

**描述**: 通过ID获取职位分类。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/job-categories/{id}

**摘要**: Update Job Category

**描述**: 更新职位分类。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: JobCategoryUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/job-categories/{id}

**摘要**: Delete Job Category

**描述**: 删除职位分类。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/job-categories/{id}/move

**摘要**: Move Job Category

**描述**: 移动职位分类（更改父分类）。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |
| new_parent_id | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-categories/{id}/ancestors

**摘要**: Read Job Category Ancestors

**描述**: 获取指定职位分类的所有祖先分类。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-categories/{id}/descendants

**摘要**: Read Job Category Descendants

**描述**: 获取指定职位分类的所有后代分类。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 工作

### GET /api/v1/jobs/

**摘要**: Read Jobs

**描述**: 获取职位列表。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |
| category_id | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/jobs/

**摘要**: Create Job

**描述**: 创建新职位。

**请求体**:

- Content-Type: application/json
- Schema: JobCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/jobs/search

**摘要**: Search Jobs

**描述**: 搜索职位。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |
| keyword | query | string | 否 | 无 |
| location | query | string | 否 | 无 |
| job_type | query | string | 否 | 无 |
| education_required | query | string | 否 | 无 |
| experience_required | query | string | 否 | 无 |
| category_id | query | integer | 否 | 无 |
| min_salary | query | integer | 否 | 无 |
| max_salary | query | integer | 否 | 无 |
| company | query | string | 否 | 无 |
| status | query | string | 否 | 无 |
| sort_by | query | string | 否 | 无 |
| sort_desc | query | boolean | 否 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: 内联架构
- 必填: 否

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/jobs/{id}

**摘要**: Read Job

**描述**: 通过ID获取职位。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/jobs/{id}

**摘要**: Update Job

**描述**: 更新职位。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: JobUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/jobs/{id}

**摘要**: Delete Job

**描述**: 删除职位。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/jobs/{id}/status

**摘要**: Update Job Status

**描述**: 更新职位状态。

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: 内联架构
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 工作导入

### GET /api/v1/job-imports/template

**摘要**: Download Template

**描述**: 下载导入模板

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/job-imports/upload

**摘要**: Upload Jobs

**描述**: 上传职业数据文件

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_upload_jobs_api_v1_job_imports_upload_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-imports/records

**摘要**: Read Import Records

**描述**: 获取导入记录列表

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-imports/records/{record_id}

**摘要**: Read Import Record

**描述**: 获取导入记录详情

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| record_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-imports/

**摘要**: Read Job Imports

**描述**: 获取所有职业导入记录

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/job-imports/

**摘要**: Create Job Import

**描述**: 创建职业导入记录

**请求体**:

- Content-Type: application/json
- Schema: JobImportCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-imports/{job_import_id}

**摘要**: Read Job Import

**描述**: 获取职业导入记录

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| job_import_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/job-imports/{job_import_id}

**摘要**: Delete Job Import

**描述**: 删除职业导入记录

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| job_import_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 204 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/job-imports/{id}

**摘要**: Update Job Import

**描述**: 更新职业导入记录

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: JobImportUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/job-imports/{job_import_id}/status

**摘要**: Get Job Import Status

**描述**: 获取职业导入记录状态

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| job_import_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PATCH /api/v1/job-imports/{job_import_id}/status

**摘要**: Update Job Import Status

**描述**: 更新职业导入记录状态

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| job_import_id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: JobImportStatusUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 职业

### GET /api/v1/careers/

**摘要**: Get Careers

**描述**: 获取所有职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/careers/

**摘要**: Create Career

**描述**: 创建新职业（仅限管理员）

**请求体**:

- Content-Type: application/json
- Schema: CareerCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/careers/{career_id}

**摘要**: Get Career

**描述**: 根据ID获取指定职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/careers/{career_id}

**摘要**: Update Career

**描述**: 更新职业信息（仅限管理员）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: CareerUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/careers/{career_id}

**摘要**: Delete Career

**描述**: 删除职业（仅限管理员）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/careers/category/{category_id}

**摘要**: Get Careers By Category

**描述**: 根据分类ID获取职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/careers/search/

**摘要**: Search Careers

**描述**: 搜索职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| keyword | query | string | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/careers/skills/

**摘要**: Get Careers By Skills

**描述**: 根据技能列表获取职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skills | query | array | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/careers/{career_id}/favorite

**摘要**: Favorite Career

**描述**: 收藏职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/careers/{career_id}/favorite

**摘要**: Unfavorite Career

**描述**: 取消收藏职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/careers/user/favorites

**摘要**: Get Favorite Careers

**描述**: 获取用户收藏的所有职业

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/careers/{career_id}/is_favorite

**摘要**: Check If Favorite

**描述**: 检查职业是否已收藏

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 职业分类

### GET /api/v1/career-categories/

**摘要**: Get Categories

**描述**: 获取所有职业分类，可选择是否包含子分类

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |
| include_children | query | boolean | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-categories/

**摘要**: Create Category

**描述**: 创建新职业分类（仅限管理员）

**请求体**:

- Content-Type: application/json
- Schema: CareerCategoryCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-categories/roots

**摘要**: Get Root Categories

**描述**: 获取根职业分类（没有父分类的分类），可选择是否包含子分类

- include_children: 是否包含子分类
- include_all_children: 是否包含所有层级的子分类（包括子子分类）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |
| include_children | query | boolean | 否 | 无 |
| include_all_children | query | boolean | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-categories/{category_id}

**摘要**: Get Category

**描述**: 根据ID获取指定职业分类

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/career-categories/{category_id}

**摘要**: Update Category

**描述**: 更新职业分类（仅限管理员）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: CareerCategoryUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/career-categories/{category_id}

**摘要**: Delete Category

**描述**: 删除职业分类（仅限管理员）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-categories/{category_id}/subcategories

**摘要**: Get Subcategories

**描述**: 获取指定分类的子分类，可选择是否包含子子分类

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |
| include_children | query | boolean | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-categories/{category_id}/careers

**摘要**: Get Category Careers

**描述**: 获取指定分类下的所有职业，包括子分类下的职业

- include_subcategories: 是否包含子分类下的职业（默认包含）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |
| include_subcategories | query | boolean | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-categories/{category_id}/tree

**摘要**: Get Category Tree

**描述**: 获取指定分类的分类树

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| category_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-categories/roots/careers

**摘要**: Get All Root Categories Careers

**描述**: 获取所有一级类别及其下的所有职业数据（包括子分类中的职业）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 职业推荐

### GET /api/v1/career-recommendations/

**摘要**: Get Recommendations

**描述**: 获取当前用户的职业推荐

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-recommendations/favorites

**摘要**: Get Favorite Recommendations

**描述**: 获取当前用户收藏的职业推荐

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-recommendations/generate

**摘要**: Generate Recommendations

**描述**: 为当前用户生成职业推荐

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-recommendations/toggle-favorite

**摘要**: Toggle Favorite

**描述**: 切换收藏状态

**请求体**:

- Content-Type: application/json
- Schema: FavoriteRequest
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-recommendations/{id}/accept

**摘要**: Accept Recommendation

**描述**: 接受职业推荐

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-recommendations/{id}/feedback

**摘要**: Provide Feedback

**描述**: 提供简单文本反馈

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: FeedbackRequest
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-recommendations/{id}/enhanced-feedback

**摘要**: Provide Enhanced Feedback

**描述**: 提供详细反馈信息

此端点允许用户提供更全面的反馈，包括：
- 满意度评分（1-5星）
- 反馈类别（准确性/相关性/实用性等）
- 具体评价方面（技能匹配/薪资/发展前景等）
- 改进建议

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: EnhancedFeedbackRequest
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 学习路径

### GET /api/v1/learning-paths/

**摘要**: Get Learning Paths

**描述**: 获取所有学习路径

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/learning-paths/

**摘要**: Create Learning Path

**描述**: 创建新学习路径（仅限管理员）

**请求体**:

- Content-Type: application/json
- Schema: LearningPathCreate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/learning-paths/popular

**摘要**: Get Popular Learning Paths

**描述**: 获取热门学习路径

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/learning-paths/{path_id}

**摘要**: Get Learning Path

**描述**: 根据ID获取指定学习路径

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| path_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### PUT /api/v1/learning-paths/{path_id}

**摘要**: Update Learning Path

**描述**: 更新学习路径（仅限管理员）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| path_id | path | integer | 是 | 无 |

**请求体**:

- Content-Type: application/json
- Schema: LearningPathUpdate
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/learning-paths/{path_id}

**摘要**: Delete Learning Path

**描述**: 删除学习路径（仅限管理员）

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| path_id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/learning-paths/career/{career_id}

**摘要**: Get Learning Paths By Career

**描述**: 获取指定职业的学习路径

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| career_id | path | integer | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/learning-paths/difficulty/{difficulty}

**摘要**: Get Learning Paths By Difficulty

**描述**: 根据难度获取学习路径

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| difficulty | path | string | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/learning-paths/search/

**摘要**: Search Learning Paths

**描述**: 搜索学习路径

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| keyword | query | string | 是 | 无 |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 职业导入

### GET /api/v1/career-imports/

**摘要**: Read Imports

**描述**: 获取导入记录列表

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/career-imports/

**摘要**: Create Import

**描述**: 导入职业数据

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_create_import_api_v1_career_imports__post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-imports/template

**摘要**: Download Template

**描述**: 下载Excel导入模板

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/career-imports/{id}

**摘要**: Read Import

**描述**: 获取导入记录详情

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/career-imports/{id}

**摘要**: Delete Import

**描述**: 删除导入记录

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| id | path | integer | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

## 简历文件

### GET /api/v1/resume-files/

**摘要**: List Resume Files

**描述**: 获取当前用户的简历文件列表
遵循一用户一简历原则，只返回最新的简历文件

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| skip | query | integer | 否 | 无 |
| limit | query | integer | 否 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/resume-files/upload

**摘要**: Upload Resume File

**描述**: 上传简历文件

遵循一用户一简历原则：如果用户已有简历文件，会删除旧文件并替换为新上传的文件

- **file**: 要上传的文件（PDF, Word等格式）

返回:
    上传成功的文件信息

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_upload_resume_file_api_v1_resume_files_upload_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### DELETE /api/v1/resume-files/{filename}

**摘要**: Delete Resume File

**描述**: Delete resume file and remove all associated database records

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| filename | path | string | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### GET /api/v1/resume-files/download/{filename}

**摘要**: Download Resume File

**描述**: 下载简历文件

**参数**:

| 名称 | 位置 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- | ---- |
| filename | path | string | 是 | 无 |

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

**安全要求**:

- OAuth2PasswordBearer

---

### POST /api/v1/resume-files/cleanup

**摘要**: Cleanup Resume Files

**描述**: 清理未关联的简历文件
仅限超级管理员使用

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

**安全要求**:

- OAuth2PasswordBearer

---

## 简历解析

### POST /api/v1/resume/parse

**摘要**: Parse Resume

**描述**: 解析上传的简历文件

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_parse_resume_api_v1_resume_parse_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### POST /api/v1/resume/parse-ai

**摘要**: AI Enhanced Resume Parsing

**描述**: 使用AI增强的简历解析
支持格式：PDF、DOCX、HTML、TXT

返回AI增强的结构化数据，包括更详细的技能分析和职业匹配

**请求体**:

- Content-Type: multipart/form-data
- Schema: Body_parse_resume_with_ai_api_v1_resume_parse_ai_post
- 必填: 是

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |
| 422 | Validation Error |

---

### POST /api/v1/resume/test-deepseek

**摘要**: Test Deepseek Api

**描述**: 测试DeepSeek API是否正常工作

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

## 未分组的接口

### GET /debug-openapi

**摘要**: Debug Openapi

**描述**: 调试OpenAPI文档生成

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

### GET /test-cache

**摘要**: Test Cache

**描述**: 测试缓存功能的简单API

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

### GET /test

**摘要**: Test

**描述**: 测试API

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

### GET /

**摘要**: Root

**描述**: 根路由

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

### GET /health

**摘要**: Health Check

**描述**: 健康检查接口

**响应**:

| 状态码 | 描述 |
| ---- | ---- |
| 200 | Successful Response |

---

## 模型定义

### Body_create_import_api_v1_career_imports__post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Body_login_access_token_api_v1_auth_login_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| grant_type | string | 无 | 否 |
| username | string | 无 | 是 |
| password | string | 无 | 是 |
| scope | string | 无 | 否 |
| client_id | string | 无 | 否 |
| client_secret | string | 无 | 否 |

---

### Body_login_access_token_api_v1_login_login_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| grant_type | string | 无 | 否 |
| username | string | 无 | 是 |
| password | string | 无 | 是 |
| scope | string | 无 | 否 |
| client_id | string | 无 | 否 |
| client_secret | string | 无 | 否 |

---

### Body_parse_resume_api_v1_resume_parse_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Body_parse_resume_with_ai_api_v1_resume_parse_ai_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Body_upload_avatar_api_v1_users_me_avatar_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Body_upload_jobs_api_v1_job_imports_upload_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Body_upload_resume_file_api_v1_resume_files_upload_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Body_upload_resume_file_api_v1_resumes_upload_post

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file | string | 无 | 是 |

---

### Career

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 否 |
| description | string | 无 | 否 |
| required_skills | Array<string> | 无 | 否 |
| average_salary | string | 无 | 否 |
| job_outlook | string | 无 | 否 |
| education_required | string | 无 | 否 |
| experience_required | string | 无 | 否 |
| career_path |  | 无 | 否 |
| market_analysis | object | 无 | 否 |
| salary_range | object | 无 | 否 |
| future_prospect | string | 无 | 否 |
| related_majors | Array<string> | 无 | 否 |
| work_activities | Array<string> | 无 | 否 |
| category_id | integer | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |

---

### CareerCategory

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| description | string | 无 | 否 |
| parent_id | integer | 无 | 否 |
| order | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| icon | string | 无 | 否 |
| banner_image | string | 无 | 否 |
| meta_title | string | 无 | 否 |
| meta_description | string | 无 | 否 |
| additional_info | object | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |

---

### CareerCategoryCreate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| description | string | 无 | 否 |
| parent_id | integer | 无 | 否 |
| order | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| icon | string | 无 | 否 |
| banner_image | string | 无 | 否 |
| meta_title | string | 无 | 否 |
| meta_description | string | 无 | 否 |
| additional_info | object | 无 | 否 |

---

### CareerCategoryUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 否 |
| description | string | 无 | 否 |
| parent_id | integer | 无 | 否 |
| order | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| icon | string | 无 | 否 |
| banner_image | string | 无 | 否 |
| meta_title | string | 无 | 否 |
| meta_description | string | 无 | 否 |
| additional_info | object | 无 | 否 |

---

### CareerCategoryWithChildren

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| description | string | 无 | 否 |
| parent_id | integer | 无 | 否 |
| order | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| icon | string | 无 | 否 |
| banner_image | string | 无 | 否 |
| meta_title | string | 无 | 否 |
| meta_description | string | 无 | 否 |
| additional_info | object | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |
| children | Array<CareerCategoryWithChildren> | 无 | 否 |

---

### CareerCreate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 是 |
| description | string | 无 | 是 |
| required_skills | Array<string> | 无 | 否 |
| education_required | string | 无 | 否 |
| experience_required | string | 无 | 否 |
| career_path |  | 无 | 否 |
| market_analysis | object | 无 | 否 |
| salary_range | object | 无 | 否 |
| future_prospect | string | 无 | 否 |
| category_id | integer | 无 | 是 |

---

### CareerImport

API响应中的职业导入记录模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| filename | string | 无 | 是 |
| file_size | integer | 无 | 否 |
| total_count | integer | 无 | 否 |
| success_count | integer | 无 | 否 |
| failed_count | integer | 无 | 否 |
| status | string | 无 | 否 |
| error_details | object | 无 | 否 |
| importer_id | integer | 无 | 是 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |

---

### CareerRecommendation

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| user_id | integer | 无 | 是 |
| career_id | integer | 无 | 是 |
| match_score | integer | 无 | 是 |
| analysis_report | object | 无 | 是 |
| is_accepted | boolean | 无 | 否 |
| feedback | string | 无 | 否 |
| satisfaction_score | integer | 满意度评分，1-5星 | 否 |
| feedback_category | FeedbackCategory | 无 | 否 |
| specific_aspects | object | 无 | 否 |
| improvement_suggestions | string | 无 | 否 |
| feedback_time | string | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |

---

### CareerRecommendationList

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| recommendations | Array<CareerRecommendationWithCareer> | 无 | 是 |
| total | integer | 无 | 是 |

---

### CareerRecommendationWithCareer

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| user_id | integer | 无 | 是 |
| career_id | integer | 无 | 是 |
| match_score | integer | 无 | 是 |
| analysis_report | object | 无 | 是 |
| is_accepted | boolean | 无 | 否 |
| feedback | string | 无 | 否 |
| satisfaction_score | integer | 满意度评分，1-5星 | 否 |
| feedback_category | FeedbackCategory | 无 | 否 |
| specific_aspects | object | 无 | 否 |
| improvement_suggestions | string | 无 | 否 |
| feedback_time | string | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |
| career | Career | 无 | 是 |

---

### CareerSearchResult

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| careers | Array<Career> | 无 | 是 |
| total | integer | 无 | 是 |
| page | integer | 无 | 是 |
| per_page | integer | 无 | 是 |
| pages | integer | 无 | 是 |

---

### CareerUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 否 |
| description | string | 无 | 否 |
| required_skills | Array<string> | 无 | 否 |
| education_required | string | 无 | 否 |
| experience_required | string | 无 | 否 |
| career_path |  | 无 | 否 |
| market_analysis | object | 无 | 否 |
| salary_range | object | 无 | 否 |
| future_prospect | string | 无 | 否 |
| category_id | integer | 无 | 否 |

---

### CareerWithStats

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 否 |
| description | string | 无 | 否 |
| required_skills | Array<string> | 无 | 否 |
| average_salary | string | 无 | 否 |
| job_outlook | string | 无 | 否 |
| education_required | string | 无 | 否 |
| experience_required | string | 无 | 否 |
| career_path |  | 无 | 否 |
| market_analysis | object | 无 | 否 |
| salary_range | object | 无 | 否 |
| future_prospect | string | 无 | 否 |
| related_majors | Array<string> | 无 | 否 |
| work_activities | Array<string> | 无 | 否 |
| category_id | integer | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |
| related_jobs_count | integer | 无 | 是 |
| learning_paths_count | integer | 无 | 是 |

---

### CategoryTree

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| id | integer | 无 | 是 |
| name | string | 无 | 是 |
| description | string | 无 | 否 |
| parent_id | integer | 无 | 否 |
| icon | string | 无 | 否 |
| children | Array<CategoryTree> | 无 | 否 |
| level | integer | 无 | 否 |

---

### CategoryWithCareers

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| description | string | 无 | 否 |
| parent_id | integer | 无 | 否 |
| order | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| icon | string | 无 | 否 |
| banner_image | string | 无 | 否 |
| meta_title | string | 无 | 否 |
| meta_description | string | 无 | 否 |
| additional_info | object | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |
| careers_data | CareerSearchResult | 无 | 否 |

---

### CleanupResponse

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| success | boolean | 无 | 是 |
| deleted_files | integer | 无 | 是 |
| message | string | 无 | 是 |

---

### DeleteFileResponse

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| success | boolean | 无 | 是 |
| deleted_records | integer | 无 | 是 |
| deleted_file | boolean | 无 | 是 |
| message | string | 无 | 是 |

---

### EnhancedFeedbackRequest

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| recommendation_id | integer | 无 | 是 |
| feedback | string | 无 | 否 |
| satisfaction_score | integer | 满意度评分，1-5星 | 是 |
| feedback_category |  | 反馈类别 | 是 |
| specific_aspects | object | 具体评价方面，如{'技能匹配': 4, '薪资': 3, '发展前景': 5} | 是 |
| improvement_suggestions | string | 改进建议 | 否 |

---

### FavoriteRequest

收藏请求模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| user_id | integer | 无 | 是 |
| career_id | integer | 无 | 是 |
| recommendation_id | integer | 无 | 是 |

---

### FeedbackCategory

An enumeration.

**类型**: string

**枚举值**: 准确性, 相关性, 实用性, 职业发展路径, 其他

---

### FeedbackRequest

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| recommendation_id | integer | 无 | 是 |
| feedback | string | 无 | 是 |

---

### HTTPValidationError

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| detail | Array<ValidationError> | 无 | 否 |

---

### ImportStatus

An enumeration.

**类型**: string

**枚举值**: 待处理, 处理中, 已完成, 失败, 部分完成

---

### Job

API响应中的工作模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 职位标题 | 是 |
| company | string | 公司名称 | 是 |
| description | string | 职位描述 | 是 |
| requirements | string | 职位要求 | 是 |
| skills | string | 所需技能 | 否 |
| salary_range | string | 薪资范围 | 是 |
| location | string | 工作地点 | 是 |
| job_type | string | 工作类型 | 是 |
| category_id | integer | 职位分类ID | 是 |
| experience_required | string | 所需工作经验 | 是 |
| education_required | string | 学历要求 | 是 |
| benefits | string | 职位福利 | 否 |
| status | string | 职位状态(active/inactive) | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 是 |

---

### JobCategory

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| parent_id | integer | 无 | 否 |
| description | string | 无 | 否 |
| id | integer | 无 | 是 |
| level | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 是 |

---

### JobCategoryCreate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| parent_id | integer | 无 | 否 |
| description | string | 无 | 否 |

---

### JobCategoryUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| name | string | 无 | 是 |
| parent_id | integer | 无 | 否 |
| description | string | 无 | 否 |

---

### JobCreate

创建工作时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 职位标题 | 是 |
| company | string | 公司名称 | 是 |
| description | string | 职位描述 | 是 |
| requirements | string | 职位要求 | 是 |
| skills | string | 所需技能 | 否 |
| salary_range | string | 薪资范围 | 是 |
| location | string | 工作地点 | 是 |
| job_type | string | 工作类型 | 是 |
| category_id | integer | 职位分类ID | 是 |
| experience_required | string | 所需工作经验 | 是 |
| education_required | string | 学历要求 | 是 |
| benefits | string | 职位福利 | 否 |
| status | string | 职位状态(active/inactive) | 否 |

---

### JobImport

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| user_id | integer | 无 | 是 |
| file_name | string | 无 | 是 |
| file_url | string | 无 | 是 |
| file_size | integer | 无 | 是 |
| file_type | string | 无 | 是 |
| import_type | string | 无 | 是 |
| status |  | 无 | 否 |
| total_records | integer | 无 | 否 |
| processed_records | integer | 无 | 否 |
| failed_records | integer | 无 | 否 |
| error_message | string | 无 | 否 |
| result_summary | object | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |

---

### JobImportCreate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| user_id | integer | 无 | 是 |
| file_name | string | 无 | 是 |
| file_url | string | 无 | 是 |
| file_size | integer | 无 | 是 |
| file_type | string | 无 | 是 |
| import_type | string | 无 | 是 |

---

### JobImportStatusUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| status | ImportStatus | 无 | 是 |

---

### JobImportUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| status | ImportStatus | 无 | 否 |
| total_records | integer | 无 | 否 |
| processed_records | integer | 无 | 否 |
| failed_records | integer | 无 | 否 |
| error_message | string | 无 | 否 |
| result_summary | object | 无 | 否 |

---

### JobUpdate

更新工作时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 职位标题 | 是 |
| company | string | 公司名称 | 是 |
| description | string | 职位描述 | 是 |
| requirements | string | 职位要求 | 是 |
| skills | string | 所需技能 | 否 |
| salary_range | string | 薪资范围 | 是 |
| location | string | 工作地点 | 是 |
| job_type | string | 工作类型 | 是 |
| category_id | integer | 职位分类ID | 是 |
| experience_required | string | 所需工作经验 | 是 |
| education_required | string | 学历要求 | 是 |
| benefits | string | 职位福利 | 否 |
| status | string | 职位状态(active/inactive) | 否 |

---

### LearningPath

API响应中的学习路径模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 是 |
| description | string | 无 | 是 |
| difficulty | string | 无 | 否 |
| career_id | integer | 无 | 否 |
| target_job_id | integer | 无 | 否 |
| estimated_time | string | 无 | 否 |
| content | string | 无 | 否 |
| resources | string | 无 | 否 |
| prerequisites | string | 无 | 否 |
| view_count | integer | 无 | 否 |
| current_level | string | 无 | 否 |
| target_level | string | 无 | 否 |
| required_skills | Array<object> | 无 | 否 |
| learning_steps | Array<object> | 无 | 否 |
| timeline | object | 无 | 否 |
| progress | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| completion_date | string | 无 | 否 |
| notes | string | 无 | 否 |
| id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |
| user_id | integer | 无 | 否 |

---

### LearningPathCreate

创建学习路径时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 是 |
| description | string | 无 | 是 |
| difficulty | string | 无 | 否 |
| career_id | integer | 无 | 否 |
| target_job_id | integer | 无 | 否 |
| estimated_time | string | 无 | 否 |
| content | string | 无 | 否 |
| resources | string | 无 | 否 |
| prerequisites | string | 无 | 否 |
| view_count | integer | 无 | 否 |
| current_level | string | 无 | 否 |
| target_level | string | 无 | 否 |
| required_skills | Array<object> | 无 | 否 |
| learning_steps | Array<object> | 无 | 否 |
| timeline | object | 无 | 否 |
| progress | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| completion_date | string | 无 | 否 |
| notes | string | 无 | 否 |

---

### LearningPathUpdate

更新学习路径时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 否 |
| description | string | 无 | 否 |
| difficulty | string | 无 | 否 |
| career_id | integer | 无 | 否 |
| target_job_id | integer | 无 | 否 |
| estimated_time | string | 无 | 否 |
| content | string | 无 | 否 |
| resources | string | 无 | 否 |
| prerequisites | string | 无 | 否 |
| view_count | integer | 无 | 否 |
| current_level | string | 无 | 否 |
| target_level | string | 无 | 否 |
| required_skills | Array<object> | 无 | 否 |
| learning_steps | Array<object> | 无 | 否 |
| timeline | object | 无 | 否 |
| progress | integer | 无 | 否 |
| is_active | boolean | 无 | 否 |
| completion_date | string | 无 | 否 |
| notes | string | 无 | 否 |

---

### Message

消息响应模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| message | string | 无 | 是 |

---

### Resume

API响应中的简历模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 否 |
| content | string | 无 | 否 |
| is_active | boolean | 无 | 否 |
| file_url | string | 无 | 否 |
| status |  | 无 | 否 |
| id | integer | 无 | 是 |
| user_id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 是 |

---

### ResumeCreate

创建简历时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 是 |
| content | string | 无 | 是 |
| is_active | boolean | 无 | 否 |
| file_url | string | 无 | 否 |
| status |  | 无 | 否 |

---

### ResumeFile

上传简历文件的响应模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| filename | string | 无 | 是 |
| file_size | integer | 无 | 是 |
| file_type | string | 无 | 是 |
| file_url | string | 无 | 是 |

---

### ResumeFileUpdate

更新简历文件时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| file_url | string | 无 | 是 |

---

### ResumeStatus

简历状态枚举

**类型**: string

**枚举值**: draft, submitted, approved, rejected

---

### ResumeStatusUpdate

更新简历状态时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| status | ResumeStatus | 无 | 是 |

---

### ResumeUpdate

更新简历时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| title | string | 无 | 否 |
| content | string | 无 | 否 |
| is_active | boolean | 无 | 否 |
| file_url | string | 无 | 否 |
| status |  | 无 | 否 |

---

### Token

访问令牌模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| access_token | string | 无 | 是 |
| token_type | string | 无 | 否 |

---

### User

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| email | string | 无 | 否 |
| username | string | 无 | 否 |
| phone | string | 无 | 否 |
| is_active | boolean | 无 | 否 |
| is_superuser | boolean | 无 | 否 |
| avatar_url | string | 无 | 否 |
| id | integer | 无 | 否 |

---

### UserAvatarUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| avatar_url | string | 无 | 是 |

---

### UserCreate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| email | string | 无 | 是 |
| username | string | 无 | 是 |
| phone | string | 无 | 否 |
| is_active | boolean | 无 | 否 |
| is_superuser | boolean | 无 | 否 |
| avatar_url | string | 无 | 否 |
| password | string | 无 | 是 |

---

### UserProfile

API响应中的用户档案模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| full_name | string | 无 | 否 |
| gender | string | 无 | 否 |
| date_of_birth | string | 无 | 否 |
| avatar_url | string | 无 | 否 |
| bio | string | 无 | 否 |
| phone | string | 无 | 否 |
| work_years | integer | 无 | 否 |
| current_status | string | 无 | 否 |
| education_level | string | 无 | 否 |
| education_background | string | 无 | 否 |
| location_city | string | 无 | 否 |
| location_province | string | 无 | 否 |
| resume_url | string | 无 | 否 |
| skills |  | 无 | 否 |
| interests |  | 无 | 否 |
| skill_tags |  | 无 | 否 |
| learning_ability |  | 无 | 否 |
| career_interests |  | 无 | 否 |
| personality_traits |  | 无 | 否 |
| work_style |  | 无 | 否 |
| learning_style |  | 无 | 否 |
| growth_potential |  | 无 | 否 |
| recommended_paths |  | 无 | 否 |
| ai_analysis |  | 无 | 否 |
| id | integer | 无 | 是 |
| user_id | integer | 无 | 是 |
| created_at | string | 无 | 是 |
| updated_at | string | 无 | 否 |

---

### UserProfileCareerUpdate

更新职业兴趣的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| career_interests |  | 无 | 否 |
| work_style |  | 无 | 否 |
| growth_potential |  | 无 | 否 |

---

### UserProfileCreate

创建用户档案时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| full_name | string | 无 | 否 |
| gender | string | 无 | 否 |
| date_of_birth | string | 无 | 否 |
| avatar_url | string | 无 | 否 |
| bio | string | 无 | 否 |
| phone | string | 无 | 否 |
| work_years | integer | 无 | 否 |
| current_status | string | 无 | 否 |
| education_level | string | 无 | 否 |
| education_background | string | 无 | 否 |
| location_city | string | 无 | 否 |
| location_province | string | 无 | 否 |
| resume_url | string | 无 | 否 |
| skills |  | 无 | 否 |
| interests |  | 无 | 否 |
| skill_tags |  | 无 | 否 |
| learning_ability |  | 无 | 否 |
| career_interests |  | 无 | 否 |
| personality_traits |  | 无 | 否 |
| work_style |  | 无 | 否 |
| learning_style |  | 无 | 否 |
| growth_potential |  | 无 | 否 |
| recommended_paths |  | 无 | 否 |
| ai_analysis |  | 无 | 否 |

---

### UserProfilePersonalityUpdate

更新性格特征的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| personality_traits |  | 无 | 否 |
| learning_style |  | 无 | 否 |
| learning_ability |  | 无 | 否 |

---

### UserProfileUpdate

更新用户档案时的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| full_name | string | 无 | 否 |
| gender | string | 无 | 否 |
| date_of_birth | string | 无 | 否 |
| avatar_url | string | 无 | 否 |
| bio | string | 无 | 否 |
| phone | string | 无 | 否 |
| work_years | integer | 无 | 否 |
| current_status | string | 无 | 否 |
| education_level | string | 无 | 否 |
| education_background | string | 无 | 否 |
| location_city | string | 无 | 否 |
| location_province | string | 无 | 否 |
| resume_url | string | 无 | 否 |
| skills |  | 无 | 否 |
| interests |  | 无 | 否 |
| skill_tags |  | 无 | 否 |
| learning_ability |  | 无 | 否 |
| career_interests |  | 无 | 否 |
| personality_traits |  | 无 | 否 |
| work_style |  | 无 | 否 |
| learning_style |  | 无 | 否 |
| growth_potential |  | 无 | 否 |
| recommended_paths |  | 无 | 否 |
| ai_analysis |  | 无 | 否 |

---

### UserProfileWorkInfoUpdate

更新工作信息的模型

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| work_years | integer | 无 | 否 |
| current_status | string | 无 | 否 |
| skills |  | 无 | 否 |
| skill_tags |  | 无 | 否 |

---

### UserUpdate

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| email | string | 无 | 否 |
| username | string | 无 | 否 |
| phone | string | 无 | 否 |
| is_active | boolean | 无 | 否 |
| is_superuser | boolean | 无 | 否 |
| avatar_url | string | 无 | 否 |
| password | string | 无 | 否 |

---

### ValidationError

**类型**: object

**属性**:

| 名称 | 类型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| loc | Array<any> | 无 | 是 |
| msg | string | 无 | 是 |
| type | string | 无 | 是 |

---

