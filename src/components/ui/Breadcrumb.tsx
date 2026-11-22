import { cn } from '../../lib/cn';
import { ChevronRightIcon } from '../Icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onSelect?: () => void;
}

export interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="m-0 flex flex-wrap items-center gap-1 p-0 list-none text-[13px]">
        {items.map((item, idx) => {
          const isCurrent = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1 min-w-0">
              {idx > 0 ? (
                <span aria-hidden="true" className="inline-flex text-(--color-subtle)">
                  <ChevronRightIcon />
                </span>
              ) : null}

              {isCurrent ? (
                <span aria-current="page" className="truncate text-(--color-fg)">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="truncate rounded-xs px-1 py-0.5 text-(--color-muted) no-underline hover:text-(--color-fg)"
                >
                  {item.label}
                </a>
              ) : item.onSelect ? (
                <button
                  type="button"
                  onClick={item.onSelect}
                  className="truncate rounded-xs border-0 bg-transparent px-1 py-0.5 text-(--color-muted) hover:text-(--color-fg) cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <span className="truncate text-(--color-muted)">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
