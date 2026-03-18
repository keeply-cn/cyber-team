#!/bin/bash

# Cyber Team CLI 安装脚本

set -e

echo "🚀 安装 Cyber Team CLI..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
cd "$(dirname "$0")"
npm install

echo "🔨 构建项目..."
npm run build

echo "📁 设置权限..."
chmod +x bin/cyber-team

echo "🔗 链接到全局..."
npm link

echo ""
echo "✅ 安装完成！"
echo ""
echo "使用方法："
echo "  cyber-team --help              查看帮助"
echo "  cyber-team projects create    创建项目"
echo "  cyber-team git commit         提交代码"
echo "  cyber-team issues create      创建 Issue"
echo ""
echo "首次配置："
echo "  cyber-team config set-token  设置 GitHub Token"
echo ""
