import { cn } from '../../lib/cn';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarStatus = 'online' | 'busy' | 'offline';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-8 text-[11px]',
  md: 'size-10 text-[13px]',
  lg: 'size-12 text-[15px]',
};

const STATUS_DOT: Record<AvatarStatus, { className: string; label: string }> = {
  online: { className: 'bg-(--color-success)', label: 'Online' },
  busy: { className: 'bg-(--color-warning)', label: 'Busy' },
  offline: { className: 'bg-(--color-subtle)', label: 'Offline' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return `${first}${second}`.toUpperCase();
}

export function Avatar({ name, src, size = 'md', status, className }: AvatarProps) {
  const statusInfo = status ? STATUS_DOT[status] : null;

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden squircle border border-(--color-border) bg-(--color-surface-2) text-(--color-fg) font-body select-none',
          SIZE_CLASSES[size],
        )}
      >
        {src ? (
          <img src={src} alt={name} className="size-full object-cover" />
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
      </span>
      {statusInfo ? (
        <span
          className={cn(
            'absolute bottom-0 inset-e-0 size-2.5 squircle border-2 border-(--color-bg)',
            statusInfo.className,
          )}
        >
          <span className="sr-only">{statusInfo.label}</span>
        </span>
      ) : null}
    </span>
  );
}
