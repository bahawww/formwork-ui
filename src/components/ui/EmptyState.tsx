import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { TactileButton } from './TactileButton';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-start gap-2.5 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-5',
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="text-(--color-muted) inline-flex">
          {icon}
        </span>
      ) : null}
      <div className="text-[14px] text-(--color-fg)">{title}</div>
      <p className="m-0 max-w-[56ch] text-[13px] text-(--color-muted)">{description}</p>
      {actionLabel && onAction ? (
        <TactileButton variant="outline" size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </TactileButton>
      ) : null}
    </div>
  );
}
