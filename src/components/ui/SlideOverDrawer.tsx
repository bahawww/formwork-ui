import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { CloseIcon } from '../Icons';
import { TactileButton } from './TactileButton';

export interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: 'start' | 'end';
  children: ReactNode;
  footer?: ReactNode;
}

export function SlideOverDrawer({
  isOpen,
  onClose,
  title,
  description,
  side = 'end',
  children,
  footer,
}: SlideOverDrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const reduceMotion = useReducedMotion();

  useFocusTrap({
    isOpen,
    containerRef: panelRef,
    initialFocusRef: closeBtnRef,
    onClose,
  });

  if (typeof document === 'undefined') return null;

  const hiddenOffset = side === 'start' ? -28 : 28;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          data-backdrop="true"
          className={cn('drawer-backdrop', side === 'end' ? 'justify-end' : 'justify-start')}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.16 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className={cn(
              'drawer-panel flex flex-col p-5',
              side === 'start' ? 'border-e' : 'border-s',
            )}
            initial={reduceMotion ? false : { x: hiddenOffset, opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { x: hiddenOffset, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : springs.settle}
          >
            <div className="flex items-start justify-between gap-3 border-b border-(--color-border) pb-4">
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="m-0 text-[16px] font-medium text-(--color-fg)">
                  {title}
                </h2>
                {description ? (
                  <p id={descId} className="m-0 mt-1 text-[13px] text-(--color-muted)">
                    {description}
                  </p>
                ) : null}
              </div>
              <TactileButton
                ref={closeBtnRef}
                variant="icon"
                size="sm"
                aria-label="Close drawer"
                onClick={onClose}
              >
                <CloseIcon />
              </TactileButton>
            </div>

            <div className="flex-1 overflow-y-auto py-4">{children}</div>

            {footer ? (
              <div className="border-t border-(--color-border) pt-4 flex items-center justify-end gap-2">
                {footer}
              </div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
