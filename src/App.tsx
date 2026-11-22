import { useEffect, useState, useSyncExternalStore } from 'react';
import { ComponentKitShowcase } from './components/ComponentKitShowcase';
import {
  BarChartIcon,
  BookOpenIcon,
  LayersIcon,
  LayoutGridIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  VolumeIcon,
} from './components/Icons';
import {
  CommandPalette,
  Kbd,
  TabsSubtle,
  TactileButton,
  ToastProvider,
  type CommandItem,
} from './components/ui';
import { ChartsGalleryView } from './components/views/ChartsGalleryView';
import { DashboardView } from './components/views/DashboardView';
import { DesignRulesView } from './components/views/DesignRulesView';
import { ACCENT_PRESETS, setAccentPreset } from './lib/accentTheme';
import { isSoundMuted, subscribeSoundMuted, toggleSoundMuted } from './lib/sound';
import { toggleTheme, useTheme } from './lib/theme';

type WorkspaceTab = 'dashboard' | 'kit' | 'charts' | 'rules';

const WORKSPACE_TABS = [
  { value: 'dashboard', label: 'Dashboard', icon: <LayoutGridIcon /> },
  { value: 'kit', label: 'Kit', icon: <LayersIcon /> },
  { value: 'charts', label: 'Charts', icon: <BarChartIcon /> },
  { value: 'rules', label: 'Rules', icon: <BookOpenIcon /> },
];

function AppWorkspace() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const theme = useTheme();
  const soundMuted = useSyncExternalStore(subscribeSoundMuted, isSoundMuted, () => false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const switchTab = (next: WorkspaceTab, label: string) => {
    setActiveTab(next);
    setLiveAnnouncement(`Opened ${label} view`);
  };

  const commands: CommandItem[] = [
    {
      id: 'nav-dashboard',
      label: 'Open Dashboard template',
      section: 'Navigate',
      hint: 'Macro-Meso-Micro telemetry shell and 5-state preview',
      shortcut: '1',
      icon: <LayoutGridIcon />,
      onSelect: () => switchTab('dashboard', 'Dashboard'),
    },
    {
      id: 'nav-kit',
      label: 'Open Reusable UI kit',
      section: 'Navigate',
      hint: '34 primitives, radii, frosted glass, Login & Settings patterns',
      shortcut: '2',
      icon: <LayersIcon />,
      onSelect: () => switchTab('kit', 'Kit'),
    },
    {
      id: 'nav-charts',
      label: 'Open Anti-slop graph gallery',
      section: 'Navigate',
      hint: 'Tufte integrity, OKLCH charts, DistributionBar & sparklines',
      shortcut: '3',
      icon: <BarChartIcon />,
      onSelect: () => switchTab('charts', 'Charts'),
    },
    {
      id: 'nav-rules',
      label: 'Open Design rules & token lab',
      section: 'Navigate',
      hint: 'Color harmony, concentric corners, dashboard layout, spring physics',
      shortcut: '4',
      icon: <BookOpenIcon />,
      onSelect: () => switchTab('rules', 'Rules'),
    },
    ...ACCENT_PRESETS.map((preset) => ({
      id: `accent-${preset.id}`,
      label: `Set accent hue: ${preset.label}`,
      section: 'Harmony',
      hint: preset.note,
      onSelect: () => {
        setAccentPreset(preset.id);
        setLiveAnnouncement(`Accent changed to ${preset.label}`);
      },
    })),
    {
      id: 'toggle-theme',
      label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      section: 'Appearance',
      icon: theme === 'dark' ? <SunIcon /> : <MoonIcon />,
      onSelect: () => {
        const nextTheme = toggleTheme();
        setLiveAnnouncement(`Switched to ${nextTheme} theme`);
      },
    },
  ];

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link squircle-corners">
        Skip to main content
      </a>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand-group">
            <span className="brand-name">Formwork</span>
            <span className="hidden text-[12px] text-(--color-subtle) sm:inline">
              Anti-Slop Design System
            </span>
          </div>

          <TabsSubtle
            size="sm"
            ariaLabel="Primary navigation"
            value={activeTab}
            onValueChange={(next) => {
              if (next === 'dashboard' || next === 'kit' || next === 'charts' || next === 'rules') {
                switchTab(next, next);
              }
            }}
            items={WORKSPACE_TABS}
          />

          <div className="header-controls">
            <TactileButton
              variant="outline"
              size="sm"
              aria-label="Open command menu"
              onClick={() => setPaletteOpen(true)}
            >
              <SearchIcon />
              <span className="hidden sm:inline">Quick jump</span>
              <Kbd className="hidden md:inline-flex">Ctrl K</Kbd>
            </TactileButton>

            <TactileButton
              variant="icon"
              size="sm"
              aria-label={soundMuted ? 'Unmute UI sound' : 'Mute UI sound'}
              onClick={() => {
                const nextMuted = toggleSoundMuted();
                setLiveAnnouncement(nextMuted ? 'Muted UI sound' : 'Unmuted UI sound');
              }}
            >
              <VolumeIcon muted={soundMuted} />
            </TactileButton>

            <TactileButton
              variant="icon"
              size="sm"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={() => {
                const nextTheme = toggleTheme();
                setLiveAnnouncement(`Switched to ${nextTheme} theme`);
              }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </TactileButton>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="main-stage">
        <div className="workspace-stage">
          {activeTab === 'dashboard' ? (
            <DashboardView />
          ) : activeTab === 'kit' ? (
            <ComponentKitShowcase />
          ) : activeTab === 'charts' ? (
            <ChartsGalleryView />
          ) : (
            <DesignRulesView />
          )}
        </div>
      </main>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppWorkspace />
    </ToastProvider>
  );
}
