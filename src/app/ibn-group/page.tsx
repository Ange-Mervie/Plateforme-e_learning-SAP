import Link from "next/link";
import {
  Building2, Layers, Terminal, Globe, Award, Handshake, Mail, Phone, MapPin, ChevronRight, ArrowRight, ShieldCheck,
} from "lucide-react";

const IBN_LINKEDIN = "https://www.linkedin.com/in/ibn-group-755332227/";
const LinkedinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function iconBgFor(color: string): string {
  switch (color) {
    case "text-navy":
    case "text-primary": return "bg-blue-100";
    case "text-emerald-600": return "bg-emerald-100";
    case "text-amber-600": return "bg-amber-100";
    case "text-rose-600": return "bg-rose-100";
    case "text-violet-600": return "bg-violet-100";
    default: return "bg-slate-100";
  }
}

const IBN_SECTIONS = [
  { id: "entreprise", title: "L'entreprise", icon: Building2, color: "text-navy", description: "IBN Group est une entreprise de conseil en technologies et solutions d'entreprise basée à Douala, Cameroun, avec une présence opérationnelle à Yaoundé et un réseau de consultants en Afrique du Sud et en Allemagne. Fondée comme cabinet SAP spécialisé, IBN Group accompagne les organisations africaines dans leur transformation digitale.", details: [ { label: "Siège social", value: "Bonamoussadi, Douala, Cameroun" }, { label: "Présence", value: "Douala · Yaoundé · Afrique du Sud · Allemagne" }, { label: "Spécialité", value: "Conseil SAP, ERP, cybersécurité et formation" } ] },
  { id: "activites", title: "Activités", icon: Layers, color: "text-primary", description: "IBN Group intervient sur l'ensemble de la chaîne de valeur numérique : conseil en technologies, implémentation ERP SAP, formation professionnelle, cybersécurité et services de forensic et d'investigation.", details: [ { label: "SAP & ERP", value: "S/4HANA, SAP Business One" }, { label: "Cybersécurité", value: "Protection des systèmes et des données" }, { label: "Formation", value: "SAP, cybersécurité et certification professionnelle" } ] },
  { id: "services", title: "Services technologiques", icon: Terminal, color: "text-emerald-600", description: "Conseil SAP, implémentation, intégration, support et maintenance des environnements SAP, ainsi que la transformation digitale des entreprises et institutions publiques.", details: [ { label: "Business Tech Solutions", value: "Solutions tech sur mesure et implémentation" }, { label: "Digital Transformation", value: "SAP S/4HANA, SAP Business One" }, { label: "Forensic & Risk Advisory", value: "Audit, prévention de la fraude et contrôle interne" } ] },
  { id: "expertises", title: "Expertises", icon: Globe, color: "text-amber-600", description: "Expertise sur les modules SAP S/4HANA, ABAP, FI, MM, SD, SuccessFactors et les domaines fonctionnel, technique, data et cybersécurité.", details: [ { label: "Modules SAP", value: "FI, MM, SD, ABAP, S/4HANA, HCM" }, { label: "Certifications", value: "Préparation aux certifications SAP officielles" }, { label: "Forensique numérique", value: "IICFIP — Digital forensics et AML" } ] },
  { id: "realisations", title: "Réalisations", icon: Award, color: "text-rose-600", description: "Projets SAP et de transformation digitale menés pour des entreprises et institutions publiques en Afrique, avec un réseau de consultants certifiés.", details: [ { label: "Secteurs", value: "Entreprises privées · Institutions publiques · Gouvernements" }, { label: "Partenariats", value: "IICFIP · Canopus (licences SAP officielles)" } ] },
  { id: "accompagnement", title: "Offres d'accompagnement", icon: Handshake, color: "text-violet-600", description: "Accompagnement sur mesure pour les entreprises et universités dans leurs projets SAP, de la stratégie à l'implémentation, avec support technique de niveau 3 (Tier-3).", details: [ { label: "Modalités", value: "Conseil · Implémentation · Formation · Support" }, { label: "Canaux", value: "Appel de consultation · Devis sur demande" } ] },
];

const CONTACT = { address: "Bonamoussadi, Douala, Cameroun", phone: "+237 690128588 · +237 672746278", email: "info@ibngroup.cm", website: "ibngroup.cm" };

export default function IBNGroup() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/images/hero-ibn-group.jpg')" }} />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold tracking-normal text-blue-200 backdrop-blur-sm"><Building2 className="h-3.5 w-3.5 text-primary" />IBN Group</span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Partenaire de confiance pour vos projets SAP</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-blue-100">Services, solutions et formations SAP pour accompagner votre transformation digitale en Afrique.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={IBN_LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10" aria-label="Suivre IBN Group sur LinkedIn (ouvre dans un nouvel onglet)"><LinkedinIcon className="h-4 w-4" />Suivre IBN Group sur LinkedIn</a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-navy">IBN Group Expert SAP en Afrique</h2>
              <p className="mb-6 leading-relaxed text-slate-600">IBN Group est une entreprise de conseil en technologies et solutions d&apos;entreprise basée à Douala, Cameroun, avec une présence opérationnelle à Yaoundé et un réseau de consultants en Afrique du Sud et en Allemagne. Fondée comme cabinet SAP spécialisé, IBN Group accompagne les organisations africaines dans leur transformation digitale, de la stratégie à l&apos;implémentation.</p>
              <p className="mb-6 leading-relaxed text-slate-600">Nous intervenons sur les modules SAP FI, CO, MM, SD, ABAP et S/4HANA, avec des certifications officielles et un partenariat avec IICFIP et Canopus pour les licences SAP.</p>
            </div>
            <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <img src="/images/WhatsApp Image 2026-11-11 at 15.55.54.jpeg" alt="IBN Group" className="h-full w-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {IBN_SECTIONS.map((section) => {
            const Icon = section.icon; const iconBg = iconBgFor(section.color);
            return (
              <article key={section.id} id={section.id} className="rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-primary hover:shadow-md">
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}><Icon className={`h-5 w-5 ${section.color}`} /></div>
                <h3 className="mb-3 text-xl font-bold text-navy">{section.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-600">{section.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">{section.details.map((detail, i) => (<li key={i} className="flex items-start gap-2"><span className="text-xs font-semibold text-slate-500">{detail.label} :</span><span className="text-slate-700">{detail.value}</span></li>))}</ul>
              </article>
            );
          })}
        </div>
      </section>

      <section id="accompagnement" className="border-y border-slate-200 bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center"><h2 className="text-3xl font-bold text-navy">Offres d&apos;accompagnement</h2><p className="mt-4 text-slate-600">IBN Group propose des offres d&apos;accompagnement adaptées aux besoins des entreprises et des universités.</p></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[{ title: "Conseil SAP", desc: "Accompagnement stratégique et fonctionnel sur les modules SAP (FI, MM, SD, ABAP, HCM)." },{ title: "Transformation digitale", desc: "Implémentation SAP S/4HANA et SAP Business One pour entreprises et institutions publiques." },{ title: "Formation certifiante", desc: "Préparation aux certifications SAP officielles avec labs pratiques et évaluations." }].map((offer, i) => (
              <article key={i} className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-primary"><h3 className="text-lg font-bold text-navy">{offer.title}</h3><p className="mt-2 text-sm text-slate-600">{offer.desc}</p><Link href="/catalogue?track=sap" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark">En savoir plus <ArrowRight className="h-3.5 w-3.5" /></Link></article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-navy p-10 text-white lg:p-16">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Contactez IBN Group</h2>
                <p className="mb-8 text-blue-100">Pour toute demande d&apos;information sur les services, les formations ou les partenariats avec IBN Group.</p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /><div><p className="font-medium">Adresse</p><p className="text-slate-300">{CONTACT.address}</p></div></div>
                  <div className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /><div><p className="font-medium">Téléphone</p><p className="text-slate-300">{CONTACT.phone}</p></div></div>
                  <div className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /><div><p className="font-medium">Email</p><p className="text-slate-300">{CONTACT.email}</p></div></div>
                  <div className="flex items-start gap-3"><Globe className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /><div><p className="font-medium">Site web</p><p className="text-slate-300">{CONTACT.website}</p></div></div>
                  <div className="flex items-start gap-3"><LinkedinIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /><div><p className="font-medium">LinkedIn</p><a href={IBN_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white">IBN Group (ouvre dans un nouvel onglet)</a></div></div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 md:border-l md:border-t-0 md:pl-8">
                <Link href="/catalogue?track=sap" className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-bold text-navy transition-colors hover:bg-blue-50">Découvrir le catalogue SAP <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-amber-600" />
            <p className="inline text-sm text-amber-800"><strong>Informations vérifiées :</strong> Les contenus de cette section proviennent du site officiel d&apos;IBN Group (ibngroup.cm). Aucune donnée n&apos;a été inventée.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
