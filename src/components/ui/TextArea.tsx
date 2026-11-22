import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      showCount = false,
      id: providedId,
      maxLength,
      value,
      defaultValue,
      rows = 3,
      className,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const describedBy = error ? errorId : helperText ? helperId : undefined;
    const charCount =
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label || (showCount && maxLength) ? (
          <div className="flex items-baseline justify-between gap-2">
            {label ? (
              <label htmlFor={id} className="text-[13px] text-(--color-fg)">
                {label}
              </label>
            ) : (
              <span />
            )}
            {showCount && maxLength ? (
              <span className="text-[11px] text-(--color-subtle) tabular">
                {charCount}/{maxLength}
              </span>
            ) : null}
          </div>
        ) : null}

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-md squircle-corners border bg-(--color-bg) px-3 py-2.5 text-[14px] text-(--color-fg) resize-y min-h-22',
            'placeholder:text-(--color-subtle)',
            'transition-[border-color,background-color] duration-(--motion-dur-fast) ease-(--motion-ease-out)',
            error
              ? 'border-(--color-error)'
              : 'border-(--color-border) hover:border-(--color-border-strong) focus-visible:border-(--color-accent)',
            className,
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} role="alert" className="m-0 text-[12px] text-(--color-error)">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="m-0 text-[12px] text-(--color-muted)">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
