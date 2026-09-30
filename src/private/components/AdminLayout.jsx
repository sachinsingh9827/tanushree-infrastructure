import {
  FolderKanban,
  GalleryHorizontalEnd,
  FileText,
  Headphones,
  Home,
  LayoutDashboard,
  Mail,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import { clearAdminToken } from "../services/authStorage.js";

const links = [
  ["Dashboard", "/admin/dashboard", LayoutDashboard],
  ["Projects", "/admin/projects", FolderKanban],
  ["Services", "/admin/services", Wrench],
  ["Gallery", "/admin/gallery", GalleryHorizontalEnd],
  ["Edit Home", "/admin/pages/home", Home],
  ["Edit About", "/admin/pages/about", FileText],
  ["Edit Services", "/admin/pages/services", FileText],
  ["Edit Projects", "/admin/pages/projects", FileText],
  ["Edit Gallery", "/admin/pages/gallery", FileText],
  ["Edit Contact", "/admin/pages/contact", FileText],
  ["Settings", "/admin/settings", Settings],
  ["Contacts", "/admin/contacts", Mail],
  ["Support", "/admin/support", Headphones]
];

export default function AdminLayout({ children, title }) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  function logout() {
    clearAdminToken();
    window.location.href = "/admin-login";
  }

  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 md:static md:z-auto md:min-h-screen md:shadow-none ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`}
    >
      <div className="flex h-24 items-center justify-center border-b border-slate-200 bg-header px-4 dark:border-slate-800 dark:bg-primary">
        {sidebarCollapsed ? (
          <img
            alt="Tanushree Infrastructure"
            className="h-14 w-14 rounded object-contain"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
            src="/assets/logo/mobilelogo.svg"
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <img
            alt="Tanushree Infrastructure"
              className="h-20 w-full max-w-[220px] object-contain"
              onError={(event) => {
                event.currentTarget.hidden = true;
              }}
              src="/assets/logo/deshtoplogo.svg"
            />
          </div>
        )}
      </div>

      <nav className="grid gap-1 overflow-y-auto p-3 text-sm">
        {links.map(([label, href, Icon]) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-custom px-3 py-2 font-medium transition ${
                isActive ? "bg-tabActive text-white" : "text-slate-700 hover:bg-header hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-secondary"
              } ${sidebarCollapsed ? "md:justify-center" : ""}`
            }
            key={href}
            onClick={() => setSidebarOpen(false)}
            title={label}
            to={href}
          >
            <Icon className="shrink-0" size={18} />
            {!sidebarCollapsed ? <span>{label}</span> : <span className="md:hidden">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          aria-label={theme === "dark" ? "Switch admin to light mode" : "Switch admin to dark mode"}
          className={`flex w-full items-center gap-3 rounded-custom border border-slate-200 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary/30 hover:bg-header dark:border-slate-800 dark:text-secondary dark:hover:bg-slate-900 ${
            sidebarCollapsed ? "md:justify-center" : ""
          }`}
          onClick={toggleTheme}
          type="button"
        >
          {theme === "dark" ? <Sun className="shrink-0" size={18} /> : <Moon className="shrink-0" size={18} />}
          {!sidebarCollapsed ? <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span> : <span className="md:hidden">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-light text-primary dark:bg-slate-950 dark:text-white">
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <div className="flex min-h-screen">
        {sidebar}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/10 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="rounded-custom border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-slate-700 md:hidden"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                Menu
              </button>
              <button
                aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
                className="hidden rounded-custom border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-slate-700 md:inline-flex"
                onClick={() => setSidebarCollapsed((value) => !value)}
                type="button"
              >
                {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
              <div className="min-w-0">
                {/* <p className="text-xs font-semibold uppercase tracking-wide text-tabActive dark:text-secondary">Admin Panel</p> */}
                <h2 className="truncate text-xl font-bold md:text-2xl">{title}</h2>
              </div>
            </div>
            <button className="rounded-custom bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setLogoutConfirmOpen(true)} type="button">
              Logout
            </button>
          </header>

          <div className="admin-surface p-4 md:p-6">{children}</div>
        </section>
      </div>
      <ConfirmModal
        confirmText="Logout"
        message="You will be signed out of the admin panel."
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={logout}
        open={logoutConfirmOpen}
        title="Confirm logout"
      />
    </main>
  );
}
