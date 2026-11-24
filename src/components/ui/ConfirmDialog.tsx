import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { TactileButton } from './TactileButton';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const reduceMotion = useReducedMotion();

  useFocusTrap({
    isOpen,
    containerRef: dialogRef,
    initialFocusRef: cancelBtnRef,
    onClose: onCancel,
  });

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
          transition={reduceMotion ? { duration: 0 } : { duration: 0.16 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onCancel();
            }
          }}
        >
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="modal-dialog squircle-corners"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
            transition={reduceMotion ? { duration: 0 } : springs.fast}
          >
            <h2 id={titleId} className="m-0 text-[16px] font-medium text-(--color-fg)">
              {title}
            </h2>
            <p id={descId} className="m-0 mt-2 text-[13px] text-(--color-muted)">
              {description}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <TactileButton ref={cancelBtnRef} variant="outline" size="sm" onClick={onCancel}>
                {cancelLabel}
              </TactileButton>
              <TactileButton
                variant={destructive ? 'destructive' : 'solid'}
                size="sm"
                onClick={onConfirm}
              >
                {confirmLabel}
              </TactileButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
