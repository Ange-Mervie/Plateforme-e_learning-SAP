export type Level = "decouverte" | "fondamentaux" | "consultant" | "expert";

export type Family =
  | "finance"
  | "logistique"
  | "production"
  | "rh"
  | "technique"
  | "donnees"
  | "plateforme"
  | "cloud"
  | "odoo-fonctionnel"
  | "odoo-technique";

export interface CourseSection {
  title: string;
  lessons: { title: string; minutes: number }[];
}

export interface Course {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
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
  track: "sap" | "odoo";
  draft?: boolean;
}

export const COURSES: Course[] = [
  {
    slug: "fi-comptabilite-generale",
    title: "SAP FI — Comptabilité générale",
    titleEn: "SAP FI — General Ledger",
    summary: "Plan comptable, écritures, clôture mensuelle et annuelle, reporting légal.",
    summaryEn: "Chart of accounts, postings, monthly and annual closing, and legal reporting.",
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
    trainerSlug: "mr-legima",
    image: "/courses/fi.svg",
    objectives: ["Comprendre le plan comptable", "Saisir les écritures comptables", "Réaliser les clôtures"],
    prerequisites: [],
    sections: [
      { title: "Introduction", lessons: [{ title: "Principes de base", minutes: 20 }] },
      { title: "Clôture", lessons: [{ title: "Clôture mensuelle", minutes: 25 }] },
    ],
    relatedSlugs: ["abap-fondamentaux"],
    publishedAt: "2026-09-01",
    track: "sap",
  },
  {
    slug: "mm-achats-stocks",
    title: "SAP MM — Achats et stocks",
    titleEn: "SAP MM — Purchasing and Inventory",
    summary: "Demandes d'achat, commandes, réception, factures fournisseurs, gestion des stocks.",
    summaryEn: "Purchase requisitions, orders, goods receipt, vendor invoices, and inventory management.",
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
    trainerSlug: "mr-chami",
    image: "/courses/mm.svg",
    objectives: ["Gérer les achats", "Piloter les stocks"],
    prerequisites: [],
    sections: [{ title: "Achats", lessons: [{ title: "Commandes d'achat", minutes: 28 }] }],
    relatedSlugs: ["sd-ventes-distribution"],
    publishedAt: "2026-10-01",
    track: "sap",
  },
  {
    slug: "sd-ventes-distribution",
    title: "SAP SD — Ventes et distribution",
    titleEn: "SAP SD — Sales and Distribution",
    summary: "Commandes clients, livraison, facturation, tarification et partenaires.",
    summaryEn: "Sales orders, delivery, billing, pricing, and business partners.",
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
    trainerSlug: "mr-chami",
    image: "/courses/sd.svg",
    objectives: ["Gérer les ventes", "Piloter la distribution"],
    prerequisites: [],
    sections: [{ title: "Ventes", lessons: [{ title: "Commande client", minutes: 26 }] }],
    relatedSlugs: ["mm-achats-stocks"],
    publishedAt: "2026-10-05",
    track: "sap",
  },
  {
    slug: "abap-fondamentaux",
    title: "SAP ABAP — Fondamentaux",
    titleEn: "SAP ABAP — Fundamentals",
    summary: "Syntaxe, dictionnaire de données, programmes et rapports ABAP.",
    summaryEn: "Syntax, data dictionary, programs, and ABAP reports.",
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
    trainerSlug: "mr-ivo-babila",
    image: "/courses/abap.svg",
    objectives: ["Comprendre la syntaxe ABAP", "Utiliser le dictionnaire de données", "Créer des rapports"],
    prerequisites: [],
    sections: [{ title: "Fondamentaux", lessons: [{ title: "Premier programme", minutes: 35 }] }],
    relatedSlugs: ["fi-comptabilite-generale"],
    publishedAt: "2026-08-20",
    track: "sap",
  },
  {
    slug: "odoo-comptabilite",
    title: "Odoo — Comptabilité",
    titleEn: "Odoo — Accounting",
    summary: "Plan comptable, facturation, paiements, rapprochement bancaire et rapports financiers dans Odoo.",
    summaryEn: "Chart of accounts, invoicing, payments, bank reconciliation, and financial reports in Odoo.",
    family: "odoo-fonctionnel",
    module: "Comptabilité",
    level: "fondamentaux",
    durationHours: 6,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: null,
    free: false,
    featured: true,
    trainerSlug: "mr-legima",
    image: "/images/odoo-logo.svg",
    objectives: ["Configurer la comptabilité Odoo", "Gérer la facturation et les paiements", "Produire des rapports financiers"],
    prerequisites: [],
    sections: [
      { title: "Introduction", lessons: [{ title: "Configuration comptable", minutes: 25 }] },
      { title: "Opérations", lessons: [{ title: "Facturation et paiements", minutes: 30 }] },
    ],
    relatedSlugs: ["odoo-ventes-achats"],
    publishedAt: "2026-09-01",
    track: "odoo",
  },
  {
    slug: "odoo-ventes-achats",
    title: "Odoo — Ventes & Achats",
    titleEn: "Odoo — Sales & Purchase",
    summary: "Gestion des devis, commandes clients et fournisseurs, stocks et flux commerciaux dans Odoo.",
    summaryEn: "Manage quotations, sales and purchase orders, inventory, and commercial flows in Odoo.",
    family: "odoo-fonctionnel",
    module: "Ventes",
    level: "fondamentaux",
    durationHours: 6,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: null,
    free: false,
    featured: true,
    trainerSlug: "mr-chami",
    image: "/images/odoo-logo.svg",
    objectives: ["Créer des devis et commandes", "Gérer les achats et les stocks", "Suivre le cycle commercial"],
    prerequisites: [],
    sections: [
      { title: "Ventes", lessons: [{ title: "Devis et commandes clients", minutes: 25 }] },
      { title: "Achats", lessons: [{ title: "Commandes fournisseurs et réception", minutes: 25 }] },
    ],
    relatedSlugs: ["odoo-comptabilite"],
    publishedAt: "2026-09-10",
    track: "odoo",
  },
  {
    slug: "odoo-technique",
    title: "Odoo — Technique & Personnalisation",
    titleEn: "Odoo — Technical & Customization",
    summary: "Bases techniques Odoo, personnalisation des modules, vues et workflows métier.",
    summaryEn: "Odoo technical basics, module customization, views, and business workflows.",
    family: "odoo-technique",
    module: "Technique",
    level: "consultant",
    durationHours: 8,
    languages: ["fr", "en"],
    labIncluded: true,
    certificationPrep: false,
    price: null,
    free: false,
    featured: true,
    trainerSlug: "mr-ivo-babila",
    image: "/images/odoo-logo.svg",
    objectives: ["Comprendre l'architecture Odoo", "Personnaliser modules et vues", "Adapter les workflows métier"],
    prerequisites: [],
    sections: [
      { title: "Architecture", lessons: [{ title: "Structure d'un module Odoo", minutes: 30 }] },
      { title: "Personnalisation", lessons: [{ title: "Vues et champs personnalisés", minutes: 30 }] },
    ],
    relatedSlugs: ["odoo-comptabilite"],
    publishedAt: "2026-09-15",
    track: "odoo",
  },
];

export const getCourseBySlug = (slug: string): Course | undefined =>
  COURSES.find((course) => course.slug === slug);

export const getCoursesByFamily = (family: string): Course[] =>
  COURSES.filter((course) => course.family === family);

export const getCoursesByTrack = (track: "sap" | "odoo"): Course[] =>
  COURSES.filter((course) => course.track === track);
