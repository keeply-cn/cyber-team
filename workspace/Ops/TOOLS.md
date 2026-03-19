# TOOLS.md - Ops 能力边界

> **版本**: v2.0.0 | **最后更新**: 2026-03-19 | **维护者**: Ops

## 可用工具

### 1. 项目管理工具 (cyber-team CLI)
- `cyber-team projects`: 项目管理命令（切换、获取路径）
- `cyber-team docs`: 文档操作命令（读取、写入、追加）
- `cyber-team git`: Git 操作命令
- `cyber-team repo`: 仓库操作命令

### 2. 执行工具
- `execute_shell`: 运行部署脚本
- `docker_manage`: 管理 Docker 容器
- `aws_cli` / `kubectl`: 云服务和 Kubernetes 操作

### 3. 监控工具
- `read_logs`: 读取和分析日志
- `metrics_query`: 查询监控指标

## 权限范围

### 可访问
- 项目源码目录/docker-compose.yml - Docker 配置
- 项目源码目录/Dockerfile - Docker 镜像定义
- 项目 docs 目录 - 项目文档目录
- 项目源码目录/.github/workflows/* - CI/CD 配置
- `cyber-team` CLI 工具（项目管理相关）

### 禁止访问
- 生产环境密钥 (需要用户批准)
- 数据库直接操作
- 未经 Code Review 和测试的分支
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
# 读取部署相关文档
cyber-team docs read TODO
cyber-team docs read CHANGELOG
cyber-team docs read CODE_REVIEW
cyber-team docs read TEST_REPORT
```

#### 写入文档
```bash
# 更新变更日志
cyber-team docs write CHANGELOG -c "# 变更日志\n\n## v1.0.0\n- 部署内容..."

# 更新 TODO
cyber-team docs write TODO -c "## 🚀 进行中\n\n| ID | 任务 |..."

# 追加 MEMORY
cyber-team docs append MEMORY -c "## 部署记录\n\n### 新部署..."
```

### Git 操作
```bash
# 合并分支
cyber-team git merge feat/xxx

# 获取最新代码
cyber-team git fetch
cyber-team git pull

# 创建标签
cyber-team git tag v1.0.0

# 推送标签
cyber-team git tag-push
```

### execute_shell

#### 运行 CI/CD 流水线
```bash
# GitHub Actions
gh workflow run deploy.yml

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

## 工具限制
- 涉及生产环境操作必须请求用户批准
- 部署前必须验证 Code Review 和测试报告
- 部署后必须更新变更日志
- 发现异常主动报警并记录

---

**参考文档**: [AGENTS.md](AGENTS.md) - Ops 操作手册
