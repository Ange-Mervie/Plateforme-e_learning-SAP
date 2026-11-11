import { Suspense } from "react";
import RequireActiveSubscriptionClient from "@/components/auth/require-subscription-client";
import EvaluationContent from "./content";

export default function EvaluationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">{`Chargement de l'évaluation SAP...`}</div>}>
      <RequireActiveSubscriptionClient>
        <EvaluationContent />
      </RequireActiveSubscriptionClient>
    </Suspense>
  );
}
