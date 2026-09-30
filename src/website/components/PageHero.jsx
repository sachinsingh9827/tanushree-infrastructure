export default function PageHero({ title, eyebrow, description, image }) {
  if (image?.url) {
    return (
      <section className="relative overflow-hidden bg-primary text-white">
        <img
          alt={image.altText || title || "Page hero"}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          src={image.url}
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{eyebrow}</p> : null}
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">{description}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white transition-colors dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{description}</p> : null}
      </div>
    </section>
  );
}
