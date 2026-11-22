import { useState } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { LoginPage } from '../components/patterns/LoginPage';
import { SettingsTemplate } from '../components/patterns/SettingsTemplate';
import {
  Accordion,
  AlertBanner,
  Badge,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  PasswordInput,
  ProgressBar,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  SelectMenu,
  SlideOverDrawer,
  StatStrip,
  TextArea,
  ToastProvider,
} from '../components/ui';

afterEach(() => {
  cleanup();
});

function SearchHarness() {
  const [query, setQuery] = useState('edge');
  return <SearchInput label="Inventory" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />;
}

describe('Reusable component kit, forms, overlays, and full-page patterns', () => {
  it('validates login fields, submits valid credentials with toast feedback, and switches to reset flow', async () => {
    const onAuthenticate = vi.fn().mockResolvedValue(undefined);
    render(
      <ToastProvider>
        <LoginPage onAuthenticate={onAuthenticate} />
      </ToastProvider>,
    );

    const signInBtn = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInBtn);

    expect(await screen.findByText(/Enter a valid work email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Work email'), {
      target: { value: 'bahar@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'StrongPass123' },
    });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(onAuthenticate).toHaveBeenCalledWith({
        email: 'bahar@company.com',
        remember: true,
      });
    });
    expect(await screen.findByText('Signed in')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));
    expect(await screen.findByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(await screen.findByText(/Reset link sent to bahar@company.com/i)).toBeInTheDocument();
  });

  it('toggles password visibility, operates SelectMenu, ConfirmDialog, Badge, SearchInput, and TextArea', async () => {
    const onSelect = vi.fn();
    const onConfirm = vi.fn();
    const onDismiss = vi.fn();

    render(
      <div>
        <SearchHarness />
        <TextArea label="Notes" defaultValue="hello" maxLength={50} showCount />
        <PasswordInput label="Secret key" defaultValue="alpha-1234" />
        <SelectMenu
          label="Region"
          value="sin"
          onValueChange={onSelect}
          options={[
            { value: 'sin', label: 'Singapore' },
            { value: 'fra', label: 'Frankfurt' },
          ]}
        />
        <Badge variant="dot" tone="success" dismissLabel="Remove tag" onDismiss={onDismiss}>
          Active
        </Badge>
        <ConfirmDialog
          isOpen
          title="Delete snapshot?"
          description="This deletes the preview state."
          confirmLabel="Delete snapshot"
          cancelLabel="Keep snapshot"
          destructive
          onConfirm={onConfirm}
          onCancel={() => {}}
        />
      </div>,
    );

    const searchBox = screen.getByLabelText('Inventory');
    expect(searchBox).toHaveValue('edge');
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(searchBox).toHaveValue('');
    expect(screen.getByText('5/50')).toBeInTheDocument();

    const pwInput = screen.getByLabelText('Secret key');
    expect(pwInput).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(pwInput).toHaveAttribute('type', 'text');

    const selectTrigger = screen.getByRole('button', { name: /Region/i });
    fireEvent.click(selectTrigger);
    fireEvent.click(await screen.findByRole('button', { name: 'Frankfurt' }));
    expect(onSelect).toHaveBeenCalledWith('fra');

    fireEvent.click(screen.getByRole('button', { name: 'Remove tag' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('button', { name: 'Keep snapshot' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete snapshot' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('operates SegmentedControl, RadioGroup, ProgressBar, AlertBanner, Accordion, DropdownMenu, SlideOverDrawer, DataTable, and SettingsTemplate', async () => {
    const onSegment = vi.fn();
    const onRadio = vi.fn();
    const onAlertAction = vi.fn();
    const onMenuAction = vi.fn();
    const onCloseDrawer = vi.fn();

    const rows = [
      { id: '1', name: 'alpha' },
      { id: '2', name: 'beta' },
      { id: '3', name: 'gamma' },
    ];

    render(
      <ToastProvider>
        <SegmentedControl
          ariaLabel="Env"
          value="dev"
          onValueChange={onSegment}
          options={[
            { value: 'dev', label: 'Dev' },
            { value: 'prod', label: 'Prod' },
          ]}
        />
        <RadioGroup
          label="Rollout"
          value="canary"
          onValueChange={onRadio}
          options={[
            { value: 'canary', label: 'Canary' },
            { value: 'stable', label: 'Stable' },
          ]}
        />
        <ProgressBar label="Coverage" value={60} max={100} />
        <AlertBanner
          tone="warning"
          title="Quota notice"
          description="Approaching limit."
          actionLabel="Increase quota"
          onAction={onAlertAction}
        />
        <Accordion
          items={[
            { id: 'a1', title: 'Rule one', content: 'Body one' },
            { id: 'a2', title: 'Rule two', content: 'Body two' },
          ]}
        />
        <DropdownMenu
          trigger={<span>Open menu</span>}
          items={[{ id: 'm1', label: 'Run sync', onSelect: onMenuAction }]}
        />
        <StatStrip items={[{ id: 's1', label: 'Requests', value: '1.2M' }]} />
        <DataTable
          title="Modules"
          rows={rows}
          pageSize={2}
          columns={[{ key: 'name', label: 'Name', render: (row) => row.name }]}
        />
        <SlideOverDrawer isOpen title="Inspector" onClose={onCloseDrawer}>
          <p>Drawer content</p>
        </SlideOverDrawer>
        <SettingsTemplate />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Prod' }));
    expect(onSegment).toHaveBeenCalledWith('prod');

    fireEvent.click(screen.getByRole('radio', { name: 'Stable' }));
    expect(onRadio).toHaveBeenCalledWith('stable');

    expect(screen.getByRole('progressbar', { name: 'Coverage' })).toHaveAttribute('aria-valuenow', '60');

    fireEvent.click(screen.getByRole('button', { name: 'Increase quota' }));
    expect(onAlertAction).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Rule one/i }));
    expect(screen.getByText('Body one')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Run sync' }));
    expect(onMenuAction).toHaveBeenCalledTimes(1);

    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.queryByText('gamma')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('gamma')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseDrawer).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(await screen.findByText('Settings saved')).toBeInTheDocument();
  });

  it('opens Kit tab and filters to Page Patterns inside App', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: 'Kit' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Reusable UI kit' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Page Patterns' }));
    expect(
      screen.getByRole('heading', { level: 2, name: 'Reusable full-page patterns' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Workspace settings' })).toBeInTheDocument();
  });
});
