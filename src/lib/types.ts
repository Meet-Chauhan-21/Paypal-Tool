export type RiskLevel = "low" | "medium" | "high";

export type TransactionStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "disputed"
  | "refunded";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: "active" | "attention" | "paused";
  dailyAllowance: number;
  singleTxnLimit: number;
  approvalThreshold: number;
  autoNegotiatePct: number;
  allowedCategories: string[];
  blockedCategories: string[];
  processedAmount: number;
  purchasesCount: number;
  savedAmount: number;
  riskLevel: RiskLevel;
  lastAction: string | null;
  lastActionAt: string | null;
}

export interface TransactionEvent {
  id: number;
  label: string;
  actor: string;
  status: string;
  note: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  agentId: string;
  agentName: string;
  purpose: string;
  category: string;
  status: TransactionStatus;
  risk: RiskLevel;
  deliveryDays: number | null;
  warrantyYears: number | null;
  savings: number | null;
  createdAt: string;
  capturedAt: string | null;
  events?: TransactionEvent[];
}

export interface Approval {
  id: number;
  title: string;
  type: "purchase" | "payment" | "payout" | "refund" | "policy_exception";
  amount: number;
  requestedBy: string;
  reason: string;
  aiRecommendation: string;
  risk: RiskLevel;
  policyTriggered: string;
  status: ApprovalStatus;
  transactionId: string | null;
  createdAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  score: number;
  priceScore: number;
  deliveryScore: number;
  qualityScore: number;
  negotiationScore: number;
  risk: RiskLevel;
  purchases: number;
  totalSpent: number;
  totalSaved: number;
}

export interface NegotiationMessage {
  from: "buyer" | "supplier";
  text: string;
}

export interface Negotiation {
  id: number;
  transactionId: string | null;
  supplierName: string;
  originalTotal: number;
  finalTotal: number;
  savings: number;
  status: string;
  deliveryDays: number | null;
  warrantyYears: number | null;
  messages: NegotiationMessage[];
  createdAt: string;
}

export interface SubscriptionItem {
  id: number;
  name: string;
  vendor: string;
  category: string;
  monthlyAmount: number;
  previousAmount: number;
  seats: number;
  status: string;
  note: string | null;
}

export interface PayoutItem {
  id: number;
  batchName: string;
  recipient: string;
  units: number;
  rate: number;
  amount: number;
  risk: RiskLevel;
  status: string;
  note: string | null;
}

export interface ProofOfWorkCriterion {
  label: string;
  passed: boolean | null;
}

export interface ProofOfWork {
  id: string;
  title: string;
  counterparty: string;
  amount: number;
  status: "authorized" | "verifying" | "verified" | "captured" | "failed" | "disputed";
  criteria: ProofOfWorkCriterion[];
  qualityScore: number | null;
  createdAt: string;
}

export interface ActivityItem {
  id: number;
  actor: string;
  action: string;
  detail: string | null;
  transactionId: string | null;
  createdAt: string;
}
