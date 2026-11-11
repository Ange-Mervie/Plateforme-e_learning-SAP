"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/language-context";

type Stat = {
  value: string;
  labelKey: string;
  image: string;
};

const STATS: Stat[] = [
  { value: "120+", labelKey: "stats.courses", image: "/courses/hero.svg" },
  { value: "45", labelKey: "stats.trainers", image: "/courses/abap.svg" },
  { value: "25 000+", labelKey: "stats.learners", image: "/parcours/data-analyst.svg" },
  { value: "96 %", labelKey: "stats.satisfaction", image: "/parcours/functional-consultant.svg" },
];

function formatValue(target: string, animated: number): string {
  const suffix = target.replace(/[0-9]/g, "").trim();
  const formatted = animated.toLocaleString("fr-FR");
  return `${formatted}${suffix}`;
}

function useCountUp(target: string, start: boolean, duration = 1800): number {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetNum = parseInt(target.replace(/[^0-9]/g, ""), 10);
    if (reduced) {
      const reducedRaf = requestAnimationFrame(() => setDisplay(targetNum));
      return () => cancelAnimationFrame(reducedRaf);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(targetNum * eased);
      setDisplay(v);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(targetNum);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return display;
}

function StatItem({ stat, start }: { stat: Stat; start: boolean }) {
  const { t } = useLanguage();
  const animated = useCountUp(stat.value, start);
  return (
    <div className="relative overflow-hidden rounded-2xl text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative p-6">
        <p className="text-4xl font-bold text-white">{formatValue(stat.value, animated)}</p>
        <p className="mt-2 text-sm text-blue-100">{t(stat.labelKey)}</p>
      </div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-navy">
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatItem key={stat.labelKey} stat={stat} start={start} />
          ))}
        </div>
      </div>
    </section>
  );
}
