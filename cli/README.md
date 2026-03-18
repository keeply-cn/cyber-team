# Cyber Team CLI

Multi-Agent Collaboration Tool

## 安装

### Windows

```bash
.\install.bat
```

### macOS / Linux

```bash
chmod +x install.sh
./install.sh
```

或者手动安装：

```bash
npm install
npm run build
npm link
```

## 配置

### 1. 设置 GitHub Token

```bash
cyber-team config set-token
```

### 2. 验证安装

```bash
cyber-team config show
```

## 命令

### 项目管理

```bash
cyber-team projects create [name]   # 创建项目
cyber-team projects list             # 列出项目
cyber-team projects switch <name>   # 切换项目
cyber-team projects current          # 当前项目
cyber-team projects info            # 项目信息
```

### Git 操作

```bash
cyber-team git init                # 初始化仓库
cyber-team git commit <msg>        # 提交 (--agent PM|Arch|Dev|QA|Ops)
cyber-team git push               # 推送
cyber-team git pull               # 拉取
cyber-team git merge <branch>      # 合并
cyber-team git tag <version>      # 打标签
cyber-team git pr-create          # 创建 PR
```

### 仓库操作

```bash
cyber-team repo create             # 创建 GitHub 仓库
cyber-team repo delete            # 删除 GitHub 仓库
```

### Issue 操作

```bash
cyber-team issues create          # 创建 Issue
cyber-team issues close           # 关闭 Issue
cyber-team issues list            # 列表
cyber-team issues comment         # 评论
```

### 文档操作

```bash
cyber-team docs read <doc>        # 读取文档
cyber-team docs write <doc> -c   # 写入文档
cyber-team docs append <doc> -c   # 追加文档
cyber-team docs list              # 列表
```

### 配置

```bash
cyber-team config show            # 显示配置
cyber-team config set-token      # 设置 GitHub Token
```

## Agent 说明

每个 Agent 使用 `--agent` 参数区分：

```bash
cyber-team git commit "feat: add login" --agent Dev
cyber-team git commit "fix: bug" --agent QA
cyber-team git merge "feat/xxx" --agent Arch
```

可用 Agent: PM, Arch, Dev, QA, Ops

## 飞书配置

在 Agent 文档中配置飞书 app_id：
