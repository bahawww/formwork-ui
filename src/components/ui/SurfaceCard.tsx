import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const cardVariants = cva('squircle-corners border transition-colors duration-(--motion-dur-fast)', {
  variants: {
    variant: {
      plain: 'bg-(--color-bg) border-(--color-border)',
      tinted: 'bg-(--color-surface) border-(--color-border)',
      glass: 'glass-surface',
    },
    radius: {
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
  },
  defaultVariants: {
    variant: 'tinted',
    radius: 'lg',
  },
});

export interface SurfaceCardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ variant, radius, className, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, radius }), className)} {...props} />
  ),
);
SurfaceCard.displayName = 'SurfaceCard';

export const SurfaceCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pt-5 pb-2 flex flex-col gap-1', className)} {...props} />
  ),
);
SurfaceCardHeader.displayName = 'SurfaceCardHeader';

export const SurfaceCardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 py-3 flex flex-col gap-4', className)} {...props} />
  ),
);
SurfaceCardBody.displayName = 'SurfaceCardBody';

export const SurfaceCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-5 py-3.5 border-t border-(--color-border) flex items-center justify-between gap-3',
        className,
      )}
      {...props}
    />
  ),
);
SurfaceCardFooter.displayName = 'SurfaceCardFooter';
