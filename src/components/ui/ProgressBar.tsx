import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';

export type ProgressTone = 'neutral' | 'accent' | 'success' | 'warning' | 'error';

export interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  tone?: ProgressTone;
  showValue?: boolean;
  className?: string;
}

const TONE_FILL: Record<ProgressTone, string> = {
  neutral: 'bg-(--color-fg)',
  accent: 'bg-(--color-accent)',
  success: 'bg-(--color-success)',
  warning: 'bg-(--color-warning)',
  error: 'bg-(--color-error)',
};

export function ProgressBar({
  label,
  value,
  max = 100,
  tone = 'accent',
  showValue = true,
  className,
}: ProgressBarProps) {
  const reduceMotion = useReducedMotion();
  const safeMax = Math.max(1, max);
  const clamped = Math.max(0, Math.min(value, safeMax));
  const ratio = clamped / safeMax;
  const pct = Math.round(ratio * 100);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2 text-[12px]">
        <span className="text-(--color-fg)">{label}</span>
        {showValue ? <span className="text-(--color-muted) tabular">{pct}%</span> : null}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        className="h-2 w-full overflow-hidden squircle bg-(--color-surface-2)"
      >
        {/* Animates transform scaleX only so layout stays untouched */}
        <motion.div
          className={cn('h-full w-full origin-left squircle', TONE_FILL[tone])}
          initial={false}
          animate={{ scaleX: ratio }}
          transition={reduceMotion ? { duration: 0 } : springs.settle}
        />
      </div>
    </div>
  );
}
