import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useGetHomeQuery } from "../../store/websiteApi.js";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Gallery", "/gallery"]
];

export default function SiteLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: homeData } = useGetHomeQuery();
  const contactPhone = homeData?.data?.settings?.phone || "+91 7489887978";
  const supportEmail = homeData?.data?.settings?.email;

  return (
    <main className="flex min-h-screen flex-col bg-stone-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur transition-colors dark:border-secondary/20 dark:bg-primary/95">
        <div className="hidden border-b border-primary/10 bg-primary text-white dark:border-secondary/20 lg:block">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs font-semibold">
            <span>Construction, renovation and interior project delivery</span>
            <a className="text-secondary" href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}>Call: {contactPhone}</a>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link className="flex min-w-0 flex-1 items-center md:flex-none" onClick={() => setMobileMenuOpen(false)} to="/">
            <img
              alt="tanuenterprise"
              className="h-12 w-auto max-w-[160px] object-contain sm:hidden"
              src="/assets/logo/mobilelogo.svg"
            />
            <img
              alt="tanuenterprise"
              className="hidden h-16 w-auto max-w-[280px] object-contain sm:block"
              src="/assets/logo/deshtoplogo.svg"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="inline-flex items-center gap-1 rounded-full border border-primary/10 bg-slate-100/80 p-1 shadow-inner dark:border-secondary/20 dark:bg-slate-950/70">
              {navItems.map(([label, href]) => (
                <NavLink
                  end={href === "/"}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 xl:px-5 ${
                      isActive
                        ? "bg-white text-primary shadow-[0_8px_18px_-14px_rgba(15,42,74,0.75)] ring-1 ring-primary/10 dark:bg-secondary dark:text-primary dark:ring-secondary/20"
                        : "text-slate-600 hover:bg-white/70 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-secondary"
                    }`
                  }
                  key={href}
                  to={href}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>

          <button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-custom border border-primary/20 text-primary transition hover:border-secondary hover:bg-header dark:border-secondary/30 dark:text-secondary dark:hover:bg-slate-900 sm:h-11 sm:w-11"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link className="hidden shrink-0 items-center gap-2 rounded-custom bg-secondary px-4 py-3 text-sm font-bold text-primary shadow-sm transition hover:bg-secondary/90 sm:inline-flex" to="/contact">
            Enquire
            <ArrowRight size={16} />
          </Link>

          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-custom bg-primary text-white shadow-sm md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            type="button"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav className="mx-4 mb-3 grid animate-mobile-menu-enter gap-2 rounded-lg border border-primary/10 bg-white p-3 shadow-lg dark:border-secondary/20 dark:bg-slate-950 md:hidden">
            {navItems.map(([label, href]) => (
              <NavLink
                end={href === "/"}
                className={({ isActive }) =>
                  `rounded-custom px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-primary text-white dark:bg-secondary dark:text-primary"
                      : "bg-header/70 text-primary hover:bg-header dark:bg-slate-900 dark:text-slate-200 dark:hover:text-secondary"
                  }`
                }
                key={href}
                onClick={() => setMobileMenuOpen(false)}
                to={href}
              >
                {label}
              </NavLink>
            ))}
            <Link
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-custom bg-secondary px-4 py-3 text-sm font-bold text-primary"
              onClick={() => setMobileMenuOpen(false)}
              to="/contact"
            >
              Enquire
              <ArrowRight size={16} />
            </Link>
          </nav>
        ) : null}
      </header>

      <div className="flex-1 animate-page-enter" key={location.pathname}>
        {children}
      </div>

      <footer className="border-t border-primary/10 bg-primary text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <img
              alt="tanuenterprise"
              className="h-16 w-auto max-w-[280px] object-contain"
              src="/assets/logo/deshtoplogo.svg"
            />
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Builder and construction portfolio CMS for projects, services, gallery and contact management.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Company</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link to="/about">About</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/services">Services</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              {contactPhone ? <a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}>{contactPhone}</a> : null}
              {supportEmail ? <a href={`mailto:${supportEmail}`}>{supportEmail}</a> : null}
              <Link to="/contact">Contact Us</Link>
              <Link to="/admin-login">Admin Login</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
          Copyright 2026 tanuenterprise. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
