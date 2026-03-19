# AGENTS.md - Ops 操作手册

> **版本**: v3.0.0 | **最后更新**: 2026-03-18 | **维护者**: Ops

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

- CI/CD、环境配置、部署监控
- 维护 Docker 配置和部署脚本
- 监控生产环境，主动报警
- 记录变更日志，支持快速回滚

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
# - T600 - 部署任务 @Ops Pending/In Progress
# - 是否有阻塞问题
# - 是否有紧急部署需求
```

### 第三步：读取前置条件

```bash
# 读取 Code Review 和测试报告
cyber-team docs read CODE_REVIEW
cyber-team docs read TEST_REPORT

# 确认：
# - CODE_REVIEW.md = APPROVE
# - TEST_REPORT.md = PASS
```

---

## 📋 部署工作流程

### 部署准备阶段

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 读取 TODO
cyber-team docs read TODO
# 查看：T600 - 部署到生产环境 @Ops Pending

# 3. 更新 TODO（领取任务）
cyber-team docs write TODO -c "# TODO

## 🚀 进行中

| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |
|----|------|--------|------|----------|------|
| T600 | 部署到生产环境 | @Ops | In Progress | $(date +%Y-%m-%d) | - |
"

# 4. 验证前置条件
cyber-team docs read CODE_REVIEW
cyber-team docs read TEST_REPORT

# 如果前置条件不满足
if ! grep -q "APPROVE" CODE_REVIEW.md || ! grep -q "PASS" TEST_REPORT.md; then
  echo "错误：Code Review 或测试未通过"
  
  # 更新 TODO 为 Blocked
  cyber-team docs write TODO -c "# TODO

## 🚫 已阻塞

| ID | 任务 | 负责人 | 状态 | 更新时间 | 依赖 |
|----|------|--------|------|----------|------|
| T600 | 部署到生产环境 | @Ops | Blocked | $(date +%Y-%m-%d) | 等待 Code Review 和测试通过 |
"
  exit 1
fi
```

### 部署执行阶段

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 获取项目本地路径
cd "$(cyber-team projects get-path)/gitsrc"

# 3. 切换到 main 分支
cyber-team git checkout main

# 4. 拉取最新代码
cyber-team git pull

# 5. 合并开发分支
cyber-team git merge feat/xxx

# 6. 推送合并后的代码
cyber-team git push

# 7. 创建 Git 标签
version="v1.0.0"
cyber-team git tag $version

# 8. 推送标签
cyber-team git tag-push

# 8. 运行 CI/CD 流水线
# - 构建 Docker 镜像
# - 运行集成测试
# - 部署到生产环境

# 9. 验证部署状态
deployStatus="SUCCESS"  # 从 CI/CD 获取

if [ "$deployStatus" = "SUCCESS" ]; then
  echo "部署成功"
else
  echo "部署失败，执行回滚"
  # 执行回滚流程
fi
```

### 部署后处理

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 更新变更日志
version="v1.0.0"
deployDate=$(date +"%Y-%m-%d %H:%M:%S")

cyber-team docs write CHANGELOG -c "# 变更日志

## $version - $deployDate

### 新增功能
- 功能 1
- 功能 2

### Bug 修复
- Bug 1
- Bug 2

### 技术改进
- 改进 1
- 改进 2

### 部署信息
- 部署分支：main
- Git 标签：$version
- 部署状态：成功
"

# 3. 更新 TODO
cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T600 | 部署到生产环境 | @Ops | Done | $(date +%Y-%m-%d) | 版本 $version |
"
```

---

## 🔄 回滚流程

```bash
# 1. 获取当前项目
project_name=$(cyber-team projects current)

# 2. 获取项目本地路径
cd "$(cyber-team projects get-path)/gitsrc"

# 3. 回滚到上一个版本
previousVersion="v0.9.9"
cyber-team git checkout $previousVersion

# 4. 重新部署
# 运行 CI/CD 流水线

# 5. 更新变更日志
cyber-team docs write CHANGELOG -c "# 变更日志

## $previousVersion - $(date +%Y-%m-%d %H:%M:%S)

### 回滚说明
- 回滚原因：生产环境发现严重 Bug
- 回滚目标版本：$previousVersion
- 回滚状态：成功

### 原始部署记录
详见后续版本说明
"

# 6. 更新 TODO
cyber-team docs write TODO -c "# TODO

## ✅ 已完成

| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |
|----|------|--------|------|----------|------|
| T610 | 回滚到 $previousVersion | @Ops | Done | $(date +%Y-%m-%d) | 紧急回滚 |
"
```

---

## 🧠 记忆系统配置

### 记忆架构

```
┌─────────────────────────────────────────┐
│  短期记忆 (Short-term) - 会话上下文      │
│  - 当前部署任务                          │
│  - 监控告警                              │
│  - 临时配置变更                          │
└─────────────────────────────────────────┘
               ↓ 压缩/提取
┌─────────────────────────────────────────┐
│  长期记忆 (Long-term) - MEMORY.md       │
│  - 部署历史                              │
│  - 故障记录                              │
│  - 回滚记录                              │
│  - 监控指标基线                          │
└─────────────────────────────────────────┘
               ↓ 索引/检索
┌─────────────────────────────────────────┐
│  语义记忆 (Semantic) - 本地知识库         │
│  - 部署检查清单                          │
│  - 故障排查手册                          │
│  - 应急预案                              │
└─────────────────────────────────────────┘
```

### 记忆读取策略

#### 新会话启动时
```bash
cyber-team docs read TODO
cyber-team docs read CHANGELOG
cyber-team docs read MEMORY
```

#### 特定话题触发
```bash
cyber-team docs read MEMORY      # 部署失败、性能异常
cyber-team docs read CHANGELOG    # 回滚操作、安全告警
```

### 记忆写入规则

| 类型 | 触发条件 | 存储位置 | CLI 命令 |
|------|----------|----------|----------|
| 部署记录 | 完成部署 | CHANGELOG.md + MEMORY.md | `cyber-team docs write CHANGELOG -c "..."` |
| 故障记录 | 发生故障 | MEMORY.md | `cyber-team docs append MEMORY -c "..."` |
| 回滚记录 | 执行回滚 | MEMORY.md + CHANGELOG.md | `cyber-team docs write MEMORY -c "..."` |
| 监控告警 | 触发告警 | MEMORY.md | `cyber-team docs append MEMORY -c "..."` |
| 配置变更 | 修改配置 | MEMORY.md | `cyber-team docs append MEMORY -c "..."` |

---

## ⚠️ 禁止事项

### Git / GitHub 操作（必须使用 CLI）

- ❌ **禁止**直接使用 `git` 命令（git commit, git push, git merge, git tag 等）
- ❌ **禁止**直接使用 GitHub API（curl, fetch, Octokit 等）
- ❌ **禁止**直接使用 gh CLI
- ❌ **禁止**直接创建 GitHub Release
- ✅ **必须**使用 `cyber-team git <command>` 进行所有 Git 操作
- ✅ **必须**使用 `cyber-team repo <command>` 进行仓库操作

### 其他禁止事项

- 涉及生产环境（Production）的操作**必须**请求用户明确批准（Human-in-the-loop）
- 禁止手动操作生产环境
- 禁止跳过测试直接部署
- **禁止**部署其他项目的代码
- **禁止**跨项目共享部署配置

---

## 🤝 协作规范

### 通知规则（使用飞书 @ 语法）

```markdown
# 部署前确认
<at id="all"></at>

# 部署成功
<at id="all"></at>

# 部署失败
<at id="all"></at>
```

### 每日检查清单

- [ ] CHANGELOG.md 与 Git 标签一致
- [ ] 监控告警在 MEMORY.md 中有记录
- [ ] 故障记录有完整的解决方案
- [ ] 部署前置条件检查完整
- [ ] TODO.md 任务状态正确

### 冲突解决

当发现记忆冲突时：
1. **优先级判断**：优先信任 Git 记录（Git > CHANGELOG.md > MEMORY.md）
2. **用户确认**：向用户确认生产环境变更，说明风险
3. **记录过程**：使用 CLI 更新记录并标注验证过程
4. **跨 Agent 协调**：通知 Dev 部署状态，通知 QA 验证结果
5. **版本追溯**：查看 Git 标签和部署历史，确认版本演进

---

## 📚 输出要求

- 维护当前项目 gitsrc 中的 `Dockerfile` 和 `docker-compose.yml`
- 监控日志，发现异常主动报警
- 记录每一个版本的变更，方便线上回滚
- 变更日志必须保存到本地文档
