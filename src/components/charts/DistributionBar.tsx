import { useState } from 'react';
import { cn } from '../../lib/cn';
import { AlertBanner, EmptyState, SurfaceSkeleton } from '../ui';
import { CHART_SERIES_TOKENS, formatChartValue } from './chartTokens';

export interface DistributionSegment {
  id: string;
  label: string;
  value: number;
}

export interface DistributionBarProps {
  title: string;
  subtitle?: string;
  segments: readonly DistributionSegment[];
  unit?: string;
  state?: 'default' | 'loading' | 'empty' | 'error';
  onRetry?: () => void;
  onResetEmpty?: () => void;
  className?: string;
}

export function DistributionBar({
  title,
  subtitle,
  segments,
  unit,
  state = 'default',
  onRetry,
  onResetEmpty,
  className,
}: DistributionBarProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (state === 'loading') {
    return <SurfaceSkeleton variant="panel" />;
  }

  if (state === 'error') {
    return (
      <AlertBanner
        tone="error"
        title={`Could not load ${title.toLowerCase()}`}
        description="Distribution totals could not be calculated. Retry to refresh breakdown."
        actionLabel={onRetry ? 'Retry chart' : undefined}
        onAction={onRetry}
      />
    );
  }

  const total = segments.reduce((sum, item) => sum + Math.max(0, item.value), 0);

  if (state === 'empty' || segments.length === 0 || total <= 0) {
    return (
      <EmptyState
        title={`No share data for ${title.toLowerCase()}`}
        description="Restore sample allocation or widen the query window to view distribution."
        actionLabel={onResetEmpty ? 'Restore sample shares' : undefined}
        onAction={onResetEmpty}
      />
    );
  }

  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="m-0 text-[15px] font-title text-(--color-fg)">{title}</h3>
          {subtitle ? <p className="m-0 mt-1 text-[13px] text-(--color-muted)">{subtitle}</p> : null}
        </div>
        <span className="text-[12px] text-(--color-muted) tabular">
          Total {formatChartValue(total, unit)}
        </span>
      </div>

      <div
        className="flex h-3.5 w-full overflow-hidden rounded-sm squircle-corners bg-(--color-surface-2) gap-0.5 p-0.5"
        role="group"
        aria-label={`${title} proportional bar`}
      >
        {segments.map((seg, idx) => {
          const share = (Math.max(0, seg.value) / total) * 100;
          const color = CHART_SERIES_TOKENS[idx % CHART_SERIES_TOKENS.length]!;
          const isDimmed = selectedId !== null && selectedId !== seg.id;

          return (
            <button
              key={seg.id}
              type="button"
              aria-label={`${seg.label}: ${Math.round(share)}%`}
              aria-pressed={selectedId === seg.id}
              onClick={() => setSelectedId((prev) => (prev === seg.id ? null : seg.id))}
              style={{
                flexGrow: Math.max(1, seg.value),
                flexBasis: 0,
                backgroundColor: color,
                opacity: isDimmed ? 0.28 : 1,
                transition: 'opacity var(--motion-dur-fast) var(--motion-ease-out)',
              }}
              className="h-full rounded-xs border-0 p-0 cursor-pointer"
            />
          );
        })}
      </div>

      <div className="flex flex-col divide-y divide-(--color-border) border-t border-(--color-border)">
        {segments.map((seg, idx) => {
          const share = Math.round((Math.max(0, seg.value) / total) * 1000) / 10;
          const color = CHART_SERIES_TOKENS[idx % CHART_SERIES_TOKENS.length]!;
          const isSelected = selectedId === seg.id;
          const isDimmed = selectedId !== null && !isSelected;

          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => setSelectedId((prev) => (prev === seg.id ? null : seg.id))}
              className={cn(
                'flex min-h-10 w-full items-center justify-between gap-3 border-0 bg-transparent px-1 py-2 text-start cursor-pointer',
                'transition-opacity duration-(--motion-dur-fast)',
                isDimmed ? 'opacity-45' : 'opacity-100',
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-2.5 shrink-0 squircle"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] text-(--color-subtle) tabular">#{idx + 1}</span>
                <span className="truncate text-[13px] text-(--color-fg)">{seg.label}</span>
              </span>
              <span className="flex shrink-0 items-baseline gap-3 tabular">
                {unit !== '%' ? (
                  <span className="text-[12px] text-(--color-muted)">
                    {formatChartValue(seg.value, unit)}
                  </span>
                ) : null}
                <span className="w-12 text-end text-[13px] text-(--color-fg)">{`${share}%`}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
