import { createProcurementCompletion, listTransactions } from "@/server/data";
import { uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const transactions = await listTransactions();
  return Response.json({ transactions });
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = body.id ?? `PP-${Math.floor(10000 + Math.random() * 89999)}`;
  const transaction = await createProcurementCompletion({
    id,
    merchant: body.merchant,
    amount: body.amount,
    originalAmount: body.originalAmount,
    purpose: body.purpose,
    category: body.category ?? "Electronics",
    deliveryDays: body.deliveryDays,
    warrantyYears: body.warrantyYears,
    savings: body.savings,
    agentId: body.agentId ?? "agent-procurement",
    agentName: body.agentName ?? "Procurement Agent",
    messages: body.messages ?? [],
  });
  return Response.json({ transaction, ref: uid("ref") });
}
