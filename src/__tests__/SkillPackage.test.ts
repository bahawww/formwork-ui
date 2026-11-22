import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SKILL_DIR = path.join(ROOT, 'skills', 'designing-anti-slop-ui');
const CHECKER_SCRIPT = path.join(SKILL_DIR, 'scripts', 'check-rules.mjs');

describe('Portable designing-anti-slop-ui skill package', () => {
  it('provides valid frontmatter, word budget <= 500, zero em dashes, and all linked assets/references', () => {
    const skillMdPath = path.join(SKILL_DIR, 'SKILL.md');
    const content = fs.readFileSync(skillMdPath, 'utf8');

    expect(content).toMatch(/^---\nname: designing-anti-slop-ui\ndescription: Use when /);
    expect(content).not.toContain('\u2014');

    const words = content.trim().split(/\s+/).filter(Boolean).length;
    expect(words).toBeLessThanOrEqual(500);

    const requiredFiles = [
      'references/color-and-tokens.md',
      'references/layout-spacing-corners.md',
      'references/motion-and-animation.md',
      'references/graphs-and-dataviz.md',
      'references/audit-and-critique-checklist.md',
      'assets/tokens.css',
      'assets/motionTokens.ts',
      'scripts/check-rules.mjs',
    ];

    for (const rel of requiredFiles) {
      const fullPath = path.join(SKILL_DIR, rel);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(content).toContain(rel);
    }

    expect(fs.existsSync(path.join(ROOT, '.agents', 'skills', 'designing-anti-slop-ui', 'SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, '.claude', 'skills', 'designing-anti-slop-ui', 'SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, 'CLAUDE.md'))).toBe(true);
  });

  it('passes when portable check-rules runs on this repository', () => {
    const output = execFileSync('node', [CHECKER_SCRIPT, ROOT], { encoding: 'utf8' });
    expect(output).toContain('Anti-slop check passed');
  });

  it('catches anti-slop violations when run against a dirty fixture project', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'formwork-skill-test-'));
    try {
      const srcDir = path.join(tempDir, 'src');
      fs.mkdirSync(srcDir, { recursive: true });
      const badComponent = [
        'export function SloppyCard({ onOpen }: { onOpen: () => void }) {',
        `  return (`,
        `    <div className="font-bold bg-blue-500 shadow-xl ${'transition'}-all" onClick={onOpen}>`,
        `      Bad card \u2014 click me`,
        `    </div>`,
        '  );',
        '}',
      ].join('\n');
      fs.writeFileSync(path.join(srcDir, 'SloppyCard.tsx'), badComponent, 'utf8');

      let stderrOutput = '';
      let exitCode = 0;
      try {
        execFileSync('node', [CHECKER_SCRIPT, tempDir], { encoding: 'utf8' });
      } catch (err) {
        if (err && typeof err === 'object' && 'status' in err && 'stderr' in err) {
          exitCode = Number(err.status ?? 1);
          stderrOutput = String(err.stderr ?? '');
        }
      }

      expect(exitCode).toBe(1);
      expect(stderrOutput).toContain('[no-tw-bold]');
      expect(stderrOutput).toContain('[no-tw-raw-palette]');
      expect(stderrOutput).toContain('[no-tw-shadow-slop]');
      expect(stderrOutput).toContain(`[no-${'transition'}-all]`);
      expect(stderrOutput).toContain('[no-em-dash]');
      expect(stderrOutput).toContain('[no-non-semantic-click]');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
