import { useState } from 'react';
import { Badge, TactileSlider } from '../ui';

const SPACE_STEPS = [
  { token: '--space-1', px: 4, role: 'Compact gap inside segmented rails & inline chips' },
  { token: '--space-2', px: 8, role: 'Button icon gap & tight form control gaps' },
  { token: '--space-3', px: 12, role: 'Table compact cell & filter group gap' },
  { token: '--space-4', px: 16, role: 'Dense dashboard card padding & bento gutter' },
  { token: '--space-6', px: 24, role: 'Standard page container inline padding & card body' },
  { token: '--space-8', px: 32, role: 'Section separator rhythm (at least 2x card padding)' },
  { token: '--space-12', px: 48, role: 'Major editorial stage bottom & hero breathing room' },
] as const;

const DASHBOARD_SURFACE_SPEC = [
  { surface: 'App header (.top-bar-inner)', padding: '8px 24px', radius: 'Sticky edge-to-edge', gap: '12px' },
  { surface: 'Bento grid', padding: '16px to 24px canvas', radius: 'Outer 14px (lg)', gap: '16px (4 * 4px)' },
  { surface: 'Standard dashboard card', padding: '16px or 20px', radius: '14px outer -> 10px/6px inner', gap: '12px' },
  { surface: 'Modal / Login sheet', padding: '20px to 24px', radius: '20px outer -> 10px controls', gap: '16px' },
  { surface: 'Table rows (comfortable / compact)', padding: '12px / 8px vertical', radius: 'Zero outer corner clip', gap: 'Hairline dividers' },
] as const;

export function SpacingCornerRules() {
  const [outerRadius, setOuterRadius] = useState(20);
  const [paddingPx, setPaddingPx] = useState(10);
  const [borderPx, setBorderPx] = useState(1);

  const computedInner = Math.max(4, outerRadius - paddingPx - borderPx);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-5 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-[16px] font-medium text-(--color-fg)">
              Interactive concentric cornering calculator
            </h2>
            <p className="m-0 mt-1 max-w-[66ch] text-[13px] text-(--color-muted)">
              Matching nested corner curves prevents diagonal pinching. Formula: R_inner = max(4px, R_outer - padding - border).
            </p>
          </div>
          <Badge variant="dot" tone="accent" size="sm">
            R_inner = {computedInner}px
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <div className="flex flex-col gap-3 md:col-span-6">
            <TactileSlider
              label="Outer container radius"
              min={8}
              max={28}
              step={2}
              value={outerRadius}
              displayValue={`${outerRadius} px`}
              onChange={setOuterRadius}
            />
            <TactileSlider
              label="Container padding"
              min={2}
              max={16}
              step={2}
              value={paddingPx}
              displayValue={`${paddingPx} px`}
              onChange={setPaddingPx}
            />
            <TactileSlider
              label="Border stroke"
              min={0}
              max={2}
              step={1}
              value={borderPx}
              displayValue={`${borderPx} px`}
              onChange={setBorderPx}
            />
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-6 md:col-span-6">
            <div
              className="w-full max-w-xs squircle-corners bg-(--color-surface-2)"
              style={{
                borderRadius: `${outerRadius}px`,
                padding: `${paddingPx}px`,
                border: `${borderPx}px solid var(--color-border-strong)`,
              }}
            >
              <div
                className="flex min-h-24 flex-col items-center justify-center border border-(--color-accent) bg-(--color-bg) px-4 py-3 text-center squircle-corners"
                style={{ borderRadius: `${computedInner}px` }}
              >
                <span className="font-mono text-[12px] text-(--color-fg) tabular">
                  outer {outerRadius}px / inner {computedInner}px
                </span>
                <span className="mt-1 text-[11px] text-(--color-muted) tabular">
                  padding {paddingPx}px + border {borderPx}px
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <h3 className="m-0 text-[15px] font-medium text-(--color-fg)">
          4px/8px grid & Law of Proximity
        </h3>
        <p className="m-0 text-[13px] text-(--color-muted)">
          Keep internal element spacing strictly smaller than surrounding margins (inner gap &lt;= outer gap, section gap &gt;= 2x card padding).
        </p>

        <div className="flex flex-col gap-2 pt-1">
          {SPACE_STEPS.map((step) => (
            <div key={step.token} className="grid grid-cols-12 items-center gap-2 text-[12px]">
              <span className="col-span-3 font-mono text-(--color-fg)">{step.token}</span>
              <span className="col-span-1 text-(--color-muted) tabular">{step.px}px</span>
              <div className="col-span-2">
                <div
                  className="h-2.5 rounded-xs bg-(--color-accent)"
                  style={{ width: `${step.px * 2}px`, maxWidth: '100%' }}
                />
              </div>
              <span className="col-span-6 text-(--color-muted)">{step.role}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-x-auto rounded-lg squircle-corners border border-(--color-border)">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Dashboard surface</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Padding</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Radius rule</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Internal gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {DASHBOARD_SURFACE_SPEC.map((row) => (
              <tr key={row.surface}>
                <td className="px-4 py-3 text-(--color-fg)">{row.surface}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-(--color-muted)">{row.padding}</td>
                <td className="px-4 py-3 text-(--color-fg)">{row.radius}</td>
                <td className="px-4 py-3 text-(--color-muted)">{row.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
