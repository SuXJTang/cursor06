# 高校职业推荐系统（用户端）

基于 Vue3 + TypeScript + Vant 的移动端应用

## 技术栈

- Vue3 ^3.4.0
- TypeScript ^5.2.0
- Vite ^5.0.0
- Vant ^4.8.0
- Pinia ^2.1.0
- Vue Router ^4.2.0
- Axios ^1.6.0

## 开发环境要求

- Node.js >= 18
- pnpm >= 8

## 项目设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 单元测试
pnpm test:unit

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
├── api/                    # API接口
├── assets/                # 静态资源
├── components/           # 组件
│   ├── common/          # 通用组件
│   └── business/        # 业务组件
├── composables/         # 组合式函数
├── router/             # 路由配置
├── stores/            # 状态管理
├── styles/           # 样式文件
├── types/            # 类型定义
├── utils/           # 工具函数
└── views/          # 页面组件
```

## 开发规范

- 使用 TypeScript 进行开发
- 使用 Composition API
- 遵循 Vue3 风格指南
- 使用 ESLint + Prettier 进行代码规范
- 使用 Commitlint 进行提交规范

## 提交规范

- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构（既不是新增功能，也不是修改bug的代码变动）
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 项目特性

- 📱 移动端优先
- 🚀 基于 Vite 构建
- 💪 TypeScript 支持
- 📦 组件自动导入
- 🎨 主题定制
- 🌍 国际化支持
- 📝 代码规范
- ✅ 单元测试
- 📊 性能优化

## 文档

- [开发文档](./docs/development.md)
- [组件文档](./docs/components.md)
- [API文档](./docs/api.md)
- [部署文档](./docs/deployment.md)

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

[MIT](LICENSE) 