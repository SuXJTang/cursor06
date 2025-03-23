# 求职平台API接口文档

## 文档说明

本文档详细说明了求职平台API的接口定义、请求和响应格式，为前端开发人员提供接口调用指南。

**文档更新日期**: 2024-06-01

**API基础URL**: `http://localhost:8000/api/v1`

## 文档目录

1. [概述与规范](./overview.md) - API接口概述、全局规范和错误码说明
2. [认证接口](./auth-api.md) - 用户注册、登录和验证相关接口
3. [用户管理接口](./users-api.md) - 用户信息管理相关接口
4. [用户资料接口](./user-profiles-api.md) - 用户个人资料管理相关接口
5. [简历管理接口](./resumes-api.md) - 简历创建、更新和管理相关接口
6. [职业管理接口](./careers-api.md) - 职业信息查询相关接口
7. [职业分类接口](./career-categories-api.md) - 职业分类相关接口
8. [职业推荐接口](./career-recommendations-api.md) - 职业推荐相关接口
9. [工作管理接口](./jobs-api.md) - 工作岗位相关接口
10. [学习路径接口](./learning-paths-api.md) - 学习发展路径相关接口

## 快速上手

### 环境准备

确保已经启动了后端服务，默认运行在 `http://localhost:8000`

### 认证流程

1. 调用 `/api/v1/auth/register` 注册新用户
2. 调用 `/api/v1/auth/login` 登录并获取访问令牌 (access_token)
3. 所有需要认证的接口，在请求头中添加 `Authorization: Bearer {access_token}`

### 使用示例

#### 用户注册

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

#### 用户登录

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

## 开发指南

### API调试工具

推荐使用以下工具进行API调试：

- [Postman](https://www.postman.com/)
- [Swagger UI](http://localhost:8000/docs) - 访问后端服务提供的API文档界面

### 常见问题

1. **认证失败**
   - 检查访问令牌是否过期
   - 确保请求头格式正确: `Authorization: Bearer {token}`

2. **请求返回400错误**
   - 检查请求参数是否符合要求
   - 查看响应中的错误信息获取具体原因

3. **请求返回500错误**
   - 服务器内部错误，请联系后端开发人员处理

## 联系与支持

如有任何问题，请联系：

- 技术支持: support@example.com
- 文档维护: docs@example.com 