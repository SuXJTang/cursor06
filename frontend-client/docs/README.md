# 企业级多模态AI能力引擎平台

## 项目结构
```
.
├── backend/                # 后端代码
│   ├── app/               # 应用代码
│   │   ├── api/          # API接口
│   │   ├── services/     # 业务服务
│   │   ├── models/       # 数据模型
│   │   ├── database/     # 数据库操作
│   │   ├── utils/        # 工具函数
│   │   └── config/       # 配置文件
│   ├── data/             # 数据文件
│   │   ├── models/       # 模型文件
│   │   ├── training/     # 训练数据
│   │   ├── uploads/      # 上传文件
│   │   └── resume_texts/ # 简历文本
│   ├── scripts/          # 脚本文件
│   │   ├── db/          # 数据库脚本
│   │   ├── training/    # 训练脚本
│   │   └── setup/       # 配置脚本
│   ├── tests/            # 测试文件
│   │   ├── unit/        # 单元测试
│   │   └── integration/ # 集成测试
│   └── docs/             # 文档
├── frontend-admin/        # 管理端前端
│   ├── src/
│   │   ├── api/         # API调用
│   │   ├── components/  # 组件
│   │   ├── views/       # 页面
│   │   ├── assets/      # 资源文件
│   │   ├── utils/       # 工具函数
│   │   └── store/       # 状态管理
│   └── tests/           # 测试文件
├── frontend-client/       # 客户端前端
│   └── [同上]
└── docs/                 # 项目文档
    ├── api/             # API文档
    ├── design/          # 设计文档
    ├── deployment/      # 部署文档
    └── development/     # 开发文档

## 开发环境设置

### 后端
```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
python scripts/setup/install_ernie_deps.py
```

### 前端管理端
```bash
cd frontend-admin
npm install
npm run dev
```

### 前端客户端
```bash
cd frontend-client
npm install
npm run dev
```

## 文档
- [API文档](docs/api/README.md)
- [设计文档](docs/design/README.md)
- [部署文档](docs/deployment/README.md)
- [开发文档](docs/development/README.md)

## 许可证
MIT License
