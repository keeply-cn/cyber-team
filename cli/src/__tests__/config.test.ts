import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import {
  PROJECTS_DIR,
  CONFIG_FILE,
  loadConfig,
  saveConfig,
  loadProjectConfig,
  saveProjectConfig,
  getProjectPath,
  getGitsrcPath,
  getDocsPath,
  ProjectConfig,
  GlobalConfig
} from '../utils/config';

const TEST_DIR = path.join(os.tmpdir(), 'cyber-team-test');

describe('config utils', () => {
  beforeAll(async () => {
    await fs.ensureDir(TEST_DIR);
  });

  afterAll(async () => {
    await fs.remove(TEST_DIR);
  });

  test('getProjectPath returns correct path', () => {
    const result = getProjectPath('my-app');
    expect(result).toBe(path.join(os.homedir(), '.cyber-team', 'projects', 'my-app'));
  });

  test('getGitsrcPath returns correct path', () => {
    const result = getGitsrcPath('my-app');
    expect(result).toBe(path.join(os.homedir(), '.cyber-team', 'projects', 'my-app', 'gitsrc'));
  });

  test('getDocsPath returns correct path', () => {
    const result = getDocsPath('my-app');
    expect(result).toBe(path.join(os.homedir(), '.cyber-team', 'projects', 'my-app', 'docs'));
  });

  test('loadConfig returns default when no config exists', async () => {
    const testConfigFile = path.join(TEST_DIR, 'config.json');
    const result = await loadConfig();
    expect(result).toHaveProperty('currentProject');
  });
});

describe('ProjectConfig', () => {
  test('ProjectConfig interface has all required fields', () => {
    const config: ProjectConfig = {
      name: 'test-project',
      rootPath: '/path/to/project',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      docs: {
        CONTEXT: '/path/docs/CONTEXT.md',
        PRD: '/path/docs/PRD.md',
        TODO: '/path/docs/TODO.md',
        ARCHITECTURE: '/path/docs/ARCHITECTURE.md',
        CODE_REVIEW: '/path/docs/CODE_REVIEW.md',
        TEST_REPORT: '/path/docs/TEST_REPORT.md',
        BUG_REPORT: '/path/docs/BUG_REPORT.md',
        CHANGELOG: '/path/docs/CHANGELOG.md',
        MEMORY: '/path/docs/MEMORY.md',
      }
    };

    expect(config.name).toBe('test-project');
    expect(config.docs).toHaveProperty('CONTEXT');
    expect(config.docs).toHaveProperty('PRD');
    expect(config.docs).toHaveProperty('TODO');
  });
});

describe('GlobalConfig', () => {
  test('GlobalConfig interface', () => {
    const config: GlobalConfig = {
      currentProject: 'my-project'
    };

    expect(config.currentProject).toBe('my-project');

    const emptyConfig: GlobalConfig = {
      currentProject: null
    };

    expect(emptyConfig.currentProject).toBeNull();
  });
});
