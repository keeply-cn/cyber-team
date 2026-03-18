@echo off
REM Cyber Team CLI 安装脚本 (Windows)

echo.
echo 🚀 安装 Cyber Team CLI...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    exit /b 1
)

echo 📦 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    exit /b 1
)

echo 🔨 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    exit /b 1
)

echo 🔗 链接到全局...
call npm link
if %errorlevel% neq 0 (
    echo ⚠️  npm link 失败，可能需要管理员权限
)

echo.
echo ✅ 安装完成！
echo.
echo 使用方法：
echo   cyber-team --help              查看帮助
echo   cyber-team projects create    创建项目
echo   cyber-team git commit         提交代码
echo   cyber-team issues create      创建 Issue
echo.
echo 首次配置：
echo   cyber-team config set-token  设置 GitHub Token
echo.

pause
