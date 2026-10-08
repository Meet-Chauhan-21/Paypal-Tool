import { getAgent } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) return Response.json({ error: "Agent not found" }, { status: 404 });
  return Response.json({ agent });
}
