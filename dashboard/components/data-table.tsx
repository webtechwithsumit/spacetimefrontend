"use client";

import { ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  label: string;
  visible: boolean;
  icon?: ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: ReactNode;
  getRowKey: (item: T) => string;
  renderTableCell: (item: T, column: DataTableColumn<T>) => ReactNode;
  showSerialNo?: boolean;
  serialNoLabel?: string;
  currentPage?: number;
  itemsPerPage?: number;
  renderActions?: (item: T, index: number) => ReactNode;
  actionsLabel?: string;
  className?: string;
};

const thClass =
  "px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap";
const tdClass = "px-4 py-3 text-zinc-600 dark:text-zinc-300";

export function DataTable<T>({
  columns,
  data,
  loading = false,
  loadingMessage = "Please Wait!",
  emptyMessage = "No Data Found",
  getRowKey,
  renderTableCell,
  showSerialNo = true,
  serialNoLabel = "Sr. No",
  currentPage = 1,
  itemsPerPage = 200,
  renderActions,
  actionsLabel = "Action",
  className = "",
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((column) => column.visible);
  const colSpan =
    visibleColumns.length + (showSerialNo ? 1 : 0) + (renderActions ? 1 : 0);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
    >
      <div className="overflow-x-auto text-nowrap">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <tr>
              {showSerialNo && <th className={thClass}>{serialNoLabel}</th>}
              {visibleColumns.map((column) => (
                <th key={column.id} className={thClass}>
                  <span className="inline-flex items-center gap-1.5">
                    {column.icon}
                    {column.label}
                  </span>
                </th>
              ))}
              {renderActions && <th className={thClass}>{actionsLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  {loadingMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getRowKey(item)}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 dark:border-zinc-800/60 dark:hover:bg-zinc-900/30"
                >
                  {showSerialNo && (
                    <td className={tdClass}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td key={column.id} className={tdClass}>
                      {renderTableCell(item, column)}
                    </td>
                  ))}
                  {renderActions && (
                    <td className={tdClass}>{renderActions(item, index)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
