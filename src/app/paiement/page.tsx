"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import Receipt, { type ReceiptData } from "@/components/paiement/receipt";
import Link from "next/link";
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Printer,
  ArrowRight,
  Lock,
} from "lucide-react";

const PACKS = [
  {
    id: "pack-finance",
    title: "Parcours Consultant SAP Finance (FI + CO)",
    amount: "480 000 FCFA",
    numericAmount: 480000,
    desc: "Comptabilité générale, contrôle de gestion, ateliers SPRO, labs SAP et examen blanc.",
    popular: true,
  },
  {
    id: "pack-supply",
    title: "Parcours Consultant Logistique & Achats (MM + SD)",
    amount: "450 000 FCFA",
    numericAmount: 450000,
    desc: "Gestion des stocks, achats, approvisionnements, facturation et intégration flux.",
    popular: false,
  },
  {
    id: "pack-all",
    title: "Pass All-Access Illimité (12 mois)",
    amount: "850 000 FCFA",
    numericAmount: 850000,
    desc: "Accès à l'ensemble du catalogue (FI, MM, SD, ABAP, BTP), labs et attestations illimitées.",
    popular: false,
  },
];

const METHODS = [
  { id: "carte", label: "Carte bancaire (Visa / Mastercard)", icon: CreditCard },
  { id: "om", label: "Orange Money", icon: Smartphone },
  { id: "mtn", label: "MTN Mobile Money", icon: Smartphone },
  { id: "wave", label: "Wave", icon: Smartphone },
];

export default function Paiement() {
  const { t } = useLanguage();
  const { user, activateSubscription } = useAuth();

  const [selectedPackId, setSelectedPackId] = useState("pack-finance");
  const [method, setMethod] = useState("carte");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8910");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("789");
  const [phone, setPhone] = useState("+221 77 123 45 67");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const selectedPack = PACKS.find((p) => p.id === selectedPackId) || PACKS[0];
  const selectedMethod = METHODS.find((m) => m.id === method) || METHODS[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "carte" && cardNumber.replace(/\s/g, "").length < 12) {
      setError("Veuillez saisir un numéro de carte bancaire valide.");
      return;
    }

    if (method !== "carte" && phone.trim().length < 8) {
      setError("Veuillez saisir un numéro de téléphone valide pour Mobile Money.");
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id ? Number(user.id) || 1 : 1 }),
      });
    } catch {
      // Offline fallback
    }

    // Activate subscription in state and session cookie
    activateSubscription(selectedPack.id);

    const generatedReceipt: ReceiptData = {
      receiptNumber: `RCPT-${Date.now().toString().slice(-6)}`,
      date: new Date(),
      learnerName: user?.name || "Jean Dupont",
      learnerEmail: user?.email || "jean.dupont@example.com",
      training: selectedPack.title,
      amount: selectedPack.amount,
      method: selectedMethod.label,
      transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "active",
    };

    setReceiptData(generatedReceipt);
    setIsPaidSuccess(true);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="bg-slate-50 min-h-screen py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {!isPaidSuccess ? (
          <div>
            <div className="text-center max-w-2xl mx-auto">
              <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Paiement Sécurisé SSL 256-bit
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Finaliser votre inscription certifiante
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Paiement instantané par carte bancaire ou Mobile Money (Orange Money, MTN, Wave).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-3">
              {/* Left 2 Cols: Pack & Method selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pack Selection */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-base font-bold text-navy">1. Choisissez votre cursus SAP</h2>
                  <div className="mt-4 space-y-3">
                    {PACKS.map((pack) => {
                      const isSelected = selectedPackId === pack.id;
                      return (
                        <label
                          key={pack.id}
                          className={`relative flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-slate-200 hover:border-slate-300 hover:bg-surface"
                          }`}
                        >
                          <input
                            type="radio"
                            name="pack"
                            value={pack.id}
                            checked={isSelected}
                            onChange={() => setSelectedPackId(pack.id)}
                            className="mt-1 h-4 w-4 accent-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-navy">{pack.title}</p>
                              <span className="text-sm font-extrabold text-primary">{pack.amount}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{pack.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-base font-bold text-navy">2. Mode de règlement</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {METHODS.map((m) => {
                      const isSelected = method === m.id;
                      return (
                        <label
                          key={m.id}
                          className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary font-semibold text-primary"
                              : "border-slate-200 hover:bg-surface text-navy"
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value={m.id}
                            checked={isSelected}
                            onChange={(e) => setMethod(e.target.value)}
                            className="h-4 w-4 accent-primary"
                          />
                          <m.icon className="h-4 w-4" />
                          <span className="text-xs">{m.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Payment Inputs */}
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {method === "carte" ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-navy">Numéro de carte</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 0000 0000 0000"
                            className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-mono text-navy outline-none focus:border-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-navy">Expiration</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/AA"
                              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-mono text-navy outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-navy">CVC / CVV</label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-mono text-navy outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-navy">
                          Numéro de téléphone ({selectedMethod.label})
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+221 77 000 00 00"
                          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-mono text-navy outline-none focus:border-primary"
                        />
                        <p className="text-xs text-slate-500">
                          Une notification de validation sera envoyée sur votre mobile pour confirmer le débit.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Col: Order Summary & Pay Button */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-navy">Récapitulatif de commande</h3>
                  <div className="mt-4 space-y-3 text-xs border-b border-slate-100 pb-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Formation :</span>
                      <span className="font-semibold text-navy">{selectedPack.title}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Accès Labs SAP :</span>
                      <span className="font-semibold text-emerald-600">Inclus (12 mois)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Examen & Attestation :</span>
                      <span className="font-semibold text-emerald-600">Inclus</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-slate-600">Montant total :</span>
                    <span className="text-2xl font-black text-navy">{selectedPack.amount}</span>
                  </div>

                  {error && <p className="mt-4 text-xs font-semibold text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{loading ? "Traitement en cours..." : `Payer ${selectedPack.amount}`}</span>
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Transactions sécurisées par IBN Group</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Post Payment Confirmation & Receipt Stage */
          <div className="space-y-6">
            <div className="no-print rounded-2xl border border-emerald-200 bg-emerald-50 p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Paiement validé avec succès !</h2>
                  <p className="text-xs text-emerald-700">
                    Votre accès complet a été activé. Votre reçu officiel est disponible ci-dessous.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-navy px-4 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimer le reçu</span>
                </button>
                <Link
                  href="/apprenant"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
                >
                  <span>Accéder à mes formations</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {receiptData && <Receipt data={receiptData} />}
          </div>
        )}
      </div>
    </main>
  );
}
