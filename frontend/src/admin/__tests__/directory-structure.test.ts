import fs from 'fs';
import path from 'path';

describe('Admin Directory Structure', () => {
  const adminDir = path.join(__dirname, '../');
  const requiredDirs = [
    'pages',
    'components',
    'layouts',
    'stores',
    'api',
    'types',
    'router'
  ];

  test('should have admin directory', () => {
    expect(fs.existsSync(adminDir)).toBe(true);
  });

  test('should have all required subdirectories', () => {
    requiredDirs.forEach(dir => {
      const dirPath = path.join(adminDir, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  test('should have index.ts in each directory', () => {
    requiredDirs.forEach(dir => {
      const indexPath = path.join(adminDir, dir, 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });
});
