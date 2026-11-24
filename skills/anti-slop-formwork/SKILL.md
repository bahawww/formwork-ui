---
name: anti-slop-formwork
description: Use when building, redesigning, or reviewing web UI, dashboards, charts, login or settings pages, React components, or Tailwind CSS design systems where output risks looking like generic AI or SaaS card slop.
user-invocable: true
argument-hint: "[component, page, or dashboard task]"
---

# Designing Anti-Slop UI

## Overview

Design calm, tactile web interfaces: OKLCH harmony, Macro-Meso-Micro layouts, concentric cornering, Tufte dataviz, compositor-safe springs, Tailwind CSS v4 tokens.

Invoked via `/anti-slop-formwork` with `$ARGUMENTS`: apply the six-pillar contract below to that target.

## New-Project Bootstrap

- Copy `assets/tokens.css` and `assets/motionTokens.ts` when a workspace lacks tokens.
- Before reporting completion, verify UI code: `node scripts/check-rules.mjs [target-dir]` from this skill directory.

## Six-Pillar Contract

1. **OKLCH Color Palette & Harmony (`references/color-and-tokens.md`):**
   - Author light (`:root`) and `.dark` OKLCH tokens: tinted neutral grounds (never `#000000`), `60-30-10` budget, text lightness delta `Delta L >= 0.50`.
   - Drive `--accent-hue` (`Monochrome + 1`, Analogous `+/- 32 deg`, Split-Complementary `+150 / +210 deg`); `--color-fg` fills solid CTAs, `--color-accent` marks focus, selection, active handles.
   - Consume tokens via Tailwind v4 `@theme inline` and `bg-(--color-*)`, never `bg-[var(...)]`, hardcoded literals, or raw utilities (`bg-blue-500`).
2. **Web & Dashboard Layouting (`references/layout-spacing-corners.md`):**
   - Structure Macro -> Meso -> Micro: `224px` / `60px` rail (`SlideOverDrawer` below `lg`), `56px` frosted `.glass-bar`, `1280px` max stage, hairline `StatStrip` (zero shadow KPI cards), and asymmetric 12-col bento (`8/4` or `7/5`).
   - Enforce `min-w-0`, `tabular-nums`, `320px` to `1440px+` parity, and 5 states (`default`, `loading` skeleton, `empty` CTA, `error` Retry banner, `success`).
3. **Margin, Padding & Concentric Cornering (`references/layout-spacing-corners.md`):**
   - `4px`/`8px` grid, Law of Proximity (`inner gap <= card padding`, `section gap >= 2x card padding`).
   - Apply `R_inner = max(4px, R_outer - padding - border)` across `6px -> 8px -> 10px -> 14px -> 20px` with `.squircle-corners`; limit `.glass-*` blur to floating layers with `prefers-reduced-transparency`.
4. **Anti-Slop Graphs (`references/graphs-and-dataviz.md`):**
   - Keep Lie Factor `1.0` (`Y = 0` bars; disclose zoomed line axes), `1px` hairlines only, `--color-chart-1..5` + dash patterns, direct labels, keyboard crosshairs, ranked bars over pie charts (`> 3` slices).
5. **Spring Motion (`references/motion-and-animation.md`):**
   - One signature spring (`fast`, `press`, `moderate`, `settle`), `< 300ms` (exits 20% faster), animate ONLY `transform`, `opacity`, `clip-path`, `filter`, check `useReducedMotion()`.
6. **Typography, A11y & Prose (`references/audit-and-critique-checklist.md`):**
   - Use the `400`/`500`/`600` weight ladder (body, titles, KPI figures), zero em dashes (`U+2014`), plain verb-matched copy, semantic `<button>`/`<a>`/`<input>`, `>= 44px` hit targets, and `useFocusTrap`.

## Focus & Framing (`references/focus-framing-and-reveal.md`)

Read before any hero, bento, or card grid: one idea per view, one accent, one dominant number, cards clean at rest, every animation caused, five failure modes (too much, wireframe, boxed, flat, bland).

## Bans, Allowance & Proof (`references/ban-list-allowance-and-proof.md`)

Bans beat praise. Closed token allowance only, never start from zero, motion frequency ladder, screenshot proof (light, dark, 390px), deletion pass last.

## Red Flags (Fix Immediately)

Never ship `font-light`/`font-bold`/`font-black`/`<strong>`, `shadow-lg`/`xl`/`2xl`, multi-slice pie charts, clickable `<div>`/`<span>`/`<tr>`, `transition-all` or `width`/`height` transitions, or raw hex/palette classes, or the five failure modes above. Never ship gradient text, glow, buzzword copy, all caps eyebrow labels, or unproven done claims.
