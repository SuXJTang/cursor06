# 贡献指南

感谢您考虑为高校职业推荐系统做出贡献！

## 开发流程

1. Fork 本仓库
2. 克隆您的 Fork 仓库到本地
   ```bash
   git clone git@github.com:您的用户名/cursor06.git
   cd cursor06
   ```

3. 安装依赖
   ```bash
   pnpm install
   ```

4. 创建新分支
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

5. 进行开发
   - 遵循项目的代码规范
   - 确保代码通过 ESLint 检查
   - 编写必要的测试
   - 保持提交信息规范

6. 提交更改
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```

7. 推送到您的仓库
   ```bash
   git push origin feature/your-feature-name
   ```

8. 创建 Pull Request

## 提交规范

- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 构建过程或辅助工具的变动

示例：
```bash
feat: 添加用户登录功能
fix: 修复列表加载问题
docs: 更新 API 文档
```

## 开发规范

### Vue 组件规范

```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
// 导入语句
import { ref } from 'vue'

// 类型定义
interface Props {
  prop1: string
  prop2?: number
}

// Props 定义
const props = withDefaults(defineProps<Props>(), {
  prop2: 0
})

// Emits 定义
const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

// 响应式数据
const data = ref('')

// 方法定义
const handleClick = () => {
  emit('update', data.value)
}
</script>

<style scoped lang="scss">
.component-name {
  // 样式定义
}
</style>
```

### TypeScript 规范

- 使用类型注解
- 避免使用 any
- 优先使用接口定义对象类型
- 使用枚举定义常量集合

### 样式规范

- 使用 SCSS
- 遵循 BEM 命名规范
- 使用项目定义的变量和混入
- 组件样式使用 scoped

## 测试规范

- 编写单元测试
- 测试覆盖率要求
- 运行已有测试确保没有破坏现有功能

## 文档规范

- 更新相关文档
- 添加必要的注释
- 编写清晰的 README

## 分支管理

- main: 主分支，用于生产环境
- develop: 开发分支
- feature/*: 功能分支
- fix/*: 修复分支
- release/*: 发布分支

## 代码审查

提交 PR 时请确保：

1. 代码符合项目规范
2. 所有测试通过
3. 更新了相关文档
4. 提供了必要的测试用例
5. 描述清晰地说明了更改内容

## 问题反馈

- 使用 Issue 模板
- 提供清晰的复现步骤
- 附上相关的错误信息和截图

## 安全问题

如果发现安全漏洞，请不要直接在 Issue 中公开，而是：

1. 发送邮件到：[安全邮箱]
2. 描述问题和复现步骤
3. 等待回复确认

## 许可证

贡献的代码将采用与项目相同的 [MIT](LICENSE) 许可证。 