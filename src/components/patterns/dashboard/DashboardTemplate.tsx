import { useState } from 'react';
import { cn } from '../../../lib/cn';
import { AreaTrendChart, BarComparisonChart, DistributionBar } from '../../charts';
import {
  AlertBanner,
  Badge,
  DataTable,
  EmptyState,
  StatStrip,
  SurfaceSkeleton,
  useOptionalToast,
  type DataTableColumn,
} from '../../ui';
import {
  DASHBOARD_DATASETS,
  DEPLOYMENT_ROWS,
  type DeploymentRecord,
  type TimeframeKey,
} from './dashboardData';
import {
  DashboardShell,
  type DashboardSection,
  type DashboardViewState,
} from './DashboardShell';
import { DeploymentInspectorDrawer } from './DeploymentInspectorDrawer';

const STATUS_DOT: Record<DeploymentRecord['status'], string> = {
  Healthy: 'bg-(--color-success)',
  Canary: 'bg-(--color-accent)',
  Degraded: 'bg-(--color-error)',
};

const COLUMNS: readonly DataTableColumn<DeploymentRecord>[] = [
  {
    key: 'service',
    label: 'Service',
    sortable: true,
    sortValue: (row) => row.service,
    render: (row) => <span className="text-(--color-fg)">{row.service}</span>,
  },
  {
    key: 'region',
    label: 'Region',
    sortable: true,
    sortValue: (row) => row.region,
    render: (row) => <span className="font-mono text-[12px] text-(--color-muted)">{row.region}</span>,
  },
  {
    key: 'status',
    label: 'State',
    sortable: true,
    sortValue: (row) => row.status,
    render: (row) => (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className={cn('size-2 squircle', STATUS_DOT[row.status])} />
        <span>{row.status}</span>
      </span>
    ),
  },
  {
    key: 'p95Ms',
    label: 'p95',
    align: 'end',
    sortable: true,
    sortValue: (row) => row.p95Ms,
    render: (row) => <span>{row.p95Ms} ms</span>,
  },
  {
    key: 'errorRate',
    label: 'Errors',
    align: 'end',
    sortable: true,
    sortValue: (row) => row.errorRate,
    render: (row) => <span className="text-(--color-muted)">{row.errorRate}</span>,
  },
];

export function DashboardTemplate() {
  const [section, setSection] = useState<DashboardSection>('overview');
  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const [viewState, setViewState] = useState<DashboardViewState>('default');
  const [inspectedRow, setInspectedRow] = useState<DeploymentRecord | null>(null);
  const toastApi = useOptionalToast();

  const dataset = DASHBOARD_DATASETS[timeframe];
  const visibleRows =
    section === 'access'
      ? DEPLOYMENT_ROWS.filter(
          (row) => row.service === 'auth-session' || row.service === 'audit-archive',
        )
      : DEPLOYMENT_ROWS;

  return (
    <>
      <DashboardShell
        section={section}
        onSectionChange={setSection}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        viewState={viewState}
        onViewStateChange={setViewState}
      >
        {viewState === 'loading' ? (
          <SurfaceSkeleton variant="dashboard" />
        ) : viewState === 'error' ? (
          <AlertBanner
            tone="error"
            title="Telemetry stream disconnected"
            description="Edge aggregators stopped responding after 3,000ms. Cached metrics are paused."
            actionLabel="Retry stream"
            onAction={() => {
              setViewState('default');
              toastApi?.toast({
                title: 'Stream reconnected',
                description: `Live telemetry restored for ${timeframe}.`,
                tone: 'success',
              });
            }}
          />
        ) : viewState === 'empty' ? (
          <EmptyState
            title="No deployments in selected filter"
            description="No edge clusters matched this window. Restore the default telemetry window to continue inspecting."
            actionLabel="Restore sample data"
            onAction={() => setViewState('default')}
          />
        ) : (
          <>
            <StatStrip items={dataset.metrics} />

            {section !== 'deployments' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="min-w-0 lg:col-span-8">
                  <AreaTrendChart
                    title="Edge vs origin tail latency"
                    subtitle="Horizontal hairlines only, equal-lightness OKLCH strokes, and live keyboard scrubber."
                    labels={dataset.trendLabels}
                    series={dataset.trendSeries}
                    unit="ms"
                  />
                </div>
                <div className="min-w-0 flex flex-col gap-4 lg:col-span-4">
                  <DistributionBar
                    title="Request share by workload"
                    subtitle="Ranked bar with tabular ledger replaces noisy pie charts."
                    segments={dataset.trafficShares}
                    unit="%"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) px-4 py-3">
                    <span className="text-[13px] text-(--color-fg)">SLO gate status</span>
                    <Badge variant="dot" tone="success" pulse>
                      3/4 healthy
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-8">
                <DataTable
                  title="Active service deployments"
                  rows={visibleRows}
                  columns={COLUMNS}
                  pageSize={5}
                  searchText={(row) => `${row.service} ${row.region} ${row.status} ${row.owner}`}
                  onInspectRow={setInspectedRow}
                  inspectLabel="Inspect"
                />
              </div>
              <div className="min-w-0 lg:col-span-4">
                <BarComparisonChart
                  title="Latency by region"
                  subtitle="Zero-baseline monochrome bars with focused accent selection."
                  bars={dataset.regionLatency}
                  unit="ms"
                  orientation="horizontal"
                />
              </div>
            </div>
          </>
        )}
      </DashboardShell>

      <DeploymentInspectorDrawer record={inspectedRow} onClose={() => setInspectedRow(null)} />
    </>
  );
}
