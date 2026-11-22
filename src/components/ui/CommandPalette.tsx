import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound } from '../../lib/sound';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { SearchIcon } from '../Icons';
import { Kbd } from './Kbd';

export interface CommandItem {
  id: string;
  label: string;
  section: string;
  hint?: string;
  shortcut?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: readonly CommandItem[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  useFocusTrap({
    isOpen,
    containerRef: dialogRef,
    initialFocusRef: inputRef,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(normalized) ||
          cmd.section.toLowerCase().includes(normalized) ||
          (cmd.hint ? cmd.hint.toLowerCase().includes(normalized) : false),
      )
    : commands;

  const clampedIdx = filtered.length > 0 ? Math.min(activeIndex, filtered.length - 1) : -1;

  const execute = (item: CommandItem) => {
    playClickSound();
    onClose();
    item.onSelect();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (filtered.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (event.key === 'Enter' && clampedIdx >= 0) {
      const chosen = filtered[clampedIdx];
      if (chosen) {
        event.preventDefault();
        execute(chosen);
      }
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          data-backdrop="true"
          className="modal-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.14 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={handleKeyDown}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -4 }}
            transition={reduceMotion ? { duration: 0 } : springs.fast}
            className="glass-surface w-full max-w-[520px] rounded-xl squircle-corners p-2"
          >
            <h2 id={titleId} className="sr-only">
              Quick command menu
            </h2>

            <div className="flex items-center gap-2 rounded-sm squircle-corners border border-(--color-border) bg-(--color-bg) px-3">
              <span aria-hidden="true" className="text-(--color-subtle) inline-flex">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Jump to view, accent preset, or theme..."
                aria-label="Filter commands"
                className="min-h-11 w-full border-0 bg-transparent text-[13px] text-(--color-fg) placeholder:text-(--color-subtle) focus:outline-none"
              />
              <Kbd>Esc</Kbd>
            </div>

            <div className="mt-2 max-h-72 overflow-y-auto flex flex-col gap-0.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-[13px] text-(--color-muted)">
                  No commands match "{query}". Clear your query to see all actions.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isActive = idx === clampedIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => execute(item)}
                      className={cn(
                        'flex min-h-11 w-full items-center justify-between gap-3 rounded-xs squircle-corners border-0 px-3 py-2 text-start cursor-pointer',
                        'transition-colors duration-(--motion-dur-fast)',
                        isActive ? 'bg-(--color-surface-2)' : 'bg-transparent hover:bg-(--color-surface)',
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        {item.icon ? (
                          <span aria-hidden="true" className="inline-flex shrink-0 text-(--color-muted)">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] text-(--color-fg)">
                            {item.label}
                          </span>
                          {item.hint ? (
                            <span className="block truncate text-[11px] text-(--color-muted)">
                              {item.hint}
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-[11px] text-(--color-subtle)">{item.section}</span>
                        {item.shortcut ? <Kbd>{item.shortcut}</Kbd> : null}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
