"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const fr = {
  nav: {
    home: "Accueil",
    catalogue: "Catalogues",
    parcours: "Parcours",
    formateurs: "Formateurs",
    certifications: "Certifications",
    login: "Connexion",
    register: "S'inscrire",
    messagerie: "Messagerie",
    mesFormations: "Mes formations",
  },
  hero: {
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
    discoverCourses: "Découvrir les formations",
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
    catalogue: "Catalogue",
  },
  stats: {
    title: "Chiffres clés",
    courses: "Cours SAP disponibles",
    trainers: "Formateurs experts",
    learners: "Apprenants actifs",
    satisfaction: "Taux de satisfaction",
  },
  paths: {
    title: "Parcours phares",
    eyebrow: "Offre commerciale",
    all: "Tous les parcours →",
    discover: "Découvrir le parcours →",
  },
  testimonials: {
    title: "Ils ont transformé leur carrière SAP",
    eyebrow: "Témoignages",
  },
  certifications: {
    title: "Validez vos compétences SAP",
    subtitle: "Examens blancs originaux, plans de révision et attestations.",
    cta: "Découvrir les certifications →",
    exams: "exam(s)",
  },
  footer: {
    tagline: "Plateforme e-learning spécialisée SAP : formations pratiques, cas métier et certifications.",
    platform: "Plateforme",
    resources: "Ressources",
    enterprise: "Entreprise & Université",
  },
  catalogue: {
    title: "Catalogue des formations SAP",
    subtitle: "Toutes les formations du catalogue : fonctionnel, technique, data et analytics, solutions spécialisées.",
    filters: "Filtres",
    reset: "Réinitialiser",
    family: "Famille",
    level: "Niveau",
    duration: "Durée",
    labIncluded: "Lab inclus",
    certificationPrep: "Prépare certification",
    free: "Gratuit",
    results: "formation(s) disponible(s)",
    sort: "Tri",
    searchPlaceholder: "Rechercher : FI, MM, SD, ABAP, BTP…",
    emptyTitle: "Aucune formation ne correspond à votre recherche.",
    emptyText: "Essayez d’autres filtres ou contactez-nous pour une formation sur mesure.",
    resetFilters: "Réinitialiser les filtres",
  },
  parcours: {
    title: "Parcours de formation",
    subtitle: "Parcours complets et recommandés : Consultant SAP Finance, Développeur ABAP et Fiori, Architecte BTP, etc.",
    steps: "Étapes",
    totalHours: "Durée totale",
    certificationTarget: "Certification cible",
    price: "Prix",
    startLevel: "Niveau de départ",
    audience: "Public",
  },
  formateurs: {
    title: "Des experts qui pratiquent SAP chaque jour.",
    subtitle: "Nos formateurs sont des consultants et des enseignants expérimentés. Ils transmettent des cas réels issus de projets.",
    experience: "Expérience",
    years: "ans",
    coursesTaught: "Cours animés",
    expertTitle: "Vous êtes expert SAP ?",
    expertText: "Rejoignez notre équipe de formateurs. Proposez un cours, partagez un cas réel et formez la prochaine génération.",
    proposeCourse: "Proposer un cours",
  },
  paiement: {
    title: "Paiement",
    secure: "Paiement sécurisé",
    total: "Total",
    card: "Carte bancaire",
    cash: "Virement / Espèces",
    simulate: "Simuler le paiement",
    receipt: {
      title: "Reçu",
      receiptNo: "Numéro de reçu",
      date: "Date d'émission",
      learner: "Apprenant",
      learnerEmail: "Email",
      training: "Formation / Service",
      amount: "Montant",
      method: "Moyen de paiement",
      transaction: "Référence transaction",
      status: "Statut",
      statusPending: "En attente",
      statusPaid: "Payé",
      print: "Imprimer",
      notAvailable: "—",
    },
  },
  connexion: {
    title: "Connexion",
    subtitle: "Connectez-vous à votre espace SAP Academy.",
    email: "Email",
    password: "Mot de passe",
    submit: "Se connecter",
    required: "Veuillez saisir votre email et votre mot de passe.",
    noAccount: "Pas encore de compte ?",
    forgotPassword: "Mot de passe oublié ?",
    error: "Une erreur est survenue.",
  },
  motDeOublie: {
    title: "Mot de passe oublié",
    subtitle: "Saisissez votre adresse email pour recevoir un lien de réinitialisation.",
    submit: "Envoyer le lien",
    sent: "Si le compte existe, un lien de réinitialisation a été envoyé.",
  },
  inscription: {
    title: "Inscription",
    subtitle: "Créez votre compte SAP Academy.",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    submit: "Créer mon compte",
    required: "Veuillez remplir tous les champs.",
    passwordShort: "Le mot de passe doit contenir au moins 6 caractères.",
    hasAccount: "Déjà un compte ?",
  },
  messagerie: {
    subtitle: "Espace de messagerie interne à l’académie.",
  },
  mesFormations: {
    subtitle: "Suivi des formations suivies par l’apprenant.",
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
    messagerie: "Messages",
    mesFormations: "My courses",
  },
  hero: {
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
    discoverCourses: "Discover courses",
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
    catalogue: "Catalog",
  },
  stats: {
    title: "Key figures",
    courses: "SAP courses available",
    trainers: "Expert trainers",
    learners: "Active learners",
    satisfaction: "Satisfaction rate",
  },
  paths: {
    title: "Flagship learning paths",
    eyebrow: "Commercial offer",
    all: "All learning paths →",
    discover: "Discover the path →",
  },
  testimonials: {
    title: "They transformed their SAP career",
    eyebrow: "Testimonials",
  },
  certifications: {
    title: "Validate your SAP skills",
    subtitle: "Original mock exams, revision plans and success certificates.",
    cta: "Discover certifications →",
    exams: "exam(s)",
  },
  footer: {
    tagline: "SAP learning platform specialized in SAP: practical training, business cases and certifications.",
    platform: "Platform",
    resources: "Resources",
    enterprise: "Enterprise & University",
  },
  catalogue: {
    title: "SAP course catalog",
    subtitle: "All catalog courses: functional, technical, data and analytics, specialized solutions.",
    filters: "Filters",
    reset: "Reset",
    family: "Family",
    level: "Level",
    duration: "Duration",
    labIncluded: "Lab included",
    certificationPrep: "Prepares certification",
    free: "Free",
    results: "course(s) available",
    sort: "Sort",
    searchPlaceholder: "Search: FI, MM, SD, ABAP, BTP…",
    emptyTitle: "No course matches your search.",
    emptyText: "Try other filters or contact us for a custom course.",
    resetFilters: "Reset filters",
  },
  parcours: {
    title: "Learning paths",
    subtitle: "Complete recommended paths: SAP Finance Consultant, ABAP and Fiori Developer, BTP Architect, etc.",
    steps: "Steps",
    totalHours: "Total duration",
    certificationTarget: "Target certification",
    price: "Price",
    startLevel: "Starting level",
    audience: "Audience",
  },
  formateurs: {
    title: "Experts who practice SAP every day.",
    subtitle: "Our trainers are experienced consultants and teachers. They share real project cases.",
    experience: "Experience",
    years: "yrs",
    coursesTaught: "Courses taught",
    expertTitle: "Are you an SAP expert?",
    expertText: "Join our trainer team. Propose a course, share a real case and train the next generation.",
    proposeCourse: "Propose a course",
  },
  paiement: {
    title: "Payment",
    secure: "Secure payment",
    total: "Total",
    card: "Credit card",
    cash: "Bank transfer / Cash",
    simulate: "Simulate payment",
    receipt: {
      title: "Receipt",
      receiptNo: "Receipt number",
      date: "Issue date",
      learner: "Learner",
      learnerEmail: "Email",
      training: "Course / Service",
      amount: "Amount",
      method: "Payment method",
      transaction: "Transaction reference",
      status: "Status",
      statusPending: "Pending",
      statusPaid: "Paid",
      print: "Print",
      notAvailable: "—",
    },
  },
  connexion: {
    title: "Log in",
    subtitle: "Log in to your SAP Academy space.",
    email: "Email",
    password: "Password",
    submit: "Log in",
    required: "Please enter your email and password.",
    noAccount: "No account yet?",
    forgotPassword: "Forgot password?",
    error: "An error occurred.",
  },
  motDeOublie: {
    title: "Forgot password",
    subtitle: "Enter your email address to receive a reset link.",
    submit: "Send reset link",
    sent: "If the account exists, a reset link has been sent.",
  },
  inscription: {
    title: "Sign up",
    subtitle: "Create your SAP Academy account.",
    name: "Name",
    email: "Email",
    password: "Password",
    submit: "Create my account",
    required: "Please fill in all fields.",
    passwordShort: "Password must be at least 6 characters.",
    hasAccount: "Already have an account?",
  },
  messagerie: {
    subtitle: "Internal messaging space of the academy.",
  },
  mesFormations: {
    subtitle: "Tracking of the courses followed by the learner.",
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
