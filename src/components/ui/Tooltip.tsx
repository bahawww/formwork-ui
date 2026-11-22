import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motionTokens';

export interface TooltipProps {
  content: string;
  children: ReactNode;
}

interface TipCoords {
  top: number;
  left: number;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<TipCoords>({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const tooltipId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const show = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      const el = anchorRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top - 8,
          left: rect.left + rect.width / 2,
        });
      }
      setOpen(true);
    }, 140);
  };

  const hide = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
  };

  const childWithAria = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': open ? tooltipId : undefined,
      })
    : children;

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {childWithAria}
      </span>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  id={tooltipId}
                  role="tooltip"
                  initial={reduceMotion ? false : { opacity: 0, y: 3, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 2, scale: 0.97 }}
                  transition={reduceMotion ? { duration: 0 } : springs.fast}
                  style={{
                    position: 'fixed',
                    top: coords.top,
                    left: coords.left,
                    transform: 'translate(-50%, -100%)',
                    zIndex: 60,
                    pointerEvents: 'none',
                  }}
                  className="glass-surface rounded-sm squircle-corners px-2.5 py-1.5 text-[12px] text-(--color-fg) whitespace-nowrap"
                >
                  {content}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
