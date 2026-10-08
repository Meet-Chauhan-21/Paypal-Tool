import { getInsights } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const insights = await getInsights();
  return Response.json({ insights });
}
