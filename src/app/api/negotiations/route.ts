import { listNegotiations } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const negotiations = await listNegotiations();
  return Response.json({ negotiations });
}
