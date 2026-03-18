# TOOLS.md - Dev 能力边界

> **版本**: v1.0.0 | **最后更新**: 2026-03-15 | **维护者**: Dev

## 可用工具

### 1. 文件操作
- `read_file`: 读取代码和文档
- `edit_file`: 修改代码 (str_replace/sed)

### 2. 开发工具
- `execute_shell`: 运行命令、测试、构建
- `git_commit`: 提交代码
- `run_test`: 运行测试套件

### 3. 查询工具
- `mcp_docs`: 查询 API 文档
- `web_search`: 搜索技术方案

### 4. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令
- `cyber-team read-doc`: 读取文档（自动路径）
- `cyber-team write-doc`: 写入文档（自动路径）

## 权限范围

### 可访问
- `${PROJECT_SRC}/*` - 源代码目录
- `${PROJECT_SRC}/tests/*` - 测试目录
- `${PROJECT_DOCS}/*` - 项目文档目录
- `${PROJECT_DOCS}/MEMORY.md` - 项目知识库
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
# 读取开发相关文档
cyber-team read-doc ARCHITECTURE.md
cyber-team read-doc API_SPEC.json
cyber-team read-doc TODO.md

# MCP 工具调用
{
  "name": "read_doc",
  "arguments": {"doc_name": "ARCHITECTURE.md"}
}
```

#### 写入文档
```bash
# 更新开发笔记
cyber-team write-doc MEMORY.md "# 开发笔记\n\n- 实现细节..."

# MCP 工具调用
{
  "name": "write_doc",
  "arguments": {
    "doc_name": "MEMORY.md",
    "content": "# 开发笔记\n\n- 实现细节..."
  }
}
```

### execute_shell
- 运行测试：`npm test`
- 运行 Lint：`npm run lint`
- 构建项目：`npm run build`
- Git 操作：`git checkout -b feat/xxx`, `git commit`

### git_commit
- 必须使用 Conventional Commits 格式
- 提交前确保测试通过
- 提交信息简洁明确

### edit_file
- 优先使用 str_replace
- 保持代码风格一致
- 添加必要的注释
- **优先在 `${PROJECT_SRC}` 中工作**

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
cyber-team read-doc ARCHITECTURE.md
cyber-team read-doc API_SPEC.json

# 3. 创建分支
cd ${PROJECT_SRC}
git checkout -b feat/xxx
```

### 2. 日常开发
```bash
# 1. 查看任务
cyber-team read-doc TODO.md

# 2. 编写代码
# 在 ${PROJECT_SRC}/src 中工作

# 3. 运行测试
npm test

# 4. 提交代码
git commit -m "feat: xxx"
```

### 3. Bug 修复
```bash
# 1. 读取 Bug 报告
cyber-team read-doc BUG_REPORT.md

# 2. 修复 Bug
# 修改代码

# 3. 记录修复过程
cyber-team write-doc MEMORY.md "# Bug 修复\n\n- 问题：...\n- 原因：...\n- 解决：..."
```

## MCP 工具优先级

1. **首选**: MCP 工具（`read_doc`, `write_doc`, `switch_project`）
2. **备选**: CLI 命令（用于调试和验证）

---

**参考文档**: [CLI_USAGE.md](../docs/CLI_USAGE.md)
