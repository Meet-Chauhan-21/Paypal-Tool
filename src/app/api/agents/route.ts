import { listAgents } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const agents = await listAgents();
  return Response.json({ agents });
}
