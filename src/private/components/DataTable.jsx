import { Inbox } from "lucide-react";

export default function DataTable({
  columns,
  emptyText = "No data found",
  onToggleAll,
  onToggleRow,
  rows = [],
  selectable = false,
  selectedIds = []
}) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row._id || row.id));

  return (
    <div className="overflow-x-auto rounded-t-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            {selectable ? (
              <th className="w-10 px-4 py-3">
                <input
                  aria-label="Select all rows"
                  checked={allSelected}
                  onChange={() => onToggleAll?.(rows)}
                  type="checkbox"
                />
              </th>
            ) : null}
            {columns.map((column) => (
              <th className="px-4 py-3" key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.length ? (
            rows.map((row) => (
              <tr className="dark:text-slate-200" key={row._id || row.id}>
                {selectable ? (
                  <td className="px-4 py-3 align-top">
                    <input
                      aria-label="Select row"
                      checked={selectedIds.includes(row._id || row.id)}
                      onChange={() => onToggleRow?.(row._id || row.id)}
                      type="checkbox"
                    />
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td className="max-w-xs px-4 py-3 align-top" key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-12 text-center" colSpan={columns.length + (selectable ? 1 : 0)}>
                <div className="mx-auto grid max-w-sm place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-header text-primary dark:bg-slate-900 dark:text-secondary">
                    <Inbox size={22} />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-primary dark:text-white">{emptyText}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try changing filters or add a new record from admin.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
