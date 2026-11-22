import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { playHoverSound, playTickSound } from '../../lib/sound';

export interface TactileSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  displayValue: string;
  onChange: (nextValue: number) => void;
  disabled?: boolean;
}

export function TactileSlider({
  value,
  min,
  max,
  step,
  label,
  displayValue,
  onChange,
  disabled = false,
}: TactileSliderProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const reduceMotion = useReducedMotion();

  const span = Math.max(1e-9, max - min);
  const percent = Math.max(0, Math.min(100, ((value - min) / span) * 100));

  return (
    <div className="nx-slider-field">
      <div className="nx-slider-top">
        <label htmlFor={id} className="nx-slider-label">
          {label}
        </label>
        <span className="nx-slider-value tabular">{displayValue}</span>
      </div>

      <div className="nx-slider-wrap">
        <div className="nx-slider-track squircle-corners">
          <motion.div
            className="nx-slider-fill"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={reduceMotion || dragging ? { duration: 0 } : springs.settle}
          />
        </div>
        <motion.div
          className="nx-slider-handle squircle"
          aria-hidden="true"
          initial={false}
          animate={{
            left: `calc(${percent}% - 3px)`,
            scaleY: dragging ? 1.25 : 1,
          }}
          transition={reduceMotion ? { duration: 0 } : springs.fast}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          className="nx-slider-native"
          onMouseEnter={() => {
            if (!disabled) playHoverSound();
          }}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onBlur={() => setDragging(false)}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (next !== value) {
              playTickSound();
              onChange(next);
            }
          }}
        />
      </div>
    </div>
  );
}
