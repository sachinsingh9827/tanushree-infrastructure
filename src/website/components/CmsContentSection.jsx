import { applyBrandName } from "../utils/brandContent.js";

export default function CmsContentSection({ content, isLoading }) {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="grid gap-3 rounded-lg bg-white p-6 shadow dark:bg-slate-900">
          <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <article
        className="cms-content rounded-lg bg-white p-6 leading-7 text-slate-700 shadow transition-colors dark:bg-slate-900 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: applyBrandName(content) }}
      />
    </section>
  );
}
