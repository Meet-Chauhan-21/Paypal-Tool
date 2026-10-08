"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, Badge, Button, StatusPill } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { SubscriptionItem } from "@/lib/types";

export function SubscriptionsBoard({ subscriptions: initial }: { subscriptions: SubscriptionItem[] }) {
  const [subscriptions, setSubscriptions] = useState(initial);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function act(id: number, status: string) {
    setBusyId(id);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...data.subscription } : s)));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {subscriptions.map((s) => {
        const increase = Number(s.monthlyAmount) - Number(s.previousAmount);
        const pct = increase > 0 ? ((increase / Number(s.previousAmount)) * 100).toFixed(1) : null;
        return (
          <Card key={s.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-ink">{s.name}</p>
                <StatusPill status={s.status} />
              </div>
              <p className="text-xs text-muted">{s.vendor} · {s.category} · {s.seats} seats</p>
              {s.note && <p className="mt-1 text-xs text-warning">{s.note}</p>}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-lg font-semibold tabular text-ink">{formatCurrency(Number(s.monthlyAmount))}<span className="text-xs font-normal text-faint">/mo</span></p>
                {pct && (
                  <Badge tone="warning" className="mt-1">
                    <TrendingUp size={11} /> +{pct}%
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" loading={busyId === s.id} onClick={() => act(s.id, "investigating")}>Investigate</Button>
                <Button size="sm" variant="secondary" loading={busyId === s.id} onClick={() => act(s.id, "negotiating")}>Ask for better pricing</Button>
                <Button size="sm" variant="outlineDanger" loading={busyId === s.id} onClick={() => act(s.id, "downgraded")}>Downgrade</Button>
                <Button size="sm" variant="ghost" loading={busyId === s.id} onClick={() => act(s.id, "active")}>Keep</Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
