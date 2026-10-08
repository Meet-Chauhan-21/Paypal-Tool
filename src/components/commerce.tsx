"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Circle, Info, Star, Truck, ShieldCheck } from "lucide-react";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge, Card, RiskBadge } from "@/components/ui";
import type { RiskLevel } from "@/lib/types";

export interface SupplierOption {
  name: string;
  product: string;
  unitPrice: number;
  units: number;
  deliveryDays: number;
  warrantyYears: number;
  rating: number;
  score: number;
  risk: RiskLevel;
  recommended?: boolean;
}

export function SupplierCard({ option }: { option: SupplierOption }) {
  const [showWhy, setShowWhy] = useState(false);
  const total = option.unitPrice * option.units;
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-4 transition-all",
        option.recommended && "border-brand ring-1 ring-brand",
      )}
    >
      {option.recommended && (
        <span className="absolute -top-3 left-5 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold text-white">
          AI Recommended
        </span>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-semibold text-ink">{option.name}</p>
          <p className="text-sm text-muted">{option.product}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-warning">
          <Star size={13} className="fill-warning text-warning" /> {option.rating}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-faint">Unit price</p>
          <p className="font-semibold tabular text-ink">{formatCurrency(option.unitPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-faint">{option.units} units total</p>
          <p className="font-semibold tabular text-ink">{formatCurrency(total)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck size={14} className="text-faint" />
          <span>{option.deliveryDays}-day delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-faint" />
          <span>{option.warrantyYears}-year warranty</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-soft pt-3">
        <RiskBadge risk={option.risk} />
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-faint">AI score</span>
          <span className="text-sm font-semibold text-brand tabular">{option.score}/100</span>
        </div>
      </div>

      <button
        onClick={() => setShowWhy((v) => !v)}
        className="flex items-center gap-1.5 self-start text-xs font-medium text-brand hover:underline"
      >
        <Info size={13} /> Why this score?
      </button>
      {showWhy && (
        <p className="rounded-xl bg-surface-2 p-3 text-xs leading-relaxed text-muted">
          Scored on price competitiveness, delivery reliability and warranty match against your
          requirements. {option.recommended ? "This is the strongest overall match." : "Meets most requirements but scores lower on price or delivery."}
        </p>
      )}
    </Card>
  );
}

export function ComparisonTable({ options }: { options: SupplierOption[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-subtle bg-surface shadow-soft">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-subtle text-xs uppercase tracking-wide text-faint">
            <th className="px-4 py-3 font-medium">Supplier</th>
            <th className="px-4 py-3 font-medium">Unit price</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Delivery</th>
            <th className="px-4 py-3 font-medium">Warranty</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Risk</th>
            <th className="px-4 py-3 font-medium">AI score</th>
          </tr>
        </thead>
        <tbody>
          {options.map((o) => (
            <tr key={o.name} className={cn("border-b border-soft last:border-0", o.recommended && "bg-brand-soft/40")}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{o.name}</p>
                <p className="text-xs text-muted">{o.product}</p>
              </td>
              <td className="px-4 py-3 tabular">{formatCurrency(o.unitPrice)}</td>
              <td className="px-4 py-3 font-semibold tabular">{formatCurrency(o.unitPrice * o.units)}</td>
              <td className="px-4 py-3">{o.deliveryDays} days</td>
              <td className="px-4 py-3">{o.warrantyYears} years</td>
              <td className="px-4 py-3">{o.rating}</td>
              <td className="px-4 py-3">
                <RiskBadge risk={o.risk} />
              </td>
              <td className="px-4 py-3">
                <span className={cn("font-semibold tabular", o.recommended ? "text-brand" : "text-ink")}>{o.score}/100</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NegotiationThread({
  messages,
  animated = false,
}: {
  messages: { from: "buyer" | "supplier"; text: string }[];
  animated?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((m, idx) => (
        <motion.div
          key={idx}
          initial={animated ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animated ? idx * 0.05 : 0 }}
          className={cn("flex", m.from === "buyer" ? "justify-start" : "justify-end")}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
              m.from === "buyer" ? "rounded-tl-sm bg-brand-soft text-brand-deep" : "rounded-tr-sm border border-subtle bg-surface text-ink",
            )}
          >
            <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide opacity-60">
              {m.from === "buyer" ? "Your AI Agent" : "Merchant Agent"}
            </p>
            {m.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export interface TimelineEvent {
  label: string;
  actor: string;
  note?: string | null;
  status?: "complete" | "active" | "pending";
  createdAt?: string;
}

export function TransactionTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative ml-3 flex flex-col gap-6 border-l border-subtle pl-6">
      {events.map((e, idx) => {
        const status = e.status ?? "complete";
        return (
          <li key={idx} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2",
                status === "complete" && "border-success bg-success-soft",
                status === "active" && "border-brand bg-brand-soft animate-pulse",
                status === "pending" && "border-border bg-surface",
              )}
            >
              {status === "complete" && <CheckCircle2 size={11} className="text-success" />}
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="text-[13.5px] font-semibold text-ink">{e.label}</p>
              {e.createdAt && <p className="text-xs text-faint">{formatDateTime(e.createdAt)}</p>}
            </div>
            <p className="text-xs text-muted">
              <span className="font-medium text-faint">{e.actor}</span>
              {e.note ? ` — ${e.note}` : ""}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function VerificationChecklist({
  items,
}: {
  items: { label: string; passed: boolean | null }[];
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2.5 text-sm">
          {item.passed === true && <CheckCircle2 size={17} className="shrink-0 text-success" />}
          {item.passed === false && <XCircle size={17} className="shrink-0 text-danger" />}
          {item.passed === null && <Circle size={17} className="shrink-0 text-faint" />}
          <span className={cn(item.passed === false ? "text-ink" : item.passed === null ? "text-muted" : "text-ink")}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AutonomyIndicator({ level }: { level: "auto" | "approval" | "blocked" }) {
  const map = {
    auto: { tone: "success" as const, label: "Agent can act", dot: "bg-success" },
    approval: { tone: "warning" as const, label: "Your approval required", dot: "bg-warning" },
    blocked: { tone: "danger" as const, label: "Agent blocked", dot: "bg-danger" },
  };
  const m = map[level];
  return (
    <Badge tone={m.tone}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </Badge>
  );
}
