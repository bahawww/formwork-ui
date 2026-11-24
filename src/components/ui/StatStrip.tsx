import { cn } from '../../lib/cn';
import { TrendingDownIcon, TrendingUpIcon } from '../Icons';
import { Sparkline } from '../charts/Sparkline';

export type StatDeltaTone = 'positive' | 'negative' | 'neutral';

export interface StatStripItem {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone?: StatDeltaTone;
  note?: string;
  sparkline?: readonly number[];
}

export interface StatStripProps {
  items: readonly StatStripItem[];
  ariaLabel?: string;
  className?: string;
}

const TONE_CLASS: Record<StatDeltaTone, string> = {
  positive: 'text-(--color-success)',
  negative: 'text-(--color-error)',
  neutral: 'text-(--color-muted)',
};

export function StatStrip({ items, ariaLabel = 'Key metrics', className }: StatStripProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'grid grid-cols-1 border-y border-(--color-border) bg-(--color-bg) sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => {
        const tone = item.tone ?? 'neutral';
        return (
          <div
            key={item.id}
            className="flex min-w-0 items-end justify-between gap-3 border-b border-(--color-border) px-4 py-4 sm:border-e lg:border-b-0 lg:last:border-e-0"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] text-(--color-muted)">{item.label}</div>
              <div className="mt-1 text-[26px] font-figure leading-tight text-(--color-fg) tabular">
                {item.value}
              </div>
              {item.delta ? (
                <div className={cn('mt-1 inline-flex items-center gap-1 text-[12px] tabular', TONE_CLASS[tone])}>
                  {tone === 'positive' ? (
                    <TrendingUpIcon />
                  ) : tone === 'negative' ? (
                    <TrendingDownIcon />
                  ) : null}
                  <span>{item.delta}</span>
                </div>
              ) : null}
              {item.note ? (
                <div className="mt-0.5 truncate text-[12px] text-(--color-subtle)">{item.note}</div>
              ) : null}
            </div>

            {item.sparkline && item.sparkline.length >= 2 ? (
              <Sparkline
                values={item.sparkline}
                ariaLabel={`${item.label} trend`}
                tone={tone === 'positive' ? 'success' : tone === 'negative' ? 'error' : 'accent'}
              />
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
