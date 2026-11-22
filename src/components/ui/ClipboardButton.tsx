import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { easings } from '../../lib/motionTokens';
import { TactileButton, type TactileButtonSize, type TactileButtonVariant } from './TactileButton';

export interface ClipboardButtonProps {
  text: string;
  idleLabel: string;
  copiedLabel: string;
  variant?: TactileButtonVariant;
  size?: TactileButtonSize;
  idleIcon?: ReactNode;
  copiedIcon?: ReactNode;
  onCopyError?: (message: string) => void;
  className?: string;
}

function fallbackCopyText(value: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function ClipboardButton({
  text,
  idleLabel,
  copiedLabel,
  variant = 'outline',
  size = 'md',
  idleIcon,
  copiedIcon,
  onCopyError,
  className,
}: ClipboardButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    let ok = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        ok = true;
      } else {
        ok = fallbackCopyText(text);
      }
    } catch {
      ok = fallbackCopyText(text);
    }

    if (!ok) {
      onCopyError?.('Clipboard permission blocked. Open the source editor to copy manually.');
      return;
    }

    setCopied(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 1800);
  }, [text, onCopyError]);

  const swapTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.65, 0, 0.35, 1] as const };

  return (
    <>
      <TactileButton
        variant={variant}
        size={size}
        className={className}
        aria-label={copied ? copiedLabel : idleLabel}
        onClick={() => void handleCopy()}
      >
        <span className="nx-swap-grid" style={{ transitionTimingFunction: easings.inOut }}>
          <motion.span
            aria-hidden={copied}
            className="nx-swap-layer"
            initial={false}
            animate={
              copied
                ? { opacity: 0, scale: 0.96, filter: 'blur(1px)' }
                : { opacity: 1, scale: 1, filter: 'blur(0px)' }
            }
            transition={swapTransition}
          >
            {idleIcon}
            <span>{idleLabel}</span>
          </motion.span>
          <motion.span
            aria-hidden={!copied}
            className="nx-swap-layer"
            initial={false}
            animate={
              copied
                ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                : { opacity: 0, scale: 0.96, filter: 'blur(1px)' }
            }
            transition={swapTransition}
          >
            {copiedIcon}
            <span>{copiedLabel}</span>
          </motion.span>
        </span>
      </TactileButton>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </>
  );
}
