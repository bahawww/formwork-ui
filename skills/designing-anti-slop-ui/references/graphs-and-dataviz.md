# Anti-Slop Graphs and Data Visualization Rules

## 1. Graphical Integrity (Edward Tufte First)

- **Lie Factor = 1.0:** Graphical sizes MUST remain proportional to numeric quantities.
  - **Bar charts MUST start at `Y = 0`:** Never truncate a bar chart baseline to exaggerate minor deltas (`BarComparisonChart` enforces `min = 0`).
  - **Disclose zoomed line scales:** When a continuous `AreaTrendChart` zooms to show subtle fluctuation (`startAtZero = false`), show an explicit `Zoomed Y-axis` disclosure badge in the header.
- **Maximize Data-Ink Ratio:** Every SVG stroke must encode data.
  - Use subtle `1px` horizontal gridlines (`--color-border`, `65%` opacity) only. Delete vertical gridlines, inner box cages, beveled bars, and drop-shadow chart frames.

## 2. Chart Type Selection & Replacing Chartjunk

| Task | Anti-Slop Chart | What to Ban |
| :--- | :--- | :--- |
| Trend across time (1 to 3 series) | `AreaTrendChart` (subtle `0.14 -> 0` primary fill + direct end labels) | Multi-glow neon splines, stacked rainbows (`> 4` lines) |
| Magnitude comparison (4 to 10 items) | `BarComparisonChart` (vertical, or horizontal for long labels) | 3D cylinder bars, rotated 45-deg X-axis labels |
| Part-to-whole shares | `DistributionBar` (proportional bar + `tabular-nums` % ledger) | Pie charts with `> 3` slices or thick multi-ring donuts |
| Compact inline KPI trajectory | `Sparkline` inside `StatStrip` | Decorative wave illustrations behind KPI numbers |

## 3. OKLCH Color Accessibility & Interaction

- **Equal-lightness data ramp:** Define `--color-chart-1`..`--color-chart-5` in `src/styles/tokens.css` within `L = 0.54` to `0.58` (light) and `L = 0.72` to `0.76` (dark) with moderate Chroma (`0.11` to `0.16`) so series carry equal visual weight.
- **Non-color CVD redundancy:** Pair `--color-chart-*` colors with distinct SVG `strokeDasharray` patterns (`solid`, `6 3`, `2 3`, `8 3 2 3`) or numeric rank tags (`#1`, `#2`) so colorblind readers distinguish every line and segment effortlessly.
- **Calm monochrome bars with intentional focus:** Render inactive bars in `--color-border-strong` / `--color-surface-2`; reserve `--color-accent` for the highlighted or hovered/selected bar.
- **Crosshair scrubber & series isolation:** Provide a vertical dashed scrubber line, a single crisp `tabular-nums` readout bar beneath the SVG, and legend hover/toggle controls that dim non-focused series (`opacity: 0.22`) instead of hiding data silently.
- **SVG & keyboard accessibility:** Every chart SVG includes `<title>`, `<desc>`, `aria-labelledby`, `aria-describedby`, and `tabIndex={0}` `role="button"` interval targets (`Enter`/`Space` inspect).
- **Mandatory 5-state charts:** Support `default`, `loading` (`SurfaceSkeleton variant="panel"`), `empty` (`EmptyState` recovery CTA), `error` (`AlertBanner` Retry CTA), and live interaction.
