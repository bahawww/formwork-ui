import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AreaTrendChart,
  BarComparisonChart,
  DistributionBar,
  Sparkline,
} from '../components/charts';

afterEach(() => {
  cleanup();
});

describe('Anti-slop chart library', () => {
  it('supports series toggles, keyboard point inspection, and state fallbacks in AreaTrendChart', () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <AreaTrendChart
        title="Tail latency"
        labels={['Mon', 'Tue', 'Wed']}
        series={[
          { name: 'Edge', values: [40, 44, 42] },
          { name: 'Origin', values: [80, 76, 72] },
        ]}
        unit="ms"
      />,
    );

    expect(screen.getByText('Zoomed Y-axis')).toBeInTheDocument();
    const edgeToggle = screen.getByRole('button', { name: 'Edge' });
    expect(edgeToggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(edgeToggle);
    expect(edgeToggle).toHaveAttribute('aria-pressed', 'false');

    const monTarget = screen.getByRole('button', { name: 'Inspect Mon' });
    fireEvent.keyDown(monTarget, { key: 'Enter' });
    expect(screen.getByText('80 ms')).toBeInTheDocument();

    rerender(
      <AreaTrendChart
        title="Tail latency"
        labels={['Mon']}
        series={[{ name: 'Edge', values: [40] }]}
        state="error"
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry chart' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders vertical and horizontal BarComparisonChart and enforces zero-baseline state', () => {
    const { rerender } = render(
      <BarComparisonChart
        title="Region latency"
        bars={[
          { label: 'US East', value: 38 },
          { label: 'Singapore', value: 46, highlight: true, note: 'Primary hub' },
        ]}
        unit="ms"
      />,
    );

    expect(screen.getByText(/Zero-baseline bar comparison/i)).toBeInTheDocument();
    expect(screen.getByText('Singapore: Primary hub')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'US East: 38 ms' }));
    expect(screen.getByText('38 ms', { selector: 'div > span.text-\\(--color-fg\\)' })).toBeInTheDocument();

    rerender(
      <BarComparisonChart
        title="Region latency"
        bars={[
          { label: 'US East', value: 38 },
          { label: 'Singapore', value: 46 },
        ]}
        unit="ms"
        orientation="horizontal"
      />,
    );
    expect(screen.getByRole('list', { name: 'Region latency' })).toBeInTheDocument();
  });

  it('renders DistributionBar percentages and isolates clicked segments', () => {
    render(
      <DistributionBar
        title="Workload share"
        segments={[
          { id: 'api', label: 'REST API', value: 60 },
          { id: 'events', label: 'Streams', value: 40 },
        ]}
        unit="%"
      />,
    );

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();

    const segBtn = screen.getByRole('button', { name: 'REST API: 60%' });
    fireEvent.click(segBtn);
    expect(segBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders Sparkline SVG only when at least 2 points are given', () => {
    const { container, rerender } = render(
      <Sparkline values={[10, 20, 30]} ariaLabel="Throughput trend" />,
    );
    expect(screen.getByRole('img', { name: 'Throughput trend' })).toBeInTheDocument();

    rerender(<Sparkline values={[10]} ariaLabel="Single point" />);
    expect(container.firstChild).toBeNull();
  });
});
