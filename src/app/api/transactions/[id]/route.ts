import { getTransaction } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransaction(id);
  if (!transaction) return Response.json({ error: "Transaction not found" }, { status: 404 });
  return Response.json({ transaction });
}
