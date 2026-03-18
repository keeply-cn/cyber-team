# TOOLS.md - PM 能力边界

> **版本**: v1.0.0 | **最后更新**: 2026-03-15 | **维护者**: PM

## 可用工具

### 1. 文件操作
- `read_file`: 读取项目文档
- `write_file`: 编写文档 (仅限 docs 目录)

### 2. 研究工具
- `web_search`: 竞品分析、市场调研
- `read_api_docs`: 查阅第三方 API 文档

### 3. 协作工具
- `github_issue_create`: 创建 Issue 跟踪需求
- `slack_notify`: 通知团队新 PRD

### 4. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令
- `cyber-team read-doc`: 读取文档（自动路径）
- `cyber-team write-doc`: 写入文档（自动路径）

## 权限范围

### 可访问
- `${PROJECT_DOCS}/*` - 项目文档目录
- `${PROJECT_DOCS}/MEMORY.md` - 项目知识库
- `${PROJECT_DOCS}/TODO.md` - 任务看板
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
# 切换到指定项目（MCP 工具调用）
{
  "name": "switch_project",
  "arguments": {"project_name": "my-app"}
}

# 或使用 CLI 命令
cyber-team projects switch my-app
```

#### 读取文档（推荐方式）
```bash
# 使用 cyber-team 自动处理路径
cyber-team read-doc PRD.md
cyber-team read-doc CONTEXT.md
cyber-team read-doc MEMORY.md

# MCP 工具调用（Agent 优先使用）
{
  "name": "read_doc",
  "arguments": {"doc_name": "PRD.md"}
}
```

#### 写入文档（推荐方式）
```bash
# 使用 cyber-team 自动处理路径
cyber-team write-doc PRD.md "# 产品需求\n\n内容..."

# MCP 工具调用（Agent 优先使用）
{
  "name": "write_doc",
  "arguments": {
    "doc_name": "PRD.md",
    "content": "# 产品需求\n\n内容..."
  }
}
```

#### 查看当前项目
```bash
# 使用 cyber-team 获取当前项目信息
cyber-team projects current

# MCP 工具调用
{
  "name": "get_current_project",
  "arguments": {}
}
```

#### 列出所有项目
```bash
# 查看所有项目列表
cyber-team projects list

# MCP 工具调用
{
  "name": "list_projects",
  "arguments": {}
}
```

### web_search
- 用于竞品分析
- 用于市场调研
- 用于行业趋势研究

### read_file / write_file
- 仅限 docs 目录
- 主要用于 PRD.md 的编写和更新
- 可读取 CONTEXT.md 了解项目背景
- **优先使用 `cyber-team read-doc` 和 `cyber-team write-doc`**

### github_issue_create
- 将大需求拆分为 Issue
- 为每个 User Story 创建对应的 Issue
- 设置合适的标签和优先级

## 工具限制
- 不能执行 shell 命令（cyber-team CLI 除外）
- 不能修改代码文件
- 不能直接部署或测试
- 不能访问其他项目的 docs 目录

## PM 常用工作流

### 1. 启动新项目
```bash
# 1. 创建项目
cyber-team projects create my-app

# 2. 读取项目背景
cyber-team read-doc CONTEXT.md

# 3. 编写 PRD
cyber-team write-doc PRD.md "# 产品需求\n\n..."
```

### 2. 切换项目
```bash
# 1. 切换到目标项目
cyber-team projects switch another-app

# 2. 读取项目记忆
cyber-team read-doc MEMORY.md

# 3. 更新 TODO
cyber-team write-doc TODO.md "# 任务看板\n\n..."
```

### 3. 日常文档管理
```bash
# 读取多个文档
cyber-team read-doc PRD.md
cyber-team read-doc CONTEXT.md
cyber-team read-doc MEMORY.md

# 更新文档
cyber-team write-doc MEMORY.md "# 项目笔记\n\n- 新发现..."
```

## MCP 工具优先级

作为 Agent，**优先使用 MCP 工具**而非直接调用 CLI：

1. **首选**: MCP 工具（`read_doc`, `write_doc`, `switch_project`）
   - 自动路径处理
   - 错误处理完善
   - 与 Agent 框架集成

2. **备选**: CLI 命令（`cyber-team read-doc`, `cyber-team write-doc`）
   - 用于复杂场景
   - 用于调试和验证

---

**参考文档**: [CLI_USAGE.md](../docs/CLI_USAGE.md)
