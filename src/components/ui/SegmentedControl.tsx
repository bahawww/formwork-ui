import { useId, useRef, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound } from '../../lib/sound';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  ariaLabel: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  value,
  onValueChange,
  options,
  ariaLabel,
  size = 'sm',
  className,
}: SegmentedControlProps<T>) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const layoutId = useId();
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = groupRef.current;
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
    const current = buttons.findIndex((btn) => btn === document.activeElement);
    if (current === -1 || buttons.length === 0) return;

    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % buttons.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + buttons.length) % buttons.length;
    }

    if (next !== null) {
      event.preventDefault();
      const target = buttons[next];
      target?.focus();
      target?.click();
    }
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-md squircle-corners bg-(--color-surface-2) p-1 border border-(--color-border)',
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!selected) {
                playClickSound();
                onValueChange(opt.value);
              }
            }}
            className={cn(
              'relative z-1 inline-flex items-center justify-center rounded-xs squircle-corners border-0 bg-transparent cursor-pointer whitespace-nowrap select-none',
              'transition-colors duration-(--motion-dur-fast) ease-(--motion-ease-out)',
              size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[13px]',
              selected ? 'text-(--color-fg)' : 'text-(--color-muted) hover:text-(--color-fg)',
            )}
          >
            {selected ? (
              <motion.span
                layoutId={reduceMotion ? undefined : `${layoutId}-segment`}
                transition={reduceMotion ? { duration: 0 } : springs.settle}
                className="absolute inset-0 -z-1 rounded-xs squircle-corners bg-(--color-bg) border border-(--color-border)"
              />
            ) : null}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
