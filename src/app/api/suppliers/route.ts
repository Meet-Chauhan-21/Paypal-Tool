import { listSuppliers } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const suppliers = await listSuppliers();
  return Response.json({ suppliers });
}
