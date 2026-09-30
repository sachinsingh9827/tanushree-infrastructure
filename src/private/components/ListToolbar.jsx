import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import CustomSelect from "../../components/CustomSelect.jsx";

export default function ListToolbar({
  filters = [],
  onReset,
  onSearchChange,
  onSortChange,
  search,
  sort
}) {
  return (
    <section className="mb-4 rounded-custom border border-primary/10 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-custom bg-header text-primary dark:bg-primary dark:text-secondary">
            <SlidersHorizontal size={18} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-primary dark:text-white">Filters</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Search, filter and sort records</p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-custom border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:border-secondary/40 dark:hover:text-secondary"
          onClick={onReset}
          type="button"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(260px,1fr)_220px_220px]">
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Search</span>
          <span className="flex items-center gap-2 rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary/40 focus-within:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-secondary/50 dark:focus-within:bg-slate-900">
            <Search size={18} className="text-slate-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none dark:text-white"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, title, email..."
              type="search"
              value={search}
            />
          </span>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sort</span>
          <CustomSelect
            onChange={onSortChange}
            options={[
              { label: "Latest first", value: "latest" },
              { label: "Oldest first", value: "oldest" },
              { label: "Sort order", value: "order" }
            ]}
            value={sort}
          />
        </label>

        {filters.map((filter) => (
          <label className="grid gap-1" key={filter.name}>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{filter.label || filter.name}</span>
            <CustomSelect onChange={filter.onChange} options={filter.options} value={filter.value} />
          </label>
        ))}
      </div>
    </section>
  );
}
