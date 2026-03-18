import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import { loadConfig, saveConfig, GlobalConfig } from '../utils/config';

export const configCommand = new Command('config')
  .description('Manage configuration');

configCommand
  .command('set-token')
  .description('Set GitHub token')
  .action(async () => {
    const inquirer = require('inquirer');
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: 'GitHub Token:',
        mask: '*',
        validate: (input: string) => input.trim().length > 0
      }
    ]);

    const config = await loadConfig();
    config.github = { ...config.github, token: answers.token };
    await saveConfig(config);

    console.log(chalk.green('✓ GitHub token saved'));
  });

configCommand
  .command('set-agent')
  .description('Set current agent identity')
  .action(async () => {
    const inquirer = require('inquirer');
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'agent',
        message: 'Select agent:',
        choices: [
          { name: 'PM (Product Manager)', value: 'PM' },
          { name: 'Arch (Architect)', value: 'Arch' },
          { name: 'Dev (Developer)', value: 'Dev' },
          { name: 'QA (Quality Assurance)', value: 'QA' },
          { name: 'Ops (Operations)', value: 'Ops' }
        ]
      }
    ]);

    const agentConfig: Record<string, { name: string; email: string }> = {
      PM: { name: 'PM Bot', email: 'pm@cyber-team.bot' },
      Arch: { name: 'Arch Bot', email: 'arch@cyber-team.bot' },
      Dev: { name: 'Dev Bot', email: 'dev@cyber-team.bot' },
      QA: { name: 'QA Bot', email: 'qa@cyber-team.bot' },
      Ops: { name: 'Ops Bot', email: 'ops@cyber-team.bot' }
    };

    const config = await loadConfig();
    config.agent = agentConfig[answers.agent];
    await saveConfig(config);

    console.log(chalk.green(`✓ Agent set to ${answers.agent}`));
  });

configCommand
  .command('show')
  .description('Show current configuration')
  .action(async () => {
    const config = await loadConfig();
    
    console.log(chalk.bold('\nCurrent Config:\n'));
    console.log(`  Current Project: ${config.currentProject || 'None'}`);
    console.log(`  GitHub: ${config.github?.token ? '✓ Configured' : '✗ Not set'}`);
    console.log(`  Agent: ${config.agent?.name || '✗ Not set'}`);
    console.log('');
  });
