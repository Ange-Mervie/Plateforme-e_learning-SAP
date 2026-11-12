"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Mail, Phone, MapPin, Briefcase, Building, Calendar, CheckCircle2, AlertTriangle, ArrowRight, ChevronLeft, User, BookOpen } from "lucide-react";

const SITUATIONS_FR = ["Étudiant", "Salarié", "Entrepreneur", "Demandeur d'emploi", "Autre"];
const SITUATIONS_EN = ["Student", "Employee", "Entrepreneur", "Job seeker", "Other"];

const NIVEAUX_FR = ["Débutant", "Intermédiaire", "Avancé"];
const NIVEAUX_EN = ["Beginner", "Intermediate", "Advanced"];

const OBJECTIFS_FR = ["Apprendre", "Se perfectionner", "Changer de carrière", "Développer des compétences professionnelles", "Autre"];
const OBJECTIFS_EN = ["Learn", "Improve", "Change career", "Develop professional skills", "Other"];

const MODES_FR = ["En ligne", "En présentiel"];
const MODES_EN = ["Online", "In-person"];

const DISPONIBILITES_FR = ["Matin", "Après-midi", "Soir", "Week-end"];
const DISPONIBILITES_EN = ["Morning", "Afternoon", "Evening", "Weekend"];

const OUI_NON_FR = ["Oui", "Non"];
const OUI_NON_EN = ["Yes", "No"];

interface ContactRequestFormData {
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  situation: string;
  formation: string;
  module: string;
  formateur: string;
  niveau: string;
  objectif: string;
  mode: string;
  disponibilite: string;
  dateDebut: string;
  dejaUtiliseSAP: string;
  dejaFormationSAP: string;
  attentes: string;
  message: string;
  consentement: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface ContactFormateurProps {
  formation?: string;
  module?: string;
  formateur?: string;
}

export default function ContactFormateur({ formation, module, formateur }: ContactFormateurProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const situations = isFr ? SITUATIONS_FR : SITUATIONS_EN;
  const niveaux = isFr ? NIVEAUX_FR : NIVEAUX_EN;
  const objectifs = isFr ? OBJECTIFS_FR : OBJECTIFS_EN;
  const modes = isFr ? MODES_FR : MODES_EN;
  const disponibilites = isFr ? DISPONIBILITES_FR : DISPONIBILITES_EN;
  const ouiNon = isFr ? OUI_NON_FR : OUI_NON_EN;

  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [formData, setFormData] = useState<ContactRequestFormData>({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    pays: isFr ? "Cameroun" : "Cameroon",
    situation: situations[0],
    formation: formation || "",
    module: module || "",
    formateur: formateur || "",
    niveau: niveaux[0],
    objectif: objectifs[0],
    mode: modes[0],
    disponibilite: disponibilites[0],
    dateDebut: "",
    dejaUtiliseSAP: ouiNon[1],
    dejaFormationSAP: ouiNon[1],
    attentes: "",
    message: "",
    consentement: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState<{ requestNumber: string } | null>(null);

  const getLabel = (key: string) => {
    const labels: Record<string, { fr: string; en: string }> = {
      title: { fr: "Contacter un formateur", en: "Contact a trainer" },
      subtitle: { fr: "Posez vos questions sur une formation SAP et soyez mis en relation avec un formateur certifié IBN Group.", en: "Ask your questions about a SAP training and be put in touch with a certified IBN Group trainer." },
      personalInfo: { fr: "Vos informations personnelles", en: "Your personal information" },
      formationInfo: { fr: "Informations sur la formation", en: "Training information" },
      complementaryInfo: { fr: "Informations complémentaires", en: "Additional information" },
      nom: { fr: "Nom et prénom *", en: "Full name *" },
      email: { fr: "Adresse e-mail *", en: "Email address *" },
      telephone: { fr: "Numéro WhatsApp *", en: "WhatsApp phone number *" },
      ville: { fr: "Ville de résidence", en: "City of residence" },
      pays: { fr: "Pays", en: "Country" },
      situation: { fr: "Situation actuelle *", en: "Current situation *" },
      formationLabel: { fr: "Formation souhaitée *", en: "Desired training *" },
      moduleLabel: { fr: "Module SAP concerné", en: "SAP module concerned" },
      formateurLabel: { fr: "Formateur associé", en: "Associated trainer" },
      niveau: { fr: "Niveau actuel *", en: "Current level *" },
      objectif: { fr: "Objectif *", en: "Objective *" },
      mode: { fr: "Modalité souhaitée *", en: "Preferred mode *" },
      disponibilite: { fr: "Disponibilité *", en: "Availability *" },
      dateDebut: { fr: "Date de début souhaitée", en: "Desired start date" },
      dejaUtiliseSAP: { fr: "Avez-vous déjà utilisé SAP ? *", en: "Have you already used SAP? *" },
      dejaFormationSAP: { fr: "Avez-vous déjà suivi une formation SAP ? *", en: "Have you already taken a SAP training? *" },
      attentes: { fr: "Qu'attendez-vous de cette formation ? *", en: "What do you expect from this training? *" },
      message: { fr: "Votre message ou préoccupations", en: "Your message or concerns" },
      consentement: { fr: "J'autorise ELEVATE By IBN à utiliser ces informations pour traiter ma demande.", en: "I authorize ELEVATE By IBN to use this information to process my request." },
      submit: { fr: "Envoyer ma demande", en: "Send my request" },
      successTitle: { fr: "Demande enregistrée", en: "Request recorded" },
      successMessage: { fr: "Merci pour votre intérêt envers ELEVATE By IBN ! Votre demande a bien été enregistrée. Notre équipe vous contactera prochainement afin de discuter de votre projet de formation.", en: "Thank you for your interest in ELEVATE By IBN! Your request has been recorded. Our team will contact you shortly to discuss your training project." },
      requestNumber: { fr: "Numéro de demande", en: "Request number" },
      back: { fr: "Retour au catalogue", en: "Back to catalog" },
      required: { fr: "Ce champ est requis.", en: "This field is required." },
      invalidEmail: { fr: "Email invalide.", en: "Invalid email." },
      invalidPhone: { fr: "Téléphone invalide (au moins 8 chiffres).", en: "Invalid phone (at least 8 digits)." },
      consentRequired: { fr: "Le consentement est obligatoire.", en: "Consent is mandatory." },
    };
    return labels[key]?.[isFr ? "fr" : "en"] || key;
  };

  const validate = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!formData.nom.trim()) e.nom = getLabel("required");
    if (!formData.email.trim()) e.email = getLabel("required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = getLabel("invalidEmail");
    if (!formData.telephone.trim()) e.telephone = getLabel("required");
    else if (formData.telephone.replace(/\D/g, "").length < 8) e.telephone = getLabel("invalidPhone");
    if (!formData.ville.trim()) e.ville = getLabel("required");
    if (!formData.pays.trim()) e.pays = getLabel("required");
    if (!formData.situation) e.situation = getLabel("required");
    if (!formData.formation) e.formation = getLabel("required");
    if (!formData.niveau) e.niveau = getLabel("required");
    if (!formData.objectif) e.objectif = getLabel("required");
    if (!formData.mode) e.mode = getLabel("required");
    if (!formData.disponibilite) e.disponibilite = getLabel("required");
    if (!formData.dateDebut) e.dateDebut = getLabel("required");
    if (!formData.dejaUtiliseSAP) e.dejaUtiliseSAP = getLabel("required");
    if (!formData.dejaFormationSAP) e.dejaFormationSAP = getLabel("required");
    if (!formData.attentes.trim()) e.attentes = getLabel("required");
    if (formData.consentement !== true) e.consentement = getLabel("consentRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData, getLabel]);

  const handleChange = (key: keyof ContactRequestFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroller vers la première erreur
      const firstErrorKey = Object.keys(errors)[0] as keyof ContactRequestFormData;
      const el = document.getElementById(String(firstErrorKey));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      setSuccess(data);
      setStep("confirmation");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="mx-auto max-w-2xl py-20 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-navy mb-4">{getLabel("successTitle")}</h1>
        <p className="text-lg text-slate-600 mb-8">{getLabel("successMessage")}</p>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-surface px-4 py-2 text-sm font-semibold text-navy mb-8">
          <span className="font-bold">{getLabel("requestNumber")} :</span>
          <span>{success?.requestNumber}</span>
        </div>
        <Link
          href="/catalogue"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          <span>{getLabel("back")}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
          <User className="h-5 w-5 text-primary" />
          {getLabel("personalInfo")}
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">{getLabel("nom")}</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
            className={`h-10 w-full rounded-lg border px-3 text-sm text-navy outline-none focus:border-primary ${errors.nom ? "border-red-500" : "border-slate-300"}`}
          />
          {errors.nom && <p className="text-xs text-red-600">{errors.nom}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">{getLabel("email")}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`h-10 w-full rounded-lg border px-3 text-sm text-navy outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-slate-300"}`}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">{getLabel("telephone")}</label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
            className={`h-10 w-full rounded-lg border px-3 text-sm text-navy outline-none focus:border-primary ${errors.telephone ? "border-red-500" : "border-slate-300"}`}
            placeholder="+237 6 XX XX XX XX"
          />
          {errors.telephone && <p className="text-xs text-red-600">{errors.telephone}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">{getLabel("ville")}</label>
          <input
            type="text"
            value={formData.ville}
            onChange={(e) => handleChange("ville", e.target.value)}
            className="h-10 w-full rounded-lg border px-3 text-sm text-navy outline-none focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">{getLabel("pays")}</label>
          <input
            type="text"
            value={formData.pays}
            onChange={(e) => handleChange("pays", e.target.value)}
            className="h-10 w-full rounded-lg border px-3 text-sm text-navy outline-none focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">{getLabel("situation")}</label>
          <select
            value={formData.situation}
            onChange={(e) => handleChange("situation", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
          >
            {situations.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
            <BookOpen className="h-5 w-5 text-primary" />
            {getLabel("formationInfo")}
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("formationLabel")}</label>
            <input
              type="text"
              value={formData.formation}
              onChange={(e) => handleChange("formation", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("moduleLabel")}</label>
            <input
              type="text"
              value={formData.module}
              onChange={(e) => handleChange("module", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("formateurLabel")}</label>
            <input
              type="text"
              value={formData.formateur}
              onChange={(e) => handleChange("formateur", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("niveau")}</label>
            <select
              value={formData.niveau}
              onChange={(e) => handleChange("niveau", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            >
              {niveaux.map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("objectif")}</label>
            <select
              value={formData.objectif}
              onChange={(e) => handleChange("objectif", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            >
              {objectifs.map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("mode")}</label>
            <select
              value={formData.mode}
              onChange={(e) => handleChange("mode", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            >
              {modes.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("disponibilite")}</label>
            <select
              value={formData.disponibilite}
              onChange={(e) => handleChange("disponibilite", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            >
              {disponibilites.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("dateDebut")}</label>
            <input
              type="date"
              value={formData.dateDebut}
              onChange={(e) => handleChange("dateDebut", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
            <AlertTriangle className="h-5 w-5 text-primary" />
            {getLabel("complementaryInfo")}
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("dejaUtiliseSAP")}</label>
            <select
              value={formData.dejaUtiliseSAP}
              onChange={(e) => handleChange("dejaUtiliseSAP", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            >
              {ouiNon.map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("dejaFormationSAP")}</label>
            <select
              value={formData.dejaFormationSAP}
              onChange={(e) => handleChange("dejaFormationSAP", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
            >
              {ouiNon.map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("attentes")}</label>
            <textarea
              value={formData.attentes}
              onChange={(e) => handleChange("attentes", e.target.value)}
              rows={3}
              className="h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-700">{getLabel("message")}</label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={3}
              className="h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <input
            id="consentement"
            type="checkbox"
            checked={formData.consentement}
            onChange={(e) => handleChange("consentement", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary mt-0.5"
          />
          <label htmlFor="consentement" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
            {getLabel("consentement")}
          </label>
          {errors.consentement && <p className="ml-4 text-xs text-red-600">{errors.consentement}</p>}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-60"
        >
          {submitting ? "Envoi en cours…" : getLabel("submit")}
        </button>
        {submitError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
      </div>
    </div>
  );
}
