import { addActivity, listActivity } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const activity = await listActivity();
  return Response.json({ activity });
}

export async function POST(req: Request) {
  const body = await req.json();
  await addActivity(body);
  return Response.json({ ok: true });
}
