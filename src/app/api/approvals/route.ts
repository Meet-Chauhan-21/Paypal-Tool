import { decideApproval, listApprovals } from "@/server/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const approvals = await listApprovals();
  return Response.json({ approvals });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const approval = await decideApproval(Number(body.id), body.status, body.decidedBy ?? "Parth");
  return Response.json({ approval });
}
