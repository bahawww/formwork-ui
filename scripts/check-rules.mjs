import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function walkFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

const failures = [];

function addFailure(file, lineNum, rule, snippet) {
  const rel = path.relative(ROOT, file);
  failures.push(`${rel}:${lineNum} [${rule}] ${snippet.trim()}`);
}

function scanLines(file, rules) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, idx) => {
    for (const rule of rules) {
      if (rule.regex.test(line)) {
        addFailure(file, idx + 1, rule.name, line);
      }
    }
  });
}

function scanNonSemanticClicks(file) {
  const text = fs.readFileSync(file, 'utf8');
  const tagRegex = /<(?:div|span|tr|td)\b(?:[^<>]|=>)*\bonClick\s*=/g;
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    if (match[0].includes('data-backdrop')) {
      continue;
    }
    const lineNum = text.slice(0, match.index).split('\n').length;
    addFailure(file, lineNum, 'no-non-semantic-click', match[0].split('\n')[0] ?? match[0]);
  }
}

const emDashRule = { name: 'no-em-dash', regex: /\u2014/ };
const srcFiles = walkFiles(path.join(ROOT, 'src'));
const skillFiles = walkFiles(path.join(ROOT, 'skills/anti-slop-formwork'));

const docFiles = [
  path.join(ROOT, 'AGENTS.md'),
  path.join(ROOT, 'README.md'),
  path.join(ROOT, 'LICENSE'),
  ...skillFiles,
];
for (const file of docFiles) {
  if (fs.existsSync(file)) {
    scanLines(file, [emDashRule]);
  }
}

const skillEntry = path.join(ROOT, 'skills/anti-slop-formwork/SKILL.md');
if (fs.existsSync(skillEntry)) {
  const words = fs.readFileSync(skillEntry, 'utf8').trim().split(/\s+/).filter(Boolean).length;
  if (words > 500) {
    addFailure(skillEntry, 1, 'skill-word-budget', `${words} words exceeds 500 word limit`);
  }
}

const generalSrcRules = [
  emDashRule,
  { name: 'no-transition-all', regex: /\btransition-all\b|transition\s*:\s*all\b/i },
];

const nonTestSrcRules = [
  { name: 'no-bold-weight', regex: /font-weight\s*:\s*(?:[7-9]\d{2}|bold|bolder)\b/i },
  { name: 'no-thin-weight', regex: /font-weight\s*:\s*(?:[1-3]00|lighter)\b/i },
  { name: 'no-bold-style', regex: /fontWeight\s*:\s*['"]?(?:[7-9]\d{2}|bold)\b/ },
  { name: 'no-thin-style', regex: /fontWeight\s*:\s*['"]?[1-3]00\b/ },
  { name: 'no-strong-or-b-tag', regex: /<\/?(?:strong|b)(?:\s|>)/ },
  { name: 'no-middle-dot', regex: /\u00b7/ },
  { name: 'no-cta-arrow', regex: /\u2192/ },
  { name: 'no-uppercase-transform', regex: /text-transform\s*:\s*uppercase\b/i },
  {
    name: 'no-layout-transition',
    regex:
      /transition(?:-property)?\s*[:=-][^;\n'"]*\b(?:width|height|margin|padding|top|left)\b|transition-\[[^\]]*\b(?:width|height|margin|padding|top|left)\b[^\]]*\]/i,
  },
  {
    name: 'no-ai-cliche-copy',
    regex: /\b(game-changer|cutting-edge|revolutionize|solusi inovatif|transformasi digital)\b/i,
  },
  { name: 'no-eval', regex: /\beval\s*\(/ },
  { name: 'no-new-function', regex: /\bnew\s+Function\b/ },
  { name: 'no-console-log', regex: /\bconsole\.log\s*\(/ },
];

const componentColorAndTwRules = [
  {
    name: 'no-hardcoded-hex',
    regex: /(?<!&)#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/,
  },
  { name: 'no-hardcoded-rgb', regex: /\brgba?\s*\(/i },
  { name: 'no-hardcoded-oklch', regex: /\boklch\s*\(/i },
  { name: 'no-tw-bold', regex: /\bfont-(?:bold|extrabold|black)\b/ },
  { name: 'no-tw-thin', regex: /\bfont-(?:thin|extralight|light)\b/ },
  { name: 'no-tw-v3-var-syntax', regex: /\b(?:bg|text|border|ring|fill|stroke|duration|ease)-\[var\(/ },
  {
    name: 'no-tw-raw-palette',
    regex:
      /\b(?:bg|text|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/,
  },
  { name: 'no-tw-uppercase', regex: /className=[^\n]*\buppercase\b/ },
  { name: 'no-tw-shadow-slop', regex: /\bshadow-(?:lg|xl|2xl)\b/ },
];

for (const file of srcFiles) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const isTest = rel.includes('__tests__/');
  const isComponent = rel.startsWith('src/components/') || rel === 'src/App.tsx';

  scanLines(file, generalSrcRules);
  if (!isTest) {
    scanLines(file, nonTestSrcRules);
  }
  if (isComponent && !isTest) {
    scanLines(file, componentColorAndTwRules);
    scanNonSemanticClicks(file);
  }
}

if (failures.length > 0) {
  process.stderr.write(`Design rule check failed (${failures.length} violations):\n`);
  for (const item of failures) {
    process.stderr.write(`  - ${item}\n`);
  }
  process.exit(1);
}

process.stdout.write(`Design rules passed (${srcFiles.length} src files + ${docFiles.length} docs checked).\n`);
