# 高校职业推荐系统API文档

> 最后更新时间：2024-03-21

## 一、API概述

### 1. 接口规范
- 基础路径：/api/v1
- 请求方式：GET, POST, PUT, DELETE
- 数据格式：application/json
- 字符编码：UTF-8
- 时间格式：ISO 8601

### 2. 认证方式
- 使用JWT Token认证
- Token在Header中携带
- 格式：Authorization: Bearer {token}

### 3. 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 4. 错误码
- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器错误

## 二、用户服务接口

### 1. 用户认证
#### 1.1 用户登录
- 请求路径：/api/auth/login
- 请求方式：POST
- 请求参数：
```json
{
  "username": "string",
  "password": "string"
}
```
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "role": "string"
    }
  }
}
```

#### 1.2 用户注册
- 请求路径：/auth/register
- 请求方式：POST
- 请求参数：
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "role": "string"
}
```
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "username": "string"
  }
}
```

### 2. 用户信息
#### 2.1 获取用户信息
- 请求路径：/users/{id}
- 请求方式：GET
- 请求参数：无
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "profile": {
      "name": "string",
      "age": "number",
      "gender": "string"
    }
  }
}
```

## 三、简历服务接口

### 1. 简历管理
#### 1.1 创建简历
- 请求路径：/resumes
- 请求方式：POST
- 请求参数：
```json
{
  "userId": "string",
  "basic": {
    "name": "string",
    "gender": "string",
    "birthday": "string",
    "phone": "string",
    "email": "string"
  },
  "education": [{
    "school": "string",
    "major": "string",
    "degree": "string",
    "startDate": "string",
    "endDate": "string"
  }],
  "skills": [{
    "name": "string",
    "level": "number"
  }]
}
```
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "createTime": "string"
  }
}
```

## 四、推荐服务接口

### 1. 职业推荐
#### 1.1 获取推荐职业
- 请求路径：/recommendations/careers
- 请求方式：GET
- 请求参数：
  - userId: string (query)
  - limit: number (query, optional)
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "recommendations": [{
      "id": "string",
      "title": "string",
      "company": "string",
      "salary": {
        "min": "number",
        "max": "number"
      },
      "matchDegree": "number",
      "skills": ["string"]
    }]
  }
}
```

### 2. 技能推荐
#### 2.1 获取推荐技能
- 请求路径：/recommendations/skills
- 请求方式：GET
- 请求参数：
  - userId: string (query)
  - careerType: string (query, optional)
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "recommendations": [{
      "id": "string",
      "name": "string",
      "importance": "number",
      "difficulty": "number",
      "courses": [{
        "id": "string",
        "title": "string",
        "platform": "string",
        "url": "string"
      }]
    }]
  }
}
```

## 五、测评服务接口

### 1. 职业测评
#### 1.1 创建测评
- 请求路径：/assessments
- 请求方式：POST
- 请求参数：
```json
{
  "userId": "string",
  "type": "string",
  "answers": [{
    "questionId": "string",
    "answer": "string"
  }]
}
```
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "result": {
      "personality": ["string"],
      "interests": ["string"],
      "abilities": ["string"],
      "recommendations": [{
        "career": "string",
        "matchDegree": "number"
      }]
    }
  }
}
```

## 六、数据管理接口

### 1. 职业数据
#### 1.1 添加职业信息
- 请求路径：/careers
- 请求方式：POST
- 请求参数：
```json
{
  "title": "string",
  "description": "string",
  "requirements": {
    "education": "string",
    "experience": "string",
    "skills": ["string"]
  },
  "salary": {
    "min": "number",
    "max": "number"
  },
  "industry": "string"
}
```
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string"
  }
}
```

## 七、系统管理接口

### 1. 配置管理
#### 1.1 更新系统配置
- 请求路径：/system/config
- 请求方式：PUT
- 请求参数：
```json
{
  "recommendationConfig": {
    "weights": {
      "skills": "number",
      "education": "number",
      "experience": "number"
    },
    "threshold": "number"
  },
  "systemConfig": {
    "maxConcurrent": "number",
    "cacheExpiration": "number"
  }
}
```
- 响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "updateTime": "string"
  }
}
``` 