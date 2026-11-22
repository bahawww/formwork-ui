# Unified Audit, Reusable Kit, and Critique Checklist

Run through every axis before marking any web UI task complete.

## 1. Design Critique (5 Axes)

- **2-second impression:** Is the primary action or metric insight obvious without marketing fluff or decorative boxes?
- **Visual hierarchy:** Does reading order flow via type scale, OKLCH neutral contrast (`fg` -> `muted` -> `subtle`), and 4px-grid space with regular `400` weight only (zero bold weights `500+`, `font-medium`/`font-semibold`/`font-bold`, or `<strong>`)?
- **Concentric geometry & blur:** Do nested radii follow `R_inner = max(4px, R_outer - padding - border)`? Is frosted blur confined to `.glass-bar` (`16px`), `.glass-surface` (`24px`), and `.glass-backdrop` (`8px`) with `prefers-reduced-transparency` fallback?
- **Restraint:** Can at least one redundant wrapper, drop shadow, card border, or eyebrow label be deleted?
- **Parity:** Checked across light (`:root`) and dark (`.dark`), accent hue presets, and `320px`, `768px`, `1024px`, `1440px`?

## 2. Reusable Kit, Chart, and Template Inventory

Reuse these owned components before inventing custom one-off markup:

- **Actions & Form Primitives (`src/components/ui/`):** `TactileButton` (with width-locked `loading`), `ClipboardButton`, `TextField`, `SearchInput`, `PasswordInput`, `TextArea`, `SelectMenu`, `SegmentedControl`, `TabsSubtle`, `RadioGroup`, `SpringSwitch`, `SpringCheckbox`, `TactileSlider`, `Kbd`.
- **Navigation, Feedback & Overlays (`src/components/ui/`):** `Breadcrumb`, `DropdownMenu`, `SlideOverDrawer`, `CommandPalette`, `ConfirmDialog`, `Tooltip`, `ToastProvider` / `useToast`, `Accordion`, `ProximityList`, `AlertBanner`, `ProgressBar`, `Badge`, `Avatar`, `StatStrip`, `DataTable`, `Pagination`, `SurfaceCard`, `SurfaceSkeleton`, `EmptyState`, `Divider`.
- **Anti-Slop Charts (`src/components/charts/`):** `AreaTrendChart`, `BarComparisonChart`, `DistributionBar`, `Sparkline`.
- **Full-Page Templates (`src/components/patterns/`):** `DashboardTemplate` (`DashboardShell` + telemetry + table + inspector), `LoginPage` (frosted glass auth + reset), `SettingsTemplate` (two-column editorial settings).

## 3. WCAG 2.1 AA Accessibility Audit

- **Perceivable:** Text `Delta L >= 0.50` (`>= 4.5:1` contrast) and `>= 3:1` UI graphics; state paired with icons, text, or dash patterns (zero color-only meaning); SVGs carry `<title>` or `aria-hidden="true"`.
- **Operable:** Top skip link (`#main-content`), semantic `<button>`/`<a>`/`<input>` everywhere (never clickable `<div>`/`<span>` or `<tr onClick>`), roving arrow keys in tablists/radiogroups, `>= 44px` hit targets, `useFocusTrap` in portals.
- **Understandable & Robust:** `<label>` on every field, inline error recovery messages, `aria-live="polite"` feedback, clean wrapping and overflow control down to `320px`.

## 4. Automated Finish Gate

- Zero em dashes (`U+2014`), zero middle dots (`U+00B7`), zero CTA arrows (`U+2192`), zero `transition: all` or layout transitions (`width`, `height`, `margin`, `padding`, `top`, `left`), zero `shadow-lg`/`xl`/`2xl`, zero `bg-[var(...)]` or raw palette shades, zero `as` casts or `console.log`.
- Run and verify exit `0`: `npm run check:rules && npm run typecheck && npm test && npm run build`.
