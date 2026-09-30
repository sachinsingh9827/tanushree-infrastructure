import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardList, Hammer, HardHat, MapPin, Phone, Ruler } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetPageQuery } from "../../store/websiteApi.js";
import { fallbackHomeContent, fallbackPageContent } from "../data/staticContent.js";
import SiteLayout from "../components/SiteLayout.jsx";

const stats = [
  ["6+", "Core Services"],
  ["3", "Project Stages"],
  ["24/7", "Inquiry Access"],
  ["100%", "CMS Editable"]
];

const highlights = [
  {
    icon: ClipboardList,
    title: "Planning First",
    text: "Scope, timeline, material choices and site responsibilities are clarified before execution begins."
  },
  {
    icon: HardHat,
    title: "Site Coordination",
    text: "Daily work is organised around practical milestones so teams, vendors and clients stay aligned."
  },
  {
    icon: CheckCircle2,
    title: "Finish Quality",
    text: "Attention stays on usable spaces, clean finishing details and handover-ready construction."
  }
];

const processSteps = [
  { title: "Share your requirement", percent: 100, tone: "workflow-step-sky" },
  { title: "Review scope and site needs", percent: 82, tone: "workflow-step-green" },
  { title: "Plan budget and timeline", percent: 58, tone: "workflow-step-purple" },
  { title: "Execute with progress updates", percent: 36, tone: "workflow-step-teal" }
];

const tickerItems = ["Planning", "Construction", "Renovation", "Interior", "Site Updates", "Handover"];

const serviceLineup = [
  ["01", "Residential Build", "Homes, villas and living spaces planned for long-term comfort."],
  ["02", "Commercial Spaces", "Offices, shops and business sites delivered with practical coordination."],
  ["03", "Renovation Work", "Repair, upgrade and finishing for existing spaces without confusion."],
  ["04", "Interior Execution", "Materials, labour and final detailing aligned with daily progress."]
];

const fallbackSectionImages = {
  planning: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80",
  why: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80",
  workflow: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80"
};

function SmoothBackgroundImage({ alt, className = "", direction = "right", loading = "lazy", src }) {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    const section = image?.parentElement;
    if (!image || !section) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      {
        root: null,
        rootMargin: "-12% 0px -12% 0px",
        threshold: 0.18
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;

    const moveImage = () => {
      frame = 0;
      const section = image.parentElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const progress = Math.max(-1, Math.min(1, (sectionCenter - viewportCenter) / viewportHeight));
      const distance = 42;
      const sign = direction === "left" ? -1 : 1;
      const translateX = progress * distance * sign;
      const translateY = progress * -10;

      image.style.setProperty("--scroll-bg-x", `${translateX}px`);
      image.style.setProperty("--scroll-bg-y", `${translateY}px`);
    };

    const requestMove = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(moveImage);
    };

    moveImage();
    window.addEventListener("scroll", requestMove, { passive: true });
    window.addEventListener("resize", requestMove);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestMove);
      window.removeEventListener("resize", requestMove);
    };
  }, [direction]);

  return (
    <>
      <div className="absolute inset-0 bg-primary" />
      <img
        alt={alt}
        className={`scroll-controlled-bg scroll-reveal-${direction} absolute inset-y-0 -left-[8%] h-full w-[116%] object-cover motion-reduce:left-0 motion-reduce:w-full ${
          loaded && isVisible ? "scroll-bg-visible" : ""
        } ${className}`}
        loading={loading}
        onLoad={() => setLoaded(true)}
        ref={imageRef}
        src={src}
      />
    </>
  );
}

export default function Home() {
  const { data, isError, isLoading } = useGetPageQuery("home");
  const page = data?.data || (isError ? fallbackPageContent.home : null);
  const heroTitle = page?.title || fallbackHomeContent.title;
  const heroDescription = page?.seoDescription || fallbackHomeContent.description;
  const heroImage = page?.heroImage?.url || fallbackHomeContent.image;
  const cmsContent = page?.content || fallbackHomeContent.content;
  const planningImage = page?.sectionImages?.planning?.url || fallbackSectionImages.planning;
  const whyImage = page?.sectionImages?.why?.url || fallbackSectionImages.why;
  const workflowImage = page?.sectionImages?.workflow?.url || fallbackSectionImages.workflow;

  return (
    <SiteLayout>
      <section className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-primary text-white">
        <SmoothBackgroundImage
          alt={page?.heroImage?.altText || "Construction project site"}
          direction="left"
          loading="eager"
          src={heroImage}
        />
        <div className="absolute inset-0 bg-primary/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/65 to-primary/35" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/90 to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col justify-center px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.34fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-custom bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">
              <Hammer size={16} />
              {fallbackHomeContent.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              {heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded bg-secondary px-5 py-3 font-bold text-primary shadow hover:bg-secondary/90" to="/contact">
                Request a Quote
                <ArrowRight size={18} />
              </Link>
              <Link className="rounded border border-white/35 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20" to="/projects">
                View Projects
              </Link>
            </div>
          </div>

          <div className="hidden rounded-[2rem] border border-white/20 bg-white/10 p-5 text-right shadow-2xl backdrop-blur-md lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-secondary">Since</p>
            <p className="mt-2 text-5xl font-black leading-none">2026</p>
            <p className="mt-4 text-sm leading-6 text-slate-100">
              CMS-ready construction presence with project clarity, enquiry tracking and image-led storytelling.
            </p>
          </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[
              [Phone, "+91 00000 00000", "Call for enquiry"],
              [MapPin, "Project office, India", "Site visits by schedule"],
              [Ruler, "Planning to handover", "Complete execution support"]
            ].map(([Icon, title, text]) => (
              <div className="flex items-center gap-3 rounded-custom bg-white/12 p-4 backdrop-blur" key={title}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-custom bg-secondary text-primary">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-xs text-slate-200">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="overflow-hidden border-b border-primary/10 bg-secondary py-4 text-primary dark:border-secondary/20">
        <div className="home-ticker flex w-max items-center gap-5 text-2xl font-black uppercase tracking-tight sm:text-4xl">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span className="flex items-center gap-5" key={`${item}-${index}`}>
              {item}
              <span className="h-3 w-3 rounded-full bg-primary" />
            </span>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-12 text-white lg:min-h-screen lg:py-16">
        <SmoothBackgroundImage
          alt="Construction planning support"
          direction="right"
          src={planningImage}
        />
        <div className="absolute inset-0 bg-primary/68" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/55 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 lg:min-h-[calc(100vh-9rem)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Site Ready Planning</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">Planning support that keeps construction moving.</h2>
            <p className="mt-4 leading-7 text-slate-100">
              Scope, materials, timeline and execution support stay connected so every decision is easier to track on site.
            </p>
          </div>

          <div>
            {isLoading && !page ? (
              <div className="grid gap-3 rounded-lg bg-white/95 p-6 shadow">
                <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            ) : (
              <article
                className="cms-content rounded-lg border border-white/30 bg-white/90 p-6 leading-7 text-slate-700 shadow-xl backdrop-blur-md transition-colors dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-200 md:p-8"
                dangerouslySetInnerHTML={{ __html: cmsContent }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-14 text-white lg:min-h-screen">
        <SmoothBackgroundImage
          alt={page?.sectionImages?.why?.altText || "Why choose tanuenterprise"}
          direction="left"
          src={whyImage}
        />
        <div className="absolute inset-0 bg-primary/66" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/30" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/60 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Why Choose Us</p>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight text-white md:text-5xl">Construction work that stays clear from start to finish.</h2>
            <p className="mt-4 leading-7 text-slate-100">
              The home page now gives visitors a stronger picture of what tanuenterprise does, how the team works and how to start a project conversation.
            </p>
          </div>
          <div className="grid gap-5">
            {highlights.map(({ icon: Icon, ...item }) => (
              <article className="rounded-lg border border-white/30 bg-white/90 p-6 shadow backdrop-blur-md transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/90" key={item.title}>
                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-custom bg-header text-primary dark:bg-primary dark:text-secondary">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-primary dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-14 text-white lg:min-h-screen">
        <SmoothBackgroundImage
          alt="Construction workflow and site execution"
          direction="right"
          src={workflowImage}
        />
        <div className="absolute inset-0 bg-primary/68" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary/75 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Work Flow</p>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight text-white md:text-5xl">Simple process for new enquiries.</h2>
            <p className="mt-4 leading-7 text-slate-100">
              Visitors can understand the next steps before contacting the team, and admin can still edit the page intro from the CMS.
            </p>
            <div className="mt-9 rounded-[2rem] border border-white/25 bg-white/92 p-5 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-950/88 sm:p-7">
              <div className="grid gap-5">
                {processSteps.map((step, index) => (
                  <div className="workflow-progress-row" key={step.title}>
                    <div className="workflow-progress-count">
                      <span>{index + 1}</span>
                      <small>{step.percent}%</small>
                    </div>
                    <div className="workflow-progress-track">
                      <div
                        className={`workflow-progress-fill ${step.tone}`}
                        style={{ width: `${step.percent}%` }}
                      >
                        <span>{step.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">Execution Tracking</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Connected updates from enquiry to handover.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-100">
              Every step is easier to follow when planning, site movement and client communication stay connected in one workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 transition-colors dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary">Service Lineup</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-primary dark:text-white md:text-6xl">
                Work categories
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              A quick, scan-friendly view of what visitors can enquire about before contacting the team.
            </p>
          </div>

          <div className="divide-y divide-primary/10 overflow-hidden rounded-[2rem] border border-primary/10 bg-stone-50 shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-slate-900">
            {serviceLineup.map(([number, title, text]) => (
              <article className="group grid gap-4 p-5 transition hover:bg-header dark:hover:bg-slate-800 md:grid-cols-[0.18fr_0.42fr_1fr] md:items-center md:p-7" key={title}>
                <span className="text-3xl font-black text-secondary md:text-5xl">{number}</span>
                <h3 className="text-2xl font-black text-primary transition group-hover:translate-x-2 dark:text-white">{title}</h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 transition-colors dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_1fr] lg:items-center">
          <img
            alt="Building team reviewing construction drawings"
            className="h-full max-h-[420px] w-full rounded-lg object-cover shadow"
            loading="lazy"
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">About The Work</p>
            <h2 className="mt-2 text-3xl font-bold text-primary dark:text-white">Built for clients who want clarity, not confusion.</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              From early consultation to final finishing, the team keeps project information organised so decisions can be made quickly and work can move steadily.
            </p>
            <div className="mt-5 grid gap-3">
              {["Clear requirement review", "Material and labour coordination", "Site progress updates", "Final finishing checks"].map((item) => (
                <p className="flex items-center gap-3 text-sm font-semibold text-primary dark:text-white" key={item}>
                  <CheckCircle2 className="text-secondary" size={18} />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="overflow-hidden rounded-[2rem] bg-primary p-6 text-white shadow md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary">Start Now</p>
            <h2 className="mt-2 text-4xl font-black leading-tight md:text-6xl">Ready to discuss a project?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              Send your requirement from the contact page. Admin can review and manage enquiries from the private dashboard.
            </p>
          </div>
          <Link className="enquiry-cta mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-4 font-extrabold text-primary md:mt-0" to="/contact">
            <span className="enquiry-cta-text">Start</span> <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
