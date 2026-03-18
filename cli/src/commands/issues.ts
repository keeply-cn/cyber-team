import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../utils/config';

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

export const issuesCommand = new Command('issues')
  .description('GitHub Issues operations');

issuesCommand
  .command('create')
  .description('Create GitHub issue')
  .option('-t, --title <title>', 'Issue title')
  .option('-b, --body <body>', 'Issue body')
  .option('-l, --labels <labels>', 'Issue labels (comma separated)')
  .action(async (options: { title?: string; body?: string; labels?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    if (!config.github?.token) {
      console.log(chalk.red('GitHub token not configured'));
      process.exit(1);
    }

    if (!options.title) {
      console.log(chalk.yellow('Issue title is required'));
      process.exit(1);
    }

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      const owner = user.login;
      const repo = config.currentProject;

      const labels = options.labels ? options.labels.split(',').map(l => l.trim()) : [];

      const { data: issue } = await octokit.issues.create({
        owner,
        repo,
        title: options.title,
        body: options.body || '',
        labels
      });

      console.log(chalk.green(`✓ Issue created: ${issue.html_url}`));
      console.log(chalk.gray(`  #${issue.number}: ${issue.title}`));
    } catch (e: any) {
      console.log(chalk.red(`Failed to create issue: ${e.message}`));
    }
  });

issuesCommand
  .command('close')
  .description('Close GitHub issue')
  .option('-n, --number <number>', 'Issue number')
  .action(async (options: { number?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    if (!config.github?.token) {
      console.log(chalk.red('GitHub token not configured'));
      process.exit(1);
    }

    if (!options.number) {
      console.log(chalk.yellow('Issue number is required'));
      process.exit(1);
    }

    const issueNumber = parseInt(options.number);

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      const owner = user.login;
      const repo = config.currentProject;

      const { data: issue } = await octokit.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        state: 'closed'
      });

      console.log(chalk.green(`✓ Issue closed: ${issue.html_url}`));
      console.log(chalk.gray(`  #${issue.number}: ${issue.title}`));
    } catch (e: any) {
      console.log(chalk.red(`Failed to close issue: ${e.message}`));
    }
  });

issuesCommand
  .command('list')
  .description('List GitHub issues')
  .option('-s, --state <state>', 'Issue state (open|closed|all)', 'open')
  .action(async (options: { state?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    if (!config.github?.token) {
      console.log(chalk.red('GitHub token not configured'));
      process.exit(1);
    }

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      const owner = user.login;
      const repo = config.currentProject;

      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: options.state as any || 'open'
      });

      if (issues.length === 0) {
        console.log(chalk.yellow('No issues found'));
        return;
      }

      console.log(chalk.bold(`\nIssues (${issues.length}):\n`));
      for (const issue of issues) {
        const state = issue.state === 'open' ? chalk.green('●') : chalk.gray('○');
        console.log(`  ${state} #${issue.number}: ${issue.title}`);
      }
      console.log('');
    } catch (e: any) {
      console.log(chalk.red(`Failed to list issues: ${e.message}`));
    }
  });

issuesCommand
  .command('comment')
  .description('Comment on GitHub issue')
  .option('-n, --number <number>', 'Issue number')
  .option('-c, --comment <comment>', 'Comment body')
  .action(async (options: { number?: string; comment?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    if (!config.github?.token) {
      console.log(chalk.red('GitHub token not configured'));
      process.exit(1);
    }

    if (!options.number || !options.comment) {
      console.log(chalk.yellow('Issue number and comment are required'));
      process.exit(1);
    }

    const issueNumber = parseInt(options.number);

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      const owner = user.login;
      const repo = config.currentProject;

      const { data: comment } = await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: options.comment
      });

      console.log(chalk.green(`✓ Comment added`));
    } catch (e: any) {
      console.log(chalk.red(`Failed to add comment: ${e.message}`));
    }
  });
