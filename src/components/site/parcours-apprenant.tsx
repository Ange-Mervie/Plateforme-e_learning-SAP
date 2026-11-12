"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Search, Mail, BookOpen, Award } from "lucide-react";

const STEPS_FR = [
  {
    title: "Découvrir et tester",
    desc: "Explorez le catalogue SAP et passez gratuitement un examen blanc pour évaluer votre niveau.",
    icon: Search,
    href: "/catalogue",
    label: "Voir le catalogue",
  },
  {
    title: "Contacter un formateur",
    desc: "Remplissez le formulaire de demande et soyez mis en relation avec un formateur certifié IBN Group.",
    icon: Mail,
    href: "/contact",
    label: "Accéder au formulaire",
  },
  {
    title: "Suivre sa formation",
    desc: "Accompagné par votre formateur, suivez le parcours de formation défini ensemble, avec labs et exercices pratiques.",
    icon: BookOpen,
    href: "/catalogue",
    label: "Découvrir les formations",
  },
  {
    title: "Valider et obtenir son attestation",
    desc: "Après réussite de l'évaluation finale et validation pédagogique, recevez votre attestation ELEVATE By IBN.",
    icon: Award,
    href: "/attestation",
    label: "Voir les conditions",
  },
];

const STEPS_EN = [
  {
    title: "Discover and test",
    desc: "Explore the SAP catalog and take a free mock exam to assess your level.",
    icon: Search,
    href: "/catalogue",
    label: "View catalog",
  },
  {
    title: "Contact a trainer",
    desc: "Fill out the request form and be put in touch with a certified IBN Group trainer.",
    icon: Mail,
    href: "/contact",
    label: "Access the form",
  },
  {
    title: "Follow your training",
    desc: "With your trainer, follow the defined training path with labs and practical exercises.",
    icon: BookOpen,
    href: "/catalogue",
    label: "Discover training",
  },
  {
    title: "Validate and get your certificate",
    desc: "After passing the final assessment and pedagogical validation, receive your ELEVATE By IBN certificate.",
    icon: Award,
    href: "/attestation",
    label: "See conditions",
  },
];

export default function ParcoursApprenant() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const steps = isFr ? STEPS_FR : STEPS_EN;

  return (
    <section className="bg-white py-20 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {isFr ? "Votre parcours ELEVATE By IBN" : "Your ELEVATE By IBN journey"}
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            {isFr ? "Un parcours simple, sans connexion obligatoire, pour monter en compétences SAP à votre rythme." : "A simple journey, no login required, to build your SAP skills at your own pace."}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              {/* Étape numéro */}
              <div className="relative h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4 z-10 ring-8 ring-primary/20">
                {i + 1}
              </div>
              {/* Connexion entre étapes */}
              {i < steps.length - 1 && (
                <div className="absolute -top-1 left-1/2 h-[1px] w-[40px] bg-slate-300 -translate-x-1/2" />
              )}
              <div className="absolute top-0 left-0 h-full w-full rounded-full border-2 border-transparent group-hover:border-primary transition-colors" />

              {/* Icône */}
              <div className="h-12 w-12 rounded-full bg-surface border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                <step.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              <Link
                href={step.href}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                {step.label} <span className="text-[10px]">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
