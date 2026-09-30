import { Trash2 } from "lucide-react";

export default function BulkActions({ count, disabled, onDelete }) {
  if (!count) return null;

  return (
    <div className="mb-3 flex items-center justify-between rounded-custom border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
      <span>{count} selected</span>
      <button
        className="inline-flex items-center gap-2 rounded-custom bg-red-600 px-3 py-2 font-semibold text-white disabled:opacity-60"
        disabled={disabled}
        onClick={onDelete}
        type="button"
      >
        <Trash2 size={16} />
        Bulk delete
      </button>
    </div>
  );
}
