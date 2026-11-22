import { useState, type ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import {
  BarChartIcon,
  LayersIcon,
  LayoutGridIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshIcon,
  SidebarIcon,
  UsersIcon,
} from '../../Icons';
import {
  Breadcrumb,
  DropdownMenu,
  SegmentedControl,
  SlideOverDrawer,
  TactileButton,
  useOptionalToast,
} from '../../ui';
import type { TimeframeKey } from './dashboardData';

export type DashboardSection = 'overview' | 'deployments' | 'analytics' | 'access';
export type DashboardViewState = 'default' | 'loading' | 'empty' | 'error';

const NAV_ITEMS: ReadonlyArray<{ id: DashboardSection; label: string; icon: ReactNode }> = [
  { id: 'overview', label: 'Overview', icon: <LayoutGridIcon /> },
  { id: 'deployments', label: 'Deployments', icon: <LayersIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { id: 'access', label: 'Access', icon: <UsersIcon /> },
];

export interface DashboardShellProps {
  section: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  timeframe: TimeframeKey;
  onTimeframeChange: (tf: TimeframeKey) => void;
  viewState: DashboardViewState;
  onViewStateChange: (state: DashboardViewState) => void;
  children: ReactNode;
}

export function DashboardShell({
  section,
  onSectionChange,
  timeframe,
  onTimeframeChange,
  viewState,
  onViewStateChange,
  children,
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toastApi = useOptionalToast();
  const activeItem = NAV_ITEMS.find((item) => item.id === section) ?? NAV_ITEMS[0]!;

  const renderNavButtons = (collapsed: boolean, onPicked?: () => void) => (
    <nav aria-label="Dashboard sections" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = item.id === section;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? 'page' : undefined}
            aria-label={collapsed ? item.label : undefined}
            onClick={() => {
              onSectionChange(item.id);
              onPicked?.();
            }}
            className={cn(
              'flex min-h-10 items-center gap-2.5 rounded-sm squircle-corners border-0 px-2.5 py-2 text-[13px] cursor-pointer text-start',
              'transition-colors duration-(--motion-dur-fast)',
              collapsed ? 'justify-center px-0' : '',
              active
                ? 'bg-(--color-surface-2) text-(--color-fg)'
                : 'bg-transparent text-(--color-muted) hover:bg-(--color-surface) hover:text-(--color-fg)',
            )}
          >
            <span aria-hidden="true" className={active ? 'text-(--color-accent)' : undefined}>
              {item.icon}
            </span>
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="overflow-hidden rounded-xl squircle-corners border border-(--color-border) bg-(--color-bg)">
      <div className="flex min-h-[640px]">
        <aside
          aria-label="Dashboard navigation rail"
          className={cn(
            'hidden shrink-0 flex-col justify-between border-e border-(--color-border) bg-(--color-surface) p-3 lg:flex',
            sidebarCollapsed ? 'w-15' : 'w-56',
          )}
        >
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                'flex items-center px-1',
                sidebarCollapsed ? 'justify-center' : 'justify-between gap-2',
              )}
            >
              {!sidebarCollapsed ? (
                <span className="truncate text-[13px] text-(--color-fg)">Cluster control</span>
              ) : null}
              <TactileButton
                variant="icon"
                size="sm"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setSidebarCollapsed((prev) => !prev)}
              >
                <SidebarIcon />
              </TactileButton>
            </div>
            {renderNavButtons(sidebarCollapsed)}
          </div>

          {!sidebarCollapsed ? (
            <div className="rounded-md squircle-corners border border-(--color-border) bg-(--color-bg) p-3 text-[12px] text-(--color-muted)">
              Macro rail stays 224px expanded or 60px collapsed so telemetry keeps full horizontal room.
            </div>
          ) : null}
        </aside>

        <div className="min-w-0 flex-1 flex flex-col">
          <div className="glass-bar flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="lg:hidden">
                <TactileButton
                  variant="icon"
                  size="sm"
                  aria-label="Open dashboard menu"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <SidebarIcon />
                </TactileButton>
              </div>
              <Breadcrumb
                items={[
                  { label: 'Workspace', onSelect: () => onSectionChange('overview') },
                  { label: activeItem.label },
                ]}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SegmentedControl
                ariaLabel="Telemetry window"
                value={timeframe}
                onValueChange={onTimeframeChange}
                options={[
                  { value: '7d', label: '7d' },
                  { value: '30d', label: '30d' },
                  { value: '90d', label: '90d' },
                ]}
              />
              <SegmentedControl
                ariaLabel="Dashboard preview state"
                value={viewState}
                onValueChange={onViewStateChange}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'loading', label: 'Loading' },
                  { value: 'empty', label: 'Empty' },
                  { value: 'error', label: 'Error' },
                ]}
              />
              <TactileButton
                variant="solid"
                size="sm"
                onClick={() =>
                  toastApi?.toast({
                    title: 'Deploy triggered',
                    description: `Rolling out snapshot on ${timeframe} baseline.`,
                    tone: 'success',
                  })
                }
              >
                <PlusIcon />
                <span>Deploy</span>
              </TactileButton>
              <DropdownMenu
                triggerAriaLabel="Dashboard actions"
                trigger={<MoreHorizontalIcon />}
                items={[
                  {
                    id: 'refresh',
                    label: 'Refresh metrics',
                    icon: <RefreshIcon />,
                    onSelect: () => {
                      onViewStateChange('default');
                      toastApi?.toast({
                        title: 'Metrics synced',
                        description: 'Latency and error budgets refreshed.',
                      });
                    },
                  },
                  {
                    id: 'clear',
                    label: 'Preview empty state',
                    onSelect: () => onViewStateChange('empty'),
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex-1 p-5 sm:p-6 flex flex-col gap-6">{children}</div>
        </div>
      </div>

      <SlideOverDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        side="start"
        title="Cluster control"
        description="Switch active dashboard domain."
      >
        {renderNavButtons(false, () => setMobileNavOpen(false))}
      </SlideOverDrawer>
    </div>
  );
}
