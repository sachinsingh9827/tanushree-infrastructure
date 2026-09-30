import { ImageOff } from "lucide-react";
import { useGetGalleryQuery, useGetPageQuery } from "../../store/websiteApi.js";
import { fallbackGalleryItems, fallbackPageContent } from "../data/staticContent.js";
import CmsContentSection from "../components/CmsContentSection.jsx";
import PageHero from "../components/PageHero.jsx";
import SiteLayout from "../components/SiteLayout.jsx";

export default function Gallery() {
  const { data, isError, isLoading } = useGetGalleryQuery({ page: 1, limit: 24 });
  const { data: pageData, isError: isPageError, isLoading: isPageLoading } = useGetPageQuery("gallery");
  const items = data?.data?.length ? data.data : isError ? fallbackGalleryItems : [];
  const page = pageData?.data || (isPageError ? fallbackPageContent.gallery : null);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Gallery"
        title={page?.title || fallbackPageContent.gallery.title}
        description={page?.seoDescription || fallbackPageContent.gallery.seoDescription}
        image={page?.heroImage}
      />
      <CmsContentSection content={page?.content || (isPageError ? fallbackPageContent.gallery.content : "")} isLoading={isPageLoading} />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-900" key={index}>
                <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))
          : null}

        {!isLoading && items.length
          ? items.map((item) => (
              <figure
                className="overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900"
                key={item._id}
              >
                <img
                  alt={item.image?.altText || item.title}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  src={item.image?.url}
                />
                <figcaption className="p-4">
                  <h2 className="font-bold text-primary dark:text-white">{item.title}</h2>
                  {item.caption ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.caption}</p> : null}
                </figcaption>
              </figure>
            ))
          : null}

        {!isLoading && !items.length ? (
          <div className="col-span-full grid min-h-64 place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <div>
              <ImageOff className="mx-auto mb-3 text-slate-400" size={36} />
              <h2 className="font-bold text-primary dark:text-white">No gallery images published yet</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Add an image from Admin Gallery and set status to published.
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
}
