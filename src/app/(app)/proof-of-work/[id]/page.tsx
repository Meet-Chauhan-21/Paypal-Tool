import { notFound } from "next/navigation";
import { getProofOfWork } from "@/server/data";
import { ProofOfWorkDetail } from "@/components/proof-of-work-detail";

export const dynamic = "force-dynamic";

export default async function ProofOfWorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getProofOfWork(id);
  if (!item) notFound();

  return (
    <ProofOfWorkDetail
      item={{
        ...item,
        amount: Number(item.amount),
        createdAt: (item.createdAt as unknown as Date).toISOString(),
      } as any}
    />
  );
}
