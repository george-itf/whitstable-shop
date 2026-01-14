'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

// Column definition
export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => ReactNode;
}

// Table props
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  isLoading = false,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  onRowClick,
  emptyMessage = 'No data found',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    const comparison = aVal < bVal ? -1 : 1;
    return sortDir === 'asc' ? comparison : -comparison;
  });

  // Handle selection
  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.size === data.length) {
      onSelectionChange(new Set());
    } else {
      const newSet = new Set(data.map((item) => String(item[keyField])));
      onSelectionChange(newSet);
    }
  };

  const toggleItem = (id: string) => {
    if (!onSelectionChange) return;
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    onSelectionChange(newSet);
  };

  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="card" className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-grey-light">
            {selectable && (
              <th className="px-3 py-3 w-10">
                <button
                  onClick={toggleAll}
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                    allSelected || someSelected
                      ? 'bg-sky border-sky'
                      : 'border-grey-light hover:border-grey'
                  )}
                  aria-label={allSelected ? 'Deselect all rows' : 'Select all rows'}
                  aria-pressed={allSelected}
                >
                  {(allSelected || someSelected) && (
                    <Check className="w-3 h-3 text-white" aria-hidden="true" />
                  )}
                </button>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-3 py-3 text-xs font-semibold text-grey uppercase tracking-wide',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.sortable && 'cursor-pointer select-none hover:text-ink'
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className={cn(
                  'flex items-center gap-1',
                  col.align === 'center' && 'justify-center',
                  col.align === 'right' && 'justify-end'
                )}>
                  {col.header}
                  {col.sortable && (
                    <span className="text-grey-light">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-3 py-12 text-center text-grey"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item) => {
              const id = String(item[keyField]);
              const isSelected = selectedIds.has(id);

              return (
                <tr
                  key={id}
                  className={cn(
                    'border-b border-grey-light/50 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-grey-light/30',
                    isSelected && 'bg-sky-light/50'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="px-3 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItem(id);
                        }}
                        className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-sky border-sky'
                            : 'border-grey-light hover:border-grey'
                        )}
                        aria-label={isSelected ? 'Deselect row' : 'Select row'}
                        aria-pressed={isSelected}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                      </button>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-3 text-sm',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
