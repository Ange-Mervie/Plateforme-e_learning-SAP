"use client";

import { useLanguage } from "@/context/language-context";

export type ReceiptData = {
  receiptNumber: string;
  date: Date;
  learnerName: string;
  learnerEmail: string;
  training: string;
  amount: string;
  method: string;
  transactionRef: string;
  status: string;
};

export default function Receipt({ data }: { data: ReceiptData }) {
  const { t } = useLanguage();
  const isPaid = data.status === "active";
  const statusLabel = isPaid ? t("receipt.statusPaid") : t("receipt.statusPending");

  return (
    <section className="receipt rounded-2xl border border-slate-200 bg-white p-8 text-navy sm:p-10">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white">SAP</span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-navy">SAP Learning Academy</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("receipt.title")}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("receipt.receiptNo")}</p>
          <p className="mt-1 text-sm font-bold text-navy">{data.receiptNumber}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("receipt.learner")}</p>
          <p className="mt-1 text-sm font-semibold text-navy">{data.learnerName}</p>
          <p className="mt-1 text-sm text-slate-600">{data.learnerEmail}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("receipt.training")}</p>
          <p className="mt-1 text-sm font-semibold text-navy">{data.training}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("receipt.date")}</p>
          <p className="mt-1 text-sm font-semibold text-navy">{data.date.toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("receipt.method")}</p>
          <p className="mt-1 text-sm font-semibold text-navy">{data.method}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-surface p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">{t("receipt.amount")}</p>
          <p className="text-2xl font-bold text-navy">{data.amount}</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700">{t("receipt.transaction")}</p>
          <p className="text-sm font-semibold text-navy">{data.transactionRef || t("receipt.notAvailable")}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{t("receipt.status")}</p>
        <p className="text-sm font-bold text-navy">{statusLabel}</p>
      </div>
    </section>
  );
}
