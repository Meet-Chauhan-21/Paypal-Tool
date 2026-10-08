import { db } from "@/db";
import * as schema from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { desc, eq } from "drizzle-orm";

export async function listAgents() {
  await ensureSeeded();
  const rows = await db.select().from(schema.agents).orderBy(schema.agents.name);
  return rows;
}

export async function getAgent(id: string) {
  await ensureSeeded();
  const [row] = await db.select().from(schema.agents).where(eq(schema.agents.id, id));
  return row ?? null;
}

export async function listTransactions() {
  await ensureSeeded();
  return db.select().from(schema.transactions).orderBy(desc(schema.transactions.createdAt));
}

export async function getTransaction(id: string) {
  await ensureSeeded();
  const [row] = await db.select().from(schema.transactions).where(eq(schema.transactions.id, id));
  if (!row) return null;
  const events = await db
    .select()
    .from(schema.transactionEvents)
    .where(eq(schema.transactionEvents.transactionId, id))
    .orderBy(schema.transactionEvents.orderIndex);
  return { ...row, events };
}

export async function listApprovals() {
  await ensureSeeded();
  return db.select().from(schema.approvals).orderBy(desc(schema.approvals.createdAt));
}

export async function decideApproval(id: number, status: "approved" | "rejected", decidedBy = "Parth") {
  await ensureSeeded();
  const [row] = await db
    .update(schema.approvals)
    .set({ status, decidedAt: new Date(), decidedBy })
    .where(eq(schema.approvals.id, id))
    .returning();
  if (row) {
    await db.insert(schema.activityLog).values({
      actor: decidedBy,
      action: status === "approved" ? "Approved request" : "Rejected request",
      detail: row.title,
      transactionId: row.transactionId,
    });
  }
  return row ?? null;
}

export async function listActivity(limit = 60) {
  await ensureSeeded();
  return db.select().from(schema.activityLog).orderBy(desc(schema.activityLog.createdAt)).limit(limit);
}

export async function addActivity(entry: { actor: string; action: string; detail?: string | null; transactionId?: string | null }) {
  await ensureSeeded();
  await db.insert(schema.activityLog).values({
    actor: entry.actor,
    action: entry.action,
    detail: entry.detail ?? null,
    transactionId: entry.transactionId ?? null,
  });
}

export async function listSuppliers() {
  await ensureSeeded();
  return db.select().from(schema.suppliers).orderBy(desc(schema.suppliers.score));
}

export async function listNegotiations() {
  await ensureSeeded();
  return db.select().from(schema.negotiations).orderBy(desc(schema.negotiations.createdAt));
}

export async function listSubscriptions() {
  await ensureSeeded();
  return db.select().from(schema.subscriptions).orderBy(schema.subscriptions.name);
}

export async function updateSubscriptionStatus(id: number, status: string) {
  await ensureSeeded();
  const [row] = await db
    .update(schema.subscriptions)
    .set({ status })
    .where(eq(schema.subscriptions.id, id))
    .returning();
  return row ?? null;
}

export async function listPayouts() {
  await ensureSeeded();
  return db.select().from(schema.payouts).orderBy(schema.payouts.recipient);
}

export async function updatePayoutStatus(id: number, status: string) {
  await ensureSeeded();
  const [row] = await db.update(schema.payouts).set({ status }).where(eq(schema.payouts.id, id)).returning();
  return row ?? null;
}

export async function listProofOfWork() {
  await ensureSeeded();
  return db.select().from(schema.proofOfWork).orderBy(desc(schema.proofOfWork.createdAt));
}

export async function getProofOfWork(id: string) {
  await ensureSeeded();
  const [row] = await db.select().from(schema.proofOfWork).where(eq(schema.proofOfWork.id, id));
  return row ?? null;
}

export async function updateProofOfWork(
  id: string,
  patch: Partial<{ status: string; qualityScore: number | null; criteria: { label: string; passed: boolean | null }[] }>,
) {
  await ensureSeeded();
  const [row] = await db.update(schema.proofOfWork).set(patch).where(eq(schema.proofOfWork.id, id)).returning();
  return row ?? null;
}

export async function getInsights() {
  await ensureSeeded();
  const txns = await db.select().from(schema.transactions);
  const agents = await db.select().from(schema.agents);
  const totalSpend = txns.reduce((sum, t) => sum + Number(t.amount), 0);
  const savings = txns.reduce((sum, t) => sum + Number(t.savings ?? 0), 0);
  const captured = txns.filter((t) => t.status === "captured").length;
  const approvalsRows = await db.select().from(schema.approvals);
  const decided = approvalsRows.filter((a) => a.status !== "pending");
  const approvalRate = decided.length
    ? Math.round((decided.filter((a) => a.status === "approved").length / decided.length) * 100)
    : 100;
  return {
    totalSpend,
    savings,
    transactions: txns.length,
    negotiatedSavings: savings,
    autoProcessedPct: txns.length ? Math.round((captured / txns.length) * 100) : 0,
    approvalRate,
    agentsActive: agents.filter((a) => a.status === "active").length,
  };
}

export async function createProcurementCompletion(payload: {
  id: string;
  merchant: string;
  amount: number;
  originalAmount: number;
  purpose: string;
  category: string;
  deliveryDays: number;
  warrantyYears: number;
  savings: number;
  agentId: string;
  agentName: string;
  messages: { from: "buyer" | "supplier"; text: string }[];
}) {
  await ensureSeeded();

  await db.insert(schema.transactions).values({
    id: payload.id,
    merchant: payload.merchant,
    amount: payload.amount,
    agentId: payload.agentId,
    agentName: payload.agentName,
    purpose: payload.purpose,
    category: payload.category,
    status: "captured",
    risk: "low",
    deliveryDays: payload.deliveryDays,
    warrantyYears: payload.warrantyYears,
    savings: payload.savings,
    capturedAt: new Date(),
  });

  const steps: { label: string; actor: string; note: string }[] = [
    { label: "Request created", actor: "Parth", note: payload.purpose },
    { label: "AI researched", actor: payload.agentName, note: "12 suppliers checked, 3 shortlisted" },
    { label: "Supplier selected", actor: payload.agentName, note: `${payload.merchant} — best balance of cost, delivery and warranty` },
    { label: "Negotiation completed", actor: payload.agentName, note: `Price reduced from $${payload.originalAmount.toLocaleString()} to $${payload.amount.toLocaleString()}` },
    { label: "Approval granted", actor: "Parth", note: "Approved — above autonomous spending limit" },
    { label: "Payment authorized", actor: "PayPal", note: `Authorization ${payload.id}-A for $${payload.amount.toLocaleString()}` },
    { label: "Order confirmed", actor: payload.merchant, note: "Purchase order confirmed" },
    { label: "Shipment received", actor: payload.agentName, note: "Units received and matched to purchase order" },
    { label: "Verification passed", actor: payload.agentName, note: "AI verification quality score 96%" },
    { label: "Payment captured", actor: "PayPal", note: `$${payload.amount.toLocaleString()} captured` },
  ];

  await db.insert(schema.transactionEvents).values(
    steps.map((s, idx) => ({
      transactionId: payload.id,
      label: s.label,
      actor: s.actor,
      status: "complete",
      note: s.note,
      orderIndex: idx,
    })),
  );

  await db.insert(schema.approvals).values({
    title: `Purchase: ${payload.purpose}`,
    type: "purchase",
    amount: payload.amount,
    requestedBy: payload.agentName,
    reason: `This option meets every requirement and is $${(payload.originalAmount - payload.amount).toLocaleString()} below the original quote.`,
    aiRecommendation: "Approve — best price, delivery and warranty match found.",
    risk: "low",
    policyTriggered: "Exceeds autonomous spending limit",
    status: "approved",
    transactionId: payload.id,
    decidedAt: new Date(),
    decidedBy: "Parth",
  });

  await db.insert(schema.negotiations).values({
    transactionId: payload.id,
    supplierName: payload.merchant,
    originalTotal: payload.originalAmount,
    finalTotal: payload.amount,
    savings: payload.savings,
    status: "completed",
    deliveryDays: payload.deliveryDays,
    warrantyYears: payload.warrantyYears,
    messages: payload.messages,
  });

  await db.insert(schema.activityLog).values(
    steps.map((s) => ({
      actor: s.actor,
      action: s.label,
      detail: s.note,
      transactionId: payload.id,
    })),
  );

  const agent = await getAgent(payload.agentId);
  if (agent) {
    await db
      .update(schema.agents)
      .set({
        processedAmount: Number(agent.processedAmount) + payload.amount,
        purchasesCount: agent.purchasesCount + 1,
        savedAmount: Number(agent.savedAmount) + payload.savings,
        lastAction: `Completed purchase of ${payload.purpose} for $${payload.amount.toLocaleString()}`,
        lastActionAt: new Date(),
      })
      .where(eq(schema.agents.id, payload.agentId));
  }

  return getTransaction(payload.id);
}
