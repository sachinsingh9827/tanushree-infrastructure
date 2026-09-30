import { useGetPageQuery } from "../../store/websiteApi.js";
import { fallbackPageContent, fallbackProjects } from "../data/staticContent.js";
import CmsContentSection from "../components/CmsContentSection.jsx";
import PageHero from "../components/PageHero.jsx";
import SiteLayout from "../components/SiteLayout.jsx";

export default function Projects() {
  const { data, isError, isLoading } = useGetPageQuery("projects");
  const page = data?.data || (isError ? fallbackPageContent.projects : null);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Projects"
        title={page?.title || fallbackPageContent.projects.title}
        description={page?.seoDescription || fallbackPageContent.projects.seoDescription}
        image={page?.heroImage}
      />
      <CmsContentSection content={page?.content || (isError ? fallbackPageContent.projects.content : "")} isLoading={isLoading} />
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-10 md:grid-cols-3">
        {fallbackProjects.map((project) => (
          <article className="overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900" key={project._id}>
            <img
              alt={project.coverImage.altText || project.title}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
              src={project.coverImage.url}
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase text-secondary">{project.status}</p>
              <h2 className="mt-2 text-lg font-semibold">{project.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
