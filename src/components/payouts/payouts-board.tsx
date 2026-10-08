"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, Badge, Button, RiskBadge } from "@/components/common/ui";
import { cn, formatCurrency } from "@/lib/utils";
import type { PayoutItem } from "@/lib/types";

export function PayoutsBoard({ payouts: initial }: { payouts: PayoutItem[] }) {
  const [payouts, setPayouts] = useState(initial);
  const [busyId, setBusyId] = useState<number | null>(null);

  const total = payouts.reduce((sum, p) => sum + Number(p.amount), 0);
  const flagged = payouts.filter((p) => p.status === "review");
  const ready = payouts.filter((p) => p.status === "ready");

  async function markReady(id: number) {
    setBusyId(id);
    try {
      const res = await fetch("/api/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "ready" }),
      });
      const data = await res.json();
      setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data.payout } : p)));
    } finally {
      setBusyId(null);
    }
  }

  async function payAll() {
    setBusyId(-1);
    const toPay = payouts.filter((p) => p.status === "ready");
    for (const p of toPay) {
      await fetch("/api/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, status: "paid" }),
      });
    }
    setPayouts((prev) => prev.map((p) => (p.status === "ready" ? { ...p, status: "paid" } : p)));
    setBusyId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[15px] font-semibold text-ink">Translator Payout Batch #14</p>
          <p className="text-sm text-muted">{payouts.length} recipients · {formatCurrency(total)} total</p>
        </div>
        <div className="flex items-center gap-2">
          {flagged.length > 0 && (
            <Badge tone="warning"><AlertTriangle size={12} /> {flagged.length} need review</Badge>
          )}
          <Button loading={busyId === -1} onClick={payAll} disabled={ready.length === 0}>
            Pay {ready.length} ready recipients
          </Button>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-2xl border border-subtle bg-surface shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-subtle text-xs uppercase tracking-wide text-faint">
              <th className="px-4 py-3 font-medium">Recipient</th>
              <th className="px-4 py-3 font-medium">Units</th>
              <th className="px-4 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className={cn("border-b border-soft last:border-0", p.status === "review" && "bg-warning-soft/40")}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{p.recipient}</p>
                  {p.note && <p className="text-xs text-warning">{p.note}</p>}
                </td>
                <td className="px-4 py-3 tabular">{Number(p.units).toLocaleString()}</td>
                <td className="px-4 py-3 tabular">${Number(p.rate).toFixed(2)}</td>
                <td className="px-4 py-3 font-semibold tabular">{formatCurrency(Number(p.amount))}</td>
                <td className="px-4 py-3"><RiskBadge risk={p.risk} /></td>
                <td className="px-4 py-3">
                  {p.status === "paid" ? (
                    <Badge tone="success"><CheckCircle2 size={11} /> Paid</Badge>
                  ) : p.status === "review" ? (
                    <Badge tone="warning">Needs review</Badge>
                  ) : (
                    <Badge tone="brand">Ready</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.status === "review" && (
                    <Button size="sm" variant="secondary" loading={busyId === p.id} onClick={() => markReady(p.id)}>
                      Mark ready
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
