"use client";

import { useLanguage } from "@/context/language-context";
import type { Lang } from "@/context/language-context";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-surface p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            lang === l.code ? "bg-primary text-white" : "text-slate-600 hover:text-navy"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
