export const CHART_SERIES_TOKENS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-chart-neutral)',
] as const;

export const CHART_DASH_PATTERNS: ReadonlyArray<string | undefined> = [
  undefined,
  '6 3',
  '2 3',
  '8 3 2 3',
  '10 4',
];

export function computeNiceTicks(minVal: number, maxVal: number, count = 4): number[] {
  const safeCount = Math.max(2, count);
  const rawSpan = Math.max(1, maxVal - minVal);
  const step = rawSpan / (safeCount - 1);
  return Array.from({ length: safeCount }, (_, idx) => {
    const val = minVal + idx * step;
    if (Math.abs(val) >= 100) return Math.round(val);
    if (Math.abs(val) >= 10) return Math.round(val * 10) / 10;
    return Math.round(val * 100) / 100;
  });
}

export function formatChartValue(value: number, unit?: string): string {
  const formatted = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (unit === '$') {
    return `$${formatted}`;
  }
  if (unit === '%') {
    return `${formatted}%`;
  }
  return unit ? `${formatted} ${unit}` : formatted;
}
