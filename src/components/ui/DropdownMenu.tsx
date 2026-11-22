import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound } from '../../lib/sound';
import { Kbd } from './Kbd';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  destructive?: boolean;
  onSelect: () => void;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  triggerAriaLabel?: string;
  items: readonly DropdownMenuItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({
  trigger,
  triggerAriaLabel,
  items,
  align = 'end',
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const reduceMotion = useReducedMotion();

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 208;
    const rawLeft = align === 'end' ? rect.right - width : rect.left;
    const maxLeft = typeof window !== 'undefined' ? window.innerWidth - width - 12 : rawLeft;
    setCoords({
      top: rect.bottom + 6,
      left: Math.max(12, Math.min(rawLeft, maxLeft)),
    });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const frame = window.requestAnimationFrame(() => {
      const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]');
      firstItem?.focus();
    });

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, align]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    if (nodes.length === 0) return;
    const current = nodes.findIndex((node) => node === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      nodes[(current + 1) % nodes.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      nodes[(current - 1 + nodes.length) % nodes.length]?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerAriaLabel}
        onClick={() => {
          playClickSound();
          setOpen((prev) => !prev);
        }}
        className={cn(
          'relative inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-md squircle-corners border border-(--color-border) bg-(--color-bg) px-3 text-[13px] text-(--color-fg) cursor-pointer nx-hit-expand',
          'hover:bg-(--color-surface) hover:border-(--color-border-strong) transition-[background-color,border-color] duration-(--motion-dur-fast)',
          className,
        )}
      >
        {trigger}
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={menuRef}
                  id={menuId}
                  role="menu"
                  onKeyDown={handleMenuKeyDown}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -4 }}
                  transition={reduceMotion ? { duration: 0 } : springs.fast}
                  style={{ position: 'fixed', top: coords.top, left: coords.left, width: 208, zIndex: 55 }}
                  className="glass-surface flex flex-col gap-0.5 rounded-lg squircle-corners p-1"
                >
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        playClickSound();
                        setOpen(false);
                        item.onSelect();
                        triggerRef.current?.focus();
                      }}
                      className={cn(
                        'flex min-h-9 w-full items-center justify-between gap-2 rounded-xs squircle-corners border-0 bg-transparent px-2.5 py-1.5 text-start text-[13px] cursor-pointer',
                        'hover:bg-(--color-surface-2) focus-visible:bg-(--color-surface-2)',
                        item.destructive ? 'text-(--color-error)' : 'text-(--color-fg)',
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {item.icon ? (
                          <span aria-hidden="true" className="inline-flex shrink-0 text-(--color-muted)">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.shortcut ? <Kbd>{item.shortcut}</Kbd> : null}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
