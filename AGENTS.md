# Design Language, READ FIRST

Every component, dashboard, chart, and template follows fluid precision and editorial restraint:

- **One signature motion moment per component.** Keep everything else calm.
- **Regular-weight type only.** Never use bold or heavy weights (`500+`, `font-bold`, `font-semibold`, `font-medium`, `<strong>`, `<b>`). Build hierarchy through scale, neutral contrast (`fg`, `muted`, `subtle`), and 4px-grid space.
- **No em dashes (`U+2014`).** Never write an em dash anywhere in UI copy, metadata, comments, or docs. Use commas, colons, or periods instead.
- **60-30-10 OKLCH palette & harmony.** Use tinted neutral grounds (`--color-bg`, `--color-surface`) for 60%, ink and 1px hairlines for 30%, and reserve `--color-accent` (`--accent-hue`) for focus rings, selection, active handles, and signature motion. Maintain `Delta L >= 0.50` contrast in both `:root` and `.dark`.

Before designing, building, or modifying any UI component, page, chart, or visual surface, load `skills/designing-anti-slop-ui/SKILL.md` (symlinked at `.agents/skills/designing-anti-slop-ui/SKILL.md` and `.claude/skills/designing-anti-slop-ui/SKILL.md`) and its topic references inside `references/`.

## Color Palette, Harmony & Tailwind CSS v4 (`color-and-tokens.md`)

- **Tailwind CSS v4 tokens only:** Define `@theme inline`, `:root`, `.dark`, harmony swatches (`--harmony-analog-*`, `--harmony-split-*`, `--harmony-comp`), semantic state fills (`--surface-accent/success/warning/error/info`), and chart ramps (`--chart-1`..`--chart-5`) in `src/styles/tokens.css`, scoped with `@import 'tailwindcss' source("../");` and `@layer base` resets. Consume tokens with paren syntax (`bg-(--color-surface)`, `text-(--color-fg)`), never `bg-[var(...)]`, hardcoded hex/rgb/oklch literals, raw palette utilities (`bg-blue-500`, `text-slate-500`), or `shadow-lg`/`xl`/`2xl`.
- **Theme & accent sync:** Support light and dark modes via `useSyncExternalStore` (`src/lib/theme.ts`) and dynamic OKLCH accent presets (`src/lib/accentTheme.ts`).

## Dashboard Layout, Spacing & Concentric Corners (`layout-spacing-corners.md`)

- **Macro -> Meso -> Micro dashboard shell:** Pair collapsible `224px` / `60px` desktop navigation rails (`SlideOverDrawer` below `lg`) with a sticky `56px` `.glass-bar` header and `1280px` max canvas. Render top KPIs as hairline-divided `StatStrip` bands (never soft-shadow KPI cards), compose charts on asymmetric 12-column bento splits (`lg:col-span-8` + `lg:col-span-4`), protect flex children with `min-w-0` + `.tabular`, and test across `320px`, `768px`, `1024px`, and `1440px+`.
- **Law of Proximity (4px/8px grid):** Keep internal padding strictly smaller than outer margins (`inner gap <= card padding`, `section gap >= 2x card padding`) using `--space-1`..`--space-12`.
- **Concentric cornering & glass blur:** Enforce `R_inner = max(4px, R_outer - padding - border)` across `xs: 6px`, `sm: 8px`, `md: 10px`, `lg: 14px`, `xl: 20px` with `.squircle-corners` on frames and `.squircle` on pills, avatars, and switches. Confine `.glass-bar` (`16px` blur), `.glass-surface` (`24px` blur), and `.glass-backdrop` (`8px` blur) to floating layers with `prefers-reduced-transparency` fallbacks.
- **Mandatory 5-state coverage:** Every view, chart, table, and template explicitly handles `default`, `loading` (`SurfaceSkeleton` with `aria-busy="true"`), `empty` (explanation + recovery CTA), `error` (`AlertBanner` What + Why + Retry), and `success`.

## Anti-Slop Graphs (`graphs-and-dataviz.md`)

- **Tufte integrity:** Keep Lie Factor `1.0` (bar charts strictly start at `0`; zoomed trend charts show an explicit `Zoomed Y-axis` disclosure badge). Maximize Data-Ink Ratio with `1px` horizontal hairlines only (zero vertical gridlines or box drop shadows).
- **Accessible encoding:** Replace noisy pie charts (`> 3` slices) with `DistributionBar` + `tabular-nums` % ledgers. Pair equal-lightness OKLCH chart series (`--color-chart-1..5`) with `strokeDasharray` patterns, provide direct labels, pointer + keyboard crosshair scrubbers, series isolation, and SVG `<title>`/`<desc>`.

## Motion, Animation & Interaction (`motion-and-animation.md`)

- **Spring physics & timing ladder:** Use `src/lib/motionTokens.ts` (`fast`, `press`, `moderate`, `settle`) with `motion/react`. Keep UI motions `< 300ms` (exits `20%` faster than enters) and assign at most one signature motion moment per component.
- **GPU compositor discipline:** Animate ONLY `transform`, `opacity`, `clip-path`, and `filter` (plus crisp color/border state tints). Never use `transition: all`, `transition-all`, or animate layout metrics (`width`, `height`, `margin`, `padding`, `top`, `left`). Use `scaleX` with `origin-left` for progress bars and `1x1` CSS grids for width-stable text swaps.
- **Focus, sound & reduced motion:** Call `e.preventDefault()` on custom `onPointerDown`, share one lazy `AudioContext` in `src/lib/sound.ts`, clean up timers/listeners on unmount, and check `useReducedMotion()` + `@media (prefers-reduced-motion: reduce)`.

## Reusable Kit, Accessibility (WCAG 2.1 AA) & Engineering

- **Reuse before inventing:** Compose owned primitives in `src/components/ui/` (34 components), charts in `src/components/charts/` (`AreaTrendChart`, `BarComparisonChart`, `DistributionBar`, `Sparkline`), and patterns in `src/components/patterns/` (`DashboardTemplate`, `LoginPage`, `SettingsTemplate`).
- **Accessibility & clean prose:** Provide top `#main-content` skip link, semantic `<button>`/`<a>`/inputs (zero clickable `<div>`/`<span>`/`<tr>`), `>= 44px` hit targets, `useFocusTrap` on portals, `aria-live="polite"`, plain human copy with verb-matched CTAs, and zero AI clichés or template chrome (`ALL-CAPS` eyebrows, middle dots `A · B`, `→` CTA arrows).
- **TypeScript & verification:** Strict mode (`noUncheckedIndexedAccess`), Zod validation at form boundaries, exhaustive switches, zero `as` casts (except `as const`), zero `eval`/`new Function`/`console.log`. Verify every edit with `npm run check:rules && npm run typecheck && npm test && npm run build`.
