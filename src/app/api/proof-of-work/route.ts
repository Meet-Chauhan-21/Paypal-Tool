import { listProofOfWork } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await listProofOfWork();
  return Response.json({ items });
}
