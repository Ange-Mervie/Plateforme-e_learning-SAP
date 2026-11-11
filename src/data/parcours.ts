export interface ParcoursStep {
  courseSlug: string;
  order: number;
}

export interface Parcours {
  slug: string;
  title: string;
  summary: string;
  family: string;
  audience: string[];
  startLevel: string;
  steps: ParcoursStep[];
  totalHours: number;
  certificationTarget?: string;
  price: number | null;
  featured: boolean;
}

export const PARCOURS: Parcours[] = [
  {
    slug: "sap-functional-consultant",
    title: "Consultant SAP Finance",
    summary: "De la comptabilité générale au contrôle de gestion, jusqu’à S/4HANA Finance.",
    family: "finance",
    audience: ["Comptables", "Contrôleurs de gestion"],
    startLevel: "fondamentaux",
    steps: [
      { courseSlug: "fi-comptabilite-generale", order: 1 },
      { courseSlug: "co-controle-de-gestion", order: 2 },
    ],
    totalHours: 11,
    certificationTarget: "S/4HANA Finance",
    price: 1600000,
    featured: true,
  },
  {
    slug: "sap-logistique",
    title: "Consultant SAP Logistique",
    summary: "Achats, stocks, ventes et entrepôt : la chaîne logistique complète.",
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
  },
  {
    slug: "sap-abap-fiori",
    title: "Développeur ABAP et Fiori",
    summary: "Du langage ABAP aux applications modernes avec RAP et Fiori.",
    family: "technique",
    audience: ["Développeurs", "Étudiants"],
    startLevel: "decouverte",
    steps: [
      { courseSlug: "abap-fondamentaux", order: 1 },
      { courseSlug: "abap-moderne-oo", order: 2 },
    ],
    totalHours: 15,
    certificationTarget: "ABAP / Fiori",
    price: 1600000,
    featured: true,
  },
];
