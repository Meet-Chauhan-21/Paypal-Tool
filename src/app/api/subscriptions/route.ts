import { listSubscriptions, updateSubscriptionStatus } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const subscriptions = await listSubscriptions();
  return Response.json({ subscriptions });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const subscription = await updateSubscriptionStatus(Number(body.id), body.status);
  return Response.json({ subscription });
}
