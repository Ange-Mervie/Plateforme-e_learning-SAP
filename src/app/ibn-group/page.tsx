import Link from "next/link";
import {
  Building2,
  Layers,
  Terminal,
  Globe,
  Award,
  Handshake,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

function iconBgFor(color: string): string {
  switch (color) {
    case "text-navy":
    case "text-primary":
      return "bg-blue-100";
    case "text-emerald-600":
      return "bg-emerald-100";
    case "text-amber-600":
      return "bg-amber-100";
    case "text-rose-600":
      return "bg-rose-100";
    case "text-violet-600":
      return "bg-violet-100";
    default:
      return "bg-slate-100";
  }
}

const IBN_SECTIONS = [
  {
    id: "entreprise",
    title: "L'entreprise",
    icon: Building2,
    color: "text-navy",
    description: "IBN Group est une entreprise spécialisée dans les services et solutions SAP, accompagnant les organisations dans leur transformation digitale.",
    details: [
      { label: "Spécialité", value: "Services et solutions SAP" },
      { label: "Présentation", value: "Contenu officiel à vérifier auprès d'IBN Group." },
    ],
  },
  {
    id: "activites",
    title: "Activités",
    icon: Layers,
    color: "text-primary",
    description: "IBN Group intervient sur l'ensemble de la chaîne de valeur SAP : conseil, implémentation, formation et support.",
    details: [
      { label: "Secteurs d'intervention", value: "Contenu officiel à vérifier auprès d'IBN Group." },
    ],
  },
  {
    id: "services",
    title: "Services technologiques",
    icon: Terminal,
    color: "text-emerald-600",
    description: "Conseil SAP, implémentation, intégration, support et maintenance des environnements SAP.",
    details: [
      { label: "Conseil SAP", value: "Accompagnement sur les modules SAP" },
      { label: "Implémentation", value: "Déploiement des solutions SAP" },
      { label: "Support & maintenance", value: "Assistance aux environnements SAP" },
    ],
  },
  {
    id: "expertises",
    title: "Expertises",
    icon: Globe,
    color: "text-amber-600",
    description: "Expertise sur les modules SAP S/4HANA, Fiori, BTP, ABAP, FI, MM, SD et les domaines fonctionnel, technique et data.",
    details: [
      { label: "Modules", value: "FI, MM, SD, ABAP, BTP, S/4HANA" },
      { label: "Certifications", value: "Préparation aux certifications SAP officielles" },
    ],
  },
  {
    id: "realisations",
    title: "Réalisations",
    icon: Award,
    color: "text-rose-600",
    description: "Projets SAP menés pour des entreprises et institutions. Références clients à vérifier officiellement.",
    details: [
      { label: "Projets", value: "À vérifier avec les références clients officielles" },
      { label: "Clients", value: "À vérifier avec les références clients officielles" },
    ],
  },
  {
    id: "accompagnement",
    title: "Offres d'accompagnement",
    icon: Handshake,
    color: "text-violet-600",
    description: "Accompagnement sur mesure pour les entreprises et universités dans leurs projets SAP.",
    details: [
      { label: "Modalités", value: "Contenu officiel à vérifier auprès d'IBN Group." },
    ],
  },
];

const CONTACT = {
  address: "Adresse à vérifier auprès d'IBN Group",
  phone: "Téléphone à vérifier auprès d'IBN Group",
  email: "contact@ibn-group.com (à vérifier)",
  website: "Site web à vérifier auprès d'IBN Group",
};

export default function IBNGroup() {
  return (
    <main className="bg-white">
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-sm mb-6">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            IBN Group
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Partenaire de confiance pour vos projets SAP
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
            Services, solutions et formations SAP pour accompagner votre transformation digitale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {IBN_SECTIONS.map((section) => {
            const Icon = section.icon;
            const iconBg = iconBgFor(section.color);
            return (
              <article key={section.id} className="rounded-2xl border border-slate-200 bg-white p-8 hover:border-primary hover:shadow-md transition-all">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} text-${section.color} mb-6`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{section.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{section.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {section.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-500">{detail.label} :</span>
                      <span className="text-slate-700">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-surface py-20 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">Offres d'accompagnement</h2>
            <p className="mt-4 text-slate-600">
              IBN Group propose des offres d'accompagnement adaptées aux besoins des entreprises et des universités.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Conseil SAP", desc: "Accompagnement stratégique et fonctionnel sur les modules SAP." },
              { title: "Formation certifiante", desc: "Préparation aux certifications SAP officielles avec labs pratiques." },
              { title: "Implémentation", desc: "Déploiement et intégration des solutions SAP en entreprise." },
            ].map((offer, i) => (
              <article key={i} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-navy">{offer.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{offer.desc}</p>
                <Link
                  href="/ibn-group#accompagnement"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark"
                >
                  En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-navy p-10 lg:p-16 text-white">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contactez IBN Group</h2>
                <p className="text-blue-100 mb-8">
                  Pour toute demande d'information sur les services, les formations ou les partenariats avec IBN Group.
                </p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-slate-300">{CONTACT.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-slate-300">{CONTACT.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-slate-300">{CONTACT.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Site web</p>
                      <p className="text-slate-300">{CONTACT.website}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 md:border-t-0 md:border-l md:pl-8">
                <Link
                  href="/catalogue"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white text-navy px-6 text-sm font-bold hover:bg-blue-50 transition-colors"
                >
                    Découvrir le catalogue SAP <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              <strong>Note importante :</strong> Les contenus de cette section (chiffres, références clients, coordonnées, activités détaillées)
              doivent être vérifiés et complétés avec les informations officielles d'IBN Group avant publication.
              Aucune donnée n'a été inventée.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
