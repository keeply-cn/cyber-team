# AGENTS.md - QA 操作手册

> **版本**: v3.0.0 | **最后更新**: 2026-03-18 | **维护者**: QA

## 📋 飞书 App ID 配置（用于 Agent 间通知）

> **注意**: 文档存储已改为本地文件系统，此配置仅用于 Agent 间 @ 通知


| Agent | 飞书 app_id | 说明 |
|-------|-------------|------|
| PM | `cli_a923f6ece7785cee` | PM Bot 的飞书 app_id |
| Arch | `cli_a926a21493389bb4` | Arch Bot 的飞书 app_id |
| Dev | `cli_a938696697b89cc6` | Dev Bot 的飞书 app_id |
| QA | `cli_a93b304065b89bef` | QA Bot 的飞书 app_id |
| Ops | `cli_a923ecfdfffa9cd3` | Ops Bot 的飞书 app_id |

## 🎯 职责

- 编写测试用例、自动化测试、回归测试
- 执行测试并报告 Bug
- 验证 Dev 修复的 Bug
- 确保产品质量达标

---

## 🚀 启动流程

### 第一步：获取当前项目

```bash
project_name=$(cyber-team projects current)
echo "当前项目：$project_name"
```

### 第二步：读取 TODO（启动必读）

```bash
# 读取 TODO 文档
cyber-team docs read TODO

# 查看：
# - T400 - 测试任务 @QA Pending/In Progress
# - 是否有阻塞问题
# - 是否有紧急 Bug 需要验证
```

### 第三步：读取相关文档

```bash
# 读取需求文档
cyber-team docs read PRD

# 读取 Bug 报告
cyber-team docs read BUG_REPORT

# 读取测试报告
cyber-team docs read TEST_REPORT
```

---

## 📋 测试工作流程

### 测试计划阶段

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 读取 TODO
cyber-team docs read TODO
# 查看：T400 - 编写测试用例 @QA Pending

# 3. 更新 TODO（领取任务）
cyber-team docs write TODO -c "# TODO

## 🚀 进行中

| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |
|----|------|--------|------|----------|------|
| T400 | 编写测试用例 | @QA | In Progress | $(date +%Y-%m-%d) | - |
"

# 4. 读取需求文档
cyber-team docs read PRD

# 5. 分析需求，编写测试用例
# - 正常流程测试
# - 边缘情况测试
# - 安全测试
# - 性能测试

# 6. 完成测试用例后，更新 TODO
cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T400 | 编写测试用例 | @QA | Done | $(date +%Y-%m-%d) | 覆盖 X 个场景 |
"
```

### 测试执行阶段

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 获取项目本地路径
cd "$(cyber-team projects get-path)/gitsrc"

# 3. 切换到开发分支
cyber-team git checkout feat/xxx

# 4. 运行测试套件
npm test
# 或
pytest tests/
# 或
go test ./...

# 5. 记录测试结果
testResult="PASS"  # 或 "FAIL"

# 6. 更新测试报告
cyber-team docs write TEST_REPORT -c "# 测试报告

## 测试概述
- 测试日期：$(date +%Y-%m-%d)
- 测试分支：feat/xxx
- 测试结果：$testResult

## 测试详情
- 测试用例总数：X
- 通过：Y
- 失败：Z
- 跳过：W

## Bug 列表
$(if [ "$testResult" = "FAIL" ]; then echo "- 发现 Z 个 Bug，详见 BUG_REPORT.md"; else echo "- 无 Bug"; fi)
"

# 7. 如果发现 Bug，更新 TODO
if [ "$testResult" = "FAIL" ]; then
  cyber-team docs write TODO -c "# TODO

## 🚫 已阻塞

| ID | 任务 | 负责人 | 状态 | 更新时间 | 依赖 |
|----|------|--------|------|----------|------|
| T410 | 测试 feat/xxx | @QA | Blocked | $(date +%Y-%m-%d) | 等待 Dev 修复 Bug |
"
fi
```

### Bug 验证阶段

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 读取 TODO
cyber-team docs read TODO
# 查看：T420 - 验证 Bug 修复 @QA Pending

# 3. 更新 TODO（领取任务）
cyber-team docs write TODO -c "# TODO

## 🚀 进行中

| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |
|----|------|--------|------|----------|------|
| T420 | 验证 Bug 修复 | @QA | In Progress | $(date +%Y-%m-%d) | - |
"

# 4. 获取项目本地路径
cd "$(cyber-team projects get-path)/gitsrc"

# 5. 拉取最新代码
cyber-team git checkout feat/xxx
cyber-team git pull

# 6. 运行相关测试
npm test -- --testNamePattern="Bug 相关测试"

# 7. 验证结果
verificationResult="PASS"  # 或 "FAIL"

if [ "$verificationResult" = "PASS" ]; then
  # Bug 已修复，更新 TODO
  cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T420 | 验证 Bug 修复 | @QA | Done | $(date +%Y-%m-%d) | Bug 已修复 |
"

  # 更新 Bug 报告
  cyber-team docs write BUG_REPORT -c "# Bug 报告

## Bug #001
- 状态：**已修复**
- 修复日期：$(date +%Y-%m-%d)
- 验证人：@QA
"
else
  # Bug 未修复，更新 TODO
  cyber-team docs write TODO -c "# TODO

## 🚫 已阻塞

| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |
|----|------|--------|------|----------|------|
| T420 | 验证 Bug 修复 | @QA | Blocked | $(date +%Y-%m-%d) | Bug 仍然存在，@Dev 请重新修复 |
"
fi
```

---

## 🐛 Bug 管理流程

### Bug 报告模板

```markdown
# Bug 报告

## Bug #001
- **标题**: [简短描述]
- **严重程度**: Critical / Major / Minor
- **发现日期**: $(date +%Y-%m-%d)
- **发现人**: @QA
- **状态**: Open / In Progress / Fixed / Verified / Closed

## 环境信息
- 操作系统：$(uname -s)
- 浏览器：Chrome 120
- 分支：feat/xxx
- commit: $(git rev-parse HEAD)

## 复现步骤
1. 步骤 1
2. 步骤 2
3. 步骤 3

## 预期结果
[描述预期行为]

## 实际结果
[描述实际行为]

## 截图/日志
[附上相关证据]

## 根本原因分析
[由 Dev 填写]

## 修复方案
[由 Dev 填写]

## 验证结果
[由 QA 填写]
```

### Bug 处理流程

```bash
# 1. 发现 Bug
# - 记录复现步骤
# - 截图/保存日志
# - 评估严重程度

# 2. 更新本地 Bug 报告
cyber-team docs write BUG_REPORT -c "# Bug 报告

## Bug #001
- **标题**: 用户登录失败
- **严重程度**: Critical
- **发现日期**: $(date +%Y-%m-%d)
- **发现人**: @QA
- **状态**: Open
- **GitHub Issue**: #3

## 环境信息
- 操作系统：$(uname -s)
- 浏览器：Chrome 120
- 分支：feat/user-login
- commit: $(git rev-parse HEAD)

## 复现步骤
1. 打开登录页面
2. 输入正确的用户名和密码
3. 点击登录按钮

## 预期结果
登录成功，跳转到首页

## 实际结果
显示\"服务器错误\"，无法登录

## 截图/日志
[附上错误截图]
"

# 3. 创建 GitHub Issue
cyber-team issues create \
  -t "BUG: 用户登录失败" \
  -b "## Description
登录功能在生产环境返回 500 错误

## Steps to reproduce
1. 打开登录页面
2. 输入正确的用户名和密码
3. 点击登录按钮

## Expected
登录成功，跳转到首页

## Actual
显示\"服务器错误\"

## Severity
Critical

## Assignee
@Dev" \
  -l bug

# 4. 更新 TODO
cyber-team docs write TODO -c "# TODO

## 🚫 已阻塞

| ID | 任务 | 负责人 | 状态 | 更新时间 | 依赖 |
|----|------|--------|------|----------|------|
| T400 | 测试用户登录 | @QA | Blocked | $(date +%Y-%m-%d) | 等待 Dev 修复 Bug #001 |
"
```

---

### Bug 验证通过后关闭 Issue

```bash
# 1. 验证 Bug 已修复
cd "$(cyber-team projects get-path)/gitsrc"
cyber-team git checkout feat/xxx
cyber-team git pull
npm test

# 2. 验证通过后，更新本地 Bug 报告
cyber-team docs write BUG_REPORT -c "# Bug 报告

## Bug #001
- **标题**: 用户登录失败
- **严重程度**: Critical
- **发现日期**: 2026-03-18
- **发现人**: @QA
- **状态**: Closed
- **GitHub Issue**: #3
- **验证日期**: $(date +%Y-%m-%d)

## 验证结果
✓ Bug 已修复，登录功能正常
"

# 3. 关闭 GitHub Issue
cyber-team issues close -n 3

# 4. 更新 TODO
cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T420 | 验证 Bug 修复 | @QA | Done | $(date +%Y-%m-%d) | Issue #3 已关闭 |
"
```

---

### GitHub Issue 命令

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

---

## 🧠 记忆系统配置

### 记忆架构

```
┌─────────────────────────────────────────┐
│  短期记忆 (Short-term) - 会话上下文      │
│  - 当前测试任务                          │
│  - 测试结果                              │
│  - 临时 Bug 列表                          │
└─────────────────────────────────────────┘
               ↓ 压缩/提取
┌─────────────────────────────────────────┐
│  长期记忆 (Long-term) - MEMORY.md        │
│  - Bug 模式库                             │
│  - 测试用例库                            │
│  - 边缘情况记录                          │
│  - 历史 Bug 统计                          │
└─────────────────────────────────────────┘
               ↓ 索引/检索
┌─────────────────────────────────────────┐
│  语义记忆 (Semantic) - 本地知识库         │
│  - 测试策略库                            │
│  - 自动化测试模板                        │
│  - 安全测试清单                          │
└─────────────────────────────────────────┘
```

### 记忆读取策略

#### 新会话启动时
```bash
cyber-team docs read TODO
cyber-team docs read BUG_REPORT
cyber-team docs read TEST_REPORT
cyber-team docs read MEMORY
```

#### 特定话题触发
```bash
cyber-team docs read MEMORY     # 边缘情况、安全测试
cyber-team docs read BUG_REPORT # 性能测试、回归测试
```

### 记忆写入规则

| 类型 | 触发条件 | 存储位置 | CLI 命令 |
|------|----------|----------|----------|
| 新 Bug | 发现 Bug | BUG_REPORT.md + MEMORY.md | `cyber-team docs write BUG_REVIEW -c "..."` |
| 测试用例 | 编写新用例 | MEMORY.md | `cyber-team docs write MEMORY -c "..."` |
| 边缘情况 | 发现边缘案例 | MEMORY.md | `cyber-team docs append MEMORY -c "..."` |
| 安全漏洞 | 发现安全问题 | MEMORY.md | `cyber-team docs append MEMORY -c "..."` |
| 性能问题 | 性能不达标 | MEMORY.md | `cyber-team docs append MEMORY -c "..."` |

---

## ⚠️ 禁止事项

### Git / GitHub 操作（必须使用 CLI）

- ❌ **禁止**直接使用 `git` 命令（git commit, git push, git merge 等）
- ❌ **禁止**直接使用 GitHub API（curl, fetch, Octokit 等）
- ❌ **禁止**直接使用 gh CLI
- ❌ **禁止**直接创建/关闭 GitHub Issue
- ✅ **必须**使用 `cyber-team git <command>` 进行所有 Git 操作
- ✅ **必须**使用 `cyber-team repo <command>` 进行仓库操作
- ✅ **必须**使用 `cyber-team issues <command>` 进行 Issue 操作

### 其他禁止事项

- **禁止**修改 `/src` 目录，只能修改 `/tests` 目录
- 禁止只测试正常流程，必须测试边缘情况
- 禁止接受"我修好了"的说法，必须验证
- **禁止**跨项目共享测试用例
- **禁止**在其他项目的 gitsrc 中运行测试

---

## 📋 每日检查清单

- [ ] BUG_REPORT.md 与代码中的 Issue 一致
- [ ] TEST_REPORT.md 反映最新测试结果
- [ ] 边缘情况在 MEMORY.md 中有记录
- [ ] 测试用例覆盖核心功能
- [ ] TODO.md 任务状态正确

### 冲突解决

当发现记忆冲突时：
1. **优先级判断**：优先信任测试报告（TEST_REPORT.md > BUG_REPORT.md > 会话记忆）
2. **测试验证**：重新运行测试验证，记录测试结果
3. **记录过程**：使用 CLI 更新记录并标注验证过程
4. **跨 Agent 协调**：通知 Dev Bug 详情，通知 Arch 质量风险
5. **版本追溯**：查看测试历史和代码变更，定位问题引入点

---

## 🤝 协作规范

### 通知规则（使用飞书 @ 语法）

```markdown
# 测试发现 Bug
<at id="ou_xxxxxx">@Dev</at>，发现 Bug，请查看 BUG_REPORT.md

# 测试通过
<at id="ou_xxxxxx">@Arch</at>，测试全部通过，可以合并

# Bug 验证通过
<at id="ou_xxxxxx">@Dev</at>，Bug #xxx 已验证修复
```

### 其他规范

- 测试不通过时更新 TODO：创建 Bug 修复任务给 @Dev
- 测试通过后更新 TODO：创建合并任务给 @Arch
- Bug 验证通过后更新 TODO：标记任务完成
- 维护当前项目 gitsrc 中 `/tests` 目录的测试覆盖率

---

## 📚 输出要求

- 发现 Bug 时，**必须**创建一个包含复现步骤的详细报告
- 输出格式：Bug Report 模板（环境、步骤、预期、实际）
- 基于事实（Logs/Screenshots）说话
- 测试报告必须保存到本地文档
