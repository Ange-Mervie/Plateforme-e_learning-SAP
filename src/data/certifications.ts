export interface CertificationTrack {
  slug: string;
  title: string;
  titleEn: string;
  family: string;
  officialName: string;
  code: string;
  prepParcoursSlug: string;
  mockExams: number | null;
  imageId: string;
  priceEur: number | null;
  priceLabel: string;
  durationHours: number | null;
  passScore: number | null;
  examType: string;
  languages: string[];
  track: "sap" | "odoo";
}

export const CERTIFICATIONS: CertificationTrack[] = [
  {
    slug: "cert-s4hana-finance",
    title: "Certification S/4HANA Finance",
    titleEn: "S/4HANA Finance Certification",
    family: "finance",
    officialName: "SAP Certified Associate – SAP S/4HANA Cloud Private Edition, Financial Accounting",
    code: "C_TS4FI",
    prepParcoursSlug: "sap-functional-consultant",
    mockExams: 1,
    imageId: "domaine-fi",
    priceEur: 510,
    priceLabel: "Coupon examen SAP",
    durationHours: 3,
    passScore: 62,
    examType: "System Based",
    languages: ["Français", "Anglais"],
    track: "sap",
  },
  {
    slug: "cert-s4hana-logistique",
    title: "Certification S/4HANA Logistique",
    titleEn: "S/4HANA Logistics Certification",
    family: "logistique",
    officialName: "SAP Certified Associate – SAP S/4HANA Cloud Public Edition, Implementation Consultant",
    code: "C_S4CFI",
    prepParcoursSlug: "sap-logistique",
    mockExams: 1,
    imageId: "domaine-mm",
    priceEur: 510,
    priceLabel: "Coupon examen SAP",
    durationHours: 3,
    passScore: 62,
    examType: "System Based",
    languages: ["Français", "Anglais"],
    track: "sap",
  },
  {
    slug: "cert-abap",
    title: "Certification ABAP",
    titleEn: "ABAP Certification",
    family: "technique",
    officialName: "SAP Certified Development Associate – ABAP",
    code: "C_ABAPD_2309",
    prepParcoursSlug: "sap-abap-dev",
    mockExams: 1,
    imageId: "role-abap",
    priceEur: 510,
    priceLabel: "Coupon examen SAP",
    durationHours: 3,
    passScore: 57,
    examType: "Multiple Choice",
    languages: ["Français", "Anglais"],
    track: "sap",
  },
  {
    slug: "cert-odoo-fonctionnel",
    title: "Certification Odoo Fonctionnel",
    titleEn: "Odoo Functional Certification",
    family: "odoo-fonctionnel",
    officialName: "Certification fonctionnelle Odoo (Comptabilité, Ventes, Achats)",
    code: "ODOO-FUNC",
    prepParcoursSlug: "odoo-fonctionnel",
    mockExams: null,
    imageId: "odoo-logo",
    priceEur: null,
    priceLabel: "Informations sur demande",
    durationHours: null,
    passScore: null,
    examType: "Sur demande",
    languages: ["Français", "Anglais"],
    track: "odoo",
  },
  {
    slug: "cert-odoo-technique",
    title: "Certification Odoo Technique",
    titleEn: "Odoo Technical Certification",
    family: "odoo-technique",
    officialName: "Certification technique Odoo (Personnalisation et développement)",
    code: "ODOO-TECH",
    prepParcoursSlug: "odoo-technique",
    mockExams: null,
    imageId: "odoo-logo",
    priceEur: null,
    priceLabel: "Informations sur demande",
    durationHours: null,
    passScore: null,
    examType: "Sur demande",
    languages: ["Français", "Anglais"],
    track: "odoo",
  },
];

export const CERTIFICATION_OPTIONS = [
  { label: "1 tentative", priceEur: 200, priceXaf: 131191, description: "Coupon d'examen à l'unité" },
  { label: "2 tentatives + 10h système pratique", priceEur: 240, priceXaf: 157430, description: "Meilleur rapport qualité-prix" },
  { label: "6 tentatives sur 12 mois", priceEur: 500, priceXaf: 327979, description: "Plusieurs certifications dans l'année" },
  { label: "SAP Learning Hub Customer Edition", priceEur: 1260, priceXaf: 826506, description: "Abonnement annuel avec 4 tentatives incluses" },
];