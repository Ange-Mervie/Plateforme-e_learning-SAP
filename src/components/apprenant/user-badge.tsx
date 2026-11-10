"use client";

import { useAuth } from "@/context/auth-context";

export default function UserBadge() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {user.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </span>
      <div className="hidden text-left sm:block">
        <p className="text-sm font-semibold text-navy">{user.name}</p>
        <p className="text-xs text-slate-600">{user.role}</p>
      </div>
      <button
        type="button"
        onClick={() => void logout().catch((error: unknown) => console.error("[Auth] Logout failed:", error))}
        className="ml-2 text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
      >
        Déconnexion
      </button>
    </div>
  );
}
