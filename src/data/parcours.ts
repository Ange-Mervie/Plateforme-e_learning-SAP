export interface ParcoursStep {
  courseSlug: string;
  order: number;
}

export interface Parcours {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  family: string;
  audience: string[];
  startLevel: string;
  steps: ParcoursStep[];
  totalHours: number;
  certificationTarget?: string;
  price: number | null;
  featured: boolean;
  track: "sap" | "odoo";
}

export const PARCOURS: Parcours[] = [
  {
    slug: "sap-functional-consultant",
    title: "Consultant SAP Finance",
    titleEn: "SAP Finance Consultant",
    summary: "De la comptabilité générale au contrôle de gestion, jusqu'à S/4HANA Finance.",
    summaryEn: "From general ledger to controlling, up to S/4HANA Finance.",
    family: "finance",
    audience: ["Comptables", "Contrôleurs de gestion"],
    startLevel: "fondamentaux",
    steps: [{ courseSlug: "fi-comptabilite-generale", order: 1 }],
    totalHours: 6,
    certificationTarget: "S/4HANA Finance",
    price: 1600000,
    featured: true,
    track: "sap",
  },
  {
    slug: "sap-logistique",
    title: "Consultant SAP Logistique",
    titleEn: "SAP Logistics Consultant",
    summary: "Achats, stocks, ventes et distribution : la chaîne logistique complète.",
    summaryEn: "Purchasing, inventory, sales, and distribution: the complete logistics chain.",
    family: "logistique",
    audience: ["Acheteurs", "Logisticiens"],
    startLevel: "fondamentaux",
    steps: [
      { courseSlug: "mm-achats-stocks", order: 1 },
      { courseSlug: "sd-ventes-distribution", order: 2 },
    ],
    totalHours: 10,
    certificationTarget: "Logistique",
    price: 1600000,
    featured: true,
    track: "sap",
  },
  {
    slug: "sap-abap-dev",
    title: "Développeur SAP ABAP",
    titleEn: "SAP ABAP Developer",
    summary: "Apprenez les fondamentaux du développement ABAP pour SAP.",
    summaryEn: "Learn the fundamentals of ABAP development for SAP.",
    family: "technique",
    audience: ["Développeurs", "Étudiants"],
    startLevel: "decouverte",
    steps: [{ courseSlug: "abap-fondamentaux", order: 1 }],
    totalHours: 8,
    certificationTarget: "ABAP",
    price: 1600000,
    featured: true,
    track: "sap",
  },
  {
    slug: "odoo-fonctionnel",
    title: "Parcours Odoo Fonctionnel",
    titleEn: "Odoo Functional Path",
    summary: "Maîtrisez les applications Odoo Comptabilité, Ventes et Achats pour piloter votre activité.",
    summaryEn: "Master Odoo Accounting, Sales, and Purchase apps to run your business.",
    family: "odoo-fonctionnel",
    audience: ["Comptables", "Responsables commerciaux", "Gestionnaires"],
    startLevel: "fondamentaux",
    steps: [
      { courseSlug: "odoo-comptabilite", order: 1 },
      { courseSlug: "odoo-ventes-achats", order: 2 },
    ],
    totalHours: 12,
    certificationTarget: "Odoo Functional",
    price: null,
    featured: true,
    track: "odoo",
  },
  {
    slug: "odoo-technique",
    title: "Parcours Odoo Technique",
    titleEn: "Odoo Technical Path",
    summary: "Apprenez à personnaliser et adapter Odoo aux besoins métier de votre organisation.",
    summaryEn: "Learn to customize and adapt Odoo to your organization's business needs.",
    family: "odoo-technique",
    audience: ["Développeurs", "Consultants techniques"],
    startLevel: "consultant",
    steps: [{ courseSlug: "odoo-technique", order: 1 }],
    totalHours: 8,
    certificationTarget: "Odoo Technical",
    price: null,
    featured: true,
    track: "odoo",
  },
];

export const getParcoursByTrack = (track: "sap" | "odoo"): Parcours[] =>
  PARCOURS.filter((p) => p.track === track);
