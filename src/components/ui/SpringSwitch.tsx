import { useCallback, useId } from 'react';
import { motion, useMotionValue, useReducedMotion, animate } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { playClickSound, playHoverSound } from '../../lib/sound';

export interface SpringSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function SpringSwitch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
}: SpringSwitchProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const reduceMotion = useReducedMotion();
  const thumbScaleX = useMotionValue(1);

  const settleThumb = useCallback(() => {
    if (reduceMotion) return;
    animate(thumbScaleX, 1, springs.settle);
  }, [reduceMotion, thumbScaleX]);

  const handleToggle = () => {
    if (disabled) return;
    playClickSound();
    onCheckedChange(!checked);
  };

  return (
    <div className="nx-switch-row">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        className={checked ? 'nx-switch-track squircle is-checked' : 'nx-switch-track squircle'}
        onMouseEnter={() => {
          if (!disabled) playHoverSound();
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          if (disabled || reduceMotion) return;
          animate(thumbScaleX, 1.15, springs.press);
        }}
        onPointerUp={settleThumb}
        onPointerCancel={settleThumb}
        onPointerLeave={settleThumb}
        onClick={handleToggle}
      >
        <motion.span
          className="nx-switch-thumb squircle"
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          style={{ scaleX: thumbScaleX, originX: checked ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : springs.settle}
        />
      </button>
      <label
        id={labelId}
        htmlFor={id}
        className="nx-switch-label"
      >
        {label}
      </label>
    </div>
  );
}
