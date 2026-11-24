import { useState } from 'react';
import { MoreHorizontalIcon, RefreshIcon, TrashIcon } from '../Icons';
import {
  Accordion,
  Breadcrumb,
  CommandPalette,
  ConfirmDialog,
  DropdownMenu,
  ProximityList,
  SlideOverDrawer,
  TabsSubtle,
  TactileButton,
  Tooltip,
  useToast,
} from '../ui';

const ACCORDION_ITEMS = [
  {
    id: 'concentric',
    title: 'How nested border radii stay concentric',
    meta: 'Formula',
    content:
      'Subtract container padding and border thickness from outer radius: R_inner = max(4px, R_outer - padding - border).',
  },
  {
    id: 'glass',
    title: 'Where frosted blur adds depth without noise',
    meta: 'Elevation',
    content:
      'Restrict backdrop-filter blur to floating layers (headers, menus, drawers, modals, toasts) at 76% to 88% neutral opacity.',
  },
];

export function NavigationAndOverlaysSection() {
  const [subTab, setSubTab] = useState('overview');
  const [selectedRow, setSelectedRow] = useState('s1');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toast } = useToast();

  return (
    <section className="flex flex-col gap-5" aria-label="Navigation and overlays">
      <div>
        <h2 className="m-0 text-[18px] font-medium text-(--color-fg)">Navigation and frosted overlays</h2>
        <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
          Breadcrumbs, spring-pill tabs, dropdown actions, focus-trapped slide-over drawers, and command palettes.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-4">
        <Breadcrumb
          items={[
            { label: 'Formwork', onSelect: () => setSubTab('overview') },
            { label: 'Design Kit', onSelect: () => setSubTab('tokens') },
            { label: 'Overlays' },
          ]}
        />

        <TabsSubtle
          size="sm"
          ariaLabel="Overlay demo tabs"
          value={subTab}
          onValueChange={setSubTab}
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'tokens', label: 'Tokens' },
            { value: 'motion', label: 'Motion' },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <DropdownMenu
          trigger={
            <span className="inline-flex items-center gap-1.5">
              <MoreHorizontalIcon />
              <span>Actions menu</span>
            </span>
          }
          items={[
            {
              id: 'sync',
              label: 'Sync design tokens',
              icon: <RefreshIcon />,
              shortcut: 'R',
              onSelect: () =>
                toast({ title: 'Tokens synced', description: 'Light & dark OKLCH vars updated.' }),
            },
            {
              id: 'purge',
              label: 'Purge stale snapshot',
              icon: <TrashIcon />,
              destructive: true,
              onSelect: () => setConfirmOpen(true),
            },
          ]}
        />

        <Tooltip content="Fires an accessible aria-live toast">
          <TactileButton
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                title: 'Snapshot verified',
                description: 'WCAG AA focus trap and contrast checks passed.',
                tone: 'success',
              })
            }
          >
            Trigger toast
          </TactileButton>
        </Tooltip>

        <TactileButton variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
          Open slide-over drawer
        </TactileButton>

        <TactileButton variant="outline" size="sm" onClick={() => setPaletteOpen(true)}>
          Open command palette
        </TactileButton>

        <TactileButton variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
          Delete snapshot
        </TactileButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-4">
          <div className="mb-2 text-[12px] text-(--color-muted)">Proximity hover rail</div>
          <ProximityList
            items={[
              {
                id: 's1',
                label: 'Concentric Dashboard Shell',
                isActive: selectedRow === 's1',
                onSelect: () => setSelectedRow('s1'),
              },
              {
                id: 's2',
                label: 'OKLCH Color Harmony Token Set',
                isActive: selectedRow === 's2',
                onSelect: () => setSelectedRow('s2'),
              },
              {
                id: 's3',
                label: 'Tufte Trend & Distribution Charts',
                isActive: selectedRow === 's3',
                onSelect: () => setSelectedRow('s3'),
              },
            ]}
          />
        </div>

        <Accordion items={ACCORDION_ITEMS} defaultOpenIds={['concentric']} />
      </div>

      <SlideOverDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Inspect component spec"
        description="Slide-over sheets trap Tab focus and close cleanly on Escape."
        footer={
          <TactileButton variant="solid" size="sm" onClick={() => setDrawerOpen(false)}>
            Close sheet
          </TactileButton>
        }
      >
        <p className="m-0 text-[13px] text-(--color-muted)">
          Portal drawers render above page landmarks using .glass-surface (24px blur) and animate only translate-X and opacity.
        </p>
      </SlideOverDrawer>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={[
          {
            id: 'cmd-toast',
            label: 'Trigger verification toast',
            section: 'Actions',
            shortcut: 'T',
            onSelect: () => toast({ title: 'Executed command', tone: 'success' }),
          },
          {
            id: 'cmd-drawer',
            label: 'Open slide-over spec drawer',
            section: 'Overlays',
            onSelect: () => setDrawerOpen(true),
          },
        ]}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete staging snapshot?"
        description="Removing snapshot v2.14-rc2 deletes its preview state. Active production surfaces stay untouched."
        confirmLabel="Delete snapshot"
        cancelLabel="Keep snapshot"
        destructive
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          toast({ title: 'Deleted snapshot', tone: 'neutral' });
        }}
      />
    </section>
  );
}
