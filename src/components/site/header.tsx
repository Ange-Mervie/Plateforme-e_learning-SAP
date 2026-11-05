import Link from "next/link";

const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Parcours", href: "/parcours" },
  { label: "Formateurs", href: "/formateurs" },
  { label: "Certifications", href: "/certifications" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
            SAP
          </span>
          <span className="text-lg font-semibold tracking-tight text-navy">
            Academy
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-navy sm:block"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
