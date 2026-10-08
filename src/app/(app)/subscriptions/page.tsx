import { listSubscriptions } from "@/server/data";
import { SectionHeading, StatCard } from "@/components/ui";
import { SubscriptionsBoard } from "@/components/subscriptions-board";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const subscriptions = await listSubscriptions();
  const monthlySpend = subscriptions.reduce((sum, s) => sum + Number(s.monthlyAmount), 0);
  const priceIncreases = subscriptions.filter((s) => Number(s.monthlyAmount) > Number(s.previousAmount)).length;
  const unused = subscriptions.filter((s) => s.status === "unused" || s.status === "underused").length;
  const potentialSavings = subscriptions.reduce((sum, s) => {
    const diff = Number(s.monthlyAmount) - Number(s.previousAmount);
    const wasteBonus = s.status === "unused" ? Number(s.monthlyAmount) : s.status === "underused" ? Number(s.monthlyAmount) * 0.4 : 0;
    return sum + Math.max(diff, 0) + wasteBonus;
  }, 0);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Subscription Bodyguard"
        title="Subscription Bodyguard"
        description="AI continuously watches your recurring payments for price creep, unused seats and renewal risk."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active subscriptions" value={subscriptions.length} />
        <StatCard label="Monthly spend" value={formatCurrency(monthlySpend)} />
        <StatCard label="Price increases" value={priceIncreases} tone="warning" />
        <StatCard label="Potential savings" value={`${formatCurrency(potentialSavings * 12)}/yr`} tone="success" />
      </div>
      <SubscriptionsBoard
        subscriptions={subscriptions.map((s) => ({
          ...s,
          monthlyAmount: Number(s.monthlyAmount),
          previousAmount: Number(s.previousAmount),
        })) as any}
      />
    </div>
  );
}
