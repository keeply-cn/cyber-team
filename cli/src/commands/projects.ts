import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
  PROJECTS_DIR,
  loadConfig,
  saveConfig,
  loadProjectConfig,
  saveProjectConfig,
  getProjectPath,
  getGitsrcPath,
  getDocsPath,
  ProjectConfig
} from '../utils/config';

export const projectsCommand = new Command('projects')
  .description('Manage projects');

projectsCommand
  .command('create [name]')
  .description('Create a new project')
  .action(async (name?: string) => {
    const inquirer = require('inquirer');
    let projectName = name;
    
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          validate: (input: string) => input.trim().length > 0
        }
      ]);
      projectName = answers.name;
    }

    if (!projectName) {
      console.log(chalk.red('Project name is required'));
      return;
    }

    const projectPath = getProjectPath(projectName);
    const gitsrcPath = getGitsrcPath(projectName);
    const docsPath = getDocsPath(projectName);

    if (await fs.pathExists(projectPath)) {
      console.log(chalk.red(`Project "${projectName}" already exists`));
      return;
    }

    await fs.ensureDir(gitsrcPath);
    await fs.ensureDir(docsPath);

    const config: ProjectConfig = {
      name: projectName,
      rootPath: projectPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docs: {
        CONTEXT: path.join(docsPath, 'CONTEXT.md'),
        PRD: path.join(docsPath, 'PRD.md'),
        TODO: path.join(docsPath, 'TODO.md'),
        ARCHITECTURE: path.join(docsPath, 'ARCHITECTURE.md'),
        CODE_REVIEW: path.join(docsPath, 'CODE_REVIEW.md'),
        TEST_REPORT: path.join(docsPath, 'TEST_REPORT.md'),
        BUG_REPORT: path.join(docsPath, 'BUG_REPORT.md'),
        CHANGELOG: path.join(docsPath, 'CHANGELOG.md'),
        MEMORY: path.join(docsPath, 'MEMORY.md'),
      }
    };

    await saveProjectConfig(projectName, config);

    const defaultDocs = {
      CONTEXT: '# 项目背景\n\n## 项目愿景\n\n## 目标用户\n\n## 核心价值\n',
      PRD: '# 产品需求文档\n\n## User Stories\n\n## 优先级\nP0: \nP1: \n',
      TODO: `# TODO\n\n## 🚀 进行中\n\n| ID | 任务 | 负责人 | 状态 | 更新时间 | 备注 |\n|----|------|--------|------|----------|------|\n\n## ⏳ 待开始\n\n| ID | 任务 | 负责人 | 状态 | 前置依赖 | 优先级 |\n|----|------|--------|------|----------|--------|\n\n## ✅ 已完成\n\n| ID | 任务 | 负责人 | 状态 | 完成时间 | 备注 |\n|----|------|--------|------|----------|------|\n\n## 🚫 已阻塞\n\n| ID | 任务 | 负责人 | 阻塞原因 | 解决条件 |\n|----|------|--------|----------|----------|\n`,
      ARCHITECTURE: '# 系统架构\n\n## 技术栈\n\n## 系统架构图\n\n## API 接口\n',
      CODE_REVIEW: '# Code Review\n\n',
      TEST_REPORT: '# 测试报告\n\n',
      BUG_REPORT: '# Bug 报告\n\n',
      CHANGELOG: '# 变更日志\n\n',
      MEMORY: '# 知识库\n\n',
    };

    for (const [docName, content] of Object.entries(defaultDocs)) {
      await fs.writeFile(config.docs[docName as keyof typeof config.docs], content);
    }

    await saveConfig({ currentProject: projectName || null });

    console.log(chalk.green(`✓ Project "${projectName}" created`));
    console.log(chalk.gray(`  Path: ${projectPath}`));
    console.log(chalk.gray(`  Run: cyber-team projects switch ${projectName}`));
  });

projectsCommand
  .command('list')
  .description('List all projects')
  .action(async () => {
    const config = await loadConfig();
    await fs.ensureDir(PROJECTS_DIR);
    const dirs = await fs.readdir(PROJECTS_DIR);
    
    if (dirs.length === 0) {
      console.log(chalk.yellow('No projects found'));
      return;
    }

    console.log(chalk.bold('\nProjects:\n'));
    for (const dir of dirs) {
      const isCurrent = config.currentProject === dir ? chalk.green(' *') : '';
      console.log(`  ${dir}${isCurrent}`);
    }
    console.log('');
  });

projectsCommand
  .command('switch <name>')
  .description('Switch to a project')
  .action(async (name: string) => {
    const projectPath = getProjectPath(name);
    
    if (!(await fs.pathExists(projectPath))) {
      console.log(chalk.red(`Project "${name}" not found`));
      return;
    }

    const config = await loadConfig();
    config.currentProject = name;
    await saveConfig(config);

    console.log(chalk.green(`✓ Switched to "${name}"`));
  });

projectsCommand
  .command('current')
  .description('Show current project')
  .action(async () => {
    const config = await loadConfig();
    if (config.currentProject) {
      console.log(config.currentProject);
    } else {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }
  });

projectsCommand
  .command('info')
  .description('Show current project info')
  .action(async () => {
    const config = await loadConfig();
    if (!config.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const projectConfig = await loadProjectConfig(config.currentProject);
    if (!projectConfig) {
      console.log(chalk.red('Project config not found'));
      return;
    }

    console.log(chalk.bold(`\nProject: ${projectConfig.name}\n`));
    console.log(chalk.gray('Docs:'));
    for (const [key, value] of Object.entries(projectConfig.docs)) {
      console.log(`  ${key}: ${value}`);
    }
    console.log('');
  });

projectsCommand
  .command('get-path')
  .description('Get current project path')
  .action(async () => {
    const config = await loadConfig();
    if (!config.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }
    console.log(getProjectPath(config.currentProject));
  });

projectsCommand
  .command('get-docs-path')
  .description('Get current project docs path')
  .action(async () => {
    const config = await loadConfig();
    if (!config.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }
    console.log(getDocsPath(config.currentProject));
  });

projectsCommand
  .command('repair <name>')
  .description('Repair project config')
  .action(async (name: string) => {
    const projectPath = getProjectPath(name);
    const gitsrcPath = getGitsrcPath(name);
    const docsPath = getDocsPath(name);

    if (!(await fs.pathExists(gitsrcPath))) {
      console.log(chalk.red(`gitsrc directory not found for "${name}"`));
      return;
    }

    await fs.ensureDir(docsPath);

    const existingConfig = await loadProjectConfig(name);
    if (existingConfig) {
      console.log(chalk.yellow(`Project "${name}" already has config`));
      return;
    }

    const config: ProjectConfig = {
      name: name,
      rootPath: projectPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docs: {
        CONTEXT: path.join(docsPath, 'CONTEXT.md'),
        PRD: path.join(docsPath, 'PRD.md'),
        TODO: path.join(docsPath, 'TODO.md'),
        ARCHITECTURE: path.join(docsPath, 'ARCHITECTURE.md'),
        CODE_REVIEW: path.join(docsPath, 'CODE_REVIEW.md'),
        TEST_REPORT: path.join(docsPath, 'TEST_REPORT.md'),
        BUG_REPORT: path.join(docsPath, 'BUG_REPORT.md'),
        CHANGELOG: path.join(docsPath, 'CHANGELOG.md'),
        MEMORY: path.join(docsPath, 'MEMORY.md'),
      }
    };

    await saveProjectConfig(name, config);
    console.log(chalk.green(`✓ Project "${name}" repaired`));
  });
