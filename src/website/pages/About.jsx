import { useGetPageQuery } from "../../store/websiteApi.js";
import { fallbackAboutPage } from "../data/staticContent.js";
import PageHero from "../components/PageHero.jsx";
import SiteLayout from "../components/SiteLayout.jsx";

export default function About() {
  const { data, isError, isLoading } = useGetPageQuery("about");
  const page = data?.data || (isError ? fallbackAboutPage : null);
  const hasCmsContent = Boolean(page?.content);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title={page?.title || "Construction work planned with discipline and delivered with care."}
        description={
          page?.seoDescription ||
          "tanuenterprise manages residential, commercial and renovation projects with practical execution, clear communication and reliable timelines."
        }
      />

      {page?.heroImage?.url ? (
        <section className="mx-auto max-w-6xl px-4 pt-10">
          <img
            alt={page.heroImage.altText || page.title || "About tanuenterprise"}
            className="max-h-[420px] w-full rounded-lg object-cover shadow"
            loading="lazy"
            src={page.heroImage.url}
          />
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <div className="grid gap-3 rounded-lg bg-white p-6 shadow dark:bg-slate-900">
            <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : hasCmsContent ? (
          <article
            className="cms-content rounded-lg bg-white p-6 leading-7 text-slate-700 shadow transition-colors dark:bg-slate-900 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {["Mission", "Vision", "Values"].map((title) => (
              <article className="rounded-lg bg-white p-6 shadow transition-colors dark:bg-slate-900" key={title}>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Build dependable spaces through quality materials, coordinated teams and transparent project updates.
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
