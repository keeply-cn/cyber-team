# TOOLS.md - QA 能力边界

> **版本**: v2.0.0 | **最后更新**: 2026-03-19 | **维护者**: QA

## 可用工具

### 1. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令（切换、获取路径）
- `cyber-team docs`: 文档操作命令（读取、写入、追加）
- `cyber-team issues`: GitHub Issue 操作

### 2. 测试工具
- `execute_shell`: 运行测试套件
- `browser_automation`: E2E 测试 (Playwright/Selenium)

### 3. 协作工具
- `github_issue_create`: 创建 Bug Issue
- `github_issue_comment`: 更新 Bug 状态

## 权限范围

### 可访问
- 项目源码目录 - 源代码目录 (只读)
- 项目源码目录/tests - 测试目录 (可写)
- 项目 docs 目录 - 项目文档目录
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- `/src` 目录的修改权限
- 生产环境
- 部署配置
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
# 读取测试相关文档
cyber-team docs read TODO
cyber-team docs read BUG_REPORT
cyber-team docs read TEST_REPORT
cyber-team docs read MEMORY

# 读取需求文档
cyber-team docs read PRD
```

#### 写入文档
```bash
# 编写测试报告
cyber-team docs write TEST_REPORT -c "# 测试报告\n\n## 结果..."

# 编写 Bug 报告
cyber-team docs write BUG_REPORT -c "# Bug 报告\n\n## Bug 详情..."

# 更新 TODO
cyber-team docs write TODO -c "## 🚀 进行中\n\n| ID | 任务 |..."

# 追加 MEMORY
cyber-team docs append MEMORY -c "## 测试用例\n\n### 新用例..."
```

### execute_shell

#### 运行测试
```bash
# Node.js 项目
npm test

# Python 项目
pytest tests/

# Go 项目
go test ./...

# 运行覆盖率测试
npm test -- --coverage

# 运行特定测试
npm test -- tests/user.test.js
```

### browser_automation

#### Playwright 示例
```bash
# 运行 E2E 测试
npx playwright test

# 生成报告
npx playwright show-report
```

#### 用途
- 用于 E2E 测试
- 模拟用户行为
- 捕获截图和日志
- 验证 UI 交互

### GitHub Issue 操作

```bash
# 创建 Issue
cyber-team issues create -t "标题" -b "内容" -l bug

# 关闭 Issue
cyber-team issues close -n 3

# 查看 Issue 列表
cyber-team issues list

# 添加评论
cyber-team issues comment -n 3 -c "评论内容"
```

## 工具限制
- 测试报告必须保存到本地文档
- Bug 报告必须包含复现步骤
- 测试不通过时立即通知 Dev
- 测试通过后通知 Arch 可以合并

---

**参考文档**: [AGENTS.md](AGENTS.md) - QA 操作手册
