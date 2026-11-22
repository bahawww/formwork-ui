import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { playClickSound, playHoverSound } from '../../lib/sound';

export interface SpringCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  meta?: string;
  disabled?: boolean;
}

const CHECK_PATH = 'M3.5 8.5L7 12L12.5 5.5';

export function SpringCheckbox({
  checked,
  onCheckedChange,
  label,
  meta,
  disabled = false,
}: SpringCheckboxProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const [toggleCount, setToggleCount] = useState(0);
  const reduceMotion = useReducedMotion();

  const toggle = () => {
    if (disabled) return;
    playClickSound();
    setToggleCount((count) => count + 1);
    onCheckedChange(!checked);
  };

  const shouldDraw = toggleCount > 0 && !reduceMotion;

  return (
    <div className={checked ? 'nx-check-row is-checked' : 'nx-check-row'}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        onMouseEnter={() => {
          if (!disabled) playHoverSound();
        }}
        onPointerDown={(event) => event.preventDefault()}
        onClick={toggle}
        className={
          checked ? 'nx-check-box squircle-corners is-checked' : 'nx-check-box squircle-corners'
        }
      >
        {checked ? (
          <svg viewBox="0 0 16 16" fill="none" className="nx-check-svg" aria-hidden="true">
            <motion.path
              d={CHECK_PATH}
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldDraw ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={shouldDraw ? springs.fast : { duration: 0 }}
            />
          </svg>
        ) : null}
      </button>

      <label id={labelId} htmlFor={id} className="nx-check-label-wrap">
        <span className="nx-check-text">
          {label}
          <motion.span
            aria-hidden="true"
            className="nx-check-strike"
            style={{ originX: 0 }}
            initial={false}
            animate={{ scaleX: checked ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : springs.settle}
          />
        </span>
      </label>

      {meta ? <span className="nx-check-meta">{meta}</span> : null}
    </div>
  );
}
