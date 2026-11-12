"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface FormationBreadcrumbProps {
  module: string;
}

export default function FormationBreadcrumb({ module }: FormationBreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-blue-200">
      <Link href="/" className="hover:text-white">
        {t("nav.home")}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link href="/catalogue" className="hover:text-white">
        {t("nav.catalogue")}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-white">{module}</span>
    </nav>
  );
}
