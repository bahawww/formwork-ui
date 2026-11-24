import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { TactileButton } from '../ui';

const SPRING_PRESETS = [
  {
    name: 'springs.fast',
    config: springs.fast,
    spec: 'stiffness 400, damping 30, mass 0.8',
    use: 'Menus, tooltips, checkmark draw, slider thumb',
  },
  {
    name: 'springs.press',
    config: springs.press,
    spec: 'stiffness 700, damping 32, mass 1.0',
    use: 'Button tactile compress scale(0.97) on pointer down',
  },
  {
    name: 'springs.moderate',
    config: springs.moderate,
    spec: 'stiffness 300, damping 24, mass 1.0',
    use: 'Inline card reveals & expandable sections',
  },
  {
    name: 'springs.settle',
    config: springs.settle,
    spec: 'stiffness 260, damping 26, mass 1.0',
    use: 'Tab pill glide, drawer slide, toast arrival',
  },
] as const;

const DURATION_LADDER = [
  { band: 'Micro-feedback', timing: '80ms to 120ms', examples: 'Button color/border fade, checkmark tick, switch toggle' },
  { band: 'Standard controls', timing: '150ms to 220ms', examples: 'SelectMenu portal, Tooltip pop, DropdownMenu' },
  { band: 'Sheets & modals', timing: '220ms to 300ms', examples: 'ConfirmDialog, CommandPalette, SlideOverDrawer' },
  { band: 'Exit rule', timing: '20% faster than enter', examples: 'Overlays settle away rapidly so workflow never lags' },
] as const;

export function AnimationMotionRules() {
  const [toggled, setToggled] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-[16px] font-title text-(--color-fg)">Interactive spring physics lab</h2>
            <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
              One signature spring moment per component. Triggers interrupt smoothly if reversed mid-flight.
            </p>
          </div>
          <TactileButton variant="solid" size="sm" onClick={() => setToggled((prev) => !prev)}>
            Replay springs
          </TactileButton>
        </div>

        <div className="flex flex-col gap-3">
          {SPRING_PRESETS.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-1 gap-2 rounded-md squircle-corners border border-(--color-border) bg-(--color-surface) p-3.5 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-5">
                <div className="font-mono text-[12px] text-(--color-fg)">{item.name}</div>
                <div className="text-[11px] text-(--color-muted)">{item.spec}</div>
                <div className="mt-0.5 text-[11px] text-(--color-subtle)">{item.use}</div>
              </div>

              <div className="relative h-8 rounded-sm squircle-corners border border-(--color-border) bg-(--color-bg) px-1.5 flex items-center md:col-span-7">
                <motion.div
                  animate={{ x: toggled ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : item.config}
                  className="size-5 rounded-xs squircle-corners bg-(--color-accent)"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-5">
          <h3 className="m-0 text-[15px] font-title text-(--color-fg)">Compositor allowlist (GPU 60fps)</h3>
          <p className="m-0 text-[13px] text-(--color-muted)">
            Animate ONLY transform, opacity, clip-path, and filter (plus fast border or color fades). Never animate box dimensions, offsets, or blanket all-property transitions.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-5">
          <h3 className="m-0 text-[15px] font-title text-(--color-fg)">Width-stable state swaps</h3>
          <p className="m-0 text-[13px] text-(--color-muted)">
            Mount idle and active states in the same 1x1 CSS grid cell (ClipboardButton, TactileButton loading) and crossfade opacity so neighbors never jitter.
          </p>
        </section>
      </div>

      <div className="overflow-x-auto rounded-lg squircle-corners border border-(--color-border)">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Element scale</th>
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Duration ceiling (&lt; 300ms)</th>
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Applied surfaces</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {DURATION_LADDER.map((row) => (
              <tr key={row.band}>
                <td className="px-4 py-3 text-(--color-fg)">{row.band}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-(--color-fg)">{row.timing}</td>
                <td className="px-4 py-3 text-(--color-muted)">{row.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
