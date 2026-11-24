import { useId, useState } from 'react';
import { cn } from '../../lib/cn';
import { AlertBanner, Badge, EmptyState, SurfaceSkeleton } from '../ui';
import { AreaTrendSvg } from './AreaTrendSvg';
import {
  CHART_DASH_PATTERNS,
  CHART_SERIES_TOKENS,
  computeNiceTicks,
  formatChartValue,
} from './chartTokens';

export interface TrendSeries {
  name: string;
  values: readonly number[];
}

export interface AreaTrendChartProps {
  title: string;
  subtitle?: string;
  labels: readonly string[];
  series: readonly TrendSeries[];
  unit?: string;
  height?: number;
  startAtZero?: boolean;
  state?: 'default' | 'loading' | 'empty' | 'error';
  onRetry?: () => void;
  onResetEmpty?: () => void;
  className?: string;
}

export function AreaTrendChart({
  title,
  subtitle,
  labels,
  series,
  unit,
  height = 240,
  startAtZero = false,
  state = 'default',
  onRetry,
  onResetEmpty,
  className,
}: AreaTrendChartProps) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(Math.max(0, labels.length - 1));
  const titleId = useId();
  const descId = useId();
  const gradId = useId();

  if (state === 'loading') {
    return <SurfaceSkeleton variant="panel" />;
  }

  if (state === 'error') {
    return (
      <AlertBanner
        tone="error"
        title={`Could not render ${title.toLowerCase()}`}
        description="Time-series aggregation failed to respond. Retry to reload telemetry points."
        actionLabel={onRetry ? 'Retry chart' : undefined}
        onAction={onRetry}
      />
    );
  }

  if (state === 'empty' || labels.length === 0 || series.length === 0) {
    return (
      <EmptyState
        title={`No points for ${title.toLowerCase()}`}
        description="Expand the selected date range or clear series filters to inspect trend data."
        actionLabel={onResetEmpty ? 'Reset timeframe' : undefined}
        onAction={onResetEmpty}
      />
    );
  }

  const visible = series.filter((item) => !hidden[item.name]);
  const allValues = visible.flatMap((item) => item.values.slice(0, labels.length));
  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 100;
  const minVal = startAtZero ? Math.min(0, rawMin) : rawMin;
  const maxVal = rawMax === minVal ? minVal + 10 : rawMax;
  const ticks = computeNiceTicks(minVal, maxVal, 4);
  const span = Math.max(1e-6, maxVal - minVal);
  const clampedIndex = Math.max(0, Math.min(activeIndex, labels.length - 1));
  const activeLabel = labels[clampedIndex] ?? '';

  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="m-0 text-[15px] font-medium text-(--color-fg)">{title}</h3>
            {!startAtZero ? (
              <Badge variant="muted" size="sm">
                Zoomed Y-axis
              </Badge>
            ) : null}
          </div>
          {subtitle ? <p className="m-0 mt-1 text-[13px] text-(--color-muted)">{subtitle}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {series.map((item, idx) => {
            const color = CHART_SERIES_TOKENS[idx % CHART_SERIES_TOKENS.length]!;
            const dash = CHART_DASH_PATTERNS[idx % CHART_DASH_PATTERNS.length];
            const isVisible = !hidden[item.name];

            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={isVisible}
                onMouseEnter={() => setHoveredSeries(item.name)}
                onMouseLeave={() => setHoveredSeries(null)}
                onClick={() =>
                  setHidden((prev) => ({
                    ...prev,
                    [item.name]: !prev[item.name],
                  }))
                }
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-sm squircle-corners border border-(--color-border) bg-transparent px-2.5 py-1 text-[12px] text-(--color-fg) cursor-pointer',
                  'transition-opacity duration-(--motion-dur-fast)',
                  isVisible ? 'opacity-100' : 'opacity-40',
                )}
              >
                <svg width="16" height="6" viewBox="0 0 16 6" aria-hidden="true">
                  <line
                    x1="0"
                    y1="3"
                    x2="16"
                    y2="3"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={dash}
                  />
                </svg>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AreaTrendSvg
        titleId={titleId}
        descId={descId}
        gradId={gradId}
        title={title}
        subtitle={subtitle}
        labels={labels}
        series={series}
        hidden={hidden}
        hoveredSeries={hoveredSeries}
        visibleCount={visible.length}
        firstVisibleName={visible[0]?.name}
        ticks={ticks}
        minVal={minVal}
        span={span}
        height={height}
        clampedIndex={clampedIndex}
        unit={unit}
        onInspectIndex={setActiveIndex}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--color-border) pt-2.5 text-[12px]">
        <span className="text-(--color-fg)">{activeLabel}</span>
        <div className="flex flex-wrap items-center gap-4 tabular">
          {visible.map((item, idx) => {
            const val = item.values[clampedIndex];
            const color = CHART_SERIES_TOKENS[idx % CHART_SERIES_TOKENS.length]!;
            return (
              <span key={item.name} className="inline-flex items-center gap-1.5 text-(--color-muted)">
                <span
                  aria-hidden="true"
                  className="inline-block size-2 squircle"
                  style={{ backgroundColor: color }}
                />
                <span>{item.name}:</span>
                <span className="text-(--color-fg)">
                  {val === undefined ? 'n/a' : formatChartValue(val, unit)}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
