import { listPayouts, updatePayoutStatus } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const payouts = await listPayouts();
  return Response.json({ payouts });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const payout = await updatePayoutStatus(Number(body.id), body.status);
  return Response.json({ payout });
}
