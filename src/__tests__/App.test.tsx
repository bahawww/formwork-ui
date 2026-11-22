import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../App';

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-accent');
  document.documentElement.style.removeProperty('--accent-hue');
});

describe('App workbench navigation and shell controls', () => {
  it('renders 4 core tabs without T3 HTML/Schema, supports CommandPalette, sound, and theme toggles', async () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toHaveAttribute('href', '#main-content');

    expect(screen.getByRole('tab', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Kit' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Charts' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Rules' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'T3 HTML' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Schema' })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard template' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Charts' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Anti-slop graph system' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Rules' }));
    expect(
      screen.getByRole('heading', { level: 1, name: /Design rules/i }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const palette = await screen.findByRole('dialog', { name: 'Quick command menu' });
    expect(palette).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter commands'), {
      target: { value: 'Kit' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Open Reusable UI kit/i }));
    expect(screen.getByRole('heading', { level: 1, name: 'Reusable UI kit' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Quick command menu' })).not.toBeInTheDocument();
    });

    const muteBtn = screen.getByRole('button', { name: /Mute UI sound/i });
    fireEvent.click(muteBtn);
    expect(screen.getByRole('button', { name: /Unmute UI sound/i })).toBeInTheDocument();

    const themeBtn = screen.getByRole('button', { name: /Switch to dark theme/i });
    fireEvent.click(themeBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
