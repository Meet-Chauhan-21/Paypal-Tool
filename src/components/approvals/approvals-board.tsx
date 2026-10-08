"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, MessageCircle } from "lucide-react";
import { Card, Badge, RiskBadge, AmountDisplay, Button, EmptyState } from "@/components/common/ui";
import { cn, formatDate } from "@/lib/utils";
import { useHeyPayPal } from "@/components/common/hey-paypal";
import type { Approval } from "@/lib/types";

const tabs: { key: string; label: string; match?: Approval["type"] }[] = [
  { key: "all", label: "All" },
  { key: "purchase", label: "Purchases", match: "purchase" },
  { key: "payment", label: "Payments", match: "payment" },
  { key: "payout", label: "Payouts", match: "payout" },
  { key: "refund", label: "Refunds", match: "refund" },
  { key: "policy_exception", label: "Policy Exceptions", match: "policy_exception" },
];

export function ApprovalsBoard({ approvals: initial }: { approvals: Approval[] }) {
  const [approvals, setApprovals] = useState(initial);
  const [tab, setTab] = useState("all");
  const heyPaypal = useHeyPayPal();
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = approvals.filter((a) => (tab === "all" ? true : a.type === tab));
  const pending = filtered.filter((a) => a.status === "pending");
  const decided = filtered.filter((a) => a.status !== "pending");

  async function decide(id: number, status: "approved" | "rejected") {
    setBusyId(id);
    try {
      const res = await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, ...data.approval } : a)));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.key ? "bg-brand text-white" : "bg-surface-2 text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {pending.length === 0 && (
        <EmptyState icon={<CheckCircle2 size={28} />} title="You're all caught up." description="No approvals are waiting on you right now." />
      )}

      <div className="flex flex-col gap-4">
        {pending.map((a) => (
          <Card key={a.id} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-ink">{a.title}</p>
                <p className="mt-1 text-sm text-muted">{a.reason}</p>
              </div>
              <AmountDisplay value={Number(a.amount)} size="lg" tone="brand" />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge tone="brand">{a.requestedBy}</Badge>
              <RiskBadge risk={a.risk} />
              <Badge tone="warning">{a.policyTriggered}</Badge>
              <span className="text-faint">{formatDate(a.createdAt)}</span>
            </div>
            <div className="rounded-xl bg-brand-soft p-3 text-xs text-brand-deep">
              <span className="font-semibold">AI recommendation: </span>
              {a.aiRecommendation}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button size="sm" loading={busyId === a.id} onClick={() => decide(a.id, "approved")}>
                <CheckCircle2 size={14} /> Approve
              </Button>
              <Button size="sm" variant="outlineDanger" loading={busyId === a.id} onClick={() => decide(a.id, "rejected")}>
                <XCircle size={14} /> Reject
              </Button>
              <Button size="sm" variant="secondary" onClick={() => heyPaypal.open(`Why is this expensive? ${a.title}`)}>
                <MessageCircle size={14} /> Ask PayPal
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {decided.length > 0 && (
        <div className="mt-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">Decided</p>
          <div className="flex flex-col gap-2.5">
            {decided.map((a) => (
              <Card key={a.id} padding="p-4" className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{a.title}</p>
                  <p className="text-xs text-muted">{a.decidedBy ? `${a.status === "approved" ? "Approved" : "Rejected"} by ${a.decidedBy}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <AmountDisplay value={Number(a.amount)} size="sm" />
                  <Badge tone={a.status === "approved" ? "success" : "danger"}>{a.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
