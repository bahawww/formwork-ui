const SHELL_TIERS = [
  {
    tier: 'Macro (App shell)',
    spec: '224px expanded / 60px collapsed sidebar + 56px frosted .glass-bar header + 1280px max canvas.',
    antiSlop: 'Avoid triple nested sidebars or full-bleed edge sprawl without max-width bounds.',
  },
  {
    tier: 'Meso (Asymmetric bento)',
    spec: 'Hairline StatStrip (4-col desktop) + 12-col asymmetric bento rows (8/4 or 7/5 splits, 16px gutters).',
    antiSlop: 'Replace uniform 4-card soft-shadow KPI grids with flat 1px border-divided strips.',
  },
  {
    tier: 'Micro (Cells & controls)',
    spec: 'min-w-0 truncation safety, tabular-nums columns, 44px hit targets, 2px focus-visible rings.',
    antiSlop: 'Never wrap overflowing table strings mid-digit or skip horizontal scroll containers.',
  },
] as const;

const BREAKPOINT_ROWS = [
  { width: '320px (Mobile)', nav: 'SlideOverDrawer trigger', stats: '1 column stack', bento: '1 column, full-width charts' },
  { width: '768px (Tablet)', nav: 'SlideOverDrawer trigger', stats: '2 x 2 grid', bento: '12-col stack or 6/6 split' },
  { width: '1024px (Laptop)', nav: 'Collapsible 224px / 60px rail', stats: '4 columns hairline', bento: '8/4 asymmetric bento' },
  { width: '1440px+ (Desktop)', nav: 'Persistent 224px rail', stats: '4 columns hairline', bento: '1280px centered stage' },
] as const;

const FIVE_STATES = [
  { state: 'Default', rule: 'Calm baseline hierarchy, regular 400 weight, 60-30-10 neutral clarity.' },
  { state: 'Loading', rule: 'Shape-matched SurfaceSkeleton with aria-busy="true" (never a bare full-page spinner).' },
  { state: 'Empty', rule: 'Explain what is empty, why, and provide a direct 1-click recovery CTA.' },
  { state: 'Error', rule: 'AlertBanner stating What failed + Why + concrete Retry CTA.' },
  { state: 'Success', rule: 'Verb-matched feedback (Saved settings -> toast confirmation + aria-live).' },
] as const;

export function LayoutDashboardRules() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 md:grid-cols-3" aria-label="Macro Meso Micro layout hierarchy">
        {SHELL_TIERS.map((item) => (
          <div
            key={item.tier}
            className="flex flex-col justify-between gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div>
              <div className="text-[14px] text-(--color-fg)">{item.tier}</div>
              <p className="m-0 mt-1.5 text-[13px] text-(--color-muted)">{item.spec}</p>
            </div>
            <div className="border-t border-(--color-border) pt-2.5 text-[12px] text-(--color-fg)">
              {item.antiSlop}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <h3 className="m-0 text-[15px] text-(--color-fg)">12-column asymmetric bento blueprint</h3>
        <p className="m-0 text-[13px] text-(--color-muted)">
          Give primary trend telemetry 8 columns and complementary breakdown 4 columns rather than uniform equal-box grids.
        </p>

        <div className="grid grid-cols-12 gap-2 text-center font-mono text-[11px] text-(--color-fg)">
          <div className="col-span-12 rounded-sm squircle-corners border border-(--color-border) bg-(--color-surface) py-3">
            Macro StatStrip (4 hairline-divided cells, zero box shadows)
          </div>
          <div className="col-span-12 rounded-sm squircle-corners border border-(--color-accent) bg-(--color-surface-accent) py-6 sm:col-span-8">
            lg:col-span-8 Primary Trend Chart
          </div>
          <div className="col-span-12 rounded-sm squircle-corners border border-(--color-border) bg-(--color-surface) py-6 sm:col-span-4">
            lg:col-span-4 Distribution Bar
          </div>
          <div className="col-span-12 rounded-sm squircle-corners border border-(--color-border) bg-(--color-surface) py-5 sm:col-span-8">
            lg:col-span-8 Operational DataTable
          </div>
          <div className="col-span-12 rounded-sm squircle-corners border border-(--color-border) bg-(--color-surface) py-5 sm:col-span-4">
            lg:col-span-4 Bar Comparison
          </div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-lg squircle-corners border border-(--color-border)">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Breakpoint</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Navigation</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Stat strip</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Grid layout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {BREAKPOINT_ROWS.map((row) => (
              <tr key={row.width}>
                <td className="px-4 py-3 font-mono text-[12px] text-(--color-fg)">{row.width}</td>
                <td className="px-4 py-3 text-(--color-muted)">{row.nav}</td>
                <td className="px-4 py-3 text-(--color-muted)">{row.stats}</td>
                <td className="px-4 py-3 text-(--color-fg)">{row.bento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {FIVE_STATES.map((item) => (
          <div
            key={item.state}
            className="rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-3.5"
          >
            <div className="text-[13px] text-(--color-fg)">{item.state} state</div>
            <p className="m-0 mt-1 text-[12px] text-(--color-muted)">{item.rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
