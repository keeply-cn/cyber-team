import { Command } from 'commander';
import chalk from 'chalk';
import { simpleGit, SimpleGit } from 'simple-git';
import { loadConfig, getGitsrcPath } from '../utils/config';

const AGENT_CONFIG: Record<string, { name: string; email: string }> = {
  PM: { name: 'PM Bot', email: 'pm@cyber-team.bot' },
  Arch: { name: 'Arch Bot', email: 'arch@cyber-team.bot' },
  Dev: { name: 'Dev Bot', email: 'dev@cyber-team.bot' },
  QA: { name: 'QA Bot', email: 'qa@cyber-team.bot' },
  Ops: { name: 'Ops Bot', email: 'ops@cyber-team.bot' }
};

function resolveAgent(options: { agent?: string }): { name: string; email: string } {
  // 1. 命令行参数 --agent (最高优先级)
  if (options.agent && AGENT_CONFIG[options.agent]) {
    return AGENT_CONFIG[options.agent];
  }
  
  // 2. 环境变量 CYBER_TEAM_AGENT
  const envAgent = process.env.CYBER_TEAM_AGENT;
  if (envAgent && AGENT_CONFIG[envAgent]) {
    return AGENT_CONFIG[envAgent];
  }
  
  // 3. 全局配置文件
  const config = loadConfigSync();
  if (config?.agent) {
    return config.agent;
  }
  
  // 4. 默认
  return { name: 'Cyber Team Bot', email: 'bot@cyber-team.local' };
}

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

function getAgentSuffix(agent: { name: string; email: string }): string {
  return `[${agent.name}]`;
}

async function configureGitUser(gitsrcPath: string, agent: { name: string; email: string }): Promise<void> {
  const git = simpleGit(gitsrcPath);
  await git.addConfig('user.name', agent.name);
  await git.addConfig('user.email', agent.email);
}

async function getGit(gitsrcPath: string): Promise<SimpleGit> {
  return simpleGit(gitsrcPath);
}

export const gitCommand = new Command('git')
  .description('Git operations');

gitCommand
  .command('init [name]')
  .description('Initialize git repository')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (name: string | undefined, options: { agent?: string }) => {
    let projectName = name;
    
    if (!projectName) {
      const config = loadConfigSync();
      projectName = config?.currentProject;
    }

    if (!projectName) {
      console.log(chalk.yellow('No project specified'));
      process.exit(1);
    }

    const agent = resolveAgent(options);
    const gitsrcPath = getGitsrcPath(projectName);
    const git = await getGit(gitsrcPath);
    
    await git.init();
    await configureGitUser(gitsrcPath, agent);
    console.log(chalk.green(`✓ Git initialized in ${projectName} as ${agent.name}`));
  });

gitCommand
  .command('status')
  .description('Show git status')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    const status = await git.status();
    console.log(status.toString());
  });

gitCommand
  .command('branch [name]')
  .description('List or create branch')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (name: string | undefined, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);

    if (name) {
      await git.checkoutLocalBranch(name);
      console.log(chalk.green(`✓ Created and switched to branch: ${name}`));
    } else {
      const branches = await git.branchLocal();
      console.log(branches.all.join('\n'));
    }
  });

gitCommand
  .command('checkout <branch>')
  .description('Checkout branch')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (branch: string, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    await git.checkout(branch);
    console.log(chalk.green(`✓ Switched to ${branch}`));
  });

gitCommand
  .command('commit <message>')
  .description('Commit changes with agent signature')
  .option('-a, --agent <agent>', 'Specify agent (PM|Arch|Dev|QA|Ops)')
  .action(async (message: string, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const agent = resolveAgent(options);
    const gitsrcPath = getGitsrcPath(config.currentProject);
    await configureGitUser(gitsrcPath, agent);
    const git = await getGit(gitsrcPath);

    const suffix = getAgentSuffix(agent);
    const fullMessage = suffix ? `${message} ${suffix}` : message;

    await git.add('.');
    await git.commit(fullMessage);
    console.log(chalk.green(`✓ Committed: ${fullMessage}`));
  });

gitCommand
  .command('push')
  .description('Push to remote')
  .option('-u, --set-upstream', 'Set upstream')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (options: { setUpstream?: boolean; agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    
    try {
      if (options.setUpstream) {
        const branch = await git.branchLocal().then(b => b.current!);
        await git.push(['-u', 'origin', branch]);
      } else {
        await git.push();
      }
      console.log(chalk.green('✓ Pushed'));
    } catch (e) {
      console.log(chalk.yellow('No remote configured or push failed'));
    }
  });

gitCommand
  .command('pull')
  .description('Pull from remote')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    await git.pull();
    console.log(chalk.green('✓ Pulled'));
  });

gitCommand
  .command('log [count]')
  .description('Show commit log')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (count: string | undefined, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    const log = await git.log({ maxCount: parseInt(count || '10') });
    
    for (const commit of log.all) {
      console.log(`\n${commit.hash.slice(0, 7)} - ${commit.date}`);
      console.log(commit.message);
    }
  });

gitCommand
  .command('pr-create')
  .description('Create pull request via GitHub API')
  .option('-t, --title <title>', 'PR title')
  .option('-b, --body <body>', 'PR body')
  .option('-B, --base <base>', 'Base branch', 'master')
  .option('-a, --agent <agent>', 'Specify agent (PM|Arch|Dev|QA|Ops)')
  .action(async (options: { title?: string; body?: string; base?: string; agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    if (!config.github?.token) {
      console.log(chalk.red('GitHub token not configured. Run: cyber-team config set-token'));
      process.exit(1);
    }

    const agent = resolveAgent(options);
    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    const status = await git.status();
    const currentBranch = status.current;

    if (!currentBranch) {
      console.log(chalk.yellow('Not on a branch'));
      return;
    }

    const suffix = getAgentSuffix(agent);
    const title = options.title || `${currentBranch} ${suffix}`.trim();
    const body = options.body || `Created by ${agent.name}`;

    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: config.github.token });

      const { data: user } = await octokit.users.getAuthenticated();
      const owner = user.login;
      const repo = config.currentProject;
      
      const { data: pr } = await octokit.pulls.create({
        owner,
        repo,
        title,
        body,
        head: currentBranch,
        base: options.base || 'master'
      });

      console.log(chalk.green(`✓ PR created: ${pr.html_url}`));
    } catch (e: any) {
      console.log(chalk.red(`Failed to create PR: ${e.message}`));
    }
  });

gitCommand
  .command('merge <branch>')
  .description('Merge branch with agent signature')
  .option('-a, --agent <agent>', 'Specify agent (PM|Arch|Dev|QA|Ops)')
  .action(async (branch: string, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const agent = resolveAgent(options);
    const gitsrcPath = getGitsrcPath(config.currentProject);
    await configureGitUser(gitsrcPath, agent);
    const git = await getGit(gitsrcPath);

    const suffix = getAgentSuffix(agent);
    const mergeMessage = `Merge ${branch} ${suffix}`.trim();

    await git.merge([branch]);
    console.log(chalk.green(`✓ Merged ${branch}`));
    console.log(chalk.gray(`  Message: ${mergeMessage}`));
  });

gitCommand
  .command('tag <version>')
  .description('Create tag with agent signature')
  .option('-a, --agent <agent>', 'Specify agent (PM|Arch|Dev|QA|Ops)')
  .action(async (version: string, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const agent = resolveAgent(options);
    const gitsrcPath = getGitsrcPath(config.currentProject);
    await configureGitUser(gitsrcPath, agent);
    const git = await getGit(gitsrcPath);

    const suffix = getAgentSuffix(agent);
    const tagMessage = suffix ? `Tagged by ${suffix}: ${version}` : `Release: ${version}`;

    await git.raw(['tag', '-a', version, '-m', tagMessage]);
    console.log(chalk.green(`✓ Created tag: ${version}`));
  });

gitCommand
  .command('tag-push')
  .description('Push tags to remote')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    await git.push('--tags');
    console.log(chalk.green('✓ Tags pushed'));
  });

gitCommand
  .command('remote-add <name> <url>')
  .description('Add remote')
  .option('-a, --agent <agent>', 'Specify agent')
  .action(async (name: string, url: string, options: { agent?: string }) => {
    const config = loadConfigSync();
    if (!config?.currentProject) {
      console.log(chalk.yellow('No current project'));
      process.exit(1);
    }

    const gitsrcPath = getGitsrcPath(config.currentProject);
    const git = await getGit(gitsrcPath);
    await git.addRemote(name, url);
    console.log(chalk.green(`✓ Remote "${name}" added`));
  });
