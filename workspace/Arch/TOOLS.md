# TOOLS.md - Arch 能力边界

> **版本**: v2.0.0 | **最后更新**: 2026-03-19 | **维护者**: Arch

## 可用工具

### 1. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令（切换、获取路径）
- `cyber-team docs`: 文档操作命令（读取、写入、追加）

### 2. 验证工具
- `execute_shell`: 验证 POC (Proof of Concept)
- `read_api_docs`: 查阅第三方 API 文档

### 3. 协作工具
- `github_review`: Code Review

## 权限范围

### 可访问
- 项目 docs 目录 - 项目文档目录
- 项目 docs/MEMORY.md - 项目知识库
- 项目 docs/TECH_STACK.md - 技术栈规范
- 项目源码目录 - 源代码目录 (只读)
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- 生产环境配置
- 数据库直接操作
- 敏感密钥文件
- 其他项目的 docs 目录

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
cyber-team docs read DECISIONS
cyber-team docs read TECH_STACK
cyber-team docs read CODE_REVIEW
cyber-team docs read TODO
```

#### 写入文档
```bash
# 使用 cyber-team 写入文档
cyber-team docs write ARCHITECTURE -c "# 系统架构\n\n## 设计..."
cyber-team docs write CODE_REVIEW -c "# Code Review\n\n## 问题..."
```

#### 追加文档
```bash
# 追加内容到现有文档
cyber-team docs append ARCHITECTURE -c "- 新技术发现...\n"
```

## 工具限制
- 不能直接部署
- 不能修改生产配置
- 不能跳过 Code Review 流程
- 不能访问其他项目的 docs 目录

## Arch 常用工作流

### 1. 开始设计
```bash
# 1. 切换到项目
cyber-team projects switch my-app

# 2. 读取需求
cyber-team docs read PRD
cyber-team docs read TECH_STACK

# 3. 编写架构
cyber-team docs write ARCHITECTURE -c "# 系统架构\n\n..."
```

### 2. Code Review
```bash
# 1. 获取项目本地路径
cyber-team projects get-path

# 2. 读取代码变更
cyber-team docs read CODE_REVIEW

# 3. 编写 Review 意见
cyber-team docs write CODE_REVIEW -c "# Code Review\n\n## 问题..."
```

---

**参考文档**: [AGENTS.md](AGENTS.md) - Arch 操作手册
