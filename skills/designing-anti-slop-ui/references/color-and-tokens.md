# Color Palette, OKLCH Harmony, and Tailwind v4 Tokens

## 1. Perceptually Uniform OKLCH Foundation

Never build UI palettes on raw HSL, HEX, or arbitrary utility shades (`bg-blue-500`, `text-slate-600`). Use OKLCH (`oklch(L C H)`) inside `:root` and `.dark` in `src/styles/tokens.css`, where equal Lightness (`L`) guarantees equal human-perceived contrast across hues:

- **Tinted neutrals (never pure `#000000`):** Anchor light and dark neutral grounds around a calm cool hue (`H = 264`, low Chroma `C = 0.003` to `0.010`) so backgrounds feel cohesive instead of stark chalk-on-pitch-black.
- **60-30-10 visual budget:** Keep 60% neutral grounds (`--color-bg`, `--color-surface`), 30% ink and `1px` structural hairlines (`--color-fg`, `--color-muted`, `--color-border`), and reserve at most 10% for `--color-accent` (focus rings, selection, active handles, primary highlights) and semantic alerts.
- **Readable AA contrast floor (`Delta L >= 0.50`):** Maintain at least `0.50` OKLCH Lightness separation between body/secondary text and its surface (`>= 4.5:1` WCAG AA), and `>= 3:1` for UI borders and graphical indicators.

| Token | Light (`:root`) | Dark (`.dark`) | Role |
| :--- | :--- | :--- | :--- |
| `--color-bg` | `oklch(0.985 0.003 264)` | `oklch(0.145 0.006 264)` | Primary page canvas |
| `--color-surface` | `oklch(0.968 0.004 264)` | `oklch(0.185 0.007 264)` | Input wells, nested panels |
| `--color-surface-2` | `oklch(0.938 0.006 264)` | `oklch(0.235 0.008 264)` | Tab rails, hover rows, troughs |
| `--color-fg` | `oklch(0.205 0.008 264)` | `oklch(0.955 0.004 264)` | Primary ink, solid monochrome CTA fill |
| `--color-muted` | `oklch(0.470 0.008 264)` | `oklch(0.720 0.008 264)` | Secondary labels, table headers |
| `--color-subtle` | `oklch(0.530 0.007 264)` | `oklch(0.640 0.008 264)` | Captions, metadata, timestamps |
| `--color-border` | `oklch(0.885 0.006 264)` | `oklch(0.285 0.008 264)` | Hairline structural dividers |
| `--color-accent` | `oklch(0.54 0.16 var(--accent-hue))` | `oklch(0.72 0.13 var(--accent-hue))` | Focus rings, selection, active handle |
| `--color-accent-fg` | `oklch(0.985 0.003 264)` | `oklch(0.145 0.006 264)` | High-contrast ink over accent fills |

## 2. Mathematical OKLCH Color Harmony

Drive `--accent-hue` (default `268` Indigo) cleanly and compute harmonious sibling tokens by holding Lightness (`L = 0.56` light / `0.72` dark) and Chroma (`C = 0.14` light / `0.12` dark) steady while stepping `H`:

- **Monochrome + 1 Accent (default UI rule):** Neutral grounds carry structure; one accent hue marks interactive intent.
- **Analogous (`H - 32 deg`, `H + 32 deg`):** Smooth companion hues (`--color-harmony-analog-prev`, `--color-harmony-analog-next`) for trend overlays and subtle hover families.
- **Split-Complementary (`H + 150 deg`, `H + 210 deg`):** Distinct yet balanced contrast pairs (`--color-harmony-split-a`, `--color-harmony-split-b`) for two-variable comparisons.
- **Complementary (`H + 180 deg`):** Direct opposite hue (`--color-harmony-comp`) reserved strictly for rare focal contrast markers.

## 3. Dark Mode & Semantic State Parity

- **Surface elevation without white drop shadows:** Light mode uses subtle tinted surfaces (`0.968` on `0.985`) and `1px` borders; Dark mode steps UP in luminance per tier (`0.145` base -> `0.185` card -> `0.235` hover/rail) with crisp `10%` white glass hairlines (`--color-glass-border`).
- **Tinted soft surfaces:** Generate semantic backgrounds (`--color-surface-accent`, `--color-surface-success`, `--color-surface-warning`, `--color-surface-error`, `--color-surface-info`) via `color-mix(in oklch, <token> 11%, transparent)` in `:root` (`14%` in `.dark`) so alerts blend without neon patches.
- **Tailwind v4 consumption rule:** Map every variable inside `@theme inline` and scope utilities with `@import 'tailwindcss' source("../");` so docs or scripts never leak dead rules into production CSS. Components use paren syntax (`bg-(--color-surface)`, `text-(--color-fg)`, `border-(--color-border)`).
