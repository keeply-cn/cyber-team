import * as fs from 'fs-extra';
import * as path from 'path';
import os from 'os';

export const PROJECTS_DIR = path.join(os.homedir(), '.cyber-team', 'projects');
export const CONFIG_FILE = path.join(os.homedir(), '.cyber-team', 'config.json');

export interface ProjectConfig {
  name: string;
  rootPath: string;
  createdAt: string;
  updatedAt: string;
  docs: {
    CONTEXT: string;
    PRD: string;
    TODO: string;
    ARCHITECTURE: string;
    CODE_REVIEW: string;
    TEST_REPORT: string;
    BUG_REPORT: string;
    CHANGELOG: string;
    MEMORY: string;
  };
}

export interface GlobalConfig {
  currentProject: string | null;
  github?: {
    token: string;
    owner?: string;
  };
  agent?: {
    name: string;
    email: string;
  };
}

export async function ensureDir(): Promise<void> {
  await fs.ensureDir(PROJECTS_DIR);
}

export async function loadConfig(): Promise<GlobalConfig> {
  await ensureDir();
  if (await fs.pathExists(CONFIG_FILE)) {
    return await fs.readJson(CONFIG_FILE);
  }
  return { currentProject: null };
}

export async function saveConfig(config: GlobalConfig): Promise<void> {
  await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}

export async function loadProjectConfig(projectName: string): Promise<ProjectConfig | null> {
  const configPath = path.join(PROJECTS_DIR, projectName, 'project.json');
  if (await fs.pathExists(configPath)) {
    return await fs.readJson(configPath);
  }
  return null;
}

export async function saveProjectConfig(projectName: string, config: ProjectConfig): Promise<void> {
  const projectPath = path.join(PROJECTS_DIR, projectName);
  await fs.ensureDir(projectPath);
  await fs.writeJson(path.join(projectPath, 'project.json'), config, { spaces: 2 });
}

export function getProjectPath(projectName: string): string {
  return path.join(PROJECTS_DIR, projectName);
}

export function getGitsrcPath(projectName: string): string {
  return path.join(PROJECTS_DIR, projectName, 'gitsrc');
}

export function getDocsPath(projectName: string): string {
  return path.join(PROJECTS_DIR, projectName, 'docs');
}
