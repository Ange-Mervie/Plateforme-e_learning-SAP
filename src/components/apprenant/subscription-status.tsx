"use client";
import { useEffect, useState } from "react";

export default function SubscriptionStatus({ userId }: { userId: number }) {
  const [status, setStatus] = useState<string>("...");
  useEffect(() => {
    fetch(`/api/subscriptions?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.subscription?.status || "aucun"));
  }, [userId]);
  return <div className="rounded-lg bg-surface p-4 text-sm">Abonnement : {status}</div>;
}
