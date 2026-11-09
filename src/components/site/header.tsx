"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import LanguageSwitcher from "@/components/site/language-switcher";

const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.catalogue", href: "/catalogue" },
  { key: "nav.parcours", href: "/parcours" },
  { key: "nav.formateurs", href: "/formateurs" },
  { key: "nav.certifications", href: "/certifications" },
];

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
            SAP
          </span>
          <span className="text-lg font-semibold tracking-tight text-navy">Academy</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={
                isActive(item.href)
                  ? "text-sm font-semibold text-primary underline decoration-2 underline-offset-4 decoration-primary"
                  : "text-sm font-medium text-slate-600 transition-colors hover:text-navy"
              }
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/connexion" className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-navy sm:block">
            {t("nav.login")}
          </Link>
          <Link href="/inscription" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {t("nav.register")}
          </Link>
        </div>
      </div>
    </header>
  );
}
