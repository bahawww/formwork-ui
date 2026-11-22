import { useId, useRef, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound } from '../../lib/sound';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface RadioGroupProps<T extends string = string> {
  label?: string;
  value: T;
  onValueChange: (value: T) => void;
  options: readonly RadioOption<T>[];
  layout?: 'stack' | 'cards';
  className?: string;
}

export function RadioGroup<T extends string = string>({
  label,
  value,
  onValueChange,
  options,
  layout = 'stack',
  className,
}: RadioGroupProps<T>) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = groupRef.current;
    if (!container) return;
    const radios = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
    const current = radios.findIndex((el) => el === document.activeElement);
    if (current === -1 || radios.length === 0) return;

    let next: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (current + 1) % radios.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (current - 1 + radios.length) % radios.length;
    }

    if (next !== null) {
      event.preventDefault();
      const target = radios[next];
      target?.focus();
      target?.click();
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <span id={labelId} className="text-[13px] text-(--color-fg)">
          {label}
        </span>
      ) : null}

      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          layout === 'cards' ? 'grid gap-2 sm:grid-cols-2' : 'flex flex-col gap-1.5',
        )}
      >
        {options.map((opt) => {
          const checked = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!checked) {
                  playClickSound();
                  onValueChange(opt.value);
                }
              }}
              className={cn(
                'flex w-full min-h-11 items-start gap-3 rounded-md squircle-corners border px-3.5 py-2.5 text-start cursor-pointer',
                'transition-[background-color,border-color] duration-(--motion-dur-fast) ease-(--motion-ease-out)',
                checked
                  ? 'border-(--color-accent) bg-(--color-surface-accent)'
                  : 'border-(--color-border) bg-(--color-bg) hover:border-(--color-border-strong) hover:bg-(--color-surface)',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center squircle border',
                  checked
                    ? 'border-(--color-accent) bg-(--color-accent)'
                    : 'border-(--color-border-strong) bg-(--color-bg)',
                )}
              >
                <motion.span
                  initial={false}
                  animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : springs.fast}
                  className="size-1.5 squircle bg-(--color-accent-fg)"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-(--color-fg)">{opt.label}</span>
                {opt.description ? (
                  <span className="mt-0.5 block text-[12px] text-(--color-muted)">
                    {opt.description}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
