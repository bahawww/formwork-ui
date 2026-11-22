import { forwardRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { EyeIcon, EyeOffIcon, LockIcon } from '../Icons';
import { TextField, type TextFieldProps } from './TextField';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type' | 'trailingSlot'> {
  showStrength?: boolean;
}

function measureStrength(value: string): { score: number; label: string } {
  if (!value) return { score: 0, label: 'Empty' };
  let score = 1;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  const labels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] ?? 'Fair' };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, value, defaultValue, onChange, containerClassName, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [internalVal, setInternalVal] = useState(
      typeof defaultValue === 'string' ? defaultValue : '',
    );
    const reduceMotion = useReducedMotion();

    const currentText = typeof value === 'string' ? value : internalVal;
    const strength = measureStrength(currentText);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <TextField
          ref={ref}
          type={visible ? 'text' : 'password'}
          value={value}
          defaultValue={defaultValue}
          leadingIcon={<LockIcon />}
          onChange={(event) => {
            if (value === undefined) {
              setInternalVal(event.target.value);
            }
            onChange?.(event);
          }}
          trailingSlot={
            <button
              type="button"
              aria-label={visible ? 'Hide password' : 'Show password'}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => setVisible((prev) => !prev)}
              className="relative inline-flex size-8 items-center justify-center rounded-xs squircle-corners text-(--color-muted) hover:bg-(--color-surface-2) hover:text-(--color-fg) transition-colors duration-(--motion-dur-fast) cursor-pointer border-0 bg-transparent nx-hit-expand"
            >
              <span className="sr-only">{visible ? 'Hide' : 'Show'}</span>
              <motion.span
                key={visible ? 'hide' : 'show'}
                initial={reduceMotion ? false : { opacity: 0.4, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.14 }}
                className="inline-flex"
              >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
              </motion.span>
            </button>
          }
          {...props}
        />

        {showStrength && currentText.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={cn(
                    'h-1 rounded-xs transition-colors duration-(--motion-dur-fast)',
                    step <= strength.score
                      ? strength.score >= 3
                        ? 'bg-(--color-fg)'
                        : 'bg-(--color-warning)'
                      : 'bg-(--color-surface-2)',
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-(--color-muted) tabular-nums">
              {strength.label}
            </span>
          </div>
        ) : null}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
