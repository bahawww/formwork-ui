import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { CloseIcon, SearchIcon } from '../Icons';
import { Kbd } from './Kbd';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  value: string;
  onClear?: () => void;
  shortcut?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ label, value, onClear, shortcut, id: providedId, className, placeholder = 'Search...', ...props }, ref) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const hasValue = value.length > 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={id} className="text-[13px] text-(--color-fg)">
            {label}
          </label>
        ) : null}

        <div className="relative flex items-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-s-3 inline-flex text-(--color-subtle)"
          >
            <SearchIcon />
          </span>

          <input
            ref={ref}
            id={id}
            type="search"
            value={value}
            placeholder={placeholder}
            aria-label={label ? undefined : props['aria-label'] ?? placeholder}
            className={cn(
              'min-h-11 w-full rounded-md squircle-corners border border-(--color-border) bg-(--color-bg) ps-9 pe-16 text-[13px] text-(--color-fg)',
              'placeholder:text-(--color-subtle)',
              'transition-[border-color,background-color] duration-(--motion-dur-fast) ease-(--motion-ease-out)',
              'hover:border-(--color-border-strong) focus-visible:border-(--color-accent)',
              className,
            )}
            {...props}
          />

          <div className="absolute inset-e-2 flex items-center gap-1">
            {hasValue && onClear ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={onClear}
                className="relative inline-flex size-7 items-center justify-center rounded-xs border-0 bg-transparent text-(--color-muted) hover:bg-(--color-surface-2) hover:text-(--color-fg) cursor-pointer nx-hit-expand"
              >
                <CloseIcon />
              </button>
            ) : shortcut ? (
              <Kbd aria-hidden="true">{shortcut}</Kbd>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
