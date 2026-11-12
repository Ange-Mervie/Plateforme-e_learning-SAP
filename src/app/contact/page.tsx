"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactFormateur from "@/components/contact-form";

export default function ContactPage() {
  const [formation, setFormation] = useState("");
  const [module, setModule] = useState("");
  const [formateur, setFormateur] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormation(params.get("formation") || "");
    setModule(params.get("module") || "");
    setFormateur(params.get("formateur") || "");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">Contacter un formateur</h1>
              <p className="text-sm text-slate-600">Posez vos questions sur une formation SAP et soyez mis en relation avec un formateur certifié IBN Group.</p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 h-10 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
            >
              ← Retour au catalogue
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <ContactFormateur formation={formation} module={module} formateur={formateur} />
      </div>
    </div>
  );
}
