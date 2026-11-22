# Web & Dashboard Layouting, Spacing, and Concentric Cornering

## 1. Dashboard Layout Architecture (Macro -> Meso -> Micro)

Replace repetitive SaaS card stacks and heavy drop shadows with three clear structural tiers:

- **Macro (Application Shell):**
  - Left navigation rail (`224px` / `w-56` expanded, `60px` / `w-15` collapsed icon rail) on `lg` (`1024px+`); below `lg`, move navigation into a frosted `SlideOverDrawer`.
  - Sticky `56px` frosted top header (`.glass-bar`) holding `Breadcrumb`, period `SegmentedControl`, view state controls, and monochrome primary CTA.
  - Main editorial/dashboard canvas capped at `1280px` (`max-w-[1280px]`) so wide monitors stay scannable without extreme line lengths.
- **Meso (Asymmetric 12-Column Bento & Stat Strips):**
  - Place KPI metrics inside a single hairline-divided `StatStrip` (4 columns desktop, 2 columns tablet, 1 column mobile, `1px --color-border` dividers, zero drop shadows). Never ship uniform floating KPI shadow cards.
  - Compose charts and secondary summaries on an asymmetric 12-column grid (`lg:col-span-8` primary trend or data table + `lg:col-span-4` distribution ledger or regional breakdown) with uniform `16px` (`gap-4`) gutters.
- **Micro (Cells, Controls & Breakpoints):**
  - Protect flex and grid children with `min-w-0` + `.truncate` so long slugs never trigger horizontal page scroll.
  - Format aligned metrics, percentages, timestamps, and table numbers with `font-variant-numeric: tabular-nums` (`.tabular`).
  - Test across `320px` (mobile stack), `768px` (tablet `2x2` stat strip + stacked bento), `1024px` (collapsed/expanded rail + `8/4` bento), and `1440px+` (`1280px` centered canvas).

## 2. Margin, Padding & Law of Proximity (4px/8px Grid)

All padding, gaps, and margins follow the `--space-1` (`4px`)..`--space-12` (`48px`) scale:

- **Proximity invariant:** Internal element spacing MUST be tighter than container padding, and section gaps MUST be at least `2x` card padding (`inner gap <= card padding` and `section gap >= 2 * card padding`).
  - Inside controls / segmented rails: `2px` to `4px` (`gap-0.5` / `gap-1`).
  - Between icon and label: `6px` to `8px` (`gap-1.5` / `gap-2`).
  - Card & Bento panel inner padding: `16px` or `20px` (`p-4` / `p-5`) matching `16px` (`gap-4`) bento gutters.
  - Page section rhythm: `24px` to `40px` (`gap-6` to `gap-10`).
- **Table cell density:** Toggle cleanly between comfortable (`py-3 px-3`) and compact (`py-2 px-3`) with sticky-header alignment and horizontal scroll wrappers for narrow screens.

## 3. Concentric Corner Geometry & Restrained Blur

Every nested container maintains concentric arcs so corners never pinch diagonally:

```text
R_inner = max(4px, R_outer - padding - border_width)
```

| Layer | Token | Radius | Common Pairing |
| :--- | :--- | :--- | :--- |
| Nested active tab / checkbox / row highlight | `--radius-xs` (`rounded-xs`) | `6px` | Inside `10px` rail (`4px` pad) or `14px` menu (`8px` pad) |
| Compact tooltip / status chip | `--radius-sm` (`rounded-sm`) | `8px` | Inside `14px` panel or `16px` toolbar |
| Buttons, text inputs, switches, select trigger | `--radius-md` (`rounded-md`) | `10px` | Inside `20px` modal/card (`10px` pad) |
| Cards, dropdown portals, toasts, banners | `--radius-lg` (`rounded-lg`) | `14px` | Macro Bento module container |
| Modals, slide-over sheets, login frame | `--radius-xl` (`rounded-xl`) | `20px` | Top-level floating sheet or workspace frame |

- Apply `.squircle-corners` on rectangular shells and `.squircle` (pill `9999px`) strictly on avatars, badges, switches, and status dots.
- Use `.glass-bar` (`16px` blur, `76%-78%` opacity) only on sticky headers/bars, `.glass-surface` (`24px` blur, `86%-88%` opacity) only on floating menus, toasts, drawers, modals, and login sheets, and `.glass-backdrop` (`8px` blur) only on scrims, always paired with `@media (prefers-reduced-transparency: reduce)`.
