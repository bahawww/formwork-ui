import { useId, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound } from '../../lib/sound';
import { ChevronDownIcon } from '../Icons';

export interface AccordionItem {
  id: string;
  title: string;
  meta?: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  defaultOpenIds?: readonly string[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<readonly string[]>(defaultOpenIds);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  const toggleItem = (id: string) => {
    playClickSound();
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) {
        return prev.filter((item) => item !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div
      className={cn(
        'divide-y divide-(--color-border) border-y border-(--color-border)',
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-btn-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id}>
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="flex min-h-12 w-full items-center justify-between gap-3 border-0 bg-transparent px-1 py-3 text-start text-(--color-fg) cursor-pointer hover:text-(--color-accent) transition-colors duration-(--motion-dur-fast)"
            >
              <span className="min-w-0 flex-1 text-[13px]">{item.title}</span>
              <span className="flex shrink-0 items-center gap-2">
                {item.meta ? (
                  <span className="text-[12px] text-(--color-subtle)">{item.meta}</span>
                ) : null}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : springs.fast}
                  className="inline-flex text-(--color-muted)"
                >
                  <ChevronDownIcon />
                </motion.span>
              </span>
            </button>

            {isOpen ? (
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : springs.fast}
                className="px-1 pb-4 text-[13px] text-(--color-muted)"
              >
                {item.content}
              </motion.div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
