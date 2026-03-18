import { Command } from 'commander';
import chalk from 'chalk';
import { projectsCommand } from './commands/projects';
import { gitCommand } from './commands/git';
import { docsCommand } from './commands/docs';
import { configCommand } from './commands/config';
import { repoCommand } from './commands/repo';
import { issuesCommand } from './commands/issues';

const program = new Command();

program
  .name('cyber-team')
  .description('Cyber Team CLI - Multi-Agent Collaboration Tool')
  .version('1.0.0');

program.addCommand(projectsCommand);
program.addCommand(gitCommand);
program.addCommand(docsCommand);
program.addCommand(configCommand);
program.addCommand(repoCommand);
program.addCommand(issuesCommand);

program.parse(process.argv);
