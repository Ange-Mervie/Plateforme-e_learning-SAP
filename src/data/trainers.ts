export interface Trainer {
  slug: string;
  name: string;
  title: string;
  photo: string;
  specialties: string[];
  yearsExperience: number | null;
  certifications: string[];
  languages: ("fr" | "en")[];
  bio: string;
  bioEn: string;
  courseSlugs: string[];
  consent: boolean;
  tracks: ("sap" | "odoo")[];
}

export const TRAINERS: Trainer[] = [
  {
    slug: "mr-legima",
    name: "Mr. Legima",
    title: "Formateur SAP & Odoo",
    photo: "/images/2.jpg",
    specialties: ["SAP FI/CO", "Odoo Comptabilité", "ERP"],
    yearsExperience: null,
    certifications: [],
    languages: ["fr", "en"],
    bio: "Formateur spécialisé en solutions ERP, il accompagne les apprenants sur les modules financiers SAP et les applications de comptabilité Odoo avec une approche pratique orientée métier.",
    bioEn: "ERP trainer specializing in SAP financial modules and Odoo accounting applications, supporting learners with a practical, business-oriented approach.",
    courseSlugs: ["fi-comptabilite-generale", "odoo-comptabilite"],
    consent: true,
    tracks: ["sap", "odoo"],
  },
  {
    slug: "mr-chami",
    name: "Mr. Chami",
    title: "Formateur SAP & Odoo",
    photo: "/images/3.jpg",
    specialties: ["SAP MM/SD", "Odoo Ventes & Achats", "Logistique"],
    yearsExperience: null,
    certifications: [],
    languages: ["fr", "en"],
    bio: "Formateur expert en processus logistiques et commerciaux, il intervient sur SAP MM/SD ainsi que sur les applications Odoo Ventes, Achats et Inventaire.",
    bioEn: "Trainer expert in logistics and commercial processes, delivering courses on SAP MM/SD as well as Odoo Sales, Purchase, and Inventory apps.",
    courseSlugs: ["mm-achats-stocks", "sd-ventes-distribution", "odoo-ventes-achats"],
    consent: true,
    tracks: ["sap", "odoo"],
  },
  {
    slug: "mr-ivo-babila",
    name: "Mr. Ivo Babila",
    title: "Formateur SAP & Odoo",
    photo: "/images/4.jpg",
    specialties: ["SAP ABAP", "Odoo Technique", "Intégration ERP"],
    yearsExperience: null,
    certifications: [],
    languages: ["fr", "en"],
    bio: "Formateur technique SAP et Odoo, il accompagne les apprenants sur le développement, la personnalisation et l'intégration des solutions ERP.",
    bioEn: "Technical SAP and Odoo trainer, supporting learners in development, customization, and integration of ERP solutions.",
    courseSlugs: ["abap-fondamentaux", "odoo-technique"],
    consent: true,
    tracks: ["sap", "odoo"],
  },
];

export const getTrainerBySlug = (slug: string): Trainer | undefined =>
  TRAINERS.find((t) => t.slug === slug);
