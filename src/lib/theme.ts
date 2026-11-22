import { useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'formwork.theme';
const THEME_EVENT = 'formwork-theme-change';

function getSnapshot(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): ThemeMode {
  return 'light';
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
    attributeFilter: ['class'],
  });

  const onCustom = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
      applyTheme(event.newValue);
    }
  };

  window.addEventListener(THEME_EVENT, onCustom);
  window.addEventListener('storage', onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener(THEME_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}

function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.setAttribute('data-theme', mode);
}

export function setTheme(mode: ThemeMode): void {
  applyTheme(mode);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_KEY, mode);
    } catch {
      // Storage may be unavailable in restricted contexts
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT));
  }
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getSnapshot() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function useTheme(): ThemeMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
