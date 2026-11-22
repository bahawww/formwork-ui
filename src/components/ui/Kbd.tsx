import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-xs squircle-corners border border-(--color-border) bg-(--color-surface) px-1.5 py-0.5 font-mono text-[11px] leading-none text-(--color-muted) whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
