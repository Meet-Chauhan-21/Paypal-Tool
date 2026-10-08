import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  agentSeed,
  approvalSeed,
  activitySeed,
  pastTransactionSeed,
  payoutSeed,
  proofOfWorkSeed,
  subscriptionSeed,
  supplierSeed,
} from "@/lib/mock-data";
import { negotiationScript } from "@/lib/mock-data";

const globalForSeed = globalThis as typeof globalThis & {
  __procurePilotSeeded?: Promise<void>;
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function minutesAgo(n: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d;
}

async function runSeed() {
  const existing = await db.select().from(schema.agents).limit(1);
  if (existing.length > 0) return;

  await db.insert(schema.agents).values(
    agentSeed.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      description: a.description,
      status: a.status,
      dailyAllowance: a.dailyAllowance,
      singleTxnLimit: a.singleTxnLimit,
      approvalThreshold: a.approvalThreshold,
      autoNegotiatePct: a.autoNegotiatePct,
      allowedCategories: a.allowedCategories,
      blockedCategories: a.blockedCategories,
      processedAmount: a.processedAmount,
      purchasesCount: a.purchasesCount,
      savedAmount: a.savedAmount,
      riskLevel: a.riskLevel,
      lastAction: a.lastAction,
      lastActionAt: minutesAgo(Math.random() * 500),
    })),
  );

  for (const t of pastTransactionSeed) {
    await db.insert(schema.transactions).values({
      id: t.id,
      merchant: t.merchant,
      amount: t.amount,
      agentId: t.agentId,
      agentName: t.agentName,
      purpose: t.purpose,
      category: t.category,
      status: t.status,
      risk: t.risk,
      deliveryDays: t.deliveryDays,
      warrantyYears: t.warrantyYears,
      savings: t.savings,
      createdAt: daysAgo(t.daysAgo),
      capturedAt: t.status === "captured" ? daysAgo(Math.max(0, t.daysAgo - 0.2)) : null,
    });

    await db.insert(schema.transactionEvents).values(
      t.events.map((e, idx) => ({
        transactionId: t.id,
        label: e.label,
        actor: e.actor,
        status: "complete",
        note: e.note,
        orderIndex: idx,
        createdAt: daysAgo(t.daysAgo - idx * 0.02),
      })),
    );
  }

  await db.insert(schema.approvals).values(
    approvalSeed.map((a) => ({
      title: a.title,
      type: a.type,
      amount: a.amount,
      requestedBy: a.requestedBy,
      reason: a.reason,
      aiRecommendation: a.aiRecommendation,
      risk: a.risk,
      policyTriggered: a.policyTriggered,
      status: a.status,
      transactionId: a.transactionId,
      createdAt: daysAgo(a.daysAgo),
      decidedAt: a.status === "pending" ? null : daysAgo(Math.max(0, a.daysAgo - 0.1)),
      decidedBy: a.status === "pending" ? null : a.status === "approved" ? "Parth" : "Parth",
    })),
  );

  await db.insert(schema.activityLog).values(
    activitySeed.map((a) => ({
      actor: a.actor,
      action: a.action,
      detail: a.detail,
      transactionId: a.transactionId,
      createdAt: minutesAgo(a.minutesAgo),
    })),
  );

  await db.insert(schema.suppliers).values(supplierSeed);

  await db.insert(schema.negotiations).values({
    transactionId: "PP-48291",
    supplierName: "Lenovo Business (TechNova)",
    originalTotal: 29100,
    finalTotal: 28200,
    savings: 900,
    status: "completed",
    deliveryDays: 7,
    warrantyYears: 3,
    messages: negotiationScript,
    createdAt: daysAgo(1),
  });

  await db.insert(schema.subscriptions).values(subscriptionSeed);
  await db.insert(schema.payouts).values(payoutSeed);

  await db.insert(schema.proofOfWork).values(
    proofOfWorkSeed.map((p) => ({
      id: p.id,
      title: p.title,
      counterparty: p.counterparty,
      amount: p.amount,
      status: p.status,
      criteria: p.criteria,
      qualityScore: p.qualityScore,
      createdAt: daysAgo(Math.random() * 10 + 1),
    })),
  );
}

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__procurePilotSeeded) {
    globalForSeed.__procurePilotSeeded = runSeed().catch((err) => {
      globalForSeed.__procurePilotSeeded = undefined;
      throw err;
    });
  }
  return globalForSeed.__procurePilotSeeded;
}
