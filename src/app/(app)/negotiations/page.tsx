import { listNegotiations } from "@/server/data";
import { SectionHeading } from "@/components/ui";
import { NegotiationsList } from "@/components/negotiations-list";

export const dynamic = "force-dynamic";

export default async function NegotiationsPage() {
  const negotiations = await listNegotiations();
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Negotiations"
        title="AI negotiation sessions"
        description="Your buyer agent negotiating directly with merchant agents — every exchange is recorded."
      />
      <NegotiationsList
        negotiations={negotiations.map((n) => ({
          ...n,
          originalTotal: Number(n.originalTotal),
          finalTotal: Number(n.finalTotal),
          savings: Number(n.savings),
          createdAt: (n.createdAt as unknown as Date).toISOString(),
        })) as any}
      />
    </div>
  );
}
