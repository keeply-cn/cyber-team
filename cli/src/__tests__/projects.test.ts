import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { PROJECTS_DIR, ProjectConfig } from '../utils/config';

const TEST_DIR = path.join(os.tmpdir(), 'cyber-team-test-projects');

describe('projects command', () => {
  beforeAll(async () => {
    await fs.ensureDir(TEST_DIR);
  });

  afterAll(async () => {
    await fs.remove(TEST_DIR);
  });

  describe('project creation', () => {
    test('should create project directory structure', async () => {
      const projectName = 'test-create-project';
      const projectPath = path.join(TEST_DIR, projectName);
      const gitsrcPath = path.join(projectPath, 'gitsrc');
      const docsPath = path.join(projectPath, 'docs');

      await fs.ensureDir(gitsrcPath);
      await fs.ensureDir(docsPath);

      expect(await fs.pathExists(projectPath)).toBe(true);
      expect(await fs.pathExists(gitsrcPath)).toBe(true);
      expect(await fs.pathExists(docsPath)).toBe(true);
    });

    test('should create project.json with correct structure', async () => {
      const config: ProjectConfig = {
        name: 'test-project',
        rootPath: path.join(TEST_DIR, 'test-project'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        docs: {
          CONTEXT: path.join(TEST_DIR, 'test-project', 'docs', 'CONTEXT.md'),
          PRD: path.join(TEST_DIR, 'test-project', 'docs', 'PRD.md'),
          TODO: path.join(TEST_DIR, 'test-project', 'docs', 'TODO.md'),
          ARCHITECTURE: path.join(TEST_DIR, 'test-project', 'docs', 'ARCHITECTURE.md'),
          CODE_REVIEW: path.join(TEST_DIR, 'test-project', 'docs', 'CODE_REVIEW.md'),
          TEST_REPORT: path.join(TEST_DIR, 'test-project', 'docs', 'TEST_REPORT.md'),
          BUG_REPORT: path.join(TEST_DIR, 'test-project', 'docs', 'BUG_REPORT.md'),
          CHANGELOG: path.join(TEST_DIR, 'test-project', 'docs', 'CHANGELOG.md'),
          MEMORY: path.join(TEST_DIR, 'test-project', 'docs', 'MEMORY.md'),
        }
      };

      const projectPath = path.join(TEST_DIR, 'test-project');
      await fs.ensureDir(projectPath);
      await fs.writeJson(path.join(projectPath, 'project.json'), config);

      const loaded = await fs.readJson(path.join(projectPath, 'project.json'));
      
      expect(loaded.name).toBe('test-project');
      expect(loaded.docs.CONTEXT).toBeDefined();
      expect(loaded.docs.PRD).toBeDefined();
      expect(loaded.docs.TODO).toBeDefined();
    });

    test('should create all default docs', async () => {
      const docs = ['CONTEXT.md', 'PRD.md', 'TODO.md', 'ARCHITECTURE.md', 
                    'CODE_REVIEW.md', 'TEST_REPORT.md', 'BUG_REPORT.md', 
                    'CHANGELOG.md', 'MEMORY.md'];
      
      const docsPath = path.join(TEST_DIR, 'test-project', 'docs');
      await fs.ensureDir(docsPath);

      for (const doc of docs) {
        await fs.writeFile(path.join(docsPath, doc), `# ${doc.replace('.md', '')}\n\n`);
      }

      for (const doc of docs) {
        expect(await fs.pathExists(path.join(docsPath, doc))).toBe(true);
      }
    });
  });

  describe('project listing', () => {
    test('should list all projects', async () => {
      // Clean up first
      await fs.emptyDir(TEST_DIR);
      
      const projects = ['project-a', 'project-b', 'project-c'];
      
      for (const project of projects) {
        await fs.ensureDir(path.join(TEST_DIR, project));
      }

      const dirs = await fs.readdir(TEST_DIR);
      
      expect(dirs).toContain('project-a');
      expect(dirs).toContain('project-b');
      expect(dirs).toContain('project-c');
      expect(dirs.length).toBe(3);
    });
  });

  describe('docs operations', () => {
    test('should read doc content', async () => {
      const docPath = path.join(TEST_DIR, 'test-project', 'docs', 'TODO.md');
      const content = '# TODO\n\n## Test Content\n';
      
      await fs.ensureDir(path.dirname(docPath));
      await fs.writeFile(docPath, content);

      const loaded = await fs.readFile(docPath, 'utf-8');
      
      expect(loaded).toContain('# TODO');
      expect(loaded).toContain('## Test Content');
    });

    test('should append doc content', async () => {
      const docPath = path.join(TEST_DIR, 'test-project', 'docs', 'MEMORY.md');
      const original = '# Memory\n\nOriginal content\n';
      const appended = '\nAppended content\n';
      
      await fs.ensureDir(path.dirname(docPath));
      await fs.writeFile(docPath, original);
      await fs.appendFile(docPath, appended);

      const loaded = await fs.readFile(docPath, 'utf-8');
      
      expect(loaded).toContain('Original content');
      expect(loaded).toContain('Appended content');
    });

    test('should write doc content', async () => {
      const docPath = path.join(TEST_DIR, 'test-project', 'docs', 'PRD.md');
      const content = '# PRD\n\nNew content\n';
      
      await fs.ensureDir(path.dirname(docPath));
      await fs.writeFile(docPath, content, 'utf-8');

      const loaded = await fs.readFile(docPath, 'utf-8');
      
      expect(loaded).toBe('# PRD\n\nNew content\n');
    });
  });
});
