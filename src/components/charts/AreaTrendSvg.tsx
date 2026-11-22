import { CHART_DASH_PATTERNS, CHART_SERIES_TOKENS, formatChartValue } from './chartTokens';

export interface AreaTrendSvgProps {
  titleId: string;
  descId: string;
  gradId: string;
  title: string;
  subtitle?: string;
  labels: readonly string[];
  series: ReadonlyArray<{ name: string; values: readonly number[] }>;
  hidden: Record<string, boolean>;
  hoveredSeries: string | null;
  visibleCount: number;
  firstVisibleName?: string;
  ticks: readonly number[];
  minVal: number;
  span: number;
  height: number;
  clampedIndex: number;
  unit?: string;
  onInspectIndex: (idx: number) => void;
}

export function AreaTrendSvg({
  titleId,
  descId,
  gradId,
  title,
  subtitle,
  labels,
  series,
  hidden,
  hoveredSeries,
  visibleCount,
  firstVisibleName,
  ticks,
  minVal,
  span,
  height,
  clampedIndex,
  unit,
  onInspectIndex,
}: AreaTrendSvgProps) {
  const width = 680;
  const padLeft = 46;
  const padRight = 64;
  const padTop = 18;
  const padBottom = 32;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const xAt = (idx: number) =>
    labels.length <= 1 ? padLeft : padLeft + (idx / (labels.length - 1)) * chartW;
  const yAt = (val: number) => padTop + chartH - ((val - minVal) / span) * chartH;

  const stepX = labels.length > 1 ? chartW / (labels.length - 1) : chartW;
  const labelStride = labels.length > 8 ? Math.ceil(labels.length / 6) : 1;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{subtitle ?? `${title} across ${labels.length} intervals`}</desc>

      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.14} />
          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {ticks.map((tick, idx) => {
        const y = yAt(tick);
        return (
          <g key={`tick-${idx}`}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth="1"
              strokeOpacity={idx === 0 ? 1 : 0.65}
            />
            <text
              x={padLeft - 8}
              y={y + 4}
              textAnchor="end"
              fill="var(--color-subtle)"
              fontSize="11"
              className="tabular"
            >
              {tick}
            </text>
          </g>
        );
      })}

      <line
        x1={xAt(clampedIndex)}
        y1={padTop}
        x2={xAt(clampedIndex)}
        y2={padTop + chartH}
        stroke="var(--color-border-strong)"
        strokeDasharray="3 3"
        strokeWidth="1"
      />

      {series.map((item, idx) => {
        if (hidden[item.name]) return null;
        const color = CHART_SERIES_TOKENS[idx % CHART_SERIES_TOKENS.length]!;
        const dash = CHART_DASH_PATTERNS[idx % CHART_DASH_PATTERNS.length];
        const slice = item.values.slice(0, labels.length);
        const pts = slice.map((val, ptIdx) => `${xAt(ptIdx).toFixed(1)},${yAt(val).toFixed(1)}`);
        const isDimmed = hoveredSeries !== null && hoveredSeries !== item.name;
        const lastVal = slice[slice.length - 1];
        const areaPath =
          firstVisibleName === item.name && slice.length >= 2
            ? `M ${xAt(0).toFixed(1)},${(padTop + chartH).toFixed(1)} L ${pts.join(' L ')} L ${xAt(slice.length - 1).toFixed(1)},${(padTop + chartH).toFixed(1)} Z`
            : null;

        return (
          <g
            key={item.name}
            style={{
              opacity: isDimmed ? 0.22 : 1,
              transition: 'opacity var(--motion-dur-fast) var(--motion-ease-out)',
            }}
          >
            {areaPath ? <path d={areaPath} fill={`url(#${gradId})`} /> : null}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={dash}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pts.join(' ')}
            />
            {slice.map((val, ptIdx) => (
              <circle
                key={`${item.name}-${ptIdx}`}
                cx={xAt(ptIdx)}
                cy={yAt(val)}
                r={ptIdx === clampedIndex ? 4 : 2.5}
                fill={color}
              />
            ))}
            {visibleCount <= 3 && lastVal !== undefined ? (
              <text
                x={width - padRight + 8}
                y={yAt(lastVal) + 4}
                fill={color}
                fontSize="11"
                className="tabular"
              >
                {formatChartValue(lastVal, unit)}
              </text>
            ) : null}
          </g>
        );
      })}

      {labels.map((label, idx) => {
        const showTickLabel =
          idx === clampedIndex || idx === labels.length - 1 || idx % labelStride === 0;
        return (
          <g
            key={`${label}-${idx}`}
            tabIndex={0}
            role="button"
            aria-label={`Inspect ${label}`}
            onMouseEnter={() => onInspectIndex(idx)}
            onFocus={() => onInspectIndex(idx)}
            onClick={() => onInspectIndex(idx)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onInspectIndex(idx);
              }
            }}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            <rect
              x={xAt(idx) - Math.max(12, stepX / 2)}
              y={padTop}
              width={Math.max(24, stepX)}
              height={chartH + 24}
              fill="transparent"
            />
            {showTickLabel ? (
              <text
                x={xAt(idx)}
                y={height - 8}
                textAnchor="middle"
                fill={idx === clampedIndex ? 'var(--color-fg)' : 'var(--color-muted)'}
                fontSize="11"
              >
                {label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
