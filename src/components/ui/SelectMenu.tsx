import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound, playHoverSound } from '../../lib/sound';
import { CheckIcon, ChevronDownIcon } from '../Icons';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

export interface SelectMenuProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface MenuCoords {
  top: number;
  left: number;
  width: number;
}

export function SelectMenu({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [coords, setCoords] = useState<MenuCoords>({ top: 0, left: 0, width: 220 });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const labelId = useId();
  const listId = useId();
  const reduceMotion = useReducedMotion();

  const selectedOption = options.find((opt) => opt.value === value);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const onWindowKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onWindowKey);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onWindowKey);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  const openMenu = () => {
    if (disabled) return;
    const currentIdx = Math.max(
      0,
      options.findIndex((opt) => opt.value === value),
    );
    setActiveIndex(currentIdx);
    updatePosition();
    setOpen(true);
  };

  const selectOption = (opt: SelectOption) => {
    playClickSound();
    onValueChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      if (!open) {
        event.preventDefault();
        openMenu();
        return;
      }
    }

    if (!open) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, options.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + Math.max(1, options.length)) % Math.max(1, options.length));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(0, options.length - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const targetOpt = options[activeIndex];
      if (targetOpt) selectOption(targetOpt);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span id={labelId} className="text-[13px] text-(--color-fg)">
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        aria-controls={open ? listId : undefined}
        onPointerDown={(event) => event.preventDefault()}
        onMouseEnter={() => {
          if (!disabled) playHoverSound();
        }}
        onClick={() => {
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex min-h-11 w-full items-center justify-between gap-2 rounded-md squircle-corners border border-(--color-border) bg-(--color-bg) px-3 text-[13px] text-(--color-fg)',
          'cursor-pointer transition-[border-color,background-color] duration-(--motion-dur-fast) hover:border-(--color-border-strong)',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <span className={cn('truncate', selectedOption ? 'text-(--color-fg)' : 'text-(--color-subtle)')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 text-(--color-muted) transition-transform duration-(--motion-dur-fast)',
            open ? 'rotate-180' : 'rotate-0',
          )}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.ul
                  ref={menuRef}
                  id={listId}
                  role="listbox"
                  aria-labelledby={labelId}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -4 }}
                  transition={reduceMotion ? { duration: 0 } : springs.fast}
                  style={{
                    position: 'fixed',
                    top: coords.top,
                    left: coords.left,
                    width: coords.width,
                    zIndex: 55,
                  }}
                  className="glass-surface m-0 list-none rounded-lg squircle-corners p-1 max-h-64 overflow-y-auto"
                >
                  {options.map((opt, idx) => {
                    const isSelected = opt.value === value;
                    const isHighlighted = idx === activeIndex;
                    return (
                      <li key={opt.value} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          onPointerDown={(event) => event.preventDefault()}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => selectOption(opt)}
                          className={cn(
                            'flex min-h-10 w-full items-center justify-between gap-2 rounded-xs squircle-corners border-0 px-2.5 py-2 text-start text-[13px] cursor-pointer transition-colors duration-(--motion-dur-instant)',
                            isHighlighted
                              ? 'bg-(--color-surface-2) text-(--color-fg)'
                              : 'bg-transparent text-(--color-fg)',
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">{opt.label}</span>
                            {opt.hint ? (
                              <span className="block truncate text-[11px] text-(--color-muted)">
                                {opt.hint}
                              </span>
                            ) : null}
                          </span>
                          {isSelected ? (
                            <span aria-hidden="true" className="text-(--color-accent) shrink-0">
                              <CheckIcon />
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
