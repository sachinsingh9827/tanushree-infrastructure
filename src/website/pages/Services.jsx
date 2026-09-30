import { useGetPageQuery } from "../../store/websiteApi.js";
import { fallbackPageContent, fallbackServices } from "../data/staticContent.js";
import CmsContentSection from "../components/CmsContentSection.jsx";
import PageHero from "../components/PageHero.jsx";
import SiteLayout from "../components/SiteLayout.jsx";

export default function Services() {
  const { data, isError, isLoading } = useGetPageQuery("services");
  const page = data?.data || (isError ? fallbackPageContent.services : null);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title={page?.title || fallbackPageContent.services.title}
        description={page?.seoDescription || fallbackPageContent.services.seoDescription}
        image={page?.heroImage}
      />
      <CmsContentSection content={page?.content || (isError ? fallbackPageContent.services.content : "")} isLoading={isLoading} />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {fallbackServices.map((service) => (
          <article className="overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900" key={service._id}>
            <img alt={service.title} className="aspect-[4/3] w-full object-cover" loading="lazy" src={service.image} />
            <div className="p-5">
              <h2 className="text-lg font-semibold">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.shortDescription}</p>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
