# TOOLS.md - Arch 能力边界

> **版本**: v1.0.0 | **最后更新**: 2026-03-15 | **维护者**: Arch

## 可用工具

### 1. 文件操作
- `read_file`: 读取项目文档和代码
- `write_file`: 编写设计文档和接口定义

### 2. 验证工具
- `execute_shell`: 验证 POC (Proof of Concept)
- `read_api_docs`: 查阅第三方 API 文档

### 3. 协作工具
- `github_review`: Code Review
- `slack_notify`: 通知团队设计变更

### 4. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令
- `cyber-team read-doc`: 读取文档（自动路径）
- `cyber-team write-doc`: 写入文档（自动路径）

## 权限范围

### 可访问
- `${PROJECT_DOCS}/*` - 项目文档目录
- `${PROJECT_SRC}/**/*` - 源代码目录 (只读)
- `${PROJECT_DOCS}/MEMORY.md` - 项目知识库
- `${PROJECT_DOCS}/TECH_STACK.md` - 技术栈规范
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
# MCP 工具调用（优先使用）
{
  "name": "switch_project",
  "arguments": {"project_name": "my-app"}
}

# CLI 命令
cyber-team projects switch my-app
```

#### 读取文档
```bash
# 读取架构文档
cyber-team read-doc ARCHITECTURE.md
cyber-team read-doc DECISIONS.md
cyber-team read-doc TECH_STACK.md

# MCP 工具调用
{
  "name": "read_doc",
  "arguments": {"doc_name": "ARCHITECTURE.md"}
}
```

#### 写入文档
```bash
# 编写设计文档
cyber-team write-doc ARCHITECTURE.md "# 系统架构\n\n## 设计..."
cyber-team write-doc CODE_REVIEW.md "# Code Review\n\n## 问题..."

# MCP 工具调用
{
  "name": "write_doc",
  "arguments": {
    "doc_name": "ARCHITECTURE.md",
    "content": "# 系统架构\n\n## 设计..."
  }
}
```

### execute_shell
- 仅用于验证 POC
- 不能用于生产环境
- 需要用户批准

### read_file / write_file
- 主要用于设计文档编写
- 可读取代码进行 Review
- 不直接修改业务代码
- **优先使用 `cyber-team read-doc` 和 `cyber-team write-doc`**

### github_review
- 检查命名规范
- 检查逻辑冗余
- 检查安全漏洞
- 产出 `${PROJECT_DOCS}/CODE_REVIEW.md`

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
cyber-team read-doc PRD.md
cyber-team read-doc TECH_STACK.md

# 3. 编写架构
cyber-team write-doc ARCHITECTURE.md "# 系统架构\n\n..."
```

### 2. Code Review
```bash
# 1. 读取代码变更
cyber-team read-doc CODE_REVIEW.md

# 2. 编写 Review 意见
cyber-team write-doc CODE_REVIEW.md "# Code Review\n\n## 问题..."
```

## MCP 工具优先级

1. **首选**: MCP 工具（`read_doc`, `write_doc`, `switch_project`）
2. **备选**: CLI 命令（用于调试和验证）

---

**参考文档**: [CLI_USAGE.md](../docs/CLI_USAGE.md)
