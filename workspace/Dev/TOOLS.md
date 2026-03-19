# TOOLS.md - Dev 能力边界

> **版本**: v2.0.0 | **最后更新**: 2026-03-19 | **维护者**: Dev

## 可用工具

### 1. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令（切换、获取路径）
- `cyber-team docs`: 文档操作命令（读取、写入、追加）
- `cyber-team git`: Git 操作命令（提交、推送、分支）

### 2. 开发工具
- `execute_shell`: 运行命令、测试、构建
- `run_test`: 运行测试套件

### 3. 查询工具
- `mcp_docs`: 查询 API 文档
- `web_search`: 搜索技术方案

## 权限范围

### 可访问
- 项目源码目录 - 源代码目录
- 项目源码目录/tests - 测试目录
- 项目 docs 目录 - 项目文档目录
- 项目 docs/MEMORY.md - 项目知识库
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- 生产环境配置
- 敏感密钥文件
- main 分支 (只能工作于 feature 分支)
- 其他项目的 gitsrc 目录

## 工具使用规范

### cyber-team CLI 使用指南

#### 项目切换
```bash
# 切换到指定项目
cyber-team projects switch my-app

# 查看当前项目
cyber-team projects current

# 获取项目本地路径
cyber-team projects get-path
```

#### 读取文档
```bash
# 使用 cyber-team 读取文档
cyber-team docs read ARCHITECTURE
cyber-team docs read API_SPEC
cyber-team docs read TODO
cyber-team docs read BUG_REPORT
```

#### 写入文档
```bash
# 使用 cyber-team 写入文档
cyber-team docs write MEMORY -c "# 开发笔记\n\n- 实现细节..."
```

#### 追加文档
```bash
# 追加内容到现有文档
cyber-team docs append MEMORY -c "- 新发现...\n"
```

### Git 操作
```bash
# 创建并切换分支（两种方式）
cyber-team git branch -c feat/xxx
# 或
cyber-team git branch feat/xxx
cyber-team git checkout feat/xxx

# 提交代码
cyber-team git commit "feat: add user login"

# 推送分支
cyber-team git push -u

# 获取最新代码
cyber-team git fetch
cyber-team git pull

# 变基到 main
cyber-team git rebase main
```

### execute_shell
- 运行测试：`npm test`
- 运行 Lint：`npm run lint`
- 构建项目：`npm run build`

## 工具限制
- 不能直接合并到 main
- 不能跳过测试
- 不能修改生产配置
- 不能在其他项目的 gitsrc 中工作

## Dev 常用工作流

### 1. 开始开发
```bash
# 1. 切换到项目
cyber-team projects switch my-app

# 2. 读取设计文档
cyber-team docs read ARCHITECTURE
cyber-team docs read API_SPEC

# 3. 获取项目本地路径并创建分支
cyber-team git branch feat/xxx
cyber-team git checkout feat/xxx
```

### 2. 日常开发
```bash
# 1. 查看任务
cyber-team docs read TODO

# 2. 获取项目本地路径
cyber-team projects get-path

# 3. 编写代码
# 在项目源码目录中工作

# 4. 运行测试
npm test

# 5. 提交代码
cyber-team git commit "feat: xxx"
```

### 3. Bug 修复
```bash
# 1. 读取 Bug 报告
cyber-team docs read BUG_REPORT

# 2. 修复 Bug
# 修改代码

# 3. 记录修复过程
cyber-team docs write MEMORY -c "# Bug 修复\n\n- 问题：...\n- 原因：...\n- 解决：..."
```

---

**参考文档**: [AGENTS.md](AGENTS.md) - Dev 操作手册
