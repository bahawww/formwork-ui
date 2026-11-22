import { cn } from '../../lib/cn';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import { TactileButton } from './TactileButton';

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const clamped = Math.max(1, Math.min(page, totalPages));
  const start = totalItems === 0 ? 0 : (clamped - 1) * pageSize + 1;
  const end = Math.min(totalItems, clamped * pageSize);

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3 pt-2', className)}
    >
      <span className="text-[12px] text-(--color-muted) tabular">
        {start}-{end} of {totalItems} rows
      </span>

      <div className="flex items-center gap-1">
        <TactileButton
          variant="outline"
          size="sm"
          disabled={clamped <= 1}
          aria-label="Previous page"
          onClick={() => onPageChange(clamped - 1)}
        >
          <ChevronLeftIcon />
          <span>Previous</span>
        </TactileButton>

        {pages.map((num) => (
          <button
            key={num}
            type="button"
            aria-label={`Page ${num}`}
            aria-current={num === clamped ? 'page' : undefined}
            onClick={() => onPageChange(num)}
            className={cn(
              'relative inline-flex min-h-9 min-w-9 items-center justify-center rounded-md squircle-corners border px-2 text-[12px] tabular cursor-pointer nx-hit-expand',
              'transition-colors duration-(--motion-dur-fast)',
              num === clamped
                ? 'border-(--color-fg) bg-(--color-fg) text-(--color-bg)'
                : 'border-(--color-border) bg-(--color-bg) text-(--color-muted) hover:border-(--color-border-strong) hover:text-(--color-fg)',
            )}
          >
            {num}
          </button>
        ))}

        <TactileButton
          variant="outline"
          size="sm"
          disabled={clamped >= totalPages}
          aria-label="Next page"
          onClick={() => onPageChange(clamped + 1)}
        >
          <span>Next</span>
          <ChevronRightIcon />
        </TactileButton>
      </div>
    </nav>
  );
}
