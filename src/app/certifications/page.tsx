"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { CERTIFICATIONS } from "@/data/certifications";
import { Mail, ShieldAlert, Play, Award } from "lucide-react";

const EXAMENS_SAP_FR = [
  { module: "SAP FI", title: "Comptabilité Générale", questions: 20, temps: 30 },
  { module: "SAP MM", title: "Achats & Stocks", questions: 20, temps: 30 },
  { module: "SAP SD", title: "Ventes & Distribution", questions: 20, temps: 30 },
  { module: "SAP ABAP", title: "Développement", questions: 25, temps: 45 },
];
const EXAMENS_SAP_EN = [
  { module: "SAP FI", title: "General Ledger", questions: 20, temps: 30 },
  { module: "SAP MM", title: "Purchasing & Inventory", questions: 20, temps: 30 },
  { module: "SAP SD", title: "Sales & Distribution", questions: 20, temps: 30 },
  { module: "SAP ABAP", title: "Development", questions: 25, temps: 45 },
];
const EXAMENS_ODOO_FR = [
  { module: "Odoo", title: "Comptabilité", questions: 20, temps: 30 },
  { module: "Odoo", title: "Ventes & Achats", questions: 20, temps: 30 },
  { module: "Odoo", title: "Technique & Personnalisation", questions: 20, temps: 30 },
];
const EXAMENS_ODOO_EN = [
  { module: "Odoo", title: "Accounting", questions: 20, temps: 30 },
  { module: "Odoo", title: "Sales & Purchase", questions: 20, temps: 30 },
  { module: "Odoo", title: "Technical & Customization", questions: 20, temps: 30 },
];

const ETAPES_FR = ["Contactez ELEVATE By IBN via le formulaire", "Échangez avec un formateur", "Définissez votre parcours de formation", "Suivez la formation convenue", "Réalisez les exercices et travaux pratiques", "Passez l'évaluation finale", "Recevez votre attestation ELEVATE By IBN"];
const ETAPES_EN = ["Contact ELEVATE By IBN via the form", "Talk with a trainer", "Define your training path", "Follow the agreed training", "Complete exercises and practical work", "Take the final assessment", "Receive your ELEVATE By IBN certificate"];

export default function CertificationsPage() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const track = (searchParams.get("track") === "odoo" ? "odoo" : "sap") as "sap" | "odoo";
  const isFr = lang === "fr";
  const examens = track === "sap" ? (isFr ? EXAMENS_SAP_FR : EXAMENS_SAP_EN) : (isFr ? EXAMENS_ODOO_FR : EXAMENS_ODOO_EN);
  const etapes = isFr ? ETAPES_FR : ETAPES_EN;
  const certs = CERTIFICATIONS.filter((c) => c.track === track);

  return (
    <div className="min-h-screen bg-white font-sans text-navy">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-certifications.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/80 to-navy/90" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{track === "sap" ? "SAP Training" : "Odoo Training"}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{isFr ? "Certifications & Examens blancs" : "Certifications & Mock Exams"}</h2>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{isFr ? "Testez vos connaissances et préparez votre attestation ELEVATE By IBN." : "Test your knowledge and prepare your ELEVATE By IBN certificate."}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/certifications?track=sap" className={`rounded-lg px-4 py-2 text-sm font-bold ${track==="sap"?"bg-white text-navy":"border border-white/30 text-white hover:bg-white/10"}`}>SAP Training</Link>
            <Link href="/certifications?track=odoo" className={`rounded-lg px-4 py-2 text-sm font-bold ${track==="odoo"?"bg-white text-navy":"border border-white/30 text-white hover:bg-white/10"}`}>Odoo Training</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between"><div><h3 className="text-2xl font-bold text-navy">{isFr ? "Espace A — Examens blancs gratuits" : "Space A — Free Mock Exams"}</h3><p className="mt-2 text-slate-600">{isFr ? "Évaluez votre niveau sans connexion." : "Assess your level without login."}</p></div><Link href="/evaluation" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"><Play className="h-3.5 w-3.5" />{isFr ? "Passer un examen" : "Take an exam"}</Link></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {examens.map((exam, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 flex items-center gap-2">{track==="odoo"?<img src="/images/odoo-logo.svg" alt="Odoo" className="h-6"/>:<img src="/images/sap-logo.svg" alt="SAP" className="h-5"/>}<span className="text-xs font-bold uppercase tracking-wider text-slate-500">{exam.module}</span></div>
                <h4 className="mb-2 text-lg font-bold text-navy">{exam.title}</h4>
                <div className="mb-4 grid grid-cols-3 gap-3"><div className="rounded-lg border border-slate-100 p-2 text-center"><span className="block text-xs font-bold text-primary">{exam.questions}</span><span className="block text-[10px] text-slate-500">{isFr?"questions":"questions"}</span></div><div className="rounded-lg border border-slate-100 p-2 text-center"><span className="block text-xs font-bold text-primary">{exam.temps} min</span><span className="block text-[10px] text-slate-500">{isFr?"chrono":"timer"}</span></div><div className="rounded-lg border border-slate-100 p-2 text-center"><span className="block text-xs font-bold text-emerald-600">{isFr?"Gratuit":"Free"}</span></div></div>
                <Link href={`/evaluation?module=${encodeURIComponent(exam.module)}`} className="text-xs font-bold text-primary hover:underline">{isFr ? "Commencer l'examen" : "Start exam"} →</Link>
              </div>
            ))}
          </div>
          {certs.length > 0 && (
            <div className="mt-10">
              <h4 className="mb-4 text-lg font-bold text-navy">{isFr ? "Certifications du parcours" : "Path certifications"}</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certs.map((c)=>(
                  <div key={c.slug} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /><span className="text-xs font-semibold text-slate-500">{c.code}</span></div>
                    <h5 className="font-bold text-navy">{isFr ? c.title : c.titleEn}</h5>
                    <p className="mt-1 text-xs text-slate-600">{c.officialName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 rounded-lg border border-amber-100 bg-amber-50 p-4"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /><p className="text-sm leading-relaxed text-amber-800">{isFr ? "Ces examens blancs sont des outils d'entraînement. Ils ne constituent pas une certification officielle et ne délivrent pas d'attestation automatiquement." : "These mock exams are practice tools. They are not official certifications and do not automatically issue a certificate."}</p></div></div>
        </section>

        <section>
          <div className="mb-8"><h3 className="text-2xl font-bold text-navy">{isFr ? "Espace B — Attestations ELEVATE By IBN" : "Space B — ELEVATE By IBN Certificates"}</h3><p className="mt-2 text-slate-600">{isFr ? "Comment obtenir votre attestation après validation pédagogique." : "How to obtain your certificate after pedagogical validation."}</p></div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">{etapes.map((etape,i)=>(<div key={i} className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"><span className="text-xs font-bold">{i+1}</span></div><p className="text-sm leading-relaxed text-slate-700">{etape}</p></div>))}</div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h4 className="mb-4 text-lg font-bold text-navy">{isFr ? "Points importants" : "Important notes"}</h4><ul className="space-y-3 text-sm text-slate-700"><li>✓ {isFr ? "Aucune connexion requise pour les examens blancs" : "No login required for mock exams"}</li><li>✓ {isFr ? "L'attestation est délivrée uniquement après validation par un formateur" : "Certificate issued only after trainer validation"}</li><li>✓ {isFr ? "L'attestation ELEVATE By IBN n'est pas une certification officielle" : "The ELEVATE By IBN certificate is not an official certification"}</li><li>✓ {isFr ? "Contactez un formateur pour définir votre parcours" : "Contact a trainer to define your path"}</li></ul><div className="mt-6"><Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"><Mail className="h-3.5 w-3.5" />{isFr ? "Contacter un formateur" : "Contact a trainer"}</Link></div></div>
          </div>
        </section>
      </div>
    </div>
  );
}
