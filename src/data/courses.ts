export type Level = "decouverte" | "fondamentaux" | "consultant" | "expert";

export type Family =
  | "finance"
  | "logistique"
  | "production"
  | "rh"
  | "technique"
  | "donnees"
  | "plateforme"
  | "cloud";

export interface CourseSection {
  title: string;
  lessons: { title: string; minutes: number }[];
}

export interface Course {
  slug: string;
  title: string;
  summary: string;
  family: Family;
  module: string;
  level: Level;
  durationHours: number;
  languages: ("fr" | "en")[];
  labIncluded: boolean;
  certificationPrep: boolean;
  price: number | null;
  free: boolean;
  featured: boolean;
  trainerSlug: string;
  image: string;
  objectives: string[];
  prerequisites: string[];
  sections: CourseSection[];
  relatedSlugs: string[];
  publishedAt: string;
  draft?: boolean;
}

export const COURSES: Course[] = [
  {
    slug: "fi-comptabilite-generale",
    title: "SAP FI – Comptabilité générale",
    summary:
      "Plan comptable, écritures, clôture mensuelle et annuelle, reporting légal.",
    family: "finance",
    module: "FI",
    level: "fondamentaux",
    durationHours: 6,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: 1600000,
    free: false,
    featured: true,
    trainerSlug: "consultant-financier",
    image: "/courses/fi.jpg",
    objectives: ["Comprendre le plan comptable", "Écrire les écritures", "Clôturer"],
    prerequisites: [],
    sections: [
      { title: "Introduction", lessons: [{ title: "Principes de base", minutes: 20 }] },
      { title: "Clôture", lessons: [{ title: "Clôture mensuelle", minutes: 25 }] },
    ],
    relatedSlugs: ["co-controle-de-gestion", "abap-fondamentaux"],
    publishedAt: "2026-09-01",
  },
  {
    slug: "co-controle-de-gestion",
    title: "SAP CO – Contrôle de gestion",
    summary: "Centres de coûts, ordres internes, imputations, budgets.",
    family: "finance",
    module: "CO",
    level: "consultant",
    durationHours: 5,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: 1600000,
    free: false,
    featured: true,
    trainerSlug: "consultant-financier",
    image: "/courses/co.jpg",
    objectives: ["Centres de coûts", "Budgets"],
    prerequisites: ["fi-comptabilite-generale"],
    sections: [{ title: "Gestion", lessons: [{ title: "Centres de coûts", minutes: 30 }] }],
    relatedSlugs: ["fi-comptabilite-generale"],
    publishedAt: "2026-09-15",
  },
  {
    slug: "mm-achats-stocks",
    title: "SAP MM – Achats et stocks",
    summary: "Demandes d’achat, commandes, réception, factures fournisseurs, stocks.",
    family: "logistique",
    module: "MM",
    level: "fondamentaux",
    durationHours: 5,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: 1600000,
    free: false,
    featured: true,
    trainerSlug: "logisticien",
    image: "/courses/mm.jpg",
    objectives: ["Achats", "Stocks"],
    prerequisites: [],
    sections: [{ title: "Achats", lessons: [{ title: "Commandes d’achat", minutes: 28 }] }],
    relatedSlugs: ["sd-ventes-distribution"],
    publishedAt: "2026-10-01",
  },
  {
    slug: "sd-ventes-distribution",
    title: "SAP SD – Ventes et distribution",
    summary: "Commandes clients, livraison, facturation, tarification, partenaires.",
    family: "logistique",
    module: "SD",
    level: "fondamentaux",
    durationHours: 5,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: 1600000,
    free: false,
    featured: true,
    trainerSlug: "logisticien",
    image: "/courses/sd.jpg",
    objectives: ["Ventes", "Distribution"],
    prerequisites: [],
    sections: [{ title: "Ventes", lessons: [{ title: "Commande client", minutes: 26 }] }],
    relatedSlugs: ["mm-achats-stocks"],
    publishedAt: "2026-10-05",
  },
  {
    slug: "abap-fondamentaux",
    title: "SAP ABAP : fondamentaux",
    summary: "Syntaxe, dictionnaire de données, programmes, rapports, exercices.",
    family: "technique",
    module: "ABAP",
    level: "decouverte",
    durationHours: 8,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: 1600000,
    free: false,
    featured: true,
    trainerSlug: "architecte-btp",
    image: "/courses/abap.jpg",
    objectives: ["Syntaxe ABAP", "Dictionnaire", "Rapports"],
    prerequisites: [],
    sections: [{ title: "Fondamentaux", lessons: [{ title: "Premier programme", minutes: 35 }] }],
    relatedSlugs: ["abap-moderne-oo"],
    publishedAt: "2026-08-20",
  },
  {
    slug: "abap-moderne-oo",
    title: "SAP ABAP moderne (orienté objet)",
    summary: "Classes, interfaces, tests unitaires, bonnes pratiques.",
    family: "technique",
    module: "ABAP",
    level: "consultant",
    durationHours: 7,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: 1600000,
    free: false,
    featured: false,
    trainerSlug: "architecte-btp",
    image: "/courses/abap-oo.jpg",
    objectives: ["Classes", "Tests unitaires"],
    prerequisites: ["abap-fondamentaux"],
    sections: [{ title: "Orienté objet", lessons: [{ title: "Classes", minutes: 32 }] }],
    relatedSlugs: ["abap-fondamentaux"],
    publishedAt: "2026-09-10",
  },
];

export const getCourseBySlug = (slug: string): Course | undefined =>
  COURSES.find((course) => course.slug === slug);

export const getCoursesByFamily = (family: string): Course[] =>
  COURSES.filter((course) => course.family === family);
