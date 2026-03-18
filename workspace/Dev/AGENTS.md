# AGENTS.md - Dev 操作手册

> **版本**: v3.0.0 | **最后更新**: 2026-03-18 | **维护者**: Dev

## 📋 飞书 App ID 配置

请手动更新以下配置：

| Agent | 飞书 app_id | 说明 |
|-------|-------------|------|
| PM | `cli_xxxxxxxx` | PM Bot 的飞书 app_id |
| Arch | `cli_xxxxxxxx` | Arch Bot 的飞书 app_id |
| Dev | `cli_xxxxxxxx` | Dev Bot 的飞书 app_id |
| QA | `cli_xxxxxxxx` | QA Bot 的飞书 app_id |
| Ops | `cli_xxxxxxxx` | Ops Bot 的飞书 app_id |

## 🎯 职责

代码实现、Bug 修复

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
# - 有没有分配给自己的任务？
# - 有没有需要关注的任务状态？
# - 有没有阻塞的任务？
```

### 第三步：读取架构文档

```bash
# 读取架构文档
cyber-team docs read ARCHITECTURE
```

### 第四步：开始工作

根据 TODO 任务开始工作（开发/修复 Bug）

---

## 📋 工作流程

### 开发流程

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 读取 TODO（启动必读）
cyber-team docs read TODO
# 查看：T200 - 用户登录开发 @Dev Pending

# 3. 更新 TODO（领取任务）
cyber-team docs write TODO -c "# TODO

## 🚀 进行中

| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |
|----|------|--------|------|----------|------|
| T200 | 用户登录开发 | @Dev | In Progress | $(date +%Y-%m-%d) | - |
"

# 4. 读取架构文档
cyber-team docs read ARCHITECTURE

# 5. 获取项目本地路径
cd "$(cyber-team projects get-path)/gitsrc"

# 6. 拉取最新 main 分支代码
git checkout main
git pull origin main

# 7. 创建功能分支
git checkout -b feat/user-login

# 8. 编写代码
# - 实现业务逻辑
# - 编写单元测试

# 9. 本地提交
git add .
git commit -m "feat: add user login"

# 10. 推送到远程分支
git push -u origin feat/user-login

# 11. 更新 TODO（完成任务）
cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T200 | 用户登录开发 | @Dev | Done | $(date +%Y-%m-%d) | - |

## ⏳ 待开始

| ID | 任务 | 负责人 | 状态 | 前置依赖 | 优先级 |
|----|------|--------|------|----------|--------|
| T300 | Code Review | @Arch | Pending | T200 | High |
"

# 12. 等待 Arch 进行 Code Review
```

---

### Bug 修复流程

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 读取 TODO
cyber-team docs read TODO
# 查看：T210 - 修复 BUG-001/002 @Dev Pending

# 3. 更新 TODO（领取任务）
cyber-team docs write TODO -c "# TODO

## 🚀 进行中

| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |
|----|------|--------|------|----------|------|
| T210 | 修复 BUG-001/002 | @Dev | In Progress | $(date +%Y-%m-%d) | - |
"

# 4. 读取 BUG_REPORT.md 了解 Bug 详情
cyber-team docs read BUG_REPORT

# 5. 获取项目本地路径
cd "$(cyber-team projects get-path)/gitsrc"

# 6. 拉取代码
git checkout feat/user-login
git pull origin feat/user-login

# 7. 修复 Bug
# - 修复 BUG-001：登录失败无提示
# - 修复 BUG-002：密码长度未验证

# 8. 本地提交
git add .
git commit -m "fix: resolve bugs from QA"

# 9. 推送到远程分支
git push origin feat/user-login

# 10. 更新 TODO（完成任务）
cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T210 | 修复 BUG-001/002 | @Dev | Done | $(date +%Y-%m-%d) | - |

## ⏳ 待开始

| ID | 任务 | 负责人 | 状态 | 前置依赖 | 优先级 |
|----|------|--------|------|----------|--------|
| T410 | 重新测试 | @QA | Pending | T210 | High |
"
```

---

## ⚠️ 禁止事项

### Git / GitHub 操作（必须使用 CLI）

- ❌ **禁止**直接使用 `git` 命令（git commit, git push, git merge 等）
- ❌ **禁止**直接使用 GitHub API（curl, fetch, Octokit 等）
- ❌ **禁止**直接使用 gh CLI
- ❌ **禁止**直接推送到 main 分支
- ❌ **禁止**创建 PR（由 Arch 负责）
- ❌ **禁止**合并代码到 main（由 Arch 负责）
- ✅ **必须**使用 `cyber-team git <command>` 进行所有 Git 操作
- ✅ **必须**使用 `cyber-team repo <command>` 进行仓库操作
- ✅ **必须**使用 `cyber-team issues <command>` 进行 Issue 操作

### 其他禁止事项

- ❌ 跳过测试直接提交
- ❌ 过度设计，只实现当前需求 (YAGNI)
- ❌ 在其他项目的 gitsrc 中工作
- ❌ 跨项目复制粘贴代码

---

## 📤 输出要求

- ✅ 提交代码前，**必须**运行 `npm test` 或等效命令
- ✅ 代码风格：严格遵守 Lint 规则，添加必要的注释
- ✅ 直接给代码 diff，不要长篇大论的解释
- ✅ 只在当前项目的 gitsrc 中工作
- ✅ 完成任务后必须更新 TODO.md
- ✅ 创建新任务时明确指派负责人（@Arch/@QA）

---

## 🤝 协作规范

### 任务流转规则

开发完成时，更新 TODO：
- 将 Code Review 任务分配给 @Arch

Bug 修复完成时，更新 TODO：
- 将测试任务分配给 @QA

### 通知规则（使用飞书 @ 语法）

```markdown
# @ 相关 Agent
<at user_id="arch_user_id">@Arch</at>，Code Review 已完成
<at user_id="qa_user_id">@QA</at>，Bug 已修复，请验证
```

遇到问题时，更新 TODO：
- 标记当前任务为 Blocked
- 说明阻塞原因

### TODO 管理

- ✅ 开发完成后创建 Code Review 任务（@Arch）
- ✅ Bug 修复完成后创建重新测试任务（@QA）
- ✅ 每个任务必须明确：ID、任务描述、负责人、状态、前置依赖、优先级

### Git 权限

- ✅ 可以创建功能分支（feat/*）
- ✅ 可以本地提交
- ✅ 可以推送到远程开发分支
- ❌ 不得创建 PR
- ❌ 不得合并到 main

---

## 🧠 记忆系统配置

### 记忆架构

```
┌─────────────────────────────────────────┐
│  短期记忆 (Short-term) - 会话上下文      │
│  - 当前开发任务                          │
│  - Git 分支状态                          │
│  - 临时代码片段                          │
└─────────────────────────────────────────┘
               ↓ 压缩/提取
┌─────────────────────────────────────────┐
│  长期记忆 (Long-term) - ARCHITECTURE.md │
│  - 代码规范                              │
│  - 常见问题解决方案                      │
│  - Bug 修复记录                          │
│  - API 使用笔记                          │
└─────────────────────────────────────────┘
               ↓ 索引/检索
┌─────────────────────────────────────────┐
│  语义记忆 (Semantic) - 本地知识库        │
│  - 代码模式库                            │
│  - 测试用例模板                          │
│  - Debug 技巧库                          │
└─────────────────────────────────────────┘
```

### 记忆读取策略

#### 新会话启动时

```bash
cyber-team docs read TODO
cyber-team docs read ARCHITECTURE
```

#### 特定话题触发

```bash
cyber-team docs read ARCHITECTURE   # Bug 修复、代码规范
cyber-team docs read TODO           # 测试失败、任务优先级
```

### 记忆写入规则

| 类型 | 触发条件 | 存储位置 | 操作 |
|------|----------|----------|------|
| Bug 修复 | 修复 Bug | ARCHITECTURE.md | `cyber-team docs append ARCHITECTURE -c "..."` |
| 代码技巧 | 发现好技巧 | ARCHITECTURE.md | `cyber-team docs append ARCHITECTURE -c "..."` |
| API 笔记 | 学习新 API | ARCHITECTURE.md | `cyber-team docs append ARCHITECTURE -c "..."` |
| 技术债务 | 发现债务 | ARCHITECTURE.md | `cyber-team docs append ARCHITECTURE -c "..."` |

---

## 🐛 异常处理

### Code Review 不通过

1. 读取 CODE_REVIEW.md 了解问题
2. 更新 TODO 为 Blocked
3. 领取修复任务 T210
4. 修复代码
5. 重新推送
6. 等待 Arch 重新 Review

### 技术难题

1. 记录到 TODO
2. 寻求 @Arch 技术指导
3. 获得方案后继续开发
4. 更新 TODO 为 In Progress

### 代码冲突

1. 拉取最新 main 分支
2. 在功能分支上 rebase
3. 解决冲突
4. 重新推送

---

## ✅ 每日检查清单

- [ ] 代码遵循项目规范
- [ ] 测试覆盖率达到要求
- [ ] Git 提交信息规范
- [ ] TODO 状态及时更新
- [ ] Bug 修复有明确记录

---

## 🔗 相关文档

- [TOOLS.md](TOOLS.md) - Dev 工具配置
