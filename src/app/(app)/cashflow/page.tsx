"use client";

import { useState } from "react";
import { Card, SectionHeading, Button, Badge, StatCard } from "@/components/ui";
import { cn } from "@/lib/utils";

const atRiskClients = [
  { name: "Acme Studio", invoice: "#2048", amount: 4200, expectedDelay: 7 },
  { name: "Nova Labs", invoice: "#2051", amount: 1860, expectedDelay: 4 },
  { name: "PixelWorks", invoice: "#2039", amount: 3120, expectedDelay: 10 },
];

const tones = {
  Professional: "Hi Alex, this is a reminder that invoice #2048 ($4,200) is due this Friday. Please let us know if you have any questions.",
  Friendly: "Hi Alex, just a quick reminder that invoice #2048 is due this Friday. Let me know if you need anything from my side!",
  Firm: "Hi Alex, invoice #2048 for $4,200 is now overdue. Please arrange payment within 3 business days to avoid late fees.",
};

export default function CashflowPage() {
  const [tone, setTone] = useState<keyof typeof tones>("Friendly");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Cashflow Copilot"
        title="Which clients are likely to pay late?"
        description="AI analyzes historical payment behavior to flag risk before it becomes a cashflow problem."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Clients at high risk" value={atRiskClients.length} tone="warning" />
        <StatCard label="At-risk amount" value={`$${atRiskClients.reduce((s, c) => s + c.amount, 0).toLocaleString()}`} />
        <StatCard label="Avg expected delay" value="7 days" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {atRiskClients.map((c) => (
          <Card key={c.name} className="flex flex-col gap-2">
            <p className="text-[15px] font-semibold text-ink">{c.name}</p>
            <p className="text-sm text-muted">Invoice {c.invoice} · ${c.amount.toLocaleString()}</p>
            <Badge tone="warning" className="w-fit">Expected {c.expectedDelay} days late</Badge>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-4">
        <p className="text-sm font-medium text-ink">AI recommendation</p>
        <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand-deep">
          Offer Acme Studio a 2% early-payment discount — their payment pattern suggests this reduces delay risk by 60%.
        </p>
        <Button className="w-fit">Apply recommendation</Button>
      </Card>

      <Card className="flex flex-col gap-4">
        <p className="text-sm font-medium text-ink">Draft a reminder</p>
        <div className="flex gap-2">
          {(Object.keys(tones) as (keyof typeof tones)[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTone(t); setSent(false); }}
              className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors", tone === t ? "bg-brand text-white" : "bg-surface-2 text-muted hover:text-ink")}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="rounded-xl border border-subtle bg-surface-2 p-4 text-sm text-ink">{tones[tone]}</p>
        <div className="flex gap-3">
          <Button onClick={() => setSent(true)}>Send via PayPal</Button>
          <Button variant="secondary">Edit</Button>
        </div>
        {sent && <p className="text-xs text-success">Reminder sent to Acme Studio for invoice #2048.</p>}
      </Card>
    </div>
  );
}
