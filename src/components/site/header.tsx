"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import LanguageSwitcher from "@/components/site/language-switcher";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";

const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.catalogue", href: "/catalogue" },
  { key: "nav.parcours", href: "/parcours" },
  { key: "nav.formateurs", href: "/formateurs" },
  { key: "nav.certifications", href: "/certifications" },
  { label: "IBN Group", href: "/ibn-group" },
];

export default function Header() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {/* Logo officiel IBN Group */}
          <Image
            src="/images/ibn-logo.png"
            alt="IBN Group"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-navy">
            ELEVATE <span className="text-xs font-medium text-primary">By IBN Group</span>
          </span>
          {/* Silhouette du continent africain */}
          <svg
            aria-hidden="true"
            viewBox="0 0 64 44"
            className="h-8 w-14 text-primary/30"
            fill="currentColor"
          >
            <path d="M12 38 C14 33 16 27 19 22 C22 17 25 12 29 9 C32 6 36 6 39 8 C42 10 44 14 46 18 C48 22 50 26 51 30 C52 34 53 37 55 38 L12 38 Z" />
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const label = item.key ? t(item.key) : item.label;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-sm font-semibold text-primary underline decoration-2 underline-offset-4 decoration-primary"
                    : "text-sm font-medium text-slate-600 transition-colors hover:text-navy"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {isAuthenticated && user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/apprenant"
                className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-slate-200"
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>Mon Espace</span>
              </Link>
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </span>
                <button
                  type="button"
                  onClick={() => void logout().catch((error: unknown) => console.error("[Auth] Logout failed:", error))}
                  title="Déconnexion"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/connexion"
                className="text-sm font-medium text-slate-700 transition-colors hover:text-navy"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/inscription"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const label = item.key ? t(item.key) : item.label;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 ${
                    active ? "font-semibold text-primary" : "text-slate-700 hover:text-navy"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <div className="border-t border-slate-200 pt-3">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/apprenant"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-surface px-4 py-2.5 text-sm font-semibold text-navy"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    Mon Espace ({user.name})
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void logout().catch((error: unknown) => console.error("[Auth] Logout failed:", error));
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/connexion"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-navy"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-white"
                  >
                    {t("nav.register")}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
