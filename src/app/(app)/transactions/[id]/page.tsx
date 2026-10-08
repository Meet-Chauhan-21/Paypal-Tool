import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { getTransaction } from "@/server/data";
import { Card, SectionHeading, StatusPill, RiskBadge, AmountDisplay, Badge } from "@/components/ui";
import { TransactionTimeline } from "@/components/commerce";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransaction(id);
  if (!transaction) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/transactions" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={14} /> All transactions
      </Link>

      <SectionHeading eyebrow={transaction.id} title={transaction.merchant} description={transaction.purpose} action={<StatusPill status={transaction.status} />} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Summary</p>
          <AmountDisplay value={Number(transaction.amount)} size="xl" tone="brand" />
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <Row label="Agent" value={transaction.agentName} />
            <Row label="Category" value={transaction.category} />
            <Row label="Risk" value={<RiskBadge risk={transaction.risk as any} />} />
            {transaction.deliveryDays && <Row label="Delivery" value={`${transaction.deliveryDays} days`} />}
            {transaction.warrantyYears && <Row label="Warranty" value={`${transaction.warrantyYears} years`} />}
            {Number(transaction.savings) > 0 && <Row label="Savings" value={<span className="font-semibold text-success">${Number(transaction.savings).toLocaleString()}</span>} />}
            <Row label="Created" value={formatDate(transaction.createdAt as unknown as string)} />
            {transaction.capturedAt && <Row label="Captured" value={formatDate(transaction.capturedAt as unknown as string)} />}
          </div>

          <div className="mt-5 rounded-xl bg-brand-soft p-3 text-xs text-brand-deep">
            <p className="mb-1 flex items-center gap-1.5 font-semibold"><Info size={13} /> Why this outcome?</p>
            This supplier met every mandatory requirement, stayed within budget, and had the lowest
            risk score among shortlisted options. Negotiation reduced the final price before approval.
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-wide text-faint">Payment timeline</p>
          <TransactionTimeline
            events={(transaction.events ?? []).map((e) => ({
              label: e.label,
              actor: e.actor,
              note: e.note,
              status: "complete",
              createdAt: e.createdAt as unknown as string,
            }))}
          />
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-ink">Protected through PayPal</p>
          <p className="text-xs text-muted">Orders, authorization, capture and webhooks kept this transaction synchronized end to end.</p>
        </div>
        <Badge tone="success">Trust layer active</Badge>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
