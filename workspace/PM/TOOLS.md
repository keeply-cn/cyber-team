# TOOLS.md - PM 能力边界

> **版本**: v2.0.0 | **最后更新**: 2026-03-19 | **维护者**: PM

## 可用工具

### 1. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令（创建、切换、列表）
- `cyber-team docs`: 文档操作命令（读取、写入、追加）
- `cyber-team repo`: GitHub 仓库操作（创建、删除）
- `cyber-team git`: Git 操作

### 2. 研究工具
- `web_search`: 竞品分析、市场调研
- `read_api_docs`: 查阅第三方 API 文档

### 3. 协作工具
- `github_issue_create`: 创建 Issue 跟踪需求

## 权限范围

### 可访问
- 项目 docs 目录 - 项目文档目录
- 项目 docs/MEMORY.md - 项目知识库
- 项目 docs/TODO.md - 任务看板
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- `/src/*` - 源代码目录
- `/tests/*` - 测试目录
- 生产环境配置
- 其他项目的 docs 目录

## 工具使用规范

### cyber-team CLI 使用指南

#### 项目切换
```bash
# 切换到指定项目
cyber-team projects switch my-app

# 查看当前项目
cyber-team projects current

# 列出所有项目
cyber-team projects list
```

#### 读取文档
```bash
# 使用 cyber-team 读取文档
cyber-team docs read CONTEXT
cyber-team docs read PRD
cyber-team docs read MEMORY
cyber-team docs read TODO
```

#### 写入文档
```bash
# 使用 cyber-team 写入文档
cyber-team docs write CONTEXT -c "# 项目背景\n\n内容..."
cyber-team docs write PRD -c "# 产品需求\n\n内容..."
```

#### 追加文档
```bash
# 追加内容到现有文档
cyber-team docs append MEMORY -c "- 新发现...\n"
```

#### GitHub 仓库操作
```bash
# 创建 GitHub 仓库（同时自动添加 remote）
cyber-team repo create -n my-app -d "项目描述"

# 删除 GitHub 仓库
cyber-team repo delete -n my-app
```

## 工具限制
- 不能执行 shell 命令（cyber-team CLI 除外）
- 不能修改代码文件
- 不能直接部署或测试
- 不能访问其他项目的 docs 目录

## PM 常用工作流

### 1. 启动新项目
```bash
# 1. 创建项目（本地）
cyber-team projects create my-app

# 2. 切换到项目
cyber-team projects switch my-app

# 3. 初始化 Git 并创建 GitHub 仓库
cyber-team git init
cyber-team repo create -n my-app -d "项目描述"

# 4. 读取项目背景
cyber-team docs read CONTEXT

# 5. 编写 PRD
cyber-team docs write PRD -c "# 产品需求\n\n..."
```

### 2. 切换项目
```bash
# 1. 切换到目标项目
cyber-team projects switch another-app

# 2. 读取项目记忆
cyber-team docs read MEMORY

# 3. 更新 TODO
cyber-team docs write TODO -c "# 任务看板\n\n..."
```

### 3. 日常文档管理
```bash
# 读取多个文档
cyber-team docs read PRD
cyber-team docs read CONTEXT
cyber-team docs read MEMORY

# 更新文档
cyber-team docs write MEMORY -c "# 项目笔记\n\n- 新发现..."
```

---

**参考文档**: [AGENTS.md](AGENTS.md) - PM 操作手册
