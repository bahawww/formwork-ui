# Formwork UI: Anti-Slop Design System, Component Kit, Charts & Agent Skill

Formwork pairs an opinionated UI design system (OKLCH color harmony, Macro-Meso-Micro dashboard layouting, Law of Proximity spacing, concentric corner geometry, restrained frosted glass blur, compositor-only spring motion, Tufte-grade visualizations, and WCAG 2.1 AA accessibility) with a reusable Tailwind CSS v4 component kit and a portable AI agent skill.

## Use This Skill with Any AI Agent

Install `designing-anti-slop-ui` directly from GitHub into Claude Code, Cursor, Codex, OpenCode, or Antigravity:

```bash
npx skills add bahawww/formwork-ui
```

Or copy the self-contained skill folder (`skills/designing-anti-slop-ui/`) into your repository's `.agents/skills/` or `.claude/skills/` directory. The skill includes:

- `SKILL.md`: compact 6-pillar contract plus red-flag guardrails (`<= 500` words)
- `references/`: deep specifications for OKLCH colors, layout/spacing/corners, spring motion, Tufte dataviz, and WCAG AA critique
- `assets/tokens.css` & `assets/motionTokens.ts`: drop-in Tailwind CSS v4 tokens and spring presets
- `scripts/check-rules.mjs`: portable zero-dependency CLI validator (`node path/to/check-rules.mjs [target-dir]`)

## What Is Inside This Workbench

- **Dashboard & Full-Page Templates (`src/components/patterns/`):**
  - `DashboardTemplate` (`DashboardShell` collapsible rail + sticky `.glass-bar` header, `StatStrip` hairline KPIs, 12-column asymmetric bento, interactive `DataTable`, slide-over inspector, and live `default` / `loading` / `empty` / `error` preview)
  - `LoginPage` (frosted surface card, Zod validation, password strength, reset view morph)
  - `SettingsTemplate` (two-column editorial settings layout with token copy and destructive confirm dialog)
- **34 Reusable UI Primitives (`src/components/ui/`):**
  `Accordion`, `AlertBanner`, `Avatar`, `Badge`, `Breadcrumb`, `ClipboardButton`, `CommandPalette`, `ConfirmDialog`, `DataTable`, `Divider`, `DropdownMenu`, `EmptyState`, `Kbd`, `Pagination`, `PasswordInput`, `ProgressBar`, `ProximityList`, `RadioGroup`, `SearchInput`, `SegmentedControl`, `SelectMenu`, `SlideOverDrawer`, `SpringCheckbox`, `SpringSwitch`, `StatStrip`, `SurfaceCard`, `SurfaceSkeleton`, `TabsSubtle`, `TactileButton`, `TactileSlider`, `TextArea`, `TextField`, `ToastProvider`/`useToast`, `Tooltip`.
- **Anti-Slop Charts (`src/components/charts/`):**
  `AreaTrendChart`, `BarComparisonChart` (vertical & horizontal), `DistributionBar`, and `Sparkline`.
- **Interactive Rule Lab (`src/components/views/DesignRulesView.tsx`):**
  Live OKLCH accent harmony presets (`--accent-hue`), interactive concentric corner calculator (`R_inner = max(4px, R_outer - padding - border)`), dashboard layout blueprint, spring physics playground, and dataviz rules.
- **Project Instructions:** `AGENTS.md` (with `CLAUDE.md` symlinked to `AGENTS.md`).

## Local Development & Verification

```bash
npm install
npm run dev
npm run check:rules
npm run typecheck
npm test
npm run build
```
