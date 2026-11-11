"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { COURSES } from "@/data/courses";
import Link from "next/link";
import {
  Award,
  Printer,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

function AttestationContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") || "fi-comptabilite-generale";
  const { user } = useAuth();

  const [courseSlug, setCourseSlug] = useState(initialCourse);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const [assessmentPassed, setAssessmentPassed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const loadAssessment = async () => {
      try {
        const response = await fetch("/api/assessments", { credentials: "same-origin" });
        const data: { rows?: unknown } = await response.json().catch(() => ({}));
        const rows = Array.isArray(data.rows) ? (data.rows as { course_slug?: string; passed?: number }[]) : [];
        const latest = rows.find((row) => row.course_slug === courseSlug) ?? rows[0];
        if (active) setAssessmentPassed(!!latest && Number(latest.passed) === 1);
      } catch {
        if (active) setAssessmentPassed(false);
      }
    };
    void loadAssessment();
    return () => {
      active = false;
    };
  }, [courseSlug]);

  const course =
    COURSES.find((c) => c.slug === courseSlug) ||
    COURSES.find((c) => c.module.toLowerCase() === courseSlug.toLowerCase()) ||
    COURSES[0];

  const learnerName = user?.name || "Jean Dupont";
  const certId = `SAP-IBN-2026-${course.module}-${Math.abs(
    (learnerName + course.slug).split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
  ).toString().slice(0, 6)}`;
  const issueDate = "09 novembre 2026";

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `Je viens de valider ma certification SAP : ${course.title} avec ELEVATE By IBN propulsé par IBN Group ! 🎓`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="no-print mx-auto max-w-4xl mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/apprenant"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au tableau de bord</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={courseSlug}
              onChange={(e) => setCourseSlug(e.target.value)}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-navy shadow-sm outline-none"
            >
              {COURSES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimer / Télécharger PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShareLinkedIn}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0077B5] px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <Share2 className="h-4 w-4" />
              <span>LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copier le lien public d'attestation"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-navy hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copié !" : "Lien"}</span>
            </button>
          </div>
        </div>

        {/* Verification banner */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              Attestation officielle vérifiée et certifiée par le jury académique d&apos;<strong>IBN Group</strong>.
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-700">{certId}</span>
        </div>
      </div>

      {/* Printable Certificate Stage */}
      <div className="mx-auto max-w-4xl">
        {assessmentPassed === true ? (
          <>
        <div
          ref={certRef}
          className="receipt relative overflow-hidden rounded-3xl border-8 border-double border-slate-300 bg-white p-8 sm:p-14 text-center shadow-2xl"
          style={{
            backgroundImage: "radial-gradient(#f8fafc 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Ornamental corner accents */}
          <div className="absolute top-4 left-4 h-12 w-12 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute top-4 right-4 h-12 w-12 border-t-2 border-r-2 border-primary"></div>
          <div className="absolute bottom-4 left-4 h-12 w-12 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-primary"></div>

          {/* Top Logo and Organization */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-base font-extrabold text-white shadow-md">
                SAP
              </span>
              <div className="text-left">
                <p className="text-xl font-black tracking-tight text-navy">SAP LEARNING ACADEMY</p>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Propulsé par IBN Group Consulting
                </p>
              </div>
            </div>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary to-amber-500 rounded-full"></div>
          </div>

          {/* Certificate Title */}
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Certificat Officiel d&apos;Accomplissement
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-navy italic">
              Attestation de Réussite
            </h1>
          </div>

          {/* Statement */}
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-500 font-sans">
              Le comité pédagogique et d&apos;évaluation certifie par la présente que
            </p>

            <p className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight font-sans">
              {learnerName}
            </p>

            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              a suivi avec succès l&apos;ensemble du programme de formation théorique, des ateliers pratiques sur système ERP et a satisfait aux exigences de l&apos;examen d&apos;évaluation final sur le module :
            </p>

            <div className="inline-block rounded-2xl bg-surface px-6 py-3 border border-slate-200">
              <p className="text-lg font-bold text-navy">{course.title}</p>
              <p className="text-xs font-semibold text-slate-500">
                Spécialité SAP {course.module} · {course.durationHours} heures certifiées · Niveau {course.level}
              </p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-14 grid grid-cols-3 items-end gap-6 pt-6 border-t border-slate-200">
            {/* Signature 1 */}
            <div className="text-center sm:text-left">
              <div className="h-10 flex items-center justify-center sm:justify-start">
                <span className="font-serif italic text-base text-navy font-bold">Claire Moreau</span>
              </div>
              <div className="mt-1 h-0.5 w-32 bg-slate-300 mx-auto sm:mx-0"></div>
              <p className="mt-1 text-xs font-bold text-navy">Dr. Claire Moreau</p>
              <p className="text-[11px] text-slate-500">Directrice Pédagogique SAP</p>
            </div>

            {/* Official Center Gold Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-1 shadow-lg">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-white bg-amber-600 text-white">
                  <Award className="h-6 w-6" />
                  <span className="text-[8px] font-black uppercase tracking-wider">OFFICIEL</span>
                </div>
              </div>
              <p className="mt-2 text-[10px] font-mono text-slate-400">ID: {certId}</p>
            </div>

            {/* Signature 2 */}
            <div className="text-center sm:text-right">
              <div className="h-10 flex items-center justify-center sm:justify-end">
                <span className="font-serif italic text-base text-navy font-bold">Ibrahim Ndiaye</span>
              </div>
              <div className="mt-1 h-0.5 w-32 bg-slate-300 mx-auto sm:ml-auto sm:mr-0"></div>
              <p className="mt-1 text-xs font-bold text-navy">Managing Partner</p>
              <p className="text-[11px] text-slate-500">IBN Group Consulting</p>
            </div>
          </div>

          {/* Bottom metadata */}
          <div className="mt-8 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-4">
            <span>Délivré le : <strong>{issueDate}</strong></span>
            <span>Vérification d&apos;authenticité : <strong>sap-academy.ibngroup.com/verify/{certId}</strong></span>
          </div>
        </div>
          </>
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/60 to-white p-8 text-center shadow-sm sm:p-10">
            <Award className="mx-auto h-10 w-10 text-amber-500" />
            <h2 className="mt-4 text-2xl font-extrabold text-navy">Attestation non disponible</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              L&apos;attestation est delivree apres la reussite de l&apos;examen d&apos;evaluation. Passez l&apos;examen officiel (seuil de 70%) apres avoir valide le module.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AttestationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">Génération de l&apos;attestation SAP...</div>}>
      <AttestationContent />
    </Suspense>
  );
}
