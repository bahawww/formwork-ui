import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      leadingIcon,
      trailingSlot,
      id: idProp,
      className,
      containerClassName,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <label htmlFor={id} className="text-[13px] font-body text-(--color-fg)">
          {label}
        </label>
        <div
          className={cn(
            'relative flex min-h-11 items-center rounded-md squircle-corners border bg-(--color-bg)',
            'transition-[border-color,background-color] duration-(--motion-dur-fast) ease-(--motion-ease-out)',
            'focus-within:border-(--color-accent)',
            error ? 'border-(--color-error)' : 'border-(--color-border)',
          )}
        >
          {leadingIcon ? (
            <span
              aria-hidden="true"
              className="ps-3 text-(--color-subtle) inline-flex shrink-0 items-center"
            >
              {leadingIcon}
            </span>
          ) : null}

          <input
            ref={forwardedRef}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'min-w-0 flex-1 bg-transparent py-2.5 text-[14px] font-body text-(--color-fg) placeholder:text-(--color-subtle) outline-none',
              leadingIcon ? 'ps-2.5' : 'ps-3',
              trailingSlot ? 'pe-2' : 'pe-3',
              className,
            )}
            {...props}
          />

          {trailingSlot ? <div className="pe-1.5 flex items-center">{trailingSlot}</div> : null}
        </div>

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

TextField.displayName = 'TextField';
