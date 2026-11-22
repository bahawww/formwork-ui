import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { playClickSound } from '../../lib/sound';

export interface TabsSubtleItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface TabsSubtleProps {
  value: string;
  onValueChange: (value: string) => void;
  items: TabsSubtleItem[];
  ariaLabel: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function TabsSubtle({
  value,
  onValueChange,
  items,
  ariaLabel,
  size = 'md',
  className,
}: TabsSubtleProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const layoutId = useId();
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = listRef.current;
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const currentIndex = buttons.findIndex((el) => el === document.activeElement);
    if (currentIndex === -1 || buttons.length === 0) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % buttons.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = buttons.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const target = buttons[nextIndex];
      target?.focus();
      target?.click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={['nx-tabs', `nx-tabs-${size}`, 'squircle-corners', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => {
        const isSelected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!isSelected) {
                playClickSound();
                onValueChange(item.value);
              }
            }}
            className={isSelected ? 'nx-tab-btn is-selected' : 'nx-tab-btn'}
          >
            {isSelected ? (
              <motion.span
                layoutId={reduceMotion ? undefined : `${layoutId}-pill`}
                className="nx-tab-pill squircle-corners"
                transition={reduceMotion ? { duration: 0 } : springs.settle}
              />
            ) : null}
            {item.icon ? (
              <span className="nx-tab-icon" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="nx-tab-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
