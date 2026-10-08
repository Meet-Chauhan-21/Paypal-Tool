import { listApprovals } from "@/server/data";
import { SectionHeading } from "@/components/ui";
import { ApprovalsBoard } from "@/components/approvals-board";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const approvals = await listApprovals();
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Approvals"
        title="Approval queue"
        description="Every high-impact action your agents propose, with the context you need to decide quickly."
      />
      <ApprovalsBoard
        approvals={approvals.map((a) => ({
          ...a,
          amount: Number(a.amount),
          createdAt: (a.createdAt as unknown as Date).toISOString(),
          decidedAt: a.decidedAt ? (a.decidedAt as unknown as Date).toISOString() : null,
        })) as any}
      />
    </div>
  );
}
