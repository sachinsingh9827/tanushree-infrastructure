export default function Pagination({ meta, onPageChange }) {
  if (!meta) return null;

  const totalPages = Math.max(meta.totalPages || 1, 1);
  const currentPage = Math.min(meta.page || 1, totalPages);

  return (
    <div className="flex flex-col gap-3 rounded-b-lg border-x border-b border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-slate-600 dark:text-slate-300 sm:text-left">
        Page {currentPage} of {totalPages} · {meta.total || 0} records
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          className="rounded-custom border border-slate-300 px-3 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          Previous
        </button>
        <button
          className="rounded-custom border border-slate-300 px-3 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
