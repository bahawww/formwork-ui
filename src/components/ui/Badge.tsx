import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { CloseIcon } from '../Icons';

const badgeVariants = cva(
  'inline-flex items-center squircle font-normal whitespace-nowrap transition-colors duration-(--motion-dur-fast)',
  {
    variants: {
      variant: {
        solid: 'border border-(--color-border) bg-(--color-surface) text-(--color-fg)',
        muted: 'border border-(--color-border) bg-(--color-surface-2) text-(--color-muted)',
        dot: 'border border-(--color-border) bg-(--color-bg) text-(--color-fg)',
        glass: 'glass-bar border text-(--color-fg)',
      },
      size: {
        sm: 'h-6 px-2.5 text-[11px] gap-1.5',
        md: 'h-7 px-3 text-[12px] gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
);

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'error';

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof badgeVariants> {
  tone?: BadgeTone;
  icon?: ReactNode;
  pulse?: boolean;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  dismissLabel?: string;
}

const TONE_DOT_CLASS: Record<BadgeTone, string> = {
  neutral: 'bg-(--color-subtle)',
  accent: 'bg-(--color-accent)',
  success: 'bg-(--color-success)',
  warning: 'bg-(--color-warning)',
  error: 'bg-(--color-error)',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      tone = 'neutral',
      icon,
      pulse = false,
      onDismiss,
      dismissLabel = 'Remove',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const shouldPulse = variant === 'dot' && pulse && !reduceMotion;

    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {variant === 'dot' ? (
          shouldPulse ? (
            <motion.span
              aria-hidden="true"
              className={cn('size-1.5 shrink-0 squircle', TONE_DOT_CLASS[tone])}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <span
              aria-hidden="true"
              className={cn('size-1.5 shrink-0 squircle', TONE_DOT_CLASS[tone])}
            />
          )
        ) : icon ? (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {icon}
          </span>
        ) : null}

        <span className="min-w-0 truncate">{children}</span>

        {onDismiss ? (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="relative -me-1 inline-flex size-4 shrink-0 items-center justify-center squircle text-(--color-muted) hover:bg-(--color-surface-2) hover:text-(--color-fg) border-0 bg-transparent cursor-pointer nx-hit-expand"
          >
            <CloseIcon />
          </button>
        ) : null}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
