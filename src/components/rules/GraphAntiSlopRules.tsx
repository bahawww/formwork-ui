import { CHART_SERIES_TOKENS } from '../charts';

const GRAPH_RULES = [
  {
    principle: 'Lie Factor = 1.0',
    spec: 'Visual magnitude must match numeric magnitude. Bar charts strictly start at Y = 0; line charts zooming in MUST show a Zoomed Y-axis disclosure badge.',
  },
  {
    principle: 'Maximize Data-Ink Ratio',
    spec: 'Use horizontal 1px hairlines only; delete vertical gridlines, inner box borders, and decorative 3D bevels.',
  },
  {
    principle: 'Ban Pie Charts (> 3 slices)',
    spec: 'Human eyes misjudge angles and areas. Use DistributionBar or horizontal bar comparisons with exact percentage columns.',
  },
  {
    principle: 'CVD-Safe OKLCH + Redundancy',
    spec: 'Match lightness across series tokens (--color-chart-1..5) and pair distinct stroke-dash patterns or numeric tags.',
  },
  {
    principle: 'Direct Labels & Crosshair Scrubber',
    spec: 'Prefer end-of-series labels over floating boxes; provide both pointer scrubbers and keyboard-focusable interval buttons.',
  },
  {
    principle: 'Mandatory 5-State Resilience',
    spec: 'Every chart handles default, skeleton loading, empty recovery CTA, error Retry banner, and live series isolation.',
  },
] as const;

export function GraphAntiSlopRules() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Anti-slop graph principles">
        {GRAPH_RULES.map((rule) => (
          <div
            key={rule.principle}
            className="flex flex-col gap-2 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-4"
          >
            <h3 className="m-0 text-[14px] font-title text-(--color-fg)">{rule.principle}</h3>
            <p className="m-0 text-[13px] text-(--color-muted)">{rule.spec}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <h3 className="m-0 text-[15px] font-title text-(--color-fg)">Equal-lightness OKLCH data series ramp</h3>
        <p className="m-0 text-[13px] text-(--color-muted)">
          Every chart series sits within L 0.54 to 0.58 (light) and L 0.72 to 0.76 (dark) so no single hue visually dominates siblings before focus isolation.
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {CHART_SERIES_TOKENS.map((token, idx) => (
            <div
              key={token}
              className="flex items-center gap-2.5 rounded-md squircle-corners border border-(--color-border) bg-(--color-surface) p-2.5"
            >
              <span
                aria-hidden="true"
                className="size-4 shrink-0 squircle"
                style={{ backgroundColor: token }}
              />
              <span className="truncate font-mono text-[11px] text-(--color-fg)">
                series-{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
