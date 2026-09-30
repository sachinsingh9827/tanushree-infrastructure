import {
  FolderKanban,
  GalleryHorizontalEnd,
  Headphones,
  Mail,
  Settings,
  TrendingUp,
  Wrench
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetAdminContactsQuery,
  useGetAdminGalleryQuery,
  useGetAdminProjectsQuery,
  useGetAdminServicesQuery,
  useGetAdminSupportTicketsQuery
} from "../../store/websiteApi.js";
import AdminLayout from "../components/AdminLayout.jsx";

const quickActions = [
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Gallery", href: "/admin/gallery", icon: GalleryHorizontalEnd },
  { label: "Settings", href: "/admin/settings", icon: Settings }
];

function totalFrom(response) {
  return response?.meta?.total || response?.data?.length || 0;
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <article className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-primary dark:text-white">{value}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-custom ${tone}`}>
          <Icon size={22} />
        </span>
      </div>
      <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
        <TrendingUp size={14} />
        Live admin overview
      </p>
    </article>
  );
}

function BarChart({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wide text-tabActive dark:text-secondary">Content Chart</p>
        <h2 className="mt-1 text-xl font-bold text-primary dark:text-white">CMS Records</h2>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
              <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.max((item.value / max) * 100, item.value ? 8 : 0)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DonutChart({ contacts, support }) {
  const total = Math.max(contacts + support, 1);
  const contactPercent = (contacts / total) * 100;

  return (
    <section className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-tabActive dark:text-secondary">Enquiries</p>
      <h2 className="mt-1 text-xl font-bold text-primary dark:text-white">Contact vs Support</h2>
      <div className="mt-6 flex items-center gap-6">
        <div
          className="grid h-32 w-32 shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(#F2A93B 0 ${contactPercent}%, #0F2A4A ${contactPercent}% 100%)` }}
        >
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center dark:bg-slate-950">
            <span className="text-xl font-bold text-primary dark:text-white">{contacts + support}</span>
          </div>
        </div>
        <div className="grid gap-3 text-sm">
          <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="h-3 w-3 rounded-full bg-secondary" />
            Contacts: <strong>{contacts}</strong>
          </p>
          <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="h-3 w-3 rounded-full bg-primary" />
            Support: <strong>{support}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { data: projects } = useGetAdminProjectsQuery({ page: 1, limit: 5 });
  const { data: services } = useGetAdminServicesQuery({ page: 1, limit: 5 });
  const { data: gallery } = useGetAdminGalleryQuery({ page: 1, limit: 5 });
  const { data: contacts } = useGetAdminContactsQuery({ page: 1, limit: 5 });
  const { data: support } = useGetAdminSupportTicketsQuery({ page: 1, limit: 5 });

  const totals = {
    projects: totalFrom(projects),
    services: totalFrom(services),
    gallery: totalFrom(gallery),
    contacts: totalFrom(contacts),
    support: totalFrom(support)
  };

  const chartItems = [
    { label: "Projects", value: totals.projects },
    { label: "Services", value: totals.services },
    { label: "Gallery", value: totals.gallery }
  ];

  return (
    <AdminLayout title="Dashboard">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={FolderKanban} label="Projects" tone="bg-header text-primary dark:bg-primary dark:text-secondary" value={totals.projects} />
        <StatCard icon={Wrench} label="Services" tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" value={totals.services} />
        <StatCard icon={GalleryHorizontalEnd} label="Gallery" tone="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" value={totals.gallery} />
        <StatCard icon={Mail} label="Contacts" tone="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" value={totals.contacts} />
        <StatCard icon={Headphones} label="Support" tone="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" value={totals.support} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <BarChart items={chartItems} />
        <DonutChart contacts={totals.contacts} support={totals.support} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase tracking-wide text-tabActive dark:text-secondary">Quick Actions</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickActions.map(({ href, icon: Icon, label }) => (
              <Link
                className="flex items-center gap-3 rounded-custom border border-slate-200 p-3 font-semibold text-primary transition hover:border-primary/30 hover:bg-header dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
                key={href}
                to={href}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase tracking-wide text-tabActive dark:text-secondary">Admin Focus</p>
          <h2 className="mt-1 text-xl font-bold text-primary dark:text-white">Today's checklist</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <p className="rounded-custom bg-slate-50 p-3 dark:bg-slate-900">Review new contact enquiries and update their status.</p>
            <p className="rounded-custom bg-slate-50 p-3 dark:bg-slate-900">Publish fresh gallery images after upload.</p>
            <p className="rounded-custom bg-slate-50 p-3 dark:bg-slate-900">Keep About page and SEO content updated with CKEditor.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
