"use client";

import { useState, useEffect } from "react";

export function Badge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data: any) => {
        if (!active) return;
        const requests = data.requests || [];
        const c = requests.filter((r: any) => r.status === "nouvelle").length;
        setCount(c);
      })
      .catch(() => {
        if (active) setCount(0);
      });
    return () => {
      active = false;
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
      {count}
    </span>
  );
}