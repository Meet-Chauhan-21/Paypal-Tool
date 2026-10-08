import { listTransactions } from "@/server/data";
import { SectionHeading } from "@/components/ui";
import { TransactionsList } from "@/components/filterable-list";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await listTransactions();

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Transactions"
        title="Transaction command center"
        description="Every payment your agents touch — authorized, captured, or still in motion."
      />
      <TransactionsList
        transactions={transactions.map((t) => ({
          ...t,
          amount: Number(t.amount),
          savings: t.savings ? Number(t.savings) : null,
          createdAt: (t.createdAt as unknown as Date).toISOString(),
          capturedAt: t.capturedAt ? (t.capturedAt as unknown as Date).toISOString() : null,
        })) as any}
      />
    </div>
  );
}
