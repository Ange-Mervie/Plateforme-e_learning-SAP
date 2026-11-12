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
  courseSlugs: string[];
  consent: boolean;
}

export const TRAINERS: Trainer[] = [
  {
    slug: "consultant-financier",
    name: "Dr. Claire Moreau",
    title: "Consultante SAP FI/CO",
    photo: "/trainers/claire-moreau.jpg",
    specialties: ["FI", "CO", "S/4HANA Finance"],
    yearsExperience: 12,
    certifications: ["SAP Certified Application Associate"],
    languages: ["fr", "en"],
    bio: "Consultante financière spécialisée en comptabilité générale et contrôle de gestion, avec 12 ans d’expérience sur des projets S/4HANA.",
    courseSlugs: ["fi-comptabilite-generale"],
    consent: true,
  },
  {
    slug: "logisticien",
    name: "Karim Benali",
    title: "Consultant SAP MM/SD",
    photo: "/trainers/karim-benali.jpg",
    specialties: ["MM", "SD", "WM/EWM"],
    yearsExperience: 9,
    certifications: ["SAP Certified Specialist"],
    languages: ["fr", "en"],
    bio: "Expert en logistique et distribution, il accompagne les clients dans la chaîne d’approvisionnement SAP.",
    courseSlugs: ["mm-achats-stocks", "sd-ventes-distribution"],
    consent: true,
  },
  {
    slug: "architecte-btp",
    name: "Sophie Laurent",
    title: "Architecte SAP BTP",
    photo: "/architecte-btp.jpg",
    specialties: ["BTP", "RAP", "Fiori"],
    yearsExperience: 8,
    certifications: ["SAP Certified Development Associate"],
    languages: ["fr", "en"],
    bio: "Architecte SAP BTP et développeur Fiori, elle conçoit des solutions métier sur la plateforme.",
    courseSlugs: ["abap-fondamentaux", "abap-moderne-oo"],
    consent: true,
  },
];
