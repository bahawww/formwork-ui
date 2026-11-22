import fs from 'node:fs';
import path from 'node:path';

const targetArg = process.argv[2];
const TARGET_ROOT = targetArg ? path.resolve(process.cwd(), targetArg) : process.cwd();

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.next',
  'build',
  'out',
  'coverage',
  '.vite',
  '.turbo',
  '__tests__',
  'skills',
  '.agents',
  '.claude',
  'scripts',
]);

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.scss']);
const TOKEN_STYLESHEETS = new Set(['tokens.css', 'globals.css', 'theme.css', 'variables.css']);

function walkSourceFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      results.push(...walkSourceFiles(full));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SOURCE_EXTENSIONS.has(ext)) continue;
      if (/\.(?:test|spec)\.[jt]sx?$/i.test(entry.name)) continue;
      results.push(full);
    }
  }
  return results;
}

function collectFiles(root) {
  const candidateDirs = ['src', 'app', 'components', 'pages']
    .map((sub) => path.join(root, sub))
    .filter((subPath) => fs.existsSync(subPath) && fs.statSync(subPath).isDirectory());

  if (candidateDirs.length === 0) {
    return walkSourceFiles(root);
  }

  const seen = new Set();
  const collected = [];
  for (const dir of candidateDirs) {
    for (const file of walkSourceFiles(dir)) {
      if (!seen.has(file)) {
        seen.add(file);
        collected.push(file);
      }
    }
  }
  return collected;
}

const failures = [];

function addFailure(file, lineNum, rule, snippet) {
  const rel = path.relative(TARGET_ROOT, file) || path.basename(file);
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
    if (match[0].includes('data-backdrop')) continue;
    const lineNum = text.slice(0, match.index).split('\n').length;
    addFailure(file, lineNum, 'no-non-semantic-click', match[0].split('\n')[0] ?? match[0]);
  }
}

const GENERAL_RULES = [
  { name: 'no-em-dash', regex: /\u2014/ },
  { name: 'no-transition-all', regex: /\btransition-all\b|transition\s*:\s*all\b/i },
  {
    name: 'no-layout-transition',
    regex:
      /transition(?:-property)?\s*[:=-][^;\n'"]*\b(?:width|height|margin|padding|top|left)\b|transition-\[[^\]]*\b(?:width|height|margin|padding|top|left)\b[^\]]*\]/i,
  },
  { name: 'no-bold-weight', regex: /font-weight\s*:\s*(?:[5-9]\d{2}|bold)\b/i },
  { name: 'no-bold-style', regex: /fontWeight\s*:\s*['"]?(?:[5-9]\d{2}|bold)\b/ },
  { name: 'no-strong-or-b-tag', regex: /<\/?(?:strong|b)(?:\s|>)/ },
  { name: 'no-middle-dot', regex: /\u00b7/ },
  { name: 'no-cta-arrow', regex: /\u2192/ },
  { name: 'no-uppercase-transform', regex: /text-transform\s*:\s*uppercase\b/i },
  {
    name: 'no-ai-cliche-copy',
    regex: /\b(game-changer|cutting-edge|revolutionize|solusi inovatif|transformasi digital)\b/i,
  },
  { name: 'no-eval', regex: /\beval\s*\(/ },
  { name: 'no-new-function', regex: /\bnew\s+Function\b/ },
  { name: 'no-console-log', regex: /\bconsole\.log\s*\(/ },
  { name: 'no-tw-bold', regex: /\bfont-(?:medium|semibold|bold|extrabold|black)\b/ },
  { name: 'no-tw-v3-var-syntax', regex: /\b(?:bg|text|border|ring|fill|stroke|duration|ease)-\[var\(/ },
  {
    name: 'no-tw-raw-palette',
    regex:
      /\b(?:bg|text|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/,
  },
  { name: 'no-tw-uppercase', regex: /className=[^\n]*\buppercase\b/ },
  { name: 'no-tw-shadow-slop', regex: /\bshadow-(?:lg|xl|2xl)\b/ },
];

const COLOR_LITERAL_RULES = [
  {
    name: 'no-hardcoded-hex',
    regex: /(?<!&)#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/,
  },
  { name: 'no-hardcoded-rgb', regex: /\brgba?\s*\(/i },
  { name: 'no-hardcoded-oklch', regex: /\boklch\s*\(/i },
];

const files = collectFiles(TARGET_ROOT);

for (const file of files) {
  const base = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  const isTokenSheet = TOKEN_STYLESHEETS.has(base);
  const isUiMarkup = ext === '.tsx' || ext === '.jsx';

  scanLines(file, GENERAL_RULES);

  if (!isTokenSheet && (isUiMarkup || ext === '.css' || ext === '.scss')) {
    scanLines(file, COLOR_LITERAL_RULES);
  }
  if (isUiMarkup) {
    scanNonSemanticClicks(file);
  }
}

if (failures.length > 0) {
  process.stderr.write(`Anti-slop check failed (${failures.length} violations):\n`);
  for (const item of failures) {
    process.stderr.write(`  - ${item}\n`);
  }
  process.exit(1);
}

process.stdout.write(`Anti-slop check passed (${files.length} files verified in ${TARGET_ROOT}).\n`);
