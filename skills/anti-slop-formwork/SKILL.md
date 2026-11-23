---
name: anti-slop-formwork
description: Use when building, redesigning, or reviewing web UI, dashboards, charts, login or settings pages, React components, or Tailwind CSS design systems where output risks looking like generic AI templates or SaaS card slop.
user-invocable: true
argument-hint: "[component, page, or dashboard task]"
---

# Designing Anti-Slop UI

## Overview

Design calm, tactile web interfaces combining fluid precision and editorial restraint across OKLCH color harmony, Macro-Meso-Micro layouts, concentric cornering, Tufte dataviz, compositor-safe springs, and Tailwind CSS v4 tokens.

When invoked via `/anti-slop-formwork` with `$ARGUMENTS`, apply the six-pillar contract below to that target.

## New-Project Bootstrap

- Copy `assets/tokens.css` and `assets/motionTokens.ts` when a workspace lacks design tokens.
- Verify finished UI code before reporting completion by running `node scripts/check-rules.mjs [target-dir]` from this skill directory.

## Six-Pillar Contract

1. **OKLCH Color Palette & Harmony (`references/color-and-tokens.md`):**
   - Author light (`:root`) and `.dark` tokens in OKLCH, keeping tinted neutral grounds (never `#000000`), a `60-30-10` budget, and text lightness delta `Delta L >= 0.50`.
   - Drive `--accent-hue` (`Monochrome + 1`, Analogous `+/- 32 deg`, Split-Complementary `+150 / +210 deg`), keeping `--color-fg` on solid CTAs and `--color-accent` on focus rings, selection, and active handles.
   - Consume tokens via Tailwind v4 `@theme inline` and `bg-(--color-*)`, never `bg-[var(...)]`, hardcoded literals, or raw utilities (`bg-blue-500`).
2. **Web & Dashboard Layouting (`references/layout-spacing-corners.md`):**
   - Structure Macro -> Meso -> Micro: `224px` / `60px` rail (`SlideOverDrawer` below `lg`), `56px` frosted `.glass-bar`, `1280px` max stage, hairline `StatStrip` (zero shadow KPI cards), and asymmetric 12-col bento (`8/4` or `7/5`).
   - Enforce `min-w-0`, `tabular-nums`, `320px` to `1440px+` parity, and 5 states (`default`, `loading` skeleton, `empty` CTA, `error` Retry banner, `success`).
3. **Margin, Padding & Concentric Cornering (`references/layout-spacing-corners.md`):**
   - Use the `4px`/`8px` grid with Law of Proximity (`inner gap <= card padding`, `section gap >= 2x card padding`).
   - Apply `R_inner = max(4px, R_outer - padding - border)` across `6px -> 8px -> 10px -> 14px -> 20px` with `.squircle-corners`; limit `.glass-*` blur to floating layers with `prefers-reduced-transparency`.
4. **Anti-Slop Graphs (`references/graphs-and-dataviz.md`):**
   - Keep Lie Factor `1.0` (`Y = 0` bars; disclose zoomed line axes), `1px` horizontal hairlines only, `--color-chart-1..5` + dash patterns, direct labels, keyboard crosshairs, and ranked bars over pie charts (`> 3` slices).
5. **Spring Motion (`references/motion-and-animation.md`):**
   - Assign one signature spring (`fast`, `press`, `moderate`, `settle`), `< 300ms` duration (exits 20% faster), animate ONLY `transform`, `opacity`, `clip-path`, `filter`, and check `useReducedMotion()`.
6. **Typography, A11y & Prose (`references/audit-and-critique-checklist.md`):**
   - Use regular `400` weight only, zero em dashes (`U+2014`), plain verb-matched copy, semantic `<button>`/`<a>`/`<input>`, `>= 44px` hit targets, and `useFocusTrap`.

## Focus, Framing & Reveal (Cross-Pillar, `references/focus-framing-and-reveal.md`)

Decided before the pillars are tuned, applied across all six:

- **One idea per view:** name the focal object first; everything else is a satellite and must look like one. A hero carries one idea (one countdown, one number, one chart), stripped of grid clutter, metadata footers, and duplicate links.
- **Five failure modes:** too much (real text in every cell), wireframe (stripped of what made it recognisable), boxed (a whole panel shrunk into a bordered card), flat (every object the same weight), bland (the brief's style never shows up). Check every layout against all five.
- **Framing:** decide the crop first, chrome appears once per view, satellites may straddle the hero's edge instead of stacking, and a bento grid is one picture (only a third to a half of the tiles show UI, no two adjacent tiles of the same kind).
- **Budgets:** one accent for interactive meaning, one colour moment per view, one dominant number or headline; repeated status text appears exactly once.
- **Reveal:** cards stay clean at rest (preview, title, one quiet badge); metadata and actions live in a hover or focus pill bar. Loading is a skeleton of the same geometry.
- **Motion has a cause:** every animation answers a named event; rehearse frame by frame and at phone width (a redesign, not a squeeze) before shipping.

## Red Flags (Fix Immediately)

Never ship `font-medium`/`font-semibold`/`font-bold`/`<strong>`, `shadow-lg`/`xl`/`2xl`, multi-slice pie charts, clickable `<div>`/`<span>`/`<tr>`, `transition-all` or `width`/`height` transitions, or raw hex/palette classes in components. Never ship a wall of equal-weight cards, a panel boxed inside a card inside a card, more than one accent colour in a view, or an animation nothing caused.
