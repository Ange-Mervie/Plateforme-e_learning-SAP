"use client";

import Link from "next/link";

const IBN_LINKEDIN = "https://www.linkedin.com/in/ibn-group-755332227/";
const LinkedinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);


export default function IBNGroupSection() {
  return (
    <section className="border-t border-slate-800 bg-navy py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 lg:p-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-bold text-white">Partenariat avec IBN Group / Partnership with IBN Group</h2>
              <p className="mb-6 leading-relaxed text-blue-200">
                Services, solutions et formations SAP pour accompagner votre transformation digitale.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/ibn-group"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  Découvrir IBN Group
                </Link>
                <a
                  href={IBN_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
