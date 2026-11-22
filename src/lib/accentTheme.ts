import { useSyncExternalStore } from 'react';

export type AccentPresetId = 'indigo' | 'cobalt' | 'teal' | 'emerald' | 'amber';

export interface AccentPreset {
  id: AccentPresetId;
  label: string;
  hue: number;
  swatchVar: string;
  note: string;
}

export const ACCENT_PRESETS: readonly AccentPreset[] = [
  {
    id: 'indigo',
    label: 'Indigo 268',
    hue: 268,
    swatchVar: '--color-preset-indigo',
    note: 'Editorial precision default',
  },
  {
    id: 'cobalt',
    label: 'Cobalt 245',
    hue: 245,
    swatchVar: '--color-preset-cobalt',
    note: 'Crisp technical telemetry',
  },
  {
    id: 'teal',
    label: 'Teal 192',
    hue: 192,
    swatchVar: '--color-preset-teal',
    note: 'Calm observability & infra',
  },
  {
    id: 'emerald',
    label: 'Emerald 156',
    hue: 156,
    swatchVar: '--color-preset-emerald',
    note: 'Health and release velocity',
  },
  {
    id: 'amber',
    label: 'Amber 68',
    hue: 68,
    swatchVar: '--color-preset-amber',
    note: 'Warm editorial highlight',
  },
] as const;

const ACCENT_KEY = 'formwork.accent';
const ACCENT_EVENT = 'formwork-accent-change';

function findPreset(id: string | null): AccentPreset {
  return ACCENT_PRESETS.find((preset) => preset.id === id) ?? ACCENT_PRESETS[0]!;
}

function getSnapshot(): AccentPresetId {
  if (typeof document === 'undefined') return 'indigo';
  const attr = document.documentElement.getAttribute('data-accent');
  return findPreset(attr).id;
}

function getServerSnapshot(): AccentPresetId {
  return 'indigo';
}

function applyAccentPreset(id: AccentPresetId): void {
  if (typeof document === 'undefined') return;
  const preset = findPreset(id);
  document.documentElement.setAttribute('data-accent', preset.id);
  document.documentElement.style.setProperty('--accent-hue', String(preset.hue));
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const observer = new MutationObserver(() => {
    callback();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-accent'],
  });

  const onCustom = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === ACCENT_KEY) {
      applyAccentPreset(findPreset(event.newValue).id);
      callback();
    }
  };

  window.addEventListener(ACCENT_EVENT, onCustom);
  window.addEventListener('storage', onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener(ACCENT_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}

export function initAccentPreset(): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = window.localStorage.getItem(ACCENT_KEY);
    if (stored) {
      applyAccentPreset(findPreset(stored).id);
    }
  } catch {
    // Ignore storage read errors
  }
}

export function setAccentPreset(id: AccentPresetId): void {
  applyAccentPreset(id);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ACCENT_KEY, id);
    } catch {
      // Storage may be unavailable in restricted contexts
    }
    window.dispatchEvent(new CustomEvent(ACCENT_EVENT));
  }
}

export function useAccentPreset(): AccentPreset {
  const id = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return findPreset(id);
}
