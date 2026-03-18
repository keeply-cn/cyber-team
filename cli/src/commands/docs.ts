import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import {
  loadConfig,
  loadProjectConfig,
  getDocsPath,
  ProjectConfig
} from '../utils/config';

function getDocPath(docName: string): string {
  return getDocsPath(docName);
}

export const docsCommand = new Command('docs')
  .description('Manage documentation');

docsCommand
  .command('read <doc>')
  .description('Read a document (CONTEXT|PRD|TODO|ARCHITECTURE|CODE_REVIEW|TEST_REPORT|BUG_REPORT|CHANGELOG|MEMORY)')
  .action(async (doc: string) => {
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

    const docKey = doc.toUpperCase() as keyof ProjectConfig['docs'];
    const docPath = projectConfig.docs[docKey];

    if (!docPath) {
      console.log(chalk.red(`Unknown document: ${doc}`));
      return;
    }

    if (!(await fs.pathExists(docPath))) {
      console.log(chalk.yellow(`Document not found: ${docPath}`));
      return;
    }

    const content = await fs.readFile(docPath, 'utf-8');
    console.log(content);
  });

docsCommand
  .command('write <doc>')
  .description('Write content to a document')
  .option('-c, --content <text>', 'Content to write')
  .action(async (doc: string, options: { content?: string }) => {
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

    const docKey = doc.toUpperCase() as keyof ProjectConfig['docs'];
    const docPath = projectConfig.docs[docKey];

    if (!docPath) {
      console.log(chalk.red(`Unknown document: ${doc}`));
      return;
    }

    let content = options.content || '';
    if (!content) {
      console.log(chalk.yellow('No content provided, use -c option'));
      return;
    }

    await fs.writeFile(docPath, content, 'utf-8');
    console.log(chalk.green(`✓ Written to ${doc}`));
  });

docsCommand
  .command('append <doc>')
  .description('Append content to a document')
  .option('-c, --content <text>', 'Content to append')
  .action(async (doc: string, options: { content?: string }) => {
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

    const docKey = doc.toUpperCase() as keyof ProjectConfig['docs'];
    const docPath = projectConfig.docs[docKey];

    if (!docPath) {
      console.log(chalk.red(`Unknown document: ${doc}`));
      return;
    }

    let content = options.content || '';
    if (!content) {
      console.log(chalk.yellow('No content provided, use -c option'));
      return;
    }

    const existing = await fs.pathExists(docPath) ? await fs.readFile(docPath, 'utf-8') : '';
    await fs.writeFile(docPath, existing + content, 'utf-8');
    console.log(chalk.green(`✓ Appended to ${doc}`));
  });

docsCommand
  .command('list')
  .description('List all documents in current project')
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

    console.log(chalk.bold(`\nDocuments in ${config.currentProject}:\n`));
    for (const [key, value] of Object.entries(projectConfig.docs)) {
      const exists = await fs.pathExists(value) ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${exists} ${key}`);
    }
    console.log('');
  });
