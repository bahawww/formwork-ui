import { useState } from 'react';
import {
  AreaTrendChart,
  BarComparisonChart,
  DistributionBar,
  Sparkline,
} from '../charts';
import { SegmentedControl, useToast } from '../ui';

const TREND_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] as const;
const TREND_SERIES = [
  { name: 'Edge p95', values: [58, 55, 53, 50, 48, 45, 43] },
  { name: 'Origin p95', values: [96, 93, 95, 89, 86, 82, 79] },
  { name: 'Cache fill', values: [42, 41, 39, 38, 36, 35, 34] },
] as const;

const REGION_BARS = [
  { label: 'US East', value: 38, note: 'Lowest origin distance' },
  { label: 'Frankfurt', value: 44, note: 'EU compliant cluster' },
  { label: 'Singapore', value: 46, highlight: true, note: 'Primary APAC hub' },
  { label: 'Tokyo', value: 53, note: 'Standby edge pop' },
  { label: 'Sydney', value: 61, note: 'Southern tier edge' },
] as const;

const TRAFFIC_SEGMENTS = [
  { id: 'rest', label: 'REST & JSON API', value: 52 },
  { id: 'events', label: 'Streaming telemetry', value: 27 },
  { id: 'cache', label: 'Static edge cache', value: 14 },
  { id: 'hooks', label: 'Signed webhooks', value: 7 },
] as const;

const SMALL_MULTIPLES = [
  { label: 'api-gateway', metric: '42 ms', tone: 'success' as const, values: [51, 49, 47, 44, 43, 42] },
  { label: 'auth-session', metric: '29 ms', tone: 'success' as const, values: [35, 33, 32, 31, 30, 29] },
  { label: 'search-indexer', metric: '146 ms', tone: 'error' as const, values: [92, 98, 114, 129, 138, 146] },
  { label: 'billing-ledger', metric: '68 ms', tone: 'accent' as const, values: [72, 71, 70, 69, 68, 68] },
] as const;

const COMPARISON_ROWS = [
  { axis: 'Gridlines', slop: 'Heavy 2D cage + dark drop shadows', antiSlop: 'Horizontal 1px hairlines only; zero vertical grid' },
  { axis: 'Proportional share', slop: '5-slice 3D pie or nested donut rings', antiSlop: 'Single proportional DistributionBar + tabular ledger' },
  { axis: 'Bar scale', slop: 'Truncated Y-axis exaggerating 2% diff', antiSlop: 'Strict 0 baseline (Lie Factor 1.0) with direct labels' },
  { axis: 'Color accessibility', slop: 'Random rainbow hexes without luminance parity', antiSlop: 'Equal-lightness OKLCH ramp + dash pattern redundancy' },
] as const;

export function ChartsGalleryView() {
  const [chartState, setChartState] = useState<'default' | 'loading' | 'empty' | 'error'>('default');
  const [barOrientation, setBarOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const { toast } = useToast();

  const handleRetry = () => {
    setChartState('default');
    toast({ title: 'Chart data restored', tone: 'success' });
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-(--color-border) pb-5">
        <div>
          <h1 className="m-0 text-[28px] font-semibold leading-tight tracking-tight text-(--color-fg)">
            Anti-slop graph system
          </h1>
          <p className="m-0 mt-1.5 max-w-[68ch] text-[14px] text-(--color-muted)">
            Built around Edward Tufte integrity rules, CVD-safe equal-lightness OKLCH series tokens, direct value labels, and full 5-state resilience.
          </p>
        </div>

        <SegmentedControl
          ariaLabel="Chart state preview"
          size="md"
          value={chartState}
          onValueChange={setChartState}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'loading', label: 'Loading' },
            { value: 'empty', label: 'Empty' },
            { value: 'error', label: 'Error' },
          ]}
        />
      </header>

      <AreaTrendChart
        title="Multi-region tail latency trajectory"
        subtitle="Hover legend items to isolate a series; use Tab + Enter on timeline columns for keyboard inspection."
        labels={TREND_LABELS}
        series={TREND_SERIES}
        unit="ms"
        state={chartState}
        onRetry={handleRetry}
        onResetEmpty={() => setChartState('default')}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="min-w-0 flex flex-col gap-3 lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] text-(--color-muted)">Bar comparison orientation</span>
            <SegmentedControl
              ariaLabel="Bar chart orientation"
              value={barOrientation}
              onValueChange={setBarOrientation}
              options={[
                { value: 'vertical', label: 'Vertical' },
                { value: 'horizontal', label: 'Horizontal' },
              ]}
            />
          </div>
          <BarComparisonChart
            title="Regional p95 latency comparison"
            subtitle="Always starts at zero to preserve true magnitude proportionality."
            bars={REGION_BARS}
            unit="ms"
            orientation={barOrientation}
            state={chartState}
            onRetry={handleRetry}
            onResetEmpty={() => setChartState('default')}
          />
        </div>

        <div className="min-w-0 lg:col-span-5 lg:pt-11">
          <DistributionBar
            title="Workload request distribution"
            subtitle="Click any segment or ledger row to isolate its contribution."
            segments={TRAFFIC_SEGMENTS}
            unit="%"
            state={chartState}
            onRetry={handleRetry}
            onResetEmpty={() => setChartState('default')}
          />
        </div>
      </div>

      <section className="flex flex-col gap-3" aria-label="Small multiples sparkline strip">
        <div>
          <h2 className="m-0 text-[16px] font-medium text-(--color-fg)">Small multiples (Sparkline grid)</h2>
          <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
            Compact trend indicators share consistent vertical bounds inside tabular service cells.
          </p>
        </div>

        <div className="grid grid-cols-1 border-y border-(--color-border) sm:grid-cols-2 lg:grid-cols-4">
          {SMALL_MULTIPLES.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 border-b border-(--color-border) px-4 py-3.5 sm:border-e lg:border-b-0 lg:last:border-e-0"
            >
              <div>
                <div className="text-[12px] text-(--color-muted)">{item.label}</div>
                <div className="mt-0.5 text-[18px] text-(--color-fg) tabular">{item.metric}</div>
              </div>
              <Sparkline values={item.values} ariaLabel={`${item.label} sparkline`} tone={item.tone} />
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-x-auto rounded-lg squircle-corners border border-(--color-border)">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Axis</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-muted)">Generic AI slop</th>
              <th className="px-4 py-3 text-start font-normal text-(--color-fg)">Formwork rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.axis}>
                <td className="px-4 py-3 text-(--color-fg)">{row.axis}</td>
                <td className="px-4 py-3 text-(--color-muted)">{row.slop}</td>
                <td className="px-4 py-3 text-(--color-fg)">{row.antiSlop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
