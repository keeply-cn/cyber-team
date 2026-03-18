# TOOLS.md - Ops 能力边界

> **版本**: v1.0.0 | **最后更新**: 2026-03-17 | **维护者**: Ops

## 🛠️ 可用工具

### 1. 执行工具
- `execute_shell`: 运行部署脚本
- `docker_manage`: 管理 Docker 容器
- `aws_cli` / `kubectl`: 云服务和 Kubernetes 操作

### 2. 监控工具
- `read_logs`: 读取和分析日志
- `metrics_query`: 查询监控指标

### 3. 协作工具
- `git_merge`: 合并分支
- `git_push`: 推送代码
- `slack_notify`: 通知部署状态

### 4. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令
- `cyber-team feishu doc-read`: 读取飞书文档
- `cyber-team feishu doc-write`: 写入飞书文档

---

## 🔐 权限范围

### 可访问
- `${PROJECT_SRC}/docker-compose.yml` - Docker 配置
- `${PROJECT_SRC}/Dockerfile` - Docker 镜像定义
- 飞书文档（通过 CLI 访问）
- `${PROJECT_SRC}/.github/workflows/*` - CI/CD 配置
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- 生产环境密钥 (需要用户批准)
- 数据库直接操作
- 未经 Code Review 和测试的分支
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
$changelog_id = $\1_\2.docs.CHANGELOG
$review_id = $\1_\2.docs.CODE_REVIEW_LOGIN
$test_id = $\1_\2.docs.TEST_REPORT_LOGIN

# 获取项目本地路径
$\1=$(cyber-team projects get-path
cd $projectPath\gitsrc
```

#### 读取文档
```bash
# 读取部署相关文档
cyber-team feishu doc-read $todo_id
cyber-team feishu doc-read $changelog_id
cyber-team feishu doc-read $review_id
cyber-team feishu doc-read $test_id
```

#### 写入文档
```bash
# 更新部署记录
cyber-team feishu doc-write $changelog_id "# 变更日志`n`n## v1.0.0`n- 部署内容..."

# 更新 TODO
cyber-team feishu doc-write $todo_id "## 🚀 进行中 (In Progress)`n`n| ID | 任务 |..."

# 更新 MEMORY
cyber-team feishu doc-write $memory_id "## 部署记录`n`n### 新部署..."
```

---

### execute_shell

#### 运行 CI/CD 流水线
```bash
# GitHub Actions
gh workflow run deploy.yml

# GitLab CI
gitlab-ci trigger deploy

# Jenkins
jenkins-cli build job/deploy
```

#### 执行部署脚本
```bash
# 运行部署脚本
.\deploy.ps1

# 运行健康检查
.\health-check.ps1
```

#### Docker 操作
```bash
# 构建镜像
docker build -t my-app:latest .

# 启动容器
docker-compose up -d

# 查看容器日志
docker-compose logs -f

# 停止容器
docker-compose down
```

---

### docker_manage

#### 构建镜像
```bash
docker build -t my-app:v1.0.0 .
```

#### 启动/停止容器
```bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 重启
docker-compose restart
```

#### 查看容器日志
```bash
docker-compose logs -f app
```

---

### git_merge

#### 合并分支流程
```bash
# 1. 检查 Code Review 状态
$\1=$(cyber-team feishu doc-read $review_id

# 2. 检查测试报告状态
$\1=$(cyber-team feishu doc-read $test_id

# 3. 验证状态
if ($review_content -notlike "*APPROVE*" -or $test_content -notlike "*PASS*") {
    echo "错误：\1"
    exit 1
}

# 4. 合并分支
git checkout main
git merge feat/xxx

# 5. 推送
git push origin main
```

#### 注意事项
- 只合并 APPROVE/PASS 的分支
- 合并前确认测试通过
- 合并后创建 Git 标签

---

### metrics_query

#### 查询监控指标
```bash
# CPU 使用率
curl http://prometheus:9090/api/v1/query?query=cpu_usage

# 内存使用率
curl http://prometheus:9090/api/v1/query?query=memory_usage

# 请求延迟
curl http://prometheus:9090/api/v1/query?query=request_latency
```

#### 设置告警
```bash
# CPU 告警
if ($cpuUsage -gt 80) {
    Write-Warning "CPU 使用率超过 80%"
    # 发送通知
}
```

---

## 📊 工具优先级

1. **优先使用** `cyber-team feishu doc-read/write` 进行文档操作
2. **优先使用** `execute_shell` 运行部署脚本
3. **必要时使用** `docker_manage` 管理容器
4. **可选使用** `metrics_query` 查询监控指标

---

## ⚠️ 注意事项

- 所有文档操作必须通过 CLI 进行，确保路径正确
- 涉及生产环境操作必须请求用户批准
- 部署前必须验证 Code Review 和测试报告
- 部署后必须更新变更日志
- 发现异常主动报警并记录

---

**模型**: Qwen3.5-Plus | **版本**: v1.0.0 | **更新日期**: 2026-03-17 | **Token 消耗**: ~3000
