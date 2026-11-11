"use client";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default function IBNGroupSection() {
  return (
    <section className="bg-navy py-20 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl bg-white/5 p-12 lg:p-16 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary mb-4 md:mb-0">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">
                Partenariat avec IBN Group
              </h2>
              <p className="text-blue-200 leading-relaxed mb-6">
                Services, solutions et formations SAP pour accompagner votre transformation digitale.
              </p>
              <Link
                href="/ibn-group"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
              >
                Découvrir IBN Group <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
