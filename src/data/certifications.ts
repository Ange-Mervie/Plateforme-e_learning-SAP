export interface CertificationTrack {
  slug: string;
  title: string;
  family: string;
  officialName: string;
  code: string;
  prepParcoursSlug: string;
  mockExams: number | null;
  imageId: string;
  priceEur: number;
  priceLabel: string;
  durationHours: number;
  passScore: number;
  examType: string;
  languages: string[];
}

export const CERTIFICATIONS: CertificationTrack[] = [
  {
    slug: "cert-s4hana-finance",
    title: "Certification S/4HANA Finance",
    family: "finance",
    officialName: "SAP Certified Associate – SAP S/4HANA Cloud Private Edition, Financial Accounting",
    code: "C_TS4FI",
    prepParcoursSlug: "sap-functional-consultant",
    mockExams: 1,
    imageId: "domaine-fi",
    priceEur: 510,
    priceLabel: "Coupon examen + 2 tentatives (SAP Store)",
    durationHours: 3,
    passScore: 62,
    examType: "System Based",
    languages: ["Français", "Anglais"],
  },
  {
    slug: "cert-s4hana-logistique",
    title: "Certification S/4HANA Logistique",
    family: "logistique",
    officialName: "SAP Certified Associate – SAP S/4HANA Cloud Public Edition, Implementation Consultant",
    code: "C_S4CFI",
    prepParcoursSlug: "sap-logistique",
    mockExams: 1,
    imageId: "domaine-mm",
    priceEur: 510,
    priceLabel: "Coupon examen + 2 tentatives (SAP Store)",
    durationHours: 3,
    passScore: 62,
    examType: "System Based",
    languages: ["Français", "Anglais"],
  },
  {
    slug: "cert-abap",
    title: "Certification ABAP",
    family: "technique",
    officialName: "SAP Certified Development Associate – ABAP",
    code: "C_ABAPD_2309",
    prepParcoursSlug: "sap-abap-fiori",
    mockExams: 1,
    imageId: "role-abap",
    priceEur: 510,
    priceLabel: "Coupon examen + 2 tentatives (SAP Store)",
    durationHours: 3,
    passScore: 57,
    examType: "Multiple Choice",
    languages: ["Français", "Anglais"],
  },
  {
    slug: "cert-sac-analytics",
    title: "Certification SAP Analytics Cloud",
    family: "donnees",
    officialName: "SAP Certified Data Analyst – SAP Analytics Cloud",
    code: "C_SAC_2415",
    prepParcoursSlug: "sap-data-analytics",
    mockExams: 1,
    imageId: "domaine-bi",
    priceEur: 510,
    priceLabel: "Coupon examen + 2 tentatives (SAP Store)",
    durationHours: 2,
    passScore: 60,
    examType: "Scenario Based",
    languages: ["Français", "Anglais"],
  },
];

export const CERTIFICATION_OPTIONS = [
  { label: "1 tentative", priceEur: 200, priceXaf: 131191, description: "Coupon d'examen à l'unité" },
  { label: "2 tentatives + 10h système pratique", priceEur: 240, priceXaf: 157430, description: "Meilleur rapport qualité-prix" },
  { label: "6 tentatives sur 12 mois", priceEur: 500, priceXaf: 327979, description: "Plusieurs certifications dans l'année" },
  { label: "SAP Learning Hub Customer Edition", priceEur: 1260, priceXaf: 826506, description: "Abonnement annuel avec 4 tentatives incluses" },
];
