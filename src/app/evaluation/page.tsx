import { Suspense } from "react";
import EvaluationContent from "./content";

export default function EvaluationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">{`Chargement de l'évaluation SAP...`}</div>}>
      <EvaluationContent />
    </Suspense>
  );
}
