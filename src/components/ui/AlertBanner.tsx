import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '../Icons';
import { TactileButton } from './TactileButton';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

export interface AlertBannerProps {
  tone?: AlertTone;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const TONE_CLASSES: Record<AlertTone, { wrap: string; icon: string }> = {
  info: {
    wrap: 'border-(--color-border) bg-(--color-surface-info)',
    icon: 'text-(--color-info)',
  },
  success: {
    wrap: 'border-(--color-border) bg-(--color-surface-success)',
    icon: 'text-(--color-success)',
  },
  warning: {
    wrap: 'border-(--color-border) bg-(--color-surface-warning)',
    icon: 'text-(--color-warning)',
  },
  error: {
    wrap: 'border-(--color-error) bg-(--color-surface-error)',
    icon: 'text-(--color-error)',
  },
};

function renderToneIcon(tone: AlertTone): ReactNode {
  switch (tone) {
    case 'success':
      return <CheckCircleIcon />;
    case 'warning':
      return <AlertTriangleIcon />;
    case 'error':
      return <AlertCircleIcon />;
    case 'info':
      return <InfoIcon />;
  }
}

export function AlertBanner({
  tone = 'info',
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
  className,
}: AlertBannerProps) {
  const styles = TONE_CLASSES[tone];

  return (
    <div
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 rounded-lg squircle-corners border p-4',
        styles.wrap,
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span aria-hidden="true" className={cn('mt-0.5 shrink-0 inline-flex', styles.icon)}>
          {renderToneIcon(tone)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-(--color-fg)">{title}</div>
          {description ? (
            <p className="m-0 mt-1 text-[13px] text-(--color-muted)">{description}</p>
          ) : null}
        </div>
      </div>

      {actionLabel && onAction ? (
        <TactileButton variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </TactileButton>
      ) : null}

      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss notice"
          onClick={onDismiss}
          className="relative inline-flex size-7 shrink-0 items-center justify-center rounded-xs border-0 bg-transparent text-(--color-muted) hover:bg-(--color-surface-2) hover:text-(--color-fg) cursor-pointer nx-hit-expand"
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
