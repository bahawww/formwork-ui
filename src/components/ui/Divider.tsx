import { cn } from '../../lib/cn';

export interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn('my-0 border-0 border-t border-(--color-border)', className)} />;
  }

  return (
    <div className={cn('flex items-center gap-3', className)} role="separator">
      <span className="h-px flex-1 bg-(--color-border)" />
      <span className="text-[12px] text-(--color-subtle)">{label}</span>
      <span className="h-px flex-1 bg-(--color-border)" />
    </div>
  );
}
