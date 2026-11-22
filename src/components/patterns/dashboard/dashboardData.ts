import type { BarDatum, DistributionSegment, TrendSeries } from '../../charts';
import type { StatStripItem } from '../../ui';

export type TimeframeKey = '7d' | '30d' | '90d';

export interface DeploymentRecord {
  id: string;
  service: string;
  region: string;
  status: 'Healthy' | 'Degraded' | 'Canary';
  p95Ms: number;
  errorRate: string;
  commit: string;
  owner: string;
  updatedAt: string;
  notes: string;
}

export interface TimeframeDataset {
  metrics: readonly StatStripItem[];
  trendLabels: readonly string[];
  trendSeries: readonly TrendSeries[];
  regionLatency: readonly BarDatum[];
  trafficShares: readonly DistributionSegment[];
}

export const DEPLOYMENT_ROWS: readonly DeploymentRecord[] = [
  {
    id: 'dep-01',
    service: 'api-gateway',
    region: 'sin-01',
    status: 'Healthy',
    p95Ms: 42,
    errorRate: '0.02%',
    commit: 'c8f21a9',
    owner: 'Rina Pratama',
    updatedAt: '4m ago',
    notes: 'Edge cache hit ratio rose 3.2% after HTTP/3 keepalive tuning.',
  },
  {
    id: 'dep-02',
    service: 'billing-ledger',
    region: 'fra-02',
    status: 'Healthy',
    p95Ms: 68,
    errorRate: '0.01%',
    commit: '9a4d11b',
    owner: 'Budi Santoso',
    updatedAt: '18m ago',
    notes: 'Idempotent webhook worker pool scaled to 16 replicas.',
  },
  {
    id: 'dep-03',
    service: 'search-indexer',
    region: 'iad-01',
    status: 'Degraded',
    p95Ms: 146,
    errorRate: '0.41%',
    commit: '71e04cc',
    owner: 'Sari Dewi',
    updatedAt: '31m ago',
    notes: 'Tail latency elevated during incremental vector compaction.',
  },
  {
    id: 'dep-04',
    service: 'auth-session',
    region: 'sin-01',
    status: 'Healthy',
    p95Ms: 29,
    errorRate: '0.00%',
    commit: '30ab8f1',
    owner: 'Dimas Putra',
    updatedAt: '1h ago',
    notes: 'Passkey verification path verified across WebAuthn fixtures.',
  },
  {
    id: 'dep-05',
    service: 'media-transcoder',
    region: 'fra-01',
    status: 'Canary',
    p95Ms: 91,
    errorRate: '0.08%',
    commit: 'f21c884',
    owner: 'Nadia Kusuma',
    updatedAt: '2h ago',
    notes: 'Canary routing at 10% traffic on GPU runner pool v4.',
  },
  {
    id: 'dep-06',
    service: 'event-ingest',
    region: 'iad-02',
    status: 'Healthy',
    p95Ms: 51,
    errorRate: '0.03%',
    commit: '4d92b7e',
    owner: 'Andi Wijaya',
    updatedAt: '3h ago',
    notes: 'Batch flush interval tuned to 250ms with zero dropped spans.',
  },
  {
    id: 'dep-07',
    service: 'webhook-relay',
    region: 'sin-02',
    status: 'Healthy',
    p95Ms: 38,
    errorRate: '0.01%',
    commit: '8b22e01',
    owner: 'Rina Pratama',
    updatedAt: '5h ago',
    notes: 'Signature rotation verified with dual active secrets.',
  },
  {
    id: 'dep-08',
    service: 'audit-archive',
    region: 'fra-02',
    status: 'Healthy',
    p95Ms: 74,
    errorRate: '0.00%',
    commit: '19ef44a',
    owner: 'Budi Santoso',
    updatedAt: '8h ago',
    notes: 'Parquet partition compaction finished within 4m SLA.',
  },
];

export const DASHBOARD_DATASETS: Record<TimeframeKey, TimeframeDataset> = {
  '7d': {
    metrics: [
      {
        id: 'req',
        label: 'Requests processed',
        value: '18.4M',
        delta: '+6.8%',
        tone: 'positive',
        note: 'vs prior 7d',
        sparkline: [21, 24, 23, 27, 29, 31, 34],
      },
      {
        id: 'p95',
        label: 'Median p95 latency',
        value: '46 ms',
        delta: '-4 ms',
        tone: 'positive',
        note: 'below 60 ms SLO',
        sparkline: [54, 52, 51, 49, 48, 47, 46],
      },
      {
        id: 'err',
        label: 'Error budget burn',
        value: '0.04%',
        delta: '+0.01%',
        tone: 'negative',
        note: 'search-indexer spike',
        sparkline: [2, 2, 3, 2, 5, 4, 4],
      },
      {
        id: 'uptime',
        label: 'Cluster availability',
        value: '99.98%',
        delta: '0.00%',
        tone: 'neutral',
        note: '4 regions active',
        sparkline: [99.9, 99.98, 99.97, 99.98, 99.99, 99.98, 99.98],
      },
    ],
    trendLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trendSeries: [
      { name: 'Edge p95 (ms)', values: [52, 49, 50, 47, 45, 44, 46] },
      { name: 'Origin p95 (ms)', values: [86, 84, 88, 82, 79, 77, 81] },
    ],
    regionLatency: [
      { label: 'US East', value: 38, note: 'Lowest origin hops' },
      { label: 'Frankfurt', value: 44, note: 'EU GDPR shard' },
      { label: 'Singapore', value: 46, highlight: true, note: 'Primary APAC hub' },
      { label: 'Tokyo', value: 53, note: 'Standby edge pop' },
    ],
    trafficShares: [
      { id: 'api', label: 'REST & JSON API', value: 54 },
      { id: 'stream', label: 'Event streams', value: 26 },
      { id: 'assets', label: 'Edge static cache', value: 14 },
      { id: 'webhooks', label: 'Signed webhooks', value: 6 },
    ],
  },
  '30d': {
    metrics: [
      {
        id: 'req',
        label: 'Requests processed',
        value: '74.2M',
        delta: '+11.4%',
        tone: 'positive',
        note: 'vs prior 30d',
        sparkline: [61, 64, 66, 68, 70, 72, 74],
      },
      {
        id: 'p95',
        label: 'Median p95 latency',
        value: '48 ms',
        delta: '-7 ms',
        tone: 'positive',
        note: 'below 60 ms SLO',
        sparkline: [58, 56, 54, 52, 50, 49, 48],
      },
      {
        id: 'err',
        label: 'Error budget burn',
        value: '0.03%',
        delta: '-0.02%',
        tone: 'positive',
        note: 'within monthly budget',
        sparkline: [5, 5, 4, 4, 3, 3, 3],
      },
      {
        id: 'uptime',
        label: 'Cluster availability',
        value: '99.97%',
        delta: '+0.02%',
        tone: 'positive',
        note: 'zero Sev-1 events',
        sparkline: [99.94, 99.95, 99.96, 99.97, 99.97, 99.98, 99.97],
      },
    ],
    trendLabels: ['W1', 'W2', 'W3', 'W4'],
    trendSeries: [
      { name: 'Edge p95 (ms)', values: [55, 51, 49, 48] },
      { name: 'Origin p95 (ms)', values: [92, 87, 83, 80] },
    ],
    regionLatency: [
      { label: 'US East', value: 40, note: 'Stable baseline' },
      { label: 'Frankfurt', value: 45, note: 'Low jitter' },
      { label: 'Singapore', value: 48, highlight: true, note: '18% traffic growth' },
      { label: 'Tokyo', value: 57, note: 'Warm standby' },
    ],
    trafficShares: [
      { id: 'api', label: 'REST & JSON API', value: 51 },
      { id: 'stream', label: 'Event streams', value: 29 },
      { id: 'assets', label: 'Edge static cache', value: 13 },
      { id: 'webhooks', label: 'Signed webhooks', value: 7 },
    ],
  },
  '90d': {
    metrics: [
      {
        id: 'req',
        label: 'Requests processed',
        value: '212.6M',
        delta: '+19.2%',
        tone: 'positive',
        note: 'quarterly growth',
        sparkline: [165, 174, 182, 190, 198, 206, 212],
      },
      {
        id: 'p95',
        label: 'Median p95 latency',
        value: '51 ms',
        delta: '-11 ms',
        tone: 'positive',
        note: 'post-HTTP/3 rollout',
        sparkline: [64, 62, 59, 56, 54, 52, 51],
      },
      {
        id: 'err',
        label: 'Error budget burn',
        value: '0.03%',
        delta: '-0.04%',
        tone: 'positive',
        note: 'SLA target met',
        sparkline: [7, 6, 5, 5, 4, 3, 3],
      },
      {
        id: 'uptime',
        label: 'Cluster availability',
        value: '99.96%',
        delta: '+0.03%',
        tone: 'positive',
        note: 'quarterly audit passed',
        sparkline: [99.92, 99.93, 99.95, 99.95, 99.96, 99.96, 99.96],
      },
    ],
    trendLabels: ['Sep', 'Oct', 'Nov'],
    trendSeries: [
      { name: 'Edge p95 (ms)', values: [58, 53, 47] },
      { name: 'Origin p95 (ms)', values: [96, 88, 81] },
    ],
    regionLatency: [
      { label: 'US East', value: 42, note: 'Quarterly median' },
      { label: 'Frankfurt', value: 47, note: 'Quarterly median' },
      { label: 'Singapore', value: 51, highlight: true, note: 'Primary APAC hub' },
      { label: 'Tokyo', value: 60, note: 'Standby pop' },
    ],
    trafficShares: [
      { id: 'api', label: 'REST & JSON API', value: 49 },
      { id: 'stream', label: 'Event streams', value: 31 },
      { id: 'assets', label: 'Edge static cache', value: 14 },
      { id: 'webhooks', label: 'Signed webhooks', value: 6 },
    ],
  },
};
