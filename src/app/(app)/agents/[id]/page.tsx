import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { getAgent, listActivity } from "@/server/data";
import { Card, SectionHeading, StatusPill, AmountDisplay, Badge, RiskBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const capabilityMap: Record<string, string[]> = {
  "agent-procurement": [
    "Search suppliers",
    "Compare products",
    "Negotiate prices",
    "Create purchase orders",
    "Request approval",
    "Authorize payments",
    "Track orders",
  ],
  "agent-finance": ["Draft invoices", "Send reminders", "Forecast late payments", "Recommend discounts"],
  "agent-payout": ["Prepare payout batches", "Detect duplicate recipients", "Flag anomalies", "Release payouts"],
  "agent-subscription": ["Monitor recurring charges", "Detect price creep", "Flag unused seats", "Negotiate renewals"],
};

const policyRules: Record<string, { condition: string; action: string }[]> = {
  "agent-procurement": [
    { condition: "Purchase amount > $1,000", action: "Require human approval" },
    { condition: "Merchant is not approved", action: "Require approval" },
    { condition: "Category = Office Equipment AND Amount < $500", action: "Auto-approve" },
  ],
  "agent-finance": [{ condition: "Refund amount > $250", action: "Require human approval" }],
  "agent-payout": [{ condition: "Payout 2x higher than recipient average", action: "Flag for review" }],
  "agent-subscription": [{ condition: "Price increase > 10%", action: "Require human approval" }],
};

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) notFound();

  const activity = (await listActivity(200)).filter((a) => a.actor === agent.name);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Agent" title={agent.name} description={agent.description} action={<StatusPill status={agent.status} />} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-faint">Capabilities</p>
          <ul className="flex flex-col gap-2 text-sm text-ink">
            {(capabilityMap[agent.id] ?? []).map((c) => (
              <li key={c} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-success" /> {c}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-faint">Wallet & allowance</p>
          <div className="flex flex-col gap-3 text-sm">
            <Row label="Daily allowance" value={<AmountDisplay value={Number(agent.dailyAllowance)} size="sm" />} />
            <Row label="Single transaction limit" value={<AmountDisplay value={Number(agent.singleTxnLimit)} size="sm" />} />
            <Row label="Approval threshold" value={<AmountDisplay value={Number(agent.approvalThreshold)} size="sm" />} />
            <Row label="Auto-negotiate up to" value={<span className="font-semibold text-ink">{agent.autoNegotiatePct}%</span>} />
            <Row label="Risk level" value={<RiskBadge risk={agent.riskLevel as any} />} />
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-faint">Categories</p>
          <p className="mb-1.5 text-xs text-faint">Allowed</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(agent.allowedCategories as string[]).map((c) => (
              <Badge key={c} tone="success">{c}</Badge>
            ))}
          </div>
          <p className="mb-1.5 text-xs text-faint">Blocked</p>
          <div className="flex flex-wrap gap-1.5">
            {(agent.blockedCategories as string[]).map((c) => (
              <Badge key={c} tone="danger"><XCircle size={11} /> {c}</Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Spending policy</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(policyRules[agent.id] ?? []).map((r, idx) => (
            <div key={idx} className="rounded-xl border border-subtle bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint">If</p>
              <p className="mt-1 text-sm font-medium text-ink">{r.condition}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-faint">Then</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-brand">
                <AlertCircle size={14} /> {r.action}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Agent activity log</p>
        <div className="flex flex-col divide-y divide-[var(--border-soft)]">
          {activity.length === 0 && <p className="text-sm text-muted">No activity recorded yet.</p>}
          {activity.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-ink">{a.action}</p>
                {a.detail && <p className="text-xs text-muted">{a.detail}</p>}
              </div>
              <p className="shrink-0 text-xs text-faint">{formatDateTime(a.createdAt as unknown as string)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      {value}
    </div>
  );
}
