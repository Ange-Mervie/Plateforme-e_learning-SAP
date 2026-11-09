"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Globe,
  Award,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const STATS = [
  { value: "15+", label: "Années d'excellence", sub: "Au service des entreprises" },
  { value: "250+", label: "Projets SAP réalisés", sub: "Migrations & Déploiements S/4HANA" },
  { value: "1 500+", label: "Professionnels formés", sub: "Sur nos filières certifiantes" },
  { value: "98 %", label: "Taux de satisfaction", sub: "Retours clients et apprenants" },
];

const PILLARS = [
  {
    icon: Layers,
    title: "Conseil & Architecture S/4HANA",
    desc: "Cadrage stratégique, feuille de route de migration vers SAP S/4HANA Cloud et stratégie 'Clean Core' pour garantir l'agilité de vos processus d'affaires.",
  },
  {
    icon: Briefcase,
    title: "Intégration Métier & Paramétrage",
    desc: "Déploiement éprouvé des modules clés : Finance (FI/CO), Supply Chain (MM/SD/PP) et gestion du capital humain, adapté aux réglementations locales et internationales.",
  },
  {
    icon: Sparkles,
    title: "SAP BTP, Fiori & Business AI",
    desc: "Modernisation des interfaces utilisateurs avec SAP Fiori, intégration Cloud via SAP BTP, développement ABAP RESTful (RAP) et exploitation des données avec SAP Datasphere.",
  },
  {
    icon: Award,
    title: "SAP Learning Academy",
    desc: "Notre division dédiée au transfert de compétences : formations certifiantes, environnements bac à sable (Labs SAP) et mentorat par nos consultants en mission.",
  },
];

const SECTORS = [
  "Banque & Services Financiers",
  "Télécommunications & Médias",
  "Industrie, Énergie & Mines",
  "Distribution & Agroalimentaire",
  "Secteur Public & Administrations",
  "Santé & Pharmacie",
];

export default function IBNGroup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "formation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/courses/hero.svg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/90 to-navy" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur">
              <Building2 className="h-4 w-4 text-primary" />
              <span>IBN Group · Conseil & Intégration ERP SAP</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Pionnier de la transformation digitale et de l&apos;expertise SAP
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              Cabinet international de conseil, nous accompagnons les grandes entreprises, PME et institutions dans la mise en œuvre, l&apos;optimisation et l&apos;appropriation des solutions SAP de nouvelle génération.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-dark"
              >
                Demander un devis ou une formation
              </a>
              <Link
                href="/catalogue"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                Explorer notre Académie SAP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-slate-200 bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="text-4xl font-black text-primary tracking-tight">{s.value}</p>
                <p className="mt-1 text-base font-bold text-navy">{s.label}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Nos Métiers & Savoir-faire</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
            Une offre globale de bout en bout
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            De la stratégie de cadrage à la mise en production, nous combinons excellence méthodologique et maîtrise technologique pour pérenniser vos investissements ERP.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors Section */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Secteurs d&apos;intervention</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Une connaissance approfondie de vos enjeux sectoriels
              </h2>
              <p className="mt-4 text-blue-100 leading-relaxed">
                Nos experts fonctionnels possèdent une expérience métier éprouvée pour adresser les contraintes réglementaires, logistiques et financières spécifiques à votre industrie.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTORS.map((sector, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-white">{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Enterprise Training Request Section */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Prendre Contact</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">
              Construisons ensemble votre projet SAP
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Que vous souhaitiez former vos équipes, migrer vers S/4HANA ou déployer une solution sur mesure, nos consultants et directeurs de mission vous répondent sous 24h.
            </p>

            <div className="mt-8 space-y-5 text-sm text-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-navy">Bureaux Internationaux</p>
                  <p className="text-xs text-slate-500">Paris (France) · Dakar (Sénégal) · Abidjan (Côte d&apos;Ivoire)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-navy">Email institutionnel</p>
                  <p className="text-xs text-slate-500">contact@ibngroup-consulting.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-navy">Service Formation & Entreprise</p>
                  <p className="text-xs text-slate-500">+33 1 89 20 44 00 / +221 33 800 20 20</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-navy">Demande transmise avec succès</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Merci pour votre confiance. Un directeur de mission IBN Group prendra contact avec vous sous 24 heures ouvrées.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl bg-surface px-5 py-2 text-xs font-bold text-navy hover:bg-slate-200"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-navy">Formulaire de contact & devis</h3>

                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-navy">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-navy outline-none focus:border-primary"
                    placeholder="Mme/M. Dupont"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-navy">
                      Email professionnel
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-navy outline-none focus:border-primary"
                      placeholder="nom@entreprise.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs font-semibold text-navy">
                      Entreprise / Organisation
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-navy outline-none focus:border-primary"
                      placeholder="Société SA"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-semibold text-navy">
                    Besoin principal
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
                  >
                    <option value="formation">Formation d&apos;équipe / Montée en compétences SAP</option>
                    <option value="s4hana">Projet de migration / Déploiement SAP S/4HANA</option>
                    <option value="audit">Audit d&apos;architecture & Optimisation des processus</option>
                    <option value="partenariat">Partenariat Académique & Recrutement</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-navy">
                    Votre message ou cahier des charges
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm text-navy outline-none focus:border-primary"
                    placeholder="Précisez le contexte, le nombre de collaborateurs concernés ou le périmètre..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmettre ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
