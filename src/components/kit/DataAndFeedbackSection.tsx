import { useState } from 'react';
import { LockIcon } from '../Icons';
import {
  AlertBanner,
  Avatar,
  Badge,
  DataTable,
  EmptyState,
  ProgressBar,
  StatStrip,
  SurfaceSkeleton,
  TactileButton,
  type DataTableColumn,
} from '../ui';

interface SampleServiceRow {
  id: string;
  name: string;
  tier: string;
  status: 'Active' | 'Paused';
  latencyMs: number;
}

const SAMPLE_ROWS: readonly SampleServiceRow[] = [
  { id: 'r1', name: 'auth-edge', tier: 'Core', status: 'Active', latencyMs: 28 },
  { id: 'r2', name: 'ledger-api', tier: 'Core', status: 'Active', latencyMs: 64 },
  { id: 'r3', name: 'report-worker', tier: 'Batch', status: 'Paused', latencyMs: 112 },
  { id: 'r4', name: 'webhook-sink', tier: 'Edge', status: 'Active', latencyMs: 39 },
];

const SAMPLE_COLUMNS: readonly DataTableColumn<SampleServiceRow>[] = [
  {
    key: 'name',
    label: 'Module',
    sortable: true,
    sortValue: (row) => row.name,
    render: (row) => <span className="text-(--color-fg)">{row.name}</span>,
  },
  {
    key: 'tier',
    label: 'Tier',
    sortable: true,
    sortValue: (row) => row.tier,
    render: (row) => <span className="text-(--color-muted)">{row.tier}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Badge variant="dot" tone={row.status === 'Active' ? 'success' : 'neutral'} size="sm">
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'latencyMs',
    label: 'p95',
    align: 'end',
    sortable: true,
    sortValue: (row) => row.latencyMs,
    render: (row) => <span>{row.latencyMs} ms</span>,
  },
];

export function DataAndFeedbackSection() {
  const [progress, setProgress] = useState(68);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [tags, setTags] = useState(['Tailwind v4', 'WCAG AA', 'OKLCH Harmony']);

  return (
    <section className="flex flex-col gap-5" aria-label="Data display and state feedback">
      <div>
        <h2 className="m-0 text-[18px] font-title text-(--color-fg)">Data display, indicators, and states</h2>
        <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
          Hairline metric strips, sortable tables, GPU-composited progress bars, alert banners, and skeleton fallbacks.
        </p>
      </div>

      <StatStrip
        items={[
          { id: 'm1', label: 'Median p95', value: '42 ms', delta: '-6%', tone: 'positive', sparkline: [52, 48, 46, 44, 42] },
          { id: 'm2', label: 'Rule checks', value: '62 files', delta: '100% pass', tone: 'positive', sparkline: [55, 58, 60, 62, 62] },
          { id: 'm3', label: 'Bundle CSS', value: '44 kB', delta: 'gzip 9.2 kB', tone: 'neutral', sparkline: [49, 47, 46, 45, 44] },
          { id: 'm4', label: 'Contrast AA', value: '0.78 L', delta: 'Light & Dark', tone: 'positive', sparkline: [0.7, 0.72, 0.75, 0.78, 0.78] },
        ]}
      />

      <DataTable
        title="Reusable primitive inventory"
        rows={SAMPLE_ROWS}
        columns={SAMPLE_COLUMNS}
        pageSize={3}
        searchText={(row) => `${row.name} ${row.tier} ${row.status}`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-4">
          <ProgressBar label="Design token adoption" value={progress} tone="accent" />
          <div className="flex flex-wrap gap-2">
            <TactileButton
              variant="outline"
              size="sm"
              onClick={() => setProgress((prev) => (prev >= 100 ? 25 : Math.min(100, prev + 16)))}
            >
              Step progress
            </TactileButton>
            <TactileButton
              variant="outline"
              size="sm"
              onClick={() => setShowSkeleton((prev) => !prev)}
            >
              {showSkeleton ? 'Show empty state' : 'Preview table skeleton'}
            </TactileButton>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-4">
          <Avatar name="Rina Pratama" size="sm" status="online" />
          <Avatar name="Budi Santoso" size="md" status="busy" />
          <Avatar name="Sari Dewi" size="lg" status="offline" />
          <Badge variant="dot" tone="success" pulse>
            Healthy cluster
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="muted"
              dismissLabel={`Remove ${tag}`}
              onDismiss={() => setTags((prev) => prev.filter((item) => item !== tag))}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AlertBanner
          tone="info"
          title="OKLCH contrast verified"
          description="Foreground and muted ink stay above 0.50 lightness delta in both light and dark modes."
        />
        <AlertBanner
          tone="warning"
          title="Zoomed Y-axis disclosure required"
          description="When a line chart crops below zero, pair it with an explicit scale notice."
        />
      </div>

      {showSkeleton ? (
        <SurfaceSkeleton variant="table" />
      ) : (
        <EmptyState
          icon={<LockIcon />}
          title="No custom webhooks configured"
          description="Add an HTTPS endpoint to stream schema audit events."
          actionLabel="Restore removed badges"
          onAction={() => setTags(['Tailwind v4', 'WCAG AA', 'OKLCH Harmony'])}
        />
      )}
    </section>
  );
}
