export default function Loader({ label = "Loading data..." }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-950">
      <div>
        <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-secondary" />
        <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </div>
  );
}
