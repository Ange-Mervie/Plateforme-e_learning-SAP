import Link from "next/link";
import { LayoutDashboard, BookOpen, Route, Award, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/apprenant", icon: LayoutDashboard },
  { label: "Mes formations", href: "/apprenant/mes-formations", icon: BookOpen },
  { label: "Parcours", href: "/parcours", icon: Route },
  { label: "Certifications", href: "/certifications", icon: Award },
  { label: "Messagerie", href: "/apprenant/messagerie", icon: MessageSquare },
];

export default function ApprenantSidebar() {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">SAP</span>
        <span className="text-lg font-semibold tracking-tight text-navy">Academy</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-surface hover:text-navy"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">JD</span>
          <div>
            <p className="text-sm font-semibold text-navy">Jean Dupont</p>
            <p className="text-xs text-slate-600">Apprenant</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
