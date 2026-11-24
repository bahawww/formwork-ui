import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { SortIcon } from '../Icons';
import { AlertBanner } from './AlertBanner';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';
import { SegmentedControl } from './SegmentedControl';
import { SurfaceSkeleton } from './SurfaceSkeleton';
import { TactileButton } from './TactileButton';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  align?: 'start' | 'end';
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  title: string;
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  searchText?: (row: T) => string;
  pageSize?: number;
  state?: 'default' | 'loading' | 'empty' | 'error';
  onRetry?: () => void;
  onResetEmpty?: () => void;
  onInspectRow?: (row: T) => void;
  inspectLabel?: string;
}

export function DataTable<T extends { id: string }>({
  title,
  rows,
  columns,
  searchText,
  pageSize = 5,
  state = 'default',
  onRetry,
  onResetEmpty,
  onInspectRow,
  inspectLabel = 'Inspect',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [page, setPage] = useState(1);

  if (state === 'loading') {
    return <SurfaceSkeleton variant="table" />;
  }

  if (state === 'error') {
    return (
      <AlertBanner
        tone="error"
        title={`Could not load ${title.toLowerCase()}`}
        description="The metrics backend timed out after 3s. Retry to fetch fresh records."
        actionLabel={onRetry ? 'Retry fetch' : undefined}
        onAction={onRetry}
      />
    );
  }

  if (state === 'empty' || rows.length === 0) {
    return (
      <EmptyState
        title={`No records in ${title.toLowerCase()}`}
        description="No events matched the selected period or service workspace."
        actionLabel={onResetEmpty ? 'Restore sample records' : undefined}
        onAction={onResetEmpty}
      />
    );
  }

  const normalized = query.trim().toLowerCase();
  const filtered =
    normalized && searchText ? rows.filter((row) => searchText(row).toLowerCase().includes(normalized)) : rows;

  const activeCol = sortKey ? columns.find((col) => col.key === sortKey) : undefined;
  const sorted =
    activeCol && activeCol.sortValue
      ? [...filtered].sort((a, b) => {
          const av = activeCol.sortValue!(a);
          const bv = activeCol.sortValue!(b);
          const cmp =
            typeof av === 'number' && typeof bv === 'number'
              ? av - bv
              : String(av).localeCompare(String(bv), undefined, { numeric: true });
          return sortDir === 'asc' ? cmp : -cmp;
        })
      : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable || !col.sortValue) return;
    setSortDir((prev) => (sortKey === col.key && prev === 'asc' ? 'desc' : 'asc'));
    setSortKey(col.key);
  };

  const cellPadding = density === 'compact' ? 'py-2 px-3' : 'py-3 px-3';

  return (
    <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 text-[15px] font-medium text-(--color-fg)">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {searchText ? (
            <SearchInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              onClear={() => setQuery('')}
              placeholder="Filter rows..."
              aria-label={`Filter ${title}`}
              className="min-w-48"
            />
          ) : null}
          <SegmentedControl
            ariaLabel="Row density"
            value={density}
            onValueChange={setDensity}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
        </div>
      </div>

      <div className="overflow-x-auto border-y border-(--color-border)">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border)">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    aria-sort={col.sortable ? (isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                    className={cn(
                      cellPadding,
                      'font-normal text-(--color-muted) whitespace-nowrap',
                      col.align === 'end' ? 'text-end' : 'text-start',
                    )}
                  >
                    {col.sortable && col.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-inherit cursor-pointer hover:text-(--color-fg)"
                      >
                        <span>{col.label}</span>
                        <SortIcon />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
              {onInspectRow ? (
                <th className={cn(cellPadding, 'font-normal text-(--color-muted) text-end')}>
                  Action
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onInspectRow ? 1 : 0)} className="px-3 py-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-(--color-muted)">
                    <span>No rows match "{query}". Reset filter to view all records.</span>
                    <TactileButton variant="outline" size="sm" onClick={() => setQuery('')}>
                      Clear filter
                    </TactileButton>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id} className="hover:bg-(--color-surface) transition-colors duration-(--motion-dur-fast)">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(cellPadding, col.align === 'end' ? 'text-end tabular' : 'text-start')}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                  {onInspectRow ? (
                    <td className={cn(cellPadding, 'text-end')}>
                      <TactileButton variant="ghost" size="sm" onClick={() => onInspectRow(row)}>
                        {inspectLabel}
                      </TactileButton>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > pageSize ? (
        <Pagination page={currentPage} pageSize={pageSize} totalItems={sorted.length} onPageChange={setPage} />
      ) : null}
    </section>
  );
}
