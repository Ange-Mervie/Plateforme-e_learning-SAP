"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const fr = {
  nav: {
    home: "Accueil",
    catalogue: "Catalogue",
    parcours: "Parcours",
    formateurs: "Formateurs",
    certifications: "Certifications",
    login: "Connexion",
    register: "S'inscrire",
  },
  hero: {
    badge: "SAP S/4HANA · SAP Fiori · SAP BTP",
    title: "Développez vos compétences SAP. Transformez votre avenir professionnel.",
    subtitle:
      "Cours pratiques, cas métier et exercices guidés pour maîtriser les modules SAP S/4HANA, Fiori et BTP — du fonctionnel au consultant expert.",
    searchPlaceholder: "Rechercher une formation : FI, MM, SD, ABAP, BTP…",
    searchButton: "Rechercher",
    explore: "Explorer les formations",
    discover: "Découvrir notre académie",
  },
  domains: {
    title: "Explorez les domaines SAP",
    subtitle: "Les modules métier qui pilotent vos processus SAP.",
    cards: {
      fonctionnelTitle: "SAP Fonctionnel",
      fonctionnelDesc: "Finance, logistique, production, qualité et RH : les modules métier qui pilotent les processus SAP.",
      techniqueTitle: "SAP Technique",
      techniqueDesc: "ABAP, Basis, Fiori, BTP, sécurité et migration : l’architecture, le développement et l’exploitation des solutions SAP.",
      dataTitle: "Data & Analytics",
      dataDesc: "HANA, BW/4HANA, SAP Analytics Cloud, Datasphere et Business AI : modélisation, exploitation et intelligence des données SAP.",
      solutionsTitle: "Solutions spécialisées",
      solutionsDesc: "SuccessFactors, Ariba, Concur, Fieldglass, Signavio, Activate : les suites complémentaires et les méthodologies de transformation.",
    },
  },
  popular: {
    title: "Formations populaires",
  },
  stats: {
    title: "Chiffres clés",
  },
  paths: {
    title: "Parcours phares",
  },
  testimonials: {
    title: "Ils ont transformé leur carrière SAP",
  },
  certifications: {
    title: "Validez vos compétences SAP",
    subtitle: "Examens blancs originaux, plans de révision et attestations.",
  },
  footer: {
    tagline: "Plateforme e-learning spécialisée SAP : formations pratiques, cas métier et certifications.",
  },
};

const en: typeof fr = {
  nav: {
    home: "Home",
    catalogue: "Catalog",
    parcours: "Learning paths",
    formateurs: "Trainers",
    certifications: "Certifications",
    login: "Log in",
    register: "Sign up",
  },
  hero: {
    badge: "SAP S/4HANA · SAP Fiori · SAP BTP",
    title: "Develop your SAP skills. Transform your professional future.",
    subtitle:
      "Practical courses, business cases and guided exercises to master SAP S/4HANA, Fiori and BTP — from functional to expert consultant.",
    searchPlaceholder: "Search a course: FI, MM, SD, ABAP, BTP…",
    searchButton: "Search",
    explore: "Explore courses",
    discover: "Discover our academy",
  },
  domains: {
    title: "Explore SAP domains",
    subtitle: "The business modules that drive SAP processes.",
    cards: {
      fonctionnelTitle: "SAP Functional",
      fonctionnelDesc: "Finance, logistics, production, quality and HR: the business modules that drive SAP processes.",
      techniqueTitle: "SAP Technical",
      techniqueDesc: "ABAP, Basis, Fiori, BTP, security and migration: architecture, development and operations of SAP solutions.",
      dataTitle: "Data & Analytics",
      dataDesc: "HANA, BW/4HANA, SAP Analytics Cloud, Datasphere and Business AI: modelling, exploitation and intelligence of SAP data.",
      solutionsTitle: "Specialized Solutions",
      solutionsDesc: "SuccessFactors, Ariba, Concur, Fieldglass, Signavio, Activate: complementary suites and transformation methodologies.",
    },
  },
  popular: {
    title: "Popular courses",
  },
  stats: {
    title: "Key figures",
  },
  paths: {
    title: "Flagship learning paths",
  },
  testimonials: {
    title: "They transformed their SAP career",
  },
  certifications: {
    title: "Validate your SAP skills",
    subtitle: "Original mock exams, revision plans and success certificates.",
  },
  footer: {
    tagline: "SAP learning platform specialized in SAP: practical training, business cases and certifications.",
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  const t = (key: string) => {
    const dict = lang === "en" ? en : fr;
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object") {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict);
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
