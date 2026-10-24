import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Astro Content Markdown Schema Integrity', () => {
  it('should have valid projects content files', () => {
    const dir = path.resolve('src/content/projects');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      expect(content).toContain('title:');
      expect(content).toContain('category:');
      expect(content).toContain('stack:');
    }
  });

  it('should have valid cli_tools content files', () => {
    const dir = path.resolve('src/content/cli_tools');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      expect(content).toContain('name:');
      expect(content).toContain('command:');
      expect(content).toContain('installCmd:');
    }
  });

  it('should have valid dotfiles content files', () => {
    const dir = path.resolve('src/content/dotfiles');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      expect(content).toContain('title:');
      expect(content).toContain('category:');
      expect(content).toContain('path:');
    }
  });
});
