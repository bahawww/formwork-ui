# Unified Audit, Reusable Kit, and Critique Checklist

Run through every axis before marking any web UI task complete.

## 1. Design Critique (5 Axes)

- **2-second impression:** Is the primary action or metric insight obvious without marketing fluff or decorative boxes?
- **Visual hierarchy:** Does reading order flow via type scale, OKLCH neutral contrast (`fg` -> `muted` -> `subtle`), and 4px-grid space with the three-weight ladder: `400` body, `500` (`font-medium`) titles and buttons, `600` (`font-semibold`) page titles and KPI figures only (zero thin `100`-`300` or heavy `700+` weights, `font-light`/`font-bold`/`font-black`, or `<strong>`)?
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

## 4. Focus, Framing & Reveal Audit (`references/focus-framing-and-reveal.md`)

- **One idea:** Can the focal object be named in one phrase? Does the hero carry exactly one idea, with no grid clutter, metadata footer, or duplicate link competing with it?
- **Weight ladder:** At most three visual weight levels (hero, satellite, hairline list)? No two adjacent sections at the same weight by accident, and no wall of equal-weight cards?
- **Five failure modes:** Checked against too much, wireframe, boxed, flat, and bland, with the fix applied, not just noted?
- **Framing:** Crop decided before content, chrome appears once, satellites straddle or butt against the hero instead of stacking in even rows, bento reads as one picture (a third to a half of tiles show UI, no adjacent same-kind tiles)?
- **Budgets:** Exactly one accent and one colour moment in the view, one dominant number or headline, and any repeated status sentence appears exactly once?
- **Reveal:** Card faces clean at rest (preview, title, one quiet badge), with metadata and actions only in the hover or focus pill bar, and loading shown as a skeleton of the same geometry?
- **Motion cause:** Every animation names its triggering event, moved objects travel instead of fading, loops end where they began, and the sequence was rehearsed frame by frame plus at phone width?

## 5. Ban List, Allowance & Proof Audit (`references/ban-list-allowance-and-proof.md`)

- **Rules file read:** Was the project rules file (Never and Always lists) opened before the UI was touched, and does every new tell found in this draft get added to it as a new line with its reason?
- **Tells scan:** Draft scanned top to bottom against the recurring tells: gradients or gradient text, glow, sparkle emoji headline, all caps eyebrow labels, buzzword copy, three feature cards with icons in circles, avatar stacks fanning on hover, coloured bar on a selected row, decorative 01 02 03 numbering, green check in a circle per status, letter in a rounded square logos?
- **Allowance sheet:** Every colour a named semantic token, every size on the one type scale, every radius in the set, and nothing used that is not on the sheet (or the sheet was extended first, with the role named)?
- **Starting point:** Was the build started from real components, the project's best screens, or reference screenshots, rather than from a blank page?
- **Frequency ladder:** Keyboard highlights instant, press 100ms, menu close 140ms, hover 150ms, menu open 200ms, panel change at most 300ms with no bounce, and no 600ms fade plus stagger anywhere?
- **Proof loop:** Screenshots taken and checked in light, dark, and phone width (390px), including the production build, with findings fixed and the loop rerun before done was claimed?
- **Deletion pass:** A final cutting pass actually removed something (repeated subtitle, unrequested badge, second shadow, icon beside every label), or can name why each candidate earned its place?

## 6. Automated Finish Gate

- Zero em dashes (`U+2014`), zero middle dots (`U+00B7`), zero CTA arrows (`U+2192`), zero `transition: all` or layout transitions (`width`, `height`, `margin`, `padding`, `top`, `left`), zero `shadow-lg`/`xl`/`2xl`, zero `bg-[var(...)]` or raw palette shades, zero `as` casts or `console.log`.
- Run and verify exit `0`: `npm run check:rules && npm run typecheck && npm test && npm run build`.
