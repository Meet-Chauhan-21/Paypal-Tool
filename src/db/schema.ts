import {
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  dailyAllowance: numeric("daily_allowance", { mode: "number" }).notNull(),
  singleTxnLimit: numeric("single_txn_limit", { mode: "number" }).notNull(),
  approvalThreshold: numeric("approval_threshold", { mode: "number" }).notNull(),
  autoNegotiatePct: integer("auto_negotiate_pct").notNull().default(10),
  allowedCategories: jsonb("allowed_categories").$type<string[]>().notNull().default([]),
  blockedCategories: jsonb("blocked_categories").$type<string[]>().notNull().default([]),
  processedAmount: numeric("processed_amount", { mode: "number" }).notNull().default(0),
  purchasesCount: integer("purchases_count").notNull().default(0),
  savedAmount: numeric("saved_amount", { mode: "number" }).notNull().default(0),
  riskLevel: text("risk_level").notNull().default("low"),
  lastAction: text("last_action"),
  lastActionAt: timestamp("last_action_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  merchant: text("merchant").notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  agentId: text("agent_id").notNull(),
  agentName: text("agent_name").notNull(),
  purpose: text("purpose").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("pending"),
  risk: text("risk").notNull().default("low"),
  deliveryDays: integer("delivery_days"),
  warrantyYears: integer("warranty_years"),
  savings: numeric("savings", { mode: "number" }).default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  capturedAt: timestamp("captured_at", { withTimezone: true }),
});

export const transactionEvents = pgTable("transaction_events", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  transactionId: text("transaction_id").notNull(),
  label: text("label").notNull(),
  actor: text("actor").notNull(),
  status: text("status").notNull().default("complete"),
  note: text("note"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const approvals = pgTable("approvals", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("purchase"),
  amount: numeric("amount", { mode: "number" }).notNull(),
  requestedBy: text("requested_by").notNull(),
  reason: text("reason").notNull(),
  aiRecommendation: text("ai_recommendation").notNull(),
  risk: text("risk").notNull().default("low"),
  policyTriggered: text("policy_triggered").notNull(),
  status: text("status").notNull().default("pending"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decidedBy: text("decided_by"),
});

export const activityLog = pgTable("activity_log", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  detail: text("detail"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  score: integer("score").notNull(),
  priceScore: integer("price_score").notNull(),
  deliveryScore: integer("delivery_score").notNull(),
  qualityScore: integer("quality_score").notNull(),
  negotiationScore: integer("negotiation_score").notNull(),
  risk: text("risk").notNull().default("low"),
  purchases: integer("purchases").notNull().default(0),
  totalSpent: numeric("total_spent", { mode: "number" }).notNull().default(0),
  totalSaved: numeric("total_saved", { mode: "number" }).notNull().default(0),
});

export const negotiations = pgTable("negotiations", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  transactionId: text("transaction_id"),
  supplierName: text("supplier_name").notNull(),
  originalTotal: numeric("original_total", { mode: "number" }).notNull(),
  finalTotal: numeric("final_total", { mode: "number" }).notNull(),
  savings: numeric("savings", { mode: "number" }).notNull(),
  status: text("status").notNull().default("completed"),
  deliveryDays: integer("delivery_days"),
  warrantyYears: integer("warranty_years"),
  messages: jsonb("messages").$type<{ from: "buyer" | "supplier"; text: string }[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  vendor: text("vendor").notNull(),
  category: text("category").notNull(),
  monthlyAmount: numeric("monthly_amount", { mode: "number" }).notNull(),
  previousAmount: numeric("previous_amount", { mode: "number" }).notNull(),
  seats: integer("seats").notNull().default(1),
  status: text("status").notNull().default("active"),
  note: text("note"),
});

export const payouts = pgTable("payouts", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  batchName: text("batch_name").notNull(),
  recipient: text("recipient").notNull(),
  units: numeric("units", { mode: "number" }).notNull(),
  rate: numeric("rate", { mode: "number" }).notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  risk: text("risk").notNull().default("low"),
  status: text("status").notNull().default("ready"),
  note: text("note"),
});

export const proofOfWork = pgTable("proof_of_work", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  counterparty: text("counterparty").notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  status: text("status").notNull().default("authorized"),
  criteria: jsonb("criteria").$type<{ label: string; passed: boolean | null }[]>().notNull().default([]),
  qualityScore: integer("quality_score"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
