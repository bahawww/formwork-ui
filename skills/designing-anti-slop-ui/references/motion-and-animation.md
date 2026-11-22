# Animation, Spring Physics, and Motion Hygiene

## 1. One Signature Motion Moment & Restraint

Great interface motion feels crisp, physical, and interruptible without slowing daily tasks:

- Assign **one signature motion moment** per component (e.g., `TabsSubtle` spring pill glide, `SpringCheckbox` checkmark path draw, `TactileButton` subtle press). Keep surrounding surfaces calm.
- Eliminate decorative bounce loops, floating parallax cards, and gratuitous icon spins on static headers.

## 2. Spring Physics Tokens (`src/lib/motionTokens.ts`)

Use physically tuned springs in `motion/react` so rapid user clicks mid-animation reverse momentum smoothly instead of snapping:

| Token | Physics | Primary Role |
| :--- | :--- | :--- |
| `springs.fast` | `stiffness: 400, damping: 30, mass: 0.8` | Dropdowns, tooltips, accordion chevrons, checkmarks, slider handle |
| `springs.press` | `stiffness: 700, damping: 32, mass: 1` | Immediate pointer-down compression (`scale: 0.97, y: 1`) |
| `springs.moderate` | `stiffness: 300, damping: 24, mass: 1` | Panel reveals and stateful swaps |
| `springs.settle` | `stiffness: 260, damping: 26, mass: 1` | Shared `layoutId` tab pills, toasts, progress `scaleX`, slide-over sheets |

## 3. `< 300ms` Duration Ladder & Easing

- **Micro-interactions (hover tints, borders, color fades):** `80ms` to `120ms` (`--motion-dur-fast`).
- **Standard UI controls (menus, tooltips, popovers):** `150ms` to `220ms` (`--motion-dur-base`).
- **Sheets, drawers, modals:** `220ms` to `300ms` (`--motion-dur-slow`).
- **Exit 20% faster than enter:** Dismissing a dialog or toast exits slightly brisker than entering so attention returns immediately to content.
- **Easing:** Use `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-out`) for entrances and responses; `cubic-bezier(0.65, 0, 0.35, 1)` (`ease-in-out`) for crossfade state swaps; never use `ease-in` for UI entrances.

## 4. GPU-Only Properties & Layout Stability

- **Compositor allowlist:** Animate ONLY `transform` (`translate`, `scale`, `rotate`), `opacity`, `clip-path`, and `filter` (plus fast border/color state fades).
- **Banned properties:** NEVER write `transition: all`, `transition-all`, or animate layout metrics (`width`, `height`, `margin`, `padding`, `top`, `left`). For progress meters, animate `transform: scaleX(...)` with `origin-left` instead of `width`!
- **Width-stable state swaps:** Keep idle and active layers mounted inside a `1x1` CSS grid cell (e.g., `ClipboardButton` `.nx-swap-grid`, `TactileButton` `loading` mode) so buttons never jump horizontally when text switches.
- **Pointer focus hygiene:** Custom interactive widgets (`TabsSubtle`, `RadioGroup`, `SegmentedControl`, sliders) call `event.preventDefault()` on `onPointerDown` so mouse clicks do not flash keyboard `:focus-visible` outlines.
- **Stagger discipline:** If revealing sequential elements, cap per-item delay at `<= 30ms` and total stagger duration at `<= 200ms`.
- **Dual reduced-motion:** Pair JS `useReducedMotion()` (`motion/react`) with `@media (prefers-reduced-motion: reduce)` CSS collapse and clean up all timers and animations on unmount.
