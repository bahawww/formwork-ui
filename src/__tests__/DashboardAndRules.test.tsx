import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DashboardTemplate } from '../components/patterns/dashboard/DashboardTemplate';
import { ToastProvider } from '../components/ui';
import { DesignRulesView } from '../components/views/DesignRulesView';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-accent');
  document.documentElement.style.removeProperty('--accent-hue');
});

describe('DashboardTemplate and DesignRulesView', () => {
  it('supports sidebar collapse, timeframe changes, 5-state previews, table filter, and slide-over inspection', () => {
    render(
      <ToastProvider>
        <DashboardTemplate />
      </ToastProvider>,
    );

    const collapseBtn = screen.getByRole('button', { name: 'Collapse sidebar' });
    fireEvent.click(collapseBtn);
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: '30d' }));
    expect(screen.getByText('74.2M')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter Active service deployments'), {
      target: { value: 'search-indexer' },
    });
    expect(screen.getByText('search-indexer')).toBeInTheDocument();
    expect(screen.queryByText('api-gateway')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Inspect' }));
    expect(screen.getByRole('dialog', { name: 'search-indexer' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });

    fireEvent.click(screen.getByRole('radio', { name: 'Loading' }));
    expect(screen.getByRole('status', { name: 'Loading dashboard view' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Error' }));
    expect(screen.getByText('Telemetry stream disconnected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry stream' }));
    expect(screen.getByText('74.2M')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'Empty' }));
    fireEvent.click(screen.getByRole('button', { name: 'Restore sample data' }));
    expect(screen.getByText('74.2M')).toBeInTheDocument();
  });

  it('switches rule tabs, updates live --accent-hue preset, and calculates concentric inner radius', () => {
    render(
      <ToastProvider>
        <DesignRulesView />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Teal 192/i }));
    expect(document.documentElement.getAttribute('data-accent')).toBe('teal');
    expect(document.documentElement.style.getPropertyValue('--accent-hue')).toBe('192');

    fireEvent.click(screen.getByRole('tab', { name: 'Spacing & Corners' }));
    expect(screen.getByText('R_inner = 9px')).toBeInTheDocument();

    const outerSlider = screen.getByLabelText('Outer container radius');
    fireEvent.change(outerSlider, { target: { value: '24' } });
    expect(screen.getByText('R_inner = 13px')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Dashboard Layout' }));
    expect(screen.getByText(/12-column asymmetric bento blueprint/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Animation & Motion' }));
    fireEvent.click(screen.getByRole('button', { name: 'Replay springs' }));
    expect(screen.getByText('springs.settle')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Anti-Slop Graphs' }));
    expect(screen.getByText('Lie Factor = 1.0')).toBeInTheDocument();
  });
});
