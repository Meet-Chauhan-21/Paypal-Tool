"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mic,
  Pencil,
  Plus,
  ShieldAlert,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Orb } from "@/components/orb";
import { Button, Card, Badge, AmountDisplay, ProgressBar } from "@/components/ui";
import {
  ComparisonTable,
  NegotiationThread,
  SupplierCard,
  TransactionTimeline,
  VerificationChecklist,
  type SupplierOption,
} from "@/components/commerce";
import { parseProcurementRequest, type ParsedRequirement } from "@/lib/intent";
import { laptopSuppliers, negotiationScript } from "@/lib/mock-data";
import { cn, formatCurrency, sleep } from "@/lib/utils";
import { useHeyPayPal } from "@/components/hey-paypal";

type Step =
  | "input"
  | "extracting"
  | "requirements"
  | "researching"
  | "comparison"
  | "negotiating"
  | "negotiated"
  | "policy"
  | "approval"
  | "authorizing"
  | "tracking"
  | "verifying"
  | "success";

const researchPhases = [
  "Searching matching suppliers",
  "Comparing total cost",
  "Checking delivery commitments",
  "Validating warranty terms",
  "Preparing recommendation",
];

const authorizeNodes = ["AI Agent", "Policy Engine", "Payment Authorization", "PayPal", "Merchant", "Confirmation"];

const trackingEvents = [
  { label: "Payment authorized", actor: "PayPal" },
  { label: "Order confirmed", actor: "TechNova" },
  { label: "Shipment created", actor: "TechNova" },
  { label: "Shipment in transit", actor: "Carrier" },
  { label: "Delivered", actor: "Carrier" },
  { label: "AI verification started", actor: "Procurement Agent" },
];

const stepOrder: { key: Step; label: string }[] = [
  { key: "requirements", label: "Request" },
  { key: "comparison", label: "Research" },
  { key: "negotiated", label: "Negotiate" },
  { key: "approval", label: "Approve" },
  { key: "authorizing", label: "Pay" },
  { key: "tracking", label: "Track" },
  { key: "verifying", label: "Verify" },
  { key: "success", label: "Done" },
];

function buildSuppliers(quantity: number, finalUnitPrice?: Record<string, number>): SupplierOption[] {
  return laptopSuppliers.map((s, idx) => ({
    name: s.name,
    product: s.product,
    unitPrice: finalUnitPrice?.[s.name] ?? s.unitPrice,
    units: quantity,
    deliveryDays: s.deliveryDays,
    warrantyYears: s.warrantyYears,
    rating: s.rating,
    score: s.score,
    risk: s.risk,
    recommended: idx === 0,
  }));
}

export function ProcureFlow({ initialQuery, autorun }: { initialQuery: string; autorun: boolean }) {
  const router = useRouter();
  const heyPaypal = useHeyPayPal();
  const [step, setStep] = useState<Step>("input");
  const [inputText, setInputText] = useState(initialQuery);
  const [requirement, setRequirement] = useState<ParsedRequirement | null>(null);
  const [extraNote, setExtraNote] = useState("");
  const [extraRequirements, setExtraRequirements] = useState<string[]>([]);
  const [researchIdx, setResearchIdx] = useState(-1);
  const [revealedMessages, setRevealedMessages] = useState(0);
  const [trackIdx, setTrackIdx] = useState(-1);
  const [authIdx, setAuthIdx] = useState(-1);
  const [verifyChecks, setVerifyChecks] = useState<number>(-1);
  const [rejectMode, setRejectMode] = useState(false);
  const [result, setResult] = useState<{ id: string; amount: number; original: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (autorun && initialQuery && !startedRef.current) {
      startedRef.current = true;
      void startFlow(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startFlow(text: string) {
    setInputText(text);
    setStep("extracting");
    await sleep(700);
    setRequirement(parseProcurementRequest(text));
    setStep("requirements");
  }

  async function runResearch() {
    setStep("researching");
    setResearchIdx(-1);
    for (let i = 0; i < researchPhases.length; i++) {
      await sleep(360);
      setResearchIdx(i);
    }
    await sleep(400);
    setStep("comparison");
  }

  async function runNegotiation() {
    setStep("negotiating");
    setRevealedMessages(0);
    for (let i = 0; i < negotiationScript.length; i++) {
      await sleep(620);
      setRevealedMessages(i + 1);
    }
    await sleep(500);
    setStep("negotiated");
  }

  async function runPolicyCheck() {
    setStep("policy");
    await sleep(900);
    setStep("approval");
  }

  async function runAuthorization() {
    setStep("authorizing");
    setAuthIdx(-1);
    for (let i = 0; i < authorizeNodes.length; i++) {
      await sleep(320);
      setAuthIdx(i);
    }
    await sleep(500);
    setStep("tracking");
    setTrackIdx(-1);
    for (let i = 0; i < trackingEvents.length; i++) {
      await sleep(280);
      setTrackIdx(i);
    }
    await sleep(400);
    setStep("verifying");
    setVerifyChecks(-1);
    const checks = 6;
    for (let i = 0; i < checks; i++) {
      await sleep(260);
      setVerifyChecks(i);
    }
  }

  async function capturePayment() {
    if (!requirement) return;
    setSubmitting(true);
    const quantity = requirement.quantity;
    const originalTotal = 970 * quantity;
    const finalTotal = 940 * quantity;
    const savings = originalTotal - finalTotal;
    try {
      // Create and capture order through PayPal Sandbox API
      try {
        const ppRes = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalTotal,
            referenceId: `PP-${Math.floor(10000 + Math.random() * 89999)}`,
            description: `${quantity} business laptops — ${requirement.purpose.toLowerCase()}`,
            intent: "CAPTURE",
          }),
        });
        const ppOrder = await ppRes.json();
        if (ppOrder.id) {
          await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: ppOrder.id, action: "capture" }),
          });
        }
      } catch (ppErr) {
        console.warn("PayPal sandbox processing notice:", ppErr);
      }

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: "Lenovo Business (TechNova)",
          amount: finalTotal,
          originalAmount: originalTotal,
          purpose: `${quantity} business laptops — ${requirement.purpose.toLowerCase()}`,
          category: "Electronics",
          deliveryDays: requirement.deliveryDays < 7 ? requirement.deliveryDays : 7,
          warrantyYears: requirement.warrantyYears,
          savings,
          agentId: "agent-procurement",
          agentName: "Procurement Agent",
          messages: negotiationScript,
        }),
      });
      const data = await res.json();
      setResult({ id: data.transaction?.id ?? "PP-00000", amount: finalTotal, original: originalTotal });
      setStep("success");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep("input");
    setInputText("");
    setRequirement(null);
    setExtraRequirements([]);
    setResult(null);
    startedRef.current = false;
  }

  const quantity = requirement?.quantity ?? 30;
  const suppliers = buildSuppliers(quantity);
  const originalTotal = 970 * quantity;
  const finalTotal = 940 * quantity;
  const savings = originalTotal - finalTotal;
  const overBudget = requirement ? finalTotal > requirement.budget : false;

  const currentStepIdx = stepOrder.findIndex((s) => s.key === step);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {step !== "input" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {stepOrder.map((s, idx) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium",
                  idx <= currentStepIdx || (idx === 0 && currentStepIdx === -1)
                    ? "bg-brand-soft text-brand"
                    : "bg-surface-2 text-faint",
                )}
              >
                {s.label}
              </span>
              {idx < stepOrder.length - 1 && <span className="h-px w-3 bg-border" />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div key="input" {...fade}>
            <Card className="flex flex-col items-center py-12 text-center">
              <Orb size="lg" state="idle" />
              <h1 className="mt-5 text-2xl font-semibold text-ink">Start a procurement request</h1>
              <p className="mt-1.5 max-w-md text-sm text-muted">
                Tell me what you need — quantity, budget, delivery timeline and any requirements.
              </p>
              <form
                className="mt-6 flex w-full max-w-lg items-center gap-2 rounded-full border border-subtle bg-surface-2 p-1.5 pl-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputText.trim()) void startFlow(inputText);
                }}
              >
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Buy 30 business laptops under $30,000…"
                  className="h-10 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
                />
                <button type="button" onClick={() => heyPaypal.open()} className="flex h-9 w-9 items-center justify-center rounded-full text-brand hover:bg-brand-soft">
                  <Mic size={16} />
                </button>
                <button type="submit" className="flex h-9 items-center gap-1 rounded-full bg-brand px-4 text-sm font-medium text-white">
                  Go <ArrowRight size={14} />
                </button>
              </form>
              <button
                onClick={() => void startFlow("Buy 30 business laptops under $30,000, delivered within 10 days, with at least a 3-year warranty.")}
                className="mt-4 text-xs font-medium text-brand hover:underline"
              >
                Try the example request
              </button>
            </Card>
          </motion.div>
        )}

        {step === "extracting" && (
          <motion.div key="extracting" {...fade}>
            <Card className="flex flex-col items-center py-14 text-center">
              <Orb size="lg" state="understanding" />
              <p className="mt-5 text-lg font-semibold text-ink">Understanding your request…</p>
              <p className="mt-1 max-w-sm text-sm text-muted">“{inputText}”</p>
            </Card>
          </motion.div>
        )}

        {step === "requirements" && requirement && (
          <motion.div key="requirements" {...fade}>
            <Card>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles size={16} className="text-brand" />
                <p className="text-[15px] font-semibold text-ink">I understood your request</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="Quantity">
                  <NumberInput value={requirement.quantity} onChange={(v) => setRequirement({ ...requirement, quantity: v })} suffix="units" />
                </Field>
                <Field label="Product">
                  <TextInput value={requirement.product} onChange={(v) => setRequirement({ ...requirement, product: v })} />
                </Field>
                <Field label="Budget (max)">
                  <NumberInput value={requirement.budget} onChange={(v) => setRequirement({ ...requirement, budget: v })} prefix="$" />
                </Field>
                <Field label="Delivery deadline">
                  <NumberInput value={requirement.deliveryDays} onChange={(v) => setRequirement({ ...requirement, deliveryDays: v })} suffix="days" />
                </Field>
                <Field label="Warranty (min)">
                  <NumberInput value={requirement.warrantyYears} onChange={(v) => setRequirement({ ...requirement, warrantyYears: v })} suffix="years" />
                </Field>
                <Field label="Business purpose">
                  <TextInput value={requirement.purpose} onChange={(v) => setRequirement({ ...requirement, purpose: v })} />
                </Field>
              </div>

              {extraRequirements.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {extraRequirements.map((r, idx) => (
                    <Badge key={idx} tone="brand">{r}</Badge>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <input
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                  placeholder="Add a requirement (e.g. backlit keyboard)"
                  className="h-9 flex-1 rounded-full border border-subtle bg-surface-2 px-3.5 text-sm text-ink placeholder:text-faint focus:outline-none"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    if (extraNote.trim()) {
                      setExtraRequirements((r) => [...r, extraNote.trim()]);
                      setExtraNote("");
                    }
                  }}
                >
                  <Plus size={14} /> Add
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={() => void runResearch()}>Continue</Button>
                <Button variant="secondary" onClick={reset}>Start over</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "researching" && (
          <motion.div key="researching" {...fade}>
            <Card className="py-10">
              <div className="mb-6 flex flex-col items-center text-center">
                <Orb size="md" state="thinking" />
                <p className="mt-4 text-lg font-semibold text-ink">Finding the best purchase</p>
              </div>
              <div className="mx-auto flex max-w-sm flex-col gap-3">
                {researchPhases.map((p, idx) => (
                  <div key={p} className="flex items-center gap-3 text-sm">
                    {idx <= researchIdx ? (
                      <CheckCircle2 size={16} className="text-success" />
                    ) : (
                      <Loader2 size={16} className="animate-spin text-faint" />
                    )}
                    <span className={idx <= researchIdx ? "text-ink" : "text-muted"}>{p}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {step === "comparison" && (
          <motion.div key="comparison" {...fade} className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Finding the best purchase</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">12 suppliers checked · 3 shortlisted</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {suppliers.map((s) => (
                <SupplierCard key={s.name} option={s} />
              ))}
            </div>
            <ComparisonTable options={suppliers} />
            <Card className="flex flex-col gap-3 border-brand/40 bg-brand-soft/40 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-deep">Recommended: {suppliers[0].name}</p>
                <p className="mt-1 text-sm text-muted">
                  Best balance between total cost, delivery time and warranty coverage — {formatCurrency(suppliers[0].unitPrice * quantity)} total, {suppliers[0].deliveryDays}-day delivery, {suppliers[0].warrantyYears}-year warranty.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => void runPolicyCheck()}>Buy at list price</Button>
                <Button onClick={() => void runNegotiation()}>Negotiate first</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "negotiating" && (
          <motion.div key="negotiating" {...fade}>
            <Card>
              <div className="mb-6 flex items-center justify-between gap-4">
                <AgentBadge label="Your AI Agent" tone="brand" />
                <p className="text-xs font-semibold uppercase tracking-wide text-faint">Negotiating…</p>
                <AgentBadge label="Merchant Agent" tone="neutral" />
              </div>
              <NegotiationThread messages={negotiationScript.slice(0, revealedMessages)} animated />
              {revealedMessages < negotiationScript.length && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <Loader2 size={13} className="animate-spin" /> Exchanging offers…
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {step === "negotiated" && !overBudget && (
          <motion.div key="negotiated" {...fade}>
            <Card className="flex flex-col gap-5">
              <Badge tone="success" className="w-fit">
                <CheckCircle2 size={13} /> AI negotiated successfully
              </Badge>
              <div>
                <p className="text-lg font-semibold text-ink">Negotiated deal</p>
                <p className="text-sm text-muted">{suppliers[0].name} · {suppliers[0].product}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat label="Original" value={formatCurrency(originalTotal)} />
                <Stat label="Final" value={formatCurrency(finalTotal)} tone="brand" />
                <Stat label="Savings" value={formatCurrency(savings)} tone="success" />
                <Stat label="Delivery" value="7 days" />
              </div>
              <p className="text-xs text-muted">Warranty: 3 years · Shipping: included</p>
              <div className="flex gap-3">
                <Button onClick={() => void runPolicyCheck()}>Accept Deal</Button>
                <Button variant="secondary" onClick={() => setStep("comparison")}>Back to comparison</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "negotiated" && overBudget && (
          <motion.div key="negotiated-risk" {...fade}>
            <Card className="flex flex-col gap-4 border-warning/40 bg-warning-soft/60">
              <div className="flex items-center gap-2 text-warning">
                <ShieldAlert size={18} />
                <p className="text-lg font-semibold">I found a problem</p>
              </div>
              <p className="text-sm text-ink">
                The negotiated total of {formatCurrency(finalTotal)} is above your {formatCurrency(requirement!.budget)} budget.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep("comparison")}>Find another option</Button>
                <Button onClick={() => void runPolicyCheck()}>Continue anyway</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "policy" && (
          <motion.div key="policy" {...fade}>
            <Card className="flex flex-col items-center py-14 text-center">
              <Orb size="md" state="thinking" />
              <p className="mt-4 text-lg font-semibold text-ink">Checking your spending policy…</p>
            </Card>
          </motion.div>
        )}

        {step === "approval" && !rejectMode && (
          <motion.div key="approval" {...fade}>
            <Card className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <Orb size="md" state="approval" />
                <p className="mt-4 text-xl font-semibold text-ink">I need your approval</p>
                <p className="mt-1 text-sm text-muted">
                  This purchase is above your $1,000 automatic approval limit.
                </p>
              </div>
              <div className="rounded-2xl border border-subtle bg-surface-2 p-4">
                <p className="text-sm font-medium text-ink">Procurement Agent wants to purchase:</p>
                <p className="mt-1 text-sm text-muted">{quantity} × {suppliers[0].product}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <AmountDisplay value={finalTotal} size="xl" tone="brand" />
                  <span className="text-xs text-success">saved {formatCurrency(savings)}</span>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Policy: requires approval because the transaction exceeds your $1,000 autonomous spending limit.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => void runAuthorization()}>Approve Purchase</Button>
                <Button variant="outlineDanger" onClick={() => setRejectMode(true)}>Reject</Button>
                <Button variant="secondary" onClick={() => setStep("comparison")}>Ask Agent to Find Another Option</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "approval" && rejectMode && (
          <motion.div key="reject" {...fade}>
            <Card className="flex flex-col gap-4">
              <p className="text-lg font-semibold text-ink">What should I change?</p>
              <textarea
                className="h-24 rounded-xl border border-subtle bg-surface-2 p-3 text-sm text-ink placeholder:text-faint focus:outline-none"
                placeholder="e.g. Try to stay under $25,000 total"
              />
              <div className="flex gap-3">
                <Button onClick={() => { setRejectMode(false); setStep("comparison"); }}>Find a new option</Button>
                <Button variant="secondary" onClick={() => setRejectMode(false)}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "authorizing" && (
          <motion.div key="authorizing" {...fade}>
            <Card className="flex flex-col items-center gap-6 py-10 text-center">
              <p className="text-lg font-semibold text-ink">Securely processing with PayPal</p>
              <div className="flex w-full flex-wrap items-center justify-center gap-2">
                {authorizeNodes.map((n, idx) => (
                  <div key={n} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        idx <= authIdx ? "border-brand bg-brand-soft text-brand" : "border-subtle text-faint",
                      )}
                    >
                      {n}
                    </span>
                    {idx < authorizeNodes.length - 1 && (
                      <span className={cn("h-px w-5", idx < authIdx ? "bg-brand" : "bg-border")} />
                    )}
                  </div>
                ))}
              </div>
              <Wallet size={28} className="text-brand" />
              <p className="text-sm text-muted">Authorizing {formatCurrency(finalTotal)} for {suppliers[0].name}…</p>
            </Card>
          </motion.div>
        )}

        {step === "tracking" && (
          <motion.div key="tracking" {...fade}>
            <Card>
              <p className="mb-5 text-lg font-semibold text-ink">Payment authorized · Order confirmed</p>
              <TransactionTimeline
                events={trackingEvents.slice(0, trackIdx + 1).map((e) => ({ ...e, status: "complete" }))}
              />
              <p className="mt-4 text-xs text-muted">Simulating fulfillment for this demo.</p>
            </Card>
          </motion.div>
        )}

        {step === "verifying" && (
          <motion.div key="verifying" {...fade}>
            <Card className="flex flex-col gap-5">
              <p className="text-lg font-semibold text-ink">Verifying delivery…</p>
              <VerificationChecklist
                items={[
                  { label: "Requirements matched", passed: null },
                  { label: "Correct item count received", passed: null },
                  { label: "Condition verified", passed: null },
                  { label: "Warranty registered", passed: null },
                  { label: "Invoice matches order", passed: null },
                  { label: "Delivery confirmed by recipient", passed: null },
                ].map((item, idx) => ({ ...item, passed: idx <= verifyChecks ? true : null }))}
              />
              {verifyChecks >= 5 && (
                <div className="flex flex-col gap-4 border-t border-soft pt-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-ink">AI quality score</p>
                    <span className="text-lg font-semibold text-success">96%</span>
                  </div>
                  <p className="text-xl font-semibold text-ink">Work verified</p>
                  <Button loading={submitting} onClick={() => void capturePayment()} className="w-fit">
                    Release Payment — {formatCurrency(finalTotal)}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {step === "success" && result && (
          <motion.div key="success" {...fade}>
            <Card className="flex flex-col items-center gap-6 py-12 text-center">
              <Orb size="lg" state="success" />
              <div>
                <h2 className="text-3xl font-semibold text-ink">Done.</h2>
                <p className="mt-1 text-sm text-muted">Your AI agent completed the purchase.</p>
              </div>
              <div className="grid w-full max-w-md grid-cols-2 gap-3 text-left">
                <Stat label={`${quantity} laptops`} value={formatCurrency(result.amount)} tone="brand" />
                <Stat label="Saved through negotiation" value={formatCurrency(result.original - result.amount)} tone="success" />
                <Stat label="Delivery" value="7-day delivery" />
                <Stat label="Warranty" value="3-year warranty" />
              </div>
              <p className="text-xs text-muted">PayPal transaction: <span className="font-medium text-ink">{result.id}</span></p>

              <div className="w-full max-w-md rounded-2xl border border-subtle bg-surface-2 p-4 text-left">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">What happened</p>
                <ul className="flex flex-col gap-1.5 text-sm text-ink">
                  {[
                    "Requirements matched",
                    "Supplier negotiated",
                    "Policy checked",
                    "Approval received",
                    "Payment authorized",
                    "Order confirmed",
                    "Delivery verified",
                    "Payment captured",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-success" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => router.push(`/transactions/${result.id}`)}>View Transaction</Button>
                <Button variant="secondary" onClick={() => heyPaypal.open()}>Ask PayPal What's Next?</Button>
                <Button variant="ghost" onClick={reset}>Start a new request</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 text-xs font-medium text-faint">
        <Pencil size={11} /> {label}
      </label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, prefix, suffix }: { value: number; onChange: (v: number) => void; prefix?: string; suffix?: string }) {
  return (
    <div className="flex items-center rounded-xl border border-subtle bg-surface-2 px-3 py-2 text-sm">
      {prefix && <span className="mr-1 text-faint">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-transparent text-ink tabular focus:outline-none"
      />
      {suffix && <span className="ml-1 shrink-0 text-xs text-faint">{suffix}</span>}
    </div>
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-xl border border-subtle bg-surface-2 px-3 py-2 text-sm">
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-ink focus:outline-none" />
    </div>
  );
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "brand" | "success" }) {
  const toneText = { neutral: "text-ink", brand: "text-brand", success: "text-success" };
  return (
    <div className="rounded-xl border border-subtle bg-surface-2 p-3">
      <p className="text-xs text-faint">{label}</p>
      <p className={cn("mt-1 text-base font-semibold tabular", toneText[tone])}>{value}</p>
    </div>
  );
}

function AgentBadge({ label, tone }: { label: string; tone: "brand" | "neutral" }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold", tone === "brand" ? "bg-brand text-white" : "bg-surface-2 text-muted")}>
        {tone === "brand" ? "P" : "M"}
      </span>
      <span className="text-xs font-medium text-muted">{label}</span>
    </div>
  );
}
