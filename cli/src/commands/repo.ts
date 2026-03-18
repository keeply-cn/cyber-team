import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, getGitsrcPath } from '../utils/config';
import { simpleGit } from 'simple-git';

function loadConfigSync(): any {
  try {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    const configPath = path.join(os.homedir(), '.cyber-team', 'config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch {}
  return null;
}

export const repoCommand = new Command('repo')
  .description('Repository operations');

repoCommand
  .command('create')
  .description('Create GitHub repository')
  .option('-n, --name <name>', 'Repository name')
  .option('-d, --description <description>', 'Repository description')
  .option('-p, --private', 'Private repository')
  .action(async (options: { name?: string; description?: string; private?: boolean }) => {
    const config = loadConfigSync();
    const projectName = options.name || config?.currentProject;

    if (!projectName) {
      console.log(chalk.yellow('No project specified'));
      process.exit(1);
    }

    if (!config?.github?.token) {
      console.log(chalk.red('GitHub token not configured'));
      process.exit(1);
    }

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: projectName,
        description: options.description || `Project: ${projectName}`,
        private: options.private || false,
        auto_init: false
      });

      console.log(chalk.green(`✓ Repository created: ${repo.full_name}`));
      console.log(chalk.gray(`  URL: ${repo.html_url}`));

      // Add remote to git
      const gitsrcPath = getGitsrcPath(projectName);
      const git = simpleGit(gitsrcPath);
      
      const remoteUrl = `https://${config.github.token}@github.com/${user.login}/${projectName}.git`;
      await git.remote(['add', 'origin', remoteUrl]);
      
      console.log(chalk.green(`✓ Remote "origin" added`));
    } catch (e: any) {
      console.log(chalk.red(`Failed to create repository: ${e.message}`));
    }
  });

repoCommand
  .command('delete')
  .description('Delete GitHub repository')
  .option('-n, --name <name>', 'Repository name')
  .action(async (options: { name?: string }) => {
    const config = loadConfigSync();
    const projectName = options.name || config?.currentProject;

    if (!projectName) {
      console.log(chalk.yellow('No project specified'));
      process.exit(1);
    }

    if (!config?.github?.token) {
      console.log(chalk.red('GitHub token not configured'));
      process.exit(1);
    }

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      
      await octokit.repos.delete({
        owner: user.login,
        repo: projectName
      });

      console.log(chalk.green(`✓ Repository deleted: ${user.login}/${projectName}`));
    } catch (e: any) {
      console.log(chalk.red(`Failed to delete repository: ${e.message}`));
    }
  });
