"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  BookOpen,
  Route,
  Award,
  MessageSquare,
  FileCode,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "nav.home", label: "Tableau de bord", href: "/apprenant", icon: LayoutDashboard },
  { key: "nav.mesFormations", label: "Mes formations", href: "/apprenant/mes-formations", icon: BookOpen },
  { key: "nav.parcours", label: "Parcours certifiants", href: "/parcours", icon: Route },
  { key: "nav.evaluations", label: "Examens & Quiz", href: "/evaluation", icon: Award },
  { key: "nav.attestations", label: "Mes attestations", href: "/attestation", icon: Award },
  { key: "nav.projet", label: "Projet Capstone", href: "/projet", icon: FileCode },
  { key: "nav.messagerie", label: "Messagerie & Mentorat", href: "/apprenant/messagerie", icon: MessageSquare },
];

export default function ApprenantSidebar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const userName = user?.name || "Jean Dupont";
  const userInitials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white shadow-sm">
            SAP
          </span>
          <span className="text-base font-bold tracking-tight text-navy">
            Academy <span className="text-xs font-semibold text-primary">Apprenant</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-surface hover:text-navy"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center justify-between rounded-xl bg-surface p-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
              {userInitials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy truncate">{userName}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || "Apprenant"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Déconnexion"
            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
