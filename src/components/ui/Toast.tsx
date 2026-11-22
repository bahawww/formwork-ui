import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { CloseIcon } from '../Icons';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'error';

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
}

interface ToastItem extends ToastInput {
  id: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_DOT: Record<ToastTone, string> = {
  neutral: 'bg-(--color-subtle)',
  success: 'bg-(--color-success)',
  warning: 'bg-(--color-warning)',
  error: 'bg-(--color-error)',
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

export function useOptionalToast(): ToastContextValue | null {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const entry: ToastItem = {
        ...input,
        id,
        tone: input.tone ?? 'neutral',
      };
      setToasts((prev) => [...prev.slice(-3), entry]);

      const duration = input.durationMs ?? 3600;
      if (duration > 0) {
        const timer = window.setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timersRef.current;
    return () => {
      map.forEach((handle) => window.clearTimeout(handle));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-live="polite"
              aria-atomic="false"
              className="fixed bottom-4 inset-e-4 z-55 flex w-[min(360px,calc(100vw-32px))] flex-col gap-2 pointer-events-none"
            >
              <AnimatePresence initial={false}>
                {toasts.map((item) => (
                  <motion.div
                    key={item.id}
                    layout={!reduceMotion}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 12, scale: 0.96, filter: 'blur(2px)' }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, y: 8, scale: 0.96, filter: 'blur(2px)' }
                    }
                    transition={reduceMotion ? { duration: 0 } : springs.settle}
                    className="glass-surface pointer-events-auto flex items-start gap-3 rounded-lg squircle-corners px-3.5 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className={cn('mt-1.5 size-2 shrink-0 squircle', TONE_DOT[item.tone])}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-(--color-fg)">{item.title}</div>
                      {item.description ? (
                        <p className="m-0 mt-0.5 text-[12px] text-(--color-muted)">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      aria-label="Dismiss notification"
                      onClick={() => dismiss(item.id)}
                      className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-xs text-(--color-muted) hover:bg-(--color-surface-2) hover:text-(--color-fg) border-0 bg-transparent cursor-pointer nx-hit-expand"
                    >
                      <CloseIcon />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}
