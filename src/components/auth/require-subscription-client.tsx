"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RequireActiveSubscriptionProps {
  children: React.ReactNode;
}

export default function RequireActiveSubscriptionClient({
  children,
}: RequireActiveSubscriptionProps) {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "same-origin" });
        if (!res.ok) {
          if (active) router.push("/connexion");
          return;
        }
        const data = await res.json();
        if (!data?.user || data.user.subscription?.status !== "active") {
          if (active) router.push(data?.user ? "/paiement" : "/connexion");
        }
      } catch {
        if (active) router.push("/connexion");
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  return <>{children}</>;
}
