import { getInsights, listSuppliers } from "@/server/data";
import { SectionHeading, StatCard, Card } from "@/components/ui";
import { InsightsCharts } from "@/components/insights-charts";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const [insights, suppliers] = await Promise.all([getInsights(), listSuppliers()]);
  const topSuppliers = suppliers.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Insights" title="Commerce intelligence" description="How your AI agents are spending, saving and negotiating on your behalf." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total spend" value={formatCurrency(insights.totalSpend)} />
        <StatCard label="AI savings" value={formatCurrency(insights.savings)} tone="success" />
        <StatCard label="Transactions" value={insights.transactions} />
        <StatCard label="Negotiated savings" value={formatCurrency(insights.negotiatedSavings)} tone="success" />
        <StatCard label="Auto-processed" value={`${insights.autoProcessedPct}%`} tone="brand" />
        <StatCard label="Approval rate" value={`${insights.approvalRate}%`} />
      </div>

      <InsightsCharts />

      <Card>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Supplier intelligence</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topSuppliers.map((s) => (
            <div key={s.id} className="rounded-xl border border-subtle p-4">
              <p className="text-sm font-semibold text-ink">{s.name}</p>
              <p className="mt-1 text-2xl font-semibold tabular text-brand">{s.score}<span className="text-sm text-faint">/100</span></p>
              <div className="mt-3 flex flex-col gap-1 text-xs text-muted">
                <span>Price competitiveness · {s.priceScore}</span>
                <span>Delivery reliability · {s.deliveryScore}</span>
                <span>Quality · {s.qualityScore}</span>
              </div>
              <p className="mt-2 text-xs text-faint">{s.purchases} purchases · {formatCurrency(Number(s.totalSaved))} saved</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
