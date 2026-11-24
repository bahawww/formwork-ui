import { useId, useState } from 'react';
import { cn } from '../../lib/cn';
import { AlertBanner, EmptyState, SurfaceSkeleton } from '../ui';
import { computeNiceTicks, formatChartValue } from './chartTokens';
import { HorizontalBarList } from './HorizontalBarList';

export interface BarDatum {
  label: string;
  value: number;
  highlight?: boolean;
  note?: string;
}

export interface BarComparisonChartProps {
  title: string;
  subtitle?: string;
  bars: readonly BarDatum[];
  unit?: string;
  orientation?: 'vertical' | 'horizontal';
  height?: number;
  state?: 'default' | 'loading' | 'empty' | 'error';
  onRetry?: () => void;
  onResetEmpty?: () => void;
  className?: string;
}

export function BarComparisonChart({
  title,
  subtitle,
  bars,
  unit,
  orientation = 'vertical',
  height = 230,
  state = 'default',
  onRetry,
  onResetEmpty,
  className,
}: BarComparisonChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const titleId = useId();
  const descId = useId();

  if (state === 'loading') {
    return <SurfaceSkeleton variant="panel" />;
  }

  if (state === 'error') {
    return (
      <AlertBanner
        tone="error"
        title={`Could not load ${title.toLowerCase()}`}
        description="Comparison metrics did not return cleanly. Retry to reload bar values."
        actionLabel={onRetry ? 'Retry chart' : undefined}
        onAction={onRetry}
      />
    );
  }

  if (state === 'empty' || bars.length === 0) {
    return (
      <EmptyState
        title={`No bars for ${title.toLowerCase()}`}
        description="Adjust region filters or restore sample metrics to compare items."
        actionLabel={onResetEmpty ? 'Restore sample metrics' : undefined}
        onAction={onResetEmpty}
      />
    );
  }

  const maxVal = Math.max(1, ...bars.map((bar) => Math.max(0, bar.value)));
  const highlighted = bars.findIndex((bar) => bar.highlight);
  const activeIndex = selectedIndex ?? (highlighted >= 0 ? highlighted : 0);
  const activeBar = bars[activeIndex];

  const width = 640;
  const padLeft = 42;
  const padRight = 16;
  const padTop = 24;
  const padBottom = 34;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const ticks = computeNiceTicks(0, maxVal, 4);
  const step = chartW / bars.length;
  const barW = Math.max(22, Math.min(64, step * 0.56));

  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5',
        className,
      )}
    >
      <div>
        <h3 className="m-0 text-[15px] font-medium text-(--color-fg)">{title}</h3>
        {subtitle ? <p className="m-0 mt-1 text-[13px] text-(--color-muted)">{subtitle}</p> : null}
      </div>

      {orientation === 'horizontal' ? (
        <HorizontalBarList
          title={title}
          bars={bars}
          maxVal={maxVal}
          activeIndex={activeIndex}
          unit={unit}
          onSelect={setSelectedIndex}
        />
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          role="img"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <title id={titleId}>{title}</title>
          <desc id={descId}>Zero-baseline bar comparison for {bars.length} items</desc>

          {ticks.map((tick, idx) => {
            const y = padTop + chartH - (tick / maxVal) * chartH;
            return (
              <g key={`bar-tick-${idx}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeOpacity={idx === 0 ? 1 : 0.65}
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--color-subtle)"
                  fontSize="11"
                  className="tabular"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {bars.map((bar, idx) => {
            const ratio = Math.max(0, bar.value) / maxVal;
            const barH = Math.max(4, Math.round(ratio * chartH));
            const x = Math.round(padLeft + idx * step + (step - barW) / 2);
            const y = padTop + chartH - barH;
            const isActive = activeIndex === idx;

            return (
              <g
                key={`${bar.label}-${idx}`}
                tabIndex={0}
                role="button"
                aria-label={`${bar.label}: ${formatChartValue(bar.value, unit)}`}
                onClick={() => setSelectedIndex(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                onFocus={() => setSelectedIndex(idx)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedIndex(idx);
                  }
                }}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx="4"
                  fill={isActive ? 'var(--color-accent)' : 'var(--color-border-strong)'}
                  style={{ transition: 'fill var(--motion-dur-fast) var(--motion-ease-out)' }}
                />
                <text
                  x={x + barW / 2}
                  y={y - 7}
                  textAnchor="middle"
                  fill={isActive ? 'var(--color-fg)' : 'var(--color-muted)'}
                  fontSize="11"
                  className="tabular"
                >
                  {formatChartValue(bar.value, unit)}
                </text>
                <text
                  x={x + barW / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fill={isActive ? 'var(--color-fg)' : 'var(--color-muted)'}
                  fontSize="11"
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {activeBar ? (
        <div className="flex items-center justify-between gap-2 border-t border-(--color-border) pt-2 text-[12px] text-(--color-muted)">
          <span className="truncate">
            {activeBar.label}
            {activeBar.note ? `: ${activeBar.note}` : ''}
          </span>
          <span className="text-(--color-fg) tabular">
            {formatChartValue(activeBar.value, unit)}
          </span>
        </div>
      ) : null}
    </section>
  );
}
