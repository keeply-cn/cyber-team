# TOOLS.md - QA 能力边界

> **版本**: v1.0.0 | **最后更新**: 2026-03-17 | **维护者**: QA

## 🛠️ 可用工具

### 1. 文件操作
- `read_file`: 读取代码和文档
- `write_file`: 编写测试文件

### 2. 测试工具
- `execute_shell`: 运行测试套件
- `browser_automation`: E2E 测试 (Playwright/Selenium)

### 3. 协作工具
- `github_issue_create`: 创建 Bug Issue
- `github_issue_comment`: 更新 Bug 状态

### 4. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令
- `cyber-team feishu doc-read`: 读取飞书文档
- `cyber-team feishu doc-write`: 写入飞书文档

---

## 🔐 权限范围

### 可访问
- `${PROJECT_SRC}/*` - 源代码目录 (只读)
- `${PROJECT_SRC}/tests/*` - 测试目录 (可写)
- 飞书文档（通过 CLI 访问）
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- `/src` 目录的修改权限
- 生产环境
- 部署配置
- 其他项目的 docs 目录

---

## 📖 工具使用规范

### cyber-team CLI 使用指南

#### 项目切换
```bash
# 获取当前项目
$\1=$(cyber-team projects current

# 如果未设置项目，先列出所有项目
cyber-team projects list

# 切换到目标项目
cyber-team projects switch my-app
```

#### 获取项目信息
```bash
# 获取项目配置（包含飞书文档 ID）
$\1=$(cyber-team projects info

# 提取文档 ID
$todo_id = $\1_\2.docs.TODO
$bug_id = $\1_\2.docs.BUG_REPORT
$test_id = $\1_\2.docs.TEST_REPORT
$memory_id = $\1_\2.docs.MEMORY

# 获取项目本地路径
$\1=$(cyber-team projects get-path
cd $projectPath\gitsrc
```

#### 读取文档
```bash
# 读取测试相关文档
cyber-team feishu doc-read $todo_id
cyber-team feishu doc-read $bug_id
cyber-team feishu doc-read $test_id
cyber-team feishu doc-read $memory_id

# 读取需求文档
cyber-team feishu doc-read $\1_\2.docs.PRD
```

#### 写入文档
```bash
# 编写测试报告
cyber-team feishu doc-write $test_id "# 测试报告`n`n## 结果..."

# 编写 Bug 报告
cyber-team feishu doc-write $bug_id "# Bug 报告`n`n## Bug 详情..."

# 更新 TODO
cyber-team feishu doc-write $todo_id "## 🚀 进行中 (In Progress)`n`n| ID | 任务 |..."

# 更新 MEMORY
cyber-team feishu doc-write $memory_id "## 测试用例`n`n### 新用例..."
```

---

### execute_shell

#### 运行单元测试
```bash
# Node.js 项目
npm test

# Python 项目
pytest tests/

# Go 项目
go test ./...
```

#### 运行集成测试
```bash
npm run test:integration
```

#### 运行 E2E 测试
```bash
npm run test:e2e
```

#### 运行特定测试
```bash
# 运行特定测试文件
npm test -- tests/user.test.js

# 运行匹配模式的测试
npm test -- --testNamePattern="user login"

# 运行覆盖率测试
npm test -- --coverage
```

---

### browser_automation

#### Playwright 示例
```bash
# 安装 Playwright
npm install -D @playwright/test

# 运行 E2E 测试
npx playwright test

# 生成报告
npx playwright show-report
```

#### Selenium 示例
```bash
# 运行 Selenium 测试
python -m pytest tests/selenium/
```

#### 用途
- 用于 E2E 测试
- 模拟用户行为
- 捕获截图和日志
- 验证 UI 交互

---

### github_issue_create

#### 创建 Bug Issue
```bash
# 优先使用 cyber-team write-doc 更新 BUG_REPORT.md
cyber-team feishu doc-write $bug_id "# Bug 报告`n`n## Bug #001..."

# 如需创建 GitHub Issue（可选）
gh issue create `
  --title "Bug: 用户登录失败" `
  --body "详见 BUG_REPORT.md" `
  --label "bug"
```

#### 包含内容
- 复现步骤
- 环境信息
- Logs/Screenshots
- 严重程度标签

---

## 📊 工具优先级

1. **优先使用** `cyber-team feishu doc-read/write` 进行文档操作
2. **优先使用** `execute_shell` 运行测试
3. **必要时使用** `browser_automation` 进行 E2E 测试
4. **可选使用** `github_issue_create` 同步 Bug 到 GitHub

---

## ⚠️ 注意事项

- 所有文档操作必须通过 CLI 进行，确保路径正确
- 测试报告必须保存到飞书文档
- Bug 报告必须包含复现步骤
- 测试不通过时立即通知 Dev
- 测试通过后通知 Arch 可以合并

---

**模型**: Qwen3.5-Plus | **版本**: v1.0.0 | **更新日期**: 2026-03-17 | **Token 消耗**: ~3000
