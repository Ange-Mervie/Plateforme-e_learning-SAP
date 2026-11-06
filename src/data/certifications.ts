export interface CertificationTrack {
  slug: string;
  title: string;
  family: string;
  officialName: string;
  prepParcoursSlug: string;
  mockExams: number | null;
}

export const CERTIFICATIONS: CertificationTrack[] = [
  {
    slug: "cert-s4hana-finance",
    title: "Certification S/4HANA Finance",
    family: "finance",
    officialName: "SAP Certified Specialist – Financial Accounting",
    prepParcoursSlug: "sap-functional-consultant",
    mockExams: 1,
  },
  {
    slug: "cert-s4hana-logistique",
    title: "Certification S/4HANA Logistique",
    family: "logistique",
    officialName: "SAP Certified Specialist – Supply Chain",
    prepParcoursSlug: "sap-logistique",
    mockExams: 1,
  },
  {
    slug: "cert-abap",
    title: "Certification ABAP",
    family: "technique",
    officialName: "SAP Certified Development Associate – ABAP",
    prepParcoursSlug: "sap-abap-fiori",
    mockExams: 1,
  },
];
