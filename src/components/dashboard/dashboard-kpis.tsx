"use client";

import { TrendingUp, ArrowUpRight, ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardKPIsProps {
  totalAuthorized: number;
  totalSavings: number;
  pendingCount: number;
  pendingAmount: number;
  activeAgentsCount: number;
  totalTransactions: number;
}

export function DashboardKPIs({
  totalAuthorized,
  totalSavings,
  pendingCount,
  pendingAmount,
  activeAgentsCount,
  totalTransactions,
}: DashboardKPIsProps) {
  const savingsPct = totalAuthorized > 0 ? ((totalSavings / (totalAuthorized + totalSavings)) * 100).toFixed(1) : "14.2";

  const cards = [
    {
      title: "Authorized Capital",
      value: formatCurrency(totalAuthorized),
      delta: "+8.4%",
      deltaLabel: "vs prior period",
      isPositive: true,
      subtext: `${totalTransactions} secure PayPal transactions`,
      tone: "blue",
      badge: "In-Flight & Settled",
    },
    {
      title: "Realized AI Savings",
      value: formatCurrency(totalSavings),
      delta: `+${savingsPct}%`,
      deltaLabel: "negotiated reduction",
      isPositive: true,
      subtext: "Delivered via autonomous AI haggling",
      tone: "emerald",
      badge: "Cost Reduction",
    },
    {
      title: "Awaiting Approval",
      value: pendingCount > 0 ? `${pendingCount} Orders` : "All Clear",
      delta: pendingCount > 0 ? formatCurrency(pendingAmount) : "0 Pending",
      deltaLabel: "requires human review",
      isPositive: pendingCount === 0,
      subtext: pendingCount > 0 ? "Pending policy sign-off" : "100% compliance met",
      tone: pendingCount > 0 ? "amber" : "neutral",
      badge: "Governance",
    },
    {
      title: "Autonomous Fleet",
      value: `${activeAgentsCount} Agents`,
      delta: "94.6%",
      deltaLabel: "straight-through rate",
      isPositive: true,
      subtext: "Operating inside spending bounds",
      tone: "indigo",
      badge: "24/7 Operations",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Top Label & Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {card.title}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {card.badge}
            </span>
          </div>

          {/* Primary Financial Metric (Dark navy / charcoal typography) */}
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-slate-50 sm:text-[26px]">
              {card.value}
            </p>
          </div>

          {/* Delta and indicator */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                card.tone === "amber"
                  ? "text-amber-600 dark:text-amber-400"
                  : card.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <TrendingUp size={13} className="shrink-0" />
              {card.delta}
            </span>
            <span className="text-slate-500 dark:text-slate-400 truncate">{card.deltaLabel}</span>
          </div>

          {/* Subtext divider line */}
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
