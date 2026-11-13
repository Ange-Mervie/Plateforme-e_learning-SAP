"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import LanguageSwitcher from "@/components/site/language-switcher";

type MenuKey = "home" | "sap" | "odoo" | null;

const IBN_LINKEDIN = "https://www.linkedin.com/in/ibn-group-755332227/";
const LinkedinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);


export default function Header() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<MenuKey>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
    setMobileMenuOpen(false);
  }

  const isActivePath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const toggleMenu = (key: MenuKey) => setOpenMenu((prev) => (prev === key ? null : key));

  const sapItems = [
    { label: t("nav.catalogue"), href: "/catalogue?track=sap" },
    { label: t("nav.formateurs"), href: "/formateurs?track=sap" },
    { label: t("nav.certifications"), href: "/certifications?track=sap" },
    { label: t("nav.parcours"), href: "/parcours?track=sap" },
  ];

  const odooItems = [
    { label: t("nav.catalogue"), href: "/catalogue?track=odoo" },
    { label: t("nav.formateurs"), href: "/formateurs?track=odoo" },
    { label: t("nav.certifications"), href: "/certifications?track=odoo" },
    { label: t("nav.parcours"), href: "/parcours?track=odoo" },
  ];

  const homeItems = [
    { label: t("nav.ibnGroup"), href: "/ibn-group" },
    { label: t("nav.realisations"), href: "/ibn-group#realisations" },
  ];

  const renderDropdown = (key: Exclude<MenuKey, null>, label: string, items: { label: string; href: string }[], extra?: ReactNode) => {
    const open = openMenu === key;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleMenu(key)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-navy ${
            open ? "text-primary" : "text-slate-600"
          }`}
        >
          {label}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div
            role="menu"
            className="absolute left-0 top-full z-50 mt-2 min-w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-surface hover:text-primary ${
                  isActivePath(item.href.split("?")[0]) ? "font-semibold text-primary" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {extra}
          </div>
        )}
      </div>
    );
  };

  const authActions = isAuthenticated && user ? (
    <div className="hidden items-center gap-3 sm:flex">
      <Link
        href={user.role === "admin" ? "/admin/demandes" : user.role === "formateur" ? "/formateur/demandes" : "/apprenant"}
        className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-slate-200"
      >
        <LayoutDashboard className="h-4 w-4 text-primary" />
        <span>{user.role === "admin" ? t("nav.adminRequests") : user.role === "formateur" ? t("nav.myRequests") : t("common.dashboard")}</span>
      </Link>
      <div className="flex items-center gap-2 border-l border-slate-200 pl-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
        </span>
        <button
          type="button"
          onClick={() => void logout().catch((error: unknown) => console.error("[Auth] Logout failed:", error))}
          title={t("common.logout")}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : (
    <div className="hidden items-center gap-2 sm:flex">
      <Link href="/connexion" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
        {t("nav.login")}
      </Link>
    </div>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/sap-logo.svg" alt="SAP" width={70} height={35} className="h-7 w-auto object-contain" />
          <Image src="/images/ibn-logo.png" alt="IBN Group" width={30} height={30} className="h-7 w-7 object-contain" />
          <span className="text-lg font-bold tracking-tight text-navy">
            ELEVATE <span className="text-xs font-medium text-primary">By IBN Group</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {renderDropdown(
            "home",
            t("nav.home"),
            homeItems,
            <a
              href={IBN_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="mt-1 flex items-center gap-2 rounded-lg border-t border-slate-100 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-surface hover:text-primary"
            >
              <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" />
              {t("nav.elevateLinkedin")}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {renderDropdown("sap", t("nav.sapTraining"), sapItems)}
          {renderDropdown("odoo", t("nav.odooTraining"), odooItems)}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {authActions}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label={t("common.menu")}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col space-y-1">
            {[
              { key: "home" as const, label: t("nav.home"), items: homeItems, external: { label: t("nav.elevateLinkedin"), href: IBN_LINKEDIN } },
              { key: "sap" as const, label: t("nav.sapTraining"), items: sapItems },
              { key: "odoo" as const, label: t("nav.odooTraining"), items: odooItems },
            ].map((section) => (
              <div key={section.key} className="border-b border-slate-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileOpenSection((s) => (s === section.key ? null : section.key))}
                  className="flex w-full items-center justify-between py-2 text-sm font-semibold text-navy"
                >
                  {section.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpenSection === section.key ? "rotate-180" : ""}`} />
                </button>
                {mobileOpenSection === section.key && (
                  <div className="space-y-1 pb-2 pl-3">
                    {section.items.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-surface">
                        {item.label}
                      </Link>
                    ))}
                    {section.external && (
                      <a href={section.external.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-surface">
                        <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" />
                        {section.external.label}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-slate-200 pt-3">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <Link href={user.role === "admin" ? "/admin/demandes" : "/formateur/demandes"} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg bg-surface px-4 py-2.5 text-sm font-semibold text-navy">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    {user.role === "admin" ? t("nav.adminRequests") : t("nav.myRequests")} ({user.name})
                  </Link>
                  <button type="button" onClick={() => { void logout().catch((e) => console.error(e)); setMobileMenuOpen(false); }} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    {t("common.logout")}
                  </button>
                </div>
              ) : (
                <Link href="/connexion" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-surface">
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
