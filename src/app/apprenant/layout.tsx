import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/authorization";
import { AuthenticationError } from "@/lib/auth/types";


export default function ApprenantLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de votre espace…</div>}>
      <ProtectedApprenantLayout>{children}</ProtectedApprenantLayout>
    </Suspense>
  );
}

async function ProtectedApprenantLayout({ children }: { children: ReactNode }) {
  try {
    await requireUser();
  } catch (error) {
    if (error instanceof AuthenticationError && error.status === 401) {
      redirect("/connexion");
    }
    throw error;
  }
  return children;
}
