export const CURRENCY_CONFIG = {
  base: "EUR",
  target: "XAF",
  rate: 655.957, // 1 EUR = 655,957 XAF (parité fixe BCEAO/BEAC, 11 nov 2026)
  lastUpdated: "2026-11-11",
  source: "BCEAO / BEAC",
};

export function eurToXaf(amountEur: number): number {
  return Math.round(amountEur * CURRENCY_CONFIG.rate);
}

export function xafToEur(amountXaf: number): number {
  return Math.round((amountXaf / CURRENCY_CONFIG.rate) * 100) / 100;
}

export function formatXaf(amountXaf: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountXaf);
}

export function formatEur(amountEur: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountEur);
}

export const SUBSCRIPTION_CONFIG = {
  monthly: {
    priceEur: 99,
    label: "Mensuel",
    description: "Accès illimité à tous les modules SAP, Labs et examens.",
  },
  yearly: {
    priceEur: 990,
    label: "Annuel",
    description: "Accès illimité à tous les modules SAP, Labs et examens. 2 mois offerts.",
  },
  certificationExamEur: 200, // Prix coupon d'examen SAP 2026
};

export function formatSubscriptionPriceEur(priceEur: number): string {
  return formatEur(priceEur);
}

export function formatSubscriptionPriceXaf(priceEur: number): string {
  return formatXaf(eurToXaf(priceEur));
}
