import { useId } from 'react';
import { cn } from '../../lib/cn';

export interface SparklineProps {
  values: readonly number[];
  ariaLabel: string;
  tone?: 'accent' | 'neutral' | 'success' | 'warning' | 'error';
  height?: number;
  className?: string;
}

const TONE_STROKE: Record<NonNullable<SparklineProps['tone']>, string> = {
  accent: 'var(--color-chart-1)',
  neutral: 'var(--color-fg)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
};

export function Sparkline({
  values,
  ariaLabel,
  tone = 'accent',
  height = 28,
  className,
}: SparklineProps) {
  const titleId = useId();

  if (values.length < 2) {
    return null;
  }

  const width = 96;
  const pad = 3;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const span = Math.max(1e-6, maxVal - minVal);

  const coords = values.map((val, idx) => {
    const x = pad + (idx / (values.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (val - minVal) / span) * (height - pad * 2);
    return { x, y };
  });

  const points = coords.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  const last = coords[coords.length - 1];
  const stroke = TONE_STROKE[tone];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-labelledby={titleId}
      className={cn('shrink-0 overflow-visible', className)}
    >
      <title id={titleId}>{ariaLabel}</title>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {last ? <circle cx={last.x} cy={last.y} r="2.2" fill={stroke} /> : null}
    </svg>
  );
}
