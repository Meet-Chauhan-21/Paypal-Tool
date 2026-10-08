import Link from "next/link";
import { listProofOfWork } from "@/server/data";
import { Card, SectionHeading, StatusPill, AmountDisplay } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProofOfWorkPage() {
  const items = await listProofOfWork();
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Proof of Work"
        title="Conditional payment authorization"
        description="Payments stay authorized — not captured — until AI verifies the work meets its agreed requirements."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.id} href={`/proof-of-work/${item.id}`}>
            <Card className="flex h-full flex-col gap-3 transition-colors hover:border-brand">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-muted">{item.counterparty}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
              <AmountDisplay value={Number(item.amount)} size="lg" />
              <div className="mt-auto flex items-center justify-between border-t border-soft pt-3 text-xs text-faint">
                <span>{item.id}</span>
                <span>{formatDate(item.createdAt as unknown as string)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
