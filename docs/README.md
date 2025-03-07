# 高校职业推荐系统文档目录

```
docs/
├── overview/                     # 项目概述
│   ├── introduction.md          # 项目介绍
│   ├── architecture.md          # 架构设计
│   └── tech-stack.md           # 技术栈
│
├── specifications/              # 开发规范
│   ├── code-style.md           # 代码规范
│   ├── git-commit.md           # Git提交规范
│   ├── project-structure.md    # 项目结构规范
│   └── naming-convention.md    # 命名规范
│
├── frontend/                    # 前端文档
│   ├── client/                 # 用户端文档
│   │   ├── structure.md        # 项目结构
│   │   └── components.md       # 组件说明
│   └── admin/                  # 管理端文档
│       ├── structure.md        # 项目结构
│       └── components.md       # 组件说明
│
├── backend/                     # 后端文档
│   ├── main-service/           # 主服务文档
│   │   ├── structure.md        # 项目结构
│   │   └── modules.md          # 模块说明
│   └── algorithm/              # 算法服务文档
│       ├── structure.md        # 项目结构
│       └── algorithms.md       # 算法说明
│
├── database/                    # 数据库文档
│   ├── design/                 # 数据库设计
│   │   ├── er-diagram.md      # ER图
│   │   └── tables.md          # 表结构
│   └── sql/                    # SQL文件
│       ├── schema.sql         # 建表语句
│       └── init-data.sql      # 初始数据
│
├── api/                        # 接口文档
│   ├── standards.md           # API规范
│   ├── user.md               # 用户接口
│   ├── resume.md             # 简历接口
│   └── recommendation.md     # 推荐接口
│
├── deployment/                 # 部署文档
│   ├── environments.md        # 环境配置
│   └── procedures.md         # 部署流程
│
├── testing/                   # 测试文档
│   ├── standards.md          # 测试规范
│   └── cases/                # 测试用例
│       ├── functional.md     # 功能测试
│       └── performance.md    # 性能测试
│
└── maintenance/              # 维护文档
    ├── changelog.md         # 更新日志
    └── troubleshooting.md   # 问题处理
```

## 文档编写规范

1. 所有文档使用Markdown格式编写
2. 文件名使用小写字母，单词间用连字符(-)连接
3. 目录结构层次不超过4层
4. 每个文档都应该包含标题和最后更新时间
5. 代码示例需要指定语言类型

## 文档更新流程

1. 功能开发时同步更新相关文档
2. 文档变更需要经过review
3. 保持文档的时效性，定期检查更新
4. 重要更新需要在changelog中记录

## 注意事项

1. 敏感信息（密钥、密码等）不要写入文档
2. 保持文档的简洁性和可读性
3. 适当使用图表说明复杂逻辑
4. 及时归档过期文档 