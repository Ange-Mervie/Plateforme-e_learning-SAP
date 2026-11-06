"use client";

import { useLanguage } from "@/context/language-context";

export default function Messagerie() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-navy">{t("nav.messagerie")}</h1>
      <p className="mt-4 text-slate-600">{t("messagerie.subtitle")}</p>
    </main>
  );
}
