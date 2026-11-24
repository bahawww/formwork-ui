import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { animate, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { springs } from '../../lib/motionTokens';
import { playClickSound, playHoverSound } from '../../lib/sound';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-1.5 rounded-md squircle-corners font-title',
    'whitespace-nowrap select-none cursor-pointer border',
    'transition-[background-color,border-color,color,opacity] duration-(--motion-dur-fast) ease-(--motion-ease-out)',
    'motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)',
    'disabled:opacity-48 disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      variant: {
        solid: 'bg-(--color-fg) border-(--color-fg) text-(--color-bg) hover:opacity-90',
        outline:
          'bg-transparent border-(--color-border) text-(--color-fg) hover:bg-(--color-surface) hover:border-(--color-border-strong)',
        ghost:
          'bg-transparent border-transparent text-(--color-muted) hover:bg-(--color-surface-2) hover:text-(--color-fg)',
        glass: 'glass-bar border text-(--color-fg) hover:opacity-92',
        destructive:
          'bg-(--color-error) border-(--color-error) text-(--color-bg) hover:opacity-90',
        icon: 'bg-transparent border-(--color-border) text-(--color-muted) hover:bg-(--color-surface) hover:text-(--color-fg)',
      },
      size: {
        sm: 'min-h-9 px-3 text-[13px] nx-hit-expand',
        md: 'min-h-11 px-4 text-[13px]',
        lg: 'min-h-12 px-5 text-sm',
      },
    },
    compoundVariants: [
      {
        variant: 'icon',
        size: 'sm',
        className: 'w-9 px-0',
      },
      {
        variant: 'icon',
        size: 'md',
        className: 'w-11 px-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        className: 'w-12 px-0',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
);

export type TactileButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type TactileButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface TactileButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingLabel?: string;
}

function CalmSpinner() {
  return (
    <svg
      className="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-25"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-85"
      />
    </svg>
  );
}

export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      type = 'button',
      disabled = false,
      loading = false,
      loadingLabel,
      className,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      onMouseEnter,
      onClick,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLButtonElement | null>(null);
    const pressedRef = useRef(false);
    const animRef = useRef<ReturnType<typeof animate> | null>(null);
    const reduceMotion = useReducedMotion();
    const isDisabled = disabled || loading;

    useEffect(() => () => animRef.current?.stop(), []);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const settle = useCallback(() => {
      if (!pressedRef.current) return;
      pressedRef.current = false;
      const el = internalRef.current;
      if (!el || reduceMotion) return;
      animRef.current?.stop();
      animRef.current = animate(el, { scale: 1, y: 0 }, { ...springs.settle });
    }, [reduceMotion]);

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || isDisabled || reduceMotion) return;
        const el = internalRef.current;
        if (!el) return;
        pressedRef.current = true;
        animRef.current?.stop();
        animRef.current = animate(el, { scale: 0.97, y: 1 }, { ...springs.press });
      },
      [onPointerDown, isDisabled, reduceMotion],
    );

    const handlePointerUp = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        onPointerUp?.(event);
        settle();
      },
      [onPointerUp, settle],
    );

    const handlePointerCancel = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        onPointerCancel?.(event);
        settle();
      },
      [onPointerCancel, settle],
    );

    const handlePointerLeave = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event);
        settle();
      },
      [onPointerLeave, settle],
    );

    const handleMouseEnter = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled) playHoverSound();
        onMouseEnter?.(event);
      },
      [onMouseEnter, isDisabled],
    );

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }
        playClickSound();
        onClick?.(event);
      },
      [onClick, isDisabled],
    );

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-label={loading && loadingLabel ? loadingLabel : ariaLabel}
        className={cn(buttonVariants({ variant, size }), className)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <span className="relative inline-flex items-center justify-center">
            <span className="invisible inline-flex items-center gap-1.5" aria-hidden="true">
              {children}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <CalmSpinner />
            </span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

TactileButton.displayName = 'TactileButton';
