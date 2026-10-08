"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeading } from "@/components/ui";
import { ProcureFlow } from "@/components/procure-flow";

function ProcureInner() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const autorun = params.get("autorun") === "1";

  return <ProcureFlow initialQuery={q} autorun={autorun} />;
}

export default function ProcurePage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Procure"
        title="AI procurement agent"
        description="Understands your request, researches suppliers, negotiates and purchases — with you in control at every high-impact step."
      />
      <Suspense fallback={null}>
        <ProcureInner />
      </Suspense>
    </div>
  );
}
