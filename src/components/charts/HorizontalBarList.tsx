import { cn } from '../../lib/cn';
import { formatChartValue } from './chartTokens';
import type { BarDatum } from './BarComparisonChart';

export interface HorizontalBarListProps {
  title: string;
  bars: readonly BarDatum[];
  maxVal: number;
  activeIndex: number;
  unit?: string;
  onSelect: (index: number) => void;
}

export function HorizontalBarList({
  title,
  bars,
  maxVal,
  activeIndex,
  unit,
  onSelect,
}: HorizontalBarListProps) {
  return (
    <div className="flex flex-col gap-2" role="list" aria-label={title}>
      {bars.map((bar, idx) => {
        const pct = Math.max(2, Math.round((Math.max(0, bar.value) / maxVal) * 100));
        const isActive = activeIndex === idx;
        return (
          <button
            key={`${bar.label}-${idx}`}
            type="button"
            role="listitem"
            onClick={() => onSelect(idx)}
            onMouseEnter={() => onSelect(idx)}
            className={cn(
              'flex flex-col gap-1.5 rounded-sm squircle-corners border px-3 py-2 text-start cursor-pointer',
              'transition-colors duration-(--motion-dur-fast)',
              isActive
                ? 'border-(--color-accent) bg-(--color-surface-accent)'
                : 'border-(--color-border) bg-transparent hover:bg-(--color-surface)',
            )}
          >
            <div className="flex items-baseline justify-between gap-2 text-[12px]">
              <span className="text-(--color-fg)">{bar.label}</span>
              <span className="text-(--color-muted) tabular">
                {formatChartValue(bar.value, unit)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden squircle bg-(--color-surface-2)">
              <div
                className={cn(
                  'h-full squircle',
                  isActive ? 'bg-(--color-accent)' : 'bg-(--color-border-strong)',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
