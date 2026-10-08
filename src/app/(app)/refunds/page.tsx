"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, SectionHeading, Button, Badge, AmountDisplay } from "@/components/ui";

const checks = ["Order", "Shipping", "Delivery", "Messages", "Return policy"];

export default function RefundRefereePage() {
  const [decision, setDecision] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Refund Referee"
        title="AI Refund Referee"
        description="AI reviews the full transaction history before recommending a fair resolution."
      />

      <Card className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold text-ink">Nova Labs Studio — PP-24118</p>
            <p className="text-sm text-muted">Customer requested: Full refund</p>
          </div>
          <AmountDisplay value={420} size="lg" />
        </div>

        <div className="flex flex-wrap gap-2">
          {checks.map((c) => (
            <Badge key={c} tone="success"><CheckCircle2 size={12} /> {c}</Badge>
          ))}
        </div>

        <div className="rounded-xl bg-brand-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-deep">Recommendation</p>
          <p className="mt-1 text-lg font-semibold text-brand-deep">Offer $280 partial refund</p>
          <p className="mt-2 text-sm text-ink">
            The product was delivered successfully, but the merchant response was delayed and the customer
            experienced a documented issue.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDecision("partial")}>Approve $280 Refund</Button>
          <Button variant="secondary" onClick={() => setDecision("full")}>Full Refund</Button>
          <Button variant="outlineDanger" onClick={() => setDecision("decline")}>Decline</Button>
          <Button variant="ghost">Review Evidence</Button>
        </div>

        {decision && (
          <p className="rounded-xl bg-success-soft p-3 text-sm text-success">
            {decision === "partial" && "$280 partial refund approved and will be processed through PayPal."}
            {decision === "full" && "Full $420 refund approved and will be processed through PayPal."}
            {decision === "decline" && "Refund declined. The customer will be notified with the reasoning."}
          </p>
        )}
      </Card>
    </div>
  );
}
